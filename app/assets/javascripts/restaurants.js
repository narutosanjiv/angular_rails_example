angular.module('Services', ['ngResource']).factory('Restaurant', function($resource, $http) {
  var Restaurant;
  Restaurant = (function() {
    function Restaurant(errorHandler) {
      var defaults;
      this.service = $resource('/restaurants/:id', {
        id: '@id'
      }, {
        update: {
          method: 'PATCH'
        }
      });
      this.errorHandler = errorHandler;
      defaults = $http.defaults.headers;
      defaults.patch = defaults.patch || {};
      defaults.patch['Content-Type'] = 'application/json';
    }

    Restaurant.prototype.create = function(attrs, successHandler) {
      return new this.service({
        restaurant: attrs
      }).$save((function(list) {
        return successHandler(list);
      }), this.errorHandler);
    };

    Restaurant.prototype["delete"] = function(list) {
      return new this.service().$delete({
        id: list.id
      }, (function() {
        return null;
      }), this.errorHandler);
    };

    Restaurant.prototype.update = function(list, attrs) {
      return new this.service({
        list: attrs
      }).$update({
        id: list.id
      }, (function() {
        return null;
      }), this.errorHandler);
    };

    Restaurant.prototype.all = function() {
      return this.service.query((function() {
        return null;
      }), this.errorHandler);
    };

    Restaurant.prototype.find = function(id, successHandler) {
      return this.service.get({
        id: id
      }, (function(list) {
        if (typeof successHandler === "function") {
          successHandler(list);
        }
        return list;
      }), this.errorHandler);
    };

    return Restaurant;

  })();
  return Restaurant;
});
