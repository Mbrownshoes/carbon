//draw on a map




d3.csv("Data/201201.csv", function(error, data) {

    d3.json("world.json", function(error, world) {

        data.forEach(function(d) {
            d.bio_flux_opt = +d.bio_flux_opt
            d.tot = +d.tot
        });

        var width = 960,
        height = 800;

        var ctx = d3.select('#graphic-0')
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

        var svg = d3.select("#graphic-0")
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

console.log(d3.max(data,function(d){
    return d.tot
}))
console.log(d3.min(data, d => d.tot))

        var color = d3.scaleLinear()
        .domain([d3.min(data, d => d.bio_flux_opt), 0, d3.max(data, d => d.bio_flux_opt)])
        .range(["#081d58", "white", "red"]);

        // d3.scaleLinear()
        //     .domain([d3.min(data, d => d.bio_flux_opt),0, d3.max(data, d => d.bio_flux_opt)])
        //     .range(['#d73027','#ffff','#1a9850']);

        data.forEach(d => {
            // if(d.bio_flux_opt == 0){
            //     var [x,y] = projection([d.x, d.y])
            // ctx.beginPath()
            // ctx.rect(x,y,3,3)
            // // ctx.arc(x,y, 2, 0, 2 * Math.PI)
            // ctx.fillStyle = "white"           
            // ctx.fill()
            // }else{
            // console.log((d.bio_flux_opt))
            // console.log(color(d.bio_flux_opt))
            var [x,y] = projection([d.x, d.y])
            ctx.beginPath()
            ctx.rect(x,y,3,3)
            // ctx.arc(x,y, 2, 0, 2 * Math.PI)
            ctx.fillStyle = color(d.bio_flux_opt)           
            ctx.fill()
        // }
        })

    });

})



