/**
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