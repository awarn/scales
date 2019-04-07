import { LitElement, html } from "lit-element";

class MapNote extends LitElement {
	static get properties() {
    return {
      notes: { type: Array },
			x: { type: Number },
			y: { type: Number },
			id: { type: String },
			title: { type: String },
			text: { type: String }
    }
  }

	constructor() {
		super();
	}

	render() {
		return html`
			<div>
				<h2>${this.title}</h2>
				<div>${this.text}</div>
			</div>
		`;
	}
}

window.customElements.define('map-note', MapNote);
