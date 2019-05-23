import {
	GET_NOTES,
	ADD_NOTE,
	SET_NOTE_POSITION,
	PUT_NOTE_IN,
	FILTER_NOTES,
	UPDATE_NOTE_POSITION_TYPE
} from '../actions/map.js';
import { createSelector } from 'reselect';

const INITIAL_STATE = {
	notes: {},
	noteFilter: [],
	settings: {
		positionType: "absolute"
	},
	error: ''
};

const map = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case GET_NOTES:
		case ADD_NOTE:
		case SET_NOTE_POSITION:
		case PUT_NOTE_IN:
		case FILTER_NOTES:
			return {
				...state,
				notes: notes(state.notes, action)
			}
		case UPDATE_NOTE_POSITION_TYPE:
			return {
				...state,
				settings: settings(state.settings, action)
			}
		default:
			return state;
	}
}

const notes = (state, action) => {
	switch (action.type) {
		case ADD_NOTE: {
			const noteId = action.noteId;
			return {
				...state,
				[noteId]: note(state[noteId], action)
			};
		}
		case FILTER_NOTES: {
			return {
				...state,
				noteFilter: action.ids
			}
		}
		case GET_NOTES: {
			return action.notes
		}
		case PUT_NOTE_IN: {
			const parent = action.parent;
			return {
				...state,
				[parent]: note(state[parent], action)
			}
		}
		case SET_NOTE_POSITION: {
			const noteId = action.note.id;
			return {
				...state,
				[noteId]: note(state[noteId], action)
			};
		}
		default:
			return state;
	}
}

const settings = (state, action) => {
	switch (action.type) {
		case UPDATE_NOTE_POSITION_TYPE:
			return {
				...state,
				positionType: action.positionType
			}
		default:
			return state;
	}
}

const note = (state, action) => {
	switch (action.type) {
		case ADD_NOTE:
			return state
		case SET_NOTE_POSITION:
			return {
				...state,
				x: action.x,
				y: action.y,
				z: action.z
			}
		case PUT_NOTE_IN:
			return {
				...state,
				notes: state.notes ? state.notes.concat([action.note]) : [action.note]
			};
		default:
			return state;
	}
}

export default map;

export const notesSelector = state => state.map.notes;

export const noteFilterSelector = state => state.map.noteFilter;

export const settingsSelector = state => state.map.settings;

export const noteListSelector = createSelector(
	notesSelector,
	noteFilterSelector,
  (notes, filterIDs) => {
		return Object.keys(notes)
		.filter(id => {
			if (!filterIDs || !filterIDs.length) {
				return true;
			}

			if (filterIDs.find(filterID => filterID === id)) {
				return true;
			}

			return false;
		})
		.map(id => {
			const item = notes[id];
			return {
				id: item.id,
				title: item.title,
				x: item.x,
				y: item.y,
				notes: item.notes,
				text: item.text
			}
    });
  }
);
