var todoApp = angular.module("todoApp", ['ngResource']);
var model_data = {
    name: 'Adam',
    items:[
      {desc: 'Buy Flowers', done: 'Yes'},
      {desc: 'Get Shoes', done: 'No'},
      {desc: 'Collect Tickets', done: 'Yes'},
      {desc: 'Call Joe', done: 'No'}
    ]
  };
todoApp.controller("TodoCtrlController", function($scope){
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
  };

  $scope.remove_from_list = function(){
      
    
  };
});
