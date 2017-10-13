load("bioPoints.rds")
x <- readRDS("bioPoints.rds")
sample<-x[1:10000,]

dt <- sample

#My sample data is 1000 rows, with the first column a unique id, followed by 100 columns of data variables
groupVars <- c("x","y")
dataVars <-  colnames(x)[!colnames(x) %in% groupVars]
outfile

frameToJSON <- function(dt,groupVars,dataVars,outfile){
  #packages we will need:
  require(data.table)
  require(RJSONIO)
  
  #Here you may want to sort by colSums() to keep only the most relevant variables.
  
  #calculate the correlation matrix
  t <- cor(dt[,c(!colnames(dt) %in% groupVars),with=F])
  
  #calculate the hierarchical cluster structure from the correlation scores
  hc <- hclust(dist(t), "ward")
  
  #take a look at what your strucutre:
  plot(hc)
  
  #now we split the data based on membership structure. We will take four levels:
  #(basically this means we will calculate which group each variable belongs in for different levels of the tree strucutre)
  memb2 <- as.character(cutree(hc, k = 2))
  memb6 <- as.character(cutree(hc, k = 6))
  memb15 <- as.character(cutree(hc, k = 15))
  memb40 <- as.character(cutree(hc, k = 40))
  
  #Now put this information into a table, together with the labels and the order in which they should appear:
  b=data.table(memb2,memb6,memb15,memb40,label=hc$labels,order=hc$order)
  
  #We might want to know the size of each node. Let's add that
  b$size <- colSums(dt[,c(dataVars),with=F])
  
  #sort the data so it alligns with the structure calculated using hclust()
  setkey(b,order)
  #drop the order variable:
  b[,order:=NULL]
  
  #we define a function which will create a nested list in JSON format:
  #From here: http://stackoverflow.com/questions/12818864/how-to-write-to-json-with-children-from-r
  makeList<-function(x){
    if(ncol(x)>0){
      # listSplit<-split(x,list(x$x, x$y),drop=T)
      listSplit <- split(x, by=c("x", "y"))
      lapply(names(listSplit),function(z){
        print(z)
        list(name=z,vals=makeList(listSplit[[z]]))})
    }else{
      lapply(seq(nrow(x[1])),function(z){list(name=x[,1][z],bio_flux_opt=x[,2][z])})
    }
  }
  
  
  #This will not work on a data.table
  
  b <- data.table(x)
  out <- makeList(b)
  
  #create test data table
  d<-merge(dplyr::filter(b, x ==-179.5, y==89.5),dplyr::filter(b, x ==-178.5, y==89.5),all=T)
  d<-data.table(d)
  out <- makeList(d)
  
  #use to drop split columns - works but not nested correctly
  mysplitDT <- function(x, bycols){ 
    split( x[, !bycols, with=FALSE], x[, bycols, with=FALSE] )
  }
  
  listSplit <- mysplitDT(b, by=c("x", "y"))
  
  
  
  
  # along =lapply(names(listSplit),function(z){
  #   mylist = list()
  #   newList = list()
  #   print(z)
  #   
  #   lapply(listSplit[[z]],function(t){
  #     for (i in 1:nrow(listSplit[[z]])){
  #       print(listSplit[[z]][i])
  #       mylist[[listSplit[[z]][i]$yymm]] = listSplit[[z]][i]$bio_flux_op
  #     }
  #     newList <- c(newList,mylist)
  #     # print(newList)
  #     
  #   })
  #   })
  
  # listLocation =lapply(names(listSplit),function(z){
  #   mylist = list()
  #   newList = list()
  #   print(z)
  #   
  #   # lapply(listSplit[[z]],function(t){
  #     for (i in 1:nrow(listSplit[[z]])){
  #       print(listSplit[[z]][i])
  #       mylist[[listSplit[[z]][i]$yymm]] = listSplit[[z]][i]$bio_flux_op
  #     }
  #     #add lat long
  #     mylist[['loc']] = z
  #     newList <-  c(newList,mylist)
  #     # print(newList)
  #     
  #   # })
  # })
  
  
  listLoc =lapply(names(listSplit),function(z){
    mylist = list()
    print(z)
    for (i in 1:nrow(listSplit[[z]])){
      mylist[[listSplit[[z]][i]$yymm]] = listSplit[[z]][i]$bio_flux_op
    }
    list(loc=z,mylist)
  })
  
  listLoc =lapply(names(listSplit),function(z){
    mylist = list()
    lapply(seq(nrow(listSplit[[z]])),function(i){
    # for (i in 1:nrow(listSplit[[z]])){
      mylist[[listSplit[[z]][i]$yymm]] = listSplit[[z]][i]$bio_flux_op
    })
    list(loc=z,mylist)
  })
  
  
  
  jsonOut<-toJSON(list(name="carbon",children=listLoc),pretty=FALSE)
  jsonOut=gsub("2012", "", jsonOut)
  cat(jsonOut,file='2012.json')
  ################
  
  library(dict)
  #try rearranging list
  lapply(listSplit[[z]],function(i){
    print(paste("i is ",i))
    # for (i in 1:nrow(listSplit[[z]])){print(i)}
  })
  
  mylist = list()
  newList = list()
  
  lapply(listSplit,function(i){  
    print(i)
  })
    for (i in 1:nrow(listSplit[[z]])){
      print(listSplit[[z]][i])
      mylist[[listSplit[[z]][i]$yymm]] = listSplit[[z]][i]$bio_flux_op
    }
    newList <- c(listSplit[[z]],mylist)
  }
  
  split(d, by=c("x", "y"))
  split(d, by=c("x", "y"),flatten=FALSE)
  
  listSplit <- split(b, by=c("x", "y"))
  
  #Have a look at the structure this creates:
  print (head(out))
  
  #Basically we have made a list of lists containing the information from the tree diagram.
  #Finally we put everythin into a list, convert this to json format and save it as data.json
  jsonOut<-toJSON(list(name="Centre",children=makeList(b)))
  
  #We use the cat function here, because in some cases you may want to add separators, or a prefix and suffix to make the formatting just right
  cat(jsonOut,file=outfile)
}

frameToJSON(dt,groupVars,dataVars,outfile="data.json")
