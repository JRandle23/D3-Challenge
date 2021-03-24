  
// // @TODO: YOUR CODE HERE!
function makeResponsive() {

    var svgArea = d3.select("body").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    }

    var svgWidth = 980;
    var svgHeight = 600;

    var margin = {
        top: 20,
        right: 40,
        bottom: 90,
        left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    

        
    // Append an SVG group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var chosenXAxis = "poverty";
    var chosenYAxis = "healthcare";

    // function used for updating x-scale var upon click on axis label
    function xScale(healthData, chosenXAxis) {
        // create scales
        var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8, 
            d3.max(healthData, d => d[chosenXAxis]) * 1.2])
        .range([0, width]);
    
        return xLinearScale;
    
    }

    // function used for updating x-scale var upon click on axis label
    function yScale(healthData, chosenYAxis) {
        // create scales
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8, 
                d3.max(healthData, d => d[chosenYAxis]) * 1.2])
            .range([height, 0]);
        
        return yLinearScale;
    }

    // function used for updating xAxis var upon click on axis label
    function renderAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);
    
        xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
        return xAxis;
    }

    function renderAxes(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);
    
        yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
        return yAxis;
    }


    // function used for updating circles group with a transition to
    // new circles
    function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

        circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    
        return circlesGroup;
    }

    // function used for updating state labels with a transition to new circles
    function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
        textGroup.transition()
            .duration(1000)
            .attr("x", d => newXScale(d[chosenXAxis]))
            .attr("y", d => newYScale(d[chosenYAxis]))
            .attr("text-anchor", "middle");
        
        return textGroup;
    }

    // style function for x-axis and tooltips 
    function styleX(value, chosenXAxis) {

        if (chosenXAxis === "poverty") {
            return `${value}`;
        }
        else if (chosenXAxis === "income") {
            return `$${value}`;
        }
        else {
            return `${value}`;
        }
    }
    
    // function used for updating circles group with new tooltip
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {
    
        // select x label
        if (chosenXAxis === "poverty") {
        var xLabel = "Poverty: ";
        }
        else if (chosenXAxis === "income") {
            var xLabel = "Median Income: ";
        }
        else {
            var xLabel = "Age: ";
        }

        // select y label
        if (chosenYAxis === "healthcare") {
            var yLabel = "No Healthcare";
        }
        else if (chosenYAxis === "obesity") {
            var yLabel = "Obesity: ";
        }
        else {
            var yLabel = "Smokers: ";
        }


    
        const toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -60])
            .html(function(d) {
                return (`${d.abbr}<br>${xLabel} ${styleX(d[chosenXAxis])}<br>${yLabel} ${d[chosenYAxis]}`);
            });
    
        circlesGroup.call(toolTip);
    
        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
            // .on("mouseout", toolTip.hide);
        })
            .on("mouseout", function(data) {
                toolTip.hide(data);
            });
        
        textGroup.call(toolTip);

        textGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
            .on("mouseout", function(data) {
                toolTip.hide(data);
            });
        return circlesGroup;

    }


    d3.csv("./assets/data/data.csv").then((healthData) => {
        console.log(healthData);

        healthData.forEach((data) => {
            data.income = +data.income;
            data.obesity = +data.obesity;
            data.smokes = +data.smokes;
            data.age = +data.age;
            data.healthcare = +data.health_care;
            data.poverty = +data.poverty;
        });

        // Create linear scales
        var xLinearScale = xScale(healthData, chosenXAxis);
        var yLinearScale = yScale(healthData, chosenYAxis);
        
        
        // Create initial axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // append x axis
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
        
        var yAxis = chartGroup.append("g")
            .classed("y-axis", true)
            .call(leftAxis);
        
        
        // append initial circles
        var circlesGroup = chartGroup.selectAll(".stateCircle")
            .data(healthData)
            .enter()
            .append("circle")
            .classed("stateCircle", true)
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", 15)
            // .attr("fill", "pink")
            .attr("opacity", ".8");
        
        var textGroup = chartGroup.selectAll(".stateText")
            .data(healthData)
            .enter()
            .append("text")
            .classed("stateText", true)
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis] * .98))
            .attr("dy", 1)
            .attr("font-size", "10px")
            .attr("text-anchor", "middle")
            .text(d => (d.abbr));
        
        // Create x axis labels group
        var xLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);
        
        var povertyLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty")
            .classed("active", true)
            .text("In Poverty (%)")

        var incomeLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "income")
            .attr("aText", true)
            .classed("inactive", true)
            .text("Median Household Income ($)");

        var ageLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "age")
            .attr("aText", true)
            .classed("inactive", true)
            .text("Age (Median)");
        
        // Create y labels group
        var yLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(-25, ${height / 2})`);
        
        var healthcareLabel = yLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", -30)
            .attr("dy", "1em")
            .attr("transform", "rotate(-90)")
            .attr("value", "healthcare")
            .classed("aText", true)
            .classed("active", true)
            .text("Without Healthcare (%)");
        
        var smokesLabel = yLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", -50)
            .attr("dy", "1em")
            .attr("transform", "rotate(-90)")
            .attr("aText", true)
            .attr("inactive", true)
            .attr("value", "smokes")
            .text("Smokers (%)");

        var obesityLabel = yLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", -70)
            .attr("dy", "1em")
            .attr("transform", "rotate(-90)")
            .attr("value", "obesity")
            .attr("aText", true)
            .attr("inactive", true)
            .text("Obesity (%)");

        
        // updateToolTip function above csv import
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

        // x axis labels event listener
        xLabelsGroup.selectAll("text")
            .on("click", function() {
                var value = d3.select(this).attr("value");
                if (value !== chosenXAxis) {

                    chosenXAxis = value;

                    xLinearScale = xScale(healthData, chosenXAxis);

                    xAxis = renderAxes(xLinearScale, xAxis);

                    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                    textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

                    if (chosenXAxis === "poverty") {
                        povertyLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    } else if (chosenXAxis === "age") {
                        ageLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        incomeLabel 
                            .classed("active", false)
                            .classed("inactive", true);
                    } else {
                        incomeLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        ageLabel    
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                }
            });

        // y-axis event listeners 
        yLabelsGroup.selectAll("text")
            .on("click", function() {
                var value = d3.select(this).attr("value");
                if (value !== chosenYAxis) {

                    chosenYAxis = value;

                    yLinearScale = yScale(healthData, chosenYAxis);

                    yAxis = renderAxes(yLinearScale, yAxis);

                    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                    textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

                    if (chosenYAxis === "healthcare") {
                        healthcareLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        smokesLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        obesityLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    } else if (chosenYAxis === "smokes") {
                        smokesLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        obesityLabel 
                            .classed("active", false)
                            .classed("inactive", true);
                    } else {
                        obesityLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        smokesLabel    
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                }
            });
    });
}

makeResponsive();

d3.select(window).on("resize", makeResponsive);
