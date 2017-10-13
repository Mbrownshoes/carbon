//draw on a map

var test

d3.loadData(["Data/2012.csv","world.json"], function(err,res){
    animation(res[0], res[1])
})

function animation(res, world){
    console.log(res)
    data = res



// d3.csv("Data/201201.csv", function(error, data) {

    // d3.json("world.json", function(error, world) {

        data.forEach(function(d) {
            d.bio_flux_opt = +d.bio_flux_opt
            // d.tot = +d.tot
        });

        test = data

        var width = 960,
        height = 800;

        var sel = d3.select('#graphic-0')
        var ctx = sel
            .html('')
            .append('canvas')
            .attr('width',width)
            .attr('height',height)
            .node()
            .getContext('2d')

        var land = topojson.mesh(world, world.objects.land);

        const projection = d3.geoNaturalEarth2()
            .fitSize([width,height],land)
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
            .attr("id","ocean")

        mask.append('rect')
            .attr("width", width)
            .attr("height", height)
            .style("fill",'#fff')

        mask.append('path')
            .attr("d",pathStr)
            .style("fill",'#000')

        svg.append('rect')
            .attr("mask", "url(#ocean)")
            .style("fill",'#fff')
            .attr("width", width)
            .attr("height", height)


        svg.append("path")
          // .attr("class", "globe")
          // .datum(topojson.feature(world, world.objects.land))
          .attr("d", pathStr)            
        .style("fill",'none')
        .style("stroke",'#e0e0e0')
        .style("strokeWidth", .01);

        window.points = data

        var color = d3.scaleLinear()
        .domain([d3.min(data, d => d.bio_flux_opt), 0, d3.max(data, d => d.bio_flux_opt)])
        .range(["#00441b", "white", "red"]);


        var times = d3.map(data, function(d){return d.yymm;}).keys()
        
        var curTimeIndex = 0
        window.animationtimer = d3.interval(() =>{
            var top = sel.node().getBoundingClientRect().top
            if (top < -500 || innerHeight < top) return

            drawTime(times[curTimeIndex++ % times.length])
        },200)

        function drawTime(time){
            ctx.clearRect(0,0, width, height)
            test.filter(function(d){return d.yymm == time}).forEach(d => {
                    // console.log(d)
                ctx.beginPath()
                var [x, y] = projection([d.x,d.y])
                ctx.rect(x, y, 3, 3)
                ctx.fillStyle = color(d.bio_flux_opt)
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
        
        // })
}
//     });

// })



