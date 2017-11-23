// const width = window.innerWidth;
// const height = window.innerHeight;
var width = 960; 
var height = 600; 
var test, world, yearSel, monthCount
var canvas = document.getElementById("canvas");

var pointLocations;
// var canvas = d3.select("body").append("canvas")
// console.log(canvas)
var j=0
canvas.width = width;
canvas.height = height;

canvas.style.width = width;
canvas.style.height = height

var sel = d3.select('#chart')
// d3.selection.prototype.moveToFront = function() {
//     return this.each(function() {
//         this.parentNode.appendChild(this);
//     });
// };

// d3.selectAll(".mobile").style("display", "block");
// var world
d3.loadData(["world.json"], function(err, res) {
    // console.log(res[0])
    world = res[0]
    // count ++
    // console.log(count)
    makeMap(world)
})



 function makeMap(world) {
    var land = topojson.mesh(world, world.objects.land);

    const projection = d3.geoNaturalEarth2()
        .fitSize([width, height], land)
    // .rotate([-180, 0])
    // .precision(0.1);

    var svg = sel
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class",'map')

d3.selectAll("svg").style("opacity", 0);

    var path = d3.geoPath()
        .projection(projection);

    var pathStr = path(topojson.feature(world, world.objects.land));


    var mask = svg.append('mask')
        .attr("id", "ocean")

    mask.append('rect')
        .attr("width", width)
        .attr("height", height)
        .style("fill", '#fff')

    mask.append('path')
        .attr("d", pathStr)
        .style("fill", '#000')

    svg.append('rect')
        .attr("mask", "url(#ocean)")
        .style("fill", '#a9d2df')
        .attr("width", width)
        .attr("height", height)

    svg.append("path")
        // .attr("class", "globe")
        // .datum(topojson.feature(world, world.objects.land))
        .attr("d", pathStr)
        .style("fill", 'none')
        .style("stroke", '#e0e0e0')
        .style("strokeWidth", .01);

        // svg.append("text").text("NPP is a measure of the update of carbon uptake by vegetation. ")
        //     .at({
        //         x: 10,
        //         y: 30
        //     })
        //     .attr('class', 'p')

        // svg.append("text").text("while red means respiration is dominant, usually in the winter")
        //     .at({
        //         x: 100,
        //         y: 85
        //     })
        //     .attr('class', 'p')


    yearSel = svg.append('text').text(' ')
    .at({
        fontSize: 18,
        x: 800,
        y: 30
    })
    // .attr('class', 'h2')
            //create legend
            //create legend
        var colorL = d3.scaleLinear()
            .domain([1,255/2 ,255])
            .range(["#D6D1BB",'#76943b','#163403']);
            
      svg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(30,540)");

        m2 = '²'
        yr = '¹'

        var legendLinear = d3.legendColor()
            .shapeWidth(40)
            .labelFormat(d3.format(".2r"))
            .orient('horizontal')
            .cells(5)
            .labels([0, ,3, ,6])
            .title("g Cm\u207B" + m2 + " day\u207B" + yr)
            .scale(colorL);

        svg.select(".legendLinear")
            .call(legendLinear);
      


        //d3-legend
        // var legend = d3.legendColor()
        //     .shapePadding(5)
        //     .useClass(true)
        //     .scale(legendScale);

        // svg.append('g')
        //     .attr('transform', 'translate(30,400)')
        //     .call(legend);


    monthCount = 0

}

function main(regl, aerosolData, coorData) {

// console.log(coorData.length)
    const numPoints = coorData.length;
    const pointWidth = 1;
    const pointMargin = 1;
    const duration = 1500;
    const delayByIndex = 0
    // const delayByIndex = 1 / numPoints;
    console.log(delayByIndex)
    const maxDuration = duration + delayByIndex * numPoints; // include max delay in here
    // console.log(maxDuration)

    var weeks = 11;
    var allweeks =[];
    endPoints = numPoints;
    startPoints = 0
    for (var i=0; i < weeks; i++) {
        
        allweeks[i] = aerosolData.slice(startPoints,endPoints)
        startPoints = endPoints
        endPoints = endPoints + numPoints
    }

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November']

    // console.log(allweeks)
    // jan = aerosolData.slice(0,numPoints)

    // jan = aerosolData.filter(function(d,i) {
    //     // console.log(d)
    //     return d.date == "41"
    // })

    const toCities = (points) => citiesLayout(points, width, height, allweeks[0],coorData);
    const toCities1 = (points) => citiesLayout(points, width, height, allweeks[1],coorData);
    const toCities2 = (points) => citiesLayout(points, width, height, allweeks[2],coorData);
    const toCities3 = (points) => citiesLayout(points, width, height, allweeks[3],coorData);
    const toCities4 = (points) => citiesLayout(points, width, height, allweeks[4],coorData);
    const toCities5 = (points) => citiesLayout(points, width, height, allweeks[5],coorData);
    const toCities6 = (points) => citiesLayout(points, width, height, allweeks[6],coorData);
    const toCities7 = (points) => citiesLayout(points, width, height, allweeks[7],coorData);
    const toCities8 = (points) => citiesLayout(points, width, height, allweeks[8],coorData);
    const toCities9 = (points) => citiesLayout(points, width, height, allweeks[9],coorData);
    const toCities10 = (points) => citiesLayout(points, width, height, allweeks[10],coorData);
    // const toCities11 = (points) => citiesLayout(points, width, height, allweeks[11],coorData);
    // const toCities12 = (points) => citiesLayout(points, width, height, jan);
    // const toSwarm = (points) => swarmLayout(points, width, height, aerosolData);
    // const toPhoto = (points) => photoLayout(points, width, height, imgData);
    // const toArea = (points) => areaLayout(points, width, height, jan);
    // const toPhyllotaxis = (points) => phyllotaxisLayout(points, pointWidth, width / 2, height / 2, aerosolData);
    // const toMiddle = (points) => {
    // 	points.forEach((d, i) => {
    // 		console.log(d.x)
    // 		d.x = width / 2;
    // 		d.y = height / 2;
    // 		d.color = [0, 0, 0];
    // 	});
    // }
    const toBlack = (points) => {
        points.forEach((d, i) => {
            d.color = [0, 0, 0];
        });
    }

    const layouts = [toCities, toCities1, toCities2, toCities3, toCities4, toCities5, toCities6,
     toCities7,toCities8, toCities9, toCities10];
    let currentLayout = 0;

    // wrap d3 color scales so they produce vec3s with values 0-1
    // also limit the t value to remove darkest color
    function wrapColorScale(scale) {
        const tScale = d3.scaleLinear().domain([0, 1]).range([0.4, 1]);
        return t => {
            const rgb = d3.rgb(scale(tScale(t)));
            return [rgb.r / 255, rgb.g / 255, rgb.b / 255];
        };
    }

    const colorScales = [
        d3.scaleSequential(d3.interpolateViridis),
        d3.scaleSequential(d3.interpolateMagma),
        d3.scaleSequential(d3.interpolateInferno),
        d3.scaleSequential(d3.interpolateCool),
    ].map(wrapColorScale);
    let currentColorScale = 0;



    // function to compile a draw points regl func
    function createDrawPoints(points) {


        const drawPoints = regl({
            frag: `
		  precision highp float;
			varying vec3 fragColor;
			void main() {
				gl_FragColor = vec4(fragColor, 1);
			}
			`,

            vert: `
			attribute vec2 positionStart;
			attribute vec2 positionEnd;
			attribute float index;
			attribute vec3 colorStart;
			attribute vec3 colorEnd;

			varying vec3 fragColor;

			uniform float pointWidth;
			uniform float stageWidth;
			uniform float stageHeight;
			uniform float elapsed;
			uniform float duration;
			uniform float delayByIndex;
			// uniform float tick;
			// uniform float animationRadius;
			uniform float numPoints;

			// helper function to transform from pixel space to normalized device coordinates (NDC)
			// in NDC (0,0) is the middle, (-1, 1) is the top left and (1, -1) is the bottom right.
			vec2 normalizeCoords(vec2 position) {
				// read in the positions into x and y vars
	      float x = position[0];
	      float y = position[1];

				return vec2(
		      2.0 * ((x / stageWidth) - 0.5),
		      // invert y since we think [0,0] is bottom left in pixel space
		      -(2.0 * ((y / stageHeight) - 0.5)));
			}

			// helper function to handle cubic easing (copied from d3 for consistency)
			// note there are pre-made easing functions available via glslify.
			float easeLinear(float t) 

            {
			//	t *= 2.0;
        //t = (t <= 1.0 ? t * t * t : (t -= 2.0) * t * t + 2.0) / 2.0;

        //if (t > 1.0) {
        //  t = 1.0;
        //}

        return +t;
			}

			void main() {
				gl_PointSize = pointWidth;

				float delay = delayByIndex * index;
	      float t;

	      // drawing without animation, so show end state immediately
	      if (duration == 0.0) {
	        t = 1.0;

	      // still delaying before animating
	      } else if (elapsed < delay) {
	        t = 0.0;
	      } else {
	        t = easeLinear((elapsed - delay) / duration);
	      }

	      // interpolate position
	      vec2 position = mix(positionStart, positionEnd, t);

	      // apply an ambient animation
				// float dir = index > numPoints / 2.0 ? 1.0 : -1.0;
	      // position[0] += animationRadius * cos((tick + index) * dir);
	      // position[1] += animationRadius * sin((tick + index) * dir);

	      // above we + index to offset how they move
	      // we multiply by dir to change CW vs CCW for half


	      // interpolate color
	      fragColor = mix(colorStart, colorEnd, t);

	      // scale to normalized device coordinates
				// gl_Position is a special variable that holds the position of a vertex
	      gl_Position = vec4(normalizeCoords(position), 0.0, 1.0);
			}
			`,

            attributes: {
                positionStart: points.map(d => [d.sx, d.sy]),
                // positionEnd: points.map(d => [d.sx, d.sy]),
                positionEnd: points.map(d => [d.tx, d.ty]),
                colorStart: points.map(d => d.colorStart),
                colorEnd: points.map(d => d.colorEnd),
                index: d3.range(points.length),
            },

            uniforms: {
                pointWidth: regl.prop('pointWidth'),
                stageWidth: regl.prop('stageWidth'),
                stageHeight: regl.prop('stageHeight'),
                delayByIndex: regl.prop('delayByIndex'),
                duration: regl.prop('duration'),
                numPoints: numPoints,
                // animationRadius: 0,// 15.0,
                // tick: (reglprops) => { // increase multiplier for faster animation speed
                // 	// console.log(reglprops);
                // 	// return reglprops.tick / 50;
                // 	return 0; // disable ambient animation
                // },
                // time in milliseconds since the prop startTime (i.e. time elapsed)
                elapsed: ({
                    time
                }, {
                    startTime = 0
                }) => (time - startTime) * 1000,
            },

            count: points.length,
            primitive: 'points',
        });

        return drawPoints;
    }
        //Render loop
  
    // function to start animation loop (note: time is in seconds)
    function animate(layout, points, coorData) {
        console.log(months[monthCount])
        // yearSel.transition().duration(100).text(months[monthCount] + ' 2016')
        d3.select("#week").text(months[monthCount] + ' 2016');
        d3.selectAll(".mobile").style("display", "none");
        d3.selectAll("svg").style("opacity", 1);
        
        // d3.select("#week").text(months[monthCount] + ' 2015');

        monthCount++
        // console.log(points)
        console.log('animating with new layout');
        // make previous end the new beginning
        
        // console.log(points)
        points.forEach(function(d,i){
            // console.log(coorData[i])
            d.sx = d.tx;
            d.sy = d.ty;
            d.colorStart = d.colorEnd;
        });

        if (monthCount > weeks - 1) monthCount = 0
        // layout points
        // console.log(points)
        layout(points);

        // copy layout x y to end positions
        const colorScale = colorScales[currentColorScale];

        if(j==0){
            // console.log(j)

            points.forEach(d => {
                d.tx = d.x;
                d.ty = d.y;
                d.sx=d.x;
                d.sy=d.y;
                d.colorStart = d.color;
                d.colorEnd= d.color;
            });

        }else{
            points.forEach((d, i) => {
                d.tx = d.x;
                d.ty = d.y;
                // d.colorEnd = colorScale(i / points.length)
                d.colorEnd = d.color;
            });            
        }
        // console.log(j)
        j+=1

        // points.forEach((d, i) => {
        //     d.tx = d.x;
        //     d.ty = d.y;
        //     // d.colorEnd = colorScale(i / points.length)
        //     d.colorEnd = d.color;
        // });

        // create the regl function with the new start and end points
        // console.log(points)
        const drawPoints = createDrawPoints(points);

        // start an animation loop
        let startTime = null; // in seconds
        const frameLoop = regl.frame(({
            time
        }) => {
            // console.log(time)
            // keep track of start time so we can get time elapsed
            // this is important since time doesn't reset when starting new animations
            if (startTime === null) {
                startTime = time;
            }

            

            // clear the buffer
            // regl.clear({
            // 	// background color (black)
            // 	color: [255, 255, 255, 1],
            // 	depth: 1,
            // });

            // draw the points using our created regl func
            // note that the arguments are available via `regl.prop`.
            // console.log(delayByIndex)
            drawPoints({
                pointWidth,
                stageWidth: width,
                stageHeight: height,
                duration,
                delayByIndex,
                startTime,
            });

            // how long to stay at a final frame before animating again (in seconds)
            const delayAtEnd = 0.1;

            // if we have exceeded the maximum duration, move on to the next animation
            // console.log(maxDuration)
     
            if (time - startTime > (maxDuration/1000)) {
                // console.log(time)
            // if (Math.round(frame) == 0){
                console.log('done animating, moving to next layout');
                // debugger;

                frameLoop.cancel();
                currentLayout = (currentLayout + 1) % layouts.length;
                currentColorScale = (currentColorScale + 1) % colorScales.length;

                // when restarting at the beginning, come back from the middle again
                // if (currentLayout === 0) {
                // 	points.forEach((d, i) => {
                // 		d.tx = width / 2;
                // 		d.ty = height / 2;
                // 		d.colorEnd = [0, 0, 0];
                // 	});
                // }
                // console.log(points)
                animate(layouts[currentLayout], points,coorData);
            }
        });
    }



    ////// create initial set of points
    const points = d3.range(numPoints).map(d => ({}));

    points.forEach((d, i) => {
        // console.log(width)
        d.tx = width / 2;
        d.ty = height / 2;
        d.colorEnd = [0, 0, 0];
    });

    animate(layouts[currentLayout],points,coorData);
}

function loadData() {

    d3.queue()
        .defer(d3.csv, "16-1-11.csv")
        .defer(d3.csv, "coordinates.csv")
        .await(dostuff);

    function dostuff(error,aerosolData,coorData){
        
        aerosolData.forEach(function(d){
            d.npp= +d.npp
        })

        coorData.forEach(function(d){
            d.lat = +d.y,
            d.lng = +d.x
        })

        // pointLocations = coorData.map(function(d){})
        console.log('data has loaded. initializing regl...');
            regl({
        canvas: canvas,
        // callback when regl is initialized
        onDone: (err, regl) => {
            if (err) {
                console.error('Error initializing regl', err);
                return;
            }
            main(regl, aerosolData, coorData);
        },
    });
    }

    // return new Promise(function(resolve, reject) {
    //     var aerosolCsv = function() {
    //         var args = [],
    //             len = arguments.length;
    //         while (len--) args[len] = arguments[len];
    //         console.log(args)
    //         return d3.csv(args[0], function(d) {
    //             return {
    //                 continent: +d.aer,
    //                 lat: +d.y,
    //                 lng: +d.x,
    //                 date: d.week
    //             }
    //         }, args[1])
    //     };
    //     // var coordsRaw = args[1]
        
    //         .await(function(err, aerosolData,coordsRaw) {
    //             console.log(coordsRaw)
    //             // var times = _.uniq(_.flatten(aerosolData.map(d => d3.keys(d.date)))).sort()
                
    //             if (err) {
    //                 console.error("Something went wrong loading data", err);
    //                 reject(err);
    //                 return
    //             }
    //             resolve({
    //                 aerosolData: aerosolData,
    //                 coordsRaw: coordsRaw

    //                 // aerosolData1: aerosolData1
    //                 // imgData: processImageData(imgData, width, height)
    //             })
    //         })
    // })

    
}
loadData()
//     .then(({
//     aerosolData
// }) => {
//     console.log(d3.map(aerosolData, function(d) {
//         return d.date;
//     }).keys())
//     console.log('data has loaded. initializing regl...');

//     // initialize regl
//     regl({
//         canvas: canvas,
//         // callback when regl is initialized
//         onDone: (err, regl) => {
//             if (err) {
//                 console.error('Error initializing regl', err);
//                 return;
//             }
//             main(regl, aerosolData);
//         },
//     });
// });