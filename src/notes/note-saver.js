import { noteArrayToDictionary } from "./note-helpers";

export const NOTE_LIST = [
	{"id": "1", "title": "Occam", "x": 10.99, "y": 200, "text": "bla"},
	{"id": "2", "title": "The High Forest", "x": 29.99, "y": 240},
	{"id": "3", "title": "Old Towers", "x": 8.99, "y": 280},
	{"id": "4", "title": "Mistvalley", "x": 24.99, "y": 320},
	{"id": "5", "title": "Red Larch", "x": 11.99, "y": 360},
	{"id": "6", "title": "Ashgard", "x": 11.99, "y": 400}
];

export const TREE_RELATIONS = [
	{"id": "a", "parent": "1", "child": "2"},
	{"id": "b", "parent": "1", "child": "3"},
	{"id": "c", "parent": "1", "child": "4"},
	{"id": "d", "parent": "1", "child": "5"}
]

export const saveNotes = (notes) => {
	let savedNotes = JSON.parse(localStorage.getItem("NOTE_LIST"));

	if (savedNotes && savedNotes.length) {
		let dictionary = {};

		Object.assign(dictionary, noteArrayToDictionary(savedNotes), noteArrayToDictionary(notes));
		let list = Object.values(dictionary);

		localStorage.setItem("NOTE_LIST", JSON.stringify(list));
	}
	else {
		localStorage.setItem("NOTE_LIST", JSON.stringify(NOTE_LIST));
		saveNotes(notes);
	}
}

export const saveTreeRelations = (relations) => {
	let saveRelations = JSON.parse(localStorage.getItem("TREE_RELATIONS"));

	if (saveRelations && saveRelations.length) {
		saveRelations = saveRelations.map(savedRelation => {
			return relations.reduce((prev, relation) => {
				if (savedRelation.id === relation.id) {
					return relation;
				}
				return prev;
			}, savedRelation); 
		});

		localStorage.setItem("TREE_RELATIONS", JSON.stringify(saveRelations));
	}
	else {
		localStorage.setItem("TREE_RELATIONS", JSON.stringify(TREE_RELATIONS));
		saveNotes(relations);
	}
}
