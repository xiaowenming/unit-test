<template>
    <div class="hyperChartPage">
        <div class="noData fontSize36 colorBlack" v-show="!chartIsShow">暂无血压数据</div>
        <div class="charts">
            <div v-show="chartIsShow" id="myHyperReportChart" :style="{width: '310px', height: '450px'}"></div>
        </div>
        <div class="legend fontSize28 clearfix bgWhite" v-show="chartIsShow">
            <div class="left fl tal">
                <p>收缩压/舒张压(mm Hg)</p>
                <div class="iconLeft"></div>
            </div>
            <div class="right fl tal">
                <p>脉搏(PM)</p>
                <div class="iconRight"></div>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
    .noData{
        margin-top: 2rem;
    }
    #myHyperReportChart{
        overflow: scroll;
    }
    .legend{
        color: #666;
        padding-top: 0.55rem;
        padding-left: 0.65rem;
        padding-bottom: 1.1rem;
        .left{
            margin-right: 1.55rem;
        }
        .iconLeft, .iconRight{
            height: 0.16rem;
            width: 0.42rem;
            margin-top: 0.25rem;
            border-radius: 0.08rem;
        }
        .iconLeft{
            background-color: #4ED5A4;
        }
        .iconRight{
            background-color: #FED387;
        }
    }
</style>
<script>
let echarts = require('echarts/lib/echarts')
// 引入折线图组件
require('echarts/lib/chart/line')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import {reportModel} from '../../api';
import {FormDate} from '../../utils/utils';
export default {
    data () {
        return{
            chartIsShow: true,
            xAxisData: [],
            diastolicData: [],
            systolicData: [],
            pulseData: []
        }
    },
    methods: {
        initChart () {
            let myLineChart = document.getElementById('myHyperReportChart');
            let windowWidth = window.screen.width;
            var resizeLineChartContainer = function () {
                myLineChart.style.width = window.innerWidth + 'px';
            };
            if (this.xAxisData.length > 6) {
                myLineChart.style.width = (windowWidth/6) * this.xAxisData.length + 'px';
                this.$nextTick(() => {
                    let legend = document.getElementsByClassName('legend')[0];
                    legend.style.width = (windowWidth/6) * this.xAxisData.length + 'px';
                });
            } else {
                myLineChart.style.width = windowWidth + 'px';
            }
            var myChart = echarts.init(document.getElementById('myHyperReportChart'));
            let option = {
                backgroundColor: '#fff',
                tooltip: {    //提示框组件
                    trigger: 'axis'
                },
                grid: {       //直角坐标系内绘图网格
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {     //工具栏
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {       //直角坐标系 grid 中的 x 轴
                    type: 'category',
                    // interval: 0,
                    axisLabel: {
                        interval:0,
                        color: '#999'
                    },
                    axisLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                    boundaryGap: false,
                    data: this.xAxisData
                },
                yAxis: {       //直角坐标系 grid 中的 y 轴
                    type: 'value',
                    min: 0,
                    max: 250,
                    interval : 25,
                    // splitNumber : 11,
                    axisLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                    axisLabel:{
                        color: '#999',
                        padding:[0, 0, 20, 0]
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#D2D8DF',
                            type: 'dashed'
                        }
                    }
                },
                series: [      //系列列表
                    {
                        type: 'line',
                        data: this.diastolicData,
                        lineStyle:{  
                            normal:{
                                color:'#4ED5A4' 
                            }
                        },
                        itemStyle:{
                            normal : {  
                                color:'#4ED5A4'
                            }  
                        },
                        symbol:'image://../../../static/images/sugarTestReport/szy.png',
                        symbolSize:15
                    },
                    {
                        type: 'line',
                        data: this.systolicData,
                        lineStyle:{  
                            normal:{
                                color:'#4ED5A4' 
                            }
                        },
                        itemStyle:{
                            normal : {  
                                color:'#4ED5A4'
                            }  
                        },
                        symbol:'image://../../../static/images/sugarTestReport/ssy.png',
                        symbolSize:15
                    },
                    {
                        type: 'line',
                        data: this.pulseData,
                        lineStyle:{  
                            normal:{
                                color:'#FED387'
                            }
                        },
                        itemStyle:{
                            normal : {  
                                color:'#FED387'
                            }  
                        },
                        symbol:'circle',
                        symbolSize:15
                    }
                ]
            };
            myChart.setOption(option);   //参数设置方法     
            //用于使chart自适应高度和宽度
            window.onresize = function () {
                //重置容器高宽
                resizeLineChartContainer();
                myChart.resize();
            };
        },
        getChartData () {
            let now = new Date();
            let startTime = FormDate(now.getTime() - 1000 * 60 * 60 * 24 * 365);
            let endData = FormDate(now.getTime());
            let data = {createStartTime: startTime, createEndTime: endData};
            reportModel.getHypertensionChartData(data, res => {
                let tempArr = res.data.data.items;
                if (!!tempArr && tempArr.length > 0) {
                    this.chartIsShow = true;
                    tempArr.forEach(item => {
                        this.xAxisData.push((item.createTime.substring(5, 10)).replace('-', '/'));
                        this.systolicData.push(item.sbp);
                        this.diastolicData.push(item.dbp);
                        this.pulseData.push(item.hr);
                    });
                    this.initChart();
                } else {
                    this.chartIsShow = false;
                }
                
            });
        }
    },
    mounted () {
        this.getChartData();
    }
}
</script>
