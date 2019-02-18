<template>
    <div class="sugarReportPage pr fullPage bgWhite">
        <div class="topNav bgWhite w100">
            <p class="left w50 fl"><span :class="{current: topNavIndex == 0}" @click="changeDisabete">血糖</span></p>
            <p class="right w50 fr"><span :class="{current: topNavIndex == 1}" @click="changeHypertension">血压</span></p>
        </div>
        <div class="hiddenBlock w100"></div>
        <div class="block hei20"></div>
        <div class="tabNav tac">
            <div class="reportClass pr" v-for="(item, index) in tabIndexList"  @click="changeTab(index)" :key="index">
                <img class="tabIcon" :src="item.imgUrl" alt=""><span :class="{isCurrent:bottomNavIndex == index}">{{item.text}}</span>
            </div>
        </div>
        <report-table v-show="currentComponentsIndex == 0"></report-table>
        <report-chart v-show="currentComponentsIndex == 1"></report-chart>
        <report-list v-show="currentComponentsIndex == 2"></report-list>
        <blood-pressure-table v-show="currentComponentsIndex == 3"></blood-pressure-table>
        <blood-pressure-chart v-show="currentComponentsIndex == 4"></blood-pressure-chart>
    </div>
</template>

<style lang="less" scoped>
    .sugarReportPage{
        z-index: 3;
    }
    .topNav{
        height: 1.02rem;
        line-height: 1.02rem;
        font-size: 0.34rem;
        z-index: 100;
        position: fixed;
        left: 0;
        top: 0;
        span{
            display: block;
            width: 50%;
            margin: 0 auto;
            height: 1rem;
            box-sizing: border-box;
        }
        .current{
            border-bottom: 2px solid #00c2b1;
            color: #00c2b1;
        }
    }
    .hiddenBlock{
        height: 1.02rem;
    }
    .block{
        background-color: #F4F4F4;
    }
    .tabNav{
        width: 100%;
        height: 1rem;
        border-top: 1px solid #e0e0e0;
        font-size: 0.34rem;
        display: flex;
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: #fff;
        z-index: 100;
    }
    .reportClass{
        flex: 1;
    }
    .reportClass span{
        padding-left: 20%;
    }
    .reportClass .tabIcon{
        width: 0.5rem;
        height: 0.5rem;
        position: absolute;
        left: 35%;
        top: 50%;
        z-index: 10;
        transform: translate(-50%,-50%);
    }
    .tabNav span{
        width: 100%;
        height: 100%;
        line-height: 1rem;
        position: absolute;
        left: 0;
        top: 0;
        color:#000;
    }
    .tabNav span.isCurrent{
        background-color: #e9f7f6;
        color: #34b597;
    }
</style>

<script>
    const [REPORTTABLECODE, REPORTCHARTCODE, REPORTLISTCODE, HYPERREPORTTABLECODE, HYPERCHARTCODE] = [0, 1, 2, 3, 4]
    import reportTable from './sugarReport/reportTable'
    import reportChart from './sugarReport/reportChart'
    import reportList from './sugarReport/reportList'
    import bloodPressureTable from './bloodPressure/bloodPressureTable'
    import bloodPressureChart from './bloodPressure/bloodPressureChart'
    import {deviceModel, userModel} from '../api'
    export default {
        name:"guess",
        data (){
            return {
                tabIndexList:[
                    {text:"数据",imgUrl:"/static/images/sugarTestReport/history_icon_shuju_normal.png"},
                    {text:"趋势",imgUrl:"/static/images/sugarTestReport/history_icon_qushi_normal.png"},
                    {text:"报告",imgUrl:"/static/images/sugarTestReport/history_icon_baogao_normal.png"}],
                dataType : 0,// 哪个时间范围
                dataTypeShow:false,
                dataTypeName : "",
                dataTypeList : [],// 时间范围集合,
                timeType : 1,// 时段
                timeTypeShow:false,
                timeTypeName : "",
                timeTypeList : [],//时段集合
                deviceImei : "", // 设备IMEI
                deviceImeiShow:false,
                deviceImeiName : "",
                deviceImeiList : [], //设备集合
                arrowBottomIsShow:false,
                topNavIndex: 0,
                bottomNavIndex: 0,
                componentsList: ['reportTable', 'reportChart', 'reportList', 'bloodPressureTable', 'bloodPressureChart'],
                currentComponentsIndex: 0
            }
        },
        methods:{
            // 切换底部菜单栏
            changeTab (index) {
                sessionStorage.removeItem("currentComponentsIndex");
                this.bottomNavIndex = index;
                this.tabIndexList[0].imgUrl = "/static/images/sugarTestReport/history_icon_shuju_normal.png";
                this.tabIndexList[1].imgUrl = "/static/images/sugarTestReport/history_icon_qushi_normal.png";
                this.tabIndexList[2].imgUrl = "/static/images/sugarTestReport/history_icon_baogao_normal.png";
                if (index == 0) {
                    if (this.topNavIndex == 0 ) {
                        this.setCurrentComponent(REPORTTABLECODE);
                    }
                    if (this.topNavIndex == 1 ) {
                        this.setCurrentComponent(HYPERREPORTTABLECODE);
                    }
                    this.tabIndexList[index].imgUrl = "/static/images/sugarTestReport/history_icon_shuju_press.png";
                }
                if (index == 1) {
                    if (this.topNavIndex == 0) {
                        this.setCurrentComponent(REPORTCHARTCODE);
                    }
                    if (this.topNavIndex == 1) {
                        this.setCurrentComponent(HYPERCHARTCODE);
                    }
                    this.tabIndexList[index].imgUrl = "/static/images/sugarTestReport/history_icon_qushi_press.png";
                }
                if (index == 2) {
                    this.setCurrentComponent(REPORTLISTCODE);
                    this.tabIndexList[index].imgUrl = "/static/images/sugarTestReport/history_icon_baogao_press.png";
                }
                this.setBlockWidth();
            },
            setCurrentComponent (value) { // 显示各个组件并缓存
                this.currentComponentsIndex = value;
            },
            // 点击顶部tab栏
            changeDisabete () {
                this.topNavIndex = 0;
                if (this.bottomNavIndex == 0) {
                    this.setCurrentComponent(REPORTTABLECODE);
                }
                if (this.bottomNavIndex == 1) {
                    this.setCurrentComponent(REPORTCHARTCODE);
                }
                if (this.bottomNavIndex == 2) {
                    this.setCurrentComponent(REPORTLISTCODE);
                }
                this.setBlockWidth();
            },
            changeHypertension () {
                this.topNavIndex = 1;
                if (this.bottomNavIndex == 0) {
                    this.setCurrentComponent(HYPERREPORTTABLECODE);
                }
                if (this.bottomNavIndex == 1) {
                    this.setCurrentComponent(HYPERCHARTCODE);
                }
                if (this.bottomNavIndex == 2) {
                    this.setCurrentComponent(REPORTLISTCODE);
                }
                this.setBlockWidth();
            },
            setBlockWidth () {
                let block = document.getElementsByClassName('block')[0];
                let windowWidth = window.screen.width;
                if (this.currentComponentsIndex == HYPERCHARTCODE) {
                    let longWidth = document.getElementById('myHyperReportChart');
                    block.style.width = longWidth.style.width;
                } else {
                    block.style.width = windowWidth + 'px';
                }
            }
        },
        mounted:function(){
            this.tabIndexList[0].imgUrl = "/static/images/sugarTestReport/history_icon_shuju_press.png";
            let currentComponentsIndex = sessionStorage.getItem("currentComponentsIndex");
            if(currentComponentsIndex){
                if (currentComponentsIndex == '3') {
                    this.topNavIndex = 1;
                    this.changeTab(0);
                } else if (currentComponentsIndex == '2') {
                    this.changeTab(currentComponentsIndex);
                } else if (currentComponentsIndex == '4') {
                    this.changeTab(1);
                }
            }
        },
        computed: {
            currentComponents () {
                return this.componentsList[this.currentComponentsIndex];
            }
        },
        components:{
            reportTable,
            reportChart,
            reportList,
            bloodPressureTable,
            bloodPressureChart
        }
    }
</script>


