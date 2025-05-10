import * as monaco from 'monaco-editor'

const Editors = new Map<string, monaco.editor.IStandaloneCodeEditor>()

export function createEditor(name: string, dom: HTMLDivElement, code: string) {
  const uri = getModelUri(name)
  const model =
    monaco.editor.getModel(uri) ??
    monaco.editor.createModel(code, 'typescript', uri)
  const editor = monaco.editor.create(dom, { model })

  Editors.set(name, editor)
  return editor
}

export function getModel(name: string) {
  return monaco.editor.getModel(getModelUri(name))
}

export function getEditor(name: string) {
  return Editors.get(name)
}

function getModelUri(name: string) {
  return monaco.Uri.parse(`inmemory://model/${name}`)
}
