import {
	GET_NOTES,
	ADD_NOTE,
	SET_NOTE_POSITION,
	MOVE_NOTE,
	UPDATE_NOTE_POSITION_TYPE,
	SET_CURRENT_NOTE,
	SET_DRAWN_NOTES,
	DRAGSTART_NOTE,
	SET_NOTE_TEXT
} from '../actions/map.js';
import { createSelector } from 'reselect';
import { createNote } from '../notes/note-helpers.js';

const INITIAL_STATE = {
	notes: {},
	treeRelations: {},
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
				notes: notes(state.notes, action),
				treeRelations: treeRelations(state.treeRelations, action)
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
				drawnNotesIDs: state.drawnNotesIDs.filter(id => id !== action.noteId),
				treeRelations: treeRelations(state.treeRelations, action)
			}
		case GET_NOTES:
			return {
				...state,
				notes: notes(state.notes, action),
				treeRelations: treeRelations(state.treeRelations, action)
			}
		case ADD_NOTE:
		case SET_NOTE_POSITION:
		case SET_NOTE_TEXT:
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

const treeRelations = (state, action) => {
	switch (action.type) {
		case SET_CURRENT_NOTE:
		case GET_NOTES:
			return Object.assign({...state}, action.treeRelations);
		case MOVE_NOTE:
			const noteId = action.noteId;
			const relation = Object.values(state).find(relation => relation.child === noteId);
			if (relation) {
				const relationId = relation.id;
				return {
					...state,
					[relationId]: treeRelation(state[relationId], action)
				}
			}
			else {
				// TODO: Fix for no previous relation.
				return state;
			}
		default:
			return state;
	}
}

const treeRelation = (state, action) => {
	switch (action.type) {
		case MOVE_NOTE:
			const noteId = action.noteId;
			const newParentId = action.newParentId;
			return {
				...state,
				parent: newParentId,
				child: noteId
			};
		default:
			return state;
	}
}

const notes = (state, action) => {
	switch (action.type) {
		case ADD_NOTE: {
			let note = createNote({
				title: action.title,
				text: action.text
			});
			const noteId = note.id;
			return {
				...state,
				[noteId]: note
			};
		}
		case SET_CURRENT_NOTE:
			const noteId = action.note.id;
			return {
				...state,
				[noteId]: note(action.note, action)
			}
		case GET_NOTES:
		case SET_DRAWN_NOTES:
			return Object.assign({...state}, action.notes);
		case SET_NOTE_POSITION:
		case SET_NOTE_TEXT: {
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
		case SET_NOTE_POSITION:
			return {
				...state,
				x: action.x,
				y: action.y,
				z: action.z
			}
		case SET_NOTE_TEXT:
			let text = action.text;
			return {
				...state,
				text
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

export default map;


export const notesSelector = state => state.map.notes;

export const settingsSelector = state => state.map.settings;

export const currentNoteIDSelector = state => state.map.currentNoteID;

export const drawnNotesIDsSelector = state => state.map.drawnNotesIDs;

export const dragNoteInfoSelector = state => state.map.dragNoteInfo;

export const dragNoteIDSelector = state => state.map.dragNoteInfo.id;

export const treeRelationsSelector = state => state.map.treeRelations;

export const currentNoteSelector = createSelector(
	notesSelector,
	currentNoteIDSelector,
	(notes, currentNoteID) => {
		return notes[currentNoteID];
	}
);

const currentNoteParentRelationSelector = createSelector(
	treeRelationsSelector,
	currentNoteIDSelector,
	(relations, currentNoteId) => {
		return Object.values(relations)
			.find(relation => relation.child === currentNoteId);
	}
);

export const currentNoteParentSelector = createSelector(
	notesSelector,
	currentNoteParentRelationSelector,
	(notes, relation) => {
		if (!relation) {
			return null;
		}
		return notes[relation.parent];
	}
);

const currentNoteChildrenRelationsSelector = createSelector(
	treeRelationsSelector,
	currentNoteIDSelector,
	(relations, currentNoteId) => {
		return Object.values(relations)
			.filter(relation => relation.parent === currentNoteId);
	}
);

export const currentNoteChildrenSelector = createSelector(
	notesSelector,
	currentNoteChildrenRelationsSelector,
	(notes, relations) => {
		return notes.filter(note => {
			return !!relations.find(relation => relation.child === note.id);
		});
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
	(notes) => noteDictionaryToArray(notes)
);

export const relationsSaveSelector = createSelector(
	treeRelationsSelector,
	(relations) => Object.keys(relations).map(id => relations[id])
);

export const drawnNotesListSelector = createSelector(
	notesSelector,
	drawnNotesIDsSelector,
	(notes, drawnNotesIDs) => {
		return Object.keys(notes)
			.filter(id => {
				return drawnNotesIDs && drawnNotesIDs.find(note => note === id);
			})
			.map(id => notes[id]);
	}
);
