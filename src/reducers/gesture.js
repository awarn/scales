import ZingTouch from "zingtouch";

import {
	REGISTER_REGION,
	BIND_GESTURE_LISTENER,
	UNBIND_GESTURE_LISTENER
} from '../actions/gesture.js';

const INITIAL_STATE = {
	regions: {},
	error: ''
}

const gesture = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case REGISTER_REGION:
		case BIND_GESTURE_LISTENER:
		case UNBIND_GESTURE_LISTENER:
			return {
				...state,
				regions: regions(state.regions, action)
			}
		default:
			return state;
	}
}

const regions = (state, action) => {
	switch (action.type) {
		case REGISTER_REGION:
		case BIND_GESTURE_LISTENER:
		case UNBIND_GESTURE_LISTENER:
			const regionID = action.regionID;
			return {
				...state,
				[regionID]: region(state[regionID], action)
			}
		default:
			return state;
	}
}

const region = (state, action) => {
	switch (action.type) {
		case REGISTER_REGION: {
			const element = action.element;
			return ZingTouch.Region(element);
		}
		case BIND_GESTURE_LISTENER: {
			const element = action.element;
			const gesture = action.gesture;
			const handler = action.handler;
			let newState = {...state};
			newState.bind(element, gesture, handler);
			console.log(newState)
			return newState;
		}
		case UNBIND_GESTURE_LISTENER:
			const gesture = action.gesture;
			let newState = {...state};
			newState.unbind(element, gesture);
			return newState;
		default:
			return state;
	}
}

export default gesture;
