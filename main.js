//draw on a map




d3.csv("CT2016.flux1x1.200101.csv", function(error, data) {

    d3.json("world.json", function(error, world) {

        data.forEach(function(d) {
            d.bio_flux_opt = +d.bio_flux_opt
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

        var land = topojson.feature(world, world.objects.land);

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
        var pathStr = path(topojson.mesh(world, world.objects.land));


        svg.append("path")
          // .attr("class", "globe")
          // .datum(topojson.feature(world, world.objects.land))
          .attr("d", pathStr)            
        .style("fill",'none')
        .style("stroke",'#000')
        .style("strokeWidth", .5);

console.log(d3.max(data,function(d){
    return +d.bio_flux_opt
}))
console.log(d3.min(data, d => d.bio_flux_opt))

        var color = d3.scaleLinear()
        .domain([d3.min(data, d => d.bio_flux_opt), 0, d3.max(data, d => d.bio_flux_opt)])
        .range(["green", "white", "red"]);

        // d3.scaleLinear()
        //     .domain([d3.min(data, d => d.bio_flux_opt),0, d3.max(data, d => d.bio_flux_opt)])
        //     .range(['#d73027','#ffff','#1a9850']);

        data.forEach(d => {
            // console.log((d.bio_flux_opt))
            // console.log(color(d.bio_flux_opt))
            var [x,y] = projection([d.x, d.y])
            ctx.beginPath()
            ctx.rect(x,y,3,3)
            ctx.fillStyle = d3.rgb(color(d.bio_flux_opt))            
            ctx.fill()
        })

    });

})



