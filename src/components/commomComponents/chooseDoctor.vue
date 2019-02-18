<template>
    <div class="chooseDoctorPage fullPage">
        <div class="mask fullPage" v-show="showMask">
            <div class="content center-y">
                <div class="formHeader dtb pr">
                    <div class="cell">{{formTitle}}</div>
                    <!-- 只有小糖医才可跳过 -->
                    <div v-show="!isAicaresHealth" class="closeForm" @click="closeMask">X</div>
                </div>
                <div class="formBody">
                    <div class="inputBox dtb pr">
                        <input class="cell" type="text" v-on:input="serchDoctorInput" @blur="serchDoctorBlur" v-focus="isFocus" v-model="serchName" placeholder="请输入姓名/手机号"/>
                        <div @click="clearInputContent" class="cleaInputContent">X</div>
                    </div>
                    <div v-show="chooseAreaIsShow" class="chooseArea dtb">
                        <group class="cell" style="height:100%;width:75%;">
                            <x-address :title="title" @on-hide="logHide" @on-show="logShow" v-model="value" raw-value :list="addressData" placeholder="请选择所在地区/城市" value-text-align="left">
                                <template slot="title" slot-scope="props">
                                <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
                                </span>
                                </template>
                            </x-address>
                        </group>
                        <div class="allHostital colorBase cell" @click="getAllHospital">全部医院</div>
                    </div>
                    <div v-show="chooseAreaIsShow" class="hospitalListBox pr">
                        <div v-if="noHospital" class="nodate center-y">暂无医院数据</div>
                        <ul>
                            <li class="tal pr dtb" v-for="(item, index) in listObj.list" :key="index"  @click="getNextList(listObj.type, item)">
                                <div v-show="!!item.name" readonly type="text" class="item cell">{{item.name}}</div>
                                <div v-show="!!item.nickname" readonly type="text" class="item cell">{{item.nickname + ' | ' + item.roleName}}</div>
                                <div v-show="showArrow" class="icon cell rightArrow"><img class="center-y" src="/static/images/default/icon_right.png" alt=""></div>
                            </li>
                        </ul>
                    </div>
                    <ul v-show="!chooseAreaIsShow" class="doctorList">
                        <li class="tal" v-for="(item, index) in listObj.list" :key="index" @click="saveDoctor(item)">
                            <p class="doctorName">{{item.nickname}}</p>
                            <p class="doctorHospital">{{item.organName}}</p>
                            <p class="doctorDepartment">[{{item.departmentName}}]</p>
                        </li>
                    </ul>
                </div>
                <div class="formFooter dtb" v-show="prevShow">
                   <div class="cell colorBase" @click="toPrevStep(listObj.prevType)">上一步</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    .chooseDoctorPage .weui-cells:before{
        content: " ";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 1px;
        border-top: none;
        color: #D9D9D9;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }
    .chooseDoctorPage .vux-cell-value{
        color: #000;
    }
    .chooseDoctorPage .weui-cells:after {
        content: " ";
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 1px;
        border-bottom: none;
        color: #D9D9D9;
        -webkit-transform-origin: 0 100%;
        transform-origin: 0 100%;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }
    .chooseDoctorPage .weui-cells {
        margin-top: 0;
        background-color: #FFFFFF;
        overflow: hidden;
        position: relative;
    }
    .chooseDoctorPage .weui-cell {
        padding-right:0;
        position: relative;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    }
    .chooseDoctorPage .weui-cell__hd{
        width: 0;
    }
    .chooseDoctorPage .vux-cell-primary{
        width: 100%;
    }
</style>
<style lang="less" scoped>
    .dtb{
        display: table;
    }
    .skip{
        display: block;
        width: 100%;
        height: 100%;
    }
    .chooseDoctorPage{
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
        height: 60%;
        width: 80%;
        min-height: 7rem;
        font-size:22px;
        border-radius: 5px;
        background-color: #fff;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .formHeader{
        width: 100%;
        height: 10%;
        font-size: 70%;
        border-bottom: 1px solid #D2D3D5;
        color: #000;
    }
    .formBody{
        height: 80%;
        overflow: hidden;
    }
    // 输入框
    .formBody .inputBox{
        width: 100%;
        height: 15%;
        background: #F4F4F4;
    }
    .formBody .inputBox input{
        width: 90%;
        height: 80%;
        font-size: 70%;
        box-sizing: border-box;
        position: absolute;
        left: 5%;
        top: 10%;
        border-radius: 5px;
        padding-left: 5%;
    }
    .formBody .inputBox input::-webkit-input-placeholder{
        text-align: center;
    }
    .formBody .cleaInputContent,
    .formHeader .closeForm{
        width: 20px;
        height: 20px;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
        position: absolute;
        right: 7%;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 50%;
        background-color: #999;
        color: #fff;
    }
    .formHeader .closeForm{
        background-color: #fff;
        right: 2%;
        color: #000;
        padding-top: 2px;
        font-size: 16px;
    }
    // 地址选择栏
    .chooseArea{
        height: 15%;
        width: 100%;
    }
    .chooseArea .allHostital{
        width: 25%;
        font-size: 60%;
    }
    // 医院选择列表
    .formBody .hospitalListBox{
        width: 100%;
        height: 70%;
    }
    .formBody .hospitalListBox .nodate{
        width: 100%;
    }
    .formBody .hospitalListBox ul{
        height: 100%;
        width: 100%;
        overflow: scroll;
        border-top: 1px solid #D2D3D5;
    }
    .formBody .hospitalListBox li{
        width: 100%;
        height: 20%;
        font-size: 80%;
        padding-left: 5%;
        border-bottom: 1px solid #D2D3D5;
    }
    .formBody .hospitalListBox li .item{
        width: 90%;
    }
    .formBody .hospitalListBox li .rightArrow {
        width: 10%;
    }
    .formBody .hospitalListBox li .rightArrow img{
        width: 0.3rem;
        height: 0.48rem;
    }
    // 搜索出来的医生列表
    .formBody .doctorList{
        height: 82.5%;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        border-top: 1px solid #D2D3D5;
    }
    .formBody .doctorList li {
        min-height: 33.3333%;
        padding-left: 5%;
    }
    .formBody .doctorList li {
        border-bottom: 1px solid #D2D3D5;
    }
    .doctorList li p{
        padding-top: 2px;
        min-height: 33.333%
    }
    .doctorList li .doctorName{
        font-size: 80%;
        font-weight: 600;
    }
    .doctorList li .doctorHospital,
    .doctorList li .doctorDepartment{
        font-size: 75%;
        color: #333;
    }
    .cell{
        width: 100%;
        height: 100%;
        vertical-align: middle;
        display: table-cell;
    }
    .formFooter{
        width: 100%;
        height: 10%;
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
    import { Group, XAddress, ChinaAddressV4Data, XButton, Cell, Value2nameFilter as value2name } from 'vux'
    import {isEmptyString} from '../../utils/utils'
    import {userModel} from '../../api'
    export default {
        name:"chooseDoctor",
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
                addressData: ChinaAddressV4Data,
                chooseAreaIsShow: true,
                serchName: '',
                isFocus: false,
                province: '',
                city: '',
                district: '',
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
            getNextList: function (type, item) {
                let _this = this;
                if(type == 'hospital'){
                    _this.getDepartment(item);
                }

                if(type == 'department'){
                    _this.getDoctor(item);
                }

                if(type == 'doctor'){
                    this.prevType = '';
                    this.saveDoctor(item);
                }
            },
            // 获取医院
            getHospital: function () {
                let _this = this;
                this.formTitle = '请选择就诊医院';
                userModel.getHospitalList({province: this.province, city: this.city, district: this.district}, function(res){
                    _this.showArrow = true;
                    if (res.data.data.hospitals&&res.data.data.hospitals.length > 0) {
                        _this.listObj.type = 'hospital';
                        _this.listObj.list = res.data.data.hospitals;
                        _this.noHospital = false;
                    } else {
                        _this.listObj.list = res.data.data.hospitals;
                        _this.noHospital = true;
                    }
                });
            },
            // 获取科室
            getDepartment: function (item) {
                let _this = this;
                let data = {};
                this.formTitle = '请选择就诊科室';
                if (typeof item == 'string') {
                    data.organizationId = item;
                    this.prevDepartmentId = item;
                } else {
                    data.organizationId = item.organizationId;
                    this.prevDepartmentId = item.organizationId;
                }
                userModel.getDepartmentList(data, function(res){
                    _this.showArrow = true;
                    if (!!_this.serchType && _this.serchType != 'nurse') {
                        _this.prevShow = true;
                    } else {
                        _this.prevShow = false;
                    }
                    _this.listObj.type = 'department';
                    _this.listObj.prevType = 'hospital';
                    _this.listObj.list = res.data.data.departments;
                    
                });
            },
            // 获取医生
            getDoctor: function (item) { // item , 判断是不是选择医院和科室来查询医生
                let _this = this;
                // roleType3代表医生 , 4代表护士
                let roleType = this.serchType == 'nurse' ? 2 : 1;
                let data = {roleType: roleType};
                if (isEmptyString(this.serchName) !== '') {
                    data.keyWord = this.serchName;
                    userModel.getDoctorList(data, function(res){
                        _this.prevShow = false;
                        _this.showArrow = false;
                        _this.listObj.type = 'doctor';
                        _this.listObj.prevType = 'department';
                        _this.listObj.list = res.data.data.doctors;
                    });
                    this.formTitle = this.serchType == 'nurse' ?'请选择教育护士':'请选择就诊医生';
                } else if (item){
                    data.departmentId = item.departmentId;
                    this.prevDepartmentId = item.organizationId;
                    userModel.getDoctorList(data, function(res){
                        _this.prevShow = true;
                        _this.showArrow = false;
                        _this.listObj.type = 'doctor';
                        _this.listObj.prevType = 'department';
                        _this.listObj.list = res.data.data.doctors;
                    });
                    this.formTitle = this.serchType == 'nurse' ?'请选择教育护士':'请选择就诊医生';
                } else {
                    _this.listObj.list = [];
                }
            },
            // 选择医生保存医生
            saveDoctor: function (item) {
                let _this = this;
                let roleType = this.serchType == 'nurse' ? 2 : 1;
                userModel.saveDoctor({doctorId:item.userId, doctorName:item.nickname, roleType: roleType}, function(res){
                    _this.closeMask();
                    if (roleType == '1') {
                        _this.$parent.doctorId = item.userId;
                        _this.$parent.formList[1].inputList[10].inputValue = item.nickname;
                    } else if (roleType == '2') {
                        _this.$parent.formList[1].inputList[11].inputValue = item.nickname;
                    }
                    _this.showToast('设置成功');
                });
            },
            toPrevStep: function (type) {
                // console.log(this.prevDepartmentId);
                 if(type == 'hospital'){
                    this.prevShow = false;
                    this.getHospital();
                }
                if(type == 'department'){
                    this.getDepartment(this.prevDepartmentId);
                }
            },
            toEiditReport: function (item) {
                this.$router.push({path: '/sugarReport/addReport/'+item.testId,query: {type:!item.deviceImei?'self':'device',canEdit:true}});
            },
            logHide:function(str) {
                let that = this;
                //坐标转化为名称
                let getAddress = this.getName(this.value).split(" ");
                for(var key in getAddress){
                    that.province = getAddress[0] || '';
                    that.city = getAddress[1] || '';
                    that.district = getAddress[2] || '';
                }
                if (str&&!!that.province && !!that.city && !!that.district) {
                    that.getHospital();
                }
            },
            logShow () {
                if (this.value.length == 0) {
                    this.value = ['000000', '000000', '000000'];
                }
            },
            getName (value) {
                return value2name(value, ChinaAddressV4Data)
            },
            clearInputContent () {
                this.serchName = '';
                this.isFocus = true;
                this.listObj.list = [];
            },
            // 搜索医生护士输入框事件
            serchDoctorInput () {
                this.chooseAreaIsShow = false;
                this.getDoctor();
            },
            serchDoctorBlur () {
                if (!this.serchName) {
                    this.chooseAreaIsShow = true;
                    this.formTitle = '请选择就诊医院';
                    if (this.listObj.list.length == 0) {
                        this.getHospital();
                    }
                }
            },
            // 获取用户位置信息
            getUserLocation () {
                let _this = this;
                userModel.getUserLocation({}, res => {
                    let tempArr = Object.keys(res.data.data.location);
                    if (tempArr.length > 0) {
                        _this.province = res.data.data.location.province;
                        _this.city = res.data.data.location.city;
                        _this.district =res.data.data.location.district;
                        _this.value = [_this.province, _this.city, _this.district];
                        _this.getHospital();
                    } else {
                        _this.getHospital();
                    }
                });
            },
            // 获取所有医院
            getAllHospital () {
                this.value = [];
                this.province = '';
                this.city = '';
                this.district = '';
                this.getHospital();
            }
        },
        mounted:function () {
            this.showMask = true;
            //父组件可能有滚动 , 重置一下组件位置
            document.querySelector('.chooseDoctorPage').style.top = this._props.scrollValue + 'px';
            this.setScrollTop().afterOpen();
        },
        created:function () {
            if (this._props.formType == 'chooseDoctor') {
                this.getUserLocation();
            }
            if (this.serchType == 'nurse') {
                this.formTitle = '请选择科室';
                // 在有医生的情况下直接查询科室列表
                let data = {doctorId: this.doctorId};
                userModel.getDepartmentList(data, (res) => {
                    this.showArrow = true;
                    this.prevShow = false;
                    this.listObj.type = 'department';
                    this.listObj.prevType = 'hospital';
                    this.listObj.list = res.data.data.departments;
                });
            }
        },
        beforeDestroy:function () {
            this.setScrollTop().beforeClose();
        },
        // scrollValue用于重置组件位置 , formType用于渲染不同组件
        props:['scrollValue', 'formType', 'dataTimeSugarList', 'serchType', 'doctorId'],
        components:{
            Group,
            XAddress,
            XButton,
            Cell,
        },
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