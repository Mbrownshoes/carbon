function toVectorColor(colorStr) {
    var rgb = d3.rgb(colorStr);
    return [rgb.r / 255, rgb.g / 255, rgb.b / 255]
}




function colorDataByContinent(data, aerosolData) {
    // var colorScale = d3.scaleOrdinal().domain(["NA", "SA", "EU", "AS", "AF", "OC", "AN"]).range(d3.range(0, 1, 1 / 6).concat(1).map(d3.scaleSequential(d3.interpolateCool)));
    // console.log(d3.min(aerosolData,function(d){return d.aer}))
    // console.log(d3.max(aerosolData, function(d) {
    //         return d.aer
    //     }))
    var colorScale = d3.scaleLinear()
        .domain([0, d3.max(aerosolData, function(d) {return d.npp; })/2,
         d3.max(aerosolData, function(d) {return d.npp; })])

        // .domain([d3.min(aerosolData, function(d) {
        //     return d.aer
        // }), d3.max(aerosolData, function(d) {
        //     return d.aer
        // })])
        .range(["#D6D1BB",'#76943b','#163403']);
    // var varyLightness = function(color) {
    //     var hsl = d3.hsl(color);
    //     hsl.l *= .1 + Math.random();
    //     return hsl.toString()
    // };
    data.forEach(function(d, i) {
        // console.log(colorScale(aerosolData[i].aer))
        d.color = toVectorColor((colorScale(aerosolData[i].npp)))
    })
}

function citiesLayout(points, width, height, aerosolData,coorData) {
    // console.log(coorData)
    // debugger;
    function projectData(data,coorData) {
        var latExtent = d3.extent(coorData, function(d) {
            return d.lat
        });
        // console.log('lat:', latExtent)
        var lngExtent = d3.extent(coorData, function(d) {
            return d.lng
        });
        // console.log('lng:',lngExtent)
        var extentGeoJson = {
            type: "LineString",
            coordinates: [
                [lngExtent[0], latExtent[0]],
                [lngExtent[1], latExtent[1]]
            ]
        };
        // console.log(world)
        var land = topojson.mesh(world, world.objects.land);
        var projection = d3.geoNaturalEarth2().fitSize([width, height], land);
        
        // console.log(aerosolData)
        // data.forEach(function(d, i) {
        //     var p = aerosolData[i];
        //     // if(i>64000){
        //     // 	console.log(city.lng)
        //     // }
        //     // console.log(i)
        //     // console.log(projection([city.lng, city.lat]))
        //     var location = projection([p.lng, p.lat]);
        //     d.x = location[0];
        //     d.y = location[1]
        // })
        // console.log(data)
        // var projection = d3.geoMercator()
        // .rotate([126, 0])
        // .center([78, 24])
        // // .parallels([50, 58.5])
        // .scale(1200)
        // .translate([960 / 2, 600 / 2]);
        // .fitSize([width, height], extentGeoJson);
        
        data.forEach(function(d, i) {
            // console.log(coorData[i])
            var p = coorData[i];
            
            var location = projection([p.lng, p.lat]);
            d.x = location[0];
            d.y = location[1]
        })
        



    }
    // console.log(points)
    projectData(points, coorData);
    colorDataByContinent(points, aerosolData)
}

// function areaLayout(points, width, height, aerosolData) {
//     colorDataByContinent(points, aerosolData);
//     var rng = d3.randomNormal(0, .2);
//     var pointWidth = Math.round(width / 800);
//     var pointMargin = 1;
//     var pointHeight = pointWidth * .375;
//     var latExtent = d3.extent(aerosolData, function(d) {
//         return d.lat
//     });
//     var xScale = d3.scaleQuantize().domain(latExtent).range(d3.range(0, width, pointWidth + pointMargin));
//     var binCounts = xScale.range().reduce(function(accum, binNum) {
//         accum[binNum] = 0;
//         return accum
//     }, {});
//     var byContinent = d3.nest().key(function(d) {
//         return d.aer
//     }).entries(aerosolData);
//     aerosolData.forEach(function(city, i) {
//         city.d = points[i]
//     });
//     byContinent.forEach(function(aer, i) {
//         aer.values.forEach(function(city, j) {
//             var d = city.d;
//             var binNum = xScale(city.lat);
//             d.x = binNum;
//             d.y = height - pointHeight * binCounts[binNum];
//             binCounts[binNum] += 1
//         })
//     })
// }

// function areaLayout(points, width, height, aerosolData) {
//     colorDataByContinent(points, aerosolData);
//     var rng = d3.randomNormal(0, .2);
//     var pointWidth = Math.round(width / 800);
//     var pointMargin = 1;
//     var pointHeight = pointWidth * .375;
//     var latExtent = d3.extent(aerosolData, function(d) {
//         return d.lat
//     });
//     var xScale = d3.scaleQuantize().domain(latExtent).range(d3.range(0, width, pointWidth + pointMargin));
//     var binCounts = xScale.range().reduce(function(accum, binNum) {
//         accum[binNum] = 0;
//         return accum
//     }, {});
//     var byContinent = d3.nest().key(function(d) {
//         return d.aer
//     }).entries(aerosolData);
//     aerosolData.forEach(function(city, i) {
//         city.d = points[i]
//     });
//     byContinent.forEach(function(aer, i) {
//         aer.values.forEach(function(city, j) {
//             var d = city.d;
//             var binNum = xScale(city.lat);
//             d.x = binNum;
//             d.y = height - pointHeight * binCounts[binNum];
//             binCounts[binNum] += 1
//         })
//     })
// }