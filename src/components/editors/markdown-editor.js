import { LitElement, html, css } from "lit-element";

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';

import editor, { isCollapsedSelector } from "../../reducers/editor.js";
store.addReducers({
	editor
});

import { SharedStyles } from "../shared-styles.js";
import { SimpleMDEStyles } from "./simplemde-styles.js";
import "simplemde/dist/simplemde.min.js";

class MarkdownEditor extends connect(store)(LitElement) {
	static get properties() {
		return {
			text: String,
			simplemde: Object,
			isCollapsed: Boolean
		}
	}

	static get styles() {
		return [
			SharedStyles,
			SimpleMDEStyles,
			css`
				:host {
					display: block;
					overflow-y: hidden;
					transition: max-height .25s;
				}
			`
		];
	}

	constructor() {
		super();
	}

	render() {
		return html`
			<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css">
			<style>
				:host {
					${this.isCollapsed ?
						`
							max-height: 0;
						` :
						`
							max-height: 1000rem;
						`
					}
				}

				@media (min-width: 640px) {
					:host {
						max-height: 1000rem;
					}
				}
			</style>
			<textarea
				class="text"></textarea>
		`;
	}

	firstUpdated() {
		let textarea = this.shadowRoot.querySelector(".text");
		this.simplemde = new SimpleMDE({ element: textarea, initialValue: this.text });
		this.simplemde.codemirror.on("change", function() {
			this._onChange(this.simplemde.value());
		}.bind(this));
	}

	stateChanged(state) {
		this.isCollapsed = isCollapsedSelector(state);
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
