import { ExtensionContext, extensions, diagnosticManager, workspace, WorkspaceConfiguration } from 'coc.nvim'
import { getTsLintFixAllCodeAction } from './fixAll'

const typeScriptExtensionId = 'coc-tsserver'
const pluginId = 'typescript-tslint-plugin'
const configurationSection = 'tslint'

interface SynchronizedConfiguration {
  alwaysShowRuleFailuresAsWarnings?: boolean
  ignoreDefinitionFiles?: boolean
  configFile?: string
  suppressWhileTypeErrorsPresent?: boolean
  jsEnable?: boolean
  exclude?: string | string[]
}

export async function activate(context: ExtensionContext): Promise<void> {
  const { subscriptions } = context
  const config = workspace.getConfiguration(configurationSection)
  let autoFixOnSave = config.get<boolean>('autoFixOnSave', false)

  workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration(configurationSection)) {
      const config = workspace.getConfiguration(configurationSection)
      autoFixOnSave = config.get<boolean>('autoFixOnSave', false)
      let api = getApi()
      synchronizeConfiguration(api)
    }
  }, undefined, subscriptions)
  extensions.onDidActiveExtension(extension => {
    if (extension.id == typeScriptExtensionId) {
      synchronizeConfiguration(extension.exports)
    }
  }, null, subscriptions)

  let disposable = workspace.onWillSaveUntil(async ev => {
    if (!autoFixOnSave) return
    let thenable = async () => {
      let { document } = ev
      let diagnostics = diagnosticManager.getDiagnostics(document.uri)
      if (!diagnostics || diagnostics.length == 0) return
      let action = await getTsLintFixAllCodeAction(document, diagnostics)
      if (action && action.edit) await workspace.applyEdit(action.edit)
    }
    ev.waitUntil(thenable())
  }, null, 'tslint')
  subscriptions.push(disposable)
}

function getApi(): any {
  const extension = extensions.all.find(o => o.id == typeScriptExtensionId)
  if (!extensions) return
  return extension.exports
}

function synchronizeConfiguration(api: any): void {
  if (!api) return
  api.configurePlugin(pluginId, getConfiguration())
}

function getConfiguration(): SynchronizedConfiguration {
  const config = workspace.getConfiguration(configurationSection)
  const outConfig: SynchronizedConfiguration = {}
  withConfigValue(config, outConfig, 'alwaysShowRuleFailuresAsWarnings')
  withConfigValue(config, outConfig, 'ignoreDefinitionFiles')
  withConfigValue(config, outConfig, 'suppressWhileTypeErrorsPresent')
  withConfigValue(config, outConfig, 'jsEnable')
  withConfigValue(config, outConfig, 'configFile')
  withConfigValue(config, outConfig, 'exclude')
  return outConfig
}

function withConfigValue<C, K extends Extract<keyof C, string>>(
  config: WorkspaceConfiguration,
  outConfig: C,
  key: K,
): void {
  const configSetting = config.inspect<C[K]>(key)
  if (!configSetting) {
    return
  }
  const value = config.get<any>(key, undefined)
  if (typeof value !== 'undefined') {
    outConfig[key] = value
  }
}
