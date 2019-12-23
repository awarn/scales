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

const NOTE_LIST = [
	{"id": "1", "title": "Occam", "x": 10.99, "y": 200, "text": "bla"},
	{"id": "2", "title": "The High Forest", "x": 29.99, "y": 240},
	{"id": "3", "title": "Old Towers", "x": 8.99, "y": 280},
	{"id": "4", "title": "Mistvalley", "x": 24.99, "y": 320},
	{"id": "5", "title": "Red Larch", "x": 11.99, "y": 360},
	{"id": "6", "title": "Ashgard", "x": 11.99, "y": 400}
];

const TREE_RELATIONS = [
	{"id": "a", "parent": "1", "child": "2"},
	{"id": "b", "parent": "1", "child": "3"},
	{"id": "c", "parent": "1", "child": "4"},
	{"id": "d", "parent": "1", "child": "5"}
]

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

export const saveNotes = (notes) => {
	let noteList = JSON.parse(localStorage.getItem("NOTE_LIST"));

	if (noteList && noteList.length) {
		noteList = noteList.map(listNote => {
			return notes.reduce((prev, note) => {
				if (listNote.id === note.id) {
					return note;
				}
				return prev;
			}, listNote); 
		});

		localStorage.setItem("NOTE_LIST", JSON.stringify(noteList));
	}
	else {
		localStorage.setItem("NOTE_LIST", JSON.stringify(NOTE_LIST));
		saveNotes(notes);
	}
}

export const saveTreeRelations = (relations) => {
	let savedRelations = JSON.parse(localStorage.getItem("TREE_RELATIONS"));

	if (savedRelations && savedRelations.length) {
		savedRelations = savedRelations.map(savedRelation => {
			return relations.reduce((prev, relation) => {
				if (savedRelation.id === relation.id) {
					return relation;
				}
				return prev;
			}, savedRelation); 
		});

		localStorage.setItem("TREE_RELATIONS", JSON.stringify(noteList));
	}
	else {
		localStorage.setItem("TREE_RELATIONS", JSON.stringify(TREE_RELATIONS));
		saveNotes(relations);
	}
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

export const addNote = (note) => {
	return {
		type: ADD_NOTE,
		note
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
