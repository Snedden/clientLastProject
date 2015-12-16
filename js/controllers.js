var pagesControllers=angular.module('pagesControllers',[]);

pagesControllers.controller('mainController',['$scope','$http',function ($scope,$http){
        
        $scope.isLoading=false;    ///is Loadingwatcher
        var baseUrl='http://people.rit.edu/dmgics/754/23/proxy.php?';

        $scope.states = [];  //initialize state to empty array
        $scope.obj={location,
                    site:'',
                    person:''};//create this to reference location,site,person as ng-model creates child scope if inside ng-if

        //Get org types           
        $http.get(baseUrl, {params:{"path":'/OrgTypes'}}).then(function(data){
            console.log('xmldata', data.data);
            var jsonData = $.xml2json(data.data);  ///XMLtoJson dependency
            console.log(jsonData.row);
            $scope.row=jsonData.row;
        }).finally(function () {
            $scope.isLoading = false;
        });;

        ///DynaTable dependency
        var dynatable=$('#my-final-table'); //init table

        //iterating over each tr and adding click event for modal for pagechange in table 
        $('#my-final-table').bind("DOMSubtreeModified",function(){
          console.log('table changed');
          $('#responseTable').css("display","block");
           $('#my-final-table').find('tbody').children().each(function(){
                var TDs=$(this).children() //this is row-tr
                var orgId=TDs[3].innerHTML;  
                 $(this).attr("data-target","#myModal");  //adding bootstrap modal options to target the modal
                 $(this).attr("data-toggle","modal");
                 $(this).attr("data-id",orgId);
            })
        });

      //this function is triggered every time before modal dialog is opened
      $('#myModal').on('show.bs.modal', function(e) {
        
          var r; //waiter for setTimeOUt
          console.log('data',$(e.relatedTarget).data('id'))
          
          var id=$(e.relatedTarget).data('id')
         
          //tabs functionality 
          //GEt the tabs data and make tabs for modal
          $http.get(baseUrl, {params:{"path": "/Application/Tabs?orgId="+id}}).then(function(data){
                  $().pleaseWait(true);       //Custom jquery plug in to disable body while loading takes place 
                 console.log('xmldata', data.data);
                 var jsonData = $.xml2json(data.data);
                 console.log('tabs',jsonData);
                 $scope.tabs=jsonData;//save to model
                 console.log('scope tabs',$scope.tabs)
                  r =setTimeout(initTabs,200); //give some time to modal to save data to avoid race condition
                  
                 //Built tabs 
                 function initTabs(){
                    if ($( "#tabs2" ).data("ui-tabs")) {
                        $( "#tabs2" ).tabs( "destroy" ); //destroy previouly created tabs as tabs are dynamic
                    }
                    $( "#tabs2" ).tabs();               // create/recreate tabs
                    console.log('timer');
                    r=clearTimeout();
                 }

                 //Get individual tab information
                 $scope.getInfo(id,'General');
                 $scope.getInfo(id,'Locations');
                 $scope.getInfo(id,'People');
                 $scope.getInfo(id,'Treatments');
                 $scope.getInfo(id,'Training');
                 $scope.getInfo(id,'Physicians');
                 $scope.getInfo(id,'Facilities');
          }).finally(function () {
                 $().pleaseWait(false); //Custom jquery plug in to disable body while loading takes place
                 //google map api call,  need authentication token here as can't make simple REST call for dynamic html
                 $http.get("https://maps.googleapis.com/maps/api/js", {params:{"key": "AIzaSyC-CxXX9NObUa0JBqZVM-q5SVYx6S-Uee4"}}).then(function(data){
                                 var map; 
                    // function initMap() {
                                      console.log('DivLocation',document.getElementById('locationMap'));  
                                      map = new google.maps.Map(document.getElementById('locationMap'), {
                                                                center: {lat: -34.397, lng:150.644},
                                                                zoom: 8
                                                                });
                                      //  }


                 });
          });
        });  

        //Get STATES
        $http.get('data/states.json').success(function(data) {          //local file 

            $().pleaseWait(true);   //custom plugin to disable screen while loading
            angular.extend($scope.states, data); //PUSH HTTP RETURN DATA INTO scope.STATES
        }).finally(function () {
            $().pleaseWait(false);  //custom plugin to disable screen while loading
        }); 
        
        ///Function to get info of tab parameters
        $scope.getInfo=function(orgId,infoOn){
         $().pleaseWait(true);
         //Http call
        $http.get(baseUrl, {params:{"path": "/"+orgId+"/"+infoOn}}).then(function(data){ 
            var jsonData = $.xml2json(data.data);
            console.log( infoOn,' ',jsonData);
            switch (infoOn){
              case 'Facilities':
                $scope.facilities=jsonData;
                console.log(infoOn,'Scope ',$scope.facilities);
              break;
              case 'General':
                $scope.general=jsonData;
                console.log(infoOn,'Scope ',$scope.general);
              break;
              case 'Training':
                $scope.trainings=jsonData;
                console.log(infoOn,'Scope ',$scope.trainings);
              break;
              case 'Treatments':
                $scope.treatments=jsonData;
                console.log(infoOn,'Scope ',$scope.treatments);
              break;
              case 'Physicians':
                $scope.physicians=jsonData;
                console.log(infoOn,'Scope ',$scope.physicians)
              break;
              case 'People':
                $scope.people=jsonData;
                console.log(infoOn,'Scope ',$scope.people)
              break;
              case 'Locations':
                $scope.locations=jsonData;
                console.log(infoOn,'Scope ',$scope.locations);
              break;  
              default:
              console.error("Wrong parameter send to getInfo():",infoOn)
            }
          }).finally(function () {
             $().pleaseWait(false);
          });
      }

      ////load cities as state is change in the select input 
      $scope.loadCities=function(){
            //Http call
           $http.get(baseUrl, {params:{"path": '/Cities?state='+$scope.state.abbreviation}}).then(function(data){
                $().pleaseWait(true);   //custom plugin to disable screen while loading
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
                }).finally(function () {
                       $().pleaseWait(false);    //custom plugin to disable screen while loading
                });

       
        }

        //set watcher on scope for debugging 
        $scope.$watch('scope', showScope, true);
          function showScope() {
            console.log('scope ',$scope);
          }

      

        $scope.getFormData=function(){
            console.log('inFormData');
             $().pleaseWait(true);      //custom plugin to disable screen while loading
             var city='';
             var name='';
             var county='';
             var zip='';
             var type='';
             var state='';
             //Catch model properties in variables before passing to URL string as some are child objects which can be null 
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

             //Cors call
             $http.get(baseUrl, {params:{"path": "/Organizations?type="+type+"&name="+name+"&state="+state+"&town="+city+"&county="+county+"&zip="+zip}})
                 .then(function(data){
                   console.log('Pending request' , $http.pendingRequests.length);
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
                 }).finally(function () {
                       $().pleaseWait(false);   //custom plugin to disable screen while loading
                 });
        }//ENd of getFormData
}]);//end of controller