/**
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
