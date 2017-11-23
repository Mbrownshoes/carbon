library(raster)
library(sp)
library(rgdal)
library(ggplot2)
library(dplyr)
x<-read.csv('Data/MODAL2_E_AER_OD_2017-11-01_rgb_3600x1800.CSV')

fileN <- paste0('Data/16-02.tiff')
map <- raster(fileN)
map
map1[map1 == 255] <- NA #takes a while
map@crs

hist(map1,main='Distribution',
     col='purple')
plot(ocean,main='Aerosol values')

col <-heat.colors(100)
image(map,zlim=c(0,255),col=col)

#Crop the raster
plot(map)
cropbox1 <- drawExtent()

#crop the raster, then plot the new cropped raster
mapcrop1 <- crop(map, cropbox1)
plot(mapcrop1)

#manually assign coordinates to crop - India
cropbox2 <- c(60,95,10,39)
mapcrop2 <- crop(map, cropbox2)

plot(mapcrop2)
mapcrop2

mapPoints = as.data.frame(rasterToPoints(map))
colnames(mapPoints)[3] <- 'aer'
write.csv(mapPoints, file=paste0("Data/","nov1",".csv"), row.names=F)


# get regions data

ocean <- raster('Data/ocean.TIFF')
ocean[ocean == 255] <- NA #takes a while
oceanPoints <- as.data.frame(rasterToPoints(ocean))
datalist =list()
j=0
for(i in 1:3){
  j=j+1
  i = sprintf("%02d", i)
  fileN <- paste0('Data/16-',i,'.tiff')
  map <- raster(fileN)
  #remove non measurements
  # map[map == 255] <- 0 #takes a while
  # map[is.na(map)] <- -9
  
  #manually assign coordinates to crop - India  
  # cropbox2 <- c(60,95,9,39)
  # cropbox2 <- c(60,100,5,39)
  # mapcrop2 <- crop(map, cropbox2)
  mapPoints = as.data.frame(rasterToPoints(map))
  # mapPoints <- mutate(mapPoints,week=i)
  colnames(mapPoints)[3] <- 'npp'
  mapPoints<-anti_join(mapPoints, oceanPoints, by = c("x", "y"))
  
  #order points by x and y
  mapPoints<-mapPoints[order(mapPoints$x,mapPoints$y),]
 
  #get lat long
  coords<-dplyr::select(mapPoints,x,y)
  #points
  mapPoints<-dplyr::select(mapPoints,npp)
  if(j==1){
    write.csv(coords, file=paste0("regl/coordinates",".csv"), row.names=F)
  }
  write.csv(mapPoints, file=paste0("regl/16-",i,".csv"), row.names=F)
  datalist[[j]] <- mapPoints
}
x <- bind_rows(datalist)
write.csv(x, file=paste0("regl/16-1-11",".csv"), row.names=F)

# rasters have different number of values. 
fileN <- paste0('Data/16-01.tiff')
map1 <- raster(fileN)
mapPoints1 = as.data.frame(rasterToPoints(map1))

fileN2 <- paste0('Data/16-02.tiff')
map2 <- raster(fileN2)
mapPoints2 = as.data.frame(rasterToPoints(map2))

fileN3 <- paste0('Data/16-03.tiff')
map3 <- raster(fileN3)
mapPoints3 = as.data.frame(rasterToPoints(map3))

fileN4 <- paste0('Data/16-04.tiff')
map4 <- raster(fileN4)
mapPoints4 = as.data.frame(rasterToPoints(map4))

fileN5 <- paste0('Data/16-05.tiff')
map5 <- raster(fileN5)
mapPoints5 = as.data.frame(rasterToPoints(map5))

fileN6 <- paste0('Data/16-06.tiff')
map6 <- raster(fileN6)
mapPoints6 = as.data.frame(rasterToPoints(map6))

fileN7 <- paste0('Data/16-07.tiff')
map7 <- raster(fileN7)
mapPoints7 = as.data.frame(rasterToPoints(map7))

fileN8 <- paste0('Data/16-08.tiff')
map8 <- raster(fileN8)
mapPoints8 = as.data.frame(rasterToPoints(map8))

fileN9 <- paste0('Data/16-09.tiff')
map9 <- raster(fileN9)
mapPoints9 = as.data.frame(rasterToPoints(map9))

fileN10 <- paste0('Data/16-10.tiff')
map10 <- raster(fileN10)
mapPoints10 = as.data.frame(rasterToPoints(map10))

fileN11 <- paste0('Data/16-11.tiff')
map11 <- raster(fileN11)
mapPoints11 = as.data.frame(rasterToPoints(map11))


mapPointsAll=dplyr::full_join(mapPoints1, mapPoints2, c("x", "y"))
mapPointsAll=dplyr::full_join(mapPointsAll, mapPoints3, c("x", "y"))
mapPointsAll=dplyr::full_join(mapPointsAll, mapPoints4, c("x", "y"))
mapPointsAll=dplyr::full_join(mapPointsAll, mapPoints5, c("x", "y"))
mapPointsAll=dplyr::full_join(mapPointsAll, mapPoints6, c("x", "y"))
mapPointsAll=dplyr::full_join(mapPointsAll, mapPoints7, c("x", "y"))
mapPointsAll=dplyr::full_join(mapPointsAll, mapPoints8, c("x", "y"))
mapPointsAll=dplyr::full_join(mapPointsAll, mapPoints9, c("x", "y"))
mapPointsAll=dplyr::full_join(mapPointsAll, mapPoints10, c("x", "y"))
mapPointsAll=dplyr::full_join(mapPointsAll, mapPoints11, c("x", "y"))



colnames(mapPointsAll) <- c('x','y','n1','n2','n3','n4','n5','n6','n7','n8','n9','n10','n11')


mapPointsAll<-anti_join(mapPointsAll, oceanPoints, by = c("x", "y"))

coords<-dplyr::select(mapPointsAll,x,y)
test1<-dplyr::select(mapPointsAll,n1)
test2<-dplyr::select(mapPointsAll,n2)
test3<-dplyr::select(mapPointsAll,n3)
test4<-dplyr::select(mapPointsAll,n4)
test5<-dplyr::select(mapPointsAll,n5)
test6<-dplyr::select(mapPointsAll,n6)
test7<-dplyr::select(mapPointsAll,n7)
test8<-dplyr::select(mapPointsAll,n8)
test9<-dplyr::select(mapPointsAll,n9)
test10<-dplyr::select(mapPointsAll,n10)
test11<-dplyr::select(mapPointsAll,n11)
colnames(test1)[1] <- 'npp'
colnames(test2)[1] <- 'npp'
colnames(test3)[1] <- 'npp'
colnames(test4)[1] <- 'npp'
colnames(test5)[1] <- 'npp'
colnames(test6)[1] <- 'npp'
colnames(test7)[1] <- 'npp'
colnames(test8)[1] <- 'npp'
colnames(test9)[1] <- 'npp'
colnames(test10)[1] <- 'npp'
colnames(test11)[1] <- 'npp'

x <- bind_rows(test1,test2,test3,test4,test5,test6,test7,test8,test9,test10,test11)
# x <- bind_rows(x,test3)

x[x == 255] <- 0 #takes a while

write.csv(coords, file=paste0("regl/coordinates",".csv"), row.names=F)
write.csv(x, file=paste0("regl/16-1-11",".csv"), row.names=F)

#remove ocean from main dataframe
excl <- data.frame(x = c(regionPoints$x, regionPoints$y),
                   y = c(regionPoints$y, regionPoints$x))
c<-anti_join(x, regionPoints, by = c("x", "y"))

