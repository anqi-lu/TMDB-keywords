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
      
        this.yScale = yScale;
        this.xScale = xScale;
        this.height = innerHeight;
        this.width = innerWidth;
        this.g = g;

        this.g.append('g')
            .attr("id", "bottom-axis");
        this.g.append("g")
            .attr("id", "left-axis");

        xAxisG.append("text")
            .attr("fill", "#000")
            .attr("transform", "translate(0," + this.height + ")")
            .attr("alignment-baseline", "middle")
            .attr("x", -10)
            .attr("y", 10)
            .attr("dy", 0)
            .attr("text-anchor", "end")
            .text("Year");
        
        this.xAxisG = xAxisG;
        
    }

    renderChart(data, lineColor) {
        const xScale = this.xScale;
        const yScale = this.yScale;

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
            .attr("transform", "translate(0," + this.width + ")")
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
    }
}

export default LineChart;