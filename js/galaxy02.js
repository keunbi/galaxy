// yk
const designMotion = function () {
	const $section = $('.m_feature-design');
	if (!$section.length || $('html').hasClass('sL')) return false;

	let $videoFigure;
	let $imgContainer;
	let $vidContainer;

	let videoTypes;
	let videoPlayed;
	
	let loaded;
	let isMobileSize;
	let canPlay;
	let motionReady = true;
	let motionDuration = 0.8;

	const checkMobile = function () {
		return $(window).width() < 768;
	};

	const init = function () {
		loaded = true;

		$vidContainer = $section.find(".motion-vid");
		$imgContainer = $section.find(".motion-img");
		$videoFigure = $vidContainer.find("figure");

		videoTypes = ["webm", "mp4"];
		createVideo($videoFigure);
		$videoFigure.video.muted = true;

		videoPlayed = false;
		isMobileSize = checkMobile();

		const io1 = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) on();
				});
			},
			{
				rootMargin: '0px 0px -10% 0px'
			}
		);
		io1.observe($videoFigure[0]);

		const io2 = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (!entry.isIntersecting) off();
				});
			}
		);
		io2.observe($section[0]);

		reset();
	};

	const on = function() {
		if (motionReady) {
			motionReady = false;
			startMotion();
		}
	}

	const off = function() {
		if (GALAXY.scrollTop < $section.offset().top) {
			if (!motionReady) {
				motionReady = true;
				resetMotion();
			}
		}
	}

	const createVideo = function ($videoFigure) {
		const mobileTag = checkMobile() ? "_s" : "";
		const source = $videoFigure.data("src");

		let $videoTag;
		if (!$videoFigure.$video) {
			$videoTag = $(`<video playsinline muted preload="none"></video>`);
			$videoTag.appendTo($videoFigure);
		} else {
			$videoTag = $videoFigure.find('video').html("");
		}

		videoTypes.forEach(function (type) {
			$("<source></source>")
				.attr({ type: `video/${type}`, src: `${source + mobileTag}.${type}` })
				.appendTo($videoTag);
		});

		$videoTag[0].load();
		$videoTag.one('canplay', function() {
			if ($videoTag[0].readyState > 2 && !canPlay) {
				canPlay = true;
			}
		});

		$videoFigure.$video = $videoTag;
		$videoFigure.video = $videoTag[0];
	};

	const playVideo = function () {
		if (canPlay) {
			videoPlayed = true;
			$videoFigure.video.play();
		}
	};

	const pauseVideo = function () {
		if (canPlay) {
			videoPlayed = false;
			$videoFigure.video.pause();
			$videoFigure.video.currentTime = 0;
		}
	};

	const reset = function () {
		const sizeMobile = checkMobile();

		if (sizeMobile && !isMobileSize) {
			isMobileSize = true;
			videoPlayed = false;
			createVideo($videoFigure);
		} else if (!sizeMobile && isMobileSize) {
			isMobileSize = false;
			videoPlayed = false;
			createVideo($videoFigure);
		}

		scroll();
	};

	const startMotion = function() {
		TweenMax.fromTo($imgContainer, motionDuration * 0.8,
			{ opacity: 0 },
			{ opacity: 1, delay: motionDuration * 0.2, ease: Power2.easeOut }
		);
		TweenMax.fromTo($section.find('.motion-img.left figure'), motionDuration,
			{ x: '50%', y: '-40%' },
			{ x: '0%', y: '0%', 
				ease: Power2.easeOut,
				onComplete: function () {
					$vidContainer.addClass('show');
					$imgContainer.addClass('hide');
					playVideo();
				}
			}
		);
		TweenMax.fromTo($section.find('.motion-img.right figure'), motionDuration,
			{ x: '-50%', y: '40%' },
			{ x: '0%', y: '0%', ease: Power2.easeOut }
		);
	}

	const resetMotion = function () {
		$vidContainer.removeClass('show');
		$imgContainer.removeClass('hide').__css({ opacity: 0 });
		$section.find('.motion-img.left figure').__css({ x: '50%', y: '-40%' });
		$section.find('.motion-img.right figure').__css({ x: '-50%', y: '40%' });
		pauseVideo();
	}

	GALAXY.resize(function() {
		loaded && reset();
	})

	if (!loaded && window.pageYOffset > 10) init();
	GALAXY.scroll(function() {
		if (!loaded && window.pageYOffset > 10) init();
	});
};

const stickyStatic = function(section) {
	const sections = ['.m_feature-formfactor', '.m_feature-experience_120hz'];
	const minHeight = 360;
	let resizing;

	const decideMode = function() {
		sections.forEach(function (e, i) {
			const $section = $(e);
			if ($section.length) {
				if (GALAXY.areaHeight < minHeight) {
					$section.addClass('static-mode');
				} else {
					$section.removeClass('static-mode');
				}
			}
		});
	}
	decideMode();

	GALAXY.resize(function() {
		clearTimeout(resizing);
		resizing = setTimeout(function() {
			decideMode();
		}, 50);
	}, true);
}

const videoWrap = function() {

	const io = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (!entry.isIntersecting) {
					$(entry.target).closest('article').trigger('invisible');
				}
			});
		});

	const load = function () {
		$('.m_video-wrap').each(function(i, wrap) {
			io.observe(wrap);
		})
	}

	GALAXY.load(function() {
		load();
	});
}

const $colors = $(".m_feature-colors .color-item");
const $colorImages = $(".m_feature-colors .colorset");

new faveColorChip($colors, $colorImages);
new scrollActive(".m_feature-multicamera .tag", 0.7);
new videoWrap();

GALAXY.load(function() {
	new stickyStatic();
	new overview(".m_content-overview");
	new designMotion();
});








// overview
GALAXY.load(function(){
	new overview(".m_content-overview", { horizontal: false });
});

// durability
let durabilityImage = $('.m_feature-durability .img-cont')
GALAXY.hello(durabilityImage,{
	on: function() {
		durabilityImage.addClass('on')
	}
	,off: function() {
		durabilityImage.removeClass('on')
	}
});

// exterior
let $exteriorDevice = $('.exterior-device')
GALAXY.hello($('.m_feature-exterior .exterior-device'),{
	baseLine: 2,
	on: function() {
		$exteriorDevice.removeClass('step1 step2 step3')
		$exteriorDevice.addClass('step1')
		setTimeout(() => {
			$exteriorDevice.addClass('step2')
			setTimeout(() => {
				$exteriorDevice.addClass('step3')
			}, 460);
		}, 750);
	}
	,off: function() {
		$exteriorDevice.removeClass('step1 step2 step3')
	}
});

// video call
let enterSticky = function(){
	let $etSec = $('.m_feature-entertainment');
	let navH
	let ieChk = $('html').hasClass('ie')
	let typeChk = $etSec.find('.videocall-wrap').length

	if(ieChk || !typeChk){
		$etSec.attr('data-sticky-mode', false).removeAttr('style');
	}
	
	GALAXY.resize(function(){
		if($etSec.attr('data-sticky-mode',false)) $etSec.removeAttr('style');
	})

	if(!typeChk) $etSec.find('.enter-wrap .f_container').hide()
	
	if(!ieChk && typeChk){
		let $etStickyWrap = $etSec.find('.sticky-wrap');
		let $etStickyInner = $etSec.find('.sticky-inner');
		let $enterWrap = $etStickyInner.find('.enter-wrap')
		let $videoCallWrap = $etStickyInner.find('.videocall-wrap')
		let $videoCallHeader = $videoCallWrap.find('.f_header-type1')
		let $chat1 = $enterWrap.find('.chat01')
		let $chat2 = $enterWrap.find('.chat02')
		let $chat3 = $enterWrap.find('.chat03')
		let $chat4 = $enterWrap.find('.chat04')
		let $heading = $enterWrap.find('.f_header-type1')
		let $enterCont = $enterWrap.find('.f_container')
		let $videoDevice = $enterWrap.find('.video-device')
		let $deviceBg = $enterWrap.find('.device-bg')
		let winH
		let step1DeviceWidth
		let step2DeviceWidth
		let mb
		let deviceW = ((GALAXY.sizeMode > 1) ? 550 : 376);
		let contPosTop = ((GALAXY.sizeMode > 2) ? 574 : 393);
		const videoImgHeight = Math.round( deviceW * (1791 / 1647)); 
		const videoWrapHeight = Math.max($('.videocall-wrap').height(), videoImgHeight);
		let loadMb = Math.abs(GALAXY.areaHeight - (videoWrapHeight + ((GALAXY.areaHeight/2) - (contPosTop/2))));	
		let viedoCallTop = ($etSec.offset().top + $etSec.height()) - GALAXY.navHeight - GALAXY.areaHeight/2 - loadMb;

		if(GALAXY.sizeMode > 1) $etSec.css('margin-bottom',-loadMb)
		
		let _destroy = function(){
			$etStickyWrap.removeAttr('style')
			$videoCallHeader.removeAttr('style')
			$chat1.removeAttr('style')
			$chat2.removeAttr('style')
			$chat3.removeAttr('style')
			$chat4.removeAttr('style')
			$heading.removeAttr('style')
			$enterWrap.removeClass('switch')
			$enterCont.removeAttr('style')
			$videoDevice.removeAttr('style')
			$deviceBg.removeAttr('style')
			$videoCallWrap.removeAttr('style')
		}

		let _option = {
			align: "top",
			minH: [800, 700, 550],
			on: function () {
				$videoDevice.css('opacity', 1);
				$videoCallWrap.find('.f_header-type1').on('keyup', 'a, button' ,function(e){						
					let _this = $(e.target);
					if(e.keyCode == 9 && _this.closest('[data-sticky-mode="true"]').length){
						GALAXY.setSmoothScrollTop(viedoCallTop , 100);
					}
				})
				
				let vc_hash = location.hash.split('#')[1];
				
				if (vc_hash && vc_hash == 'video-call') { 
					setTimeout(function() {
						GALAXY.setSmoothScrollTop(viedoCallTop, 100);
					}, 1000);
				}
			},
			off: function () {
				_destroy()
			},
			scroll: function (per) {
					$enterCont.css('background-color', 'transparent');
					let chatStep = (GALAXY.sizeMode > 2) ? stickyPercent(per, -1.5, 1.2) : (GALAXY.sizeMode == 2) ? stickyPercent(per, -2, 2) : stickyPercent(per, -2.5, 2.2);
					let headingStep = (GALAXY.sizeMode > 2) ? stickyPercent(per, -0.5, 1.45) : (GALAXY.sizeMode == 2) ? stickyPercent(per, -0.5, 1.5) : stickyPercent(per, -0.5, 4);
					let deviceStep1 = (GALAXY.sizeMode > 2) ? stickyPercent(per, -0.8, 1.1) : (GALAXY.sizeMode == 2) ? stickyPercent(per,  -0.3, 0.61) : stickyPercent(per, 0.28, 0.53)
					let deviceStep2 = (GALAXY.sizeMode > 1) ? stickyPercent(per, 0.3, 0.5) : stickyPercent(per, 0.81, 0.3)
					let deviceStep3 = stickyPercent(per, 0.8, 0.2)

					if(chatStep > 0){
						if(GALAXY.sizeMode > 2){
							$chat1.css({'transform' : 'translate(calc(-50% - '+ (1400 - (1234 * chatStep)) +'px), calc(-50% - '+ (1400 - (1180 * chatStep)) +'px))'})
							$chat2.css({'transform' : 'translate(calc(-50% + '+ (1100 - (931 * chatStep)) +'px), calc(-50% - '+ (1100 - (879 * chatStep)) +'px))'})
							$chat3.css({'transform' : 'translate(calc(-50% - '+ (800 - (633 * chatStep)) +'px), calc(-50% + '+ (800 - (684 * chatStep)) +'px))'})
							$chat4.css({'transform' : 'translate(calc(-50% + '+ (1200 - (1032 * chatStep)) +'px), calc(-50% + '+ (1200 - (1084 * chatStep)) +'px))'})
						}

						if(GALAXY.sizeMode == 2){
							$chat1.css({'transform' : 'translate(calc(-50% - '+ (1400 - (1265 * chatStep)) +'px), calc(-50% - '+ (1400 - (1222 * chatStep)) +'px))'})
							$chat2.css({'transform' : 'translate(calc(-50% + '+ (1100 - (963 * chatStep)) +'px), calc(-50% - '+ (1100 - (921 * chatStep)) +'px))'})
							$chat3.css({'transform' : 'translate(calc(-50% - '+ (800 - (665 * chatStep)) +'px), calc(-50% + '+ (800 - (707 * chatStep)) +'px))'})
							$chat4.css({'transform' : 'translate(calc(-50% + '+ (1200 - (1064 * chatStep)) +'px), calc(-50% + '+ (1200 - (1107 * chatStep)) +'px))'})
						}

						if(GALAXY.sizeMode == 1){
							$chat1.css({'transform' : 'translate(calc(-50% - '+ (600 - (501 * chatStep)) +'px), calc(-50% - '+ (600 - (469 * chatStep)) +'px))'})
							$chat2.css({'transform' : 'translate(calc(-50% + '+ (480 - (380 * chatStep)) +'px), calc(-50% - '+ (480 - (349 * chatStep)) +'px))'})
							$chat3.css({'transform' : 'translate(calc(-50% - '+ (500 - (401 * chatStep)) +'px), calc(-50% + '+ (500 - (432 * chatStep)) +'px))'})
							$chat4.css({'transform' : 'translate(calc(-50% + '+ (550 - (450 * chatStep)) +'px), calc(-50% + '+ (550 - (482 * chatStep)) +'px))'})
						}
						
						$heading.css({'top' : 50 - (100 * headingStep) + '%'})
					}else{
						$chat1.removeAttr('style')
						$chat2.removeAttr('style')
						$chat3.removeAttr('style')
						$chat4.removeAttr('style')
						$heading.removeAttr('style')
					}

					step1DeviceWidth = (GALAXY.sizeMode > 2) ? (3000 - ( 1850 * deviceStep1)) : (GALAXY.sizeMode > 1) ? (2000 - ( 1070 * deviceStep1)) : (1500 - ( 815 * deviceStep1));

					if(deviceStep1 > 0){
						$videoDevice.css({
							'width' : step1DeviceWidth +'px',
							'opacity': 1
						})
						if(GALAXY.sizeMode > 2){
							$deviceBg.css({
								'width':'64.3%',
								'height' : (2000 - ( 1275 * deviceStep1)) +'px',
								'background-color': 'rgb('+ Math.min(30, Math.max(0, (30 * (deviceStep1*2)))) +' '+Math.min(31, Math.max(0, (31 * (deviceStep1*2)))) + ' '+ Math.min(35, Math.max(0, (35 * (deviceStep1*2)))) +')'
							})
						}
						if(GALAXY.sizeMode == 2){
							$deviceBg.css({
								'width':'64.3%',
								'height' : (1500 - ( 880 * deviceStep1)) +'px',
								'background-color': 'rgb('+ Math.min(30, Math.max(0, (30 * (deviceStep1*2)))) +' '+Math.min(31, Math.max(0, (31 * (deviceStep1*2)))) + ' '+ Math.min(35, Math.max(0, (35 * (deviceStep1*2)))) +')'
							})
						}
						if(GALAXY.sizeMode == 1){
							$deviceBg.css({
								'width':'64.3%',
								'height' : (1200 - ( 736 * deviceStep1)) +'px',
								'background-color': 'rgb('+ Math.min(30, Math.max(0, (30 * (deviceStep1*4)))) +' '+Math.min(31, Math.max(0, (31 * (deviceStep1*4)))) + ' '+ Math.min(35, Math.max(0, (35 * (deviceStep1*4)))) +')'
							})

							$videoCallWrap.css({'opacity':1,})
						}

						if(deviceStep1 === 1) {
							$enterWrap.addClass('switch')
						}else{
							$enterWrap.removeClass('switch')
						}
					}else{
						$videoDevice.removeAttr('style')
						$deviceBg.removeAttr('style')
						$videoCallWrap.removeAttr('style')
						$enterWrap.removeClass('switch')
					}
					
					step2DeviceWidth = (GALAXY.sizeMode > 2) ? (step1DeviceWidth - ( 600 * deviceStep2)) : (step1DeviceWidth - ( 554 * deviceStep2));
					step2headerTop = (GALAXY.sizeMode > 2) ? 574 : 433;

					if(GALAXY.sizeMode > 1){
						if(deviceStep2 > 0){
							$videoDevice.css({
								'width' :  step2DeviceWidth+'px',
							})
							$videoCallWrap.css({
								'padding-top':((winH/2) - ((step2headerTop) /2)),
							})
						}else{
							$videoDevice.css({
								'width' :  step1DeviceWidth+'px',
							})
						}
						
						let posXval =  (GALAXY.sizeMode > 2) ? 44 : 47;

						Step3devicePosX = ( 50 + (posXval * deviceStep3))

						if(deviceStep3 > 0){
							const videoImgHeight = Math.round(step2DeviceWidth * (1791 / 1647)); 
							const videoWrapHeight = Math.max($('.videocall-wrap').height(), videoImgHeight);
							mb = Math.abs(GALAXY.areaHeight - (videoWrapHeight + ((winH/2) - (step2headerTop/2))));
							$etSec.css({'margin-bottom':-(mb)+'px'})
							$videoDevice.css({
								'transform':'translate(-'+ Step3devicePosX +'%, -50%)'
							})
							$videoCallHeader.__css({
								'opacity' : deviceStep3,
								'x': -50 + (posXval * deviceStep3)+ '%'
							})
						}else{
							$videoDevice.css({
								'transform':'translate(-50%, -50%)'
							})
							$videoCallHeader.removeAttr('style')
						}
					}	
					
					if(GALAXY.sizeMode == 1){
						step2DeviceWidth = (step1DeviceWidth - ( 345 * deviceStep2))
						Step2DevicePosY = ( 50 - (50 * deviceStep2) )
						if(deviceStep2 > 0){
							$enterWrap.addClass('switch')
							$videoDevice.css({
								'width' :  step2DeviceWidth+'px',
							})
						}else{
							$etStickyWrap.removeAttr('style')
							$enterWrap.removeClass('switch')
							$videoDevice.css({
								'width' :  step1DeviceWidth+'px',
							})
						}
				}

			},
			resize: function () {
				navH = $('#subnav, .floating-navigation__wrap').height() || 0;
				winH = GALAXY.areaHeight
				_destroy()
			}
		}
		
		new scrollSticky('.m_feature-entertainment .sticky-wrap', _option)
	}
};
GALAXY.load(function(){
	enterSticky()
})


