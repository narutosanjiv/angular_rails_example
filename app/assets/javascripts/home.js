var todoApp = angular.module("todoApp", ['ui.bootstrap', 'ngRoute', 'ngResource', 'Services']).
  config(['$httpProvider', '$routeProvider', function($httpProvider, $routeProvider1) {
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    $routeProvider1
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeController'
    })
    .when('/form', {
      templateUrl: '/form',
      controller: 'FormController'
    })
    .when('/restaurants/new',{
      templateUrl: 'restaurants/new.html',
      controller: 'PaginationsCtrl'
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
    .when('/pagination',  {templateUrl:'home/pagination.html', controller: 'PaginationsCtrl'})
    .when('/users/sign_in', {templateUrl:'/users/login.html', controller: 'UsersCtrl'})
    .when('/users/register', {templateUrl:'/users/register.html', controller: 'UsersCtrl'})
    .otherwise({
      redirectTo: '/'
    }); 
  }])
  .factory("session", function($location, $http, $q){
    function redirect(url) {
      url = url || '/';
      $location.path(url);
    }
    
    var service = {
        login: function(email, password) {
            return $http.post('/users/sign_in', {user: {email: email, password: password} })
                .then(function(response) {
                    service.currentUser = response.data.user;
                    if (service.isAuthenticated()) {
                        //TODO: Send them back to where they came from
                        //$location.path(response.data.redirect);
                    }
                });
        },

        logout: function(redirectTo) {
            $http.post('/logout').then(function() {
                service.currentUser = null;
                redirect(redirectTo);
            });
        },

        register: function(email, password, confirm_password) {
            return $http.post('/users.json', {user: {email: email, password: password, password_confirmation: confirm_password} })
            .then(function(response) {
                service.currentUser = response.data;
                if (service.isAuthenticated()) {
                }
            });
        },
        requestCurrentUser: function() {
            if (service.isAuthenticated()) {
                return $q.when(service.currentUser);
            } else {
                return $http.get('/current_user').then(function(response) {
                    service.currentUser = response.data.user;
                    return service.currentUser;
                });
            }
        },

        currentUser: null,

        isAuthenticated: function(){
            return !!service.currentUser;
        }
    };

    return service;
     
  });
  

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
todoApp.controller("TodoCtrlController", ['$scope', '$location', 'session',  function($scope, $location, session){
  $scope.todo = model_data;
  session.login('sanjiv', 'sanjiv');
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

todoApp.controller("PaginationsCtrl", ['$scope', '$location', 'Restaurant', function($scope, $location, Restaurant){
  $scope.errorhandler = function(){
    alert('Pls contact server')
  };
  $scope.is_new = false;
  $scope.is_list = true;
  $scope.is_list = false;
  $scope.restaurant = new Restaurant($scope.errorhandler)
  $scope.items = [{name: 'sanjiv'}, {name: 'rajiv'}];
  $scope.restuarents = $scope.restaurant.all();
  
  $scope.successhandler = function(list){
    $scope.restuarents.push(list);
  }

  $scope.addrestuarant = function(){
    console.log($scope);
    var attrs = {"name" : $scope.restaurant.name, "desc" : $scope.restaurant.desc};
    console.log(attrs);
    $scope.restaurant.create(attrs, $scope.successhandler);
  } 
  
  $scope.deleterest = function(i){

  }

  $scope.$on('$routeChangeStart', function(next, current) { 
    console.log('routes changes');
  })
}]);

todoApp.controller("FormController", ['$scope', '$location',  function($scope, $location){
}]);

todoApp.controller("UsersCtrl", ['$scope', '$location',  function($scope, $location){
}]);
