import { isTypeScriptDocument, isEnabledForJavaScriptDocument } from './utils'
import { Range, CodeAction, TextDocument, Position, CodeActionContext, CancellationToken, CodeActionKind, Diagnostic } from 'vscode-languageserver-protocol'
import { CodeActionProvider, languages } from 'coc.nvim'

export async function getTsLintFixAllCodeAction(document: TextDocument, diagnostics: ReadonlyArray<Diagnostic>): Promise<CodeAction | undefined> {
  let end: Position = document.positionAt(document.getText().length)
  let range = Range.create(0, 0, end.line, end.character)
  const map = await languages.getCodeActions(document, range, { diagnostics: diagnostics.slice() })
  const codeActions: CodeAction[] = []
  for (let item of map.values()) {
    codeActions.push(...item)
  }
  if (codeActions.length) {
    return codeActions.find(action => action.title === 'Fix all auto-fixable tslint failures')
  }
  return undefined
}

export class FixAllProvider implements CodeActionProvider {
  public async provideCodeActions(
    document: TextDocument,
    _range: Range,
    context: CodeActionContext,
    _token: CancellationToken
  ): Promise<CodeAction[]> {

    if (!isTypeScriptDocument(document) && !isEnabledForJavaScriptDocument(document)) {
      return []
    }

    const fixAllAction = await getTsLintFixAllCodeAction(document, context.diagnostics)
    if (!fixAllAction) {
      return []
    }

    return [{
      ...fixAllAction,
      title: 'Fix All TSLint',
      kind: CodeActionKind.Source,
    }]
  }
}
