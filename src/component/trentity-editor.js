/** Import other modules */
import { generateEntity } from '../generate-entity.js';

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
    throw new Error('userKey not found');
  }

  editor.onKeyUp(() => {
    window.localStorage.setItem(`${userKey}::${editorType.toLowerCase()}`, editor.getValue({
      lineEnding: 'LF',
      preserveBOM: true,
    }));
  });
  if (/^synonyms$/i.test(editorType)) {
    editor.setValue(window.localStorage.getItem(formKey.synonyms(userKey)));
  } else {
    editor.setValue(window.localStorage.getItem(formKey.replacers(userKey)));
  }
}

function copyToClipboard(str) {
  const listener = e => {
    e.clipboardData.setData('text/plain', str);
    e.preventDefault();
  };

  document.addEventListener('copy', listener);
  document.execCommand('copy');
  document.removeEventListener('copy', listener);
};

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
    const monacoSynonymsEditor = monaco.editor.create(synonymsEditor, {
      ...editorConfig,
      value: '[\n]'
    });
    const monacoReplacersEditor = monaco.editor.create(replacersEditor, {
      ...editorConfig,
      value: '{\n}',
    });

    /** NOTE: Setup editors */
    setupEditor(monacoSynonymsEditor, 'synonyms');
    setupEditor(monacoReplacersEditor, 'replacers');

    /** NOTE: Update editors on window's resize */
    /** TODO: To use ResizeObserver if available */
    window.onresize = function () {
      console.log('window.onresize');
      if (monacoSynonymsEditor && monacoReplacersEditor) {
        monacoSynonymsEditor.layout();
        monacoReplacersEditor.layout();
      }
    };

    /** NOTE: Setup .generate-btn click event handler */
    const generateBtn = document.querySelector('.generate-btn');
    const entityResultTextarea = document.querySelector('#entity-result');

    generateBtn.addEventListener('click', async (ev) => {
      if (ev.target.isEqualNode(ev.currentTarget)) {
        const userKey = getUserKey();

        if (userKey == null) {
          throw new Error('userKey not found');
        }

        const parsedSynonyms = JSON.parse(window.localStorage.getItem(formKey.synonyms(userKey)));
        const parsedReplacers = JSON.parse(window.localStorage.getItem(formKey.replacers(userKey)));
        const generatedEntityList = await generateEntity(parsedSynonyms, parsedReplacers);

        entityResultTextarea.value = generatedEntityList;
      }
    });

    /** NOTE: Setup clipboard */
    const copyBtn = document.querySelector('.copy-btn');
    const appToast = document.querySelector('.app-toast');

    /** TODO: To add debouncer */
    copyBtn.addEventListener('click', (ev) => {
      copyToClipboard(`${entityResultTextarea.value}`);
      appToast.textContent = 'Copied to clipboard!';

      if (appToast.classList.contains('visible')) {
        appToast.classList.remove('visible');
      }

      window.requestAnimationFrame(() => {
        appToast.classList.add('visible');

        setTimeout(() => {
          window.requestAnimationFrame(() => appToast.classList.remove('visible'));
        }, 15e2);
      });
    });
    entityResultTextarea.addEventListener('pointerover', () => {
      copyBtn.classList.add('visible');
    });
    entityResultTextarea.addEventListener('pointerout', () => {
      copyBtn.classList.remove('visible');
    });
  });
});
