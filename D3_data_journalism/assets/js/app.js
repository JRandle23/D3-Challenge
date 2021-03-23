// // @TODO: YOUR CODE HERE!
// // The code for the chart is wrapped inside a function that
// // automatically resizes the chart
// function makeResponsive() {

//     // if the SVG area isn't empty when the browser loads,
//     // remove it and replace it with a resized version of the chart
//     var svgArea = d3.select("body").select("svg");

//     // clear svg is not empty
//     if (!svgArea.empty()) {
//         svgArea.remove();
//     }

    var svgWidth = 960;
    var svgHeight = 500;

    var margin = {
        top: 20,
        right: 40,
        bottom: 80,
        left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3
        .select(".chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
    // Append an SVG group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.csv("./assets/data/data.csv").then((healthData) => {
        console.log(healthData);

        healthData.forEach((data) => {
            data.state = +data.state;
            data.income = +data.income;
            data.obesity = +data.obesity;
        });



    });
