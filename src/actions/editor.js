export const TOGGLE_EDITOR_COLLAPSE = "TOGGLE_EDITOR_COLLAPSE";

export function toggleEditorCollapse(toggleValue) {
	return {
		type: TOGGLE_EDITOR_COLLAPSE,
		toggleValue
	}
}
