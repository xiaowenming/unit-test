<template>
  <div class="dynamicDetailsPage">
      <div class="dynamicItem">
          <!-- 详情 -->
          <div class="data-info clearfix">
              <div class="info-left fl">
                  <img :src="dynamicData.headimgurl" alt="">
              </div>
              <div class="info-right fl">
                  <div class="top tal">
                      <span class="nickName">{{dynamicData.userNikeName | filterUserName}}</span>
                  </div>
                  <div class="bottom tal">
                      <img class="typeIcon" :src="dynamicData.diabetesType | filterDiabetesType" alt="">
                      <img class="dataTypeIcon" v-if="!!dynamicData.hasIME" src="/static/images/sugarTestReport/icon_device.png">
                      <span :class="{createTime:true,noDevice:!dynamicData.hasIME}">{{dynamicData.createTime}}</span>
                  </div>
              </div>
          </div>
          <!-- 备注 -->
          <div class="remark tal clearfix" v-show="!!dynamicData.hasRemark">
            <span class="remarkContent fl">{{dynamicData.hasRemark}}</span>
          </div>
          <!-- 血糖值 -->
          <div class="suger pr">
              <div :class="{left:true,fl:true,bgBase:dynamicData.bgBase,bgHight:dynamicData.bgHight,bgLow:dynamicData.bgLow}">
                <span class="time-type">{{dynamicData.timeTypeName}}</span>
              </div>
              <div class="right fl tal">
                  <span :class="dynamicData.textColor">{{dynamicData.sugarNum}}</span>
                  <span class="unit">mmol</span>
              </div>
              <div class="remarkIcons fl">
                  <div v-for="(item, index) in dynamicData.tags" :key="index"  class="eachItem diet fl tal">
                      <img class="fl" :src="item.iconUrl" alt="">
                      <span>{{item.text}}</span>
                  </div>
                  <!-- <div class="eachItem medication fl tal">
                      <img class="fl" src="/static/images/sugarTest/add_but_mach_press.png" alt="">
                      <span>胰岛素</span>
                  </div>
                  <div class="eachItem sports fl tal">
                      <img class="fl" src="/static/images/sugarTest/add_but_sprist_press.png" alt="">
                      <span>低强度</span>
                  </div> -->
              </div>
              <router-link class="colorBase btnEdit" :to="{path:'../sugarReport/addReport/'+dynamicData.dynamicId,query:{type:!dynamicData.hasIME?'self':'device',canEdit:true}}" v-show="dynamicData.userId==userId"><span class="editText">编辑</span></router-link>
          </div>
          <!-- 评论点赞按钮 -->
          <div class="dynamicButtons">
              <div class="cureentPosition fl" v-show="!!dynamicData.location">
                  <img class="fl" src="/static/images/tangyou/tyq_icon_adress.png" alt="">
                  <span class="positions">{{!!dynamicData.location?(dynamicData.location.length>12?dynamicData.location.slice(0,12)+"...":dynamicData.location):""}}</span>
              </div>
              <div class="buttons fr">
                  <a href="javascript:void(0)"><img src="/static/images/tangyou/btn_comment.png" class="btnComment fr" @click="showMask('',dynamicData)"></a>
                  <button class="like" :disabled="isLike" @click="toPraise"><img :src="praiseImgUrl" class="btnPraise fr"></button>
              </div>
          </div>
          <!-- 分割线 -->
          <div class="sperator" v-show="dynamicData.commentSize!=0||dynamicData.praiseSize!=0"></div>
          <!-- 评论 -->
          <div class="praise tal" v-show="!!dynamicData.hasPraises">
              <img src="/static/images/tangyou/icon_praise.png" class="praiseIcon fl"><span class="relayName" style="color: #34b597;">{{dynamicData.hasPraises}}</span>
          </div>
          <!-- 点赞 -->
          <div class="comment">
              <ul class="showComments tal">
                  <li v-for="(item,index) in dynamicData.comments"  @click="showMask(item.customerId,dynamicData,item.commentId,item.customerName,item.customerId)">
                      <span class="replayName colorBase">{{item.customerName}}</span>
                      <span class="replay" v-show="!!item.replyName">回复</span>
                      <span class="beReplayedName colorBase" v-show="!!item.replyName">{{item.replyName}}</span>
                      <span class="content"><i>:</i>{{item.content}}</span>
                  </li>
              </ul>
          </div>
      </div>
  </div>
</template>

<style lang="less" scoped>
    .dynamicItem{
        width: 100%;
        padding: 0 0.25rem;
        //原版本样式
        // border-radius: 0.2rem;
        background-color: #fff;
        font-size: 0.32rem;
        margin-bottom: 0.4rem;
        overflow: hidden;
    }
    .data-info{
        height: 1.32rem;
        padding-top: 0.3rem;
    }
    .data-info .info-left img{
        width: 0.9rem;
        height: 0.9rem;
        border-radius: 50%;
        margin-right: 0.2rem;
    }
    .data-info .info-right{
        width: 70%;
        height: 1.32rem;
    }
    .data-info .info-right .top{
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.36rem;
        color: #111111;
    }
    .data-info .info-right .bottom{
        padding-top: 0.16rem;
        height: 0.5rem;
    }
    .data-info .info-right .bottom .typeIcon{
        display: inline-block;
        width: 0.58rem;
        height: 0.3rem;
    }
    .data-info .info-right .dataTypeIcon {
        display: inline-block;
        height: 0.28rem;
        width: 0.24rem;
        margin-left: 0.1rem;
    }
    .data-info .info-right .createTime {
        font-size: 0.28rem;
        color: #666;
    }
    .data-info .info-right .noDevice{
        padding-left: 0.34rem;
    }
    .dynamicItem .remark{
        width: 100%;
    }
    .dynamicItem .remark .remarkContent{
        // text-indent: 2em;
        width: 100%;
        font-size: 0.36rem;
        // display: block;
    }
    .suger{
        width: 100%;
        height: 1.42rem;
        margin-top: 0.3rem;
    }
    .suger .left {
        width: 20%;
        height: 1.42rem;
        line-height: 1.42rem;
        font-size: 0.36rem;
        color: #fff;
    }
    .suger .right{
        width: 80%;
        height: 0.8rem;
        line-height: 0.8rem;
        padding-left: 0.6rem;
        background-color: #f4f4f4; 
    }
    .suger .right span:nth-child(1){
        font-size: 0.48rem;
    }
    .suger .right .unit{
        font-size: 0.24rem;
        color: #666;
    }
    .suger .remarkIcons {
        height: 0.62rem;
        width: 80%;
        background-color: #f4f4f4;
    }
    .suger .remarkIcons .eachItem {
        width: 33.3333%;
        font-size: 0.28rem;
        height: 0.62rem;
        line-height: 0.62rem;
    }
    .remarkIcons .eachItem img {
        width: 0.34rem;
        height: 0.34rem;
        margin: 0.14rem 0.15rem 0;
    }
    .suger .btnEdit{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }
    .suger .editText{
        height: 0.4rem;
        line-height: 0.4rem;
        position: absolute;
        right: 0.2rem;
        top:0.2rem;
        // transform: translateY(-50%);
    }
    .dynamicItem .dynamicButtons{
        width: 100%;
        height: 0.88rem;
        margin-top: 0.35rem;        
      .like{
        float: right;
        border: 0;
        background: white;
      }
    }
    .dynamicButtons .cureentPosition img{
        margin: 0;
    }
    .dynamicButtons .positions{
        font-size: 0.32rem;
        color: #666;
    }
    .dynamicButtons img{
        width: 0.48rem;
        height: 0.48rem;
        margin-left: 0.4rem;
    }
    .sperator{
        width: 150%;
        border: 0;
        height: 0.02rem;
        border-top: 1px solid #cecece;
        margin-bottom: 0.3rem;
        margin-left: -1rem;
    }
    .praise{
        margin-bottom: 0.2rem;
    }
    .praise .praiseIcon{
        width: 0.48rem;
        height: 0.48rem;
        margin-right: 0.2rem;
    }
    .showComments li{
        padding-bottom: 0.2rem;
    }
    .content i{
        margin-right: 0.05rem;
        font-weight: 700;
    }
</style>

<script>
    import {tangyouCircleModel} from '../../api'
    export default {
        name:"dynamicDetails",
        data (){
            return {
                praiseImgUrl:this._props.dynamicData.ifPraised==true?"/static/images/tangyou/btn_praised.png":"/static/images/tangyou/btn_praise.png",
                userId:sessionStorage.getItem('cid'),
                newMessageType:true,
                isLike:false
            }
        },
        methods:{
            //给弹出框传数据
            showMask:function(id,data,beCommentId,beReplayName,beReplayId){
                let dataInfo = {};
                dataInfo.data = data;
                dataInfo.beCommentId = beCommentId;
                dataInfo.beReplayName = beReplayName;
                dataInfo.beReplayId = beReplayId;
                if(id!=sessionStorage.getItem('cid')){
                    this.$emit('sendModel1',dataInfo);
                }else{
                    return;
                }
            },
            toPraise:function(){
                this.isLike = true;
                let detailData = this._props.dynamicData ;
                let data = {
                    testId:detailData.dynamicId,
                    customerId:sessionStorage.getItem("cid"),
                    customerName:sessionStorage.getItem("nickname"),
                    sugarTestCustomerId:detailData.userId
                };
                let _this = this;
                if(!detailData.ifPraised){
                    tangyouCircleModel.addPraise(data, function(res){
                        _this.isLike = false;
                        _this.praiseImgUrl = "/static/images/tangyou/btn_praised.png";
                        detailData.ifPraised = true;
                        _this.dynamicData.hasPraises =_this.dynamicData.hasPraises.length==0?sessionStorage.getItem("nickname") :_this.dynamicData.hasPraises + "," +sessionStorage.getItem("nickname");
                        _this.dynamicData.praiseSize ++;
                   });
                }else {
                  _this.isLike = false;
                }

            }
        },
        props:['dynamicData'],
        filters:{
            filterUserName:function(value){
                value = value&&value.length>10?value.slice(0,10)+"...":value;
                return value;
            },
            //原版本代码
            // filterImgUrl:function(value){
            //     let url = "";
            //     url = !value?"/static/images/sugarTestReport/icon_enter.png":"/static/images/sugarTestReport/icon_device.png";
            //     return url;
            // },
            //糖尿病类型图片显示过滤器
            filterDiabetesType:function(value){
                let url = "";
                if(!!value*1){
                    url = "/static/images/tangyou/sign_" + value + ".png"   
                }else{
                    url = "/static/images/tangyou/sign_5.png"
                }                
                return url;
            }
        },
        beforeMount:function(){
            this.newMessageType = this.$route.query.newMessageIsShow;
            if(this.newMessageType){
                this.$parent.$parent.newMessageIsShow = false;
            }else{
                this.$parent.$parent.newMessageIsShow = true;
            }
        }
    }
</script>


