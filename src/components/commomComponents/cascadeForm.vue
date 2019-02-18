<template>
    <div class="cascadeFormPage fullPage">
        <div class="mask fullPage" v-show="showMask">
            <div class="content center-y">
                <div class="formHeader"></div>
                <div class="formBody">
                    <!-- 显示多次测量数据模板 -->
                    <ul class="sugarList">
                        <li class="tal pr" v-for="(item,index) in sugarList" :key="index" @click="toEiditReport(item)">
                            <div class="time fl">{{item.createTime}}</div>
                            <div class="sugar fl colorBase" :style="{color:item.color}"><span class="sugarValue">{{item.value}}</span>mmol</div>
                            <div class="icon fr rightArrow"><img class="center-y" src="/static/images/default/icon_right.png" alt=""></div>
                        </li>
                    </ul>
                </div>
                <!-- sugarTestList显示多次测量数据模板 -->
                <div class="formFooter">
                    <span class="colorBase skip fr" @click="closeMask">知道了</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
    .skip{
        display: block;
        width: 100%;
        height: 100%;
    }
    .cascadeFormPage{
        position: absolute;
        left: 0;
        top: 0;
        overflow: hidden;
        z-index: 499;
    }
    .mask{
        position: absolute;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }
    .content{
        height: 300px;
        width: 75%;
        font-size:22px;
        border-radius: 5px;
        background-color: #fff;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .content .sugarList{
        height: 200px;
        overflow: scroll;
    }
    .content .sugarList li{
        padding-left: 0.3rem;
        font-size: 18px;
    }
    .content .sugarList li .time{
        color: #999;
        margin-right: 0.5rem;
    }
    .formBody{
        height: 200px;
        line-height: 0.6rem;
        overflow: hidden;
    }
    .formBody .sugarList li{
        width: 100%;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #D2D3D5;
        overflow: hidden;
    }
    .formBody li .item{
        min-width: 85%;
        height: 100%;
        font-size: 18px;
        padding-left: 10px;
        overflow-y: hidden;
        // 去除ios光标
        -webkit-user-select:none;
    }
    .formBody li .icon{
        width: 15%;
        height: 100%;
    }
    .formBody li .icon img{
        width: 0.36rem;
        height: 0.576rem;
        left: 0.2rem;
    }
    .formHeader{
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #D2D3D5;
        color: #000;
    }
    .formFooter{
        height: 50px;
        line-height: 50px;
        border-top: 1px solid #D2D3D5;
    }
    .rightArrow{
        position: absolute;
        top: 0;
        right: 0;
        z-index: 10;
        background-color: #fff;
    }
    .sugarValue{
        margin-right: 0.1rem;
    }
</style>

<script>
    export default {
        name:"cascadeForm",
        data (){
            return {
                formTitle: "请选择就诊医院",
                showArrow: true,
                showMask: false,
                listObj: {type:'',list:[]},
                prevShow: false,
                // 上一步科室
                prevDepartmentId: '',
                // 上一步类型
                prevType: '',
                noHospital: false,
                sugarList: [],
                title: '',
                value: [],
            }
        },
        methods: {
            setScrollTop: function () {//获取和还原进度条位置
                let _this = this; 
                var ModalHelper = (function(bodyCls) {
                    var scrollTop, reg;
                    var bodyClassName = "";
                    var bodyEle = document.body;
                    var doc = document.documentElement.scrollTop ? document.documentElement : bodyEle;
                    return {
                        afterOpen: function() {
                            scrollTop = doc.scrollTop;
                
                            if(bodyEle.classList){
                                bodyEle.classList.add(bodyCls)
                            }else{
                                bodyEle.className += " " + bodyCls;
                            }
                
                            bodyEle.style.top = -scrollTop + 'px';
                            bodyClassName = bodyEle.className;
                        },
                        
                        beforeClose: function() {
                            if(bodyEle.classList){
                                bodyEle.classList.remove(bodyCls)
                            }else{
                                reg = new RegExp("\\b" + bodyCls + "\\b", "g", "gi");
                                if(reg.test(bodyClassName)){
                                    bodyClassName = bodyClassName.replace(reg, "");
                                    bodyEle.className = bodyClassName;
                                }
                            }
                            
                            bodyEle.style.top = "";
                            //窗口滚动到父组件传过来的位置
                            window.scrollTo(0, _this._props.scrollValue*1);
                        }
                    };
                })('modal-open');
                return ModalHelper;
            },
            closeMask: function () {
                this.showMask = false;
                this.setScrollTop().beforeClose();
                //通知父组件清除子组件
                this.$emit('closeMask',true);
            },
            // 获取医院
            toEiditReport: function (item) {
                this.$router.push({path: '/sugarReport/addReport/'+item.testId,query: {type:!item.deviceImei?'self':'device',canEdit:true}});
            },
        },
        mounted:function () {
            this.showMask = true;
            //父组件可能有滚动 , 重置一下组件位置
            document.querySelector('.cascadeFormPage').style.top = this._props.scrollValue + 'px';
            this.setScrollTop().afterOpen();
        },
        created:function () {
            if (this._props.formType == 'sugarTestList') {
                this.sugarList = this._props.dataTimeSugarList;
            }
        },
        beforeDestroy:function () {
            this.setScrollTop().beforeClose();
        },
        // scrollValue用于重置组件位置 , formType用于渲染不同组件
        props:['scrollValue', 'formType', 'dataTimeSugarList'],
        directives: {
            focus: {
                update: function (el, {value}) {
                    if (value) {
                        el.focus();
                    }
                }
            }
        }
    }
</script>