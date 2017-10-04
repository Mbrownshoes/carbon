# convert netcdf to raster http://geog.uoregon.edu/GeogR/topics/netcdf-to-raster.html 


require(ncdf4)
library(raster)
library(maptools)
library(maps)
library(rasterVis)
library(dplyr)
library(jsonlite)
workdir <-'//Users//mathewbrown//projects//Rstuff//carbonFlux'
setwd(workdir)

#download several months
datalist =list()

for (i in 1:2){
  site <- "ftp://aftp.cmdl.noaa.gov/products/carbontracker/co2/CT2016/fluxes/monthly/CT2016.flux1x1."
  i = sprintf("%02d", i)
  url = paste0(site,'2012',i,'.nc')
  # print(url)
  destfile <- paste0('Data/','2012',i,'.nc')
  download.file(url,destfile)
  #create csv
  ncin <- nc_open(destfile)
  bio <- raster(destfile,varname='bio_flux_opt')
  mapPointsBio <- as.data.frame(rasterToPoints(bio))
  mapPointsBio$bio_flux_opt = mapPointsBio$bio_flux_opt*12*3600*24*365
  #create timestamp column
  mapPointsBio <- mutate(mapPointsBio,yymm=paste0('2012',i))
  datalist[[i]] <- mapPointsBio
  
  write.csv(mapPointsBio, file=paste0(substr(destfile,1,nchar(destfile)-3),".csv"), row.names=F)
  
}

#bind all months
x <- bind_rows(datalist)

#use jsonlite to combine csvs to json object https://roadtolarissa.com/hurricane/



cname <- 'Data//CT2016.flux1x1.2012-monthly.nc'

ncin <- nc_open(cname)

print(ncin)

#sum flux components for total surface co2 exchange
#tot = ncatt_get(ncin,'bio_flux_opt')

# use raster to read ncdf
time <- raster(cname,varname='time')
bio <- raster(cname,varname='bio_flux_opt')
ocn <- raster(cname,varname='ocn_flux_opt')
fossil <- raster(cname,varname='fossil_flux_imp')
fire <- raster(cname,varname='fire_flux_imp')

monthly=12*3600*24*365

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
  mutate(tot=sum(bio_flux_opt,ocn_flux_opt))

df_sum$bio_flux_opt = df_sum$bio_flux_opt*monthly 
df_sum$tot = df_sum$tot*monthly

write.csv(df_sum, file=paste0(substr(cname,1,nchar(cname)-3),".csv"), row.names=F)


datain <- raster(cname,varname='bio_flux_opt')
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
