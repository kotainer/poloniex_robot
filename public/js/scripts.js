$(document).ready(function () {

  /*Page Navigation*/
  $(".menu-list-wrap a, footer .middle-col a").mPageScroll2id({
    offset: 100,
    scrollSpeed: 700
  });
  // Header slider
  $("header .slider").slick({
    arrows: false,
    autoplay: false,
    autoplaySpeed: 3000,
    dots: true,
    focusOnSelect: true,
    dotsClass: 'container dots-wrap'
  });
  $('.jwg_slider_module').jwgSlider('both', 400);

  $('.s3  .slider-nav').slick({
    swipeToSlide: true,
    autoplay: false,
    adaptiveHeight: true,
    autoplaySpeed: 10000,
    centerPadding: '10px',
    slidesToShow: 5,
    centerMode: true,
    asNavFor: '.slider-for',
    arrows: false,
    dots: false,
    infinite: true,

    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          arrows: false
        }
      }]
  });
  $('.s3 .slider-for').slick({
    slidesToShow: 1,
    fade: true,
    asNavFor: '.slider-nav',
    arrows: true
  });

  // faq page show answer
  $(".faq .question").click(function () {
    $(this).find(".q-arrow").toggleClass("blue");
    $(this).toggleClass("blue");
    $(this).siblings().slideToggle();
  });

  // feedback page show full-text
  $(".feedback .show-all").click(function () {
    console.log('here');
    $(this).css('display', 'none');
    $(this).siblings(".user-preview-text").css('display', 'none');
    $(this).siblings(".user-full-text").css('display', 'block');
  });
  // s2 tabs
  $(function () {
    $('.tabs nav a').on('click', function () {
      show_content($(this).index());
    });

    show_content(0);

    function show_content(index) {
      // Make the content visible
      $('.tabs .content.visible').removeClass('visible');
      $('.tabs .content:nth-of-type(' + (index + 1) + ')').addClass('visible');

      // Set the tab to selected
      $('.tabs nav a.selected').removeClass('selected');
      $('.tabs nav a:nth-of-type(' + (index + 1) + ')').addClass('selected');
    }

  });
});
