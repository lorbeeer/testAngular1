
  angular.module('myApp', ['ngGeolocation', 'dbrans.validate'])
  .controller('MyController', ['$scope','$filter', '$http', '$window', '$timeout', '$geolocation',  function ($scope, $filter, $http, $window, $timeout, $geolocation) {
        
        $scope.isUniqueName = function(x) { 
            var found = $filter('filter')($scope.items,{name: x}, true);
            if (found && found.length > 0) {
                return false;
            } else {
                return true;
            }
        };
        $scope.isUniqueUsername = function(x) { 
            var found = $filter('filter')($scope.items,{username: x}, true);
            if (found && found.length > 0) {
                return false;
            } else {
                return true;
            }
        };
         $scope.isUniqueCompany = function(x) { 
             var arr=[];
             angular.forEach($scope.items, function(x){
                 arr.push(x.company);
                 console.log('arr - '+JSON.stringify(arr));
                 return arr;
             })
            var found = $filter('filter')(arr,{name: x}, true);
            console.log(found);
            if (found && found.length > 0) {
                console.log(JSON.stringify(found[0]));
                return false;
            } else {
                console.log('Not found');
                return true;
            }
        };
        /*
        $scope.isUniqueUsername = function(x) { 
            var ARR = [];
                    angular.forEach($scope.items, function(x){
                        ARR.push(x.username);
                        return ARR;
                    });
                    
                    if (ARR.indexOf(x) > -1) {
                    return false
                    }else{
                     return true;
                    }
        };
        $scope.isUniqueCompanyame = function(x) { 
            var ARR = [];
            var arrNames = [];
                    angular.forEach($scope.items, function(y){
                        ARR.push(y.company);
                        return ARR;
                    });
                    console.log(ARR);
                    angular.forEach(ARR, function(z){
                        arrNames.push(z.name);
                        return arrNames;
                    });
                    console.log(arrNames);

                    if (arrNames.indexOf(x) > -1) {
                    return false
                    }else{
                     return true;
                    }
        };
        */
        
 
        


                
        $http.get("https://jsonplaceholder.typicode.com/users")
            .then(function(response) {
                $scope.items = response.data; 
            })
            .then($scope.assignId)
            .then(function() {
                $geolocation.getCurrentPosition()
            .then(function(location) {
                $scope.location = location
            })
            .then($scope.getDistance)
            .then(function(){
                    window.alert("Done!");
                
            });    
            });
            


        $scope.getDistance = function() {
            angular.forEach($scope.items, function(x){
                x.distance = distance($scope.location.coords.longitude, $scope.location.coords.latitude, x.address.geo.lng, x.address.geo.lat);
            });
            return $scope.items;

            function distance(lon1, lat1, lon2, lat2) {
                var R = 6371; // Radius of the earth in km
                var dLat = toRad(lat2-lat1);  // Javascript functions in radians
                var dLon = toRad(lon2-lon1); 
                var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
                        Math.sin(dLon/2) * Math.sin(dLon/2); 
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                var d = R * c; // Distance in km
                return d;
            }
            function toRad (x) {
                return x * Math.PI / 180;
            }
        };


        $scope.testAng = function(name){
            console.log(name);
        }

        $scope.assignId = function(){
            angular.forEach($scope.items, function(x){
                x.id = $index;
            }) 
            return $scope.items;
        }


        $scope.newItem = {};
        $scope.sortBy = 'name';
        $scope.changeSort = function(x){
            if(x == $scope.sortBy)
                $scope.sortBy = "-" + x;
            else
                $scope.sortBy = x;
        };

        $scope.addItem = function () { 
            if($scope.myForm.$valid){
                var add = {
                    "id": $scope.items.length + 1,
                    "distance": "",
                    "name": $scope.newItem.name,
                    "username": $scope.newItem.username,
                    "email": $scope.newItem.email,
                    "address": {
                        "street": $scope.newItem.street,
                        "suite": $scope.newItem.suite,
                        "city": $scope.newItem.city,
                        "zipcode": $scope.newItem.zipcode,
                        "geo": {
                            "lat": $scope.newItem.lat,
                            "lng": $scope.newItem.lng
                                }
                    },
                    "phone": $scope.newItem.phone,
                    "website": $scope.newItem.website,
                    "company": {
                        "name": $scope.newItem.companyName,
                        "catchPhrase": $scope.newItem.catchPhrase,
                        "bs": $scope.newItem.bs 
                    }
                }
                $scope.items.push(add);
                return $scope.items;
            }else {return;}
        };

        $scope.removeItem = function (i) {
            var arr=[];
            var del;
            angular.forEach($scope.items,function(x){
                arr.push(x.id);
                return arr;
            })
            del = arr.indexOf(i);
            $scope.items.splice([del], 1);
            return $scope.items;
        };
        
        
        $scope.copyEmail = function(text) {
            var textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Copying text command was ' + msg);
            } catch (err) {
                console.log('Oops, unable to copy');
            }
            document.body.removeChild(textArea);
        }

        
      }])
       .directive('validatePhone', function() {
            var REGEX = /((^1\-)|^|^\()\d{3}(\-|\)|\.)\d{3}(\-|\.)\d{4}($|\sx\d{3,5}$)/;
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, ctrl) {
                    ctrl.$validators.phone = function (modelValue, viewValue) {
                        if (REGEX.test(viewValue)) {
                        return true
                        }
                        return false;
                        };
                    }
                };
        })
        .directive('validateSite', function() {
                var REGEX = /^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})$/;
                return {
                    require: 'ngModel',
                    link: function (scope, element, attrs, ctrl) {

                    ctrl.$validators.site = function (modelValue, viewValue) {

                        if (REGEX.test(viewValue)) {
                        return true
                        }
                        return false;
                        };
                    }
                };
        })
 
        /*
        .directive('validateUnique', function() {
        
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                items:'@'
            },
            link: function (scope, element, attrs, ngModel) {
        
            ngModel.$validators.username = function (modelValue, viewValue) {
                    var ARR = [];
                    angular.forEach(items, function(x){
                        ARR.push(x.username);
                        return ARR;
                    });
                    
                    if (ARR.indexOf(viewValue) > -1) {
                    return false
                    }else{
                     return true;
                    }
                    
            
            };
            }
        };
        
  });*/
     
    angular.element(document).ready(function() {
      angular.bootstrap(document, ['myApp']);
    });
