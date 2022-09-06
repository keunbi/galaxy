"use strict";

// active
var checkActive = function checkActive() {
  $('section').each(function () {
    var thisTop = $(this).offset().top - $(window).height();
    var thisBtt = $(this).offset().top + $(this).height();

    if ($(document).scrollTop() > thisTop && $(document).scrollTop() < thisBtt) {
      $(this).addClass('active');
    } else {
      $(this).removeClass('active');
    }
  });
};

checkActive();
$(window).on('scroll', checkActive); 
// sticky 

$('.sticky-wrap').each(function () {
  var _faveSticky = new faveSticky($(this), {
    minHeight: 320,
    maxHeightM: 640,
    maxHeight: 1257,
    preShow: $(window).height() / 2,
    fadeInShow: false
  });

  window.addEventListener('scroll', _faveSticky.scroll);
  window.addEventListener('resize', _faveSticky.resize, 300);
}); 


// onlyVideo
var onlyVideo = function onlyVideo() {
  var $section = $('.m_content-only-video');
  var $video = $('.m_content_video_video');
  var $videoBtn = $('.m_content_video_controls .btn');
  var videoSrc = $video.data('src');

  var _init = function _init() {
    $video.attr('src', videoSrc);
    $videoBtn.on('click', function () {
      $videoBtn.hasClass('is-play') ? _pause() : _play();
    });
  };

  var _play = function _play() {
    $video.get(0).play();
    $videoBtn.text('PAUSE');
    $videoBtn.addClass('is-play');
    var chkEnd = setInterval(function () {
      if ($video.prop('ended')) {
        $videoBtn.text('PLAY');
        $videoBtn.removeClass('is-play');
        clearInterval(chkEnd);
      }
    }, 200);
  };

  var _pause = function _pause() {
    $video.get(0).pause();
    $videoBtn.text('PLAY');
    $videoBtn.removeClass('is-play');
  };

  _init();

  return {
    init: _init,
    play: _play,
    pause: _pause
  };
}; 

// video with canvas 
var videoCanvas = function videoCanvas() {
  var $section = $('.m_content-canvas-video');
  var $canvas = $('.m_content-canvas-video canvas');
  var context = $canvas[0].getContext('2d');
  var loaded = false;
  var initPlay = false;
  var $videoElem = document.createElement('video');
  var videoSrc = $canvas.data('src') + '#t=0.001';
  var videoDuration;
  $videoElem.src = videoSrc;
  $videoElem.playsInline = 1;
  $videoElem.muted = 1;
  $videoElem.preload = true;
  $($videoElem).appendTo($section);

  var _init = function _init() {
    if (initPlay) return;
    context.drawImage($videoElem, 0, 0, $canvas.width(), $canvas.height());
    videoDuration = $videoElem.duration;
    loaded = true;

    _resize();

    _play();
  };

  var _resize = function _resize() {
    var canvasRatio = $section.find('.m_content_video').height() / 1080;
    $canvas.css('transform', "translate(-50%, -50%) scale(".concat(canvasRatio, ")"));
  };

  var _play = function _play() {
    if (!$section.hasClass('active')) return;
    if (!loaded) return;
    initPlay = true;
    var scrollTop = pageYOffset - $section.offset().top;
    var moveArea = $section.height() - $(window).height();
    var percent = Math.max(0, Math.min(1, scrollTop / moveArea));
    var sequence = videoDuration * percent;
    $videoElem.currentTime = sequence;
    context.drawImage($videoElem, 0, 0, $canvas.width(), $canvas.height());
  };

  $videoElem.addEventListener('canplaythrough', _init);
  window.addEventListener('resize', _resize);
  window.addEventListener('scroll', _play);
  return {
    init: _init,
    play: _play
  };
}; // image video with canvas


var imageCanvas = function imageCanvas() {
  var $section = $('.m_content-canvas-images');
  var $canvas = $('.m_content-canvas-images canvas');
  var context = $canvas[0].getContext('2d');
  var videoImages = [];
  var videoImageCount = 146;

  var _init = function _init() {
    var imgElem;
    var num;

    for (var i = 0; i < videoImageCount; i++) {
      imgElem = new Image();
      num = String(i).length < 3 ? new Array(3 - String(i).length + 1).join("0") + i : String(i); // num = String(i).padStart(3, "0");

      imgElem.src = "./images/canvas_img/gear_360_canvas_".concat(num, ".jpg");
      videoImages.push(imgElem);
    }

    imgElem.onload = function () {
      context.drawImage(videoImages[0], 0, 0);
    };

    _resize();
  };

  var _resize = function _resize() {
    var canvasRatio = $section.find('.m_content_video').height() / 1080;
    $canvas.css('transform', "translate(-50%, -50%) scale(".concat(canvasRatio, ")"));
  };

  var _play = function _play() {
    if (!$section.hasClass('active')) return;
    var scrollTop = pageYOffset - $section.offset().top;
    var moveArea = $section.height() - $(window).height();
    var percent = scrollTop / moveArea;
    var sequence = Math.round(videoImageCount * percent);
    if (sequence < 0) sequence = 0;
    if (sequence >= videoImageCount) sequence = videoImageCount - 1;
    context.drawImage(videoImages[sequence], 0, 0);
  };

  _init();

  window.addEventListener('resize', _resize);
  window.addEventListener('scroll', _play);
  window.addEventListener('load', _play);
  return {
    init: _init,
    play: _play
  };
}; 

// load
window.addEventListener('load', function () {
  onlyVideo();
  videoCanvas();
  //imageCanvas();
}); 

// plugin - faveSticky
function faveSticky(el, option) {
  var $fixedInner = el.find('.fixed-inner');
  var $fixedContent = el.find('.fixed-content');
  var stickyShow;
  var scrollView = true;
  var _elTop = el.offset().top;

  var _elH = el.height();

  var startPre = 0;
  var defaults = {
    mode: null,
    end: null,
    minHeight: 0,
    maxHeightM: 0,
    maxHeight: 0,
    preShow: 0,
    fadeInShow: false
  };
  var options = $.extend(defaults, option);
  var onScrollEvent = option.scrollEvent;
  var onEndEvent = option.endEvent;

  var _stickyChecked = function _stickyChecked() {
    var prop = 'position:';
    var value = 'sticky';
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    var el = document.createElement('a');
    var mStyle = el.style;
    mStyle.cssText = prop + prefixes.join(value + ';' + prop).slice(0, -prop.length);

    if (mStyle.position.indexOf(value) !== -1) {
      stickyShow = true;
    } else {
      stickyShow = false;
      $('.m_content-highlights').addClass('no-sticky');
    }

    if (stickyShow) $fixedInner.addClass('o-sticky');

    if (options.mode == 'fixed') {
      $fixedInner.removeClass('o-sticky');
      stickyShow = false;
    }
  };

  var _init = function _init() {
    _stickyChecked();

    _resize();
  };

  var _scroll = function _scroll() {
    var showIn = $(window).scrollTop() >= _elTop - window.innerHeight;

    var showOut = $(window).scrollTop() <= _elTop + _elH;

    scrollView = showIn && showOut ? true : false;

    if (!stickyShow) {
      scrollView = true;
      startPre = options.preShow;
    }

    if (scrollView) {
      el.addClass('scroll-show');

      var _scrollTop = $(window).scrollTop() - el.offset().top + startPre;

      var _moveArea = el.height() - window.innerHeight + startPre;

      var _percent = Math.min(1, _scrollTop / _moveArea);

      _percent = Math.min(1, Math.max(0, _percent));

      if (!stickyShow) {
        if (_scrollTop >= 0) {
          if (_percent >= 1) {
            if (options.end != 'fixed') {
              $fixedInner.removeClass('o-fixed').css('top', _moveArea - startPre);
            } else {
              $fixedInner.addClass('o-fixed').css('top', 0);
            }
          } else {
            $fixedInner.addClass('o-fixed').css('top', 0);
          }
        } else {
          $fixedInner.removeClass('o-fixed').css('top', 0);
        }
      }

      onScrollEvent && onScrollEvent.call();

      if (options.fadeInShow) {
        var fadeStep = Math.min(1, _scrollTop / (_moveArea * 0.4));
        fadeStep = Math.min(1, Math.max(0, fadeStep));
        $fixedContent.css('opacity', fadeStep);

        if (fadeStep >= 0.87) {
          el.addClass('o-end');
        } else {
          el.removeClass('o-end');
        }
      }
    } else {
      el.removeClass('scroll-show');
    }
  };

  var _resize = function _resize() {
    _elTop = el.offset().top;
    _elH = el.height();

    var _gapMargin;

    if (window.innerWidth >= 768) {
      _gapMargin = -(window.innerHeight - options.maxHeight) / 2;
    } else {
      _gapMargin = -(window.innerHeight - options.maxHeightM) / 2;
    }

    $fixedInner.css({
      'min-height': options.minHeight
    });

    if (_gapMargin < 0) {
      el.css({
        'margin-bottom': _gapMargin,
        'padding-bottom': ''
      });
    } else {
      if (!el.hasClass('no_padding')) {
        el.css({
          'margin-bottom': '',
          'padding-bottom': _gapMargin
        });
      }
    }

    if (stickyShow) {
      el.parents('.sticky-sec').css('margin-top', -options.preShow);
    }

    _scroll();
  };

  _init();

  return {
    scroll: _scroll,
    resize: _resize
  };
}
