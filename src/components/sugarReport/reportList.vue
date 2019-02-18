<template>
  <div class="reportListPage">
      <div class="reportHeader pr">
          <img class="reportLogo center-y" :src="userHeadImg" alt="">
          <div class="reportInfo center-y tal">
              <p class="userName">{{userNickName}}</p>
              <p class="reportTimes">累计总测量{{testTimes}}次</p>
          </div>
      </div>
      <div class="reportContent bgWhite">
          <div class="yearList" v-for="(item,index) in dataList">
                <div class="yearBox">
                    <div class="yearFlag fl bgBase">{{item.year}}年</div>
                </div>

                <div class="month tal clearfix" v-for="(value,index1) in item.months">
                    <div class="monthBox">
                        <div class="monthFlag fl bgBase tac">{{value.month}}月</div>
                    </div>
                    <div class="mothReportBox fr">
                        <div class="monthReportTitle pr" @click="checkMonthReport(item.year,value.month,index1)">
                            <i class="arrowIcon center-y"></i>
                            <p class="listTitle">本月月报</p>
                            <p class="listContent" v-if="currentYear==item.year&&currentMonth<=value.month">本月月报将在{{(value.month*1==12?1:value.month+1)}}月1号推送,敬请期待</p>
                            <!-- 不是当前年份,或者是当前年份但是不是当前月份月报都是可以查看的 -->                            
                            <p class="listContent" v-show="(currentYear!=item.year||index1!=0)&&value.count==null&&currentMonth>value.month">点击查看本月月报</p>
                            <p class="listContent" v-show="(currentYear!=item.year||index1!=0)&&value.count!=null&&currentMonth>value.month">本月测量血糖{{value.count}}次</p>
                        </div>
                        <div class="weekReport pr" v-for = "(v,index2) in value.weeks" @click="checkWeekReport(item.year,value.month,v.week,v.startDate,v.endDate,index1,index2)">
                            <i class="arrowIcon center-y"></i>
                            <span class="weekNumber center-y tac">{{v.week}}</span>
                            <p class="listTitle">第{{v.week}}周血糖周报({{v.startDate.substring(5,10)}}~{{v.endDate.substring(5,10)}})</p>
                            <p class="listContent" v-if="index2==0&&index1==0&&currentYear==item.year">本周周报将在下周一推送,敬请期待</p>
                            <!-- 不是当前年份,或者是当前年份但是不是当前月份的当前周的周报都是可以查看的 -->
                            <p class="listContent" v-show="(currentYear!=item.year||index1!=0||index2!=0)&&v.count==null">点击查看本周周报</p>
                            <p class="listContent" v-show="(currentYear!=item.year||index1!=0||index2!=0)&&v.count!=null">本周测量血糖{{v.count}}次</p>

                        </div>
                    </div>

                </div>
          </div>
      </div>
  </div>
</template>

<style lang="less" scoped>
    .reportListPage{
        width: 100%;
    }
    .reportHeader{
        width: 100%;
        height: 1.6rem;
        border-bottom: 1px solid #e0e0e0;
    }
    .reportLogo{
        width: 1.06rem;
        height: 1.06rem;
        left:0.6rem;
        border-radius: 50%;
    }
    .reportInfo{
        left:2.26rem;
        height: 1rem;
    }
    .reportInfo .userName{
        font-size: 0.44rem;
    }
    .reportInfo .reportTimes{
        font-size: 0.32rem;
    }
    .reportContent{
        padding: 0.3rem 0.2rem 1rem;
    }
    .yearBox{
        width: 100%;
        height: 0.6rem;
        box-sizing: content-box;
    }
    .yearFlag,
    .monthFlag
    {
        width: 1.68rem;
        height: 0.6rem;
        line-height: 0.6rem;
        border-radius: 0.6rem;
        color:#fff;
        font-size: 0.36rem;
    }
    .reportContent .month{
        width: 100%;
    }
    .reportContent .monthBox{
        width: 100%;
        height: 0.6rem;
        margin-top: 0.3rem;
        box-sizing: content-box;
    }
    .reportContent .monthFlag{
        width: 1.28rem;
    }
    .reportContent .mothReportBox{
        width: 80%;
    }
    .mothReportBox .monthReportTitle,
    .mothReportBox .weekReport{
        padding-bottom: 0.3rem;
        border-bottom: 1px solid #e0e0e0;
    }
    .mothReportBox .listTitle{
        height: 0.6rem;
        line-height: 0.6rem;
        font-size: 0.36rem;
        color: #111;
    }
    .mothReportBox .listContent{
        font-size: 0.28rem;
        color: #999;
    }
    .mothReportBox .arrowIcon{
        left:95%;
        width: 0.16rem;
        height: 0.28rem;
        background: url("/static/images/default/icon_right.png") no-repeat center/0.16rem 0.28rem;
    }
    .mothReportBox .weekNumber{
        width: .6rem;
        height: .6rem;
        left: -1.2rem;
        line-height: .6rem;
        font-size: .36rem;
        background-color: #e0e0e0;
        border-radius: 50%;
    }
</style>

<script>
    import {userModel, reportModel} from '../../api'
    export default {
        name:"reportList",
        data (){
            return {
                userNickName:"",
                testTimes:"",//测量次数
                dataList:[],
                nextMonth:1,
                currentYear:"",
                currentMonth:"",
                userHeadImg:""
            }
        },
        beforeMount:function(){
           this.getUserInfo();
           this.init();
        },
        methods:{
            init:function(){
                let _this = this;
                reportModel.getReportList({},function(res){
                    let result = res.data.data.data;
                    _this.dataList= result.map(v => ({
                        year:v[Object.keys(v)[0]],
                        months:v[Object.keys(v)[1]].map(v=>({
                            count:v[Object.keys(v)[2]]==null?null:v[Object.keys(v)[2]],
                            month:v[Object.keys(v)[0]],
                            weeks:v[Object.keys(v)[1]].map((v,i,arr)=>({
                                week:arr.length-i,
                                startDate:v.startDate,
                                endDate:v.endDate,
                                count:v.count==null?null:v.count
                            }))
                        }))
                    }));
                    let thisMoth = (res.data.data.data[0].monthInfos[0]).month;
                    _this.currentYear = res.data.data.currentTime.substring(0,4);
                    _this.currentMonth = res.data.data.currentTime.substring(5,7)*1;
                    _this.testTimes = res.data.data.totalCount;
                })
            },
            checkMonthReport:function(year,month,index){
                sessionStorage.setItem("currentComponentsIndex",2);
                if((this.currentYear==year&&month<this.currentMonth)||(this.currentYear!=year)){
                    this.$router.push({path:'/sugarReport/reportDetail',query:{isMonth:true,year:year,month:month,isWeekDate:0}});
                }
            },
            checkWeekReport:function(year,month,week,startDate,endDate,index1,index2){
                sessionStorage.setItem("currentComponentsIndex",2);
                if(this.currentYear!=year||index1!=0||index2!=0){
                    this.$router.push({path:'/sugarReport/reportDetail',query:{
                        isWeek:true,
                        year:year,
                        month:month,
                        week:week,
                        startDate:startDate,
                        endDate:endDate,
                        isWeekDate:1}
                        });
                }
            },
            getUserInfo () {
                this.userNickName = sessionStorage.getItem("nickname");
                userModel.getUserInfo({ratio:"yes"}, (res) => {
                    let result = res.data.data.customerVo;
                    if(!!result.headimgurl&&result.headimgurl!="undefined"){
                    this.userHeadImg = sessionStorage.getItem("imgDomain") + result.headimgurl;  
                    }else if(result.sex=='2'){
                    this.userHeadImg = "/static/images/customer/home_pic_woman.png";
                    }else{
                    this.userHeadImg = "/static/images/customer/home_pic_man.png";
                    }
                });
            }
        }
    }


</script>
