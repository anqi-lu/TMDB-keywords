/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scatterPlot__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__wordcloud__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__line__ = __webpack_require__(4);





d3.json('data/keywords.json', _keywords => {
d3.json('data/genres.json', _genres => {

  /**
   * Fetches the *correct* data given a genre.
   * @param {str} genre - subset of data to fetch.
   */
  const getData = (genre) => {
    var word_count = []; 
    if (genre == "all") {
      for (var word in _keywords) {
        word_count.push({
          key: word,
          value: _keywords[word]['total_count']
        });
      }
      return {
        keywords: _keywords,
        word_count: word_count
      }
    }
    const data = _genres[genre];    
    const keywords = data['keywords'];
    for (var word in keywords) {
      word_count.push({
        key: word,
        value: keywords[word]['count']
      });
    }
    return {
      keywords: keywords,
      word_count: word_count
    }
  }

  /* Drawing wordcloud */
  const wordcloud = d3.select('#wordcloud');
  const wordcloudDiv = wordcloud.node();
  const svgWordcloud = wordcloud.select('svg');

  /* Drawing linechart */
  const selectedWords = [];
  const margin = { left: 50, right: 20, top: 20, bottom: 200, top2: 470, bottom2: 30};
  const lineId = d3.select('#line');
  const lineDiv = lineId.node();
  const svgLine = lineId.select('svg');

  const lineChart = new __WEBPACK_IMPORTED_MODULE_2__line__["a" /* default */]({
    svgLine,
    margin
  }); 


  const getWordClass = function(word) {
    var index = selectedWords.indexOf(word);
    if (index > -1) {
      return "texts selected";
    } else {
      return "texts unselected";
    }
  }


  /* Render function */
  const render = (_data) => {
    const {keywords, word_count} = _data;
    //console.log(keywords, word_count)
    const textColor = function(word) {
      const color = d3.scaleOrdinal(d3.schemeCategory20)
        .domain(Object.keys(keywords))
      return color(word);
    }
    const updateSelectedWords = function(word) {
      var index = selectedWords.indexOf(word);
      if (index > -1) {
        selectedWords.splice(index, 1);
      } else {
        selectedWords.push(word);
      }

      const data = selectedWords.map(word => {
        const years = [];
        const obj = keywords[word];
        for (var year in obj.years) {
          years.push({
            year: year,
            freq: obj['years'][year]  
          });
        }
        const datum = {
          word: word,
          data: years
        };
        return datum;
      });
      lineChart.renderChart(data, (word) => textColor(word));
    }
    
    // Extract the width and height that was computed by CSS.
    svgLine
      .attr('width', lineDiv.clientWidth)
      .attr('height', lineDiv.clientHeight);

    // Render the word cloud.
    Object(__WEBPACK_IMPORTED_MODULE_1__wordcloud__["a" /* default */])(svgWordcloud, word_count, updateSelectedWords, getWordClass, (word) => textColor(word));   
  }

  /**
   * Switches from one genre to another.
   * @param {str} genre - to switch to.
   */
  function switchGenre(genre) {
    // Must reset as not all genre have all words.
    selectedWords.length = 0; // empty array w/o re-assign.

    render(getData(genre));
  }

  /**
   * Adds event handles to check-boxes.
   */
  function initGenreCheckboxes() {
    const genres = [
      "all",
      "romance",
      "sci-fi",
      "horror",
      "crime",
      "drama",
      "fantasy",
      "adventure",
      "action",
      "comedy",
      "thriller"
    ];
    genres.forEach(
        g => {
          document
              .getElementById(g)
              .onchange = () => switchGenre(g)
        }
    );  
  }

  // Draw for the first time to initialize.
  
  render(getData('all'));
  initGenreCheckboxes();

  // Redraw based on the new size whenever the browser window is resized.
  // window.addEventListener('resize', () => render(data));

// Closing keywords and genre.
});});



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();
const colorScale = d3.scaleOrdinal()
  .range(d3.schemeCategory10);

const xAxis = d3.axisBottom()
  .scale(xScale)
  .tickPadding(15);

const yAxis = d3.axisLeft()
  .scale(yScale)
  .ticks(5)
  .tickPadding(15);

const colorLegend = d3.legendColor()
  .scale(colorScale)
  .shape('circle');

/* unused harmony default export */ var _unused_webpack_default_export = (function (svg, props) {
  const { 
    data,
    xValue,
    xLabel,
    yValue,
    yLabel,
    colorValue,
    colorLabel,
    margin
  } = props;

  const width = svg.attr('width');
  const height = svg.attr('height');
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  xAxis.tickSize(-innerHeight);
  yAxis.tickSize(-innerWidth);

  let g = svg.selectAll('.container').data([null]);
  const gEnter = g.enter().append('g').attr('class', 'container');
  g = gEnter
    .merge(g)
      .attr('transform', `translate(${margin.left},${margin.top})`);

  const xAxisGEnter = gEnter.append('g').attr('class', 'x-axis');
  const xAxisG = xAxisGEnter
    .merge(g.select('.x-axis'))
      .attr('transform', `translate(0, ${innerHeight})`);

  const yAxisGEnter = gEnter.append('g').attr('class', 'y-axis');
  const yAxisG = yAxisGEnter.merge(g.select('.y-axis'));

  const colorLegendGEnter = gEnter.append('g').attr('class', 'legend');
  const colorLegendG = colorLegendGEnter
    .merge(g.select('.legend'))
      .attr('transform', `translate(${innerWidth + 60}, 150)`);

  xAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
      .attr('y', 100)
    .merge(xAxisG.select('.axis-label'))
      .attr('x', innerWidth / 2)
      .text(xLabel);

  yAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
      .attr('y', -60)
      .style('text-anchor', 'middle')
    .merge(yAxisG.select('.axis-label'))
      .attr('x', -innerHeight / 2)
      .attr('transform', `rotate(-90)`)
      .text(yLabel);

  colorLegendGEnter
    .append('text')
      .attr('class', 'legend-label')
      .attr('x', -30)
      .attr('y', -40)
    .merge(colorLegendG.select('legend-label'))
      .text(colorLabel);

  xScale
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  yScale
    .domain(d3.extent(data, yValue))
    .range([innerHeight, 0])
    .nice();

  const circles = g.selectAll('.mark').data(data);
  circles
    .enter().append('circle')
      .attr('class', 'mark')
      .attr('fill-opacity', 0.6)
      .attr('r', 8)
    .merge(circles)
      .attr('cx', d => xScale(xValue(d)))
      .attr('cy', d => yScale(yValue(d)))
      .attr('fill', d => colorScale(colorValue(d)));

  xAxisG.call(xAxis);
  yAxisG.call(yAxis);
  colorLegendG.call(colorLegend)
    .selectAll('.cell text')
      .attr('dy', '0.1em');
});


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__d3_layout_cloud__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__d3_layout_cloud___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__d3_layout_cloud__);


/* harmony default export */ __webpack_exports__["a"] = (function (svg_location, word_count, updateSelectedWords, getWordClass, textColor, props){

    var chart = renderChart()
        .svgHeight(400)
        .container('#wordcloud')
        .data({ values: word_count })
        .responsive(true)
        .run();
     
  /*  
  
  This code is based on following convention:
  https://github.com/bumbeishvili/d3-coding-conventions
  
  */

  function renderChart(params) {
  
    // exposed variables
    var attrs = {
      id: 'id' + Math.floor((Math.random() * 1000000)),
      svgWidth: 400,
      svgHeight: 400,
      marginTop: 5,
      marginBottom: 5,
      marginRight: 5,
      marginLeft: 5,
      container: 'body',
      responsive: false,
      data: null
    };
  
    /*############### IF EXISTS OVERWRITE ATTRIBUTES FROM PASSED PARAM  #######  */
  
    var attrKeys = Object.keys(attrs);
    attrKeys.forEach(function (key) {
      if (params && params[key]) {
        attrs[key] = params[key];
      }
    })
  
    //innerFunctions which will update visuals
    var updateData;
  
    //main chart object
    var main = function (selection) {
      selection.each(function scope() {
        //get container
        var container = d3.select(this);
  
        if (attrs.responsive) {
          setDimensions();
        }
        //calculated properties
        var calc = {}
        calc.chartLeftMargin = attrs.marginLeft;
        calc.chartTopMargin = attrs.marginTop;
        calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
        calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
        calc.centerX = calc.chartWidth / 2;
        calc.centerY = calc.chartHeight / 2;
        calc.minMax = d3.extent(attrs.data.values, d => d.value);
  
        //drawing containers
  
  
        //#####################   SCALES  ###################
        var scales = {};
        scales.fontSize = d3.scaleSqrt()
          .range([20, 100])
          .domain(calc.minMax);
  
        scales.color = d3.scaleOrdinal(d3.schemeCategory20b);
  
        var dispatch = d3.dispatch('wordClick');
        
  
        //######################  LAYOUTS  #################
        var layouts = {};
        layouts.cloud = __WEBPACK_IMPORTED_MODULE_0__d3_layout_cloud__()
          .timeInterval(Infinity)
          .size([calc.chartWidth, calc.chartHeight])
          .rotate(0)
          .fontSize(function (d) {
            return scales.fontSize(+d.value);
          })
          
          .text(function (d) {
            return d.key;
          })
          .font('Impact')
          .spiral('archimedean')
          .stop()
          .words(attrs.data.values)
          .on("end", function (bounds) {
  
            var index = bounds ? Math.min(
              calc.chartWidth / Math.abs(bounds[1].x - calc.centerX),
              calc.chartWidth / Math.abs(bounds[0].x - calc.centerX),
              calc.chartHeight / Math.abs(bounds[1].y - calc.centerY),
              calc.chartHeight / Math.abs(bounds[0].y - calc.centerY)) / 2 : 1;
  
            dispatch.on('wordClick', function(d){
              updateSelectedWords(d.text);
              var texts = patternify({ container: centerPoint, selector: 'texts', elementTag: 'text', data: attrs.data.values })
              texts.attr("class", z => getWordClass(z.text))
                .style("fill", function (d) {
                if (getWordClass(d.text) == "texts selected"){
                  return textColor(d.text);
                }           
              })
            });


            var texts = patternify({ container: centerPoint, selector: 'texts', elementTag: 'text', data: attrs.data.values })
  
            texts.attr("text-anchor", "middle")
              .attr("class", d => getWordClass(d.text))
              .attr("transform", function (d) {
                return "translate(0,0)rotate( 0)";
              })
              .style("font-size", function (d) {
                return 2 + "px";
              })
              .style("opacity", 1e-6)
              .style("fill", "lightgrey")
              .text(function (d) {
                return d.text;
              })
              .on('click', d => dispatch.call('wordClick', this, d) );
              
              
            texts.transition()
              .duration(1000)
              .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
              })
              .style("font-size", function (d) {
                return d.size + "px";
              })
              .style("opacity", 1)
              .style("font-family", function (d) {
                return d.font;
              })
  
          });
  
  
  
        //add svg
        var svg = patternify({ container: container, selector: 'svg-chart-container', elementTag: 'svg' })
        svg.attr('width', attrs.svgWidth)
          .attr('height', attrs.svgHeight)
        // .attr("viewBox", "0 0 " + attrs.svgWidth + " " + attrs.svgHeight)
        // .attr("preserveAspectRatio", "xMidYMid meet")
  
        //add container g element
        var chart = patternify({ container: svg, selector: 'chart', elementTag: 'g' })
        chart.attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')');
  
        //add center point
        var centerPoint = patternify({ container: chart, selector: 'center-point', elementTag: 'g' })
          .attr('transform', `translate(${calc.centerX},${calc.centerY})`)
  
  
        layouts.cloud.start();
  
  
        // ##################   EVENT LISTENERS   ################
        d3.select(window).on('resize.' + attrs.id, function () {
          setDimensions();
          redraw();
        })
  
        // smoothly handle data updating
        updateData = function () {
  
  
        }
  
  
  
  
        //#########################################  UTIL FUNCS ##################################
  
        //enter exit update pattern principle
        function patternify(params) {
          var container = params.container;
          var selector = params.selector;
          var elementTag = params.elementTag;
          var data = params.data || [selector];
          if (!container) {
            debugger;
          }
          // pattern in action
          var selection = container.selectAll('.' + selector).data(data)
          selection.exit().remove();
          selection = selection.enter().append(elementTag).merge(selection)
          selection.attr('class', selector);
          return selection;
        }
  
        function setDimensions() {
          var width = container.node().getBoundingClientRect().width;
          main.svgWidth(width);
          // if width is too small, change attrs.fontSize too e.t.c
        }
  
        function redraw() {
          container.call(main);
        }
  
        function debug() {
          if (attrs.isDebug) {
            //stringify func
            var stringified = scope + "";
  
            // parse variable names
            var groupVariables = stringified
              //match var x-xx= {};
              .match(/var\s+([\w])+\s*=\s*{\s*}/gi)
              //match xxx
              .map(d => d.match(/\s+\w*/gi).filter(s => s.trim()))
              //get xxx
              .map(v => v[0].trim())
  
            //assign local variables to the scope
            groupVariables.forEach(v => {
              main['P_' + v] = eval(v)
            })
          }
        }
  
        debug();
      });
    };
  
    //dinamic functions
    Object.keys(attrs).forEach(key => {
      // Attach variables to main function
      return main[key] = function (_) {
        var string = `attrs['${key}'] = _`;
        if (!arguments.length) { return eval(` attrs['${key}'];`); }
        eval(string);
        return main;
      };
    });
  
    //set attrs as property
    main.attrs = attrs;
  
    //debugging visuals
    main.debug = function (isDebug) {
      attrs.isDebug = isDebug;
      if (isDebug) {
        if (!window.charts) window.charts = [];
        window.charts.push(main);
      }
      return main;
    }
  
    //exposed update functions
    main.data = function (value) {
      if (!arguments.length) return attrs.data;
      attrs.data = value;
      if (typeof updateData === 'function') {
        updateData();
      }
      return main;
    }
  
    // run  visual
    main.run = function () {
      d3.selectAll(attrs.container).call(main);
      return main;
    }
  
    return main;
  }
  
});

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// Word cloud layout by Jason Davies, http://www.jasondavies.com/word-cloud/
// Algorithm due to Jonathan Feinberg, http://static.mrfeinberg.com/bv_ch03.pdf



(function () {
  
  function cloud() {
    // missing from d3.v4 so we just copying from v3
    // Copies a variable number of methods from source to target.
    d3.rebind = function (target, source) {
      var i = 1, n = arguments.length, method;
      while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
      return target;
    };

    // Method is assumed to be a standard D3 getter-setter:
    // If passed with no arguments, gets the value.
    // If passed with arguments, sets the value and returns the target.
    function d3_rebind(target, source, method) {
      return function () {
        var value = method.apply(source, arguments);
        return value === source ? target : value;
      };
    }

    function d3_functor(v) {
      return typeof v === "function" ? v : function () { return v; };
    }

    d3.functor = d3_functor;
    var size = [256, 256],
      text = cloudText,
      font = cloudFont,
      fontSize = cloudFontSize,
      fontStyle = cloudFontNormal,
      fontWeight = cloudFontNormal,
      rotate = cloudRotate,
      padding = cloudPadding,
      spiral = archimedeanSpiral,
      words = [],
      timeInterval = Infinity,
      event = d3.dispatch("word", "end"),
      timer = null,
      cloud = {};

    cloud.start = function () {
      var board = zeroArray((size[0] >> 5) * size[1]),
        bounds = null,
        n = words.length,
        i = -1,
        tags = [],
        data = words.map(function (d, i) {
          d.text = text.call(this, d, i);
          d.font = font.call(this, d, i);
          d.style = fontStyle.call(this, d, i);
          d.weight = fontWeight.call(this, d, i);
          d.rotate = rotate.call(this, d, i);
          d.size = ~~fontSize.call(this, d, i);
          d.padding = padding.call(this, d, i);
          return d;
        }).sort(function (a, b) { return b.size - a.size; });

      if (timer) clearInterval(timer);
      timer = setInterval(step, 0);
      step();

      return cloud;

      function step() {
        var start = +new Date,
          d;
        while (+new Date - start < timeInterval && ++i < n && timer) {
          d = data[i];
          d.x = (size[0] * (Math.random() + .5)) >> 1;
          d.y = (size[1] * (Math.random() + .5)) >> 1;
          cloudSprite(d, data, i);
          if (d.hasText && place(board, d, bounds)) {
            tags.push(d);
            //  event.word(d);
            if (bounds) cloudBounds(bounds, d);
            else bounds = [{ x: d.x + d.x0, y: d.y + d.y0 }, { x: d.x + d.x1, y: d.y + d.y1 }];
            // Temporary hack
            d.x -= size[0] >> 1;
            d.y -= size[1] >> 1;
          }
        }
        if (i >= n) {
          cloud.stop();
          if (d3.version.startsWith('4.')) {
            event.call('end',tags, bounds);
          } else if (d3.version.startsWith('3.')) {
            event.end(tags, bounds);
          };

        }
      }
    }

    cloud.stop = function () {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      return cloud;
    };

    cloud.timeInterval = function (x) {
      if (!arguments.length) return timeInterval;
      timeInterval = x == null ? Infinity : x;
      return cloud;
    };

    function place(board, tag, bounds) {
      var perimeter = [{ x: 0, y: 0 }, { x: size[0], y: size[1] }],
        startX = tag.x,
        startY = tag.y,
        maxDelta = Math.sqrt(size[0] * size[0] + size[1] * size[1]),
        s = spiral(size),
        dt = Math.random() < .5 ? 1 : -1,
        t = -dt,
        dxdy,
        dx,
        dy;

      while (dxdy = s(t += dt)) {
        dx = ~~dxdy[0];
        dy = ~~dxdy[1];

        if (Math.min(dx, dy) > maxDelta) break;

        tag.x = startX + dx;
        tag.y = startY + dy;

        if (tag.x + tag.x0 < 0 || tag.y + tag.y0 < 0 ||
          tag.x + tag.x1 > size[0] || tag.y + tag.y1 > size[1]) continue;
        // TODO only check for collisions within current bounds.
        if (!bounds || !cloudCollide(tag, board, size[0])) {
          if (!bounds || collideRects(tag, bounds)) {
            var sprite = tag.sprite,
              w = tag.width >> 5,
              sw = size[0] >> 5,
              lx = tag.x - (w << 4),
              sx = lx & 0x7f,
              msx = 32 - sx,
              h = tag.y1 - tag.y0,
              x = (tag.y + tag.y0) * sw + (lx >> 5),
              last;
            for (var j = 0; j < h; j++) {
              last = 0;
              for (var i = 0; i <= w; i++) {
                board[x + i] |= (last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0);
              }
              x += sw;
            }
            delete tag.sprite;
            return true;
          }
        }
      }
      return false;
    }

    cloud.words = function (x) {
      if (!arguments.length) return words;
      words = x;
      return cloud;
    };

    cloud.size = function (x) {
      if (!arguments.length) return size;
      size = [+x[0], +x[1]];
      return cloud;
    };

    cloud.font = function (x) {
      if (!arguments.length) return font;
      font = d3.functor(x);
      return cloud;
    };

    cloud.fontStyle = function (x) {
      if (!arguments.length) return fontStyle;
      fontStyle = d3.functor(x);
      return cloud;
    };

    cloud.fontWeight = function (x) {
      if (!arguments.length) return fontWeight;
      fontWeight = d3.functor(x);
      return cloud;
    };

    cloud.rotate = function (x) {
      if (!arguments.length) return rotate;
      rotate = d3.functor(x);
      return cloud;
    };

    cloud.text = function (x) {
      if (!arguments.length) return text;
      text = d3.functor(x);
      return cloud;
    };

    cloud.spiral = function (x) {
      if (!arguments.length) return spiral;
      spiral = spirals[x + ""] || x;
      return cloud;
    };

    cloud.fontSize = function (x) {
      if (!arguments.length) return fontSize;
      fontSize = d3.functor(x);
      return cloud;
    };

    cloud.padding = function (x) {
      if (!arguments.length) return padding;
      padding = d3.functor(x);
      return cloud;
    };

    return d3.rebind(cloud, event, "on");
  }

  function cloudText(d) {
    return d.text;
  }

  function cloudFont() {
    return "serif";
  }

  function cloudFontNormal() {
    return "normal";
  }

  function cloudFontSize(d) {
    return Math.sqrt(d.value);
  }

  function cloudRotate() {
    return (~~(Math.random() * 6) - 3) * 30;
  }

  function cloudPadding() {
    return 1;
  }

  // Fetches a monochrome sprite bitmap for the specified text.
  // Load in batches for speed.
  function cloudSprite(d, data, di) {
    if (d.sprite) return;
    c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);
    var x = 0,
      y = 0,
      maxh = 0,
      n = data.length;
    --di;
    while (++di < n) {
      d = data[di];
      c.save();
      c.font = d.style + " " + d.weight + " " + ~~((d.size + 1) / ratio) + "px " + d.font;
      var w = c.measureText(d.text + "m").width * ratio,
        h = d.size << 1;
      if (d.rotate) {
        var sr = Math.sin(d.rotate * cloudRadians),
          cr = Math.cos(d.rotate * cloudRadians),
          wcr = w * cr,
          wsr = w * sr,
          hcr = h * cr,
          hsr = h * sr;
        w = (Math.max(Math.abs(wcr + hsr), Math.abs(wcr - hsr)) + 0x1f) >> 5 << 5;
        h = ~~Math.max(Math.abs(wsr + hcr), Math.abs(wsr - hcr));
      } else {
        w = (w + 0x1f) >> 5 << 5;
      }
      if (h > maxh) maxh = h;
      if (x + w >= (cw << 5)) {
        x = 0;
        y += maxh;
        maxh = 0;
      }
      if (y + h >= ch) break;
      c.translate((x + (w >> 1)) / ratio, (y + (h >> 1)) / ratio);
      if (d.rotate) c.rotate(d.rotate * cloudRadians);
      c.fillText(d.text, 0, 0);
      if (d.padding) c.lineWidth = 2 * d.padding, c.strokeText(d.text, 0, 0);
      c.restore();
      d.width = w;
      d.height = h;
      d.xoff = x;
      d.yoff = y;
      d.x1 = w >> 1;
      d.y1 = h >> 1;
      d.x0 = -d.x1;
      d.y0 = -d.y1;
      d.hasText = true;
      x += w;
    }
    var pixels = c.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data,
      sprite = [];
    while (--di >= 0) {
      d = data[di];
      if (!d.hasText) continue;
      var w = d.width,
        w32 = w >> 5,
        h = d.y1 - d.y0;
      // Zero the buffer
      for (var i = 0; i < h * w32; i++) sprite[i] = 0;
      x = d.xoff;
      if (x == null) return;
      y = d.yoff;
      var seen = 0,
        seenRow = -1;
      for (var j = 0; j < h; j++) {
        for (var i = 0; i < w; i++) {
          var k = w32 * j + (i >> 5),
            m = pixels[((y + j) * (cw << 5) + (x + i)) << 2] ? 1 << (31 - (i % 32)) : 0;
          sprite[k] |= m;
          seen |= m;
        }
        if (seen) seenRow = j;
        else {
          d.y0++;
          h--;
          j--;
          y++;
        }
      }
      d.y1 = d.y0 + seenRow;
      d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32);
    }
  }

  // Use mask-based collision detection.
  function cloudCollide(tag, board, sw) {
    sw >>= 5;
    var sprite = tag.sprite,
      w = tag.width >> 5,
      lx = tag.x - (w << 4),
      sx = lx & 0x7f,
      msx = 32 - sx,
      h = tag.y1 - tag.y0,
      x = (tag.y + tag.y0) * sw + (lx >> 5),
      last;
    for (var j = 0; j < h; j++) {
      last = 0;
      for (var i = 0; i <= w; i++) {
        if (((last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0))
          & board[x + i]) return true;
      }
      x += sw;
    }
    return false;
  }

  function cloudBounds(bounds, d) {
    var b0 = bounds[0],
      b1 = bounds[1];
    if (d.x + d.x0 < b0.x) b0.x = d.x + d.x0;
    if (d.y + d.y0 < b0.y) b0.y = d.y + d.y0;
    if (d.x + d.x1 > b1.x) b1.x = d.x + d.x1;
    if (d.y + d.y1 > b1.y) b1.y = d.y + d.y1;
  }

  function collideRects(a, b) {
    return a.x + a.x1 > b[0].x && a.x + a.x0 < b[1].x && a.y + a.y1 > b[0].y && a.y + a.y0 < b[1].y;
  }

  function archimedeanSpiral(size) {
    var e = size[0] / size[1];
    return function (t) {
      return [e * (t *= .1) * Math.cos(t), t * Math.sin(t)];
    };
  }

  function rectangularSpiral(size) {
    var dy = 4,
      dx = dy * size[0] / size[1],
      x = 0,
      y = 0;
    return function (t) {
      var sign = t < 0 ? -1 : 1;
      // See triangular numbers: T_n = n * (n + 1) / 2.
      switch ((Math.sqrt(1 + 4 * sign * t) - sign) & 3) {
        case 0: x += dx; break;
        case 1: y += dy; break;
        case 2: x -= dx; break;
        default: y -= dy; break;
      }
      return [x, y];
    };
  }

  // TODO reuse arrays?
  function zeroArray(n) {
    var a = [],
      i = -1;
    while (++i < n) a[i] = 0;
    return a;
  }

  var cloudRadians = Math.PI / 180,
    cw = 1 << 11 >> 5,
    ch = 1 << 11,
    canvas,
    ratio = 1;

  //if (typeof document !== "undefined") {
    canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    ratio = Math.sqrt(canvas.getContext("2d").getImageData(0, 0, 1, 1).data.length >> 2);
    canvas.width = (cw << 5) / ratio;
    canvas.height = ch / ratio;
  // } else {
  //   // node-canvas support
  //   var Canvas = require("canvas");
  //   canvas = new Canvas(cw << 5, ch);
  // }

  var c = canvas.getContext("2d"),
    spirals = {
      archimedean: archimedeanSpiral,
      rectangular: rectangularSpiral
    };
  c.fillStyle = c.strokeStyle = "red";
  c.textAlign = "center";

  if (typeof module === "object" && module.exports) module.exports = cloud;
  else (d3.layout || (d3.layout = {})).cloud = cloud;
})();

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class LineChart {
    
    constructor(props) {
        const {
            svg_location, 
            margin
        } = props;

        let allLines = []
        let allLines2 = []
        this.allLines = allLines;
        this.allLines2 = allLines2;

        const svg = d3.select("#lineSVG");
        const width = svg.attr('width');
        const height = svg.attr('height');
    
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        const innerHeight2 = height - margin.top2 - margin.bottom2;

        const xScale = d3.scaleTime().rangeRound([0, innerWidth]);
        const xScale2 = d3.scaleTime().rangeRound([0, innerWidth]);
        const yScale = d3.scaleLinear().rangeRound([innerHeight, 0]);
        const yScale2 = d3.scaleLinear().rangeRound([innerHeight2, 0]);

        const xLabel = d => d.year; 
        const yLabel = d => d.freq;
        
        // container for the on focus line chart 
        const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        // container for the overview line chart
        const context = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top2 + ")");
        
        const xAxis = d3.axisBottom(xScale);
        const xAxis2 = d3.axisBottom(xScale2);

        const brushed = () => {
            const line = d3.line()
                .x(d => this.xScale(d.year))
                .y(d => this.yScale(d.freq))
                .curve(d3.curveMonotoneX);

            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            var s = d3.event.selection || xScale2.range();
            this.xScale.domain(s.map(this.xScale2.invert, this.xScale2));

            g.selectAll(".lines")
                .attr("class", "lines")
                .attr("fill", "none")
                .attr("stroke", d => this.lineColor(d.word))
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 2.5)
                .attr("d", d => line(d.data));
        
            g.select("#bottom-axis").call(xAxis);
            svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(innerWidth / (s[1] - s[0]))
                .translate(-s[0], 0));
        }

        const zoomed = () => {

            const line = d3.line()
                .x(d => this.xScale2(d.year))
                .y(d => this.yScale2(d.freq))
                .curve(d3.curveMonotoneX);

            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            var t = d3.event.transform;
            this.xScale.domain(t.rescaleX(this.xScale2).domain());
            g.selectAll(".lines2")
                .attr("class", "lines2")
                .attr("fill", "none")
                .attr("stroke", d => this.lineColor(d.word))
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 2.5)
                .attr("d", d => line(d.data));
            focus.select(".axis--x").call(this.xAxis);
            context.select(".brush").call(brush.move, this.xScale.range().map(t.invertX, t));
          }

        const brush = d3.brushX()
          .extent([[0, 0], [innerWidth, innerHeight2]])
          .on("brush end", brushed);

        const zoom = d3.zoom()
          .scaleExtent([1, Infinity])
          .translateExtent([[0, 0], [innerWidth, innerHeight]])
          .extent([[0, 0], [innerWidth, innerHeight]])
          .on("zoom", zoomed);      

        this.brushed = brushed;
        
        g.append("g")
            .attr("id", "left-axis");
        
        // tooltip
        const focus = svg.append("g").attr("class", "focus").style("display", "none");
    
        // clip path
        svg.append("defs").append("clipPath")
            .attr("id", "clip")
                .append("rect")
                .attr("width", innerWidth)
                .attr("height", innerHeight);

        const mouseG = g.append("g")
            .attr("class", "mouse-over-effects");

        mouseG.append("path") // this is the black vertical line to follow mouse
            .attr("class", "mouse-line")
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .style("opacity", "0");

        this.mouseG = mouseG;
        this.bisectYear = d3.bisector(xLabel).left; 
        this.yScale = yScale;
        this.xScale = xScale;
        this.xScale2 = xScale2;
        this.yScale2 = yScale2;
        this.xLabel = xLabel;
        this.height = height;
        this.width = width;
        this.innerHeight = innerHeight;
        this.innerHeight2 = innerHeight2;
        this.innerWidth = innerWidth;
        this.marginLeft = margin.left;
        this.marginTop = margin.top;
        this.marginTop2 = margin.top;
        this.marginBottom = margin.bottom;
        this.marginBottom2 = margin.bottom2;
        this.margin = margin;
        this.context = context;
        this.brush = brush;
        this.zoom = zoom;
        this.xAxis = xAxis;
        this.xAxis2 = xAxis2;
        this.svg = svg;
        this.g = g;
        this.focus = focus;
        this.lineColor = () => "red";

    }

    renderChart(data, lineColor) {
        const xScale = this.xScale;
        const xScale2 = this.xScale2;
        const yScale = this.yScale;
        const yScale2 = this.yScale2;
        const focus = this.focus;
        const svg = this.svg;
        const g = this.g;
        const width = this.width;
        const height = this.height;
        const innerWidth = this.innerWidth;
        const innerHeight = this.innerHeight;
        const innerHeight2 = this.innerHeight2;
        const mouseG = this.mouseG;
        const brush = this.brush;
        this.lineColor = lineColor;

        // flatten the map to get the global range for all lines
        const flattened = data.map(d => d.data).reduce(function(a, b) {
            return a.concat(b);
        }, []);

        this.xScale.domain(d3.extent(flattened, function(d) { return d.year; }));
        this.xScale2.domain(d3.extent(flattened, function(d) { return d.year; }));        
        this.yScale.domain(d3.extent(flattened, function(d) { return d.freq; }));
        this.yScale2.domain(d3.extent(flattened, function(d) { return d.freq; }));

        // render the line
        const line = d3.line()
            .x(d => this.xScale(d.year))
            .y(d => this.yScale(d.freq))
            .curve(d3.curveMonotoneX);

        const line2 = d3.line()
            .x(d => this.xScale2(d.year))
            .y(d => this.yScale2(d.freq))
            .curve(d3.curveMonotoneX);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + innerHeight + ")")
            .call(this.xAxis.tickFormat(d3.format("d")));

        this.context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + innerHeight2 + ")")
            .call(this.xAxis2.tickFormat(d3.format("d")));

        d3.select("#left-axis")
            .call(d3.axisLeft(this.yScale))
          .append("text")
            .attr("fill", "#000")
            .attr("transform", "translate(0," + innerWidth + ")")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Frequency");

        // draw lines for main chart
        const lines = g.selectAll(".lines")
            .data(data);

        const label = g.selectAll("#left-axis text")

        lines.exit().remove();
        
        lines.enter()   
            .append("path")
            .merge(lines)
            .attr("class", "lines")
            .attr("fill", "none")
            .attr("stroke", d => lineColor(d.word))
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 2.5)
            .attr("d", d => line(d.data));

        label.exit().remove();

        // draw lines for overview chart
        const lines2 = this.context.selectAll(".lines2")
            .data(data);

        lines2.exit().remove();
        
        lines2.enter()   
            .append("path")
            .merge(lines2)
            .attr("class", "lines2")
            .attr("fill", "none")
            .attr("stroke", d => lineColor(d.word))
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", d => line2(d.data));

        // brush that moves
        const _fake_data = [1];
        const brusher = this.context.selectAll(".brush").data(_fake_data);
        const theBrusher = brusher.enter().append('g').attr('class', 'brush');
        theBrusher.call(brush)
            .call( brush.move, this.xScale2.range());
        brusher.call(brush)
            .call( brush.move, this.xScale2.range());

        var linesElm = document.getElementsByClassName('lines');

        // mouse interactions - hover over show count
        var mousePerLine = mouseG.selectAll('.mouse-per-line')
            .data(data)
            .enter() 
            .append("g")
            .attr("class", "mouse-per-line");

        mousePerLine.exit().remove();
        mousePerLine.selectAll("circle").exit().remove();
        mousePerLine.selectAll("text").exit().remove();

        mousePerLine
            .append("circle")
                .attr("r", 7)
                .style("fill", "none")
                .style("stroke-width", "1px")
                .style("opacity", "0")
                .attr("stroke", d =>lineColor(d.word));

        mousePerLine.append("text")
            .attr("transform", "translate(10,3)");
            
        mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
            .attr('width', innerWidth) // can't catch mouse events on a g element
            .attr('height', innerHeight)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .on('mouseout', function() { // on mouse out hide line, circles and text
            d3.select(".mouse-line")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line text")
                .style("opacity", "0");
            })
            .on('mouseover', function() { // on mouse in show line, circles and text
            d3.select(".mouse-line")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line circle")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line text")
                .style("opacity", "1");
            })
            .on('mousemove', function() { // mouse moving over canvas
            var mouse = d3.mouse(this);
            var pos;

            var xDate = xScale.invert(mouse[0]),
            bisect = d3.bisector(d=>d.year).left,
            i = bisect(data[0].data, xDate),
            d0 = data[0].data[i-1],
            d1 = data[0].data[i],
            d = xDate - d0.year > d1.year - xDate ? d1 : d0;

            const freq = d.freq;
            

            // focus.attr("transform", "translate(" + xScale(d.year) + "," + yScale(d.freq) + ")");
            // focus.select("text").text(function() { return d.freq; });
            // focus.select(".x-hover-line").attr("y2", height - yScale(d.freq));
            // focus.select(".y-hover-line").attr("x2", width + width);
            const selectedYearX =  xScale(d.year);
            d3.select(".mouse-line")
              .attr("d", function() {
                var d = "M" + selectedYearX + "," + innerHeight;
                d += " " + selectedYearX + "," + 0;
                return d;
                });



        const items = d3.selectAll(".mouse-per-line").data(data);
        items.exit().remove();
        items
            .attr("transform", function(d, i) {

            var beginning = 0,
                end = linesElm[i].getTotalLength(),
                target = null;
            
                
            while (true){
                target = Math.floor((beginning + end) / 2);
                pos = linesElm[i].getPointAtLength(target);
                if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                    break;
                }
                if (pos.x > mouse[0])      end = target;
                else if (pos.x < mouse[0]) beginning = target;
                else break; //position found
            }
            
            d3.select(this).select('text')
                .text(freq);
                
            return "translate(" + pos.x + "," + pos.y +")";
            });
        });
        

    }
}

/* harmony default export */ __webpack_exports__["a"] = (LineChart);

/***/ })
/******/ ]);