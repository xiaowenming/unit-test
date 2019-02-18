<template>
  <div>
        <div class="mains">
          <input type="number" placeholder="请输入亲友手机号" class="ipts" maxlength="11">
          <div class="search" @click="search()">搜索</div>
          <div class="line"></div>
          <p>请确认您的亲友关注了{{isAicaresHealth?'掌护健康':'小糖医'}}，并完成了账号认证</p>
          <div class="result" v-if="isShow">{{result}}</div>
        <div class="item" v-if="person">
            <img :src="headImg" alt="" class="logos">
            <ol>
                <li>{{names}}</li>
                <li>{{phone}}</li>
            </ol>
            <div class="add" @click="add" v-if="status == 0">
                <span>添加</span>
            </div>
            <div class="add" @click="add" v-if="status == 1">
                <span>已发送</span>
            </div>
            <div class="add noUse" v-if="status == 2">
                <span>已添加</span>
            </div>
        </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
    .item{
        width: 100%;
        height: 1.2rem;
        border-bottom:1px solid #ccc ;
        position: relative;
    }

    .item .logos{
        position: absolute;
        left:0.2rem;
        top: 0.2rem;
        width: 0.83rem;
        height:0.83rem;
    }

    .item ol{
        position: absolute;
        left:1.17rem;
        top: 0.2rem;
    }

    .item ol li{
        text-align: left;
        font-size: 0.3rem;
    }

    .item .add{
        vertical-align: middle;
        background-color: #34b597;
        border-radius: 5px;
        color: #FFF;
        width: 20%;
        text-align: center;
        display: inline-block;
        padding: 0.1rem 0;
        /* height: 0.54rem; */
        line-height: 0.54rem;
        margin-left: 0.2rem;
        position: absolute;
        right:0.2rem;
        top: 0.4rem;
    }

    .item .add span{
        color: white;
    }

    .result{
        color: red;
        text-align: center;
        font-size: 0.28rem;
        height: 0.5rem;
        line-height: 0.5rem;
    }
    .item .noUse{
        background-color: #eee;
    }

    span{
        margin: 0;
    }
    *{  
        margin: 0;
        padding: 0;
        font-size: 0.36rem;
    }

    .mains{
        padding:0.7rem 0.4rem;
    }

    .ipts{
        box-sizing: border-box;
        display: inline-block;
        width: 5rem;
        height: 0.84rem;
        padding: 6px 12px;
        font-size: 16px;
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
         vertical-align: middle;
    }

    .search{
        vertical-align: middle;
        background-color: #34b597;
        border-radius: 5px;
        color: #FFF;
        width: 20%;
        text-align: center;
        display: inline-block;
        height: 0.84rem;
        line-height: 0.84rem;
        margin-left: 0.2rem; 
    }

    .line{
        width: 100%;
        height: 1px;
        margin-top: 0.8rem;
        background: #cccccc;
    }

    p{
        color: #cecece;
        font-size: 14px;
        margin-top: 10px;
        text-align: left;
    }
</style>

<script>
    import {validatePhoneNumber} from '../../utils/validate'
    import {eventBus} from '../../utils/eventBus'
    import {friendModel} from '../../api'
    export default {
        name:"",
        data (){
            return {
                result:"",
                names:"",
                phone:"",
                person:false,
                customerId:"",
                status:"",
                isShow:false,
                imgDomain:"",
                headImg:""
            }
        },
        methods:{
            search(){
                var that = this;
                if(!(validatePhoneNumber(document.getElementsByClassName("ipts")[0].value))){
                    that.isShow = true;
                    that.person = false;
                    that.result="请输入正确电话号码";
                }else{
                    that.isShow = false;
                     let data = {phone:document.getElementsByClassName("ipts")[0].value};
                friendModel.searchFriendsByPhoneNumber(data, function(res){
                    if(res.status == 200){
                        var datas = res.data.data;
                        if(datas){
                            if(datas.isSelfFlag){
                                that.isShow = true;
                                that.person = false;
                                that.result="不能添加自己为亲友";
                            }else if(!datas.existsFlag){
                                that.isShow = true;
                                that.person = false;
                                that.result="用户不存在";
                            }else{
                                that.isShow = false;
                                if(datas.customerVo){
                                    that.person = true;
                                    that.names = datas.customerVo.nickname;
                                    that.phone = datas.customerVo.phone;
                                    that.customerId = datas.customerVo.customerId;
                                    that.headImg = !!datas.customerVo.headimgurl? that.imgDomain + datas.customerVo.headimgurl:(datas.customerVo.sex=="2"?"/static/images/customer/home_pic_woman.png":"/static/images/customer/home_pic_man.png");
                                    //已添加、已发送、添加
                                    if(datas.auditStatus == 1){
                                        that.status = 2;
                                    }else if(datas.auditStatus == 0){
                                        that.status = 1;
                                    }else{
                                        that.status = 0;
                                    }
                                }else{
                                    that.person = false;
                                }
                            }
                        }
                    }
                });
                }
    
            },
            add(){
                var that = this;
                let data = {customerId:that.customerId};
                friendModel.addFriends(data, function(res){
                    if(res.status == 200){
                            if(!res.data.meta.code){
                                eventBus.code = res.data.meta.code;
                                // 对象
                                that.$router.push({ path: '/family' })
                            }else{
                                that.result="添加失败";
                            }
                        }
                })
            }
        },
        beforeMount:function(){
            this.imgDomain = sessionStorage.getItem("imgDomain");
        }
    }
</script>