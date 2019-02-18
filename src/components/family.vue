<template>
    <div class="main fontSize32" :style="{'-webkit-overflow-scrolling': scrollMode}">
        <div class="fir w100 pr">
            <p @cpck="mAtt()" class="title colorWhite"><span class="bgBase">我的亲友</span></p>
            <router-link :to='{path:"search/search"}'>
                <img src="/static/images/follower/btn_add.png" alt="" class="add">
            </router-link>
        </div>
        <!--我关注的-->
        <mescroll-vue ref="mescroll" class="containerScroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
            <ul class="myAtt fullPage" v-show="attention == 1">
                <li class="item w100 pr" v-for="(item,index) in Marr" :key="index">
                    <div class="left clearfix fl" @click="toFriendReportList(item.customerId,item.customerNote)">
                        <img :src="!!item.headimgurl?imgDomain+item.headimgurl:(item.sex=='2'?'/static/images/customer/home_pic_woman.png':'/static/images/customer/home_pic_man.png')" alt="" class="logos">
                        <div class="content tal">
                            <span>{{item.customerNote}}</span>
                            <img class="messageIcon" :src="item.isReceive==1?'/static/images/follower/VOLUMEUP.png':'/static/images/follower/VOLUMEOFF.png'" alt="">
                            <ol class="w100">
                                <li class="fl">偏高{{item.height}}</li>
                                <li class="fl">正常{{item.normal}}</li>
                                <li class="fl">偏低{{item.low}}</li>
                            </ol> 
                        </div>
                    </div>
                    <div class="right fr">
                        <img src="/static/images/follower/btn_more.png" alt="" class="more" @click="Ymores(index,item)">
                    </div>
                    <!--更多弹出框-->
                    <div class="show" v-show="beClick == index">
                        <ul>
                            <li @click="showEditMask()">修改备注</li>
                            <li @click="isReceive()">{{receiveStatu==1?"关闭提醒":"开启提醒"}}</li>
                            <li @click="showDelMask()">删除亲友</li>
                        </ul>
                    </div>
                </li>
            </ul>
        </mescroll-vue>
        <!--您还没有关注亲友-->
        <div class="iNoAtt" v-if="iAtt && attention == 1">
            <img src="/static/images/follower/icon_none.png" alt="">
            <p>您还没有关注亲友</p>
        </div>
        <!--弹出我关注的备注框-->
        <my-mask v-if="maskShow1" :scrollValue="pageScroll">
            <div class="remark" slot="footer">
                <ul>
                    <li>备注（必填，最多10个字符）</li>
                    <li><input type="text" maxlength="10" :value="names" v-validateEmoji class="changes"/></li>
                    <li>
                        <span @click="maskShow1 = false" class="cancel">取消</span>
                        <span @click="comfirmEdit" class="sure">确定</span>
                    </li>
                </ul>
            </div>
        </my-mask>
        <!--弹出是否删除框-->
        <my-mask v-if="maskShow" :scrollValue="pageScroll">
            <div class="delect" slot="footer">
                <ul>
                    <li>确定删除亲友<b></b>吗？</li>
                    <li>
                        <span @click="closeMask" class="cancel">取消</span>
                        <span class="sure" @click="comfirmDelete">确定</span>
                    </li>
                </ul>
            </div>
        </my-mask>
    </div>
</template>

<style lang="less" scoped>
    .main{
        .fir{
            height: 0.95rem;
            line-height: 0.95rem;
            border-bottom: 1px solid #ccc;
            padding-top: 0.2rem;
            .title{
                span{
                    display: block;
                    width: 3rem;
                    height: 0.55rem;
                    line-height: 0.55rem;
                    margin: 0 auto;
                    border-radius: 0.275rem;
                }
            }
            .add{
                width: 0.47rem;
                position: absolute;
                right:0.23rem;
                top:0.23rem;
            }
        }
        .containerScroll{
            top: 0.95rem;
        }
        .myAtt{
            overflow: scroll;
            .item{
                height: 1.2rem;
                border-bottom:1px solid #ccc ;
                .left{
                    width: 80%;
                    height: 100%;
                    .logos{
                        position: absolute;
                        left:0.2rem;
                        top: 0.2rem;
                        width: 0.83rem;
                        height:0.83rem;
                        border-radius: 50%;
                    }
                    .content{
                        height: 100%;
                        padding-top: 0.2rem;
                        position: absolute;
                        left: 1.17rem;
                        top:0;
                        .messageIcon{
                            width: 0.2rem;
                            height: 0.24rem;
                            display: inline-block;
                        }
                        ol li{
                            margin-right: 0.27rem;
                        }
                        ol li:nth-child(1){
                            color:darkred;
                        }
                        ol li:nth-child(2){
                            color:darkgreen;
                        }
                        ol li:nth-child(3){
                            color:darkkhaki;
                        }
                    }
                }
                .right{
                    width: 20%;
                    .more{
                        position: absolute;
                        right:0.2rem;
                        top:0.45rem;
                        width:0.76rem;
                        height:0.33rem;
                    }
                }
                .show{
                    width:2.38rem;
                    height:2.5rem;
                    background: url(../../static/images/follower/friend_more_bg.png) no-repeat;
                    background-size: 100%;
                    position: absolute;
                    right:0.1rem;
                    top: 0.7rem;
                    z-index: 1000;
                }

                .show ul{
                    width: 100%;
                    height: 1.86rem;
                    position: absolute;
                    top: 0.32rem;
                }

                .show ul li{
                    width: 100%;
                    height:33.3333%;
                    line-height:0.62rem;
                }
            }
        }
        .iNoAtt{
            position: absolute;
            top:50%;
            left:50%;
            width: 2.8rem;
            height: 2.5rem;
            margin-left: -1.4rem;
            margin-top: -2.3rem;
        
        }

        .iNoAtt img{
            width: 2rem;
            height: 2rem;
            margin-left: 0.4rem;
        }
        .remark{
            font-size: 18px;
            padding: 20px;
            box-sizing: border-box;
            background: white;
            width: 95%;
            height: 4rem;
            margin: 0 2.5%;
            border-radius: 10px; 
            position: absolute;
            left:0;
            top: 4rem;
        }

        .remark ul li{
            text-align: left;
            display: block;
            margin-bottom: 20px;
        }    

        .remark ul li input{
            display: block;
            width: 100%;
            height: 30px;
            padding: 6px 12px;
            font-size: 14px;
            line-height: 1.428571429;
            color: #555555;
            vertical-align: middle;
            background-color: #ffffff;
            border: 1px solid #cccccc;
            border-radius: 4px;
            -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
            box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
            -webkit-transition: border-color ease-in-out .15s, box-shadow
            ease-in-out .15s;
            transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
        }

        .remark ul li span{
            display: inline-block;
            height: 100%;
            line-height: 45px;
            text-align: center;
            border-radius: 8px;
            width: 45%;
            text-shadow: 0 /*{a-page-shadow-x}*/ 0px /*{a-page-shadow-y}*/ 0
        /*{a-page-shadow-radius}*/ #ffffff /*{a-page-shadow-color}*/;
        }
        .cancel{
            border: 1px solid #34B597;
            background-color: #FFF;
            color: #111111;
            float: left;
        }

        .sure{
            border: 1px solid #FFF;
            background-color: #34B597;
            color: #FFF;
            float: right;
        }
        .delect{
            font-size: 18px;
            padding: 20px;
            box-sizing: border-box;
            background: white;
            width: 95%;
            height: 2.7rem;
            margin: 0 2.5%;
            border-radius: 10px; 
            position: absolute;
            left:0;
            top: 4rem;
        }

        .delect ul li{
            width: 100%;
            height: 45px;
            display: block;
        }

        .delect ul li span{
            display: inline-block;
            height: 100%;
            line-height: 45px;
            text-align: center;
            border-radius: 8px;
            width: 45%;
            text-shadow: 0 /*{a-page-shadow-x}*/ 0px /*{a-page-shadow-y}*/ 0
        /*{a-page-shadow-radius}*/ #ffffff /*{a-page-shadow-color}*/;
        }
    }
</style>

<script>
    import { Toast } from 'mint-ui';
    import {validateEmoji} from '../directives'
    import {friendModel} from '../api'
    import MescrollVue from 'mescroll.js/mescroll.vue'
    import myMask from '../components/commomComponents/myMask'
    export default {
        name:"guess",
        data() {
            return {
                Marr:[],
                arrM:"",
                YisMore:false,
                MisMore:false,
                isRem:false,
                isRem_1:false,
                isDel:false,
                names:"",
                names_1:"",
                attention:1,
                iAtt:"",
                isClass:1,
                mId:"",//customerId
                receiveStatu:0,
                selected:"",//当前选中哪个好友的消息提醒
                mAttion:"",
                attionMe:"",
                attMe:"",
                startPage:1,
                allLoaded: false,
                scrollMode:"touch",
                imgDomain: "",//微信头像基础地址
                mescroll: null,
                mescrollDown: {
                    use: false
                },
                mescrollUp: { // 上拉加载的配置.
                    callback: this.getIFocus,
                    page: {
                        num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                        size: 10 //每页数据条数,默认10
                    },
                    noMoreSize: 5,
                    isLock: false
                },
                beClick: null, // 当前点击弹出的关闭提醒或者删除好友的选择框
                maskShow: false,
                pageScroll: 0,
                maskShow1: false
            }
        },
        methods:{
            //添加亲友
            //我关注的
            Ymores(index,item){
                this.YisMore = ! this.YisMore;
                //设置弹出框显示
                if (this.beClick == index) {
                    this.beClick = null;
                } else {
                    this.beClick = index;
                }
                //输入款呈现不同的名字
                this.names = item.customerNote;
                // 每个人的ID
                this.mId = item.id;
                //是否接收此人模板推送 , 1为接收 , 0为不接收
                this.receiveStatu = item.isReceive;
                this.selected = index;
            },
            showEditMask () {
                this.YisMore = false;
                this.maskShow1 = true;
                this.pageScroll = document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop;
            },
            showDelMask () {
                this.YisMore = false;
                this.maskShow = true;
                this.pageScroll = document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop;
            },
            //确定修改我关注的人备注
            comfirmEdit () {
                if(!!(document.getElementsByClassName("changes")[0].value.trim())){
                    let data = {
                        id: this.mId,
                        customerNote: document.getElementsByClassName("changes")[0].value};
                    //修改我关注的 名字
                    friendModel.editFocusStatus(data, (res) => {
                        if(res.status == 200){
                            // 修改备注成功回调
                            this.Marr = [];
                            this.beClick = null;
                            this.maskShow1 = false;
                            this.mescrollUp.page.num = 1;
                            this.getIFocus(this.mescrollUp.page, this.mescroll);
                        }
                    })
                }else{
                    this.showToast("备注不能为空");
                }
                
            },
            // 确定删除亲友
            comfirmDelete () {
                let data = {id: this.mId};
                friendModel.deleteFriends(data, (res) => {
                    if(res.status == 200){
                        // 删除成功回调
                        this.Marr = [];
                        this.maskShow = false;
                        this.beClick = null;
                        this.mescrollUp.page.num = 1;
                        this.getIFocus(this.mescrollUp.page, this.mescroll);
                    }
                })
            },
            //点击我关注的
            mAtt(){
                this.isClass = true;
                this.attention = 1;
                this.YisMore = false;
            },
            //点击关注我的
            attM(){
                this.isClass = false;
                this.attention = 2;
                this.MisMore = false;
            },
            toFriendReportList:function(id,name){
                this.$router.push({path:"/search/friendReportList",query:{id:id,name:name}});
            },
            getIFocus (page, mescroll) {
                friendModel.getIFocusList({pageNo:page.num ,pageSize: page.size}, (res) => {
                    if(res.data.data.pageNo >= res.data.data.pageCount){
                        // this.allLoaded = true;
                        this.mescrollUp.isLock = true;
                    } else {
                        this.mescrollUp.isLock = false;
                    }
                    var data = res.data.data.data;
                    this.imgDomain = res.data.data.imgDomain;
                    for (let i = 0; i < data.length; i++) {
                        this.Marr.push(data[i]);
                    }
                    //如果我没有关注亲友
                    if (data.length == 0) {
                            this.iAtt = true;
                    } else {
                            this.iAtt = false;
                    }
                    this.$nextTick(() => {
                        mescroll.endSuccess(data.length);
                    });
                }, err => {
                    mescroll.endErr();
                })
            },
            //点击关闭提醒
            isReceive:function(){
                let _this = this;
                let data = {id:this.mId};
                data.isReceive=this.receiveStatu==0?1:0;
                friendModel.editFocusStatus(data,function(res){
                    _this.receiveStatu=_this.receiveStatu==0?1:0;
                    _this.Marr[_this.selected].isReceive = _this.receiveStatu;
                    setTimeout(function(){
                        _this.YisMore = false;
                    },50)
                })
            },
            mescrollInit (mescroll) {
                this.mescroll = mescroll;
            },
            closeMask () {
                this.maskShow = false;
            }
        },
        components:{
            MescrollVue,
            myMask
        },
        beforeMount:function(){
            // 我关注的
            this.startPage =1;
        },
        directives: {
            validateEmoji
        }
    }
</script>