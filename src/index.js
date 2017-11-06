import scatterPlot from './scatterPlot'
import wordCloud from './wordcloud'
import LineChart from './line'


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
  const margin = { left: 50, right: 20, top: 20, bottom: 50 };
  const lineId = d3.select('#line');
  const lineDiv = lineId.node();
  const svgLine = lineId.select('svg');

  const lineChart = new LineChart({
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

  const textColor = function(word) {
    const color = d3.scaleOrdinal(d3.schemeCategory20)
      .domain(selectedWords)
    return color(word);
  }

  /* Render function */
  const render = (_data) => {
    const {keywords, word_count} = _data;
    console.log(keywords, word_count)
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
    wordCloud(svgWordcloud, word_count, updateSelectedWords, getWordClass, (word) => textColor(word));   
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

