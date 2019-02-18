<template>
    <div class="pop" v-show="isOpen">
        <div class="drapDownSelPop">
            <div class="conPop">
                <textarea id="c_content" rows="3" v-validateEmoji v-model="content"></textarea>
            </div>
            <div class="errorMsg" v-if="showError">{{ErrorContent}}</div>
            <div class="btn">
                <span style="cursor:pointer" @click="cancel"  class="cancelBtn fl">取消</span>
                <button :disabled ="disabled" style="cursor:pointer" @click="ok"  class="confirmBtn bgBase fr special-btn">确定</button>
            </div>
        </div>
	</div>
</template>

<style lang="less" scoped>
    .mask{
        background-color: rgba(0, 0, 0, 0.3);
    }
    .pop {
        display: block;
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 100;
    }

    .drapDownSelPop {
        display: block;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        width: 95%;
        margin-left: 2.5%;
        min-height: 1.1rem;
        background-color: #fff;
        position: absolute;
        /* bottom: 61.8%; */
        top: 2.5rem;
        left: 0;
        border-radius: 0.2rem;
    }

    .drapDownSelPop .btn {
        display: -webkit-box;
        /*布局方式 相当于display:flex*/
        display: -webkit-flex;
        display: -moz-box;
        display: -ms-flexbox;
        display: flex;
        display: box;
        -webkit-box-pack: justify;
        /* justify-content: space-between;*/
        -webkit-justify-content: space-between;
        -ms-flex-pack: justify;
        justify-content: space-between;
        height: 0.8rem;
        line-height: 0.8rem;
        font-size: 0.32rem;
        padding: 0 0.6rem;
        margin-top: 0.1rem;
    }
    .btn span,.btn .special-btn {
        display: block;
        width: 1.5rem;
        height: 0.6rem;
        line-height: 0.6rem;
        border-radius: 0.1rem;
    }
    .btn .special-btn{
      outline: none;
      border: none;
    }
    .btn .confirmBtn{
        color: #fff;
    }
    .btn .cancelBtn{
        border: 1px solid #34b597;
    }
    .drapDownSelPop .conPop {
        font-size: 0.36rem;
        margin-top: 0.3rem;
        height: 2rem;
    }

    .drapDownSelPop .conPop textarea {
        width: 90%;
        border: 1px solid #a9a9a9;
        height: 95%;
        font-size: 0.36rem;
    }

    .drapDownSelPop .errorMsg {
        margin-left: 5%;
        width: 90%;
        font-size: 0.36rem;
        color: red;
    }
</style>

<script>
    import {validateEmoji} from '../../directives'
    import {tangyouCircleModel} from '../../api'
    export default {
        name:"writeComment",
        data () {
            return {
                 modal1: false,
                 content:"",
                 commentData :"",//确定评论要的数据
                 showError:false,
                 ErrorContent:"",
                 isOpen:false,
                 disabled:false
            }
        },
        methods: {
            ok () {
                this.disabled = true;
                if(!!this.content.trim()){
                    let data = {
                        testId:this.commentData.data.dynamicId,
                        content:this.content,
                        customerId:sessionStorage.getItem('cid'),
                        customerName:sessionStorage.getItem("nickname"),
                        replyId:this.commentData.beReplayId,
                        replyName:this.commentData.beReplayName,
                        replyCommentId:this.commentData.beCommentId,
                        sugarTestCustomerId:this.commentData.data.userId
                    };
                    let _this = this;
                    tangyouCircleModel.addComment(data, function(res){
                        _this.modal1 = false;
                        _this.content = "";
                        _this.isOpen = false;
                        data.commentId = res.data.data.commentId;
                        _this.disabled = false;
                        _this.$emit("newComment",data);
                            // _this._props.callBack(data);
                    },function (res) {
                        _this.disabled = false;
                    })
                }else{
                    this.disabled = false;
                    this.showError = true;
                    this.ErrorContent = "评论不能为空!";
                }
            },
            cancel () {
                this.isOpen = false;
                this.disabled = false;
                this.content = "";
                // this.$Message.info('Clicked cancel');
            },
            showMask:function(dataInfo){
                this.isOpen = true;
                this.commentData = dataInfo;
                this.modal1 = true;
                this.showError = false;
            }
        },
        directives:{
            focus:{
                inserted:function(el){
                    el.focus();
                }

            },
            validateEmoji
        }
    }
</script>
