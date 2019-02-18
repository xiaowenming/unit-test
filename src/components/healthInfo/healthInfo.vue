<template>
  <div class="healthInfoPage fullPage pr">
        <commomHeader :headerTitle="headerTitle" :rightIsShow="rightIsShow " :showArrow="showArrow" :showAdd="showAdd" :rightPath="rightPath" :showText="showText" :rightText="rightText"></commomHeader>
        <div v-for="(item,index) in formList" :key='index'>
            <div class="modelTitile tal">{{item.title}}</div>
            <div v-for="(element, elIndex) in item.inputList" :key="elIndex">
                <scope-input
                    v-if="element.type == 'input' || element.type == 'select'"
                    :iconSrc="'/static/images/health/icons/' + element.iconSrc"
                    :inputTitle="element.inputTitle"
                    :inputType="element.inputType"
                    :isReadOnly="element.isReadOnly"
                    :placeHolderText="element.placeHolderText"
                    :inputValue="element.inputValue"
                    :arrowIsShow="element.arrowIsShow"
                    :componentType="element.type"
                    :itemLiList="element.chooseList"
                    :selectType="element.selectType"
                    :inputName="element.name"
                    :inputScopeCallback="element.inputScopeCallback"
                    v-on:changeValue="setValue"
                    v-on:sendInputValue="setValue"
                    v-on:inputBlurCallback="blurCallBack">
                </scope-input>
                <scope-datetime 
                    v-if="element.type == 'date'"
                    :iconSrc="'/static/images/health/icons/' + element.iconSrc"
                    :placeHolderText="element.placeHolderText"
                    :arrowIsShow="element.arrowIsShow"
                    :inputTitle="element.inputTitle"
                    :inputValue="element.inputValue"
                    :inputName="element.name"
                    v-on:sendInputValue="setValue">
                </scope-datetime>
                <scope-adress
                    v-if="element.type == 'address'"
                    :iconSrc="'/static/images/health/icons/' + element.iconSrc"
                    :inputTitle="element.inputTitle"
                    :inputName="element.name"
                    :showTextarea="element.showTextarea"
                    :arrowIsShow="element.arrowIsShow"
                    :inputValue="element.inputValue"
                    :textareaPlaceholderText="element.textareaPlaceholderText"
                    v-on:changeValue="setValue">
                </scope-adress>
                <my-textarea
                    v-if="element.showTextarea"
                    :inputValue="element.inputValue"
                    :textareaPlaceholderText="element.textareaPlaceholderText"
                    :inputName="element.name"
                    v-on:sendInputValue="setValue">
                </my-textarea>
            </div>
        </div>
        <chooseDoctor 
            v-on:closeMask="closeChooseMask"
            v-if="createCascadeForm"
            ref="chooseDoctor"
            :formType="formType"
            :scrollValue="pageScroll"
            :serchType="serchType"
            :doctorId="doctorId">
        </chooseDoctor>
        <div class="submitButton">
            <div @click="submitData" :class="{sub:true,tac:true,isDisable:false}" :disabled="false">提交</div>
        </div>
  </div>
</template>

<style>
    .healthInfoPage .healthItem .vux-no-group-title{
        margin: 0 !important;
    }
    .healthInfoPage .weui-cell_access .weui-cell__ft:after{
        display: none;
    }
    .healthInfoPage .vux-cell-value{
        color: #000;
    }
    .vux-datetime-cancel{
        text-align: right !important;
    }
    .vux-datetime-confirm{
        text-align: left !important;
    }
</style>

<style lang="less" scoped>
    * {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-tap-highlight-color: transparent;
    }
    input, textarea {
        -webkit-appearance:none; /*去除input默认样式*/
        padding: 0px;
    }
    .healthInfoPage .healthModel input[type="text number"]::-webkit-search-decoration,
    .healthInfoPage .healthModel input[type="text number"]::-webkit-search-cancel-button,
    .healthInfoPage .healthModel input[type="text number"]::-webkit-search-results-button,
    .healthInfoPage .healthModel input[type="text number"]::-webkit-search-results-decoration {
        display: none;
    }
    .healthInfoPage .modelTitile{
        background-color: #f4f4f4;
        width: 100%;
        height: 0.8rem;
        padding-left: 0.4rem;
        line-height: 0.8rem;
        font-size: 0.32rem;
    }
    .submitButton{
        width: 100%;
        margin-top: 0.5rem;
        padding-bottom: 1rem;
    }
    .submitButton .sub{
        width: 90%;
        height: 0.8rem;
        line-height: 0.8rem;
        border-radius: 0.08rem;
        font-size: 0.36rem;
        color: #fff;
        margin: 0 auto;
        background-color: #4ec6bc;
    }
    .submitButton .isDisable{
        background-color: #ccc;
    }
</style>

<script>
    import commomHeader from "../commomComponents/header"
    import chooseDoctor from '../commomComponents/chooseDoctor'
    import scopeInput from '../commomComponents/scopeInput'
    import scopeDatetime from '../commomComponents/scopeDatetime'
    import scopeAdress from '../commomComponents/scopeAdress'
    import myTextarea from '../commomComponents/myTextarea'
    import {userModel, commonApiModel} from '../../api'
    import {validateString, validateLessNumber, validateUpperNumber, validateIdCard, overlengthStr, IsInArray} from '../../utils/validate'
    export default {
        name:"healthInfo",
        data (){
            return {
                headerTitle: "健康档案",
                rightIsShow: false,
                showArrow: "",
                showAdd: "",
                showText: "",
                rightText: "",
                rightPath: null,
                format: 'YYYY-MM-DD',
                formList: [
                    //参数说明: name: 后端提交字段 , 组件名, type: 判断是输入还是选择还是日期或者地址选择, inputTitle: 组件标题, iconSrc: icon Url
                    // isReadOnly: 是否只读 , 判断是输入框还是选择 , placeHolderText: 占位符文本, inputValue: v-model绑定 , 用于提交,
                    //arrowIsShow: 是否显示右箭头 ,chooseList: 下拉框列表, selectType: 多选下拉还是单选下拉, showTextarea: 是否显示文本域
                    // textareaPlaceholderText: 文本域占位符
                    {
                        title:'基本信息',
                        inputList:[
                            {name:'patientName', type: 'input', iconSrc: 'nickName.png', inputTitle: '姓名', isReadOnly: false, placeHolderText: '未填写', inputValue: '', arrowIsShow: false},
                            {name:'idCard', type: 'input', iconSrc: 'idNumber.png', inputTitle: '身份证号', isReadOnly: false, placeHolderText: '未填写', inputValue: '', arrowIsShow: false, blurCallBack: this.setBirthByIdNumber},
                            {name:'birthday', type: 'date', iconSrc: 'dateIcon.png', inputTitle: '出生日期', isReadOnly: true, placeHolderText: '未选择', inputValue: '', arrowIsShow: true},
                            {name:'sex', type: 'select', iconSrc: 'gender.png', inputTitle: '性别', isReadOnly: true, placeHolderText: '未选择', inputValue: '', arrowIsShow: true, chooseList:[] , selectType: 'single', subIndex: ''},
                            // {name:'phone', type: 'input', iconSrc: 'phoneNumber.png', inputTitle: '手机号', isReadOnly: false, placeHolderText: '未填写', inputValue: '', arrowIsShow: false},
                            {name:'maritalStatus', type: 'select', iconSrc: 'marry.png', inputTitle: '婚姻状态', isReadOnly: true, placeHolderText: '未选择', inputValue: '', arrowIsShow: true, selectType: 'single', subIndex: ''},
                            {name:'job', type: 'select', iconSrc: 'profession.png', inputTitle: '职业', isReadOnly: true, placeHolderText: '未选择', inputValue: '', arrowIsShow: true, chooseList:[], selectType: 'single', subIndex: ''},
                            {name:'addressProvince', type: 'address', iconSrc:'address.png', inputTitle:'家庭住址', isReadOnly:true, placeHolderText: '未选择', inputValue: '', arrowIsShow: true},
                            {name:'address', type: 'textarea', showTextarea: true, textareaPlaceholderText: '请填写详细地址', inputValue: ''},
                        ]
                    },
                    {
                        title:'病历信息',
                        inputList:[
                            {name:'diabetesType', type: 'select', iconSrc: 'disabatType.png', inputTitle: '糖尿病类型', isReadOnly: true, placeHolderText: '未选择', inputValue: '', arrowIsShow: true, chooseList:[], selectType: 'single', subIndex: ''},
                            {name:'ensureDate', type: 'date', iconSrc: 'dateIcon.png', inputTitle: '糖尿病确诊日期', isReadOnly: true, placeHolderText: '未选择', inputValue: '', arrowIsShow: true},
                            {name:'height', type: 'input', iconSrc: 'height.png', inputTitle: '身高', isReadOnly: false, placeHolderText: '未填写', inputValue: '', arrowIsShow: false, showPopup: false, blurCallBack: this.heightBlur},
                            {name:'weight', type: 'input', iconSrc: 'weight.png', inputTitle: '体重', isReadOnly: false, placeHolderText: '未填写', inputValue: '', arrowIsShow: false, blurCallBack: this.weightBlur},
                            {name:'bmi', type: 'input', iconSrc: 'BMI.png', inputTitle: 'BMI', isReadOnly: true, placeHolderText: '自动计算', inputValue: '', arrowIsShow: false},
                            {name:'complications', type: 'select', iconSrc: 'bfz.png', inputTitle: '糖尿病并发症', isReadOnly: true, placeHolderText: '未选择', inputValue: '', arrowIsShow: true, chooseList: [], selectType: 'multi', subIndex: ''},
                            {name:'complicationsRemark', type: 'input', isReadOnly:false, inputType: 'text', placeHolderText: '请输入其他并发症', inputValue: ''},
                            {name:'bloodPressureType', type: 'select', iconSrc: 'hypertensitonType.png', inputTitle: '高血压类型', isReadOnly: true, placeHolderText: '未选择', inputValue: '', arrowIsShow: true, chooseList:[], selectType: 'single', subIndex: ''},
                            {name:'bloodPressureEnsureDate', type: 'date', iconSrc: 'dateIcon.png', inputTitle: '高血压确诊日期', isReadOnly: true, placeHolderText: '未选择', inputValue: '', arrowIsShow: true},
                            {name:'treatmentTypeStr', type: 'input', iconSrc: 'teatment.png', inputTitle: '治疗方式', isReadOnly: false, placeHolderText: '未填写', inputValue: '', arrowIsShow: false, chooseList:[], selectType: 'single', subIndex: ''},
                            {name:'doctorName', type: 'input', iconSrc: 'doctor.png', inputTitle: '就诊医生', isReadOnly: true, placeHolderText: '未选择', inputValue: '', arrowIsShow: true, inputScopeCallback: this.chooseDoctor},
                            {name:'nurseName', type: 'input', iconSrc: 'nurse.png', inputTitle: '教育护士', isReadOnly: true, placeHolderText: '未选择', inputValue: '', arrowIsShow: true, inputScopeCallback: this.chooseNurse}
                        ]
                    },
                    {
                        title:'生活习惯',
                        inputList:[
                            {name:'labourIntensity', type: 'select', iconSrc: 'workhard.png', inputTitle: '劳动强度', isReadOnly: true, placeHolderText: '未选择', inputValue: '', arrowIsShow: true, chooseList:[], selectType: 'single', subIndex: ''},
                            {name:'exerciseFrequency', type: 'select', iconSrc: 'sport.png', inputTitle: '锻炼情况', isReadOnly: true, placeHolderText: '未选择', inputValue: '', arrowIsShow: true, chooseList:[], selectType: 'single', subIndex: ''},
                            {name:'sleepStatus', type: 'select', iconSrc: 'sleepTime.png', inputTitle: '夜间睡眠时间', isReadOnly: true, placeHolderText: '未选择', inputValue: '', arrowIsShow: true, showPopup: false, chooseList:[], selectType: 'single', subIndex: ''},
                            {name:'peacetimeEmotion', type: 'select', iconSrc: 'mood.png', inputTitle: '平时情绪', isReadOnly: true, placeHolderText: '未选择', inputValue: '', arrowIsShow: true, selectType: 'single', subIndex: ''},
                            {name:'foodHabit', type: 'select', iconSrc: 'eatHabit.png', inputTitle: '饮食偏好', isReadOnly: true, placeHolderText: '未选择', inputValue: '', arrowIsShow: true, chooseList:[], selectType: 'single', subIndex: ''},
                            {name:'smokingStatus', type: 'select', iconSrc: 'smoke.png', inputTitle: '吸烟情况', isReadOnly: true, placeHolderText: '未选择', inputValue: '', arrowIsShow: true, chooseList:[], selectType: 'single', subIndex: ''},
                            {name:'smokingDaily', type: 'input', isReadOnly:false, inputType: 'number', placeHolderText: '请输入每天吸烟根数', inputValue: ''},
                            {name:'smokingRemark', type: 'textarea', showTextarea: true, textareaPlaceholderText: '请输入戒烟前吸烟情况', inputValue: ''},
                            {name:'drinkingStatus', type: 'select', iconSrc: 'drink.png', inputTitle: '饮酒情况', isReadOnly: true, placeHolderText: '未选择', inputValue: '', arrowIsShow: true, chooseList:[], selectType: 'single', subIndex: ''},
                            {name:'drinkingType', type: 'select', iconSrc:'type.png', inputTitle:'类型', isReadOnly:true, placeHolderText: '未选择', inputValue: '', arrowIsShow: true, selectType: 'single', subIndex: ''},
                            {name:'drinkingDaily', type: 'input', isReadOnly:false, inputType: 'number', placeHolderText: '请输入每天摄入量(毫升/天)', inputValue: ''},
                        ]
                    }
                ],
                listConfig: [],
                province: '',
                city: '',
                district: '',
                createCascadeForm: false,
                formType: '',
                pageScroll: '',
                serchType: '',
                doctorId: '', // 用户选择的医生所在机构id
                nameFlag: true // 姓名提交flag , 当后端返回姓名不为空时 , 姓名不能更改为空 , 不能提交 , 否则可以
            }
        },components:{
            commomHeader,
            scopeInput,
            scopeDatetime,
            scopeAdress,
            myTextarea,
            chooseDoctor
        },
        methods:{
            // 服务器获取下拉框配置内容
            getConfig () {
                commonApiModel.getHealthInfoDicAll({}, (res) => {
                    let dataList = res.data.data.obj;
                    this.formList.forEach(item => {
                        item.inputList.forEach(element => {
                            if (dataList[element.name]) {
                                element.chooseList = dataList[element.name];
                            }
                        })
                    });
                    this.getPatient();
                });
            },
            // 根据列表name属性匹配 , 返回当前name属性所属对象
            getObj (name) {
                if (Object.prototype.toString.call(name) == '[object String]') {
                    let tempObj = {};
                    this.formList.forEach(item => {
                        item.inputList.forEach(element => {
                            if (element.name == name) {
                                tempObj = element;
                            }
                        });
                    });
                    return tempObj;
                }
                if (Object.prototype.toString.call(name) == '[object Array]') {
                    let arr = [];
                    name.forEach(value => {
                        this.formList.forEach(item => {
                            item.inputList.forEach(element => {
                                if (element.name == value) {
                                    arr.push(element.inputValue);
                                }
                            });
                        });
                    });
                    return arr;
                }
                
            },
            setValue (value, name, index) {
                let obj = this.getObj(name);
                if (obj.type == 'select') {
                    obj.subIndex = index;
                    obj.inputValue = value;
                } else if (name == 'addressProvince') {
                    this.province = value[0];
                    this.city = value[1];
                    this.district = value[2];
                } else {
                    obj.inputValue = value;
                }

                if (name == 'smokingStatus') {
                    let smokingRemark = this.getObj('smokingRemark');
                    let smokingDaily = this.getObj('smokingDaily');
                    if (value == '已戒烟') { // 吸烟状态切换
                        smokingRemark.showTextarea = true;
                        smokingDaily.type = '';
                        smokingDaily.inputValue = '';
                    } else if (value == '吸烟') {
                        smokingRemark.showTextarea = false;
                        smokingRemark.inputValue = '';
                        smokingDaily.type = 'input';
                    } else {
                        smokingRemark.showTextarea = false;
                        smokingRemark.inputValue = '';
                        smokingDaily.type = '';
                        smokingDaily.inputValue = '';
                    }
                }

                if (name == 'drinkingStatus') { // 饮酒状态切换
                    if (value == '' || value == '从不') {
                        this.getObj('drinkingType').type = '';
                        this.getObj('drinkingType').inputValue = '';
                        this.getObj('drinkingDaily').type = '';
                        this.getObj('drinkingDaily').inputValue = '';
                    } else {
                        this.getObj('drinkingType').type = 'select';
                        this.getObj('drinkingDaily').type = 'input';
                    }
                }

                if (name == 'complications') {
                    let tempArr = index.split(',');
                    if (IsInArray(tempArr, '0')) {
                        this.getObj('complicationsRemark').type = 'input';
                    } else {
                        this.getObj('complicationsRemark').type = '';
                        this.getObj('complicationsRemark').inputValue = '';
                    }
                }
            },
            getBMI (weight, height) {
                return (weight / ((height / 100) * (height / 100))).toFixed(1);
            },
            // 根据身份证设置出生年月 性别
            setBirthByIdNumber () {
                let idNumber = this.getObj('idCard').inputValue.trim();
                let birth = '';
                if  ((idNumber.length == 15 || idNumber.length ==18) && validateIdCard(idNumber)) {
                    if (idNumber.length == 15) {
                        birth ='19' + idNumber.substring(6, 8) + '-' + idNumber.substring(8, 10) + '-' + idNumber.substring(10, 12);
                        this.getObj('birthday').inputValue = birth;
                        if (idNumber.substring(idNumber.length-1) * 1 % 2 == 1) { // 15位身份证最后一位判断性别
                            this.getObj('sex').inputValue = '男';
                            this.getObj('sex').subIndex = '1';
                        } else {
                            this.getObj('sex').inputValue = '女';
                            this.getObj('sex').subIndex = '2';
                        }
                    } else if (idNumber.length == 18) {
                        birth =idNumber.substring(6, 10) + '-' + idNumber.substring(10, 12) + '-' + idNumber.substring(12, 14);
                        this.getObj('birthday').inputValue = birth;
                        if (idNumber.substring(idNumber.length-2, idNumber.length-1) * 1 % 2 == 1) {// 18位身份证倒数第二位判断性别
                            this.getObj('sex').inputValue = '男';
                            this.getObj('sex').subIndex = '1';
                        } else {
                            this.getObj('sex').inputValue = '女';
                            this.getObj('sex').subIndex = '2';
                        }
                    }
                } else {
                    if (idNumber.length > 0) {
                        this.showToast('请输入正确的身份证号');
                    }
                }
            },
            // input框失去焦点回调
            blurCallBack (value, name) {
                let obj = this.getObj(name);
                obj.inputValue = value;
                if (obj.blurCallBack) {
                    obj.blurCallBack(value);
                }
            },
            weightBlur (value) {
                let obj = this.getObj('weight');
                if (validateString(obj.inputValue)) {
                    obj.inputValue = parseInt((value * 1).toFixed(0));
                    let weight = obj.inputValue;
                    let height =  this.getObj('height').inputValue;
                    if (validateString(height)) {
                        this.getObj('bmi').inputValue = this.getBMI(weight, height);
                    }
                } else {
                    this.getObj('bmi').inputValue = '';
                }
            },
            heightBlur (value) {
                let obj = this.getObj('height');
                if (validateString(obj.inputValue)) {
                    this.getObj('height').inputValue = parseInt((value * 1).toFixed(0));
                    let weight = this.getObj('weight').inputValue;
                    let height = obj.inputValue;
                    if (validateString(weight)) {
                        this.getObj('bmi').inputValue = this.getBMI(weight, height);
                    }
                } else {
                    this.getObj('bmi').inputValue = '';
                }
            },
            // 获取后台健康档案数据
            getPatient () {
                userModel.getUserHealthInfo({}, (res) => {
                    let result = res.data.data;
                    this.handleDate(result);
                })
            },
            // 处理后台数据
            handleDate (res) {
                let tempArr = Object.keys(res);
                tempArr.forEach(item => {
                    if (res.patientName && res.patientName.length > 0) {
                        this.nameFlag = false;
                    }
                    if ((!IsInArray(tempArr, 'drinkingStatus')) || (item == 'drinkingStatus' && res[item] == '1')) {
                        this.getObj('drinkingType').type = '';
                        this.getObj('drinkingDaily').type = '';
                    }
                    if ((IsInArray(tempArr, 'complications')) && item == 'complications') {
                        let complicationsArr = res[item].split(',');
                        if (!IsInArray(complicationsArr, '0')) {
                            this.getObj('complicationsRemark').type = '';
                        }
                    }
                    if ((IsInArray(tempArr, 'foodHabit')) && item == 'foodHabit') {
                        this.getObj('foodHabit').inputValue = (res[item].split(','))[0];
                    }
                    if (IsInArray(tempArr, 'smokingStatus')) {
                        if ((item == 'smokingStatus')) {
                            if (res[item] == '1') {
                                this.getObj('smokingDaily').type = '';
                                this.getObj('smokingRemark').showTextarea = false;
                            } else if (res[item] == '2') {
                                this.getObj('smokingDaily').type = '';
                            } else {
                                this.getObj('smokingRemark').showTextarea = false;
                            }
                        }
                    } else {
                        this.getObj('smokingDaily').type = '';
                        this.getObj('smokingRemark').showTextarea = false;
                    }
                    if (item == 'birthday' || item == 'ensureDate' || item == 'bloodPressureEnsureDate') {
                        this.getObj(item).inputValue = res[item].substring(0, 11);
                    } else if (this.getObj(item).type == 'select' && this.getObj(item).selectType == 'single') {
                        let tempArr = this.getObj(item).chooseList;
                        if (tempArr && tempArr.length > 0) {
                            tempArr.forEach(element => {
                                if (element.itemKey == res[item]) {
                                    this.getObj(item).inputValue = element.itemValue;
                                    this.getObj(item).subIndex = res[item];
                                }
                            });
                        }
                    } else if (this.getObj(item).type == 'select' && this.getObj(item).selectType == 'multi' && res[item].length > 0) {
                        let tempArr = this.getObj(item).chooseList;
                        let dataArr = res[item].split(',');
                        dataArr.forEach(element => {
                            tempArr.forEach((ite, ind) => {
                                if (element == ite.itemKey) {
                                    this.getObj(item).inputValue = this.getObj(item).inputValue + ite.itemValue + ',';
                                }
                            });
                        });
                        this.getObj(item).inputValue = this.getObj(item).inputValue.substring(0, this.getObj(item).inputValue.length-1);
                        this.getObj(item).subIndex = res[item];
                    } else {
                        this.getObj(item).inputValue = res[item] || '';
                    }
                });
                this.province = res.province;
                this.city = res.city;
                this.district = res.district;
                // 地址选择特殊处理 , 处理成省市区
                if (res.province) {
                    this.getObj('addressProvince').inputValue = [res.province, res.city, res.district];
                }
                this.doctorId = res.doctorId;
            },
            chooseDoctor () {
                let doctorName = this.getObj('doctorName').inputValue;
                if (!validateString(doctorName)) {
                    this.formType = 'chooseDoctor';
                    this.pageScroll = document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop;
                    this.createCascadeForm = true;
                    this.serchType = 'doctor';
                    this.$nextTick(function () {
                        this.$refs.chooseDoctor.showMask = true;
                    });
                }
            },
            chooseNurse () {
                let nurseName = this.getObj('nurseName').inputValue;
                if (!validateString(nurseName)) {
                    if (!validateString(this.getObj('doctorName').inputValue)) {
                        this.showToast('请先选择医生');
                    } else {
                        this.formType = '';
                        this.pageScroll = document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop;
                        this.createCascadeForm = true;
                        this.serchType = 'nurse';
                        this.$nextTick(function () {
                            this.$refs.chooseDoctor.showMask = true;
                        });
                    }
                }
            },
            // 提交
            submitData () {
                let [name, idNumber, weight, height, smokingStatus, smokingRemark, smokingDaily, drinkingStatus, drinkingType, drinkingDaily, complications, complicationsRemark, treatmentTypeStr, address] = this.getObj(['patientName', 'idCard',  'weight',  'height',  'smokingStatus',  'smokingRemark',  'smokingDaily',  'drinkingStatus',  'drinkingType',  'drinkingDaily',  'complications',  'complicationsRemark',  'treatmentTypeStr',  'address',]);
                let complicationsValueArr = complications.split(',');
                if (!this.nameFlag && !validateString(name)) {
                    this.showToast('请输入姓名');
                } else if (validateString(name) && overlengthStr(name, 10)) {
                    this.showToast('姓名应少于10个字');
                } else if (validateString(address) && overlengthStr(address, 50)) {
                    this.showToast('家庭详细地址应少于50个字');
                } else if (validateString(idNumber) && !validateIdCard(idNumber)) {
                    this.showToast('请输入正确的身份证号');
                } else if (validateString(height) && (validateLessNumber(height, 20) || validateUpperNumber(height, 240))) {
                    this.showToast('身高应在20~240cm之间');
                } else if (validateString(weight) && (validateLessNumber(weight, 5) || validateUpperNumber(weight, 200))) {
                    this.showToast('体重应在5~200Kg之间');
                } else if (validateString(smokingStatus) && smokingStatus == '已戒烟' && !validateString(smokingRemark)) {
                    this.showToast('请填写戒烟前吸烟情况');
                } else if (validateString(smokingRemark) && overlengthStr(smokingRemark, 50)) {
                    this.showToast('戒烟前情况字数不能超过50');
                } else if (validateString(smokingStatus) && smokingStatus == '吸烟' && !validateString(smokingDaily)) {
                    this.showToast('请填写每日吸烟数量');
                } else if (validateString(smokingDaily) && validateUpperNumber(smokingDaily, 999)) {
                    this.showToast('吸烟量请填写小于999的数字');
                } else if (validateString(smokingDaily) && smokingDaily <= 0) {
                    this.showToast('吸烟量请填写大于0的数字');
                } else if (validateString(drinkingStatus) && drinkingStatus != '从不' && (!validateString(drinkingType) || !validateString(drinkingDaily))) {
                    this.showToast('请填饮酒类型和饮酒量');
                } else if (validateString(drinkingDaily) && validateUpperNumber(drinkingDaily, 9999)) {
                    this.showToast('饮酒量请填写小于9999的数字');
                } else if (validateString(drinkingDaily) && drinkingDaily <= 0) {
                    this.showToast('饮酒量请填写大于0的数字');
                } else if (validateString(complications) && IsInArray(complicationsValueArr, '其他') && !validateString(complicationsRemark)) {
                    this.showToast('请填写其他糖尿病并发症');
                } else if (validateString(complicationsRemark) && overlengthStr(complicationsRemark, 20)) {
                    this.showToast('其他并发症字数不能超过20');
                } else if (validateString(treatmentTypeStr) && overlengthStr(treatmentTypeStr, 20)) {
                    this.showToast('治疗方式字数不能超过20');
                } else {
                    let subData = {};
                    this.formList.forEach(item => {
                        item.inputList.forEach(ele => {
                            if (ele.type == 'select') {
                                subData[ele.name] = ele.subIndex.toString();
                            } else {
                                subData[ele.name] = ele.inputValue;
                            }
                            
                        });
                    });
                    subData.province = this.province;
                    subData.city = this.city;
                    subData.district = this.district;
                    userModel.subUserHealthInfo(subData, (res) => {
                        this.$router.go(-1);
                    });
                }
            },
            closeChooseMask () {
                this.createCascadeForm = false;
            }
        },
        created () {
            this.getConfig();
        }
    }
</script>
