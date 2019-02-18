<template>
  <div class="tangyouCirclePage fullPage pr" :style="{'-webkit-overflow-scrolling': scrollMode}">
        <commomHeader :headerTitle="headerTitle" :rightIsShow="rightIsShow " :showArrow="showArrow" :showAdd="showAdd" :rightPath="rightPath" :showText="showText" :rightText="rightText"></commomHeader>
        <writeComment ref="change" v-on:newComment="callBack"></writeComment>
        <!-- <Modal v-model="modal1" title="Common Modal dialog box title" @on-ok="ok" @on-cancel="cancel">
            <textarea  class="commentContent" rows="3"></textarea>
        </Modal> -->
        <mescroll-vue class="containerScroll" ref="mescroll" :up="mescrollUp" @init="mescrollInit">
            <div class="container" id="tangyouCircleDiv">
                <div class="message-box" v-if="newMessageIsShow&&unreadMessageList.length*1 > 0">
                <!-- <div class="message-box"> -->
                    <div class="new-message" >
                        <router-link :to="{path:'/tangyouCircle/newMessageList'}" ><span class="unread-message-num">{{unreadMessageCount}}</span>条新动态</router-link>
                    </div>
                </div>
                <dynamicDetails ref="changeImg" v-on:sendModel1="getModel1" v-for="(item,index) in dynamicListData" :dynamicData="item" :key="index"></dynamicDetails>
            </div>
            <div class="prompt center-y tac" v-show="promptIsShow">暂无新动态</div>
        </mescroll-vue>
  </div>
</template>

<style>
    /* 弹出框部分 */
    .commentContent{
        width: 100%;
    }
    .ivu-modal-header,
    .ivu-modal-close
    {
        display: none;
    }
    .ivu-modal-footer{
        display: flex;
        justify-content: space-between;
        border: none;
        padding-top: 0;
    }
    .ivu-modal-footer button:nth-child(2){
        background-color: transparent;
        color: #000;
        border: none;
    }
</style>

<style lang="less" scoped>
    .tangyouCirclePage{
        overflow: scroll;
        background-color: #f4f4f4;
        -webkit-overflow-scrolling: touch;
    }
    .message-box {
        height: 0.94rem;
        font-size: 0.32rem;
        background-color: #f4f4f4;
    }
    .message-box a {
        display: block;
        margin: 0.2rem auto 0;
        width: 2.24rem;
        height: 0.64rem;
        border-radius: 0.32rem;
        line-height: 0.64rem;
        text-align: center;
        background-color: #494949;
        color: #fff;
    }
    .container {
        color: #111;
        /* 原版本样式 */
        /* padding-left: 0.2rem;
        padding-right: 0.2rem; */
        padding-top: 0.4rem;
        height: 100%;
    }
    .prompt{
        width:100%;
        font-size:0.40rem;
    }
</style>

<script>
    import commomHeader from "../commomComponents/header"
    import dynamicDetails from "../commomComponents/dynamicDetails"
    import axios from "axios"
    import qs from "qs"
    import writeComment from '@/components/commomComponents/writeComment'
    import {userModel, commonApiModel, reportModel, tangyouCircleModel} from '../../api'
    import MescrollVue from 'mescroll.js/mescroll.vue'
    export default {
        name:"tangyouCircle",
        data (){
            return {
                headerTitle:"糖友圈",
                rightIsShow:false,
                showArrow:"",
                showAdd:"",
                showText:"",
                rightText:"",
                rightPath:null,
                dynamicListData:[],
                unreadMessageList:[],
                unreadMessageCount:"",
                allLoaded: false,
                scrollMode:"touch",
                startPageNo:1,
                dateTime:"",//从血糖数据表格传过来的参数,查询当天详情,
                sugarConfig:[],
                newMessageIsShow:false,
                promptIsShow:false,
                mescroll: null,
                mescrollUp: { // 上拉加载的配置.
                    callback: this.initData,
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
            getModel1:function(data){
                this.$refs.change.showMask(data);
            },
            initData (page, mescroll) {
                let data = {pageNo: this.mescrollUp.page.num, pageSize: this.mescrollUp.page.size};
                this.dateTime =  this.$route.query.dateTime;
                if (this.mescrollUp.page.num === 1) {
                    this.dynamicListData = [];
                }
                if(!!this.dateTime){
                    this.headerTitle = this.dateTime;
                    data.dateTime = this.dateTime;
                    reportModel.getSugarTestOfOneDay(data, (res) => {
                        if(res.data.data.pageNo >= res.data.data.pageCount){
                            this.mescrollUp.isLock = true;
                        } else {
                            this.mescrollUp.isLock = false;
                        }
                        let result = res.data.data.addressList;
                        this.handleData(result);
                        this.$nextTick(() => {
                            this.mescroll.endSuccess(result.length);
                        });
                    }, err => {
                        this.mescroll.endErr();
                    })
                }else{
                    tangyouCircleModel.getMyDynamic(data, (res) => {
                        if(res.data.data.data.length==0){
                            this.promptIsShow =true;
                        }else{
                            if(res.data.data.pageNo >= res.data.data.pageCount){
                                this.mescrollUp.isLock = true;
                            } else {
                                this.mescrollUp.isLock = false;
                            }
                            let result = res.data.data.data;
                            this.handleData(result);
                            this.$nextTick(() => {
                                this.mescroll.endSuccess(result.length);
                            });
                        }
                    }, err => {
                        this.mescroll.endErr();
                    })
                }
            },
            getNewMessage:function(){
                let _this = this;
                tangyouCircleModel.getUnreadCommentCount({}, function(res){
                    _this.unreadMessageCount = res.data.data.data;
                })
                tangyouCircleModel.getUnreadCommentList({}, function(res){
                    _this.unreadMessageList = res.data.data.data;
                });
            },
            callBack:function(data){
                for(let i=0;i<this.dynamicListData.length;i++){
                    if(this.dynamicListData[i].dynamicId == data.testId){
                        this.dynamicListData[i].commentSize++;
                        this.dynamicListData[i].comments.push(data);
                    }
                }

            },
            handleData:function(result){
                for(let i = 0;i<result.length;i++){
                    let priaseName = "";
                    let dataObj = {};
                    //文字颜色
                    let that=this;
                    for(let j = 0; j<(that.sugarConfig).length;j++){
                        if(result[i].timeType==that.sugarConfig[j].timeType){
                            dataObj.timeTypeName = that.sugarConfig[j].name;
                            //2018-01-17
                            if(result[i].sugar>that.sugarConfig[j].maxValue){
                                dataObj.textColor = "colorHight";
                                dataObj.bgHight = true; 
                                dataObj.bgBase = false; 
                                dataObj.bgLow = false; 
                            }else if(result[i].sugar<that.sugarConfig[j].minValue){
                                dataObj.textColor = "colorLow";
                                dataObj.bgHight = false; 
                                dataObj.bgBase = false; 
                                dataObj.bgLow = true; 
                            }else{
                                dataObj.textColor = "colorBase";
                                dataObj.bgHight = false; 
                                dataObj.bgBase = true; 
                                dataObj.bgLow = false; 
                            }
                            // dataObj.textColor = result[i].sugar>that.sugarConfig[j].maxValue?"colorHight":(result[i].sugar<that.sugarConfig[j].minValue?"colorLow":"colorBase");
                            break;
                        }
                    }
                    //是否赞过
                    for(let k = 0;k<result[i].praises.length;k++){
                        if(result[i].praises[k].customerId==sessionStorage.getItem('cid')){
                            dataObj.ifPraised = true; //该用户是否赞过这条记录
                        }
                        
                        priaseName = priaseName + result[i].praises[k].customerName + ",";

                    }
                    dataObj.userNikeName = result[i].customerNote;//血糖记录所有者昵称
                    dataObj.userId = result[i].customerId;//血糖记录所有者id
                    dataObj.comments = result[i].comments;//评论
                    dataObj.createTime = result[i].createTime.slice(2,16);
                    dataObj.sugarNum = result[i].sugar;
                    dataObj.timeType = result[i].timeType;
                    dataObj.commentSize = result[i].commentSize;
                    dataObj.praiseSize = result[i].praiseSize;
                    dataObj.hasRemark = result[i].remark;
                    dataObj.hasPraises = priaseName.length==0?"":priaseName.substring(0,priaseName.length-1);
                    dataObj.dynamicId = result[i].testId;
                    dataObj.hasIME = result[i].deviceImei;
                    dataObj.tags = [
                        {typeCode: 'diet', iconUrl: '/static/images/sugarTest/add_but_food_none.png'},
                        {typeCode: 'pharmacy', iconUrl: '/static/images/sugarTest/add_but_mach_none.png'},
                        {typeCode: 'sport', iconUrl: '/static/images/sugarTest/add_but_sprist_none.png'}
                    ];
                    //饮食等其他备注展示
                    if (result[i].tags&&result[i].tags.length > 0) {
                        result[i].tags.forEach(item => {
                            if (item.typeCode == 'diet') {
                                dataObj.tags[0].text = item.itemValue;
                                dataObj.tags[0].iconUrl = '/static/images/sugarTest/add_but_food_press.png';
                            } else if (item.typeCode == 'pharmacy') {
                                dataObj.tags[1].text = item.itemValue;
                                dataObj.tags[1].iconUrl = '/static/images/sugarTest/add_but_mach_press.png';
                            } else{
                                dataObj.tags[2].text = item.itemValue;
                                dataObj.tags[2].iconUrl = '/static/images/sugarTest/add_but_sprist_press.png';
                            }
                        });
                    }
                    //2018-01-17
                    if(!!result[i].location){
                        dataObj.location = result[i].location;    
                    }else{
                        dataObj.location = "";
                    }
                    if(!!result[i].headimgurl){
                        dataObj.headimgurl = sessionStorage.getItem("imgDomain")+result[i].headimgurl;
                    }else{
                        dataObj.headimgurl = "/static/images/customer/home_pic_man.png";
                    }
                    if(!!result[i].diabetesType){
                        dataObj.diabetesType = result[i].diabetesType;
                    }else{
                        dataObj.diabetesType = "";
                    }
                    this.dynamicListData.push(dataObj);
                }
                //血糖数据列表设置成页面减去头部的高度
                let headerBox = document.querySelector(".commomHeaderPage");
                let containerBox = document.querySelector(".container");
                containerBox.style.minHeight = window.innerHeight - headerBox.offsetHeight +'px'; 
            },
            mescrollInit (mescroll) {
                this.mescroll = mescroll;
            }
        },
        created:function(){
            console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
            if(!!this.$route.query.dateTime){
                this.newMessageIsShow = false;
            }else{
                this.newMessageIsShow = true;
            }
        },
        beforeMount:function(){
            let _this = this;
            console.log('========================================================');
            // console.log(_this);
            console.log(_this.$route);
            if(!_this.$route.query.dateTime){
                commonApiModel.getSugarDic({}, function(res){
                    let result = res.data.data.obj;
                    let data = {pageNo:_this.startPageNo,pageSize:5};
                    for(let i=0;i<result.length;i++){
                        let dataobj = {};
                        dataobj.timeType = result[i].timeType;
                        dataobj.name = result[i].name;
                        dataobj.minValue = result[i].minValue;
                        dataobj.maxValue = result[i].maxValue;
                        _this.sugarConfig.push(dataobj);
                    }
                });
            }else{
                userModel.getUserHealthTarget({}, function(res){
                    let result = res.data.data.obj;
                    let data = {pageNo:_this.startPageNo,pageSize:5};
                    for(let i=0;i<result.length;i++){
                        let dataobj = {};
                        dataobj.timeType = result[i].timeType;
                        dataobj.name = result[i].name;
                        dataobj.minValue = result[i].minValue;
                        dataobj.maxValue = result[i].maxValue;
                        _this.sugarConfig.push(dataobj);
                    }
                });
            }
            this.getNewMessage();
            this.newMessageIsShow = true;
        },
        components:{
            commomHeader,
            dynamicDetails,
            writeComment,
            MescrollVue
        }
    }
</script>
