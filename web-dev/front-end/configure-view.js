/**
 * @author Nan Xiang <nan@sensorhound.com>
 */
'use strict';
var maxNavX = 350;

/** 
 * framework of configuration view with draggable border
 * @returns {ConfigurationView}
 */
function  ConfigurationView() {
    this.init = function () {
        document.getElementById("configure-drag").onmousedown = function (e) {
            e.preventDefault();
            window.onmousemove = function (e) {
                if (e.pageX < maxNavX) {
                    document.getElementById("configure-nav").style.width = e.pageX + 2 + "px";
                    document.getElementById("configure-main").style.marginLeft = e.pageX + 2 + "px";
                }
            };
        };

        window.onmouseup = function (e) {
            window.onmousemove = null;
        };
    }
}

/**
 * constructor for configure navigation
 * @returns {undefined}
 */
function configureTree() {

    var self = this;

    this.treeData = [];
    this.li_to_delete = 0;
    this.ioServiceUrl = "http://localhost:3000";
    this.storageServiceUrl = "http://localhost:3000";
    this.tabServiceUrl = "http://localhost:3000";
    this.logServiceUrl = "http://localhost:3000";
    this.tabInfoUrl = "http://localhost:3000";
    this.logInfoUrl = "http://localhost:3000";
    this.ioConfigurationUrl = "http://localhost:3000";
    this.channelInfoUrl = "http://localhost:3000";
    this.activeNodeUrl = "http://localhost:3000";
    this.dashboardServiceUrl = "http://localhost:3000";
    this.tabsCount = 0;
    this.finish = 0;
    this.option = {};
    this.conversion = {};
    this.voltageDivide = {};
    this.sampleRange = {};
    this.defaultGraph = {};
    this.selected = "";
    this.selected_io_node = "";
    this.selected_storage_node = "";
    this.nodeStatus = [];

    /**
     * function to get tabs information
     * @returns {undefined}
     */
    this.getTabInfo = function(selected) {
        $.ajax({
          url: self.tabInfoUrl + "/tabinfo",
          type: "GET",
          success: function(d) {
            var channelInfo = d.channels.slice(1,-1).split(",");
            var conversionInfo = d.conversion.slice(1,-1).split(",");
            var voltageDivideInfo = d.voltageDivide.slice(1,-1).split(",");
            var sampleRangeInfo = d.sampleRange.slice(1,-1).split(",");
            var defaultGraphInfo = d.defaultGraph.slice(1,-1).split(",");
            for(var i = 0; i < channelInfo.length; ++i) {
              $("#channel").append("<option>" + channelInfo[i] + "</option>");
            }
            for(var i = 0; i < conversionInfo.length; ++i) {
              $("#conversion").append("<option>" + conversionInfo[i] + "</option>");
            }
            for(var i = 0; i < voltageDivideInfo.length; ++i) {
              $("#voltage-divide").append("<option>" + voltageDivideInfo[i] + "</option>");
            }
            for(var i = 0; i < sampleRangeInfo.length; ++i) {
              $("#sample-range").append("<option>" + sampleRangeInfo[i] + "</option>");
            }
            for(var i = 0; i < defaultGraphInfo.length; ++i) {
              $("#default-graph").append("<option>" + defaultGraphInfo[i] + "</option>");
            }

            $("#channel option").click(function() {
                self.option = this;
                self.postChannelInfo();
            });

            $("#name").blur(function() {
                self.postNameInfo();
            });

            $("#conversion option").click(function() {
                self.conversion = this;
                if(this.text == "Javascript") {
                    if($(".javascript-textbox")[0].childElementCount == 0) {
                        var form = d3.select(".javascript-textbox")
                            .append("form")
                            .attr("id","javascript-conversion-textbox");
                        var form_div = form.append("div")
                                            .attr("class","form-group");
                        form_div.append("label")
                            .text("Type your code here:");
                                //<textarea class="form-control" rows="5" id="comment"></textarea>
                        form_div.append("textarea")
                            .attr("class","form-control")
                            .attr("id","conversion-textbox")
                            .text("function conversion_" + self.selected.split("-")[0] + "(input) {\n\treturn ;\n}");
                        var save_button = d3.select(".javascript-textbox")
                                            .append("button")
                                            .attr("type","button")
                                            .attr("class","btn btn-success")
                                            .attr("id","btn-save")
                                            .text("save");
                        var reset_button = d3.select(".javascript-textbox")
                                            .append("button")
                                            .attr("type","button")
                                            .attr("class","btn btn-danger")
                                            .attr("id","btn-reset")
                                            .text("reset");
                        
                        $("#btn-save").click(function() {
                            self.postJavascriptConversion($("#conversion-textbox")[0].value);
                        });
                        
                        $("#btn-reset").click(function() {
                            $("#conversion-textbox").val("function conversion(input) {\n\treturn ;\n}");
                        });
                    }
                }else {
                    $(".javascript-textbox").empty();
                }
                self.postConversionInfo();
            });

            $("#m-info").blur(function() {
                self.postMinfo();
            });

            $("#b-info").blur(function() {
                self.postBinfo();
            });

            $("#voltage-divide option").click(function() {
                self.voltageDivide = this;
                self.postVoltageDivideInfo();
            });

            $("#sample-range option").click(function() {
                self.sampleRange = this;
                self.postSampleRangeInfo();
            });

            $("#sample-period").blur(function() {
                self.postSamplePeriodInfo();
            });

            $("#store-row").click(function() {
                self.postStoreRowInfo();
            });

            $("#store-converted").click(function() {
                self.postStoreConvertedInfo();
            });

            $("#default-graph option").click(function() {
                self.defaultGraph = this;
                self.postDefaultGraphInfo();
            });

            $("#title").blur(function() {
                self.postTitleInfo();
            });

            $("#units").blur(function() {
                self.postUnitsInfo();
            });

            $("#range-lowerbound").blur(function() {
                self.postRangeLowerboundInfo();
            });

            $("#range-upperbound").blur(function() {
                self.postRangeUpperboundInfo();
            });

            $("#tabs").tabs();
          },
          error: function() {
            console.log("404: No information for tab found");
          }
        }); 
    }
  
    /**
     * function to create tabs for main configuration
     * @returns {undefined}
    */
    this.createTabs = function(title) {
        var title = title.replace(" ","-").replace(":","-");
        self.selected = title.toUpperCase();
        var config = d3.select('#configure-main');
        config.append('div')
            .attr('id','tabs')
            .style('overflow','auto')
            .style('height','100%');
        var ul = d3.select('#tabs')
            .append('ul');
        
        var names = [ ['1','Data'], ['2','Driver'], ['3','Storage'], ['4','Dashboard'] ];

        var li = ul.selectAll('li')
            .data(names)
            .enter()
            .append('li');

        li.append('a')
          .attr('href',function (d) {return '#tabs-'+ d[0]})
          .text(function (d) {return d[1]});

        d3.select('#tabs')
            .selectAll('div')
            .data(names)
            .enter()
            .append('div')
            .attr('id', function (d) {return 'tabs-'+ d[0]});

        var top_t1 = d3.select('#tabs-1')
            .append('div')
            .attr('class','top');

        var left_t1 = d3.select('#tabs-1')
            .append('div')
            .attr('class','left');
        left_t1.append('div')
            .append('p')
            .text('channel:');
        left_t1.append('div')
            .append('p')
            .text('name:');
        left_t1.append('div')
            .append('p')
            .text('conversion:');

        var right_t1 = d3.select('#tabs-1')
            .append('div')
            .attr('class','right');
        right_t1.append('div')
            .append('select')
            .attr('class','sel')
            .attr('id', 'channel');
        right_t1.append('div')
            .append('input')
            .attr('class','input-l')
            .attr('id', 'name');
        right_t1.append('div')
            .append('select')
            .attr('class', 'sel')
            .attr('id', 'conversion');
        var m_t1 = right_t1.append('div')
            .style('display', 'inline');
        m_t1.append('span')
            .text('m=');
        m_t1.append('input')
            .attr('class','input-s')
            .attr('id', 'm-info');
        var b_t1 = right_t1.append('div')
            .style('display', 'inline');
        b_t1.append('span')
            .text('b=');
        b_t1.append('input')
            .attr('class','input-s')
            .attr('id', 'b-info');

        var javascript_textbox = d3.select("#tabs-1")
            .append('div')
            .attr('class','javascript-textbox');

        var top_t2 = d3.select('#tabs-2')
            .append('div')
            .attr('class','top');

        var left_t2 = d3.select('#tabs-2')
            .append('div')
            .attr('class','left');
        left_t2.append('div')
            .append('p')
            .text('voltage divide:');
        left_t2.append('div')
            .append('p')
            .text('sample range:');

        var right_t2 = d3.select('#tabs-2')
            .append('div')
            .attr('class','right');
        right_t2.append('div').append('select')
            .attr('class','sel')
            .attr('id', 'voltage-divide');
        right_t2.append('div').append('select')
            .attr('class','sel')
            .attr('id','sample-range')
            .style('margin-top','1.5em');

        var top_t3 = d3.select('#tabs-3')
            .append('div')
            .attr('class','top');

        var left_t3 = d3.select('#tabs-3')
            .append('div')
            .attr('class','left');
        left_t3.append('div')
            .append('p')
            .text('sample period:');
        left_t3.append('div')
            .append('p')
            .text('store row:');
        left_t3.append('div')
            .append('p')
            .text('store converted:');

        var right_t3 = d3.select('#tabs-3')
            .append('div')
            .attr('class','right');
        right_t3.append('div')
            .append('input')
            .attr('id','sample-period')
            .attr('class','input-s');
        right_t3.append('div')
            .append('input')
            .attr('id','store-row')
            .attr('type','checkbox');
        right_t3.append('div')
            .append('input')
            .attr('id','store-converted')
            .attr('type','checkbox');

        var top_t4 = d3.select('#tabs-4')
            .append('div')
            .attr('class','top');

        var left_t4 = d3.select('#tabs-4')
            .append('div')
            .attr('class','left');
        left_t4.append('div')
            .append('p')
            .text('default graph:');
        left_t4.append('div')
            .append('p').text('title:');
        left_t4.append('div')
            .append('p')
            .text('units:');
        left_t4.append('div')
            .append('p')
            .text('range:');
        left_t4.append('div')
            .append('p')
            .text('alert:');

        var right_t4 = d3.select('#tabs-4')
            .append('div')
            .attr('class','right');
        right_t4.append('div')
            .append('select')
            .attr('class','sel')
            .attr('id', 'default-graph');
        right_t4.append('div')
            .append('input')
            .attr('id','title')
            .attr('class','input-l');
        right_t4.append('div')
            .append('input')
            .attr('id','units')
            .attr('class','input-l');
        var range = right_t4.append('div');
        range.append('input')
            .attr('class','input-s')
            .attr('id','range-lowerbound')
            .style('display','inline');
        range.append('p')
            .style('text-align','center')
            .style('display','inline-block')
            .style('width','5em').text('to');
        range.append('input')
            .attr('class','input-s')
            .attr('id','range-upperbound')
            .style('display','inline');
        var alert = right_t4.append('div')
            .style('height','60%');
        alert.append('ul')
            .attr('id','list');
        alert.append('button')
            .text('+')
            .attr('id','add');

        self.getTabInfo();

        var list = document.getElementById('list');
        var add = document.getElementById('add');
        var alertCount = 0;

        //adding a new element to the list
        add.addEventListener('click', function () {
          var newElement = document.createElement('li');
          list.appendChild(newElement);
          newElement.innerHTML = 
          "<select id='alert-count-" + alertCount + "'><option>&lt</option><option>&gt</option><option>&lt=</option><option>&gt=</option></select>  <input></input>  <button class='btn'>-</button>";
          alertCount++;
        });

        list.addEventListener('click', function (e) {
          if (e.target && e.target.nodeName == "BUTTON") {
            e.target.parentNode.remove();
          }
        });
    };

    /**
     * function to get default configuration
     * @returns {undefined}
    */
    this.loadDefaultConfig = function() {
        var channel = self.selected.split("-")[0];
        $.ajax({
            url: self.channelInfoUrl + "/channels",
            type: "GET",
            data: {
                "channel": channel
            },
            success: function(data) {
                $("#channel").val(data.channel);
                $("#name").val(data.name);
                $("#conversion").val(data.conversion);
                $("#m-info").val(data.m_info);
                $("#b-info").val(data.b_info);
                $("#voltage-divide").val(data.voltage_divide);
                $("#sample-range").val(data.sample_range);
                $("#sample-period").val(data.sample_period);
                if(data.store_row == "true") {
                    $("#store-row").attr("checked",data.store_row);    
                }
                if(data.store_converted == "true") {
                    $("#store-converted").attr("checked",data.store_converted);    
                }
                $("#default-graph").val(data.default_graph);
                $("#title").val(data.title);
                $("#units").val(data.units);
                $("#range-lowerbound").val(data.range_lowerbound);
                $("#range-upperbound").val(data.range_upperbound);
            },
            error: function() {
                console.log("Not found");
            }
        })
    };

    /**
     * function to update javascript conversion information
     * @returns {undefined}
    */
    this.postJavascriptConversion = function(code) {
        code = code.replace(/\n/g,'');
        code = code.replace(/\t/g,'');
        $.ajax({
            url: self.ioConfigurationUrl + "/js-conversion",
            type: "POST",
            data: {
                "code": code
            },
            success: function() {
                console.log("Change javascript conversion succeed!");
                load_conversion_js();
            }
        })
    }

    /**
     * function to update channel information
     * @returns {undefined}
    */
    this.postChannelInfo = function() {
        var channel = self.selected.split("-")[0];
        var id = channel.replace("CH","");
        $.ajax({
            url: self.ioConfigurationUrl + "/ioconfig/" + id,
            type: "POST",
            data: {
                "channel": self.option.value
            },
            success: function() {
                console.log("Change channel succeed!");
            }
        });
    };

    /**
     * function to update channel information
     * @returns {undefined}
    */
    this.postNameInfo = function() {
        var channel = self.selected.split("-")[0];
        var id = channel.replace("CH","");
        $.ajax({
            url: self.ioConfigurationUrl + "/ioconfig/" + id,
            type: "POST",
            data: {
                "name": $("#name")[0].value
            },
            success: function() {
                console.log("Change name succeed!");
                self.updateIoInfo();
                self.updateStorageInfo();
                self.updateDashboardInfo();
            }
        });
    };

    /**
     * function to update conversion information
     * @returns {undefined}
    */
    this.postConversionInfo = function() {
        var channel = self.selected.split("-")[0];
        var id = channel.replace("CH","");
        $.ajax({
            url: self.ioConfigurationUrl + "/ioconfig/" + id,
            type: "POST",
            data: {
                "conversion": self.conversion.value
            },
            success: function() {
                console.log("Change conversion succeed!");
            }
        });
    };

    /**
     * function to update parameter m information
     * @returns {undefined}
    */
    this.postMinfo = function() {
        var channel = self.selected.split("-")[0];
        var id = channel.replace("CH","");
        $.ajax({
            url: self.ioConfigurationUrl + "/ioconfig/" + id,
            type: "POST",
            data: {
                "m-info": $("#m-info")[0].value
            },
            success: function() {
                console.log("Change m succeed!");
            }
        });
    };

    /**
     * function to update parameter b information
     * @returns {undefined}
    */
    this.postBinfo = function() {
        var channel = self.selected.split("-")[0];
        var id = channel.replace("CH","");
        $.ajax({
            url: self.ioConfigurationUrl + "/ioconfig/" + id,
            type: "POST",
            data: {
                "b-info": $("#b-info")[0].value
            },
            success: function() {
                console.log("Change b succeed!");
            }
        });
    };

    /**
     * function to update voltage divide information
     * @returns {undefined}
    */
    this.postVoltageDivideInfo = function() {
        var channel = self.selected.split("-")[0];
        var id = channel.replace("CH","");
        $.ajax({
            url: self.ioConfigurationUrl + "/ioconfig/" + id,
            type: "POST",
            data: {
                "voltage-divide": self.voltageDivide.value
            },
            success: function() {
                console.log("Change voltage divide succeed!");
            }
        });
    };

    /**
     * function to update sample range information
     * @returns {undefined}
    */
    this.postSampleRangeInfo = function() {
        var channel = self.selected.split("-")[0];
        var id = channel.replace("CH","");
        $.ajax({
            url: self.ioConfigurationUrl + "/ioconfig/" + id,
            type: "POST",
            data: {
                "sample-range": self.sampleRange.value
            },
            success: function() {
                console.log("Change sample range succeed!");
            }
        });
    };

    /**
     * function to update sample period information
     * @returns {undefined}
    */
    this.postSamplePeriodInfo = function() {
        var channel = self.selected.split("-")[0];
        var id = channel.replace("CH","");
        $.ajax({
            url: self.ioConfigurationUrl + "/ioconfig/" + id,
            type: "POST",
            data: {
                "sample-period": $("#sample-period")[0].value
            },
            success: function() {
                console.log("Change sample period succeed!");
            }
        });
    };

    /**
     * function to update store row information
     * @returns {undefined}
    */
    this.postStoreRowInfo = function() {
        var channel = self.selected.split("-")[0];
        var id = channel.replace("CH","");
        $.ajax({
            url: self.ioConfigurationUrl + "/ioconfig/" + id,
            type: "POST",
            data: {
                "store-row": $("#store-row")[0].checked
            },
            success: function() {
                console.log("Change store row succeed!");
            }
        });
    };

    /**
     * function to update voltage divide information
     * @returns {undefined}
    */
    this.postStoreConvertedInfo = function() {
        var channel = self.selected.split("-")[0];
        var id = channel.replace("CH","");
        $.ajax({
            url: self.ioConfigurationUrl + "/ioconfig/" + id,
            type: "POST",
            data: {
                "store-converted": $("#store-converted")[0].checked
            },
            success: function() {
                console.log("Change store converted succeed!");
            }
        });
    };

    /**
     * function to update default graph information
     * @returns {undefined}
    */
    this.postDefaultGraphInfo = function() {
        var channel = self.selected.split("-")[0];
        var id = channel.replace("CH","");
        $.ajax({
            url: self.ioConfigurationUrl + "/ioconfig/" + id,
            type: "POST",
            data: {
                "default-graph": self.defaultGraph.value
            },
            success: function() {
                console.log("Change default graph succeed!");
            }
        });
    };

    /**
     * function to update title information
     * @returns {undefined}
    */
    this.postTitleInfo = function() {
        var channel = self.selected.split("-")[0];
        var id = channel.replace("CH","");
        $.ajax({
            url: self.ioConfigurationUrl + "/ioconfig/" + id,
            type: "POST",
            data: {
                "title": $("#title")[0].value
            },
            success: function() {
                console.log("Change title succeed!");
            }
        });
    };

    /**
     * function to update units information
     * @returns {undefined}
    */
    this.postUnitsInfo = function() {
        var channel = self.selected.split("-")[0];
        var id = channel.replace("CH","");
        $.ajax({
            url: self.ioConfigurationUrl + "/ioconfig/" + id,
            type: "POST",
            data: {
                "units": $("#units")[0].value
            },
            success: function() {
                console.log("Change units succeed!");
            }
        });
    };

    /**
     * function to update range lowerbound information
     * @returns {undefined}
    */
    this.postRangeLowerboundInfo = function() {
        var channel = self.selected.split("-")[0];
        var id = channel.replace("CH","");
        $.ajax({
            url: self.ioConfigurationUrl + "/ioconfig/" + id,
            type: "POST",
            data: {
                "range-lowerbound": $("#range-lowerbound")[0].value
            },
            success: function() {
                console.log("Change range lower bound succeed!");
            }
        });
    };

    /**
     * function to update range upperbound information
     * @returns {undefined}
    */
    this.postRangeUpperboundInfo = function() {
        var channel = self.selected.split("-")[0];
        var id = channel.replace("CH","");
        $.ajax({
            url: self.ioConfigurationUrl + "/ioconfig/" + id,
            type: "POST",
            data: {
                "range-upperbound": $("#range-upperbound")[0].value
            },
            success: function() {
                console.log("Change range upper bound succeed!");
            }
        });
    };

    /**
     * function to update alert information
     * @returns {undefined}
    */
    this.postAlertInfo = function() {
        var channel = self.selected.split("-")[0];
        var id = channel.replace("CH","");
        $.ajax({
            url: self.ioConfigurationUrl + "/ioconfig/" + id,
            type: "POST",
            data: {
                "alert": $("#alert").value
            },
            success: function() {
                console.log("Change alert succeed!");
            }
        });
    };

    /**
     * function to update active node information
     * @returns {undefined}
    */
    this.toggleActiveNodeInfo = function() {
        var node = self.selected_io_node;
        $.ajax({
            url: self.activeNodeUrl + "/active-node",
            type: "POST",
            data: {
                "channel": node
            },
            success: function() {
                console.log(node + " toggled");
                self.updateIoInfo();
                self.updateStorageInfo();
                self.updateDashboardInfo();
            }
        });
    };

    /**
     * function to get log information
     * @returns {undefined}
     */
    this.getLogInfo = function() {
        $.ajax({
            url: self.logInfoUrl + "/loginfo",
            type: "GET",
            data: {
                "name": self.selected_storage_node
            },
            success: function(d) {
                $("#logChannel").text(d.channel);
                $("#logName").text(d.name);
                $("#logStartTime").text(d.started);
                $("#logLastSample").text(d.last_sample);
                $("#logTotalSample").text(d.total_sample);
                $("#logConversion").text(d.conversion);
                $("#logMB").text("M=" + d.m_info + " " + "B=" + d.b_info);
                $("#logVoltageDivide").text(d.voltage_divide);
                $("#logSampleRange").text(d.sample_range);
                $("#logSamplePeriod").text(d.sample_period)
                if(d.store_row == "true") {
                    $("#logStoreRow").attr("checked", "true");
                }
                if(d.store_converted == "true") {
                    $("#logStoreConverted").attr("checked", "true");
                }
            }
        });
    }

    /**
     * function to create log on the right
     * @returns {undefined}
     */
    this.createLogs = function() {
        var config = d3.select('#configure-main');
        
        config.append('div')
            .attr('id','logs')
            .style('overflow','auto')
            .style('height','100%');

        var top = d3.select('#logs')
            .append('div')
            .attr('class','top');
        var left = d3.select('#logs')
            .append('div')
            .attr('class','left');
        var right = d3.select('#logs')
            .append('div')
            .attr('class','right');


        left.append('div')
            .append('p')
            .text('Channel:');
        left.append('div')
            .append('p')
            .text('Name:');
        left.append('div')
            .append('p')
            .text('Started:');
        left.append('div')
            .append('p')
            .text('Last sample:');
        left.append('div')
            .append('p')
            .text('Total samples:');
        left.append('div')
            .append('p')
            .text('Conversion:');
        left.append('div');

        left.append('div')
            .append('p')
            .text('Voltage divide:');
        left.append('div')
            .append('p')
            .text('Sample range:');
        left.append('div')
            .append('p')
            .text('Sample period:');
        left.append('div')
            .append('p')
            .text('Store row:');
        left.append('div')
            .append('p')
            .text('Store converted:');

        right.append('div')
            .append('p')
            .attr('id','logChannel');
        right.append('div')
            .append('p')
            .attr('id','logName');
        right.append('div')
            .append('p')
            .attr('id','logStartTime');
        right.append('div')
            .append('p')
            .attr('id','logLastSample');
        right.append('div')
            .append('p')
            .attr('id','logTotalSample');
        right.append('div')
            .append('p')
            .attr('id','logConversion');
        right.append('div')
            .append('p')
            .attr('id','logMB');
        right.append('div')
            .append('p')
            .attr('id','logVoltageDivide');
        right.append('div')
            .append('p')
            .attr('id','logSampleRange');
        right.append('div')
            .append('p')
            .attr('id','logSamplePeriod')
        right.append('div')
            .append('p')
            .append('input')
            .attr('id','logStoreRow')
            .attr('type','checkbox')
            .attr('disabled','disabled');
        right.append('div')
            .append('p')
            .append('input')
            .attr('id','logStoreConverted')
            .attr('type','checkbox')
            .attr('disabled','disabled');

        self.getLogInfo();
    }

    /**
     * function to get io information for navigation tree
     * @returns {undefined}
     */
    this.updateIoInfo = function() {
        $.ajax({
            url: self.ioServiceUrl + "/io",
            type: "GET",
            success: function(data) {
                var ioTreeNode = {
                    title: data.title,
                    folder: data.folder,
                    key: data.key,
                    expanded: data.expanded,
                    keyboard: data.keyboard,
                    tabbable: data.tabbable,
                    children: data.children 
                };
                self.treeData[0] = ioTreeNode;
                self.finish++;
                if(self.finish >= 2) {
                    self.buildTree();
                }
            },
            error: function() {
                    console.log("404: Not Found");
                }
        });
    }

    /**
     * function to get storage information for navigation tree
     * @returns {undefined}
     */
    this.updateStorageInfo = function() {
        $.ajax({
            url: self.ioServiceUrl + "/storage",
            type: "GET", 
            success: function(data) {
                var storageTreeNode = {
                    title: data.title,
                    folder: data.folder,
                    key: data.key,
                    expanded: data.expanded,
                    children: data.children
                }
                self.treeData[1] = storageTreeNode;
                self.finish++;
                if(self.finish >= 2) {
                    self.buildTree();
                    var io = $("#tree").fancytree("getTree").rootNode.children[0];
                    var storage = $("#tree").fancytree("getTree").rootNode.children[1];
                    var map = {};
                    for(var i = 0; i < io.children.length - 1; ++i) {
                        var title = io.children[i].title.toUpperCase();
                        title = title.split(":");
                        map[title[0]] = title[1];
                    }
                    if(storage.children != null) {
                        for(var i = 0; i < storage.children.length; ++i) {
                            var title = storage.children[i].title;
                            title = title.split(":");
                            title = title[0] + ":" + map[title[0]] + " " + title[1];
                            storage.children[i].setTitle(title);
                        }    
                    }
                }
            },
            error: function() {
                    console.log("404: Not Found");
                }
        });
    }

    this.updateDashboardInfo = function() {
            var new_config = [];
            $.ajax({
                url: self.dashboardServiceUrl + "/dashboard",
                type: "GET",
                success: function(d) {
                    var tree3 = $("#tree3").fancytree("getTree");
                    var len = d.length;
                    for(var i = 0; i < len; i++){
                        var datum = {
                            title: d[i].title,
                            folder: d[i].folder,
                            key: d[i].key,
                            expanded: d[i].expanded,
                            children: d[i].children
                        };
                    new_config.push(datum);
                }
                tree3.reload(new_config);
            }
        });
    }

    /**
     * function to build the navigation tree
     * @returns {undefined}
     */
    this.buildTree = function() {
        $("#tree").fancytree({
            keyboard: false,
            source : self.treeData,
            renderNode: function (event, data) {
                if (data.node.key != "add" && data.node.key != "IO"&& data.node.key != "Storage" && data.node.key != "undeletable") {
                    var node = data.node;
                    var $nodeSpan = $(node.span);
                    var name = data.node.title;

                    // check if span of node already rendered
                    if (!$nodeSpan.data('rendered')) {
                        var deleteButton = 
                        $("<button id=\"btn-delete-\" class=\"btn btn-warning btn-xs btn-delete\" data-toggle=\"modal\" data-target=\"#delete-list\" data-title=''><span id=\"icon-delete\" class=\"glyphicon glyphicon-remove\"></span></button>");
                        deleteButton[0].id += parseInt($nodeSpan[0].children[2].textContent.split(":")[0].replace("CH",""));
                        deleteButton[0].dataset.title = name;
                        $nodeSpan.append(deleteButton);
                        deleteButton.hide();
                        $nodeSpan.hover(function () {
                            // mouse over
                            deleteButton.show();
                        }, function () {
                            // mouse out
                            deleteButton.hide();
                        })
                            // span rendered
                            $nodeSpan.data('rendered', true);
                        }
                    }
                },
                click: function (event, data) {
                    var tab = $('#tabs');
                    if (tab.length != 0) {tab.remove();}
                    var log = $('#logs');
                    if (log.length != 0) {log.remove();}
                    if (data.node.parent.title == 'I/O' && data.node.key != 'add') {
                        self.createTabs(data.node.title);
                        self.loadDefaultConfig();
                    }else if (data.node.parent.title == 'Storage') {
                        self.selected_storage_node = data.node.title;
                        self.createLogs();
                    }
                }
        });
        var tree = $("#tree").fancytree("getTree");
        var tree3 = $("#tree3").fancytree("getTree");

        //create add button on io tree
        var io = tree.rootNode.children[0];
        var storage = tree.rootNode.children[1];
        var dashboard = tree3.rootNode.children[0];
        var addButton = {
            "title": "<button id=\"btn-add\">+</button>",
            "key": "add",
            "icon": ""
        };
        io.addChildren(addButton);

        var last_io_node = io.getLastChild();
        var last_storage_node = storage.getLastChild();

        //make storage information undeletable
        var storage = tree.rootNode.children[1];
        if(storage.children != null) {
            for(var i = 0; i < storage.children.length; ++i) {
                storage.children[i].key = "undeletable";
            }    
        }

        $("body").on("click", "#btn-add", function () {
            var sib = $(this).siblings();
            if (sib.length == 0) {
                last_io_node.setTitle(last_io_node.title + "<input id=\"input-add\">");   
            }
            $("#input-add").on("keyup", function(e) {
                var key = e.which;
                if (key == 13) {
                    var input_text = document.getElementById("input-add").value;
                    var id = 1;
                    if(io.children.length > 1) {
                        var last_channel = io.children[io.children.length - 2];
                        id = parseInt(last_channel.title.split(":")[0].replace("CH","")) + 1;
                    }
                    var new_io_node = {title: "Ch" + id + ":" + input_text};
                    $.ajax({
                        url: self.ioConfigurationUrl + "/ioconfig/" + id,
                        type: "POST",
                        data: {
                            "name": input_text
                        },
                        success: function() {
                            console.log("Change name succeed!");
                        }
                    });
                    $.ajax({
                        url: self.ioConfigurationUrl + "/ioconfig/" + id,
                        type: "POST",
                        data: {
                            "title": "Ch" + id + ":" + input_text
                        },
                        success: function() {
                            console.log("Change title succeed!");
                        }
                    });
                    io.addChildren(new_io_node, last_io_node);
                    self.selected_io_node = new_io_node.title.split(":")[0].toUpperCase();
                    self.toggleActiveNodeInfo();
                    last_io_node.setTitle("<button id=\"btn-add\">+</button>");
                    
                }
            });
        });

        $('#delete-list').on('show.bs.modal', function (event) { 
            var button = $(event.relatedTarget); 
            var list_title = button.data('title');
            var id = button[0].id.split("-")[2];
            self.li_to_delete = id;
            var content = 'Are you sure want to delete ' + list_title + '?';
            var modal = $(this);
            modal.find('.modal-body').text(content);
            $("#yes").on("click", function() {
                var id = "#btn-delete-" + self.li_to_delete;
                $(id).parentsUntil("ul")[0].remove();
                $("#tabs").remove();
                self.selected_io_node = "CH" + self.li_to_delete;
                self.toggleActiveNodeInfo();
                $.ajax({
                    url: self.ioConfigurationUrl + "/ioconfig/" + id,
                    type: "POST",
                    data: {
                        "name": ""
                    },
                    success: function() {
                        console.log("Change name succeed!");
                    }
                });
                $.ajax({
                    url: self.ioConfigurationUrl + "/ioconfig/" + id,
                    type: "POST",
                    data: {
                        "title": ""
                    },
                    success: function() {
                        console.log("Change title succeed!");
                    }
                });
            });      
        });
    }
};

$(function () {
    //create structure of configuration view
    var configurationView = new ConfigurationView();
    configurationView.init();

    //build configuration navigation tree
    var cfgNav = new configureTree();
    cfgNav.updateIoInfo();
    cfgNav.updateStorageInfo();
});
