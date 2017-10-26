import scatterPlot from './scatterPlot'
import wordCloud from './wordcloud'
import line from './line'
/*
const xValue = d => d.sepalLength;
const xLabel = 'Sepal Length';
const yValue = d => d.petalLength;
const yLabel = 'Petal Length';
const colorValue = d => d.species;
const colorLabel = 'Species';
const margin = { left: 120, right: 300, top: 20, bottom: 120 };

const line = d3.select('#line');
const lineDiv = line.node();
const svgLine = line.select('svg');

const row = d => {
  d.petalLength = +d.petalLength;
  d.petalWidth = +d.petalWidth;
  d.sepalLength = +d.sepalLength;
  d.sepalWidth = +d.sepalWidth;
  return d;
};

d3.csv('data/iris.csv', row, data => {

  const render = () => {

    // Extract the width and height that was computed by CSS.
    svgLine
      .attr('width', lineDiv.clientWidth)
      .attr('height', lineDiv.clientHeight);

    // Render the scatter plot.
    scatterPlot(svgLine, {
      data,
      xValue,
      xLabel,
      yValue,
      yLabel,
      colorValue,
      colorLabel,
      margin
    });
  }

  // Draw for the first time to initialize.
  render();

  // Redraw based on the new size whenever the browser window is resized.
  window.addEventListener('resize', render);
});
*/

/* Drawing wordcloud */
const wordcloud = d3.select('#wordcloud');
const wordcloudDiv = wordcloud.node();
const svgWordcloud = wordcloud.select('svg');

wordCloud(svgWordcloud);

/* Drawing linechart */

const keyword = "love";
const margin = { left: 50, right: 20, top: 20, bottom: 50 };

const lineId = d3.select('#line');
const lineDiv = lineId.node();
const svgLine = lineId.select('svg');

d3.json('data/keywords.json', data => {

  var years = [];
  var obj = data[keyword];
  for (var year in obj.years) {
    years.push({
      year: year,
      freq: obj['years'][year]  
    });
  }

  const render = () => {

    // Extract the width and height that was computed by CSS.
    svgLine
      .attr('width', lineDiv.clientWidth)
      .attr('height', lineDiv.clientHeight);

    // Render the scatter plot.
    line(svgLine, {
      years,
      margin
    });
  }

  // Draw for the first time to initialize.
  render();

  // Redraw based on the new size whenever the browser window is resized.
  //window.addEventListener('resize', render);
});