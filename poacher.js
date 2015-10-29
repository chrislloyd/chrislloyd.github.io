// Generated by CoffeeScript 1.10.0
(function() {
  var Artist, delay, rand, sample;

  rand = function(n) {
    return Math.floor(Math.random() * n);
  };

  sample = function(arr) {
    return arr[rand(arr.length)];
  };

  delay = function(time, fn) {
    return setTimeout(fn, time);
  };

  window.Artist = Artist = (function() {
    Artist.brushes = [];

    Artist.add = function(fn) {
      return this.brushes.push(fn);
    };

    function Artist(element, width, height, visibleWidth, visibleHeight) {
      this.elm = element;
      this.width = width;
      this.height = height;
      this.visibleWidth = visibleWidth;
      this.visibleHeight = visibleHeight;
      this.paper = Raphael(this.elm[0], this.width, this.height);
      $(this.paper.canvas).css({
        left: -0.5 * (this.width - this.visibleWidth),
        top: -0.5 * (this.height - this.visibleHeight)
      });
    }

    Artist.prototype.backgrounds = ['#EEE', '#036'];

    Artist.prototype.colors = ['#FFF', '#06C', '#F33', '#003'];

    Artist.prototype.clear = function() {
      return this.paper.clear();
    };

    Artist.prototype.draw = function() {
      var focus, i, j, ref, results;
      this.bg = this.paper.rect(0, 0, this.width, this.height).attr({
        fill: sample(this.backgrounds),
        stroke: 'none'
      });
      focus = {
        x: (this.width - this.visibleWidth) * 0.5 + rand(this.visibleWidth),
        y: (this.height - this.visibleHeight) * 0.5 + rand(this.visibleHeight)
      };
      results = [];
      for (i = j = 0, ref = 1 + rand(3); 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        results.push(sample(this.constructor.brushes).call(this.paper, sample(this.colors), focus));
      }
      return results;
    };

    Artist.prototype.serialize = function(node, tree) {
      node || (node = this.paper.bottom);
      tree || (tree = []);
      tree.push([node.type, node.attrs]);
      if (node.next != null) {
        this.serialize(node.next, tree);
      }
      return tree;
    };

    Artist.prototype.load = function(raw) {
      var attrs, heart, instruction, instructions, j, len, obj, results, type;
      heart = this.elm.parent();
      instructions = JSON.parse(raw);
      results = [];
      for (j = 0, len = instructions.length; j < len; j++) {
        instruction = instructions[j];
        type = instruction[0], attrs = instruction[1];
        obj = this.paper[type]();
        results.push(obj.attr(attrs));
      }
      return results;
    };

    return Artist;

  })();

  $(document).ready(function() {
    var art, frame, heart, options, refresh;
    $('script[type=text/x-brush]').each(function() {
      return eval(CoffeeScript.compile(this.innerHTML));
    });
    frame = $('#frame');
    options = $('#art-options');
    refresh = options.find('a.refresh');
    heart = options.find('a.heart');
    art = new Artist(frame.find('#art'), 960, 320, 700, frame.height());
    art.draw();
    heart.bind('webkitAnimationEnd', function() {
      return heart.removeClass('failed');
    });
    refresh.click(function() {
      if (heart.hasClass('hearting') || heart.hasClass('failed')) {
        return false;
      }
      art.clear();
      heart.removeClass('hearted').removeClass('failed');
      frame.find('.grain').css('backgroundPosition', (rand(100)) + "px " + (rand(100)) + "px");
      if (typeof _gaq !== "undefined" && _gaq !== null) {
        _gaq.push(['_trackEvent', 'art', 'refreshed']);
      }
      art.draw();
      return false;
    });
    return $('script[type=text/x-cereal-artwork]').each(function() {
      var self, work;
      self = $(this);
      work = new Artist(self.parent(), 900, 320, 180, 180);
      return work.load(this.innerHTML);
    });
  });

}).call(this);
