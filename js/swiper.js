const swiper = new Swiper('.swiper', {
    autoplay: {
      delay: 3000,
    },
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
   });