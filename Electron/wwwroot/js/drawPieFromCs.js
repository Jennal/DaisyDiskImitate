function drawPie(id, json) {
    var colors = Highcharts.getOptions().colors,
        data,
        rootData = [],
        subData = [],
        series = [],
        i,
        j,
        rootDataLen = 0,
        subDataLen = 0,
        totalSubCount = 0,
        brightness;

    data = looseJsonParse(json);
    rootDataLen = data.data.length;
    console.log(data)

    // Build the data arrays
    for (i = 0; i < rootDataLen; i += 1) {
        var color = colors[i % colors.length];
        
        // add root data
        rootData.push({
            name: data.data[i].name,
            y: data.data[i].y,
            color: data.data[i].color || color
        });

        // add sub data
        if (!data.data[i].children || data.data[i].children.length <= 0) {
            subData.push({
                name: "",
                y: data.data[i].y,
                color: "#ffffff"
            });
        } else {
            subDataLen = data.data[i].children.length;
            totalSubCount += subDataLen;
            for (j = 0; j < subDataLen; j += 1) {
                brightness = 0.2 - (j / subDataLen) / 5;
                // console.log(data.data[i].children[j].name, color, brightness, Highcharts.color(color).brighten(brightness).get());
                subData.push({
                    name: data.data[i].children[j].name,
                    y: data.data[i].children[j].y,
                    color: data.data[i].children[j].color || Highcharts.color(color).brighten(brightness).get()
                });
            }    
        }
    }

    series = [{
        name: 'Size',
        data: rootData,
        size: '60%',
        dataLabels: {
            formatter: function () {
                return this.y > 400 ? this.point.name : null;
            },
            color: '#ffffff',
            distance: -30
        },
        point: {
            events: {
                click: clickHandler
            }
        }
    }];
    
    if (totalSubCount > 0) {
        series.push({
            name: 'Size',
            data: subData,
            size: '80%',
            innerSize: '60%',
            dataLabels: {
                formatter: function () {
                    if (!this.point.name) return null;

                    // display only if larger than 1
                    return this.y > 400 ? '<b>' + this.point.name + '</b> ' : null;
                }
            },
            point: {
                events: {
                    click: clickHandler
                }
            },
            id: 'subDir'
        });
    }
    
    // Create the chart
    var chart = Highcharts.chart(id, {
        chart: {
            type: 'pie',
            margin: [0, 0, 0, 0],
            spacingTop: 0,
            spacingBottom: 0,
            spacingLeft: 0,
            spacingRight: 0
        },
        title: {
            text: data.title
        },
        subtitle: {
            text: data.totalSize
        },
        plotOptions: {
            pie: {
                size: '100%',
                shadow: false,
                center: ['50%', '50%']
            }
        },
        tooltip: {
            // valueSuffix: '%',
            pointFormatter: function() {
                return '<span style="color:' + this.color + '">\u25CF</span> '
                    + 'Percent: <b>' + Math.round(this.y/10)/10 + '%</b><br/>';
            }
        },
        series: series//,
        // responsive: {
        //     rules: [{
        //         condition: {
        //             maxWidth: 800
        //         },
        //         chartOptions: {
        //             series: [{
        //             }, {
        //                 id: 'subDir',
        //                 dataLabels: {
        //                     enabled: false
        //                 }
        //             }]
        //         }
        //     }]
        // }
    });

    window.chart = chart;
    removeAllListeners(window, 'resize');
    addListener(window, 'resize', function(event) {
        console.log("resize", chart);
        chart.reflow();
    }, true);
}

function looseJsonParse(obj) {
    console.log(obj);
    return Function('"use strict";return (' + obj + ')')();
}

function clickHandler(event) {
    window.csHighchart.invokeMethodAsync('Alert', this.name)
        .then(data => {
            alert(data);
    });
}

function registerCsObj(obj) {
    window.csHighchart = obj;
}

var _eventHandlers = {}; // somewhere global

const addListener = (node, event, handler, capture = false) => {
    if (!(event in _eventHandlers)) {
        _eventHandlers[event] = []
    }
    // here we track the events and their nodes (note that we cannot
    // use node as Object keys, as they'd get coerced into a string
    _eventHandlers[event].push({ node: node, handler: handler, capture: capture })
    node.addEventListener(event, handler, capture)
}

const removeAllListeners = (targetNode, event) => {
    if (!(event in _eventHandlers)) {
        return;
    }
    // remove listeners from the matching nodes
    var arr = _eventHandlers[event];
    
    for(var i=arr.length-1; i>=0; i--) {
        var item = arr[i];
        if (item.node !== targetNode) continue;
        
        targetNode.removeEventListener(event, item.handler, item.capture);
        arr.splice(i, 1);
    }
}