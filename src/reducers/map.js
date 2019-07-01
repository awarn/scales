import {
	GET_NOTES,
	ADD_NOTE,
	SET_NOTE_POSITION,
	MOVE_NOTE,
	UPDATE_NOTE_POSITION_TYPE,
	SET_CURRENT_NOTE,
	SET_DRAWN_NOTES,
	DRAGSTART_NOTE
} from '../actions/map.js';
import { createSelector } from 'reselect';

const INITIAL_STATE = {
	notes: {},
	currentNoteID: undefined,
	drawnNotesIDs: [],
	dragNoteInfo: {},
	settings: {
		positionType: "absolute"
	},
	error: ''
}

const map = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SET_CURRENT_NOTE:
			const currentNoteID = action.note.id;
			return {
				...state,
				currentNoteID: currentNoteID,
				notes: notes(state.notes, action)
			}
		case SET_DRAWN_NOTES:
			const drawnNotesIDs = Object.keys(action.notes);
			return {
				...state,
				drawnNotesIDs: drawnNotesIDs,
				notes: notes(state.notes, action)
			}
		case MOVE_NOTE:
			return {
				...state,
				drawnNotesIDs: state.drawnNotesIDs.filter(id => id !== action.noteID),
				notes: notes(state.notes, action)
			}
		case GET_NOTES:
		case ADD_NOTE:
		case SET_NOTE_POSITION:
			return {
				...state,
				notes: notes(state.notes, action)
			}
		case UPDATE_NOTE_POSITION_TYPE:
			return {
				...state,
				settings: settings(state.settings, action)
			}
		case DRAGSTART_NOTE:
			return {
				...state,
				dragNoteInfo: {
					id: action.noteID,
					offsetX: action.offsetX,
					offsetY: action.offsetY
				}
			}
		default:
			return state;
	}
}

const notes = (state, action) => {
	switch (action.type) {
		case ADD_NOTE:
		case SET_CURRENT_NOTE:
			const noteID = action.note.id;
			return {
				...state,
				[noteID]: note(action.note, action)
			}
		case GET_NOTES:
		case SET_DRAWN_NOTES:
			return Object.assign({...state}, action.notes);
		case MOVE_NOTE: {
			const noteID = action.noteID;
			const newParentID = action.newParentID;
			const oldParentID = action.oldParentID;
			return {
				...state,
				[noteID]: note(state[noteID], action),
				[newParentID]: note(state[newParentID], action),
				[oldParentID]: note(state[oldParentID], action)
			}
		}
		case SET_NOTE_POSITION: {
			const noteID = action.noteID;
			return {
				...state,
				[noteID]: note(state[noteID], action)
			};
		}
		default:
			return state;
	}
}

const note = (state, action) => {
	switch (action.type) {
		case ADD_NOTE:
		case SET_CURRENT_NOTE:
		case GET_NOTES:
		case SET_DRAWN_NOTES:
			return state
		case SET_NOTE_POSITION:
			return {
				...state,
				x: action.x,
				y: action.y,
				z: action.z
			}
		case MOVE_NOTE:
			switch (state.id) {
				case action.noteID:
					return {
						...state,
						parent: action.newParentID
					}
				case action.newParentID:
					return {
						...state,
						notes: state.notes ? state.notes.concat([action.noteID]) : [action.noteID]
					}
				case action.oldParentID:
					return {
						...state,
						notes: state.notes ? state.notes.filter(note => note !== action.noteID) : []
					}
			}
			return newState;
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

function _makeNoteListItem(item) {
	return {
		id: item.id,
		title: item.title,
		x: item.x,
		y: item.y,
		notes: item.notes,
		text: item.text,
		parent: item.parent
	}
}

export default map;

export const notesSelector = state => state.map.notes;

export const settingsSelector = state => state.map.settings;

export const currentNoteIDSelector = state => state.map.currentNoteID;

export const drawnNotesIDsSelector = state => state.map.drawnNotesIDs;

export const dragNoteInfoSelector = state => state.map.dragNoteInfo;

export const dragNoteIDSelector = state => state.map.dragNoteInfo.id;

export const currentNoteSelector = createSelector(
	notesSelector,
	currentNoteIDSelector,
	(notes, currentNoteID) => {
		return notes[currentNoteID];
	}
);

export const currentNoteParentSelector = createSelector(
	notesSelector,
	currentNoteSelector,
	(notes, currentNote) => {
		return notes[currentNote.parent];
	}
);

export const dragNoteSelector = createSelector(
	notesSelector,
	dragNoteIDSelector,
	(notes, dragNoteID) => {
		return notes[dragNoteID];
	}
);

export const saveNoteListSelector = createSelector(
	notesSelector,
  (notes) => {
		return Object.keys(notes)
			.map(id => {
				const item = notes[id];
				return _makeNoteListItem(item);
			});
  }
);

export const drawnNotesListSelector = createSelector(
	notesSelector,
	drawnNotesIDsSelector,
  (notes, drawnNotesIDs) => {
		return Object.keys(notes)
			.filter(id => {
				return drawnNotesIDs && drawnNotesIDs.find(note => note === id);
			})
			.map(id => {
				const item = notes[id];
				return _makeNoteListItem(item);
			});
  }
);
