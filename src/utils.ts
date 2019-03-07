import { workspace } from 'coc.nvim'
import { TextDocument } from 'vscode-languageserver-protocol'

export function isTypeScriptDocument(document: TextDocument): boolean {
  return document.languageId === 'typescript' || document.languageId === 'typescriptreact'
}

export function isJavaScriptDocument(languageId: string): boolean {
  return languageId === 'javascript' || languageId === 'javascriptreact'
}

export function isEnabled(document: TextDocument): boolean {
  let { languageId } = document
  if (isJavaScriptDocument(languageId)) {
    return isEnabledForJavaScriptDocument(document)
  }
  return isTypeScriptDocument(document)
}

export function isEnabledForJavaScriptDocument(document: TextDocument): boolean {
  let isJsEnable = workspace.getConfiguration('tslint', document.uri).get('jsEnable', true)
  if (isJsEnable && isJavaScriptDocument(document.languageId)) {
    return true
  }
  return false
}
