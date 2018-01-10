const formKey = {
  synonyms: ukey => `${ukey}::synonyms`,
  replacers: ukey => `${ukey}::replacers`,
};

function getUserKey() {
  const userKey = window.localStorage.getItem('user-key');

  if (userKey == null) {
    const newUserKey = `${Math.random().toString(36).slice(-7)}:${+new Date()}`;

    window.localStorage.setItem('user-key', newUserKey);

    return newUserKey;
  } else {
    return userKey;
  }
}

function setupEditor(editor, editorType) {
  if (editor == null) {
    throw new TypeError('editor is missing');
  }

  if (editorType == null) {
    throw new TypeError('editorType is missing');
  } else if (!/(synonyms|replacers)/i.test(editorType)) {
    throw new Error('editorType can ONLY be either \'synonyms\' or \'replacers\'');
  }

  const userKey = getUserKey();

  if (userKey == null) {
    throw new Error('Unable to store user key');
  }

  editor.onKeyUp((ev) => {
    window.localStorage.setItem(`${userKey}::${editorType.toLowerCase()}`, ev.target.value);
  });

  if (/^synonyms$/i.test(editorType)) {
    editor.setValue(window.localStorage.getItem(formKey.synonyms(userKey)));
  } else {
    editor.setValue(window.localStorage.getItem(formKey.replacers(userKey)));
  }
}

window.addEventListener('app-ready', () => {
  require(['vs/editor/editor.main'], function () {
    const editorConfig = {
      value: '',
      language: 'json',

      autoClosingBrackets: true,
        codeLens: true,
        folding: true,
        fontLigatures: true,
        formatOnPaste: true,
        lineNumbers: 'on',
        minimap: false,
        parameterHints: true,
        quickSuggestions: {
            other: true,
            comments: true,
            strings: true,
        },
        quickSuggestionsDelay: 10,
        renderWhitespace: 'all',
        renderIndentGuides: true,
        renderControlCharacters: true,
        showFoldingControls: 'always',
        tabSize: 2,
        wordWrap: 'wordWrapColumn',
        wordWrapColumn: 100,

        theme: 'vs-dark',
    };
    const synonymsEditor = document.querySelector('.editor--synonyms > .editor-container');
    const replacersEditor = document.querySelector('.editor--replacers > .editor-container');
    const monacoSynonymsEditor = monaco.editor.create(synonymsEditor, editorConfig);
    const monacoReplacersEditor = monaco.editor.create(replacersEditor, editorConfig);

    /** NOTE: Setup editors */
    setupEditor(monacoSynonymsEditor, 'synonyms');
    setupEditor(monacoReplacersEditor, 'replacers');

    /** NOTE: Update editors on window's resize */
    window.onresize = function () {
      console.log('window.onresize');
      if (monacoSynonymsEditor && monacoReplacersEditor) {
        monacoSynonymsEditor.layout();
        monacoReplacersEditor.layout();
      }
    };
  });
});
