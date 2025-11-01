$(function() {
  var $history = $("#history");
  if (!$history.length) return;
  var historyEl = $history[0];

  function getElems() {
    return {
      figure: $history.find("figure")[0],
      heading: $history.find("h2")[0],
      paragraph: $history.find("p")[0]
    };
  }

  function adjustHistoryHeight() {
    var els = getElems();
    var figure = els.figure, heading = els.heading, paragraph = els.paragraph;
    if (!figure || !heading || !paragraph) {
      $history.css("minHeight", "");
      return;
    }

    var isWide = window.matchMedia("(min-width: 767.98px)").matches;
    if (!isWide) {
      requestAnimationFrame(function() { $history.css("minHeight", ""); });
      return;
    }

    var figureHeight = figure.offsetHeight;
    var headingHeight = heading.offsetHeight;
    var paragraphHeight = paragraph.offsetHeight;

    var targetHeight = Math.max(
      figureHeight,
      headingHeight + paragraphHeight,
      figureHeight + headingHeight
    );

    requestAnimationFrame(function() {
      $history.css("minHeight", targetHeight + "px");
    });
  }

  function debounce(fn, wait) {
    wait = wait || 100;
    var t = null;
    return function() {
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function() {
        fn.apply(null, args);
      }, wait);
    };
  }

  var debouncedAdjust = debounce(adjustHistoryHeight, 100);

  if (typeof ResizeObserver !== "undefined") {
    var ro = new ResizeObserver(debouncedAdjust);
    function observeCurrent() {
      var els = getElems();
      ro.disconnect();
      ro.observe(historyEl);
      if (els.figure) ro.observe(els.figure);
      if (els.heading) ro.observe(els.heading);
      if (els.paragraph) ro.observe(els.paragraph);
    }

    observeCurrent();

    var mo = new MutationObserver(function(mutations) {
      var needsReobserve = false;
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === "childList" && m.addedNodes.length) {
          needsReobserve = true;
          break;
        }
      }
      if (needsReobserve) {
        observeCurrent();
        debouncedAdjust();
      }
    });

    mo.observe(historyEl, { childList: true, subtree: true });
    debouncedAdjust();
  } else {
    debouncedAdjust();
    $(window).on("resize", debouncedAdjust);

    function attachImgListeners(img) {
      if (img.complete) {
        debouncedAdjust();
      } else {
        $(img).on("load error", debouncedAdjust);
      }
    }

    $history.find("img").each(function() { attachImgListeners(this); });

    var mo = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        for (var j = 0; j < m.addedNodes.length; j++) {
          var node = m.addedNodes[j];
          if (node.nodeType !== 1) continue;
          if (node.tagName === "IMG") attachImgListeners(node);
          if (node.querySelectorAll) {
            var imgs = node.querySelectorAll("img");
            for (var k = 0; k < imgs.length; k++) attachImgListeners(imgs[k]);
          }
        }
      }
      debouncedAdjust();
    });

    mo.observe(historyEl, { childList: true, subtree: true });
  }
});
