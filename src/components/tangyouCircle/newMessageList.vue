<template>
  <div class="newMessagePage fullPage">
      <commomHeader :headerTitle="headerTitle" :rightIsShow="rightIsShow " :showArrow="showArrow" :showAdd="showAdd" :rightPath="rightPath" :showText="showText" :rightText="rightText"></commomHeader>
      <div class="unread-message-list">
        <ul>
            <li class="message-list tal" v-for="(item,index) in unreadMessageList">
                <router-link :to='{path:"/tangyouCircle/newMessageDetail",query:{newMessageTestId:item.testId,sugarConfig:sugarConfig}}'><span class="action-name colorBase">{{item.customerName}}</span><span class="action">{{item.commentType==0?"赞":(item.commentType==1?"评论":"回复")}}</span>了你的动态 , 点击查看
                </router-link>
            </li>
        </ul>
    </div>
    <div v-show="unreadMessageList.length==0" class="noNewMessage">没有未读消息了</div>
  </div>
</template>

<style lang="less" scoped>
    .unread-message-list {
        font-size: 0.32rem;
    }
    .unread-message-list ul .message-list {
        padding-left: 0.35rem;
        height: 1.2rem;
        line-height: 1.2rem;
        border-bottom: 0.01rem solid #e7e7e7;
    }
    .unread-message-list li a {
        display: block;
        height: 100%;
        color: #000;
        cursor: default;
        text-decoration: none;
    }
    .noNewMessage{
        padding-top: 0.5rem;
        font-size: 0.36rem;
    }
</style>

<script>
    import commomHeader from "../commomComponents/header"
    import {tangyouCircleModel} from '../../api'
    export default {
        name:"newMessageList",
        data (){
            return {
                headerTitle:"糖友圈",
                rightIsShow:false,
                showArrow:"",
                showAdd:"",
                showText:"showText",
                rightText:"",
                rightPath:null,
                unreadMessageList:[],
                sugarConfig:{}
            }
        },
        components:{
            commomHeader
        },
        created:function () {
            let _this = this;
            tangyouCircleModel.getUnreadCommentList({}, function(res){
                _this.unreadMessageList = res.data.data.data;
            });
        },
        methods:{
        }
    }
</script>
