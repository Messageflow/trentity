/** Import other modules */
import { generateEntity } from '/generate-entity.js';

console.log(
  `✨You\'re now using the %cTrentity %c🔖%s 🔥🔥🔥`,
  'font-size: 20px; color: #0070fb;',
  'font-size: 16px; color: #fb00b7;',
  __APP_VERSION__
);

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
  document.addEventListener('copy', function copyHandler(ev) {
    ev.preventDefault();
    ev.clipboardData.setData('text/plain', str);

    document.removeEventListener('copy', copyHandler);
  });
  document.execCommand('copy');
}

function getValueFromEditorOrLocalStorage(userKey, editor) {
  if (typeof userKey !== 'string' || !userKey.length) {
    throw new TypeError('userKey is missing or is not a string');
  }

  if (editor == null) {
    throw new TypeError('editor is missing');
  }

  const tryFromLocalStorage = window.localStorage.getItem(userKey);

  if (tryFromLocalStorage == null) {
    const tryFromEditor = editor.getValue({
      lineEnding: 'LF',
      preserveBOM: true,
    });

    return tryFromEditor;
  }

  return tryFromLocalStorage;
}

function tryJSONParse(content, whichEditor) {
  if (typeof content !== 'string') {
    throw new TypeError('content is not a string');
  }

  if (typeof whichEditor !== 'string') {
    throw new TypeError('whichEditor is not a string');
  }

  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error(`Invalid JSON found in ${whichEditor}`);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  require(['vs/editor/editor.main'], function () {
    const editorConfig = {
      value: '',
      language: 'json',

      autoClosingBrackets: true,
      autoIndent: true,
      automaticLayout: false,
      codeLens: true,
      folding: true,
      fontLigatures: true,
      formatOnPaste: true,
      lineNumbers: 'on',
      minimap: {
        enabled: false,
      },
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
      scrollBeyondLstLine: false,
      tabSize: 2,
      wordWrap: 'wordWrapColumn',
      wordWrapColumn: 100,

      theme: 'vs-dark',
    };
    const synonymsEditor = document.querySelector('.editor--synonyms > .editor-container');
    const replacersEditor = document.querySelector('.editor--replacers > .editor-container');
    const monacoSynonymsEditor = monaco.editor.create(synonymsEditor, {
      ...editorConfig,
      value: [
        '[',
        '    [',
        '        "haha",',
        '        [',
        '            "lol",',
        '            "wow"',
        '        ]',
        '    ]',
        ']',
      ].join('\n'),
    });
    const monacoReplacersEditor = monaco.editor.create(replacersEditor, {
      ...editorConfig,
      value: [
        '{',
        '    "lol": [',
        '        "loool",',
        '        "wahaha"',
        '    ]',
        '}',
      ].join('\n'),
    });

    /** NOTE: Setup editors */
    setupEditor(monacoSynonymsEditor, 'synonyms');
    setupEditor(monacoReplacersEditor, 'replacers');

    /** NOTE: Update editors on window's resize */
    /** TODO: To use ResizeObserver if available */
    // const layoutEditors = (entries, editor) => {
    //   if (editor == null) {
    //     throw new TypeError('editor is missing');
    //   }

    //   editor.layout();
    // };

    window.onresize = () => {
      monacoSynonymsEditor.layout();
      monacoReplacersEditor.layout();

      // const synonymsEditorRect = synonymsEditor.getBoundingClientRect();
      // const replacersEditorRect = replacersEditor.getBoundingClientRect();

      // monacoSynonymsEditor.layout({
      //   width: synonymsEditorRect.width,
      //   height: 800,
      // });
      // monacoReplacersEditor.layout({
      //   width: replacersEditorRect.width,
      //   height: 800,
      // });
    };

    /** NOTE: Setup .generate-btn click event handler */
    const generateBtn = document.querySelector('.generate-btn');
    const entityResultTextarea = document.querySelector('#entity-result');
    const appToast = document.querySelector('.app-toast');
    const totalSynonyms = document.querySelector('.total-synonyms');
    let toastTimer = null;

    function debounce(fn, delay) {
      var timer = null;
      return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(context, args);
        }, delay);
      };
    }

    function toggleToast(toastMessage, visible = false, timeout = 15e2) {
      appToast.textContent = toastMessage;

      if (appToast.classList.contains('visible')) {
        appToast.classList.remove('visible');

        if (toastTimer != null) {
          clearTimeout(toastTimer);
        }
      }

      appToast.classList.add('visible');

      toastTimer = setTimeout(() => {
        window.requestAnimationFrame(() => appToast.classList.remove('visible'));
      }, timeout);
    }

    generateBtn.addEventListener('click', debounce(async (ev) => {
      try {
        const userKey = getUserKey();

        if (userKey == null) {
          throw new Error('userKey not found');
        }

        const synonymsValue = getValueFromEditorOrLocalStorage(formKey.synonyms(userKey), monacoSynonymsEditor);
        const replacersValue = getValueFromEditorOrLocalStorage(formKey.replacers(userKey), monacoReplacersEditor);
        const parsedSynonyms = tryJSONParse(synonymsValue, 'Synonyms');
        const parsedReplacers = tryJSONParse(replacersValue, 'Replacers');
        const generatedEntityList = await generateEntity(parsedSynonyms, parsedReplacers);

        entityResultTextarea.value = generatedEntityList;

        /** FIXME: More robust synonyms counter for each reference value */
        totalSynonyms.textContent = `${generatedEntityList.split(',').slice(1).length}`;

        window.localStorage.setItem(`${userKey}::synonyms`, synonymsValue);
        window.localStorage.setItem(`${userKey}::replacers`, replacersValue);

        toggleToast('Result generated!', true);
      } catch (e) {
        console.debug(e);

        toggleToast(`${e.message}`, true, 5e3);
      }
    }, 250));

    /** NOTE: Setup clipboard */
    const copyBtn = document.querySelector('.copy-btn');

    /** TODO: To add debouncer */
    copyBtn.addEventListener('click', debounce((ev) => {
      copyToClipboard(`${entityResultTextarea.value}`);

      toggleToast('Copied to clipboard!', true);
    }, 250));
    entityResultTextarea.addEventListener('pointerover', () => {
      copyBtn.classList.add('visible');
    });
    entityResultTextarea.addEventListener('pointerout', () => {
      copyBtn.classList.remove('visible');
    });
  });

});
