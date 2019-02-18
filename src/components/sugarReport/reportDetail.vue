<template>
  <div class="reportDetailPage fullPage">
      <commomHeader :headerTitle="headerTitle" :rightIsShow="rightIsShow " :showArrow="showArrow" :showAdd="showAdd" :rightPath="rightPath" :showText="showText" :rightText="rightText"></commomHeader>
      <div class="greeting">
        <div class="left fl">
            <img :src="headerImg" alt="">
        </div>
		<div class="right tal fr">
            <div class="g-name"><span class="colorBase">{{userName}}</span> ，您好!</div>
		    <div class="g-time">为您呈上{{whatMonth}}，请您查阅~</div>
        </div>
        <div class="table-title">
			<div class="time"><span>{{pageStartTime}}</span> - <span>{{pageEndTime}}</span></div>
			<div class="explain">
				<span>偏高</span>
				<span>正常</span>
				<span>偏低</span>
			</div>
		</div>
	  </div>
      <myTable :sugerTestList="sugerTestList" :toThisDayDetail="toThisDayDetail" :tfootIsShow="tfootIsShow"></myTable>
      <div class="bgBaseGray hei20"></div>
      <div class="sugarAnalyseData">
          <div class="analyseTitle"><span class="title">血糖数据分析</span></div>
          <div class="sugarAnalyseDataContent">
              <div class="describe tal">{{describe}}</div>
              <div class="chartBox">
                  <div id="pieBox" :style="{width: 'calc(320px - 0.2rem)',height:'250px'}"></div>
                  <div id="barBox" :style="{width: 'calc(320px - 0.2rem)',height:'250px'}"></div>
              </div>
          </div>
          <div class="bgBaseGray hei20"></div>
          <div class="analyseTitle"><span class="title">备注数据分析</span></div>
          <div class="healthPlanContent tal describe">{{remarkAnalyse}}</div>
          <div class="bgBaseGray hei20"></div>
          <div class="analyseTitle"><span class="title">健康综合方案</span></div>
          <div class="healthPlanContent tal">
              <div class="describe">
                  <b>监测血糖：</b><span v-html="text1"></span>
              </div>
              <div class="describe">
                  <b>合理饮食：</b><span v-html="text2"></span>
              </div>
              <div class="describe">
                  <b>运动健身：</b><span v-html="text3"></span>
              </div>
          </div>
      </div>
      <div class="summary tal">
		    以上是您本{{summaryKey}}的血糖{{summaryKey}}报，内容仅供参考，不作为诊疗依据。
			愿您能从上面的内容得到帮助，血糖控制得越来越好，生活越来越幸福！
	  </div>
      <healthScience ref="healthScience"></healthScience>
  </div>
</template>

<style lang="less" scoped>
    .reportDetailPage .greeting {
        text-align: center;
        font-size: 0.36rem;
        padding-top: 0.4rem;
        line-height: 0.5rem;
    }
    .greeting .left{
        width: 1.7rem;
        height: 100%;
    }
    .greeting .left img{
        width: 1.1rem;
        height: 1.1rem;
        margin: 0 auto;
    }
    .greeting .right{
        width: 5.8rem;
    }
    .table-title{
        width: 100%;
        height: 0.8rem;
        line-height: 0.8rem;
        background: #f4f4f4;
        font-size: 0.28rem;
        color: #666;
        box-sizing: border-box;
        padding: 0 0.28rem;
        display: flex;
        justify-content: space-between;
    }
    .explain span {
        margin-right: 0.2rem;
    }
    .explain span:before {
        content: '';
        display: inline-block;
        width: 0.18rem;
        height: 0.18rem;
        border-radius: 100%;
        background: #e95959;
        vertical-align: middle;
        margin-right: 0.1rem;
        margin-bottom: 0.1rem;
    }
    .explain span:nth-of-type(2):before {
        background: #3bc083;
    }
    .explain span:nth-of-type(3):before {
        background: #edb344;
    }
    .sugarAnalyseData {
        width: 100%;
        box-sizing: border-box;
    }
     .analyseTitle {
        height: 1rem;
        line-height: 1rem;
        font-size: 0.4rem;
        color: #666;
        text-align: center;
        border-bottom: 1px solid #E9EBEF;
    }
    .analyseTitle .title{
        display: inline-block;
        height: 100%;
        margin: 0 auto;
        border-bottom: 3px solid #61B9FC;
        padding: 0 0.3rem;
    }
    .sugarAnalyseDataContent{
        padding: 0.2rem;
    }
     .describe {
        padding-bottom: 0.4rem;
        font-size: 0.36rem;
        line-height: 0.5rem;
        max-height: 999rem;
        color: #333;
        text-indent: 2em;
    }
    .healthPlanContent {
        padding: 0.2rem;
    }
    .healthPlanContent .describe{
        text-indent: 0;
    }
    .healthPlanContent b {
        display: inline;
        font-weight: bolder;
    }
    .summary{
        padding: 0.2rem 0.2rem 0.45rem;
        font-size: 0.28rem;
        line-height: 0.4rem;
        color: #999;
    }
</style>

<script> 
    import commomHeader from "../commomComponents/header"
    import myTable from '../commomComponents/myTable'
    import healthScience from '../commomComponents/healthScience'
    import {userModel, reportModel} from '../../api'
    let echarts = require('echarts/lib/echarts')
    // 引入折线图组件
    require('echarts/lib/chart/pie')
    require('echarts/lib/chart/bar')
    // 引入提示框和title组件
    require('echarts/lib/component/tooltip')
    require('echarts/lib/component/title')
    require('echarts/lib/component/legend')

    export default {
        name:"reportDetail",
        data (){
            return {
                headerTitle:"",
                rightIsShow:false,
                showArrow:"",
                showAdd:"",
                showText:"showText",
                rightText:"",
                rightPath:"",
                parama:"",
                sugerTestList:[],
                sugerDic:[],
                describe:"",
                text1:"",
                text2:"",
                text3:"",
                whatMonth:"",
                summaryKey:"",
                pageStartTime:"",
                pageEndTime:"",
                userName:"",
                tfootIsShow:false,
                headerImg: '',
                remarkAnalyse: '' // 备注分析
            }
        },
        components:{
            commomHeader,
             myTable,
             healthScience
        },
        methods:{
            getData:function(){
                if(!!this.$route.query.isMonth){
                    this.parama = {
                        year:this.$route.query.year,
                        month:this.$route.query.month
                    };
                    let _this = this;
                    reportModel.getMonthReport(this.parama, function(res){
                        if(!!res.data.data.existsFlag){
                            _this.init(res);
                        }else{
                            _this.$router.replace({path:"/sugarReport/noReport",query:{name:"月",count:res.data.data.count}});
                        }
                    });
                }
                if(!!this.$route.query.isWeek){
                    this.parama = {
                        year:this.$route.query.year,
                        month:this.$route.query.month,
                        week:this.$route.query.week,
                        startDate:this.$route.query.startDate,
                        endDate:this.$route.query.endDate,
                    };
                    let _this = this;
                    reportModel.getWeekReport(this.parama,function(res){
                        if(!!res.data.data.existsFlag){
                            _this.init(res);
                        }else{
                            _this.$router.replace({path:"/sugarReport/noReport",query:{name:"周",count:res.data.data.count}});
                        }
                    });
                }
            },
            init:function(res){
                let _this = this;
                let result = res.data.data.healthMonthReportVo||res.data.data.healthWeekReportVo;
                let sugarLog = JSON.parse(result.sugarLog);
                let indexArr = ["dtime","emptyStomach","afterBreakfast","antePrandium","afterLunch","beforeDinner","afterDinner","atBedtime","beforeDawn"];
                _this.remarkAnalyse = res.data.data.healthAlter;
                //表格数据
                _this.sugerTestList=sugarLog.map(data=>{
                    return indexArr.map(index=>{
                        let value = data[index];
                        let rule;
                        _this.sugerDic.forEach(item=>{
                            if (item.code===index) {
                                rule = item;
                            }
                        });//寻找并匹配时段
                        if(!rule) {
                            return {value:value,color:"#000"};
                        } else {
                            let color = "";
                            if(value.split(",")[0]==0)
                                return {value:'',color:'#fff'}
                            if(value.split(",")[0]>rule.maxValue)
                                color = "#ec5757";
                            else if(value.split(",")[0]<rule.minValue)
                                color = "#f1c245";
                            else
                                    color = "#4acc87";
                            return {value:value.split(",")[0],color:color}
                        }
                    });

                });
                    //数据分析
                _this.describe = result.testAnalysis;
                let data = [
                    {value:result.highCount,name:"偏高"},
                    {value:result.normalCount,name:"正常"},
                    {value:result.lowCount,name:"偏低"},
                    ]
                _this.toPie(data);

                let timeTypeTimes = JSON.parse(result.timeDistribution);
                let dataBar = indexArr.map(index=>timeTypeTimes[index]);
                let data2 = dataBar.slice(1);
                _this.toBar(data2);
                _this.text1 = result.monitorGuide.replace(/#/g,"<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
                _this.text2 = result.eatGuide.replace(/#/g,"<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
                _this.text3 = result.sportGuide.replace(/#/g,"<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
                if(this.$route.query.isWeekDate==1){
                    _this.whatMonth = result.startTime.substring(5,10).replace("-","/")+"~"+result.endTime.substring(5,10).replace("-","/")+"的周报";
                    _this.headerTitle = "第"+result.reportWeek+"周周报";
                    _this.summaryKey = "周";
                    _this.pageStartTime = result.startTime.substring(0,10).replace("-","/");
                    _this.pageEndTime = result.endTime.substring(0,10).replace("-","/");

                }else{
                     _this.whatMonth = result.reportMonth+"月月报";
                     _this.headerTitle = "第"+result.reportMonth+"月月报";
                     _this.summaryKey = "月";
                     _this.pageStartTime = result.startTime.substring(0,10).replace("-","/");
                     _this.pageEndTime = result.endTime.substring(0,10).replace("-","/");

                }

            },
            getSugerDic:function(){
                let _this = this;
                userModel.getUserHealthTarget({}, function(res){
                    _this.sugerDic = res.data.data.obj;
                    _this.getData();
                });
            },
            toPie:function(data){
                let myChart = echarts.init(document.getElementById('pieBox'));
                app.title = '测量优良比';
                let option = {
                    title:{
                        text:"测量次数占比",
                        x:"center",
                        textStyle:{
                            colorl:"#167a72",
                            fontSize:18,
                            fontWeight:"normal"
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    color:['#E95959','#3BC083','#EDB344'],
                    legend: {
                        orient: 'vertical',
                        x: '80%',
                        y:"center",
                        data:[
                            {name:"偏高",icon:"circle"},
                            {name:"正常",icon:"circle"},
                            {name:"偏低",icon:"circle"}
                        ]
                    },
                    series: [
                        {
                            name:'测量结果',
                            type:'pie',
                            radius: ['30%', '50%'],
                            center:["40%","50%"],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: true,
                                    formatter:'{c}'+'次',
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '12',
                                        fontWeight: 'normal'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: true,
                                    length:10,
                                    length2:20
                                }
                            },
                            data:data
                        }
                    ]
                }
                myChart.setOption(option);
            },
            toBar:function(data2){
                let myChart = echarts.init(document.getElementById('barBox'));

                app.title = '时间段检测分布';
                let option = {
                    title:{
                        text:"时间段检测分布",
                        x:"center",
                        textStyle:{
                            colorl:"#167a72",
                            fontSize:18,
                            fontWeight:"normal"
                        }
                    },
                    color: ['#3398DB'],
                    tooltip : {
                        trigger: 'axis',
                        // axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        //     type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        // }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : ['早餐前', '早餐后', '午餐前', '午餐后', '晚餐前', '晚餐后', '睡时','凌晨'],
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLine:{
                                show:false
                            },
                            axisTick:{
                                show:false
                            },
                            axisLabel:{
                                fontSize:12,
                                interval:0,
                                rotate:60
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLine:{
                                show:false
                            },
                            axisLabel:{
                                show:false
                            },
                            axisTick:{
                                show:false
                            },
                            splitLine: {show: false}
                        }
                    ],
                    series : [
                        {
                            name:'时段测量次数',
                            type:'bar',
                            barWidth: '60%',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                    color:"#000"
                                }
                            },
                            data:data2
                        }
                    ]
                };
                myChart.setOption(option);
            },
            toThisDayDetail:function(){
                return;
            },
            getHealthTip () {
                reportModel.getHealthScienceTip({}, (res) => {
                    this.$refs.healthScience.tipsContent = res.data.data.healthMessage.content;
                })
            }
        },
        beforeMount:function(){
            this.userName = sessionStorage.getItem("nickname");
            this.getSugerDic();
            this.headerImg = sessionStorage.getItem('imgDomain') + sessionStorage.getItem('headimgurl');
            this.getHealthTip();
            // this.headerImg = '/static/images/customer/home_pic_man.png';
        }
    }
</script>
