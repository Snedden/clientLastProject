var pagesControllers=angular.module('pagesControllers',[]);


pagesControllers.controller('mainController',['$scope','$http',function ($scope,$http){

        
     
        var baseUrl='http://people.rit.edu/dmgics/754/23/proxy.php?';
        $scope.states = [];  //initialize state to empty array

       $scope.obj={location,
                    person:''};//create this to catch location from selectLocation as ng-model creates child scope in ng-if


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
              var r; //waiter for setTimeOUt
              console.log('data',$(e.relatedTarget).data('id'))
              //get data-id attribute of the clicked element
              //var bookId = $(e.relatedTarget).data('book-id');
              var id=$(e.relatedTarget).data('id')
              //getTabs(id); 
              //tabs functionality 
              //GEt the tabs data and make tabs for modal
              $http.get(baseUrl, {params:{"path": "/Application/Tabs?orgId="+id}}).then(function(data){
                     console.log('xmldata', data.data);
                     var jsonData = $.xml2json(data.data);
                     console.log('tabs',jsonData);

                     $scope.tabs=jsonData;//save to model
                     console.log('scope tabs',$scope.tabs)
                      r =setTimeout(initTabs,50); //give some time to modal to save data  

                     function initTabs(){
                        if ($( "#tabs2" ).data("ui-tabs")) {
                            $( "#tabs2" ).tabs( "destroy" );
                        }
                        $( "#tabs2" ).tabs();
                        console.log('timer');
                        r=clearTimeout();
                     }
                     $scope.getLocationInfo(id);
                     $scope.getPeopleInfo(id);
              });
            });    

          


          $scope.getLocationInfo=function(orgId){
              
              $http.get(baseUrl, {params:{"path": "/"+orgId+"/Locations"}}).then(function(data){ 
                var jsonData = $.xml2json(data.data);
                console.log('location: ',jsonData);
                $scope.locations=jsonData;
                if(jsonData.count==='1'){
                    $scope.locationType=jsonData.location.type;
                    $scope.address1=jsonData.location.address1;
                    $scope.address2=jsonData.location.address2;
                    $scope.locationCity=jsonData.location.city;
                    $scope.locationState=jsonData.location.state;
                    $scope.locationZip=jsonData.location.zip;
                    $scope.phone=jsonData.location.phone;
                    $scope.lat=jsonData.location.latitude;
                    $scope.lon=jsonData.location.longitude;
                }
                

                });
            }

             $scope.getPeopleInfo=function(orgId){
              
              $http.get(baseUrl, {params:{"path": "/"+orgId+"/People"}}).then(function(data){ 
                var jsonData = $.xml2json(data.data);
                console.log('location: ',jsonData);
                $scope.people=jsonData;
                console.log('peopleScope ',$scope.people);
                

                });
            }


           //when user change locatino in select 
          $scope.changeLocation=function(){
              console.log('change location called');
               /* $scope.address1=location.address1;
                $scope.locationType=location.type;
                $scope.address1=location.address1;
                $scope.address2=location.address2;
                $scope.locationCity=location.city;
                $scope.locationState=location.state;
                $scope.locationZip=location.zip;
                $scope.phone=location.phone;
                $scope.lat=location.latitude;
                $scope.lon=location.longitude;*/
          }

          //Whenuser changes site in peopletab
           $scope.changePeople=function(){
               // $scope.peopleSiteAddress=site.address;
           }

            //iterating over each tr and adding click event for modal for pagechange in table 
            $('#my-final-table').bind("DOMSubtreeModified",function(){
               $('#my-final-table').find('tbody').children().each(function(){
                    var TDs=$(this).children() //this is row-tr
                    var orgId=TDs[3].innerHTML;  
                     $(this).attr("data-target","#myModal");
                     $(this).attr("data-toggle","modal");
                     $(this).attr("data-id",orgId);
                     
                })
            });

            

            
              
}]);

