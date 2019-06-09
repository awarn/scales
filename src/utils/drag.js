import ZingTouch from "zingtouch";

export const makeActiveRegion = (element) => {
	return ZingTouch.Region(element);
}

export const panListen = (activeRegion, element) => {
	activeRegion.bind(element, "pan", function(event){
		console.log(event)
	});
}
