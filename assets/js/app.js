
// Set up Chart
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

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {

    console.log(healthData)

    // Step 1: Parse Data/Cast as numbers
    // ======================================================================
    healthData.forEach(function(data) {
        data.healthcareLow = +data.healthcareLow;
        data.poverty = +data.poverty;
        data.abbr = data.abbr;
        // console.log(data);
    });

    // Step 2: Create scale functions
    // =================================================================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(healthData, d => d.healthcareLow)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([2, d3.max(healthData, d => d.poverty)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ====================================================================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==================================================================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ===========================================================================
    var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .classed("stateCircle", true)
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcareLow))
      .attr("r", "20")
      .attr("opacity", "10")

    var circlesText = chartGroup.selectAll(".stateText")
      .data(healthData)
      .enter()
      .append("text")
      .classed("stateText", true)
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcareLow))
      .attr("class", "Text")
      .attr("font-size", "13px")
      .attr("text-anchor", "middle")
      .text(function(d) {return d.abbr});

    // Step 6: Initialize tool tip
    // ===============================================================================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([0, 50])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcareLow}`)
    });

    // Step 7: Create tooltip in the chart
    // =============================================================================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ===============================================================================
    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
     .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lack of Healthcare (%)")
    
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty (%)");
  }).catch(function(error) {
    console.log(error);

  });

