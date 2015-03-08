(function() {
	'use strict';

	var app = angular.module('app', []);

	app.controller('listCtrl', function() {

		var arr = [];

		for (var i=0; i<1000; i++) {
			arr[i] = {
				title: 'Element ' + i.toString()
			}
		}

		this.array = arr;

		this.countWatchers = function() {
		    var root = angular.element(document.getElementsByTagName('body'));

		    var watchers = [];

		    var f = function (element) {
		        angular.forEach(['$scope', '$isolateScope'], function (scopeProperty) { 
		            if (element.data() && element.data().hasOwnProperty(scopeProperty)) {
		                angular.forEach(element.data()[scopeProperty].$$watchers, function (watcher) {
		                    watchers.push(watcher);
		                });
		            }
		        });

		        angular.forEach(element.children(), function (childElement) {
		            f(angular.element(childElement));
		        });
		    };

		    f(root);

		    // Remove duplicate watchers
		    var watchersWithoutDuplicates = [];
		    angular.forEach(watchers, function(item) {
		        if(watchersWithoutDuplicates.indexOf(item) < 0) {
		             watchersWithoutDuplicates.push(item);
		        }
		    });

		    console.log(watchersWithoutDuplicates.length);
		}
	});
})();