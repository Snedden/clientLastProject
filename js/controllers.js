var myApp=angular.module('myApp',[]);


myApp.controller('statesController',['$scope','$http',function ($scope,$http){

        

        var baseUrl='http://people.rit.edu/dmgics/754/23/proxy.php?';
        $scope.states = [];  //initialize state to empty array


        $http.get(baseUrl, {params:{"path":'/OrgTypes'}}).then(function(data){
             console.log('xmldata', data.data);
            var jsonData = $.xml2json(data.data);
            console.log(jsonData.row);
            $scope.row=jsonData.row;
    
        });
        
        var dynatable=$('#my-final-table'); //init table
        
        $http.get('data/states.json').success(function(data){//local file 
        	  angular.extend($scope.states, data); //PUSH HTTP RETURN DATA INTO scope.STATES
        });

        $scope.loadCities=function(){//load cities as state is change in the select input 


          
         $http.get(baseUrl, {params:{"path": '/Cities?state='+$scope.state.abbreviation}}).then(function(data){
              var jsonData = $.xml2json(data.data);    ///convert xml to json 
              console.log('cities lenght', jsonData);
              

               $scope.cities = [];           //initialize cities to empty array

                if(jsonData.row){
                    if(jsonData.row.length)//is array
                    {
                      $scope.cities=jsonData.row;  //define cities which are fetched 
                      
                    }
                    else{//not array
                      $scope.cities.push(jsonData.row); // element with only one result are not array tso cast them to array
                    }
                }

          $scope.getFormData(); 

          console.log('scope ',$scope);
            });
         
          $scope.$watch('scope', showScope, true);//set watcher on scope for debugging 
          function showScope() {
            console.log('scope ',$scope);
          }
        }

        //city change maybe redundent 
        $scope.cityChanged=function(city)
        {
          console.log('city',city);
          $scope.apply;
          $scope.getFormData();
          
        }

        $scope.getFormData=function(){
        console.log('inFormData');
       
         var city='';
         var name='';
         var county='';
         var zip='';
         var type='';
         var state='';

         if($scope.city){ //check if city exist in the scope
          console.log($scope.city.city);
          city=$scope.city.city;
         }
         if($scope.orgName){
          console.log($scope.orgName);
          name=$scope.orgName;
         }
         if($scope.orgCounty){
          console.log($scope.orgName);
          county=$scope.orgCounty;
         }
          if($scope.orgZip){
          console.log($scope.orgZip);
          zip=$scope.orgZip;
         }

         if($scope.type){
            type=$scope.type.type;
         }
         if($scope.state){
              state=$scope.state.abbreviation;
         }

         $http.get(baseUrl, {params:{"path": "/Organizations?type="+type+"&name="+name+"&state="+state+"&town="+city+"&county="+county+"&zip="+zip}})
             .then(function(data){
               // console.log('XML data' , data.data);
                var jsonData = $.xml2json(data.data);    ///convert xml to json 
               // console.log('formData ', jsonData);
                var dataArray=[];
                 if(jsonData.row){
                    if(!jsonData.row.length){ //not an array but single object
                      dataArray.push(jsonData) //cast into array

                    }
                    else{
                      dataArray=jsonData.row;
                    }
                 } 
                 //console.log('dataArray ',dataArray);
                 var dynatable=$('#my-final-table').dynatable({  //making table
                  dataset: {
                    records: dataArray
                  }
                }).data('dynatable');
                dynatable.settings.dataset.originalRecords = dataArray;  //need to do this to update dom
                dynatable.process();
               // console.log('dyna ',dynatable);
                            

              
           
              

             });

         

         
        }//ENd of getFormData

        //triggered before modal dialog is opened
          $('#myModal').on('show.bs.modal', function(e) {
              console.log('data',$(e.relatedTarget).data('id'))
              //get data-id attribute of the clicked element
              //var bookId = $(e.relatedTarget).data('book-id');
              var id=$(e.relatedTarget).data('id')
               getTabs(id); 
              //populate the textbox
              //$(e.currentTarget).find('input[name="bookId"]').val(bookId);
          });  

            //iterating over each tr and adding click event for modal
            $('#my-final-table').bind("DOMSubtreeModified",function(){
               $('#my-final-table').find('tbody').children().each(function(){
                    var TDs=$(this).children() //this is row-tr
                    var orgId=TDs[3].innerHTML;  
                     $(this).attr("data-target","#myModal");
                     $(this).attr("data-toggle","modal");
                     $(this).attr("data-id",orgId);
                     
                })
            });


             function getTabs(id){  //append tabs to the dialog modal

            
                $('#tabs').empty(); //empty previously append tabs
            

              
              $http.get(baseUrl, {params:{"path": "/Application/Tabs?orgId="+id}}).then(function(data){  //what makes this function call immediately
                             
                              console.log('tabData',data);
                              var tabsDiv=document.createElement('div');
                              tabsDiv.setAttribute('id','tabs-1');
                              document.getElementById('tabs').appendChild(tabsDiv);
                              var tabsUl=document.createElement('ul');
                              tabsDiv.appendChild(tabsUl);
                        //travesing through XML
                            var j=2;
                            var dataXml=data.data;
                            $(dataXml).find('row').each(function(i){
                                      var tabLi=document.createElement('li');
                                      tabsUl.appendChild(tabLi);
                                      var anchor=document.createElement('a');
                                      var href='#tabs-'+j;
                                    
                                      anchor.setAttribute('href',href);
                                      tabLi.appendChild(anchor);
                                      var txt=$(this).find('Tab').text();
                                      var tabText=document.createTextNode(txt);
                                      anchor.appendChild(tabText);
                                      
                                      var tabInDiv=document.createElement('div');
                                      var tabDivId='tabs-'+j;
                                      tabInDiv.setAttribute('id',tabDivId);
                                      var tabDivText=$(this).find('Tab').text();
                                      var tabDivTextNode=document.createTextNode(tabDivText);
                                      tabInDiv.appendChild(tabDivTextNode);
                                      tabsDiv.appendChild(tabInDiv)

                                      if(tabDivText==='Locations'){
                                        $scope.populateLocation(tabDivId,id);
                                      }
                                       
                                      
                                      j++;
                              });
                             //tabs functionality 
                               $( "#tabs-1" ).tabs();
                        
                     
              });
                
            
            }

            $scope.populateLocation=function(locationId,orgId){
              id='#'+locationId;
              console.log(id , ' ',$(id));
               $http.get(baseUrl, {params:{"path": "/"+orgId+"/Locations"}}).then(function(data){ 
                var jsonData = $.xml2json(data.data);
                console.log(jsonData);
                $scope.locations=jsonData;

                var locationTemplate='<div>'+
                                        '<div style="width:50%,background-color:gray;display:inline-block'>+
                                          '<p>Address:</p>'+
                                          '<p>City:</p>'+
                                          '<p>State:</p>'+
                                          '<p>Zip:</p>'+
                                          '<p>Phone:</p>'+
                                          '<p>Lat:</p>'+
                                          '<p>Lon:</p>'+ 
                                          '<p>Country:</p>'+                                    
                                        '</div>'+
                                        '<div style="width:50%,display:inline-block,background-color:black">'+
                                        '</div>'+
                                      '</div>' ;
                $(id).append(data.data);

               });
            }
              
}]);

