<template>
    <div class="reportTablePage" :style="{'-webkit-overflow-scrolling': scrollMode}">
        <div class="selectHeader">
            <div class="dayType fl" @click="showDateTypeSelectBox()"><span class="dayTypeText">{{dataTypeName}} <i></i></span></div>
            <div class="deviceType fr" @click="showDeviceSelectBox()"><span class="deviceTypeText">{{deviceImeiName.length>5?deviceImeiName.substring(0,4)+"...":deviceImeiName}} <i></i></span></div>
        </div>
        <mescroll-vue class="container" ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
            <!-- 统计 -->
            <div class="judge">
                <div class="left fl">
                    <div id="ringBox" style="width:90px;height:90px;"></div>
                </div>
                <div class="right fl">
                    <div class="item fl">
                        <span>{{sumNormal}}</span>
                        <span class="colorBase">正常</span>
                    </div>
                    <div class="item fl">
                        <span>{{sumHight}}</span>
                        <span class="colorHight">偏高</span>
                    </div>
                    <div class="item fl">
                        <span>{{sumLow}}</span>
                        <span class="colorLow">偏低</span>
                    </div>
                </div>
            </div>
            <div class="tableBox">
                <myTable :sugerTestList="sugerTestList" :toThisDayDetail="toThisDayDetail" :clickSugarValue="clickSugarValue" :tfootIsShow = "tfootIsShow"></myTable>
            </div>
        </mescroll-vue>
        <div class="addReport">
            <router-link :to="{path:'/sugarReport/addReport/add'}"><img src="/static/images/sugarTestReport/icon_add_sugar.png" alt=""></router-link>
        </div>
        <!-- 同一时段多次测量弹窗 -->
        <cascadeForm v-on:closeMask="closeChooseMask" v-if="createCascadeForm" ref="cascadeForm" :dataTimeSugarList="dataTimeSugarList" :formType="formType"></cascadeForm>
        <!-- 时间段下拉框 -->
        <select-list v-show="dateTypeListShow" :list="dateTypeLsit" :defaultShow="defaultDateTypeIndex" :clickCallBack="selectDateTypeLi" :clickMaskCallBack="closeDateTypeMask"></select-list>
        <!-- 设备下拉框 -->
        <select-list v-show="deviceListShow" :list="deviceImeiList" :defaultShow="defaultDeviceIndex" :clickCallBack="selectDeviceLi" :clickMaskCallBack="closeDeviceMask"></select-list>
    </div>
</template>
<style>
    .reportTablePage .mint-loadmore-bottom{
        height: 0;
        margin-bottom: 0;
    }
</style>

<style lang="less" scoped>
    .reportTablePage{
        border-top: 1px solid #e0e0e0;
        overflow-y: scroll;
        // padding-bottom: 0.90rem;
    }
    .selectHeader{
        height: 0.9rem;
        font-size: 0.36rem;
    }
    .selectHeader i{
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
    .container{
        position: fixed;
        top: 2.12rem;
    }
    .addReport{
        width: 1rem;
        height: 1rem;
        position: fixed;
        right: 5%;
        bottom: 10%;
        z-index: 100;
    }
    .tableBox{
        width: 100%;
    }
    .judge{
        width: 100%;
        height: 1.8rem;
    }
    .judge .left{
        width: 2.8rem;
        height: 100%;
    }
    .judge .right{
        width: 4.7rem;
        height: 100%;
    }
    .right .item{
        width: 1.4rem;
        height: 100%;
        font-size: 0.36rem;
        padding-top: 0.4rem;
        padding-right: 0.5rem; 
    }
    .item span{
        display: block;
        width: 100%;
    }
</style>

<script>
    import myTable from '../commomComponents/myTable'
    import cascadeForm from '../commomComponents/cascadeForm'
    import {isEmptyString} from '../../utils/utils'
    import {userModel, reportModel} from '../../api'
    import MescrollVue from 'mescroll.js/mescroll.vue'
    import { types } from 'util';
    import selectList from '../commomComponents/selectList';
    import {dateTypeList} from '../../config/reportConfig'
    import {deviceModel} from '../../api'
    let echarts = require('echarts/lib/echarts')
    // 引入折线图组件
    require('echarts/lib/chart/pie')
    export default {
        name:"reportTable",
        data (){
            return {
                dataTypeName: '', // 显示时间段
                defaultDateTypeIndex: 5, // 默认显示时间段下标
                deviceImeiName: '', // 设备名称
                dateTypeListShow: false,
                dateTypeLsit: [],
                deviceListShow: false,
                defaultDeviceIndex: 0,
                deviceImeiList: [],
                sugerTestList: [],
                sugerDic: [],
                sugerDicObj: {},
                dateType: 5,
                deviceImei: null,
                allLoaded: false,
                scrollMode: 'auto',
                startPage: 1,
                tfootIsShow: false,
                sumNormal: '',
                sumHight: '',
                sumLow: '',
                formType: 'sugarTestList',
                createCascadeForm: false,
                dataTimeSugarList: [],
                mescroll: null, // mescroll实例对象
                mescrollDown: {
                    use: false
                },
                mescrollUp: { // 上拉加载的配置.
                    callback: this.getSugarList,
                    page: {
                        num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                        size: 25 //每页数据条数,默认10
                    },
                    noMoreSize: 5,
                    isLock: false
                }
            }
        },
        methods:{
            toThisDayDetail (parama) {
                this.$router.push({path:'/tangyouCircle/tangyouCircle',query:{dateTime:parama,newMessageIsShow:true}});
            },
            getSugarList (page, mescroll) {
                let data = {
                    dateType: this.dateType,
                    pageNo: this.mescrollUp.page.num,
                    pageSize:this.mescrollUp.page.size};
                if(!!this.deviceImei){
                    data.deviceImei = this.deviceImei;
                }
                reportModel.getSugarTestList(data, (res) => {
                    if(res.data.data.pageNo >= res.data.data.pageCount||res.data.data.pageCount==0){
                        this.mescrollUp.isLock = true;
                    }else{
                        this.mescrollUp.isLock = false;
                    }
                    let dataList = res.data.data.data;
                    let indexArr = ["dtime","emptyStomach","afterBreakfast","antePrandium","afterLunch","beforeDinner","afterDinner","atBedtime","beforeDawn"];
                    let tempArr=dataList.map(data=>{
                            return indexArr.map(index=>{
                                let value = data[index];
                                return this.swichValueBySugarDicObj(index, value);
                        });
                    })
                    this.sugerTestList = this.sugerTestList.concat(tempArr);
                    this.$nextTick(() => {
                        this.mescroll.endSuccess(dataList.length);
                    });
                }, res => {
                    this.mescroll.endErr();
                })
            },
            swichValueBySugarDicObj (timeType, str) {
                let rule = this.sugerDicObj[timeType]; // 
                let tempObj, color, value, times;
                value = str.split(",")[0];
                times = str.split(",")[1];
                if (!rule) {
                    tempObj = {value: value == '0' ? '' : value, color: "#000", flag: false};
                } else{
                    if (value * 1 == 0 || times  * 1 == 0) {
                        tempObj = {value: '', color: "#000", flag: false};
                    } else {
                        if (value > rule.maxValue) {
                            color = "#ec5757";
                        } else if (value < rule.minValue) {
                            color = "#f1c245";
                        } else {
                            color = "#4acc87";
                        }
                        tempObj = {value: value == '0' ? '' : value,color: color,flag: times > 1 ? true : false};
                    }
                }
                return tempObj;
            },
            getSugerDic () {
                let _this = this;
                userModel.getUserHealthTarget({}, function(res){
                    _this.sugerDic = res.data.data.obj;
                    let number = 0;
                    _this.sugerDic.forEach((item, index) => {
                        _this.sugerDicObj[item.code] = item;
                        number ++;
                    });
                });
            },
            toRing (data) {
                let myChart = echarts.init(document.getElementById('ringBox'));
                let myRingChart = document.getElementById('ringBox');
                let pieBox = document.getElementsByClassName("left")[0];
                myRingChart.style.height = pieBox.offsetHeight+'px';
                myRingChart.style.width = pieBox.offsetWidth+'px';
                var resizeRingChartContainer = function () {
                    myRingChart.style.height = pieBox.offsetHeight+'px';
                    // myRingChart.style.width = pieBox.offsetWidth+'px';
                };
                app.title = '测量优良比';
                let option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}:({d}%)",
                        position:"right"
                    },
                    color:['#3BC083','#E95959','#EDB344'],
                    series: [
                        {
                            name:'测量结果',
                            type:'pie',
                            radius: ['30%', '50%'],
                            center:["50%","50%"],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    formatter:'{c}'+'次',
                                },
                                emphasis: {
                                    show: false,
                                    textStyle: {
                                        fontSize: '12',
                                        fontWeight: 'normal'
                                    }
                                }
                            },
                            labelRing: {
                                normal: {
                                    show: false,
                                    length:10,
                                    length2:20
                                }
                            },
                            data:data
                        }
                    ]
                }
                myChart.setOption(option);
                resizeRingChartContainer();
                window.onresize = function () {
                    //重置容器高宽
                    resizeRingChartContainer();
                    myChart.resize();
                };
            },
            getJudge () {
                let _this = this;
                let data = {dateType:this.dateType}
                if(!!this.deviceImei){
                    data.deviceImei = this.deviceImei;
                }
                reportModel.getSugarTestJudge(data, function(res){
                    let result = res.data.data.judgeMap;
                    _this.sumNormal = result.normalCount;
                    _this.sumHight = result.heightCount;
                    _this.sumLow = result.lowCount;
                    let ringData = [{value:_this.sumNormal,name:"正常"},{value:_this.sumHight,name:"偏高"},{value:_this.sumLow,name:"偏低"}];
                    _this.toRing(ringData);
                })
            },
            clickSugarValue (date, item, index, value) {
                let _this = this;
                // flag为true , 代表同一时段有多条数据 , 有三角标 , 展开一天多条的数据框
                if (isEmptyString(this.$parent.$route.query.isWeekDate) == '' && isEmptyString(value) !== '') { // 通过判断isWeekDate参数是否为空字段来判断是血糖表格页还是周报月报页
                    reportModel.getSugarTestOfOneDay({timeType: index, dateTime:date, pageNo: 1,pageSize: 10000}, function (res) {
                        let sugarList = res.data.data.addressList;
                        if (item.flag) {
                            _this.dataTimeSugarList = sugarList.map((item, index1) => {
                                let tempObj = {};
                                tempObj.value = item.sugar;
                                tempObj.color = item.sugar * 1 > _this.sugerDic[index-1].maxValue * 1 ? '#ec5757' : (item.sugar * 1 < _this.sugerDic[index-1].minValue * 1 ? '#f1c245' : '#4acc87');
                                tempObj.createTime = item.createTime.substring(11, 16);
                                tempObj.testId = item.testId;
                                if (item.deviceImei) {
                                    tempObj.deviceImei = item.deviceImei;
                                }
                                return tempObj;
                            })
                            _this.createCascadeForm = true;
                        } else {
                        _this.$router.push({path: '/sugarReport/addReport/'+sugarList[0].testId,query: {type:!sugarList[0].deviceImei?'self':'device',canEdit:true}});
                        }  
                    })
                    
                }
                
            },
            initData () {
                this.dateType = 5;
                this.deviceImei = "";
                this.mescrollUp.page.num = 1;
                this.getSugarList(this.mescrollUp.page, this.mescroll);
            },
            closeChooseMask () {
                this.createCascadeForm = false;
            },
            showDateTypeSelectBox () {
                this.dateTypeListShow = true;
            },
            showDeviceSelectBox () {
                this.deviceListShow = true;
            },
            selectDateTypeLi (item) { // 点击每一项时间
                this.dateTypeListShow = false;
                this.dataTypeName = item.value;
                this.dateType = item.key;
                this.sugerTestList = [];
                this.mescrollUp.page.num = 1;
                this.scrollMode = "auto";
                this.getSugarList();
                this.getJudge();
            },
            selectDeviceLi (item) { // 点击每一个设备
                this.deviceImeiName = item.value;
                this.deviceImei = item.key;
                this.sugerTestList = [];
                this.startPage = 1;
                this.scrollMode = "auto";
                this.getSugarList();
                this.getJudge();
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
            closeDateTypeMask () {
                this.dateTypeListShow = false;
            },
            closeDeviceMask () {
                this.deviceListShow = false;
            },
            mescrollInit (mescroll) {
                this.mescroll = mescroll;
            }
        },
        beforeMount () {
            this.dateTypeLsit = dateTypeList;
            this.dataTypeName = this.dateTypeLsit[this.defaultDateTypeIndex - 1].value;
            this.getSugerDic();
            this.initDeviceList();
        },
        mounted () {
            this.getJudge();
        },
        components:{
            myTable,
            cascadeForm,
            MescrollVue,
            selectList
        }
    }
</script>
