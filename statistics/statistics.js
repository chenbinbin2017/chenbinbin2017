const context = {
    products: [],
};
var myChart;

function getReleaseTime(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    return `${year}/${month}/${day}${h}:${m}:${s}`
}

function getShortTime(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`
}

function logout() {
    AV.User.logOut();
    window.location.href = "./../login/login.html"
}

function groupBy(array, f) {
    const groups = {};
    array.forEach(function(o) {
        const group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o)
    });
    return Object.keys(groups).map(function(group) {
        return groups[group]
    })
}

function InitEchart_everyData() {
    var axisX = []
    var axisY = []
    var classOptions = [];
    var classOptionsValue = [];
    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();
    var sunData = 0;
    var logNumber = 0;
    const author = AV.User.current();
    const query = new AV.Query('Product');
    query.equalTo('owner', author);
    query.greaterThanOrEqualTo('createDate', new Date(startTime));
    query.lessThan('createDate', new Date(endTime));
    query.addDescending('createDate');
    query.limit(1000);
    query.find().then((products) => {
        products.forEach((product) => {
            const owner = product.attributes.owner;
            classOptions.push({
                "name": product.attributes.title,
                "value": product.attributes.price
            }); {
                axisX.push(getShortTime(product.attributes.createDate));
                axisY.push(product.attributes.price);
                context.products.push({
                    productTitle: product.attributes.title,
                    productDescription: product.attributes.description,
                    price: product.attributes.price,
                    ownerUsername: author.id == owner.id ? author.attributes.username : "unknown",
                    releaseTime: getReleaseTime(product.attributes.createDate),
                });
                sunData = sunData + parseFloat(product.attributes.price);
                logNumber = logNumber + 1
            }
        });
        console.log('%d记录数', logNumber);
        if (myChart != null && myChart != "" && myChart != undefined) myChart.dispose();
        myChart = echarts.init(document.getElementById('everyData'));
        var option = {
            title: {
                text: '每日汇总信息'
            },
            tooltip: {},
            legend: {
                data: ['金额']
            },
            xAxis: {
                data: axisX
            },
            yAxis: {},
            series: [{
                name: '金额',
                type: 'line',
                data: axisY
            }]
        };
        myChart.setOption(option);
        const source = $("#products-list").html();
        const template = Handlebars.compile(source);
        const html = template(context);
        $(".products-detail").html(html);
        InitQ_SumData(sunData, 5000);
        const sorted = groupBy(classOptions, function(item) {
            return [item.name];
        });
        console.log(sorted);
        InitQ_ClassTj(sorted)
    }).catch((error) => alert(error.error))
}

function InitQ_SumData(sumData, CfgData) {
    var dom = document.getElementById("container");
    var myChart = echarts.init(dom);
    var app = {};
    var option;
    var cfg1w = 10000;
    var cfg5k = 5000;
    const gaugeData = [{
        value: (100 * sumData / cfg1w).toFixed(2),
        name: (sumData).toFixed(2) + " / 1w",
        title: {
            offsetCenter: ['0%', '-40%']
        },
        detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '-10%']
        }
    }, {
        value: (100 * sumData / cfg5k).toFixed(2),
        name: "/5k",
        title: {
            offsetCenter: ['60%', '30%']
        },
        detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '30%']
        }
    }];
    option = {
        series: [{
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            pointer: {
                show: false
            },
            progress: {
                show: true,
                overlap: false,
                roundCap: true,
                clip: false,
                itemStyle: {
                    borderWidth: 1,
                    borderColor: '#464646'
                }
            },
            axisLine: {
                lineStyle: {
                    width: 15
                }
            },
            splitLine: {
                show: false,
                distance: 0,
                length: 10
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false,
                distance: 50
            },
            data: gaugeData,
            title: {
                fontSize: 12
            },
            detail: {
                width: 50,
                height: 12,
                fontSize: 12,
                color: 'auto',
                borderColor: 'auto',
                borderRadius: 20,
                borderWidth: 1,
                formatter: '{value}%'
            }
        }]
    };
    if (option && typeof option === 'object') {
        myChart.setOption(option)
    }
}

function InitQ_ClassTj(groupList) {
    var dom = document.getElementById("tjClass");
    var myChart = echarts.init(dom);
    var option;
    var map = {},
        dest = [];
    var valueTmp = 0;
    var nameTmp = "";
    for (var i = 0; i < groupList.length; i++) {
        var ai = groupList[i];
        valueTmp = 0;
        nameTmp = "";
        for (var j = 0; j < ai.length; j++) {
            valueTmp += ai[j].value;
            nameTmp = ai[j].name
        }
        dest.push({
            "name": nameTmp,
            "value": valueTmp
        })
    }
    option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        toolbox: {
            show: true,
            feature: {
                mark: {
                    show: true
                },
                dataView: {
                    show: true,
                    readOnly: false
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        series: [{
            name: 'Area Mode',
            type: 'pie',
            radius: [10, 70],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
                borderRadius: 5
            },
            data: dest
        }]
    };
    if (option && typeof option === 'object') {
        myChart.setOption(option)
    }
}

function QueryBtn_ClickFun() {
    var sumData = InitEchart_everyData()
}

function InitDateValue() {
    var start = document.getElementById("endTime");
    var date = new Date();
    var month_t = date.getMonth().toString();
    if (date.getMonth() + 1 < 10) month_t = '0' + (date.getMonth() + 1);
    var day_t = date.getDate().toString();
    if (date.getDate() + 1 < 10) day_t = '0' + (date.getDate() + 1) var dateString = date.getFullYear() + "/" + (month_t) + "/" + (day_t);
    start.value = dateString
}

function selectNewTime(id) {
    var time = getTime(id);
    var start = document.getElementById("startTime");
    start.value = time.startTime;
    var end = document.getElementById("endTime");
    end.value = time.endTime
}

function getTime(id) {
    var getNowDate = new Date();
    const nowYear = getNowDate.getFullYear();
    let nowMonth = getNowDate.getMonth() + 1;
    let nowDay = getNowDate.getDate();
    if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = '0' + nowMonth
    }
    if (nowDay >= 1 && nowDay <= 9) {
        nowDay = '0' + nowDay
    } else if (nowDay == 1) {
        nowDay = 30;
        nowMonth -= 1
    }
    var newEndTime = nowYear + '-' + nowMonth + '-' + nowDay;
    var newStartDate;
    if (id == 1) {
        var getThreeDate = new Date(getNowDate - 3 * 24 * 3600 * 1000);
        var thYear = getThreeDate.getFullYear();
        var thMonth = getThreeDate.getMonth() + 1;
        var thDay = getThreeDate.getDate();
        if (thMonth >= 1 && thMonth <= 9) {
            thMonth = '0' + thMonth
        }
        if (thDay >= 0 && thDay <= 9) {
            thDay = '0' + thDay
        }
        newStartDate = thYear + '-' + thMonth + '-' + thDay
    }
    if (id == 2) {
        var getWeekDate = new Date(getNowDate - 7 * 24 * 3600 * 1000);
        var weekYear = getWeekDate.getFullYear();
        var weekMonth = getWeekDate.getMonth() + 1;
        var weekDay = getWeekDate.getDate();
        if (weekMonth >= 1 && weekMonth <= 9) {
            weekMonth = '0' + weekMonth
        }
        if (weekDay >= 1 && weekDay <= 9) {
            weekDay = '0' + weekDay
        }
        newStartDate = weekYear + '-' + weekMonth + '-' + weekDay
    }
    if (id == 3) {
        getNowDate.setMonth(getNowDate.getMonth() - 1);
        var thirtyYear = getNowDate.getFullYear();
        var thirtyMonth = getNowDate.getMonth() + 1;
        var thirtyDay = getNowDate.getDate();
        if (thirtyMonth >= 1 && thirtyMonth <= 9) {
            thirtyMonth = '0' + thirtyMonth
        }
        if (thirtyDay >= 1 && thirtyDay <= 9) {
            thirtyDay = '0' + thirtyDay
        }
        newStartDate = thirtyYear + '-' + thirtyMonth + '-' + thirtyDay
    }
    if (id == 4) {
        getNowDate.setMonth(getNowDate.getMonth());
        var thirtyYear = getNowDate.getFullYear();
        var thirtyMonth = getNowDate.getMonth() + 1;
        var thirtyDay = '01';
        if (thirtyMonth >= 1 && thirtyMonth <= 9) {
            thirtyMonth = '0' + thirtyMonth
        }
        newStartDate = thirtyYear + '-' + thirtyMonth + '-' + thirtyDay
    }
    if (id == 5) {
        var year = getNowDate.getFullYear();
        var month = getNowDate.getMonth();
        if (month == 0) {
            month = 12;
            year = year - 1
        }
        if (month < 10) {
            month = '0' + month
        }
        var myDate = new Date(year, month, 0);
        newStartDate = year + '-' + month + '-01';
        newEndTime = year + '-' + month + '-' + myDate.getDate();
    }
    if (id == 6) {
        var year = getNowDate.getFullYear();
        newStartDate = year + '-01-01';
    }
    return {
        'startTime': newStartDate,
        'endTime': newEndTime
    }
}
$(function() {
    if (AV.User.current()) {} else {
        window.location.href = "./../login/login.html"
    }
});
