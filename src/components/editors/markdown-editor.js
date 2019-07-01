import { LitElement, html, css } from "lit-element";

import { SharedStyles } from "../shared-styles.js";
import { SimpleMDEStyles } from "./simplemde-styles.js";

class MarkdownEditor extends (LitElement) {
	static get properties() {
		return {
			text: String,
			simplemde: Object
		}
	}

	static get styles() {
		return [
			SharedStyles,
			SimpleMDEStyles,
			css`
				:host {
					display: block;
				}
			`
		];
	}

	constructor() {
		super();
	}

	render() {
		return html`
			<textarea class="text"></textarea>
		`;
	}

	firstUpdated() {
		let textarea = this.shadowRoot.querySelector(".text");
		this.simplemde = new SimpleMDE({ element: textarea, initialValue: this.text });
		this.simplemde.codemirror.on("change", function() {
			this._onChange(this.simplemde.value());
		}.bind(this));
	}

	updated() {
		if (this.text === undefined) {
			this.simplemde.value("");
		}
		else if (this.simplemde.value() !== this.text) {
			this.simplemde.value(this.text);
		}
	}

	_onChange(text) {
    this.dispatchEvent(new CustomEvent("text-changed", {
			detail: {
				text
			}
		}));
  }
}

window.customElements.define('markdown-editor', MarkdownEditor);
