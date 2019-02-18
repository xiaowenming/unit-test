<template>
    <div class="reportChartPage">
        <div class="selectHeader">
            <div class="dayType fl" @click="showDateTypeSelectBox()"><span class="dayTypeText">{{dataTypeName}} <i></i></span></div>
            <div class="deviceType fr" @click="showDeviceSelectBox()"><span class="deviceTypeText">{{deviceImeiName.length>5?deviceImeiName.substring(0,4)+"...":deviceImeiName}} <i></i></span></div>
        </div>
        <div class="noData tac" v-show="!chartIsShow">
            无血糖测试数据
        </div>
        <div class="timeType" @click="showTimeTypeSelectBox()"><span class="timeTypeText">{{timeTypeName}} <i></i></span></div>
        <div class="charts">
            <div v-show="chartIsShow" id="myChart" :style="{width: '310px', height: '400px'}"></div>
        </div>
        <div class="overview-div bgWhite">
                <div class="every-div">
                    <div class="center-div">
                        <div class="top-div" id="minSugar" style="background-color:#F4A556;">{{minValue||0}}</div>
                        <div class="bottom-div">
                            最低值
                        </div>
                    </div>
                </div>
                <div class="every-div">
                    <div class="center-div">
                        <div class="top-div" id="maxSugar" style="background-color:#F95959;">{{maxValue||0}}</div>
                        <div class="bottom-div">
                            最高值
                        </div>
                    </div>
                </div>
                <div class="every-div">
                    <div class="center-div">
                        <div class="top-div" id="avgSugar" style="background-color:#34B597;">{{aveValue||0}}</div>
                        <div class="bottom-div">
                            平均值
                        </div>
                    </div>
                </div>
        </div>
        <!-- 时间段下拉框 -->
        <select-list v-show="dateTypeListShow" :list="dateTypeLsit" :defaultShow="defaultDateTypeIndex" :clickCallBack="selectDateTypeLi" :clickMaskCallBack="closeDateTypeMask"></select-list>
        <!-- 设备下拉框 -->
        <select-list v-show="deviceListShow" :list="deviceImeiList" :defaultShow="defaultDeviceIndex" :clickCallBack="selectDeviceLi" :clickMaskCallBack="closeDeviceMask"></select-list>
        <!-- 时段类型下拉 -->
        <select-list v-show="timeTypeListShow" :list="timeTypeList" :defaultShow="defaultTimeTypeIndex" :clickCallBack="selectTimeTypeLi" :clickMaskCallBack="closeTimeTypeMask"></select-list>
    </div>
</template>

<style lang="less" scoped>
    .reportChartPage{
        width: 100%;
    }
    .selectHeader{
        height: 0.9rem;
        margin-bottom: 0.5rem;
        font-size: 0.36rem;
    }
    .timeType{
        width: 1.6rem;
        height: 0.6rem;
        line-height: 0.6rem;
        font-size: 0.36rem;
        position: absolute;
        right: 0.4rem;
        top: 2.42rem;
        border: 1px solid #cecece;
        border-radius: 0.08rem;
        z-index: 99;
    }
    .selectHeader i,
    .timeType i{
        width: 0.26rem;
        height: 0.16rem;
        background: url("/static/images/default/icon_down_black.png") no-repeat ;
        background-size: cover;
    }
    .selectHeader div{
        margin-top: 0.27rem;
        height: 0.36rem;
        line-height: 0.36rem;
        width: 50%;
    }
    .dayType{
        border-right : 1px solid #2c3e50;
    }
    #myChart{
        margin: 0 auto;
    }
    .noData{
        margin-top: 1rem;
        width: 100%;
        font-size: 0.32rem;
    }
    .overview-div {
        width: 95%;
        height: 2.4rem;
        padding:0.5rem 0.1875rem 1rem;
        box-sizing: content-box;
    }
    .every-div {
        width: 33.3%;
        float: left;
    }
    .top-div {
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
        font-size: 0.36rem;
        color: #FFFFFF;
        line-height: 1.2rem;
    }
    .bottom-div{
        margin-top: 0.2rem;
        font-size: 0.36rem;
        color: #333333;
        font-weight: bold;
    }
    .center-div {
        width: 1.2rem;
        height: 2.2rem;
        margin: 0 auto;
        text-align: center;
    }
</style>

<script>
    import {reportModel, userModel} from '../../api'
    import selectList from '../commomComponents/selectList';
    import {dateTypeList} from '../../config/reportConfig'
    import {deviceModel} from '../../api'
    let echarts = require('echarts/lib/echarts')
    // 引入折线图组件
    require('echarts/lib/chart/line')
    // 引入提示框和title组件
    require('echarts/lib/component/tooltip')
    require('echarts/lib/component/title')
    export default {
        name:"reportChart",
        data (){
            return {
                dataTypeName: '', // 显示时间段
                defaultDateTypeIndex: 5, // 默认显示时间段下标
                deviceImeiName: '', // 设备名称
                dateTypeListShow: false,
                dateTypeLsit: [],
                deviceListShow: false,
                defaultDeviceIndex: 0, // 默认显示全部设备数据
                deviceImeiList: [],
                currentComponentsIndex: 0,
                dataTypeName: '',
                defaultTimeTypeIndex: 1, // 默认展示空腹时间段的数据
                timeTypeListShow:false,
                timeTypeName : "",
                timeTypeList : [],//时段集合
                xAxisData:[],//x轴数据
                yAxisData:[],
                dateType:5,
                timeType:1,
                deviceImei:null,
                chartIsShow:false,
                minValue:"",
                aveValue:"",
                maxValue:""
            }
        },
        methods:{
            init:function(){
                let myLineChart = document.getElementById('myChart');
                let windowWidth = window.screen.width;
                var resizeLineChartContainer = function () {
                    myLineChart.style.width = window.innerWidth+'px';
                };
                resizeLineChartContainer();
                var myChart = echarts.init(document.getElementById('myChart'));
                let option = {
                    title: {      //标题组件
                        text: '单位:mmol/L',
                        left:20,
                        textStyle:{
                            fontSize:12
                        }
                    },
                    tooltip: {    //提示框组件
                        trigger: 'axis'
                    },
                    legend: {     //图例组件
                        data: ['Series 1']
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
                        axisLabel: {
                            rotate: 60,
                        },
                        boundaryGap: false,
                        data: this.xAxisData
                    },
                    yAxis: {       //直角坐标系 grid 中的 y 轴
                        type: 'value',
                        axisLine:{
                            show:false
                        },
                        axisTick:{
                            show:false
                        },
                        axisLabel:{
                            padding:[0, -20, 20, 0]
                        },
                        minInterval:0,
                        splitArea:{
                            show:true,
                            areaStyle:{
                                color:['rgba(210,240,253,1)']
                            }
                        }
                    },
                    series: [      //系列列表
                        {
                            type: 'line',
                            stack: '总量',
                            data: this.yAxisData,
                            lineStyle:{  
                                normal:{
                                    color:'#1CB2F1' 
                                }
                            },
                            itemStyle:{
                                normal : {  
                                    color:'#1CB2F1'
                                }  
                            },
                            symbol:'circle',
                            symbolSize:10
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
            getChartData:function(){
                let _this = this;
                let data = {dateType:this.dateType, timeType:this.timeType};
                if(!!this.deviceImei){
                    data.deviceImei = this.deviceImei;
                }
                reportModel.getSugarTestJudgeAndList(data, function(res){
                    let result = res.data.data.sugarTestList;
                    _this.minValue = (res.data.data.judgeMap.minSugar*1).toFixed(1);
                    _this.aveValue = (res.data.data.judgeMap.avgSugar*1).toFixed(2);
                    _this.maxValue = (res.data.data.judgeMap.maxSugar*1).toFixed(1);
                    _this.yAxisData = result.map(value=>value.sugarValue);
                    if(!_this.yAxisData||_this.yAxisData.length==0){
                        _this.chartIsShow = false;
                    }else{
                        _this.chartIsShow = true;
                    }
                    _this.xAxisData = result.map(value=>value.time.substring(5.10));
                    _this.init();
                })
            },
            initData:function(){
                this.dateType = 5;
                this.timeType = 1;
                this.deviceImei = null;
                this.getChartData();
            },
            showDateTypeSelectBox () {
                this.dateTypeListShow = true;
            },
            showDeviceSelectBox () {
                this.deviceListShow = true;
            },
            showTimeTypeSelectBox () {
                this.timeTypeListShow = true;
            },
            selectDateTypeLi (item) { // 点击每一项时间
                this.dateType = item.key;
                this.dataTypeName = item.value;
                this.getChartData();
            },
            selectDeviceLi (item) { // 点击每一个设备
                this.deviceImei = item.key;
                this.deviceImeiName = item.value;
                this.getChartData();
            },
            selectTimeTypeLi (item) {
                this.timeType = item.key;
                this.timeTypeName = item.value;
                this.getChartData();
            },
            initDeviceList () {
                deviceModel.getDeviceList({}, (res) => {
                    this.deviceImei = "";
                    this.deviceImeiName = "全部设备";
                    this.deviceImeiList.push(
                        {
                            key : "",
                            value : "全部设备",
                        }
                    );
                    let result = res.data.data.disabeDeviceList;
                    if (result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            this.deviceImeiList.push(
                                {
                                    key : result[i].deviceImei,
                                    value : result[i].deviceName,
                                }
                            );
                        }
                    }
                })
            },
            // 初始化测量时段
            initTimeType:function(currentComponentsIndex){
                this.timeTypeList = [];
                userModel.getUserHealthTarget({}, (res) => {
                    this.timeType = res.data.data.obj[0].timeType;
                    this.timeTypeName = res.data.data.obj[0].name;
                    for (var i = 0; i < res.data.data.obj.length; i++) {
                        this.timeTypeList.push({
                            key: res.data.data.obj[i].timeType,
                            value: res.data.data.obj[i].name,
                        });
                    }
                });
            },
            closeDateTypeMask () {
                this.dateTypeListShow = false;
            },
            closeDeviceMask () {
                this.deviceListShow = false;
            },
            closeTimeTypeMask () {
                this.timeTypeListShow = false;
            }
        },
        beforeMount:function(){
            this.initDeviceList();
            this.initTimeType();
            this.dateTypeLsit = dateTypeList;
            this.dataTypeName = this.dateTypeLsit[this.defaultDateTypeIndex - 1].value;
            this.getChartData();
        },
        components: {
            selectList
        }
    }
</script>