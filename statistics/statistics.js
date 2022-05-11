const context = {
    products: [],
};
var KRmjP1;

function getReleaseTime(KpnsduqHu2) {
    const year = KpnsduqHu2['getFullYear']();
    const month = KpnsduqHu2['getMonth']() + 1;
    const day = KpnsduqHu2['getDate']();
    const h = KpnsduqHu2['getHours']();
    const m = KpnsduqHu2['getMinutes']();
    const s = KpnsduqHu2['getSeconds']();
    return `${year}/${month}/${day} ${h}:${m}:${s}`
}

function getShortTime(GDDhUuZGA3) {
    const month = GDDhUuZGA3['getMonth']() + 1;
    const day = GDDhUuZGA3['getDate']();
    return `${month}/${day}`
}

function logout() {
    AV['User']['logOut']();
    window['location']['href'] = "./../login/login.html"
}

function groupBy(pOTVHaV4, XSaQeZuHl4) {
    const groups = {};
    pOTVHaV4['forEach'](function(L_MZjs5) {
        const group = JSON['stringify'](XSaQeZuHl4(L_MZjs5));
        groups[group] = groups[group] || [];
        groups[group]['push'](L_MZjs5)
    });
    return window["Object"]['keys'](groups)['map'](function(q6) {
        return groups[q6]
    })
}

function InitEchart_everyData() {
    var DXtJC7 = []
    var LsT8 = []
    var OuUoc9 = [];
    var h10 = [];
    var _zDY11$ql12 = $("#startTime")['val']();
    var Trw12 = $("#endTime")['val']();
    var o$13 = 0;
    var sZ14 = 0;
    const author = AV['User']['current']();
    const query = new AV['Query']('Product');
    query['equalTo']('owner', author);
    query['greaterThanOrEqualTo']('createDate', new window["Date"](_zDY11$ql12));
    query['lessThan']('createDate', new window["Date"](Trw12));
    query['addDescending']('createDate');
    query['limit'](1000);
    query['find']()['then']((products) => {
        products['forEach']((product) => {
            const owner = product['attributes']['owner'];
            OuUoc9['push']({
                "name": product['attributes']['title'],
                "value": product['attributes']['price']
            }); {
                DXtJC7['push'](getShortTime(product['attributes']['createDate']));
                LsT8['push'](product['attributes']['price']);
                context['products']['push']({
                    productTitle: product['attributes']['title'],
                    productDescription: product['attributes']['description'],
                    price: product['attributes']['price'],
                    ownerUsername: author['id'] == owner['id'] ? author['attributes']['username'] : "unknown",
                    releaseTime: getReleaseTime(product['attributes']['createDate']),
                });
                o$13 = o$13 + window["parseFloat"](product['attributes']['price']);
                sZ14 = sZ14 + 1
            }
        });
        console['log']('%d记录数', sZ14);
        if (KRmjP1 != null && KRmjP1 != "" && KRmjP1 != undefined) KRmjP1['dispose']();
        KRmjP1 = echarts['init'](window["document"]['getElementById']('everyData'));
        var YIp15 = {
            title: {
                text: '每日汇总信息'
            },
            tooltip: {},
            legend: {
                data: ['金额']
            },
            xAxis: {
                data: DXtJC7
            },
            yAxis: {},
            series: [{
                name: '金额',
                type: 'line',
                data: LsT8
            }]
        };
        KRmjP1['setOption'](YIp15);
        const source = $("#products-list")['html']();
        const template = Handlebars['compile'](source);
        const html = template(context);
        $(".products-detail")['html'](html);
        InitQ_SumData(o$13, 5000);
        const sorted = groupBy(OuUoc9, function(Ruetf_APp16) {
            return [Ruetf_APp16['name']]
        });
        console['log'](sorted);
        InitQ_ClassTj(sorted)
    })['catch']((error) => window["alert"](error['error']))
}

function InitQ_SumData(sumData, TrqDmKl17) {
    var gWbc$T18 = window["document"]['getElementById']("container");
    var XSDETsyk19 = echarts['init'](gWbc$T18);
    var tHUVl20$mq21 = {};
    var Os21;
    var uCqspJs22 = 10000;
    var nB23 = 5000;
    const gaugeData = [{
        value: (100 * sumData / uCqspJs22)['toFixed'](2),
        name: (sumData)['toFixed'](2) + " / 1w",
        title: {
            offsetCenter: ['0%', '-40%']
        },
        detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '-10%']
        }
    }, {
        value: (100 * sumData / nB23)['toFixed'](2),
        name: "/5k",
        title: {
            offsetCenter: ['60%', '30%']
        },
        detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '30%']
        }
    }];
    Os21 = {
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
    if (Os21 && typeof Os21 === 'object') {
        XSDETsyk19['setOption'](Os21)
    }
}

function InitQ_ClassTj(groupList) {
    var ASNoYDV24 = window["document"]['getElementById']("tjClass");
    var IzkBv25 = echarts['init'](ASNoYDV24);
    var vTPhTVi26$XoQ$vw27;
    var wSK27 = {},
        dest = [];
    var N28 = 0;
    var hpBFzkBqI29 = "";
    for (var o$SIj30 = 0; o$SIj30 < groupList['length']; o$SIj30++) {
        var JOuUdPY_s31$gssw32 = groupList[o$SIj30];
        N28 = 0;
        hpBFzkBqI29 = "";
        for (var i32 = 0; i32 < JOuUdPY_s31$gssw32['length']; i32++) {
            N28 += JOuUdPY_s31$gssw32[i32]['value'];
            hpBFzkBqI29 = JOuUdPY_s31$gssw32[i32]['name']
        }
        dest['push']({
            "name": hpBFzkBqI29,
            "value": N28
        })
    }
    vTPhTVi26$XoQ$vw27 = {
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
    if (vTPhTVi26$XoQ$vw27 && typeof vTPhTVi26$XoQ$vw27 === 'object') {
        IzkBv25['setOption'](vTPhTVi26$XoQ$vw27)
    }
}

function QueryBtn_ClickFun() {
    var zVYW33 = InitEchart_everyData()
}

function InitDateValue() {
    var cjkVu34 = window["document"]['getElementById']("endTime");
    var FNWjzWi35 = new window["Date"]();
    var m36 = FNWjzWi35['getMonth']()['toString']();
    if (FNWjzWi35['getMonth']() + 1 < 10) m36 = '0' + (FNWjzWi35['getMonth']() + 1);
    var VbWgJ37 = FNWjzWi35['getDate']()['toString']();
    if (FNWjzWi35['getDate']() + 1 < 10) VbWgJ37 = '0' + (FNWjzWi35['getDate']() + 1);
    var DuqKaqY38 = FNWjzWi35['getFullYear']() + "/" + (m36) + "/" + (VbWgJ37);
    cjkVu34['value'] = DuqKaqY38
}

function selectNewTime(N_pjr40) {
    var XfdJHq39 = getTime(N_pjr40);
    var HtsRPsZve40 = window["document"]['getElementById']("startTime");
    HtsRPsZve40['value'] = XfdJHq39['startTime'];
    var zsWItBpu41 = window["document"]['getElementById']("endTime");
    zsWItBpu41['value'] = XfdJHq39['endTime']
}

function getTime(k44) {
    var DF42 = new window["Date"]();
    const nowYear = DF42['getFullYear']();
    let nowMonth = DF42['getMonth']() + 1;
    let nowDay = DF42['getDate']();
    if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = '0' + nowMonth
    }
    if (nowDay >= 1 && nowDay <= 9) {
        nowDay = '0' + nowDay
    } else if (nowDay == 1) {
        nowDay = 30;
        nowMonth -= 1
    }
    var ZqOAOmP43 = nowYear + '-' + nowMonth + '-' + nowDay;
    var BA44;
    if (k44 == 1) {
        var Agchtj45 = new window["Date"](DF42 - 3 * 24 * 3600 * 1000);
        var cJv_Qdq46 = Agchtj45['getFullYear']();
        var zmFHl47 = Agchtj45['getMonth']() + 1;
        var HFDQ$Oc48 = Agchtj45['getDate']();
        if (zmFHl47 >= 1 && zmFHl47 <= 9) {
            zmFHl47 = '0' + zmFHl47
        }
        if (HFDQ$Oc48 >= 0 && HFDQ$Oc48 <= 9) {
            HFDQ$Oc48 = '0' + HFDQ$Oc48
        }
        BA44 = cJv_Qdq46 + '-' + zmFHl47 + '-' + HFDQ$Oc48
    }
    if (k44 == 2) {
        var sH49 = new window["Date"](DF42 - 7 * 24 * 3600 * 1000);
        var $s50 = sH49['getFullYear']();
        var z51 = sH49['getMonth']() + 1;
        var pkeWeR52zA55 = sH49['getDate']();
        if (z51 >= 1 && z51 <= 9) {
            z51 = '0' + z51
        }
        if (pkeWeR52zA55 >= 1 && pkeWeR52zA55 <= 9) {
            pkeWeR52zA55 = '0' + pkeWeR52zA55
        }
        BA44 = $s50 + '-' + z51 + '-' + pkeWeR52zA55
    }
    if (k44 == 3) {
        DF42['setMonth'](DF42['getMonth']() - 1);
        var Zs53 = DF42['getFullYear']();
        var k54 = DF42['getMonth']() + 1;
        var i55 = DF42['getDate']();
        if (k54 >= 1 && k54 <= 9) {
            k54 = '0' + k54
        }
        if (i55 >= 1 && i55 <= 9) {
            i55 = '0' + i55
        }
        BA44 = Zs53 + '-' + k54 + '-' + i55
    }
    if (k44 == 4) {
        DF42['setMonth'](DF42['getMonth']());
        var QOeeEkr56 = DF42['getFullYear']();
        var ftcbsb57 = DF42['getMonth']() + 1;
        var pptOpc58 = '01';
        if (ftcbsb57 >= 1 && ftcbsb57 <= 9) {
            ftcbsb57 = '0' + ftcbsb57
        }
        BA44 = QOeeEkr56 + '-' + ftcbsb57 + '-' + pptOpc58
    }
    if (k44 == 5) {
        var BADVmpknd59 = DF42['getFullYear']();
        var gUC60 = DF42['getMonth']();
        if (gUC60 == 0) {
            gUC60 = 12;
            BADVmpknd59 = BADVmpknd59 - 1
        }
        if (gUC60 < 10) {
            gUC60 = '0' + gUC60
        }
        var XoODnm61 = new window["Date"](BADVmpknd59, gUC60, 0);
        BA44 = BADVmpknd59 + '-' + gUC60 + '-01';
        ZqOAOmP43 = BADVmpknd59 + '-' + gUC60 + '-' + XoODnm61['getDate']()
    }
    if (k44 == 6) {
        var sadwV63 = DF42['getFullYear']();
        BA44 = sadwV63 + '-01-01'
    }
    return {
        'startTime': BA44,
        'endTime': ZqOAOmP43
    }
}
$(function() {
    if (AV['User']['current']()) {} else {
        window['location']['href'] = "./../login/login.html"
    }
});
