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

    if (totalSubCount > 0) {
        series = [{
            name: 'Size',
            data: rootData,
            size: '60%',
            dataLabels: {
                formatter: function () {
                    return this.y > 5 ? this.point.name : null;
                },
                color: '#ffffff',
                distance: -30
            },
            point: {
                events: {
                    click: function (event) {
                        alert(this.name);
                    }
                }
            }
        }, {
            name: 'Size',
            data: subData,
            size: '80%',
            innerSize: '60%',
            dataLabels: {
                formatter: function () {
                    if (!this.point.name) return null;

                    // display only if larger than 1
                    return this.y > 1 ? '<b>' + this.point.name + '</b> ' : null;
                }
            },
            point: {
                events: {
                    click: function (event) {
                        alert(this.name);
                    }
                }
            },
            id: 'subDir'
        }];
    } else {
        series = [{
            name: 'Size',
            data: rootData,
            size: '80%',
            dataLabels: {
                formatter: function () {
                    return this.y > 5 ? this.point.name : null;
                },
                color: '#ffffff',
                distance: -30
            },
            point: {
                events: {
                    click: function (event) {
                        alert(this.name);
                    }
                }
            }
        }];
    }
    
    // Create the chart
    Highcharts.chart(id, {
        chart: {
            type: 'pie'
        },
        title: {
            text: data.title
        },
        subtitle: {
            text: data.totalSize
        },
        plotOptions: {
            pie: {
                shadow: false,
                center: ['50%', '50%']
            }
        },
        tooltip: {
            valueSuffix: '%'
        },
        series: series,
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 400
                },
                chartOptions: {
                    series: [{
                    }, {
                        id: 'subDir',
                        dataLabels: {
                            enabled: false
                        }
                    }]
                }
            }]
        }
    });
}

function looseJsonParse(obj) {
    console.log(obj);
    return Function('"use strict";return (' + obj + ')')();
}