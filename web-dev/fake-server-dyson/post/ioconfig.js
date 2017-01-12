/**
 * @author Nan Xiang <nan@sensorhound.com>
 */
var fs = require('file-system');

/**
 * function that generate response to different request
 * @returns {undefined}
 */
var generateResponse = function(params, query, body) {
	var data = JSON.stringify(body);
	var id = JSON.stringify(params).slice(1,-1).split(":")[1].replace(/"/g,"");
	var fileName = "CH" + id;
	
	if(data.includes("channel")) {
		var file = fs.readFileSync("fake-server/get/channels/" + fileName).toString();
		file = JSON.parse(file);
		var new_channel_value = JSON.stringify(body).slice(1,-1).split(":")[1].replace(/"/g,"");
		file.channel = new_channel_value;
		fs.writeFile("fake-server/get/channels/" + fileName, JSON.stringify(file), function(err) {
			if(err) {
				return console.log(err);
			}
		});

		var storage_dir = fs.readdirSync("fake-server/get/storage/" + fileName).toString();
		var storage_files = storage_dir.split(",");
		for(var i = 0; i < storage_files.length; ++i) {
			var storage_info = JSON.parse(fs.readFileSync("fake-server/get/storage/" + fileName + "/" + storage_files[i]).toString());
			storage_info.channel = new_channel_value;
			fs.writeFile("fake-server/get/storage/" + fileName + "/" + storage_files[i], JSON.stringify(storage_info), function(err) {
				if(err) {
					return console.log(err);
				}
			});
		}
	}else if(data.includes("name")) {
		var file = fs.readFileSync("fake-server/get/channels/" + fileName).toString();
		file = JSON.parse(file);
		var new_name_value = JSON.stringify(body).slice(1,-1).split(":")[1].replace(/"/g,"");
		file.name = new_name_value;
		fs.writeFile("fake-server/get/channels/" + fileName, JSON.stringify(file), function(err) {
			if(err) {
				return console.log(err);
			}
		});

		var storage_dir = fs.readdirSync("fake-server/get/storage/" + fileName).toString();
		var storage_files = storage_dir.split(",");
		for(var i = 0; i < storage_files.length; ++i) {
			var storage_info = JSON.parse(fs.readFileSync("fake-server/get/storage/" + fileName + "/" + storage_files[i]).toString());
			storage_info.name = new_name_value;
			fs.writeFile("fake-server/get/storage/" + fileName + "/" + storage_files[i], JSON.stringify(storage_info), function(err) {
				if(err) {
					return console.log(err);
				}
			});
		}
	}else if(data.includes("conversion")) {
		var file = fs.readFileSync("fake-server/get/channels/" + fileName).toString();
		file = JSON.parse(file);
		var new_conversion_value = JSON.stringify(body).slice(1,-1).split(":")[1].replace(/"/g,"");
		file.conversion = new_conversion_value;
		fs.writeFile("fake-server/get/channels/" + fileName, JSON.stringify(file), function(err) {
			if(err) {
				return console.log(err);
			}
		});

		var storage_dir = fs.readdirSync("fake-server/get/storage/" + fileName).toString();
		var storage_files = storage_dir.split(",");
		for(var i = 0; i < storage_files.length; ++i) {
			var storage_info = JSON.parse(fs.readFileSync("fake-server/get/storage/" + fileName + "/" + storage_files[i]).toString());
			storage_info.conversion = new_conversion_value;
			fs.writeFile("fake-server/get/storage/" + fileName + "/" + storage_files[i], JSON.stringify(storage_info), function(err) {
				if(err) {
					return console.log(err);
				}
			});
		}
	}else if(data.includes("m-info")) {
		var file = fs.readFileSync("fake-server/get/channels/" + fileName).toString();
		file = JSON.parse(file);
		var new_m_value = JSON.stringify(body).slice(1,-1).split(":")[1].replace(/"/g,"");
		file.m_info = new_m_value;
		fs.writeFile("fake-server/get/channels/" + fileName, JSON.stringify(file), function(err) {
			if(err) {
				return console.log(err);
			}
		});

		var storage_dir = fs.readdirSync("fake-server/get/storage/" + fileName).toString();
		var storage_files = storage_dir.split(",");
		for(var i = 0; i < storage_files.length; ++i) {
			var storage_info = JSON.parse(fs.readFileSync("fake-server/get/storage/" + fileName + "/" + storage_files[i]).toString());
			storage_info.m_info = new_m_value;
			fs.writeFile("fake-server/get/storage/" + fileName + "/" + storage_files[i], JSON.stringify(storage_info), function(err) {
				if(err) {
					return console.log(err);
				}
			});
		}
	}else if(data.includes("b-info")) {
		var file = fs.readFileSync("fake-server/get/channels/" + fileName).toString();
		file = JSON.parse(file);
		var new_b_value = JSON.stringify(body).slice(1,-1).split(":")[1].replace(/"/g,"");
		file.b_info = new_b_value;
		fs.writeFile("fake-server/get/channels/" + fileName, JSON.stringify(file), function(err) {
			if(err) {
				return console.log(err);
			}
		});

		var storage_dir = fs.readdirSync("fake-server/get/storage/" + fileName).toString();
		var storage_files = storage_dir.split(",");
		for(var i = 0; i < storage_files.length; ++i) {
			var storage_info = JSON.parse(fs.readFileSync("fake-server/get/storage/" + fileName + "/" + storage_files[i]).toString());
			storage_info.b_info = new_b_value;
			fs.writeFile("fake-server/get/storage/" + fileName + "/" + storage_files[i], JSON.stringify(storage_info), function(err) {
				if(err) {
					return console.log(err);
				}
			});
		}
	}else if(data.includes("voltage-divide")) {
		var file = fs.readFileSync("fake-server/get/channels/" + fileName).toString();
		file = JSON.parse(file);
		var new_voltage_divide_value = JSON.stringify(body).slice(1,-1).split(":")[1].replace(/"/g,"");
		file.voltage_divide = new_voltage_divide_value;
		fs.writeFile("fake-server/get/channels/" + fileName, JSON.stringify(file), function(err) {
			if(err) {
				return console.log(err);
			}
		});

		var storage_dir = fs.readdirSync("fake-server/get/storage/" + fileName).toString();
		var storage_files = storage_dir.split(",");
		for(var i = 0; i < storage_files.length; ++i) {
			var storage_info = JSON.parse(fs.readFileSync("fake-server/get/storage/" + fileName + "/" + storage_files[i]).toString());
			storage_info.voltage_divide = new_voltage_divide_value;
			fs.writeFile("fake-server/get/storage/" + fileName + "/" + storage_files[i], JSON.stringify(storage_info), function(err) {
				if(err) {
					return console.log(err);
				}
			});
		}
	}else if(data.includes("sample-range")) {
		var file = fs.readFileSync("fake-server/get/channels/" + fileName).toString();
		file = JSON.parse(file);
		var new_sample_range_value = JSON.stringify(body).slice(1,-1).split(":")[1].replace(/"/g,"");
		file.sample_range = new_sample_range_value;
		fs.writeFile("fake-server/get/channels/" + fileName, JSON.stringify(file), function(err) {
			if(err) {
				return console.log(err);
			}
		});

		var storage_dir = fs.readdirSync("fake-server/get/storage/" + fileName).toString();
		var storage_files = storage_dir.split(",");
		for(var i = 0; i < storage_files.length; ++i) {
			var storage_info = JSON.parse(fs.readFileSync("fake-server/get/storage/" + fileName + "/" + storage_files[i]).toString());
			storage_info.sample_range = new_sample_range_value;
			fs.writeFile("fake-server/get/storage/" + fileName + "/" + storage_files[i], JSON.stringify(storage_info), function(err) {
				if(err) {
					return console.log(err);
				}
			});
		}
	}else if(data.includes("sample-period")) {
		var file = fs.readFileSync("fake-server/get/channels/" + fileName).toString();
		file = JSON.parse(file);
		var new_sample_period_value = JSON.stringify(body).slice(1,-1).split(":")[1].replace(/"/g,"");
		file.sample_period = new_sample_period_value;
		fs.writeFile("fake-server/get/channels/" + fileName, JSON.stringify(file), function(err) {
			if(err) {
				return console.log(err);
			}
		});

		var storage_dir = fs.readdirSync("fake-server/get/storage/" + fileName).toString();
		var storage_files = storage_dir.split(",");
		for(var i = 0; i < storage_files.length; ++i) {
			var storage_info = JSON.parse(fs.readFileSync("fake-server/get/storage/" + fileName + "/" + storage_files[i]).toString());
			storage_info.sample_period = new_sample_period_value;
			fs.writeFile("fake-server/get/storage/" + fileName + "/" + storage_files[i], JSON.stringify(storage_info), function(err) {
				if(err) {
					return console.log(err);
				}
			});
		}
	}else if(data.includes("store-row")) {
		var file = fs.readFileSync("fake-server/get/channels/" + fileName).toString();
		file = JSON.parse(file);
		var new_store_row_value = JSON.stringify(body).slice(1,-1).split(":")[1].replace(/"/g,"");
		file.store_row = new_store_row_value;
		fs.writeFile("fake-server/get/channels/" + fileName, JSON.stringify(file), function(err) {
			if(err) {
				return console.log(err);
			}
		});

		var storage_dir = fs.readdirSync("fake-server/get/storage/" + fileName).toString();
		var storage_files = storage_dir.split(",");
		for(var i = 0; i < storage_files.length; ++i) {
			var storage_info = JSON.parse(fs.readFileSync("fake-server/get/storage/" + fileName + "/" + storage_files[i]).toString());
			storage_info.store_row = new_store_row_value;
			fs.writeFile("fake-server/get/storage/" + fileName + "/" + storage_files[i], JSON.stringify(storage_info), function(err) {
				if(err) {
					return console.log(err);
				}
			});
		}
	}else if(data.includes("store-converted")) {
		var file = fs.readFileSync("fake-server/get/channels/" + fileName).toString();
		file = JSON.parse(file);
		var new_store_converted_value = JSON.stringify(body).slice(1,-1).split(":")[1].replace(/"/g,"");
		file.store_converted = new_store_converted_value;
		fs.writeFile("fake-server/get/channels/" + fileName, JSON.stringify(file), function(err) {
			if(err) {
				return console.log(err);
			}
		});

		var storage_dir = fs.readdirSync("fake-server/get/storage/" + fileName).toString();
		var storage_files = storage_dir.split(",");
		for(var i = 0; i < storage_files.length; ++i) {
			var storage_info = JSON.parse(fs.readFileSync("fake-server/get/storage/" + fileName + "/" + storage_files[i]).toString());
			storage_info.store_converted = new_store_converted_value;
			fs.writeFile("fake-server/get/storage/" + fileName + "/" + storage_files[i], JSON.stringify(storage_info), function(err) {
				if(err) {
					return console.log(err);
				}
			});
		}
	}else if(data.includes("default-graph")) {
		var file = fs.readFileSync("fake-server/get/channels/" + fileName).toString();
		file = JSON.parse(file);
		var new_default_graph_value = JSON.stringify(body).slice(1,-1).split(":")[1].replace(/"/g,"");
		file.default_graph = new_default_graph_value;
		fs.writeFile("fake-server/get/channels/" + fileName, JSON.stringify(file), function(err) {
			if(err) {
				return console.log(err);
			}
		});
	}else if(data.includes("title")) {
		var file = fs.readFileSync("fake-server/get/channels/" + fileName).toString();
		file = JSON.parse(file);
		var new_title_value = JSON.stringify(body).slice(1,-1).split(":")[1].replace(/"/g,"");
		file.title = new_title_value;
		fs.writeFile("fake-server/get/channels/" + fileName, JSON.stringify(file), function(err) {
			if(err) {
				return console.log(err);
			}
		});
	}else if(data.includes("units")) {
		var file = fs.readFileSync("fake-server/get/channels/" + fileName).toString();
		file = JSON.parse(file);
		var new_units_value = JSON.stringify(body).slice(1,-1).split(":")[1].replace(/"/g,"");
		file.units = new_units_value;
		fs.writeFile("fake-server/get/channels/" + fileName, JSON.stringify(file), function(err) {
			if(err) {
				return console.log(err);
			}
		});
	}else if(data.includes("range-lowerbound")) {
		var file = fs.readFileSync("fake-server/get/channels/" + fileName).toString();
		file = JSON.parse(file);
		var new_range_lowerbound_value = JSON.stringify(body).slice(1,-1).split(":")[1].replace(/"/g,"");
		file.range_lowerbound = new_range_lowerbound_value;
		fs.writeFile("fake-server/get/channels/" + fileName, JSON.stringify(file), function(err) {
			if(err) {
				return console.log(err);
			}
		});
	}else if(data.includes("range-upperbound")) {
		console.log(data);
		var file = fs.readFileSync("fake-server/get/channels/" + fileName).toString();
		file = JSON.parse(file);
		var new_range_upperbound_value = JSON.stringify(body).slice(1,-1).split(":")[1].replace(/"/g,"");
		file.range_upperbound = new_range_upperbound_value;
		fs.writeFile("fake-server/get/channels/" + fileName, JSON.stringify(file), function(err) {
			if(err) {
				return console.log(err);
			}
		});
	}else if(data.includes("alert")) {
		var file = fs.readFileSync("fake-server/get/channels/" + fileName).toString();
		file = JSON.parse(file);
		var new_alert_value = JSON.stringify(body).slice(1,-1).split(":")[1].replace(/"/g,"");
		file.alert = new_alert_value;
		fs.writeFile("fake-server/get/channels/" + fileName, JSON.stringify(file), function(err) {
			if(err) {
				return console.log(err);
			}
		});
	}
};

module.exports = {
    path: '/ioconfig/:id',
    type: 'POST',
    cache: false,
    template: generateResponse
};