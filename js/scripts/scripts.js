$(function() {
	new Slider({
		elem: $('.slider'),
		sliderControl: $('.slider-control'),
		duration: 1000
	});

	new Carousel({
		elem: $('.promo-slider'),
		leftControl: $('.control-arrows .left'),
		rightControl: $('.control-arrows .right'),
		tabsControl: $('.control-tabs'),
		duration: 1000
	});

	//hiding text by the X axis
	var wrapper = $('<div>').css({
		'overflow': 'hidden',
		height: 80
	});
	$('.control-tabs').wrapAll(wrapper);
});

