//draw on a map
// var test
// d3.select('body').append("text").text("Just one sec, there's a bunch of data to load ... ")
// .at({
//             fontSize: 30,
//             x: 100,
//             y: 40
//         })
var count
// d3.loadData(["fluxJan.json", "world.json"], function(err, res) {
// first just load map and jan data, then animate
// console.log(res[1])
count = 1
//     animation(res[0], res[1])
// })


d3.loadData(["fluxNew.json", "world.json"], function(err, res) {
    // console.log(res[1])
    count++
    console.log(count)
    animation(res[0], res[1])
})

function animation(res, world) {
    console.log('run')
    data = res
    // test = data



    // d3.csv("Data/201201.csv", function(error, data) {

    // d3.json("world.json", function(error, world) {

    data.forEach(function(d) {
        // console.log(d)
        // d.bio_flux_opt = +d.bio_flux_opt
        all = d.loc.split('.')
        d.x = all[0] + '.' + all[1]
        d.y = all[2] + '.' + all[3]
        // d.tot = +d.tot
    });

    // test = data

    var width = 960,
        height = 800;

    var sel = d3.select('#graphic-0')
    // var c = d3.conventions({parentSel: sel, height: 460})

    var ctx = sel
        .html('')
        .append('canvas')
        .attr('width', width)
        .attr('height', height)
        .node()
        .getContext('2d')

    var land = topojson.mesh(world, world.objects.land);

    const projection = d3.geoNaturalEarth2()
        .fitSize([width, height], land)
    // .rotate([-180, 0])
    // .precision(0.1);

    var svg = sel
        .append("svg")
        .attr("width", width)
        .attr("height", height)


    var path = d3.geoPath()
        .projection(projection);

    var pathStr = path(topojson.feature(world, world.objects.land));

    var mask = svg.append('mask')
        .attr("id", "ocean")

    mask.append('rect')
        .attr("width", width)
        .attr("height", 680)
        .style("fill", '#fff')

    mask.append('path')
        .attr("d", pathStr)
        .style("fill", '#000')

    svg.append('rect')
        .attr("mask", "url(#ocean)")
        .style("fill", '#f7fbff')
        .attr("width", width)
        .attr("height", height)


    svg.append("path")
        // .attr("class", "globe")
        // .datum(topojson.feature(world, world.objects.land))
        .attr("d", pathStr)
        .style("fill", 'none')
        .style("stroke", '#e0e0e0')
        .style("strokeWidth", .01);
    if (count == 2) {
        window.points = data


        a = []
        data.forEach(function(d) {
            var total = 0;
            d.totals = {}

            for (key in d.vals) {
                total += d.vals[key]
                a.push(d.vals[key])
                d.totals[key] = total
            }
            // console.log(a)
            // d.pos = projection([d.x,d.y])
        })
        // console.log(d3.max(a))
        var color = d3.scaleLinear()
            .domain([d3.min(a), 0, d3.max(a)])
            .range(["#00441b", "white", "red"]);
        // console.log(color)

        // var thresholdScale = d3.scaleThreshold()
        //     .domain([d3.min(a), 0, d3.max(a)])
        //     .range(["rgb(46, 73, 123)", "rgb(71, 187, 94)"]);

        // var linear = d3.scaleLinear()
        //   .domain([0,10])
        //   .range(["rgb(46, 73, 123)", "rgb(71, 187, 94)"]);

        // var svg = d3.select("svg");


        svg.append("g")
            .attr("class", "legendLinear")
            .attr("transform", "translate(40,680)");

        m2 = '²'
        yr = '¹'

        var legendLinear = d3.legendColor()
            .shapeWidth(80)
            .labelFormat(d3.format(".2r"))
            .orient('horizontal')
            .cells(10)
            .title("g Cm\u207B" + m2 + " yr\u207B" + yr)
            .scale(color);

        svg.select(".legendLinear")
            .call(legendLinear);


        //subtitle
        // svg.append('text')
        //     .attr('x', 40)
        //     .attr('y', 750)
        //     .attr('class','subtex')
        //     .text('Green means a carbon uptake by the land')

        // svg.append('text')
        //     .attr('x', 600)
        //     .attr('y', 750)
        //     .attr('class','subtex')
        //     .text('Red means a carbon release to the atmosphere')

        // var times = d3.map(data, function(d){return d.yymm;}).keys()
        var times = _.uniq(_.flatten(data.map(d => d3.keys(d.vals)))).sort()
        // console.log(times)

        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

        svg.append("text").text("The Earth's terrestrial carbon flux")
            .at({
                fontSize: 30,
                x: 100,
                y: 40
            })
            .attr('class', 'h1')

        svg.append("text").text("Green means photosynthesis is the dominant flux, usually during the growing season,")
            .at({
                x: 100,
                y: 70
            })
            .attr('class', 'p')

        svg.append("text").text("while red means respiration is dominant, usually in the winter")
            .at({
                x: 100,
                y: 85
            })
            .attr('class', 'p')


        //create legend
        var legendScale = d3.scaleOrdinal()
            .domain(['Carbon uptake', 'Carbon release'])
            .range(['record', 'avg'])

        //d3-legend
        var legend = d3.legendColor()
            .shapePadding(5)
            .useClass(true)
            .scale(legendScale);

        svg.append('g')
            .attr('transform', 'translate(30,400)')
            .call(legend);

        // svg.append('text')
        //     .attr('x', 40)
        //     .attr('y', 750)
        //     .attr('class','subtex')


        var yearSel = svg.append('text').text(' ')
            .at({
                fontSize: 30,
                x: 620,
                y: 100
            })
            .attr('class', 'h2')

        var curTimeIndex = 0
        var monthCount = 0

        window.animationtimer = d3.interval(() => {


            var top = sel.node().getBoundingClientRect().top

            if (top < -500 || innerHeight < top) return
            drawTime(times[curTimeIndex])
            // debugger;
            yearSel.transition().duration(100).text(months[monthCount] + ' ' + 20 + times[curTimeIndex].substr(0, 2))
            // .attrTween('year-text', () => {
            //     console.log('here')
            // return t => yearSel.text(months[curTimeIndex] +' ' +20+times[curTimeIndex].substr(0,2))
            // })
            curTimeIndex++
            monthCount++
            // restart counters when done
            if (monthCount > 11) monthCount = 0
            if (curTimeIndex > times.length - 1) curTimeIndex = 0
        }, 6000)






        function drawTime(time) {

  var setColor = function setColor(val) {
    ctx.clearRect(0,0, width, height);
    ctx.fillStyle = val;
    // context.arc(200, 200, 200, 0, 2 * Math.PI, true);
    // ctx.fill();
    // ctx.closePath(); 
  }
  
            // console.log(time)
            if (time == 1201) {
                oldtime = 1202
                ctx.clearRect(0, 0, width, height)
                data.filter(d => d.vals[time]).forEach(d => {
                    // console.log(d.vals[time])
                    ctx.beginPath()
                    var [x, y] = projection([d.x, d.y])
                    ctx.rect(x, y, 3, 3)
                    ctx.fillStyle = color(+d.vals[time])
                    ctx.fill()
                })
            }
            // Create an in memory only element of type 'custom'
            var detachedContainer = document.createElement("custom");
  // oldtime = oldtime -1
                    oldtime= time-1
                    console.log(oldtime)

                //CANT FILTER AND THEN CALL LAST VALUE
                data.filter(d => d.vals[time]).forEach(d => {
                  


                    // oldColor = color(+d.vals[time-1])
                    // console.log(d)
                    ctx.beginPath()
                    var [x, y] = projection([d.x, d.y])
                    ctx.rect(x, y, 3, 3)


                    var colorTran = d3.interpolateLab('green','red');
                    // console.log(colorTran)
                 var xx = 0;
                  var t = d3.interval(function() {
                    if (xx < 10) {
                      xx += 0.1;
                      // console.log(setColor(colorTran(xx)))
                          setColor(colorTran(xx));
                    } else {
                      xx = 0;
                    }
                  }, 10);
                    // setColor(colorTran)
                    ctx.fill()
                })

        }

        // d3.scaleLinear()
        //     .domain([d3.min(data, d => d.bio_flux_opt),0, d3.max(data, d => d.bio_flux_opt)])
        //     .range(['#d73027','#ffff','#1a9850']);

        // data.forEach(d => {

        //     var [x,y] = projection([d.x, d.y])
        //     ctx.beginPath()
        //     ctx.rect(x,y,3,3)
        //     ctx.fillStyle = color(d.bio_flux_opt)           
        //     ctx.fill()
    }
    // })
}
//     });

// })