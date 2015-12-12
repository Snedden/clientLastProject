var myApp=angular.module('myApp',[]);

myApp.controller('typeController',['$scope','$http',function ($scope,$http){
  $http.get('http://people.rit.edu/dmgics/754/23/proxy.php?path=%2FOrgTypes').success(function(data){
  	console.log('xmldata', data);
    var jsonData = $.xml2json(data);
  	console.log(jsonData.row);
  	$scope.row=jsonData.row;
  	
  });
}]);

myApp.controller('statesController',['$scope','$http',function ($scope,$http){


        var baseUrl='http://people.rit.edu/dmgics/754/23/proxy.php?path=';
        $scope.states = [];  //initialize state to empty array
        
        
        $http.get('data/states.json').success(function(data){//local file 
        	  angular.extend($scope.states, data); //PUSH HTTP RETURN DATA INTO scope.STATES
        });

        $scope.loadCities=function(state){//load cities as state is change in the select input 

         $http.get(baseUrl+'/Cities?state='+state).success(function(data){
              var jsonData = $.xml2json(data);    ///convert xml to json 
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

          getFormData(); 

          console.log('scope ',$scope);
            });
         
          $scope.$watch('scope', showScope, true);//set watcher on scope for debugging 
          function showScope() {
            console.log('scope ',$scope);
          }
        }

        function getFormData(){
          console.log('inFormData');
         /*
          var req = {
               url: 'http://people.rit.edu/dmgics/754/23/proxy.php',
             method: 'GET',
             data:{path:"/Organizations?type=Fire+Department&name=Adams+Fire+Department&state=NY&town=Adams&county=Jefferson&zip=13605"}
          }

        $http(req).then(function(data){
              var jsonData = $.xml2json(data);    ///convert xml to json 
              console.log('formData ', jsonData);
           });*/

         $http.get("http://people.rit.edu/dmgics/754/23/proxy.php", {params:{"path": "/Organizations?type=Fire+Department&name=Adams+Fire+Department&state=NY&town=Adams&county=Jefferson&zip=13605"}})
        .then(function(data){
              console.log('XML data' , data.data);
              var jsonData = $.xml2json(data.data);    ///convert xml to json 
              console.log('formData ', jsonData);
           })

         

         
        }

}]);

