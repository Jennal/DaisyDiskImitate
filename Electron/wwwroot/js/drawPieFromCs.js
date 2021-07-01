function drawPie() {
    var colors = Highcharts.getOptions().colors,
        data = {
            title: "C:\\Android",
            totalSize: "100 G",
            data:[
            {
                name: "Android",
                size: "10 G",
                y: 62.74,
                children: [{
                    name: 'Android/sub1',
                    size: "10 G",
                    y: 20
                },{
                    name: 'Android/sub2',
                    size: "10 G",
                    y: 42.74
                }]
            },
            {
                name: "iOS",
                size: "10 G",
                y: 10.57,
                children: [{
                    name: 'iOS/sub1',
                    size: "10 G",
                    y: 5
                },{
                    name: 'iOS/sub2',
                    size: "10 G",
                    y: 5.57
                }]
            }
            ]
        },
        rootData = [],
        subData = [],
        i,
        j,
        rootDataLen = data.data.length,
        subDataLen = 0,
        brightness;


    // Build the data arrays
    for (i = 0; i < rootDataLen; i += 1) {
        var color = colors[i % colors.length];
        
        // add browser data
        rootData.push({
            name: data.data[i].name,
            sizeStr: data.data[i].size,
            y: data.data[i].y,
            color: color
        });

        // add version data
        subDataLen = data.data[i].children.length;
        for (j = 0; j < subDataLen; j += 1) {
            brightness = 0.2 - (j / subDataLen) / 5;
            console.log(data.data[i].children[j].name, color, brightness, Highcharts.color(color).brighten(brightness).get());
            subData.push({
                name: data.data[i].children[j].name,
                sizeStr: data.data[i].children[j].size,
                y: data.data[i].children[j].y,
                color: Highcharts.color(color).brighten(brightness).get()
            });
        }
    }

    // Create the chart
    Highcharts.chart('container', {
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
        series: [{
            name: 'Size',
            data: rootData,
            size: '60%',
            dataLabels: {
                formatter: function () {
                    return this.y > 5 ? this.point.name + " (" + this.point.sizeStr + ")" : null;
                },
                color: '#ffffff',
                distance: -30
            }
        }, {
            name: 'Size',
            data: subData,
            size: '80%',
            innerSize: '60%',
            dataLabels: {
                formatter: function () {
                    // display only if larger than 1
                    return this.y > 1 ? '<b>' + this.point.name + ':</b> ' +
                        this.point.sizeStr : null;
                }
            },
            id: 'subDir'
        }],
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
    return Function('"use strict";return (' + obj + ')')();
}