$(document).ready(function(){
    $('.slider').slick({
        arrows: true,
        slidesToShow: 1,
        autoplay:true, 
    });
});
$('.slider2').slick({
    arrows:true,
    infinite: true,
    dots:true,
    slidesToShow: 2,
    slidesToScroll: 2,
    autoplay:true,
    autoplaySpeed:4000,
  });