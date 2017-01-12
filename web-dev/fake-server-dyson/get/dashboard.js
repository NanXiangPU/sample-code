/**
 * @author Nan Xiang <nan@sensorhound.com>
 */
var fs = require("file-system");

/**
 * function that get the current active node and create data for navigation tree
 * @returns {treeNode}
 */
function getActiveNode() {
	var nodeStatus = fs.readFileSync("fake-server/get/active-node").toString();
	nodeStatus = nodeStatus.slice(1,-1).split(",");
	var treeNode = [];
	var map = {};
	for(var i = 1; i <= 32; ++i) {
		var channel = "CH" + i;
		var info = JSON.parse(fs.readFileSync("fake-server/get/channels/" + channel).toString());
		map[channel] = info.name.toUpperCase();
	}
	for(var i = 1 ; i <= 32; ++i) {
		var channel = "CH" + i;
		var children = fs.readdirSync("fake-server/get/storage/" + channel);
		for(var j = 0; j < children.length; j++) {
			children[j] = {
				"title": map[channel] + ":" + children[j]
			}
		}
		if(nodeStatus[i - 1] == "true") {
			var node = {
				"title": channel,
				"folder": "true",
				"key": "id" + i,
				"expanded": "true",
				"children": children
			}
			treeNode.push(node);
		} 
	}
	return treeNode;
}

module.exports = {
	path: "/dashboard",
	tyep: "GET",
	cache: false,
	template: getActiveNode
}