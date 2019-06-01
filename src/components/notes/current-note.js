import { LitElement, html, css } from "lit-element";

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';

import map, { currentNoteSelector } from "../../reducers/map";
store.addReducers({
	map
});

import { SharedStyles } from "../shared-styles.js";

class CurrentNote extends connect(store)(LitElement) {
	static get properties() {
		return {
			note: Object
		}
	}

	static get styles() {
		return [
			SharedStyles,
			css`
				:host {
					position: absolute;
					z-index: 1;
					top: 0;
					right: 0;
					height: 4rem;
					width: 100%;
				}
				:host > div {
					display: flex;
					flex: 1 0 auto;
					padding: .25rem .5rem;
					white-space: nowrap;
					background: #fff;
					box-shadow: 0 0 .0625rem rgba(0,0,0,1);
					flex-flow: column;
				}
			`
		];
	}

	constructor() {
		super();
	}

	stateChanged(state) {
		this.note = currentNoteSelector(state);
	}

	render() {
		return html`
			<div>
				<div>${this.note.title}</div>
				<div>${this.note.text}</div>
			</div>
		`;
	}
}

window.customElements.define('current-note', CurrentNote);
