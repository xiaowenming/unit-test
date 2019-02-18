<template>
  <div class="friendReportListPage fullPage" :style="{'-webkit-overflow-scrolling': scrollMode}" @scroll="centerScroll">
      <commomHeader :headerTitle="headerTitle"></commomHeader>
        <mescroll-vue class="containerScroll" ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
            <div class="center">
                <div class="statistics clearfix">
                    <div class="low fl">
                        <p class="count">{{highReport}}</p>
                        <span>偏高</span>
                    </div>
                    <div class="normal fl">
                        <p class="count">{{normalReport}}</p>
                        <span>正常</span>
                    </div>
                    <div class="high fl">
                        <p class="count">{{lowReport}}</p>
                        <span>偏低</span>
                    </div>
                </div>
                    <div class="box">
                        <div class="everyDayReport" v-for="(item,index) in reportList">
                            <div class="day tal">{{item.time}}</div>
                            <ul class="clearfix">
                                <li v-for="(value,index) in item.everyDay">
                                    <div class="list-left fl tal">
                                        <span :class="{sugar:true,colorBase:value.status=='正常',colorHight:value.status=='偏高',colorLow:value.status=='偏低'}">{{value.sugarValue}}</span>
                                        <span>mmol/L</span>
                                        <span class="status">{{value.status}}</span>
                                    </div>
                                    <div class="list-right fr tal">
                                        <span class="timeType">{{value.timeType}}</span>
                                        <span class="time">{{value.time}}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
            </div>
        </mescroll-vue>
      <div class="footer">
       		<ul>
         		<li :class="{selected:itemIsSelected==index}" v-for="(item,index) in deteList" @click="changeClass(index)">
           			<span>{{item}}</span>
             	</li>
           	</ul>
            <p v-if="andMore" style="width: 100%;line-height: 0.9rem;">没有更多了</p>
      </div>
  </div>
</template>

<style lang="less" scoped>
    .friendReportListPage{
        overflow: scroll;
        background-color: #eee;
        padding-bottom: 1rem;
    }
    .friendReportListPage::-webkit-scrollbar{
        display: none;
    }
    .containerScroll{
        bottom: 2rem;
    }
    .center{
        width: 100%;
        height: auto;
        background-color: #fff;
        // padding-bottom: 1rem;
    }
    .statistics{
        width: 80%;
        margin: 0 auto;
    }
    .statistics>div{
        width: 33.333%;
    }
    .low .count{
        color: #ed4949;
    }
    .normal .count{
        color: #34b597;
    }
    .high .count{
        color: #e69b25;
    }
    .count{
        height: 1.2rem;
        font-size: 0.72rem;
        line-height: 1.2rem;
    }
    .statistics span{
        display: block;
        height: 0.72rem;
        font-weight: 900;
        font-size: 0.40rem;
    }
    .footer {
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        position: fixed;
        width: 100%;
        background-color: #FFF;
        bottom: 0px;
        border-top: 1px solid #cecece;
    }
    .footer ul {
        width: 90%;
        height: 100%;
        margin: 0 auto;
        font-size: 0.4rem;
    }
    .footer ul .selected {
        background-color: #34b597;
        color: #FFF;
        border-radius: 0.35rem;
    }
    .footer ul li {
        float: left;
        width: 33.3%;
        height: 0.7rem;
        line-height: 0.7rem;
        color: #34b597;
        list-style: none;
        margin-top: 0.15rem;
    }
    .day{
        background-color: #eee;
        padding-left: 0.2rem;
        height: 0.64rem;
        line-height: 0.64rem;
        font-size: 0.36rem;
    }
    .everyDayReport ul{
        background-color: #fff;
    }
    .everyDayReport ul li{
        height: 0.96rem;
        font-size: 0.32rem;
        line-height: 0.9rem;
        color: #8e8e8e;
        border-bottom: 1px solid #cecece;
    }
    .list-left{
        width: 70%;
    }
    .list-right{
        width: 30%;
    }
    .sugar{
        display: inline-block;
        box-sizing: content-box;
        width: 1rem;
        padding:0 0.4rem;
        font-size: 0.4rem;
    }
    .status{
        padding-left: 0.3rem;
    }
    .box{
        width: 100%;
        background-color: #eee;
    }
    .everyDayReport:last-child{
        margin-bottom: 2rem;
    }
</style>

<script>
    import commomHeader from "../commomComponents/header"
    import {friendModel} from '../../api'
    import MescrollVue from 'mescroll.js/mescroll.vue'
    export default {
        name:"firendReportList",
        data (){
            return {
                headerTitle:"",
                rightPath:"/point/pointRule",
                deteList:["最近一周","最近一个月","最近三个月"],
                itemIsSelected:0,
                dateType:1,
                startPageNo:1,
                normalReport:"",
                lowReport:"",
                highReport:"",
                sugarConfig:"",
                reportList:[],
                timeTypeList:["早餐前","早餐后","午餐前","午餐后","晚餐前","晚餐后","睡前","凌晨"],
                allLoaded: false,
                scrollMode:"auto",
                friendId:"",
                andMore:false,
                mescroll: null,
                mescrollDown: {
                    use: false
                },
                mescrollUp: { // 上拉加载的配置.
                    callback: this.init,
                    page: {
                        num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                        size: 5 //每页数据条数,默认10
                    },
                    noMoreSize: 5,
                    isLock: false
                }
            }
        },
        methods:{
            init (page, mescroll) {
                let _this = this;
                this.scrollMode = 'auto';
                friendModel.getFriendsSugarData({
                        customerId: this.friendId,
                        dateType: this.dateType,
                        pageNo: page ? page.num : this.mescrollUp.page.num,
                        pageSize: page ? page.size : this.mescrollUp.page.size
                    }, (res) => {
                        this.scrollMode = 'touch';
                        if (res.data.data.pageNo >= res.data.data.pageCount) {
                            this.mescrollUp.isLock = true;
                        } else {
                            this.mescrollUp.isLock = false;
                        }
                        let result = res.data.data.data;
                        for(let i = 0;i<result.length;i++){
                            let data = {};
                            data.time = result[i].dateTime;
                            data.everyDay = result[i].sugarTestMaps.map(item=>{
                                let tempObj = {};
                                tempObj.time = item.createTime.substring(11,16);
                                tempObj.status = item.pj=="height"?"偏高":(item.pj=="low"?"偏低":"正常");
                                tempObj.sugarValue = item.sugar;
                                tempObj.timeType = this.timeTypeList[item.timeType*1-1];
                                return tempObj;
                            })
                            this.reportList.push(data);
                        }
                        this.$nextTick(() => {
                            this.mescroll.endSuccess(result.length);
                        });
                }, err => {
                    this.mescroll.endErr();
                });
            },
            getStatics:function(){
                let _this = this;
                friendModel.getFriendSugarDataStatics({customerId:this.friendId,dateType:this.dateType}, function(res){
                    let result = res.data.data;
                    _this.lowReport = result.low;
                    _this.highReport = result.height;
                    _this.normalReport = result.normal;
                });
            },
            changeClass:function(index){
                this.mescrollUp.isLock = false;
                this.itemIsSelected = index;
                this.dateType = index+1;
                this.reportList = [];
                this.mescrollUp.page.num = 1;
                this.getStatics();
                this.init(this.mescrollUp.page, this.mescroll);
            },
            centerScroll:function(){
                  _this.scrollMode = 'touch';
            },
            mescrollInit (mescroll) {
                this.mescroll = mescroll;
            }
        },
        beforeMount:function(){
            this.friendId = this.$route.query.id;
            this.headerTitle = this.$route.query.name;
            this.getStatics();
        },
        components:{
            commomHeader,
            MescrollVue
        }
    }
</script>
