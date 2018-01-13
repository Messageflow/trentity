// @ts-check

/** Import typings */
import { TemplateResult } from '../../node_modules/lit-html/lit-html.js';

/** Import project dependencies */
import { html, render } from '../../node_modules/lit-html/lit-html.js';

export class AppToolbar extends HTMLElement {
  public static get is() {
    return 'app-toolbar';
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  public connectedCallback() {
    render(this.render(), this.shadowRoot);
  }

  public render(): TemplateResult {
    return html`
      <style>
        :host {
          display: grid;
          align-content: center;
          box-sizing: border-box;

          width: 100%;
          padding: 0 var(--app-toolbar-padding, 24px);
          height: var(--app-toolbar-height, 64px);

          background-color: var(--app-toolbar-background-color, #0070fb);
          color: var(--app-toolbar-color, #fff);
        }

        ::slotted(*) {
          font-size: 24px;
          font-weight: 500;
        }
      </style>

      <slot></slot>
    `;
  }
}

customElements.define(AppToolbar.is, AppToolbar);
