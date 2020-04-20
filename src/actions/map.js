import { NOTE_LIST, TREE_RELATIONS } from "./../notes/note-saver";

export const SET_CURRENT_NOTE = "SET_CURRENT_NOTE";
export const SET_DRAWN_NOTES = "SET_DRAWN_NOTES";
export const GET_NOTES = "GET_NOTES";
export const SET_NOTE_POSITION = "SET_NOTE_POSITION";
export const MOVE_NOTE = "MOVE_NOTE";
export const ADD_NOTE = "ADD_NOTE";
export const FILTER_NOTES = "FILTER_NOTES";
export const UPDATE_NOTE_POSITION_TYPE = "UPDATE_NOTE_POSITION_TYPE";
export const DRAGSTART_NOTE = "DRAGSTART_NOTE";
export const SET_NOTE_TEXT = "SET_NOTE_TEXT";

function _getNotes(ids) {
	let noteList = JSON.parse(localStorage.getItem("NOTE_LIST"));

	if (!noteList || noteList.length === 0) {
		noteList = NOTE_LIST;
	}

	if (!ids) {
		return noteList
			.filter(note => note.parent === undefined);
	}
	else {
		return noteList
			.filter(note => {
				return ids.find(id => id === note.id);
			});
	}
}

function _getTreeRelations(noteIds) {
	let relations = JSON.parse(localStorage.getItem("TREE_RELATIONS"));

	if (!relations || relations.length === 0) {
		relations = TREE_RELATIONS;
	}

	if (!noteIds) {
		return relations;
	}
	else {
		return relations
			.filter(relation => {
				return noteIds.find(id => id === relation.parent || id === relation.child);
			});
	}
}

export const getNotes = (ids = []) => (dispatch) => {
	const notes = _getNotes(ids)
		.reduce((obj, note) => {
			obj[note.id] = note
			return obj
		}, {});

	const treeRelations = _getTreeRelations(ids)
		.reduce((obj, relation) => {
			obj[relation.id] = relation
			return obj
		}, {});

	dispatch({
		type: GET_NOTES,
		notes,
		treeRelations
	});
}

export const setCurrentNote = (id) => (dispatch) => {
	const note = _getNotes(id ? [id] : null)[0];

	const treeRelationsArray = _getTreeRelations([note.id]);

	const treeRelations = treeRelationsArray
		.reduce((obj, relation) => {
			obj[relation.id] = relation
			return obj
		}, {});

	dispatch(
		setDrawnNotes(treeRelationsArray
			.filter(relation => relation.parent === note.id)
			.map(relation => relation.child)
		)
	);

	dispatch({
		type: SET_CURRENT_NOTE,
		note,
		treeRelations
	});
}

export const setDrawnNotes = (ids = []) => (dispatch) => {
	let notes = _getNotes(ids)
		.reduce((obj, note) => {
			obj[note.id] = note
			return obj
		}, {});

	dispatch({
		type: SET_DRAWN_NOTES,
		notes
	});
}

export const setNotePosition = (noteID, x, y, z) => {
	return {
		type: SET_NOTE_POSITION,
		noteID,
		x,
		y,
		z
	}
}

export const moveNote = (noteId, newParentId) => {
	return {
		type: MOVE_NOTE,
		noteId,
		newParentId
	}
}

export const addNote = ({
	title,
	text
}) => {
	return {
		type: ADD_NOTE,
		title,
		text
	};
}

export const updateNotePositionType = (positionType) => {
	return {
		type: UPDATE_NOTE_POSITION_TYPE,
		positionType
	}
}

export const dragstartNote = (noteID, offsetX, offsetY) => {
	return {
		type: DRAGSTART_NOTE,
		noteID,
		offsetX,
		offsetY
	}
}

export const setNoteText = (noteID, text) => {
	return {
		type: SET_NOTE_TEXT,
		noteID,
		text
	}
}
