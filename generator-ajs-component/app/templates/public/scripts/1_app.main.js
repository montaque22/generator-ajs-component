/**
 * Created by montaque22 on 4/12/15.
 */

APP_NAME = '<%= appName %>';

(function(angular) {

    angular.module("services", []);
    angular.module("directives", []);
    angular.module("controllers", []);
    angular.module("filters", []);

    var app = angular.module(APP_NAME, [
        'services',
        'directives',
        'controllers',
        'filters'
    ]);

})(angular);
