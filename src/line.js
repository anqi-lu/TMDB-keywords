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

            g.selectAll(".axis--x").exit().remove();
            g.selectAll(".lines")
                .attr("class", "lines")
                .attr("fill", "none")
                .attr("stroke", d => this.lineColor(d.word))
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 2.5)
                .attr("d", d => line(d.data));
        
            g.selectAll(".axis--x").call(this.xAxis);
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
            g.selectAll(".axis--x").exit().remove();
            g.selectAll(".lines2")
                .attr("class", "lines2")
                .attr("fill", "none")
                .attr("stroke", d => this.lineColor(d.word))
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 2.5)
                .attr("d", d => line(d.data));

           //g.select(".axis--x").call(this.xAxis);
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

        g.selectAll(".axis--x").exit().remove();
        g.append("g")
            .attr("class", "axis axis--x")
            .attr("id", "#focus-axis")
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
        
        // Year label
        mouseG
            .append("text").attr("class", "focus year")
            .attr("x", 40).attr("y", 7);

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

            const selectedYearX =  xScale(d.year);
            d3.select(".mouse-line")
              .attr("d", function() {
                var d = "M" + selectedYearX + "," + innerHeight;
                d += " " + selectedYearX + "," + 0;
                return d;
                });


        mouseG.select(".focus.year").text("Year: " + d.year);
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
                .text(yScale.invert(pos.y).toFixed(0))
                
            return "translate(" + pos.x + "," + pos.y  +")";
            });
        });
        

    }
}

export default LineChart;