{
var excellenceMotion = function excellenceMotion() {
    var excellence = document.querySelector(".m_content-excellence");
    var excellenceList = document.querySelector(".excellence-list");
    var excellenceListUl = excellenceList.querySelector("ul");
    var excellenceMobileMove = excellenceList.querySelector(".mobile-move");
    var excellenceTitle = excellence.querySelector(".f_header-type1");
    var eCard = excellenceList.querySelectorAll(".e-card");
  
    var _this;
  
    var totalW = 0;
    var excellenceSticky;
    var cloneList;
    var arrowClick = false;
    var blankDiv;
    var $subNavElem = $('#subnav');
    var $dotNav = $('.floating-navigation');
    var $stickyInner = $('.m_content-excellence .sticky-inner');
    var $sitckyHeader = $('.m_content-excellence .sticky-inner>.f_header-type1');
    var $eCard = $('.e-card');
    var $subNavHt;
    var $stickyInnerHt;
    var $stickyTop;
    var $totalHt;
    var $eCardHt;
    
    var init = function init() {
      _this = this;
  
      _this.resize();
  
      stickyMotion();
      slideMotion();
    }; // excellence sticky

    

  var stickyMotion = function stickyMotion() {
    var titleL = 0;
    var totalH = 0;
    var titleW = 0;
    var progress = 0;

    var _init = function _init() {
      cloneList = excellenceListUl.cloneNode(true);
      cloneList.setAttribute("aria-hidden", "true");
      cloneList.classList.add("clone-list");
      excellenceList.appendChild(cloneList);
      blankDiv = document.createElement("div");
      blankDiv.classList.add("blank-div");
      excellenceList.appendChild(blankDiv);

      _resize();

      if (document.documentElement.classList.contains("ie11")) {
        excellence.querySelector(".sticky-inner").style.marginTop = -totalH / 2 + "px";
      }
    };

    var _option = {
      align: "center",
      scroll: function scroll(percent) {
        _scroll(percent);
      },
      resize: function resize() {
        _this.resize();

        _resize();

        _scroll(progress);
      }
    };

    var _scroll = function _scroll(scroll) {
      var p = stickyPercent(scroll, 0, 0.9);
      var distance;

      if (!document.documentElement.classList.contains("rtl")) {
        distance = titleL - (totalW - titleW) * p;
      } else {
        distance = -titleL + (totalW - titleW) * p;
      }

      if (!document.documentElement.classList.contains("s1")) _this.move(distance);
    };

    var _jump = function _jump(idx) {
      var percent = idx / eCard.length;
      var fakeDiv = (excellence.clientHeight - window.innerHeight) * percent;
      setTimeout(function () {
        window.scrollTo(0, excellence.offsetTop + fakeDiv);
      }, 300);
    };

    var _keyup = function _keyup(el, idx) {
      if (!document.documentElement.classList.contains("s1")) {
        excellence.querySelector(".sticky-inner").scrollLeft = 0;

        _jump(idx);
      }
    };

    var _resize = function _resize() {
      titleL = excellenceTitle.offsetLeft;
      titleW = excellenceTitle.clientWidth;
      totalH = excellenceTitle.clientHeight;

      if (!document.documentElement.classList.contains("dotcom")) {
        $subNavHt = $subNavElem.height();
      } else {
        $subNavHt = $dotNav.height();
      }

      $stickyInnerHt = $stickyInner.height();
      $totalHt = $stickyInnerHt + 50;
      $stickyTop = $subNavHt;
      $eCardHt = $eCard.height();

      if (innerHeight - $subNavHt > $totalHt) {
        $stickyInner.css('top', $stickyTop + 50 + 'px');
      } else {
        $stickyInner.css('top', -totalH + $subNavHt + (innerHeight - $subNavHt - $eCardHt) / 2 + 'px');
      }
    };

    _init();

    var selectPostion = function selectPostion() {
      if (innerHeight - $subNavHt > $totalHt) {
        Object.assign(_option, {
          align: 'top'
        });
      } else {
        Object.assign(_option, {
          align: 'center'
        });
      }

      excellenceSticky = new scrollSticky(excellence, _option);
    }; // excellenceSticky = new scrollSticky(excellence, _option);


    var positionCheck = function positionCheck() {
      isSticky = $('.m_content-excellence').find('.sticky-inner').css('position');

      if (isSticky == 'static') {
        $('.m_content-excellence').addClass('_static');
      }
    };

    var fucusMove = function fucusMove() {
      var $excellence = $('.m_content-excellence'),
          $stickyInner = $excellence.find('.sticky-inner'),
          $listWrap = $excellence.find('.mobile-move'),
          $cardElem = $listWrap.find('.e-card');
      var $innerTop,
          $calcValue,
          $offsetTop,
          $currentIndex = 0,
          $result;
      var focusMove = {
        focus: function focus() {
          if ($(this).index() >= $cardElem.length - 2) {
            $currentIndex = $cardElem.length - 1;
          } else {
            $currentIndex = $(this).index();
          }

          $cardWidth = parseInt(($excellence.height() + $innerTop) * 0.9 / ($cardElem.length + 2));
          $calcValue = $cardWidth * $currentIndex;
          $offsetTop = $excellence.offset().top - $innerTop;
          $result = $offsetTop + $calcValue;
          window.scrollTo(0, $result);
        }
      };

      var defaultSet = function defaultSet() {
        $innerTop = $stickyInner.css('top').split('px')[0] * 1;
      };

      var bindEvent = function bindEvent() {
        $cardElem.on('keyup.focusMove', focusMove.focus);
      };

      var init = function init() {
        defaultSet();
        bindEvent();
      };

      init();
    };

    GALAXY.load(function () {
      selectPostion();
      positionCheck();
      fucusMove();
    });
  }; // excellence slide


  var slideMotion = function slideMotion() {
    var arrowWrap = excellenceList.querySelector(".excellence-arrow-wrap");
    var startP = window.innerWidth / 2 - eCard[0].clientWidth / 2;
    var endP = window.innerWidth / 2 - eCard[0].clientWidth / 2;
    var downStart = false;
    var totalIdx = 0;
    var slideMove = false;

    var _init = function _init() {
      _resize(); // _this.move(startP);


      var startEvent = ["mousedown", "touchstart"];
      var moveEvent = ["mousemove", "touchmove"];
      var endEvent = ["mouseup", "touchend"];
      startEvent.forEach(function (__this) {
        excellenceListUl.addEventListener(__this, function (e) {
          _touch.start(e);
        });
      });
      moveEvent.forEach(function (__this) {
        document.addEventListener(__this, function (e) {
          _touch.move(e);
        }, {
          passive: false
        });
      });
      endEvent.forEach(function (__this) {
        document.addEventListener(__this, function (e) {
          _touch.end(e);
        });
      });
      arrowWrap.querySelector(".prev").addEventListener("click", function (e) {
        _prev();
      });
      arrowWrap.querySelector(".next").addEventListener("click", function (e) {
        _next();
      });
      window.addEventListener("resize", function (e) {
        _resize();
      });
    };

    var _touch = {
      prevX: 0,
      prevY: 0,
      currentX: 0,
      moveX: startP,
      dragX: 0,
      endIdx: 0,
      start: function start(e) {
        if (!slideMove) {
          downStart = true;
          this.prevX = e.type != "touchstart" ? e.pageX : e.changedTouches[0].clientX;
          this.prevY = e.type != "touchstart" ? e.pageY : e.changedTouches[0].clientY;
        }
      },
      move: function move(e) {
        if (downStart && !slideMove && document.documentElement.classList.contains("s1")) {
          this.currentX = e.type != "touchmove" ? e.pageX : e.changedTouches[0].clientX;
          this.currentY = e.type != "touchmove" ? e.pageY : e.changedTouches[0].clientY;

          if (!document.documentElement.classList.contains("rtl")) {
            this.dragX = Math.min(startP, this.moveX + (this.currentX - this.prevX));
            this.dragX = Math.max(-totalW + window.innerWidth - endP, this.dragX);

            if (this.prevX - this.currentX > 0) {
              this.endIdx = Math.floor((eCard[0].clientWidth - this.dragX) / eCard[0].clientWidth);
            } else {
              this.endIdx = Math.floor((window.innerWidth / 4 - this.dragX) / eCard[0].clientWidth);
            }
          } else {
            this.dragX = Math.max(-startP, this.moveX + (this.currentX - this.prevX));
            this.dragX = Math.min(totalW - window.innerWidth + endP, this.dragX);

            if (this.prevX - this.currentX < 0) {
              this.endIdx = Math.floor((eCard[0].clientWidth + this.dragX) / eCard[0].clientWidth);
            } else {
              this.endIdx = Math.floor((window.innerWidth / 4 + this.dragX) / eCard[0].clientWidth);
            }
          }

          if (this.currentX > this.currentY && Math.abs(this.prevY - this.currentY) <= 80) {
            e.preventDefault();
          }

          e.preventDefault();

          _this.move(this.dragX);
        }
      },
      end: function end() {
        downStart = false;
        if (Math.abs(this.currentX) > 0) _jump(this.endIdx);
        this.prevX = 0;
        this.currentX = 0;
      }
    };

    var cardAriaHidden = function cardAriaHidden(idx) {
      eCard.forEach(function (i, index) {
        if (idx !== index) {
          i.setAttribute("aria-hidden", true);
          i.setAttribute("tabindex", -1);
          i.querySelectorAll("a").forEach(function (j) {
            j.setAttribute("aria-hidden", true);
            j.setAttribute("tabindex", -1);
          });
        } else {
          i.removeAttribute("aria-hidden");
          i.removeAttribute("tabindex");
          i.querySelectorAll("a").forEach(function (j) {
            j.removeAttribute("aria-hidden");
            j.removeAttribute("tabindex");
          });
        }

        if (!document.documentElement.classList.contains("s1")) {
          i.removeAttribute("aria-hidden");
          i.removeAttribute("tabindex");
          i.querySelectorAll("a").forEach(function (j) {
            j.removeAttribute("aria-hidden");
            j.removeAttribute("tabindex");
          });
        }
      });
    };

    var _jump = function _jump(idx) {
      if (!slideMove) {
        slideMove = true;
        var cardStart = eCard[idx].clientWidth * idx;
        var cardMargin;

        if (!document.documentElement.classList.contains("rtl")) {
          cardMargin = parseInt(window.getComputedStyle(eCard[eCard.length - 1]).getPropertyValue("margin-left"), 10) * idx;
        } else {
          cardMargin = parseInt(window.getComputedStyle(eCard[eCard.length - 1]).getPropertyValue("margin-right"), 10) * idx;
        }

        var cardCenter = window.innerWidth / 2 - eCard[idx].clientWidth / 2;
        var cardMove;
        var marginLeft = parseInt((innerWidth - $('.m_content-excellence .sticky-inner > .f_header-type1').width()) / 2);
        var cardPadding = $('.e-card').first().css('padding-left').split('px')[0];

        if (!document.documentElement.classList.contains("rtl")) {
          if (!document.documentElement.classList.contains("s1")) {
            cardMove = -cardStart - cardMargin + cardCenter;
          } else {
            if (idx == '0') {
              cardMove = parseInt(marginLeft - cardPadding);
            } else {
              cardMove = -cardStart - cardMargin + cardCenter;
            }
          }
        } else {
          if (!document.documentElement.classList.contains("s1")) {
            cardMove = cardStart + cardMargin - cardCenter;
          } else {
            if (idx == '0') {
              cardMove = -parseInt(marginLeft - cardPadding);
            } else {
              cardMove = cardStart + cardMargin - cardCenter;
            }
          }
        }

        if (idx === 0) {
          arrowWrap.querySelector(".prev").setAttribute('aria-hidden', 'true');
          arrowWrap.querySelector(".prev").setAttribute('tabIndex', '-1');
          arrowWrap.querySelector(".prev").classList.add('hide');

          if (arrowClick) {
            setTimeout(function () {
              arrowWrap.querySelector(".next").focus();
            }, 300);
          }
        } else {
          arrowWrap.querySelector(".prev").setAttribute('aria-hidden', 'false');
          arrowWrap.querySelector(".prev").removeAttribute('tabIndex');
          arrowWrap.querySelector(".prev").classList.remove('hide');
        }

        if (idx >= eCard.length - 1) {
          arrowWrap.querySelector(".next").setAttribute('aria-hidden', 'true');
          arrowWrap.querySelector(".next").setAttribute('tabIndex', '-1');
          arrowWrap.querySelector(".next").classList.add('hide');

          if (arrowClick) {
            setTimeout(function () {
              arrowWrap.querySelector(".prev").focus();
            }, 300);
          }
        } else {
          arrowWrap.querySelector(".next").setAttribute('aria-hidden', 'false');
          arrowWrap.querySelector(".next").removeAttribute('tabIndex');
          arrowWrap.querySelector(".next").classList.remove('hide');
        }

        var moveElement = !document.documentElement.classList.contains("s1") ? excellenceListUl : excellenceMobileMove;
        TweenMax.fromTo(moveElement, 0.5, {
          x: _touch.dragX
        }, {
          x: cardMove,
          ease: Quint.easeOut,
          onComplete: function onComplete() {
            _touch.moveX = cardMove;
            _touch.dragX = cardMove;
            totalIdx = idx;
            slideMove = false;
            arrowClick = false;
            cardAriaHidden(idx);
          }
        });
      }
    };

    var _prev = function _prev() {
      arrowClick = true;
      totalIdx = Math.max(0, totalIdx - 1);

      _jump(totalIdx);
    };

    var _next = function _next() {
      arrowClick = true;
      totalIdx = Math.min(eCard.length - 1, totalIdx + 1);

      _jump(totalIdx);
    };

    var fakeDiv = document.createElement("div");

    var _resize = function _resize() {
      startP = window.innerWidth / 2 - eCard[0].clientWidth / 2;
      endP = window.innerWidth / 2 - eCard[0].clientWidth / 2;
      if (document.documentElement.classList.contains("s1")) _jump(totalIdx);
      blankDiv.style.height = "var(--snbh)";
      var _snbh = blankDiv.clientHeight;

      if (window.innerHeight - cloneList.clientHeight - _snbh < 0) {
        // static
        excellence.classList.add("static");
      } else {
        // sticky
        excellence.classList.remove("static");
      }
    };

    GALAXY.load(function () {
      _init();
    });
  };

  var move = function move(_move) {
    var moveElement = !document.documentElement.classList.contains("s1") ? excellenceListUl : excellenceMobileMove;
    moveElement.style.transform = "translate3d(" + _move + "px,0px,0px) rotate(0.001deg)";
  };

  var resize = function resize() {
    totalW = 0;
    eCard.forEach(function (_this) {
      var _marginLeft;

      if (!document.documentElement.classList.contains("rtl")) {
        _marginLeft = parseInt(window.getComputedStyle(_this).getPropertyValue("margin-left"), 10);
      } else {
        _marginLeft = parseInt(window.getComputedStyle(_this).getPropertyValue("margin-left"), 10);
      }

      totalW += _this.clientWidth + _marginLeft;
    });
    excellenceListUl.style.width = totalW + "px";
  };

  return {
    init: init,
    move: move,
    resize: resize
  };

};
}

excellenceMotion();