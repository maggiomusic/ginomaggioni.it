(function () {
  "use strict";

  var GALLERIES = {
    "grid-mobili": {
      folder: "media/Archiviomobili",
      title: "Archivio mobili",
      files: [
        "1770549749672030.jpg",
        "1770550369671968.jpg",
        "1770551246338547.jpg",
        "1770551386338533.jpg",
        "1770551469671858.jpg"
      ]
    },
    "grid-brevetto": {
      folder: "media/BrevettoCurvatiMaggioni",
      title: "Brevetto Curvati Maggioni",
      files: [
        "1782383608488644.jpg",
        "1782383628488642.jpg",
        "1782383631821975.jpg",
        "1782383758488629.jpg",
        "1782383781821960.jpg",
        "1782383791821959.jpg",
        "1782383905155281.jpg",
        "1782383931821945.jpg",
        "1782384345155237.jpg",
        "media/Foto varie/biglietto_fiera_mobilio_1939.jpg"
      ]
    },
    "grid-sculture": {
      folder: "media/Sculture_1770538639673141",
      title: "Sculture",
      files: [
        "1770538889673116.jpg",
        "1770538986339773.jpg",
        "1770539336339738.jpg",
        "1770539589673046.jpg",
        "1770539753006363.jpg",
        "1770539863006352.jpg",
        "1770540073006331.jpg",
        "1770540143006324.jpg",
        "1770540439672961.jpg",
        "1770540596339612.jpg",
        "1770540709672934.jpg",
        "1770540819672923.jpg",
        "1770540913006247.jpg",
        "1770540956339576.jpg",
        "1770541026339569.jpg",
        "1770541079672897.jpg",
        "1770541129672892.jpg",
        "1770541236339548.jpg",
        "1770541399672865.jpg",
        "1770541899672815.jpg",
        "1770542739672731.jpg",
        "1770546236339048.jpg",
        "1770548163005522.jpg",
        "1771113489615656.jpg",
        "1771113936282278.jpg",
        "1771114196282252.jpg"
      ]
    },
    "grid-disegni": {
      folder: "media/Disegni",
      title: "Disegni",
      files: [
        "1771107659616239.jpg",
        "1771107949616210.jpg",
        "1771108549616150.jpg",
        "1771108869616118.jpg",
        "1771109172949421.jpg",
        "1771109276282744.jpg",
        "1771109579616047.jpg",
        "1771109759616029.jpg",
        "1771110519615953.jpg"
      ]
    },
    "grid-nido": {
      folder: "media/ilNido",
      title: "Il Nido",
      files: [
        "1771125259614479.jpg",
        "1771125262947812.jpg",
        "1771125266281145.jpg",
        "1771125349614470.jpg",
        "1771125352947803.jpg",
        "1771125362947802.jpg",
        "1771125472947791.jpg",
        "1771125482947790.jpg",
        "1782380201822318.jpg",
        "1782380411822297.jpg",
        "1782380551822283.jpg",
        "1782380615155610.jpg"
      ]
    }
  };

  var allImages = [];

  function buildGrids() {
    Object.keys(GALLERIES).forEach(function (gridId) {
      var gallery = GALLERIES[gridId];
      var grid = document.getElementById(gridId);
      if (!grid) return;

      gallery.files.forEach(function (file) {
        var src = encodeURI(file.indexOf("/") >= 0 ? file : gallery.folder + "/" + file);
        var index = allImages.length;
        allImages.push({ src: src, title: gallery.title });

        var item = document.createElement("div");
        item.className = "grid__item";
        item.setAttribute("data-index", index);

        var img = document.createElement("img");
        img.src = src;
        img.alt = gallery.title;
        img.loading = "lazy";

        item.appendChild(img);
        item.addEventListener("click", function () {
          openLightbox(index);
        });
        grid.appendChild(item);
      });
    });
  }

  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    renderLightbox();
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function renderLightbox() {
    var item = allImages[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;
    lightboxCaption.textContent = item.title + " — " + (currentIndex + 1) + " / " + allImages.length;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % allImages.length;
    renderLightbox();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    renderLightbox();
  }

  window.addEventListener("load", function () {
    document.documentElement.classList.add("is-ready");
  });

  document.addEventListener("DOMContentLoaded", function () {
    buildGrids();

    document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
    document.getElementById("lightboxNext").addEventListener("click", showNext);
    document.getElementById("lightboxPrev").addEventListener("click", showPrev);

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    });

    var navToggle = document.getElementById("navToggle");
    var navLinks = document.getElementById("navLinks");
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("is-open");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
      });
    });
  });
})();
