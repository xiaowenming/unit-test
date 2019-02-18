<template>
  <div class="newMessageDetailPage fullPage">
      <commomHeader :headerTitle="headerTitle" :rightIsShow="rightIsShow " :showArrow="showArrow" :showAdd="showAdd" :rightPath="rightPath" :showText="showText" :rightText="rightText"></commomHeader>
      <writeComment ref="change" :callBack="callBack" v-on:newComment="callBack1"></writeComment>
      <div v-if="!noData" class="newMessageContainer">
        <dynamicDetails v-on:sendModel1="getModel1" :dynamicData="detailData" ref="changeImg"></dynamicDetails>
      </div>
      <div v-if="noData" class="dataDelete">本条数据已被删除</div>
  </div>
</template>

<style lang="less" scoped>
    .newMessageDetailPage{
        background-color: #f4f4f4;
        overflow: scroll;
    }
    .newMessageContainer{
        /* padding-left: 0.2rem; */
        /* padding-right: 0.2rem; */
        padding-top: 0.4rem;
        background-color: #f4f4f4;
    }
    .dataDelete{
        margin-top: 0.5rem;
        font-size: 0.32rem;
    }
</style>

<script>
    import commomHeader from "../commomComponents/header"
    import dynamicDetails from "../commomComponents/dynamicDetails"
    import writeComment from '@/components/commomComponents/writeComment'
    import {tangyouCircleModel, commonApiModel} from '../../api'
    export default {
        name:"guess",
        data (){
            return {
                headerTitle:"动态详情",
                rightIsShow:false,
                showArrow:"",
                showAdd:"",
                showText:"showText",
                rightText:"",
                rightPath:null,
                detailData:"",
                sugarConfig:[],
                noData:false
            }
        },
        methods:{
            getModel1:function(data){
                this.$refs.change.showMask(data)
            },
            getDetailByTestId:function(){
                let data = {testId:this.$route.query.newMessageTestId};
                let _this = this;
                tangyouCircleModel.getSugarTestLsit(data, function(res){
                     if (res.data.data.existsFlag) {
                        let result = res.data.data.data;
                        let dataObj = {};
                        let sugarConfig = _this.$route.query.sugarConfig;
                        let priaseName = "";
                        for(let j = 0; j<(_this.sugarConfig).length;j++){
                            if(result.timeType==_this.sugarConfig[j].timeType){
                                dataObj.timeTypeName = _this.sugarConfig[j].name;
                                if(result.sugar>_this.sugarConfig[j].maxValue){
                                    dataObj.textColor = "colorHight";
                                    dataObj.bgHight = true; 
                                    dataObj.bgBase = false; 
                                    dataObj.bgLow = false; 
                                }else if(result.sugar<_this.sugarConfig[j].minValue){
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
                                break;
                            }
                        }

                        for(let k = 0;k<result.praises.length;k++){
                            if(result.praises[k].customerId==_this.currentUserId){
                                dataObj.ifPraised = true; //该用户是否赞过这条记录
                                _this.$refs.changeImg.praiseImgUrl = "/static/images/tangyou/btn_praised.png";
                            }
                            priaseName = priaseName + result.praises[k].customerName + ",";
                        }
                        dataObj.userNikeName = result.customerNote;
                        dataObj.userId = result.customerId;//血糖记录所有者id
                        dataObj.comments = result.comments;//评论
                        dataObj.createTime = result.createTime.slice(0,16);
                        dataObj.sugarNum = result.sugar;
                        dataObj.hasRemark = result.remark;
                        dataObj.commentSize = result.commentSize;
                        dataObj.praiseSize = result.praiseSize;
                        dataObj.hasPraises = priaseName.length==0?"":priaseName.substring(0,priaseName.length-1);
                        dataObj.dynamicId = result.testId;
                        dataObj.hasIME = result.deviceImei;
                        dataObj.tags = [
                            {typeCode: 'diet', iconUrl: '/static/images/sugarTest/add_but_food_none.png'},
                            {typeCode: 'pharmacy', iconUrl: '/static/images/sugarTest/add_but_mach_none.png'},
                            {typeCode: 'sport', iconUrl: '/static/images/sugarTest/add_but_sprist_none.png'}
                        ];
                        //饮食等其他备注展示
                        if (result.tags&&result.tags.length > 0) {
                            result.tags.forEach(item => {
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
                        if(!!result.location){
                            dataObj.location = result.location;
                        }else{
                            dataObj.location = "";
                        }
                        if(!!result.headimgurl&&result.headimgurl!="undefined"){
                            dataObj.headimgurl = sessionStorage.getItem("imgDomain")+result.headimgurl;
                        }else{
                            dataObj.headimgurl = "/static/images/customer/home_pic_man.png";
                        }
                        if(!!result.diabetesType){
                            dataObj.diabetesType = result.diabetesType;
                        }else{
                            dataObj.diabetesType = "";
                        }
                        _this.detailData = dataObj;
                    } else {
                        _this.noData = true;
                        tangyouCircleModel.setAllReaded(data, function(res){

                        });
                    }
                })

            } ,
            callBack:function(){
                this.getDetailByTestId();
            },
            callBack1:function(data){
                this.detailData.comments.push(data);
                this.dynamicListData.commentSize++;
            },
        },
        beforeMount:function(){
            let _this = this;
            commonApiModel.getSugarDic({}, function(res){
              let result = res.data.data.obj;
              for(let i=0;i<result.length;i++){
                let dataobj = {};
                dataobj.timeType = result[i].timeType;
                dataobj.name = result[i].name;
                dataobj.minValue = result[i].minValue;
                dataobj.maxValue = result[i].maxValue;
                _this.sugarConfig.push(dataobj);
              }
              _this.getDetailByTestId();
            });
        },
        components:{
            commomHeader,
            dynamicDetails,
            writeComment
        }
    }
</script>
