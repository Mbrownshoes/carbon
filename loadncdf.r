# convert netcdf to raster http://geog.uoregon.edu/GeogR/topics/netcdf-to-raster.html 


require(ncdf4)
library(raster)
library(maptools)
library(maps)
library(rasterVis)
library(dplyr)
workdir <-'//Users//mathewbrown//projects//Rstuff//carbonFlux'
setwd(workdir)
cname <- 'CT2016.flux1x1.200101.nc'

ncin <- nc_open(cname)

print(ncin)

#sum flux components for total surface co2 exchange
#tot = ncatt_get(ncin,'bio_flux_opt')

# use raster to read ncdf
bio <- raster(cname,varname='bio_flux_opt')
ocn <- raster(cname,varname='ocn_flux_opt')
fossil <- raster(cname,varname='fossil_flux_imp')
fire <- raster(cname,varname='fire_flux_imp')

#Put data into data frame
mapPointsBio <- as.data.frame(rasterToPoints(bio))
mapPointsOcn <- as.data.frame(rasterToPoints(ocn))
mapPointsFossil <- as.data.frame(rasterToPoints(fossil))
mapPointsFire <- as.data.frame(rasterToPoints(fire))

#merge data frames
all=full_join(mapPointsBio,mapPointsOcn)
all=full_join(all,mapPointsFossil)
all=full_join(all,mapPointsFire)

df_sum= all %>%
  rowwise() %>%
  mutate(tot=sum(bio_flux_opt,ocn_flux_opt,fossil_flux_imp,fire_flux_imp))

write.csv(df_sum, file=paste0(substr(cname,1,nchar(cname)-3),".csv"), row.names=F)


datain <- raster(cname)
datain <- setMinMax(datain)

print(datain)

saveRDS(datain,file=paste0("200101",'.rds'))



# plot an example
world.outlines <- map('world',plot=FALSE)
world.outlines.sp <- map2SpatialLines(world.outlines, proj4string = CRS("+proj=longlat"))

mapTheme <- rasterTheme(region = rev(brewer.pal(10, "RdBu")))

plt <- levelplot(datain, margin = F, cuts=30, pretty=TRUE, par.settings = mapTheme,
                 main="Carbon Flux")
 plt + layer(sp.lines(world.outlines.sp, col = "black", lwd = 0.5))
