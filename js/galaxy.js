// plugin
const setVar = function(target, prop, value) {
	target.style.setProperty(`--${prop}`, value);
}
const calcValue = function (step, value, scrollTop, moveArea) {
    let partStart;
    let partEnd;
    let partArea;
    let partSpot;
	
	let rv;

    if (typeof step === 'number') {
        partSpot = moveArea * step;

		rv  = scrollTop < partSpot ? value[0] : value[1];
    } else {
        partStart = moveArea * step[0];
        partEnd = moveArea * step[1];
        partArea = partEnd - partStart;
		
        if (scrollTop < partStart) {
            rv = value[0];
        } else if (scrollTop > partEnd) {
            rv = value[1];
        } else {
            rv = ((scrollTop - partStart) / partArea) * (value[1] - value[0]) + value[0];
        }
    }

	return rv;
}


// colors
const colors = (function () {
	const $colorContent = $(".m_feature-colors");
	const $colorChipArea = $colorContent.find(".colorchip-area");
	const $colorChipCurrent = $colorContent.find(".current-colorchip");
	const $colorImages = $colorContent.find(".images-item");
	const $colorColors = $colorContent.find(".color-item");

	let currentColorText = '';
	let currentColor = '';

	const onInit = function() {
		currentColorText = $colorChipArea.find("input[type=radio]:checked").siblings("label").find(".colorchip").text();
		$colorChipCurrent.text(currentColorText);
	}

	const onChange = function() {
		currentColorText = $(this).siblings("label").find(".colorchip").text();
		$colorChipCurrent.text(currentColorText)
	};

	new faveColorChip($colorColors, $colorImages, onChange, onInit);

})();

// bespoke
const bespoke = function () {
	if ( document.querySelector(".bespoke-list") === null ) return;

	const bespokeSlide = document.querySelector(".bespoke-list");
	const bespokeSlideArea = document.querySelector(".bespoke-list .scroll-slide_area");
	const bespokeSlideList = document.querySelector(".bespoke-list .slide-list");

	let chkRtl = document.querySelector('html').classList.contains('rtl');
	let chkAction = false;
	let chkLoad = false;
	
	new scrollSlide(bespokeSlide);

	const _init = function () {
		if ( GALAXY.sizeMode === 1 ){
			if ( chkAction ) return;
			_action();
		}
	}

	const _action = function () {
		if ( chkAction ) return;
		
		if ( GALAXY.sizeMode === 1 ){

			const chkDesignTop = GALAXY.scrollTop > $('.m_content-design').offset().top - GALAXY.areaHeight;
			const chkDesignBtt = GALAXY.scrollTop < $('.m_content-design').offset().top + $('.m_content-design').height();
			if ( chkDesignTop && chkDesignBtt && !chkLoad ){
				chkLoad = true;
	
				if ( !chkRtl ){
					bespokeSlideArea.scrollLeft = bespokeSlideList.offsetWidth;
				} else {
					bespokeSlideArea.scrollLeft = -bespokeSlideList.offsetWidth;
				}
			}

			const chkTop = GALAXY.scrollTop > $(bespokeSlide).offset().top - GALAXY.areaHeight;
			const chkBtt = GALAXY.scrollTop < $(bespokeSlide).offset().top + $(bespokeSlide).height();
			if ( chkTop && chkBtt ){
				chkAction = true;
				bespokeSlideArea.scrollLeft = 0;
			} 
		}
	};
	
	_init();
	GALAXY.resize(_init);
	GALAXY.scroll(_action);
};

// camera
const camera = function () {
	const $cameraContent = $('.m_feature-camera');
	const $cameraSkill = $cameraContent.find('.content-skill');
	const $cameraDark = $cameraContent.find('.content-dark');
	const $cameraSlillInteraction = $('.m_feature-camera .interaction-wrap');
	const $cameraSkillImage01 = $cameraContent.find('.o_figure-01');

	let cameraContent = $cameraContent[0];

	let scrollTop = 0;
	let moveArea = 0;
	let ww = 0;
	let wh = 0;
	let scale = 0;

	const _init = function() {
		ww = Math.min(GALAXY.areaWidth, 1920);
		wh = GALAXY.areaHeight;
		scale = GALAXY.sizeMode > 1 ? ww - $cameraSkillImage01.width() > wh - $cameraSkillImage01.height() ? ww / $cameraSkillImage01.width() : wh / $cameraSkillImage01.height() : 2.4;

		setVar($cameraContent[0], 'camera-image01_scale', scale);

		_scroll();
	}

	const _scroll = function() {

		// camera interatcion - figure
		if ( GALAXY.scrollTop < $cameraSlillInteraction.offset().top - GALAXY.areaHeight ) {
			$cameraSlillInteraction.removeClass('active off');
		} else if ( GALAXY.scrollTop > $cameraSlillInteraction.offset().top + $cameraSlillInteraction.height() ) {
			$cameraSlillInteraction.addClass('off');
		} else {
			$cameraSlillInteraction.removeClass('off');
			$cameraSlillInteraction.addClass('active');
		}

		// camera bg
		if ( GALAXY.scrollTop > $cameraSkill.offset().top - 100 && GALAXY.scrollTop < $cameraDark.offset().top + 100 ){
			scrollTop = GALAXY.scrollTop - $cameraSkill.offset().top;
			moveArea = $cameraSkill.height();

			setVar(cameraContent, 'camera-scroll-bg-y', `${calcValue([0.7, 1], [0, wh * -0.7], scrollTop, moveArea)}px`);
		}
	}

	_init();
	GALAXY.resize(_init);
	GALAXY.scroll(_scroll);
};

// multiCamera
const multiCamera = (function () {
	new scrollActive(".m_feature-multiCamera .spec-item.front .spec-texts", 0.7);
	new scrollActive(".m_feature-multiCamera .spec-item.back .spec-texts", 0.7);

	const $multiCamera = $('.m_feature-multiCamera');
	const $spec1 = $('.m_feature-multiCamera .spec-text-01');

	let multiCameraPaddingTop = 0;
	let spec1Top = 0;
	
	const _init = function () {
		if ( GALAXY.sizeMode === 1 ) {
			spec1Top = +($spec1.css('top').replace('px', ''));

			if ( $spec1.height() > spec1Top ){
				multiCameraPaddingTop = $spec1.height() - spec1Top;
				$multiCamera.css({'padding-top' : multiCameraPaddingTop});

			} 
		}
	}

	GALAXY.load(_init);
})()

// flexCam
const flexCam = function () {
	const $flexCam = $('.m_feature-flexCam');
	const $flexCamInteraction = $('.m_feature-flexCam .interaction-wrap');
	const $flexCamHeader = $('.m_feature-flexCam .f_header-type1');

	const _init = function() {
		if ( GALAXY.scrollTop < $flexCamInteraction.offset().top + $flexCamInteraction.height() * 0.4 - GALAXY.areaHeight ){
			$flexCamInteraction.removeClass('active off');
		}
		_scroll();
	}

	const _scroll = function() {
		const chkTop = GALAXY.scrollTop < $flexCam.offset().top - GALAXY.areaHeight - 200;
		const chkBottom = GALAXY.scrollTop > $flexCam.offset().top + $flexCam.height();

		if ( chkTop || chkBottom ) return;
		
		if ( GALAXY.scrollTop < $flexCamInteraction.offset().top - GALAXY.areaHeight ) {
			$flexCamInteraction.removeClass('active off');
		} else if ( GALAXY.scrollTop > $flexCamHeader.offset().top ) {
			$flexCamInteraction.addClass('active off');
		} else if ( GALAXY.scrollTop > $flexCamInteraction.offset().top + $flexCamInteraction.height() * 0.4 - GALAXY.areaHeight ) {
			$flexCamInteraction.removeClass('off');
			setTimeout(function() {
				$flexCamInteraction.addClass('active');
			}, 100);
		}
		
	}

	_init();
	GALAXY.resize(_init);
	GALAXY.scroll(_scroll);

};

// quickShot
const quickShot = (function() {
	GALAXY.hello($('.m_feature-quickShot .hello-box'),{
		baseLine: 5,
		on: function() {
			$('.m_feature-quickShot .visual-wrap').addClass('active');
		}
		,off: function() {
			$('.m_feature-quickShot .visual-wrap').removeClass('active');
		}
	});
})();

// coverScreen
const coverScreen = function() {
	let $coverScreen = $('.m_feature-coverScreen');
	let $screenWrap = $('.m_feature-coverScreen .screen-wrap');;
	let screenWrapTop = 0;
	let screenWrapHeight = 0;

	const _init = function () {
		_scroll();
	}

	const _scroll = function (){
		const chkTop = GALAXY.scrollTop < $coverScreen.offset().top - GALAXY.areaHeight - 200;
		const chkBottom = GALAXY.scrollTop > $coverScreen.offset().top + $coverScreen.height();

		if ( chkTop || chkBottom ) return;
		
		screenWrapTop = $screenWrap.offset().top;
		screenWrapHeight = $screenWrap.height();
		
		let scrollTop = window.pageYOffset;
		let scrollBottom = scrollTop + GALAXY.areaHeight;

		if( scrollBottom > screenWrapTop + screenWrapHeight * 0.5 ){
			$screenWrap.addClass('active');
		} else if ( scrollTop > screenWrapTop + screenWrapHeight ) {
			$screenWrap.removeClass('active');
		} else if ( scrollBottom < screenWrapTop ) {
			$screenWrap.removeClass('active');
		}
	}

	_init();
	GALAXY.resize(_init);
	GALAXY.scroll(_scroll);
};

GALAXY.load(function() {
	bespoke();
	flexCam();
	camera();
	coverScreen();
});



// chloe

const setStickyCopyHeight = function(_section,_at,_nextAt){
	const $section = $('.m_content-'+_section);
	const $article = $section.find('.m_feature-'+_section+'_'+_at);
	const $nextArticle = $section.find('.m_feature-'+_section+'_'+_nextAt)
	const $copyWrap = $article.find('.copy-wrap');
	let totalHeight = 0;

	if(!GALAXY.sizeMode) return false;
	if (GALAXY.sizeMode < 2 && !$('html').hasClass('ie')) {

		totalHeight = 0;
		$copyWrap.find('.sticky-height').each(function(){
			totalHeight = totalHeight + $(this).innerHeight();
		});
		$nextArticle.css('margin-top',(-1 * totalHeight)-1);
	} 

};
GALAXY.resize(function () {
	setStickyCopyHeight('experience','immersive-view','120hz');	
});


const immersiveSticky = (function(){
	const $article = $(".m_feature-experience_immersive-view");
	const isCheckIe = $('html').hasClass('ie');
	
	let poniner = $article.offset().top;
	let minH = (GALAXY.sizeMode > 2) ? 900 : (GALAXY.sizeMode > 1) ? 900 : 500;


	const _resize = function(){
		minH = (GALAXY.sizeMode > 2) ? 900 : (GALAXY.sizeMode > 1) ? 900 : 500;
		if(GALAXY.areaHeight < minH) {
			$article.removeClass('sticky-enter');
		}else{ 
			$article.addClass('sticky-enter');
			_init();
			
		}
	}

	const _init = function(){

		poniner = $article.offset().top;
		if ( GALAXY.scrollTop >poniner-(GALAXY.areaHeight/2)+(GALAXY.navHeight*1.3)) {
			$article.find('.content-wrap').addClass('enter-motion');
		}else{
			$article.find('.content-wrap').removeClass('enter-motion');
		}
	}

	if(!isCheckIe){
		GALAXY.load(_init);
		GALAXY.scroll(_resize);
		GALAXY.resize(_resize);

	}
	
})();



GALAXY.load(function(){
	var $experienceArticle = $('.m_feature-experience');
	var $figure = $('.experience-video-wrap .experience-video');
	$experienceArticle.off('visible invisible');

	$experienceArticle.find('video').length && $experienceArticle.find('video').one('canplay', function() {
		$experienceArticle.trigger('videoOn');
	});
	
	var ob = new IntersectionObserver(function(entries, observer){
		$.each(entries, function (i, entry) {
			if (entry.isIntersecting) {
				$experienceArticle.trigger('videoOn');
				setTimeout(function() {
					$(window).trigger('scroll');
				}, 50);
			}else{
				$experienceArticle.trigger('videoOff');
				setTimeout(function() {
					$(window).trigger('scroll');
				}, 50);
			}
		});
	});
	
	ob.observe($figure[0]);
});
