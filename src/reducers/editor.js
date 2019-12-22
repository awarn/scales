import {
	TOGGLE_EDITOR_COLLAPSE,
} from '../actions/editor.js';
import { createSelector } from 'reselect';

const INITIAL_STATE = {
	isCollapsed: true
}

const editor = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case TOGGLE_EDITOR_COLLAPSE:
			const toggleValue = action.toggleValue;
			return {
				...state,
				isCollapsed: toggleValue
			}
		default:
			return state;
	}
}

export default editor;

export const isCollapsedSelector = state => state.editor.isCollapsed;
