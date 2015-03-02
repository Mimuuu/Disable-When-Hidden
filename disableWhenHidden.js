/**
 * Created by Brice on 01/10/2014.
 */


/**
 * Listen to the scroll event and broadcast an event to disable / enable the watchers of the "dwhElements"
 */
webassadorsApp.directive('disableWhenHidden', ['$timeout', '$compile', 'CommonTools', function ($timeout, $compile, CommonTools) {
    'use strict';
    return {
        restrict: 'A',
        link: function (scope) {
            var checkElements = CommonTools.debounce(function () {
                scope.$broadcast('dwhCheckElements');
            }, 250);
            // Hide / Show posts every time the user scrolls
            document.addEventListener('scroll', checkElements);
        }
    };
}]);

/**
 * When out of sight, we empty the watchers, when back up we bring them back !
 */
webassadorsApp.directive('dwhElement', function () {
    'use strict';
    return {
        restrict: 'A',
        link: function (scope, element) {
            var el = element[0];
            var m = 1000; // Range of "errors" outside the viewport
            var wArray; // Array to store all the watchers
            var isHidden = false; // Used to prevent useless computation

            /**
             * Store all the watchers and empty it so we never go crazy
             */
            var disableWatchers = function () {
                // Hide element
                wArray = [];
                leaveHimToDie(el);
                isHidden = true;
            };

            /**
             * Bring the watchers back
             */
            var enableWatchers = function () {
                bringHimBack(el);
                isHidden = false;
            };

            // Listen to scroll events
            scope.$on('dwhCheckElements', function () {
                var coordinates = el.getBoundingClientRect();
                if (coordinates.bottom > 0 - m && coordinates.top < window.innerHeight + m) {
                    if (isHidden) {
                        enableWatchers();
                    }
                } else if (!isHidden) {
                    disableWatchers();
                }
            });

            /**
             * Goes through every child elements and store the watchers if they exist
             * Then empty every array to remove them
             * @param elem
             */
            var leaveHimToDie = function (elem) {
                elem = angular.element(elem);
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
                elem = angular.element(elem);
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