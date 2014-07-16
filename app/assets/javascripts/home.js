var todoApp = angular.module("todoApp", ['ngRoute', 'ngResource']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeController'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginController'
    })
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardController',
      resolve: {
        user: function(SessionService) {
          return SessionService.getCurrentUser();
        }
      }
    })
    .otherwise({
      redirectTo: '/'
    }); 
  }]);
var model_data = {
    name: 'Adam',
    items:[
      {desc: 'Buy Flowers', done: 'Yes'},
      {desc: 'Get Shoes', done: 'No'},
      {desc: 'Collect Tickets', done: 'Yes'},
      {desc: 'Call Joe', done: 'No'}
    ]
  };

todoApp.directive('myDirective', function() {
  return {
    restrict: 'EACM',
    replace: false,
    scope: {
      myUrl: '@',
      // binding strategy
      myLinkText: '@', // binding strategy
      myText: '@someText'
    },
    template: '<div>\
<label>My Url Field:</label>\
<input type="text"\
ng-model="myUrl" />\
<a href="{{myUrl}}">{{myLinkText}}</a>\
</div>'
  }
})
todoApp.controller("TodoCtrlController", ['$scope', '$location',  function($scope, $location){
  $scope.todo = model_data;
  $scope.incompleteCount = function(){
    var count = 0;
    angular.forEach($scope.todo.items, function (item) {
      if (item.done == 'No') { count++ }
    });  
    return count;
  }; 

  $scope.add_to_list = function(){
    $scope.todo.items.push({desc: 'Check', done: 'Yes'})    
    $location.path('/login');      
  };

  $scope.remove_from_list = function(){
    $location.path('/home');      
    
  };
}]);
