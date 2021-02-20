// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(stateData) {
    console.log(stateData);

    // Parse data and cast as numbers
    stateData.forEach(function(data) {
        data.id = +data.id;
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.healthcare = +data.healthcare;
        data.healthcareHigh = +data.healthcareHigh;
        data.healthcareLow = +data.healthcareLow;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.obesity = +data.obesity;
        data.obesityHigh = +data.obesityHigh;
        data.obesityLow = +data.obesityLow;
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.smokes = +data.smokes;
        data.smokesHigh = +data.smokesHigh;
        data.smokesLow = +data.smokesLow;
    });
    console.log(stateData);

    // Create scale function
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(stateData, d=> d.poverty)])
        .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([4,d3.max(stateData, d=> d.healthcare)])
        .range([height,0]);

    // create axis functions

    var botomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append axes to chartGroup

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(botomAxis);

    chartGroup.append("g")
        .call(leftAxis);
    
    // Create circles

    var circlesGroup = chartGroup.append("g")
        .selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("opacity", "1");
        
    
    
    var textGroup = chartGroup.append("g")
        .selectAll("text")
        .data(stateData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .text(d => d.abbr);
   
    
    // Tooltips
    var toolTip = d3.tip()
        .attr("class","d3-tip")
        .offset([80,-60])
        .html(function(d) {
            return(`${d.state}:<br>% In Poverty: ${d.poverty}<br>% Lacks Healthcare: ${d.healthcare}`);
        });

    chartGroup.call(toolTip);

    circlesGroup.on("click", function(data) {
        toolTip.show(data,this);

    })
    textGroup.on("click", function(data) {
        toolTip.show(data,this);
    })
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    // Axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width/2}, ${height + margin.top +30})`)
        .attr("class", "aText")
        .text("In Poverty (%)");


}).catch(function(error) {
    console.log(error);
});