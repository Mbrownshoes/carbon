# convert netcdf to raster http://geog.uoregon.edu/GeogR/topics/netcdf-to-raster.html 

require(ncdf4)
library(raster)
library(maptools)
library(maps)
library(rasterVis)
library(dplyr)
library(jsonlite)
library(tidyr)
library(data.table)
library(ggplot2)
workdir <-'//Users//mathewbrown//projects//Rstuff//carbonFlux'
setwd(workdir)

#download several months
datalist =list()
j=0
# download 5 days and create an average
for (i in 1:30){
  # j=j+1
  # print(d)
  site <- "ftp://aftp.cmdl.noaa.gov/products/carbontracker/co2/CT2016/fluxes/three-hourly/CT2016.flux1x1.201505"
  i = sprintf("%02d", i)
  url = paste0(site,i,'.nc')
  print(url)
  destfile <- paste0('Data/',2015,'05',i,'.nc')
  download.file(url,destfile)
  ncin <- nc_open(destfile)
  lon <- ncvar_get(ncin, "longitude")
  nlon <- dim(lon)
  lat <- ncvar_get(ncin, "latitude")
  nlat <- dim(lat)
  tc <- ncvar_get(ncin, "time_components")
  t <- ncvar_get(ncin, "time")
  nt <- dim(t)
  #Get the variable and its attributes, and verify the size of the array.
  tmp.array <- ncvar_get(ncin, 'bio_flux_opt')
  lonlat <- expand.grid(lon, lat)
  #calculate daily average for each location
  tmp.vec.long <- as.vector(tmp.array)
  tmp.mat <- matrix(tmp.vec.long, nrow = nlon * nlat, ncol = nt)
  tmp.df02 <- data.frame(cbind(lonlat, tmp.mat))
  tmp.df02 <- mutate(tmp.df02,yymm=paste0('05',i))
  names(tmp.df02) <- c("x", "y", paste0(tc[2,1],i,0,tc[4,1]),  paste0(tc[2,1],i,0,tc[4,2]), paste0(tc[2,1],i,0,tc[4,3]), paste0(tc[2,1],i,tc[4,4]), paste0(tc[2,1],i,tc[4,5]), 
                       paste0(tc[2,1],i,tc[4,6]), paste0(tc[2,1],i,tc[4,7]), paste0(tc[2,1],i,tc[4,8]),'date')
  tmp.df02$mean <- apply(tmp.df02[3:10], 1, mean)  # daily (i.e. row) means
  drops <- c(paste0(tc[2,1],i,0,tc[4,1]),  paste0(tc[2,1],i,0,tc[4,2]), paste0(tc[2,1],i,0,tc[4,3]), paste0(tc[2,1],i,tc[4,4]), paste0(tc[2,1],i,tc[4,5]), 
             paste0(tc[2,1],i,tc[4,6]), paste0(tc[2,1],i,tc[4,7]), paste0(tc[2,1],i,tc[4,8]))
  # date=paste0(tc[1,1],tc[2,1],tc[3,1],0,tc[4,1])           
  df.daily=tmp.df02[, !(names(tmp.df02) %in% drops )]
  
  
  datalist[[i]] <- df.daily
}

#bind all months
x <- bind_rows(datalist)
saveRDS(x, file="bioPointsDaily.rds")
x <- readRDS("bioPointsDaily.rds")

names(x) <- c('x','y','mmdd','bio_flux_opt')
x$bio_flux_opt=x$bio_flux_opt*(44/12)*3600*24*365
# remove rows with 0 flux
# b <- data.table(x)
b=dplyr::mutate(x, bio_flux_opt = round(bio_flux_opt,2))
b=data.table(dplyr::filter(b, bio_flux_opt !=0))


#split by location
#use to drop split columns - works but not nested correctly
mysplitDT <- function(x, bycols){ 
  split( x[, !bycols, with=FALSE], x[, bycols, with=FALSE] )
}

byXY <- mysplitDT(b, by=c("x", "y"))

#remove empyty dataframes (over the ocean)
byXY=byXY[sapply(byXY,nrow) >0]

#make list of lists as prep to convert to json
listLoc1 =lapply(names(byXY),function(z){
  n=byXY[[z]]$mmdd
  m= lapply(seq(nrow(byXY[[z]])),function(i){
    byXY[[z]][i]$bio_flux_op
  })
  names(m) <- n
  list(loc=z,vals=m)
})

save(listLoc1, file = "list30days.RData")

jsonOut<-toJSON(listLoc1,pretty=FALSE, auto_unbox = TRUE)
jsonOut=gsub('"2012', '"12', jsonOut)
cat(jsonOut,file='fluxdaily.json')



# experimentation ###############

#this analysis - http://geog.uoregon.edu/bartlein/courses/geog607/Rmd/netCDF_01.htm
#get lat long
lon <- ncvar_get(ncin, "longitude")
nlon <- dim(lon)
head(lon)

lat <- ncvar_get(ncin, "latitude")
nlat <- dim(lat)
head(lat)
print(c(nlon, nlat))

# get netcdf time
t <- ncvar_get(ncin, "time")
tc <- ncvar_get(ncin, "time_components")
tunits <- ncatt_get(ncin, "time", "units")
nt <- dim(t)
chron(t, origin = c(tmonth, tday, tyear))

#Get the variable and its attributes, and verify the size of the array.
tmp.array <- ncvar_get(ncin, 'bio_flux_opt')
# dlname <- ncatt_get(ncin, dname, "long_name")
dunits <- ncatt_get(ncin, 'bio_flux_opt', "units")
fillvalue <- ncatt_get(ncin, 'bio_flux_opt', "_FillValue")
dim(tmp.array)

tmp.array[tmp.array == fillvalue$value] <- NA
length(na.omit(as.vector(tmp.array[, , 1])))



#create a data frame of one 'slice'

lonlat <- expand.grid(lon, lat)

datalist =list()
for (i in 1:length(t)){
  print(i)
  tmp.slice <- tmp.array[, , i]
  tmp.vec <- as.vector(tmp.slice)
  tmp.df <- data.frame(cbind(lonlat, tmp.vec))
  names(tmp.df) <- c("lon", "lat", paste('bio_flux_opt', as.character(m), sep = "_"))
  datalist[[i]] <- tmp.df
  
}
m <- 1
tmp.slice <- tmp.array[, , 5]

#quick map
image(lon, lat, tmp.slice, col = rev(brewer.pal(10, "RdBu")))

#create data frame
lonlat <- expand.grid(lon, lat)
tmp.vec <- as.vector(tmp.slice)
length(tmp.vec)

tmp.df01 <- data.frame(cbind(lonlat, tmp.vec))

names(tmp.df01) <- c("lon", "lat", paste('bio_flux_opt', as.character(m), sep = "_"))
head(na.omit(tmp.df01), 20)


#calculate daily average for each location
tmp.vec.long <- as.vector(tmp.array)
length(tmp.vec.long)

tmp.mat <- matrix(tmp.vec.long, nrow = nlon * nlat, ncol = nt)
head(na.omit(tmp.mat))
#create dataframe from matrix
lonlat <- expand.grid(lon, lat)
tmp.df02 <- data.frame(cbind(lonlat, tmp.mat))
names(tmp.df02) <- c("lon", "lat", paste0(tc[3,1],0,tc[4,1]),  paste0(tc[3,1],0,tc[4,2]),  paste0(tc[3,1],tc[4,3]), paste0(tc[3,1],tc[4,4]), paste0(tc[3,1],0,tc[4,5]), 
                     paste0(tc[3,1],tc[4,6]), paste0(tc[3,1],tc[4,7]),  paste0(tc[3,1],tc[4,8]))

#get min, max and mean 
# tmp.df02$dmax <- apply(tmp.df02[3:10], 1, max)  # mtwa
# tmp.df02$dmin <- apply(tmp.df02[3:10], 1, min)  # mtco
tmp.df02$mean <- apply(tmp.df02[3:10], 1, mean)  # daily (i.e. row) means

drops <- c(paste0(tc[3,1],0,tc[4,1]),  paste0(tc[3,1],0,tc[4,2]),  paste0(tc[3,1],tc[4,3]), paste0(tc[3,1],tc[4,4]), paste0(tc[3,1],0,tc[4,5]), 
           paste0(tc[3,1],tc[4,6]), paste0(tc[3,1],tc[4,7]),  paste0(tc[3,1],tc[4,8]))
date=paste0(tc[1,1],tc[2,1],tc[3,1],0,tc[4,1])           
df.daily=tmp.df02[, !(names(tmp.df02) %in% drops )]

