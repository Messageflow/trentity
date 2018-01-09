// @ts-check

/** Import typings */
import { TemplateResult } from '../../node_modules/lit-html/lit-html.js';
import { AppConfig } from './app-config.js';

/** Import project dependencies */
import { html, render } from '../../node_modules/lit-html/lit-html.js';

/** Import other modules */
import appConfig from './app-config.js';
import './app-toolbar.js';
import './external-link.js';

export class TrentityApp extends HTMLElement {
  static get is() {
    return 'trentity-app';
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  public connectedCallback() {
    render(this.render(), this.shadowRoot);

    console.log('@ app-ready');

    window.requestAnimationFrame(() => window.dispatchEvent(new CustomEvent('app-ready')));
  }

  public render(): TemplateResult {
    const {
      appName,
    } = appConfig || {} as AppConfig;
    const linkToLitHtml = 'https://github.com/PolymerLabs/lit-html';

    return html`
      <style>
        :host {
          display: block;
          box-sizing: border-box;
        }

        .app-header {
          display: grid;

          box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
                      0 1px 10px 0 rgba(0, 0, 0, 0.12),
                      0 2px 4px -1px rgba(0, 0, 0, 0.4);
        }

        main {
          width: 100%;
          height: 100%;
        }

        ::slotted(*) {
          width: 100%;
          height: 100%;
        }

        footer {
          display: grid;
          grid-template-rows: 64px;

          padding: 0 24px;
          background-color: #333;
          color: #fff;
        }
        .footer-notes {
          align-self: center;
          justify-self: center;
        }
      </style>

      <header class="app-header">
        <app-toolbar>
          <h1>${appName}</h1>
        </app-toolbar>
      </header>

      <main>
        <slot></slot>
      </main>

      <footer>
        <div class="footer-notes">
          Built with <external-link
            href="${linkToLitHtml}">lit-html</external-link> &amp; ❤️
        </div>
      </footer>
    `;
  }
}

customElements.define(TrentityApp.is, TrentityApp);
