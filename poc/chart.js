const width = 740;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

const svg = d3
.select(".chart")
.append("svg")
.attr("width", width)
.attr("height", height);

const rowConverter = function (d) {
return {
gender: d.gender,
race: d["race/ethnicity"],
parent_edu_level: d["parental level of education"],
lunch: d.lunch,
test_prep: d["test preparation course"],
math_score: +d["math score"],
reading_score: +d["reading score"],
writing_score: +d["writing score"],
};
};

d3.csv("StudentsPerformance.csv", rowConverter)
.then(function (data) {
const bins = d3
.bin()
// .thresholds()
.value((d) => d.math_score)(data);

const x = d3
.scaleLinear()
.domain([bins[0].x0, bins[bins.length - 1].x1])
.range([marginLeft, width - marginRight]);

const y = d3
.scaleLinear()
.domain([0, d3.max(bins, (d) => d.length)])
.range([height - marginBottom, marginTop]);

svg
.append("g")
.attr("fill", "steelblue")
.selectAll()
.data(bins)
.join("rect")
.attr("x", (d) => x(d.x0) + 1)
.attr("width", (d) => x(d.x1) - x(d.x0) - 1)
.attr("y", (d) => y(d.length))
.attr("height", (d) => y(0) - y(d.length));

svg
.append("g")
.attr("transform", `translate(0,${height - marginBottom})`)
.call(
    d3
    .axisBottom(
        d3
        .scaleBand()
        .domain([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
        .range([marginLeft, width - marginRight])
    )
    .tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
)
.call((g) =>
    g
    .append("text")
    .attr("x", width)
    .attr("y", marginBottom - 4)
    .attr("fill", "currentColor")
    .attr("text-anchor", "end")
    .text("Math Scores")
);

// Add the y-axis and label, and remove the domain line.
svg
.append("g")
.attr("transform", `translate(${marginLeft},0)`)
.call(d3.axisLeft(y).ticks(height / 50))
.call((g) => g.select(".domain").remove())
.call((g) =>
    g
    .append("text")
    .attr("x", -marginLeft)
    .attr("y", 10)
    .attr("fill", "currentColor")
    .attr("text-anchor", "start")
    .text("↑ Frequency")
);
})
.catch(function (error) {
// error handling
});