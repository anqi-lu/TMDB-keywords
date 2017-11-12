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
        const innerHeight2 = height - margin.top2 - margin.bottom2;

        const xScale = d3.scaleTime().rangeRound([0, innerWidth]);
        const yScale = d3.scaleLinear().rangeRound([innerHeight, 0]);
        const yScale2 = d3.scaleLinear().rangeRound([innerHeight2, 0]);

        const xLabel = d => d.year; 
        const yLabel = d => d.freq;
        
        // container for the on focus line chart 
        const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        // container for the overview line chart
        const context = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top2 + ")");
      
        const xAxisGEnter = g.append('g').attr('id', 'bottom-axis');
        const xAxisGEnter2 = context.append('g').attr('id', 'bottom-axis2');

        const xAxisG = xAxisGEnter
          .merge(g.select('#bottom-axis'))
            .attr('transform', `translate(0, ${innerHeight})`);  
        
        const xAxisG2 = xAxisGEnter2
        .merge(g.select('#bottom-axis2'))
            .attr('transform', `translate(0, ${innerHeight2})`);  

        // tooltip
        const focus = svg.append("g").attr("class", "focus").style("display", "none");
           // tool tips
        const mouseG = g.append("g")
            .attr("class", "mouse-over-effects");

        const brush = d3.brushX()
            .extent([[0, 0], [innerWidth, innerHeight2]])
            .on("brush end", this.brushed);

        mouseG.append("path") // this is the black vertical line to follow mouse
        .attr("class", "mouse-line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", "0");
        
      
        this.bisectYear = d3.bisector(xLabel).left; 
        this.yScale = yScale;
        this.xScale = xScale;
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

        this.svg = svg;
        this.g = g;
        this.mouseG = mouseG;

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
        this.xAxisG2 = xAxisG2;
        this.focus = focus;

        this.brushed = () => {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            var s = d3.event.selection || xScale.range();
            xScale.domain(s.map(xScale.invert, xScale));
            g.select(".area").attr("d", area);
            g.select("#bottom-axis").call(this.xAxisG);
            svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(width / (s[1] - s[0]))
                .translate(-s[0], 0));
          }
          
          this.zoomed = () => {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            var t = d3.event.transform;
            xScale.domain(t.rescaleX(xScale).domain());
            g.select(".lines").attr("d", area);
            g.select("#bottom-axis").call(this.xAxisG2);
            context.select(".brush").call(this.brush.move, x.range().map(t.invertX, t));
          }

    }

    renderChart(data, lineColor) {
        const xScale = this.xScale;
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
        
        // flatten the map to get the global range for all lines
        const flattened = data.map(d => d.data).reduce(function(a, b) {
            return a.concat(b);
        }, []);

        xScale.domain(d3.extent(flattened, function(d) { return d.year; }));
        yScale.domain(d3.extent(flattened, function(d) { return d.freq; }));
        yScale2.domain(d3.extent(flattened, function(d) { return d.freq; }));

        // render the line
        const line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.freq))
            .curve(d3.curveMonotoneX);
    
        const line2 = d3.line()
            .x(d => xScale(d.year))
           // .y0(innerHeight2)
            .y(d => yScale2(d.freq))
            .curve(d3.curveMonotoneX);

        // clip path
        svg.append("defs").append("clipPath")
            .attr("id", "clip")
          .append("rect")
            .attr("width", innerWidth)
            .attr("height", innerHeight);

        // Axis for main line chart
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

        // axis for overview chart
        this.xAxisG2.call(d3.axisBottom(xScale)
            .tickFormat(d3.format("d")));
        
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

        lines2.append("g")
            .attr("class", "brush")
            .call(this.brush)
            .call(this.brush.move, xScale.range());
    
        // area for zoom
        svg.append("rect")
            .attr("class", "zoom")
            .attr("width", innerWidth)
            .attr("height", innerHeight)
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
            .call(this.zoom);

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
            .attr('width', width) // can't catch mouse events on a g element
            .attr('height', height)
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

        const items = d3.selectAll(".mouse-per-line").data(data);
        items.exit().remove();
        items
            .attr("transform", function(d, i) {
                //console.log(d);
                //return;
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
            });
        });
        

    }
}

export default LineChart;