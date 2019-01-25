$(document).ready(function() {
  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  ////////////
  // READY - triggered when PJAX DONE
  ////////////

  // single time initialization
  // legacySupport();
  initaos();
  var easingSwing = [0.02, 0.01, 0.47, 1];

  // on transition change
  // getPaginationSections();
  // pagination();
  // _window.on("scroll", throttle(pagination, 50));
  // _window.on("resize", debounce(pagination, 250));

  function pageReady() {
    initPopups();
    // initSliders();
    initValidations();
    initScrollMonitor();
  }

  _window.on("resize", debounce(setBreakpoint, 200));

  // this is a master function which should have all functionality
  pageReady();

  //////////
  // COMMON
  //////////

  function initaos() {
    AOS.init();
  }

  // HAMBURGER TOGGLER
  _document.on("click", "[js-hamburger]", function() {
    $(this).toggleClass("is-active");
    $(".header__buttons").toggleClass("is-active");
  });

  _document.on("click", ".faq__button", function(e) {
    e.preventDefault();
    $(".faq__item").removeClass("is-open");
    $(this)
      .parent()
      .toggleClass("is-open");
  });

  // header scroll
  _window.on(
    "scroll",
    throttle(function() {
      var scroll = _window.scrollTop();
      var headerHeight = $(".header").height();
      var heroHeight = $(".firstscreen").height();

      if (scroll > headerHeight) {
        $(".header").addClass("is-fixed-start");
        $(".popup__head").addClass("is-fixed");
      } else {
        $(".header").removeClass("is-fixed-start");
        $(".popup__head").removeClass("is-fixed");
      }
      if (scroll >= heroHeight - headerHeight / 2) {
        $(".header").addClass("is-fixed");
      } else {
        $(".header").removeClass("is-fixed");
      }
    }, 25)
  );

  // Prevent # behavior
  _document
    .on("click", '[href="#"]', function(e) {
      e.preventDefault();
    })
    .on("click", 'a[href^="#section"]', function(e) {
      // section scroll
      var el = $(this).attr("href");
      scrollToSection($(el));
      return false;
    })
    .on("click", "[js-close-popup]", function(e) {
      $(".mfp-close").click();
    });

  (function() {
    $(document).mouseup(function(e) {
      // событие клика по веб-документу
      var div = $("#popup-area"); // тут указываем ID элемента
      if (
        !div.is(e.target) && // если клик был не по нашему блоку
        div.has(e.target).length === 0
      ) {
        // и не по его дочерним элементам
        $(".mfp-close").click();
      }
    });
  })();

  function scrollToSection(el) {
    var headerHeight = 59;
    var targetScroll = el.offset().top - headerHeight;
    // document.scrollingElement || document.documentElement

    TweenLite.to(window, 1, {
      scrollTo: { y: targetScroll, autoKill: false },
      ease: easingSwing
    });
  }

  //////////
  // POPUP
  //////////

  function initPopups() {
    var startWindowScroll = 0;
    $("[js-popup]").magnificPopup({
      type: "inline",
      fixedContentPos: true,
      fixedBgPos: true,
      overflowY: "auto",
      closeBtnInside: true,
      preloader: false,
      midClick: true
      // removalDelay: 500,
      // mainClass: "popup-buble",
      // callbacks: {
      //   beforeOpen: function() {
      //     startWindowScroll = _window.scrollTop();
      //     this.st.mainClass = this.st.el.attr("data-effect");
      //     // $('html').addClass('mfp-helper');
      //   },
      //   close: function() {
      //     // $('html').removeClass('mfp-helper');
      //     _window.scrollTop(startWindowScroll);
      //   }
      // }
    });
  }

  //////////
  // SLIDERS
  //////////

  // function initSliders() {
  //   var gallerySwiper = new Swiper("[js-slider-team-main]", {
  //     wrapperClass: "swiper-wrapper",
  //     loop: false,
  //     watchOverflow: false,
  //     setWrapperSize: true,
  //     spaceBetween: 0,
  //     slidesPerView: 1,
  //     effect: "fade",
  //     fadeEffect: {
  //       crossFade: true
  //     },
  //     speed: 300,
  //     pagination: {
  //       el: ".swiper-pagination",
  //       clickable: true
  //     },
  //     navigation: {
  //       nextEl: ".swiper-button-next",
  //       prevEl: ".swiper-button-prev"
  //     }
  //   });
  // }

  ////////////////
  // FORM VALIDATIONS
  ////////////////

  // jQuery validate plugin
  // https://jqueryvalidation.org
  function initValidations() {
    // GENERIC FUNCTIONS
    var validateErrorPlacement = function(error, element) {
      error.addClass("ui-input__validation");
      error.appendTo(element.parent("div"));
    };
    var validateHighlight = function(element) {
      $(element)
        .parent("div")
        .addClass("has-error");
    };
    var validateUnhighlight = function(element) {
      $(element)
        .parent("div")
        .removeClass("has-error");
    };
    var validateSubmitHandler = function(form) {
      $(form).addClass("loading");

      $.ajax({
        type: "POST",
        url: $(form).attr("action"),
        data: $(form).serialize(),
        success: function(data) {
          $(form).removeClass("loading");
          $.magnificPopup.open({
            items: {
              src: "#thankpopup",
              type: "inline"
            }
          });
        },
        error: function(data) {
          $.magnificPopup.open({
            items: {
              src: "#errorpopup",
              type: "inline"
            }
          });
        }
      });
      setTimeout(function() {
        $.magnificPopup.close();
      }, 50000);
    };

    /////////////////////
    // LEAD FORM
    ////////////////////

    // function emailIsValid(value) {
    //   var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //   return emailRegex.test(value);
    // }

    // function phoneIsValid(value) {
    //   // https://www.regextester.com/99415
    //   var phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    //   return phoneRegex.test(value);
    // }

    // $.validator.addMethod("isPhoneMail", function(value, element) {
    //   return emailIsValid(value) || phoneIsValid(value);
    // });

    $(".js-f-form").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        name: "required",
        phone: "required",
        mail: "required"
      },
      messages: {
        name: "Необходимо заполнить",
        phone: "Введите пароль",
        mail: "Введите e-mail"
      }
    });

    $(".js-f-form2").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        name: "required",
        phone: "required",
        mail: "required"
      },
      messages: {
        name: "Необходимо заполнить",
        phone: "Введите пароль",
        mail: "Введите e-mail"
      }
    });
  }

  ////////////
  // REVEAL FUNCTIONS
  ////////////
  function initScrollMonitor(fromPjax) {
    $("[js-reveal]").each(function(i, el) {
      var type = $(el).data("type") || "halflyEnterViewport";

      if (type === "halflyEnterViewport") {
        var scrollListener = throttle(function() {
          var vScrollBottom = _window.scrollTop() + _window.height();
          var elTop = $(el).offset().top;
          var triggerPoint = elTop + $(el).height() / 2;

          if (vScrollBottom > triggerPoint) {
            $(el).addClass("is-animated");
            window.removeEventListener("scroll", scrollListener, false); // clear debounce func
          }
        }, 100);

        window.addEventListener("scroll", scrollListener, false);
        return;
      }
    });
  }

  //////////
  // DEVELOPMENT HELPER
  //////////
  function setBreakpoint() {
    var wHost = window.location.host.toLowerCase();
    var displayCondition =
      wHost.indexOf("localhost") >= 0 || wHost.indexOf("surge") >= 0;
    if (displayCondition) {
      var wWidth = _window.width();

      var content = "<div class='dev-bp-debug'>" + wWidth + "</div>";

      $(".page").append(content);
      setTimeout(function() {
        $(".dev-bp-debug").fadeOut();
      }, 1000);
      setTimeout(function() {
        $(".dev-bp-debug").remove();
      }, 1500);
    }
  }

  // some plugins get bindings onNewPage only that way
  function triggerBody() {
    $(window).scroll();
    $(window).resize();
  }
});
