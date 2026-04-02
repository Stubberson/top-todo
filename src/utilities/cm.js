import {EditorView, minimalSetup} from "codemirror"
import {languages} from "@codemirror/language-data"
import {markdown} from "@codemirror/lang-markdown"

// REMOVE:
// NEED TO CREATE NEW EDITORS FOR EACH PROJECT/TODAY

export let editor = new EditorView({
    extensions: [
        minimalSetup,
        markdown({codeLanguages: languages}),
        EditorView.lineWrapping
  ]
})