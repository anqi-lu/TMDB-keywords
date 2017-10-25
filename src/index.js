import scatterPlot from './scatterPlot'
import wordCloud from './wordcloud'

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

/* Drawing wordcloud */
const wordcloud = d3.select('#wordcloud');
const wordcloudDiv = wordcloud.node();
const svgWordcloud = wordcloud.select('svg');

wordCloud(svgWordcloud);