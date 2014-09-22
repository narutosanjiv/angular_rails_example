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
<a ng-href="{{myUrl}}">{{myLinkText}}</a>\
</div>'
  }
});

todoApp.directive('siteheader', function () {
    return {
        restrict: 'EACM',
        template: '<button class="btn">{{back}}</button><button class="btn">{{forward}}</button>',
        scope: {
            back: '@back',
            forward: '@forward',
            icons: '@icons'
        },
        link: function(scope, element, attrs) {
            $(element[0]).on('click', function() {
                history.back();
                scope.$apply();
            });
            $(element[1]).on('click', function() {
                history.forward();
                scope.$apply();
            });
        }
    };
});

todoApp.directive('double', function() {
    return {
        restrict: 'E',
        compile: function(tElement, attrs) {
            var content = tElement.children();
            tElement.append(content.clone());
            tElement.replaceWith(tElement.children());
        }
    }
});
todoApp.directive('ntimes', function() {
    return {
        restrict: 'E',
        compile: function(tElement, attrs) {
            var content = tElement.children();
            for (var i = 0; i < attrs.repeat - 1; i++) {
                tElement.append(content.clone());
            }
            tElement.replaceWith(tElement.children());
        }
    }
});

todoApp.directive('alertable', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      console.log(element);
      element.find('button').bind('click', function(e){
        alert('you clicked');
        return false;
      })
      console.log('inside link function');
    },
    template: "<div class='alert alert-warning alert-dismissible' ng-transclude></div>"
  };
});

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
todoApp.filter('offset', function() {
  return function(input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
});

todoApp.controller("PaginationsCtrl", ['$scope', '$location', 'Restaurant', function($scope, $location, Restaurant){
  $scope.errorhandler = function(){
    alert('Pls contact server')
  };
  
  $scope.itemsPerPage = 5;
  $scope.currentPage = 0;
  
  $scope.is_new = false;
  $scope.is_list = true;
  $scope.is_list = false;
  
  $scope.restaurant = new Restaurant($scope.errorhandler)
  $scope.restuarents = $scope.restaurant.all();
  
  $scope.successhandler = function(list){
    console.log('list')
    console.log(list);
    $scope.restuarents.unshift(list);
  }


  $scope.addrestuarant = function(){
    var attrs = {"name" : $scope.restaurant.name, "desc" : $scope.restaurant.desc};
    $scope.restaurant.create(attrs, $scope.successhandler);
  } 
  
  $scope.deleterest = function(i){

  }

  $scope.$on('$routeChangeStart', function(next, current) { 
    console.log('routes changes');
    console.log(next);
    console.log(current);
  })

  $scope.range = function() {
    var rangeSize = 5;
    var ret = [];
    var start;
    start = $scope.currentPage;
    if ( start > $scope.pageCount()-rangeSize ) {
      start = $scope.pageCount()-rangeSize+1;
    }
    for (var i=start; i<start+rangeSize; i++) {
      ret.push(i);
    }
    return ret;
  };
 
  $scope.prevPage = function() {
    if ($scope.currentPage > 0) {
      $scope.currentPage--;
    }
  };
  $scope.prevPageDisabled = function() {
    return $scope.currentPage === 0 ? "disabled" : "";
  };
  $scope.pageCount = function() {
    return Math.ceil($scope.restuarents.length/$scope.itemsPerPage)-1;
  };
  $scope.nextPage = function() {
    if ($scope.currentPage < $scope.pageCount()) {
      $scope.currentPage++;
    }
  };
  $scope.nextPageDisabled = function() {
    return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
  };
  $scope.setPage = function(n) {
    $scope.currentPage = n;
  };

}]);



todoApp.controller("FormController", ['$scope', '$location',  function($scope, $location){
}]);

todoApp.controller("UsersCtrl", ['$scope', '$location',  function($scope, $location){
}]);
