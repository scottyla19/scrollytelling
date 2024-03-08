const container = d3.select('#scroll');
const graphic = container.select('.scroll_graphic');
const chart = graphic.select('.chart');
const text = container.select('.scroll_text');
const step = text.selectAll('.step');

// initialize the scrollama
// instantiate the scrollama
const scroller = scrollama();


// resize function to set dimensions on load and on page resize
function handleResize() {
	// 1. update height of step elements for breathing room between steps
	let stepHeight = Math.floor(window.innerHeight * 0.75);
	step.style('height', stepHeight + 'px');

	// 2. update height of graphic element
	// let bodyWidth = d3.select('body').node().offsetWidth;

	graphic
		.style('height', window.innerHeight + 'px');

	// 3. update width of chart by subtracting from text width
	let chartMargin = 32;
	let textWidth = text.node().offsetWidth;
	let chartWidth = graphic.node().offsetWidth - textWidth - chartMargin;
	// make the height 1/2 of viewport
	let chartHeight = Math.floor(window.innerHeight / 2);

	chart
		.attr('width', chartWidth + 'px')
		.attr('height', chartHeight + 'px');

	// 4. tell scrollama to update new element dimensions
	scroller.resize();
}
// scrollama event handlers
function handleStepEnter(response) {
	// response = { element, direction, index }
    graphic.classed('is-fixed', true);
    graphic.classed('is-bottom', false);

	// fade in current step
	step.classed('is-active', function (d, i) {
		return i === response.index;
	})

	// update graphic based on step here
    let colors = ["steelblue", "green", "yellow", "red"]
    chart.selectAll('rect').attr("fill", colors[response.index])
}

function handleStepExit(response) {

	// un-sticky the graphic, and pin to top/bottom of container
    if ((response.index === 0 && response.direction === 'up') || (response.index === step.length - 1 && response.direction === 'down')){
        graphic.classed('is-fixed', false);
	graphic.classed('is-bottom', response.direction === 'down');
    }
	
}

// kick-off code to run once on load
function init() {
	// 1. call a resize on load to update width/height/position of elements
	handleResize();

	// 2. setup the scrollama instance
	// 3. bind scrollama event handlers (this can be chained like below)
	scroller
		.setup({
			container: '#scroll', // our outermost scrollytelling element
			graphic: '.scroll_graphic', // the graphic
			text: '.scroll_text', // the step container
			step: '.scroll_text .step', // the step elements
			offset: 0.5, // set the trigger to be 1/2 way down screen
			// debug: true, // display the trigger offset for testing
		})
		.onStepEnter(handleStepEnter)
        .onStepExit(handleStepExit);

	// setup resize event
	window.addEventListener('resize', handleResize);
}


// start it up
init();