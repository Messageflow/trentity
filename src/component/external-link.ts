// @ts-check

/** Import typings */
import { TemplateResult } from '../../node_modules/lit-html/lit-html.js';

/** Import project dependencies */
import { html, render } from '../../node_modules/lit-html/lit-html.js';

export class ExternalLink extends HTMLElement {
  public href = '';

  static get is() {
    return 'external-link';
  }

  static get observedAttributes() {
    return [
      'href',
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  public attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    switch (attr) {
      case 'href': {
        this.href = newValue;
        break;
      }
      default:
        throw new Error(`Unknown attribute (${attr})`);
    }

    render(this.render(), this.shadowRoot);
  }

  public render(): TemplateResult {
    return html`
      <style>
        :host {
          display: inline-block;
          box-sizing: border-box;
        }

        a {
          color: var(--external-link-color, #1e88e5);
          font-size: 16px;
          font-weight: 400;
          text-decoration: none;
        }
        a:hover,
        a:focus {
          text-decoration: underline;
        }
      </style>

      <a target="_blank" rel="noopener" href="${this.href}">
        <slot></slot>
      </a>
    `;
  }
}

customElements.define(ExternalLink.is, ExternalLink);
