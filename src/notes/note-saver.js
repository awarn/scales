import { noteArrayToDictionary } from "./note-helpers";

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
