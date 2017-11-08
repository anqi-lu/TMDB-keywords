class LineChart {
    constructor(props) {
        const {
            svg_location, 
            margin
        } = props;

        const svg = d3.select("#lineSVG");
        const width = svg.attr('width');
        const height = svg.attr('height');
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        
        const xScale = d3.scaleLinear().rangeRound([0, innerWidth]);
        const yScale = d3.scaleLinear().rangeRound([innerHeight, 0]);

        const xLabel = d => d.year; 
        const yLabel = d => d.freq;
        
        const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
        const xAxisGEnter = g.append('g').attr('id', 'bottom-axis');
        const xAxisG = xAxisGEnter
          .merge(g.select('#bottom-axis'))
            .attr('transform', `translate(0, ${innerHeight})`);  
        
        // tooltip
        const focus = svg.append("g").attr("class", "focus").style("display", "none");
      
        this.bisectYear = d3.bisector(xLabel).left; 
        this.yScale = yScale;
        this.xScale = xScale;
        this.xLabel = xLabel;
        this.height = height;
        this.width = width;
        this.innerHeight = innerHeight;
        this.innerWidth = innerWidth;
        this.marginLeft = margin.left;
        this.marginTop = margin.top;
        this.svg = svg;
        this.g = g;

        this.g.append('g')
            .attr("id", "bottom-axis");
        this.g.append("g")
            .attr("id", "left-axis");

        xAxisG.append("text")
            .attr("fill", "#000")
            .attr("transform", "translate(0," + innerHeight + ")")
            .attr("alignment-baseline", "middle")
            .attr("x", -10)
            .attr("y", 10)
            .attr("dy", 0)
            .attr("text-anchor", "end")
            .text("Year");
        
        this.xAxisG = xAxisG;
        this.focus = focus;
    }

    renderChart(data, lineColor) {
        const xScale = this.xScale;
        const yScale = this.yScale;
        const focus = this.focus;
        const svg = this.svg;
        const g = this.g;
        const width = this.width;
        const height = this.height;
        const innerWidth = this.innerWidth;
        const innerHeight = this.innerHeight;

        // TODO
        const flattened = data.map(d => d.data).reduce(function(a, b) {
            return a.concat(b);
        }, []);

        xScale.domain(d3.extent(flattened, function(d) { return d.year; }));
        yScale.domain(d3.extent(flattened, function(d) { return d.freq; }));

        const line = d3.line()
            .x(function(d) { return xScale(d.year); })
            .y(function(d) { return yScale(d.freq); })
            .curve(d3.curveMonotoneX);
    
        this.xAxisG.call(d3.axisBottom(xScale)
                .tickFormat(d3.format("d")));

        this.xAxisG.selectAll(".tick text")
            .attr("transform", "rotate(-45)")
            .attr("x", 0)
            .attr("y", 20)
            .attr("dy", 0)
            .attr("text-anchor", "end");

        d3.select("#left-axis")
            .call(d3.axisLeft(yScale))
          .append("text")
            .attr("fill", "#000")
            .attr("transform", "translate(0," + innerWidth + ")")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Frequency");

        const lines = this.g.selectAll(".lines")
            .data(data);

        const label = this.g.selectAll("#left-axis text")

        // update
        lines.attr("class", "lines")
            .attr("fill", "none")
            .attr("stroke", d => lineColor(d.word))
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 2.5)
            .attr("d", d => line(d.data));

        lines.enter()   
            .append("path")
            .attr("class", "lines")
            .attr("fill", "none")
            .attr("stroke", d => lineColor(d.word))
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 2.5)
            .attr("d", d => line(d.data));

        lines.exit().remove();
        label.exit().remove();
       
        // tool tips
        var mouseG = g.append("g")
        .attr("class", "mouse-over-effects");
  
      mouseG.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", "0");
        
      var linesElm = document.getElementsByClassName('lines');

      var mousePerLine = mouseG.selectAll('.mouse-per-line')
        .data(data)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line");
  
      mousePerLine.append("circle")
        .attr("r", 7)
        .attr("stroke", function(d){
            console.log(lineColor(d.word));
            return lineColor(d.word);
        })
        .style("fill", "none")
        .style("stroke-width", "1px")
        .style("opacity", "0");
  
      mousePerLine.append("text")
        .attr("transform", "translate(10,3)");
  
      mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', width) // can't catch mouse events on a g element
        .attr('height', height)
       // .attr("transform", "translate(" + this.marginLeft + "," + this.marginTop + ")")
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
          d3.select(".mouse-line")
            .attr("d", function() {
              var d = "M" + mouse[0] + "," + height;
              d += " " + mouse[0] + "," + 0;
              return d;
            });
  
          d3.selectAll(".mouse-per-line")
            .attr("transform", function(d, i) {
              var xDate = xScale.invert(mouse[0]),
                  bisect = d3.bisector(d=>d.year).left,
                  idx = bisect(d, xDate);
                  
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
                .text(yScale.invert(pos.y).toFixed(2));
                
              return "translate(" + mouse[0] + "," + pos.y +")";
            //return "translate(" + mouse[0] + "," + 0 +")";
            });
        });
    }
}

export default LineChart;