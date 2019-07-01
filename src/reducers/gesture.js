import { initHammer, addGestureListener, removeGestureListener, addPanListener } from "../utils/gesture";

import {
	INIT_GESTURES,
	BIND_GESTURE_LISTENER,
	BIND_PAN_LISTENER,
	UNBIND_GESTURE_LISTENER
} from '../actions/gesture.js';

const INITIAL_STATE = {
	listeners: {},
	error: ''
}

const gesture = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case INIT_GESTURES:
		case BIND_GESTURE_LISTENER:
		case BIND_PAN_LISTENER:
		case UNBIND_GESTURE_LISTENER:
			return {
				...state,
				listeners: listeners(state.listeners, action)
			}
		default:
			return state;
	}
}

const listeners = (state, action) => {
	switch (action.type) {
		case INIT_GESTURES:
		case BIND_GESTURE_LISTENER:
		case BIND_PAN_LISTENER:
		case UNBIND_GESTURE_LISTENER:
			const elementKey = action.elementKey;
			return {
				...state,
				[elementKey]: listener(state[elementKey], action)
			}
		default:
			return state;
	}
}

const listener = (state, action) => {
	switch (action.type) {
		case INIT_GESTURES: {
			const element = action.element;
			return initHammer(element);
		}
		case BIND_GESTURE_LISTENER: {
			const gesture = action.gesture;
			const handler = action.handler;
			return addGestureListener(state, gesture, handler);
		}
		case BIND_PAN_LISTENER: {
			const handler = action.handler;
			return addPanListener(state, handler);
		}
		case UNBIND_GESTURE_LISTENER:
			const gesture = action.gesture;
			return removeGestureListener(state, gesture);
		default:
			return state;
	}
}

export default gesture;
