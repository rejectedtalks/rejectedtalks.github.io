
/*jslint browser: true, regexp: true */
/*global angular, jQuery, moment */

function sort_by_date(a, b) {
	'use strict';

	var moment_a = moment(a.date_added), moment_b = moment(b.date_added);
	return moment_a.diff(moment_b);
}

function containsString(item, query) {
	'use strict';
	if (query === undefined) {
		return true;
	}

	if (item.title.toLowerCase().indexOf(query) !== -1 || item.description.toLowerCase().indexOf(query) !== -1) {
		return true;
	}

	return false;
}

function containsTags(item, tags) {
	'use strict';

	if (tags === undefined || tags.length === 0 || item.tags === undefined || item.tags.length === 0) {
		return true;
	}

	var i, j, foundMatch, foundAllMatches = true;


	for (i = 0; i < tags.length; i += 1) {
		foundMatch = false;

		if (tags[i].trim() !== '') {
			for (j = 0; j < item.tags.length; j += 1) {
				if (item.tags[j].toLowerCase().trim().indexOf(tags[i].trim()) !== -1) {
					foundMatch = true;
				}
			}
		} else {
			foundMatch = true;
		}

		foundAllMatches = (foundAllMatches && foundMatch);
	}

	return foundAllMatches;
}

var rejectedApp = angular.module('rejectedApp', []);

rejectedApp.controller('RejectedCtrl', ['$scope', '$http', function ($scope, $http) {
	'use strict';
	var i, cols, col_count;

	$scope.loading = true;

	$scope.search = function (item) {
		if ($scope.broadQuery === undefined && $scope.tagQuery === undefined) {
			return true;
		}

		var tags;

		if ($scope.tagQuery !== undefined) {
			tags = $scope.tagQuery.toLowerCase().split(' ');
		}

		if (containsString(item, $scope.broadQuery) && containsTags(item, tags)) {
			return true;
		}

		return false;
	};

	$http.get('data/talks.json').success(function (data) {
		$scope.items = data;
		$scope.loading = false;
	});
}]);

jQuery(document).ready(function () {
	'use strict';
	jQuery('#search-wrapper-wrapper').height(jQuery('#search-wrapper').outerHeight());
	jQuery('#search-wrapper').affix({
		offset: {
			top: jQuery('#search-wrapper').offset().top
		}
	});
});