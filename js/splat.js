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

;/**
* {Options}:
*	elem - an element contained slider items;
* sliderControl - link on element that slides block,
* duration - animation duration
**/
	
	function Slider(options) {
		var $elem = options.elem.find('.slider-inner'), //find element which margin to change
				min = 0,
				max = ($elem.children().length - 4) * $('.slider-item').outerWidth(true), // number of blocks multipled on width of one block, 4 blocks is always visible, width with all margins
				sliderControl = new SliderControl({
					elem:options.sliderControl,
					min: min,
					max: max
				}), //create slider control object
				currentMargin,
				duration = options.duration;

		$(sliderControl).on('slide', moveSlider)
				.on('sliderclick', onSliderClick);

		function moveSlider(e) {
			currentMargin = -e.value;

			$elem.css({
				marginLeft: currentMargin
			})
		}

		function onSliderClick(e) {
			currentMargin = -e.value;

			$elem.animate({
				marginLeft: currentMargin,
				duration: duration
			})
		}
	}

	function SliderControl(options) {
		var $elem = options.elem,
				self = this,
				left,
				$handle,
				max = options.max || 100,
				value = options.value || 0;

		$handle = $('<span class="slider-control-handle">').appendTo($elem)
				.on('mousedown', $handle, startMove);

		$elem.on('click', onSliderClick);		

		pixelsPerValue = ($elem.width() - $handle.width())/max
		
		setSlidingValue(value, true);

		function startMove(e) {
			var handleCoords = $handle.offset();
			var sliderCoords = $elem.offset();
			var shiftX = e.pageX - handleCoords.left;

			$(document).on('dragstart selectstart', false);

			$(document).on('mousemove', function(e) {
				$handle.addClass('moving');
				left = e.pageX - shiftX - sliderCoords.left;
						
				if(left < 0) {
					left = 0;
				};

				if(left > $elem.width() - $handle.width()) {
					left = $elem.width() - $handle.width();
				}
						
				setSlidingValue(Math.round(left/pixelsPerValue))
			});

			$(document).on('mouseup', function(){
				$(document).off('mousemove mouseup')
						.off('dragstart selectstart', false);
				$handle.removeClass('moving');
			})
		}

		function setSlidingValue(newVal, quiet) {
			value = newVal;
			$handle.css('left', value * pixelsPerValue || 0);
					
			if(!quiet) {
				$(self).triggerHandler({
					type: 'slide',
					value: value
				})
			}
		}

		function onSliderClick(e) {
			var left = e.pageX - $elem.offset().left - $handle.width()/2;

			if(left < 0) left = 0;

			if(left > $elem.width() - $handle.width()) {
					left = $elem.width() - $handle.width();
				}

			setSlidingValue(Math.round(left/pixelsPerValue), true);

			$(self).triggerHandler({
				type: 'sliderclick',
				value: value
			})
		}
	}
;/**
* {Options}:
*	elem - an element contained slider items;
* sliderControl - link on element that slides block;
*	leftControl - link on prev control;
* rightControl - link on next control;
*	tabsControl - link on tabs
*	duration - duration of animation
**/

function Carousel(options) {

	var $elem = options.elem.find('.slider-inner'),
			$leftControl = options.leftControl,
			$rightControl = options.rightControl,
			$tabsControl = options.tabsControl,
			duration = options.duration,
			$tab = $tabsControl.find('li'),
			step = $elem.find('.slider-item').outerWidth(true),
			max = ($elem.find('.slider-item').length - 1) * step,
			currentMargin = 0,
			currentIndex = 0,
			tabMargin = 0,
			maxTabMargin = 0;

	calcMaxTabMargin();

	$(window).on('resize', calcMaxTabMargin); //calculate maxTabMargin each time window is resized
	
	$tabsControl.find('a').each(function(index){
		$(this).attr('href', '#slide_' + index)
	}); // нумеруем href по-порядку аналогично с slider-item для дальнейего доступа к item

	$elem.find('.slider-item').each(function(index) {
		$(this).attr('id', 'slide_' + index);
	});

	$leftControl.addClass('disabled');		

	$leftControl.on('click', onLeftControlClick);
		
	$rightControl.on('click', onRightControlClick);

	$tabsControl.on('click', 'a', onTabClick);

	function onLeftControlClick() {
		enableControl($rightControl);

		if(currentMargin === 0 || currentIndex === 0) return;

		currentIndex--;
		removeActive();

		$tab.eq(currentIndex).addClass('active');
		scrollTabsControl($tab.eq(currentIndex));

		var newCurrentMargin = currentMargin + step;
		$elem.animate({
			marginLeft: newCurrentMargin,
			duration: duration
		})
		currentMargin = newCurrentMargin;

		if(currentMargin === 0) disableControl($leftControl);
	}

	function onRightControlClick() {
		enableControl($leftControl);
		
		var newCurrentMargin = currentMargin - step;
		
		if(currentMargin === -max || currentIndex === $tab.length) return;
		currentIndex++;
		removeActive();
		$tab.eq(currentIndex).addClass('active');
		scrollTabsControl($tab.eq(currentIndex));

		$elem.animate({
			marginLeft: newCurrentMargin,
			duration: duration
		})
		currentMargin = newCurrentMargin;

		if(currentMargin === -max) disableControl($rightControl);
	}

	function onTabClick(e) {
		e.preventDefault();
		var parentLi = $(this).closest('li');

		if(parentLi.hasClass('active')) return;

		var href = $(this).attr('href');
		currentIndex = +href.slice(7);

		if(currentIndex > 0) enableControl($leftControl);
		if(currentIndex === 0) disableControl($leftControl);

		if(currentIndex < $tab.length) enableControl($rightControl);
		if(currentIndex === $tab.length - 1) disableControl($rightControl);

		var item = $elem.find(href);
		var itemOffset = item.position().left;
		var newCurrentMargin = currentMargin - itemOffset;

		$elem.animate({
			marginLeft:  newCurrentMargin,
			duration: duration
		})

		scrollTabsControl(parentLi);
		currentMargin = newCurrentMargin;

		removeActive();
		parentLi.addClass('active');
	}

	function removeActive() {
		$tab.removeClass('active');
	}

	function enableControl(elem) {
		if(elem.hasClass('disabled')) {
			elem.removeClass('disabled');
		};
	}

	function disableControl(elem) {
		elem.addClass('disabled');
	}

	function calcMaxTabMargin() {
		var liWidth;
		$tab.each(function() {
			liWidth = $(this).width();
			maxTabMargin += liWidth;
			return liWidth
		});
		maxTabMargin -= $tabsControl.width();
		maxTabMargin = Math.max(liWidth, maxTabMargin);
		return maxTabMargin;
	}

	function scrollTabsControl(elem) {
		var newMargin = tabMargin - elem.position().left + $tabsControl.width()/2 - elem.outerWidth()/2;

		if(newMargin > 0) newMargin = 0;

		if(newMargin < -maxTabMargin) newMargin = -maxTabMargin;

		$tabsControl.find('ul').animate({
			marginLeft: newMargin,
			duration: duration
		});

		tabMargin = newMargin;
	}
}