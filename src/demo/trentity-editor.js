/** Import other modules */
import { generateEntity } from '/generate-entity.js';

console.info(
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
  document.addEventListener('copy', function copyHandler (event){
    event.clipboardData.setData('text/plain', str);
    event.preventDefault();
    document.removeEventListener('copy', copyHandler, true);
  }, true);
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

async function tableGenerator(generatedEntityList) {
  try {
    if (typeof generatedEntityList !== 'string' || !generatedEntityList.length) {
      throw new TypeError('generatedEntityList is missing');
    }

    const tHead = `<tr><th>Reference value</th><th>Total synonyms</th></tr>`;
    const allSynonymsCountsInRows = generatedEntityList
      .split(/\r?\n/)
      .map((n) => {
        const [refVal, ...synonyms] = n.split(',');
        const synonymsLen = synonyms.length;

        return `<tr class="${
          synonymsLen > 100 ? 'error' : ''
        }"><td>${
          refVal.replace(/"/gi, '')
        }</td><td>${
          synonymsLen
        }</td></tr>`;
      })
      .join('');

    return `<table><thead>${tHead}</thead><tbody>${allSynonymsCountsInRows}</tbody></table>`;
  } catch (e) {
    throw e;
  }
}

function getIcon(iconName) {
  const svgWrapper = svg => `<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" class="style-scope iron-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">${svg}</svg>`;
  let selectedIcon = '';

  switch (iconName) {
    case 'check-circle': {
      selectedIcon = '<g id="check-circle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></g>';
      break;
    }
    case 'error': {
      selectedIcon = '<g id="error"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></g>';
      break;
    }
    default:
      return '';
  }

  return svgWrapper(selectedIcon);
}

/** NOTE: Page setup */
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
    const checkerStatus = document.querySelector('.checker-status');
    const checkerReport = document.querySelector('.checker-report');
    const synonymsCounter = document.querySelector('.synonyms-counter');
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

        /** NOTE: Display the status (total synonyms) of each reference value */
        const outOfBoundEntities = generatedEntityList
          .split(/\r?\n/)
          .reduce((p, n) => {
            const [refVal, ...synonyms] = n.split(',');
            const synonymsLen = synonyms.length;

            return {
              total: (p.total || 0) + 1,
              outOfBound: synonymsLen > 100 ? (p.outOfBound || 0) + 1 : p.outOfBound,
            };
          }, {
            outOfBound: 0,
            total: 0,
          });

        checkerStatus.innerHTML = `<div class="${
          [
            'iron-icon',
            outOfBoundEntities.outOfBound > 0 ? 'error' : ''
          ].join(' ').trim()
        }">${
          getIcon(
            outOfBoundEntities.outOfBound > 0
              ? 'error'
              : 'check-circle'
          )
        }</div><span class="${
          outOfBoundEntities.outOfBound > 0 ? 'error' : ''
        }">${
          outOfBoundEntities.total - outOfBoundEntities.outOfBound
        }/ ${
          outOfBoundEntities.total
        }</span>`;
        checkerReport.innerHTML = await tableGenerator(generatedEntityList);

        window.localStorage.setItem(`${userKey}::synonyms`, synonymsValue);
        window.localStorage.setItem(`${userKey}::replacers`, replacersValue);

        toggleToast('Result generated!', true);

        /** NOTE: Show synonyms checker */
        synonymsCounter.removeAttribute('hidden');
      } catch (e) {
        console.debug(e);

        toggleToast(`${e.message}`, true, 5e3);
      }
    }, 250));

    /** NOTE: Setup clipboard */
    const isCopySupported = document.execCommand('copy');
    if (isCopySupported) {
      const copyBtn = document.querySelector('.copy-btn');

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
    }

    /** NOTE: Setup collapse */
    const collapseBtn = document.querySelector('.collapse-btn');

    collapseBtn.addEventListener('click', debounce((ev) => {
      if (collapseBtn.classList.contains('pressed')) {
        collapseBtn.classList.remove('pressed');
      } else {
        collapseBtn.classList.add('pressed');
      }
    }));
  });

});
