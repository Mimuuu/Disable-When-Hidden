(function() {
	'use strict';

	var app = angular.module('app');

	/**
	* First directive, placed on the parent element
	* Broadcast an event to every relevant child elements every time the user scroll to update the $$watchers situation
	*/
	app.directive('disableWhenHidden', function() {
		return {
			restrict: 'A',

			link: function(scope) {

				function debounce(fn, delay) {
					var timer = null;
		            return function () {
		                var context = this, args = arguments;
		                clearTimeout(timer);
		                timer = setTimeout(function () {
		                    fn.apply(context, args);
		                }, delay);
		            };
				}


				var checkElements = debounce(function() {
					scope.$broadcast('dwhCheckElements');
				}, 250);

				document.addEventListener('scroll', checkElements);
			}
		};
	});


	/**
	* 
	*/
	app.directive('dwhElement', function() {
		return {
			restrict: 'A',

			link: function(scope, element) {
				
	            var m = 1000; // Range of "errors" outside the viewport
	            var wArray = []; // Array to store all the watchers
	            var isHidden = false; // Used to prevent useless computation

	            /**
	             * Store every watchers related to the element
	             * Remove them from the element
	             */
	            var disableWatchers = function () {
	                wArray.length = 0;
	                leaveHimToDie(element);
	                isHidden = true;
	            };

	            /**
	             * Put back every watchers from the storage array
	             */
	            var enableWatchers = function () {
	                bringHimBack(element);
	                isHidden = false;
	            };

	            /**
	            * Listener to know when to enable/disable watchers
	            */
	            scope.$on('dwhCheckElements', function () {
	                var coordinates = element[0].getBoundingClientRect();
	                if (coordinates.bottom > 0 - m && coordinates.top < window.innerHeight + m) {
	                    if (isHidden) {
	                        enableWatchers();
	                    }
	                } else if (!isHidden) {
	                    disableWatchers();
	                }
	            });


	            /*--- Watchers's dance ---*/

	            /**
	             * Goes through every child elements and store the watchers if they exist
	             * Then empty every array to disable them
	             * @param elem
	             */
	            var leaveHimToDie = function (elem) {
	                var i = 0;

	                function getElemWatchers(element) {
	                    wArray[i] = [];
	                    wArray[i][0] = getWatchersFromScope(element.data().$isolateScope);
	                    wArray[i][1] = getWatchersFromScope(element.data().$scope);

	                    angular.forEach(element.children(), function (childElement) {
	                        i++;
	                        getElemWatchers(angular.element(childElement));
	                    });
	                }

	                function getWatchersFromScope(scope) {
	                    if (scope) {
	                        var tmp = scope.$$watchers || [];
	                        scope.$$watchers = [];
	                        return tmp;
	                    } else {
	                        return [];
	                    }
	                }

	                getElemWatchers(elem);
	            };

	            /**
	             * Go through every child elements and restore the watchers from the array we stored with "leaveHimToDie"
	             * @param elem
	             */
	            var bringHimBack = function (elem) {
	                var i = 0;

	                function setElemWatchers(element) {
	                    setWatchersFromScope(element.data().$isolateScope, 0);
	                    setWatchersFromScope(element.data().$scope, 1);

	                    angular.forEach(element.children(), function (childElement) {
	                        i++;
	                        setElemWatchers(angular.element(childElement));
	                    });
	                }

	                function setWatchersFromScope(scope, n) {
	                    if (scope) {
	                        scope.$$watchers = wArray[i][n];
	                    }
	                }

	                // Start the loop
	                setElemWatchers(elem);
	            };
			}
		};
	});

})();