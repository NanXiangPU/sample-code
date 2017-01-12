/**
 * @author Nan Xiang <nan@sensorhound.com>
 */
var Chance = require('chance');
var g = new Chance();
var history = [];
var maxPoints = 500;
var maxDetailPoints = 1000;
var fakeData = [];

/**
 * function that init the data array
 * @returns {undifined}
 */
function init() {
	var startDate = new Date(Date.UTC(2010, 0, 1)).getTime() / 1000;
	var now = new Date(); 
	var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
	var endDate = now_utc.getTime() / 1000;

	var range = Math.floor((endDate - startDate) / (60 * 60));

	var date = new Date(0);
	date.setUTCSeconds(startDate);
	var startPoint = {
		time: date.getTime(),
		value: 500
	};
	history.push(startPoint);

	for(var i = 1; i <= range; ++i) {
		var tmp = new Date(0);
		tmp.setUTCSeconds(startDate + i * 60 * 60);
		var signal = Math.random() > 0.5 ? 1 : -1;
		var obj = {
			time: tmp.getTime(),
			value: history[i - 1].value + Math.random(50) * signal > 1000 ? 1000 : history[i - 1].value + Math.random(10) * signal
		};
		history.push(obj);
	}
};

/**
 * function that find the corresponding index of a particular point
 * @returns {index}
 */
function binarySearch(target, history) {
	if(target <= history[0].time) {
		return 0;
	}else if(target >= history[history.length - 1].time) {
		return history.length - 1;
	}
	var left = 0, right = history.length;
	while(left < right - 1) {
		var mid = Math.floor(left + (right - left) / 2);
		if(target == history[mid].time) {
			return mid;
		}else if(target < history[mid].time) {
			right = mid - 1;
		}else {
			left = mid + 1;
		}
	}
	if(target == history[left].time) {
		return left;
	}else{
		return right;
	}
};
/**
 * function that taking sample set out of a large range
 * @returns {newArray}
 */
function sample(left, right, array) {
	var newArray = [];
	if(left > right) {
		return newArray;
	}

	var scale = Math.ceil((right - left) / maxPoints);
	for(var i = 0; left + i * scale < right; i++) {
		var aggregatedObj = {
			time: array[left + i * scale].time,
			value: array[left + i * scale].value
		}
		newArray.push(aggregatedObj);
	} 
	return newArray;
};

/**
 * function that taking detailed sample set out of a large range
 * @returns {newArray}
 */
function detailSample(left, right, array) {
	var newArray = [];
	if(left > right) {
		return newArray;
	}

	var scale = Math.ceil((right - left) / maxDetailPoints);
	for(var i = 0; left + i * scale < right; i++) {
		var aggregatedObj = {
			time: array[left + i * scale].time,
			value: array[left + i * scale].value
		}
		newArray.push(aggregatedObj);
	} 
	return newArray;
};

/**
 * function that apply random walk algorithm to the fake data
 * @returns {undifined}
 */
function randomWalk(array, start, step) {
	var newArray = [];
	var startPoint = {
		time: array[0].time,
		value: start
	};
	newArray.push(startPoint);
	for(var i = 1; i < array.length; ++i) {
		var signal = Math.random() > 0.5 ? 1 : -1;
		var obj = {
			time: array[i].time,
			value: newArray[i - 1].value + signal * Math.random(step) > 1000 ? 1000 : newArray[i - 1].value + signal * Math.random(step)
		}
		newArray.push(obj)
	}
	return newArray;
}

/**
 * function that build up the fake data
 * @returns {undifined}
 */
function prepareData() {
	for(var i = 0; i < 32; ++i) {
		if(i == 0) {
			fakeData.push(randomWalk(history, 500, 100));	
		}else if(i == 1) {
			fakeData.push(randomWalk(history, 200, 200));
		}else if(i == 2) {
			fakeData.push(randomWalk(history, 800, 50));
		}else{
			fakeData.push(randomWalk(history, 200 + Math.random(500), 20 + Math.random(50)));	
		}
	}
}

init();
prepareData();

module.exports = {
	path: "/node/:id/status",
	type: "get",
	cache: false,
	template: 
		function(params, query, body) {
			var id = parseInt(JSON.stringify(params).slice(1,-1).split(":")[1].slice(1,-1));
			var start = query.from;
			var end = query.to;                                                                               
			var detail = query.detail;

			var startIndex = binarySearch(start, fakeData[id - 1]);
			var endIndex = binarySearch(end, fakeData[id - 1]);

			if(startIndex == history.length - 1 || endIndex == 0) {return null;}
			else if(endIndex - startIndex > maxPoints && detail == "false") {
				return sample(startIndex, endIndex, fakeData[id - 1]);
			}else if(endIndex - startIndex > maxPoints && detail == "true") {
				return detailSample(startIndex, endIndex, fakeData[id - 1]);
			}else {
				return fakdeData[id - 1].slice(startIndex, endIndex + 1);
			}
		}
}