<template>
  <div :class="{addReportPage:true, fullPage:true, pr:true, hiddenMain:hiddenMain}">
        <div class="styleBase pr bgWhite">
            <div class="sugerTextBox pr">
                <input @blur="notFocus" v-on:input="changeTextColor" :class="sugarValueColor" type="number" min="0.5" max="20" pattern="[0-9]*" placeholder="0.0" v-model="sugerValue" maxlength="4" :disabled="canEdit">
                <div class="unit fl">mmol/L</div>
            </div>
        </div>
        <div class="addSugerDetail bgWhite">
            <div class="timeType pr" @click="chooseTimeType">
                <span class="fl timeTypeText">时间段</span>
                <span class="selectedTimeType fr">{{timeTypeName}}</span><i></i>
            </div>
            <div class="time pr">
                <Group class="addReportDateTime">
                        <datetime 
                        v-model="limitHourValue"
                        :start-date="startDate"
                        :end-date="endDate"
                        format="YYYY-MM-DD HH:mm"
                        @on-change="change"
                        @on-confirm="onConfirm"
                        :readonly="canEdit"
                        :title="('测量时间')"
                        ></datetime>
                </Group>
            </div>
            <div class="gaugerBox pr">
                <span class="fl gauger">测量人</span>
                <span class="fr gaugerButton">
                    <!-- <em :class="{ather:true,fr:true,selected:!isSelected}" @click="chooseGauger('ather')">TA人</em> -->
                    <em :class="{ather:true,fr:true,selected:!isSelected}" @click="showConfirm">TA人</em>
                    <em :class="{self:true,fr:true,selected:isSelected}" @click="chooseGauger('self')">自己</em>
                </span>
            </div>
        </div>
        <div class="remarkTitle tal">其他备注</div>
        <div class="remarkBox bgWhite">
            <div class="eachLine clearfix" v-for="(item,index) in remarkItemList" :key="index">
                <div class="left fl">
                    <img :src="item.imgUrl" alt="">
                    <span class="text tac" :style="{color: item.textColor}">{{item.typeName}}</span>
                </div>
                <div class="right fr clearfix" v-getmargin>
                    <!-- (item.selected + '') == (i + '') 转化为字符串比对 , 防止 '' ==0 为true的情况发生 -->
                    <span :class="{item: true, fl: true, selected: (item.itemKey + '') == (i + '')&&item.eachItemText[i].isSelected}" v-for="(v, i) in item.eachItemText" :key="i" @click="selectedRemarkItem(item, index, i)">{{v.text}}</span>
                </div>
            </div>
        </div>
        <div class="bgWhite w100 textareaContainer">
            <div class="textareaBox">
                <textarea name="" class="remark tal" maxlength="100" v-validateEmoji placeholder="记录您测量时的其他详细情况" v-model="remark"></textarea>
            </div>
        </div>
        <div class="bgWhite w100 saveBottonContainer">
            <div class="saveBotton" @click="saveSuger">保存</div>
        </div>
        <healthScience ref="healthScience"></healthScience>
        <div class="blank"></div>        
        <!-- 从模板消息点进来的属于他人的测量数据 -->
        <div class="errorData fullPage" v-if="hiddenMain">
            <div class="content center-y">
                <p>该血糖数据已经被删除</p>
                <p>您可以查看其他数据</p>
                <div class="btn bgBase" @click="toDataTable">查看血糖数据</div>
            </div>
        </div>
        <div class="popup-div" id="timeTypeDiv" v-show="maskIsShow" @click="()=>{this.maskIsShow = false}">
            <div class="rl-div">
                <ul> 
                    <li v-for="(item,index) in chooseList" :class="{selectedLi:item.key==timeType}"  @click="selectLi(item)" >
                        <span>{{item.value}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div v-transfer-dom>
            <confirm v-model="show"
            :title="('')"
            @on-confirm="chooseGaugerConfirm">
                <p style="text-align:center;">选择 <span class="colorBase">"TA人"</span> 后会删除该数据<br/>请确认</p>
            </confirm>
        </div>
        <my-mask v-if="showMask" ref="mask">
            <div slot="body" class="imgBox">
                <img :src="saveDialogImgUrl" alt="">
                <div class="detail">
                    <p class="text">您本月填写<span class="reMarkTimes">{{reMarkTimes}}</span>次备注</p>
                    <p>恭喜您超过了全国</p>
                    <p class="persent">{{remarkPersent}}%</p>
                </div>
            </div>
        </my-mask>
  </div>
</template>
<style>
    .addReportPage .addReportDateTime .vux-no-group-title{
        margin: 0 !important;
    }
    .addReportPage .weui-cell_access .weui-cell__ft{
        padding: 0;
    }
    .addReportPage .weui-cell_access .weui-cell__ft:after{
        display: none;
    }
    .addReportPage .vux-cell-value{
        color: #000;
    }
    .addReportPage .addReportDateTime a {
        font-size: 0.3rem;
        float: left;
        width: 100%;
        padding: 0;
        height: 1.2rem;
        line-height: 1.2rem;
        z-index: 100;
    }
    .addReportPage .addReportDateTime p {
        color: #2c3e50;
    }
    .addReportPage .weui-cells:after{
        border-bottom:none;
    }
    .addReportPage .weui-cells:before {
        border-top:none;
    }
    .weui-dialog__btn_primary{
        color: #00C2B1;
    }
</style>
<style lang="less" scoped>
    .hiddenMain{
        overflow: hidden;
    }
    .styleBase{
        width: 100%;
        height: 2.0rem;
        margin: 0.5rem 0;
        padding-left: 2.71rem;
    }
    .addSugerDetail{
        width: 100%;
        margin: 0 auto;
        border: 1px solid #cecece;
        border-left: none;
        border-right: none;
    }
    .addSugerDetail div{
        height: 1.2rem;
        line-height: 1.2rem;
        padding: 0 0.7rem 0 0.3rem;
        font-size: 0.30rem;
    }
    .addReportPage .addReportDateTime{
        padding: 0;
    }
    .addSugerDetail .timeTypeText,
    .addSugerDetail .timeText
    {
        height: 100%;
    }
    .addSugerDetail .timeType{
        border-bottom: 1px solid #cecece;
    }
    .addSugerDetail i{
        width: 0.3rem;
        height: 0.15rem;
        background: url("/static/images/default/icon_down_black.png") no-repeat;
        background-size: cover;
        position: absolute;
        right :0.2rem;
        top:50%;
        transform: translateY(-50%);
        vertical-align: middle;
    }
    .sugerTextBox{
        height: 1.5rem;
        display: table-cell;
        vertical-align: bottom;
    }
    .sugerText{
        display: block;
        width: 2.08rem;
        height: 1.10rem;
        line-height: 1.1rem;
        font-size: 0.80rem;
    }
    .unit{
        height: 1.1rem;
        line-height: 1.42rem;
        font-size: 0.32rem;
        color:#666;
    }
    .gaugerBox{
        border-top: 1px solid #cecece;
    }
    .gaugerBox .gaugerButton{
        width: 60%;
        height: 100%;
    }
    .gaugerBox em{
        display: block;
        width: 1.2rem;
        height: 0.5rem;
        margin-top: 0.35rem;
        line-height: 0.5rem;
        border: 1px solid #e4e4e4;
        border-radius: 0.25rem;
    }
    .gaugerBox em.ather{
        margin-left: 0.5rem;
    }
    .remarkBox .right span.selected,
    .gaugerBox em.selected{
        background-color: #00c2b1;
        color: #fff;
        border: 1px solid #00c2b1;
    }
    .remarkTitle{
        height: 0.8rem;
        line-height: 0.8rem;
        padding-left: 0.3rem;
        background-color: #f4f4f4;
        color: #666
    }
    .remarkBox div{
        width: 100%;
        height: 1.6rem;
        border-bottom: 1px solid #e4e4e4;
    }
    .remarkBox .eachLine .left {
        width: 2rem;
        padding-left: 0.3rem;
        padding-top: 0.21rem;
    }
    .remarkBox .eachLine .left img{
        width: 0.8rem;
        height: 0.8rem;
    }
    .remarkBox .eachLine .left .text{
        display: block;
        width: 0.8rem;
        height: 0.28rem;
        margin-top: 0.1rem;
        line-height: 0.28rem;
        font-size: 0.28rem;
    }
    .remarkBox .eachLine .right {
        padding-top: 0.5rem;
        width: 5.5rem;
        padding-right: 0.7rem;
    }
    .remarkBox .eachLine .right .item {
        display: block;
        height: 0.6rem;
        line-height: 0.6rem;
        min-width: 0.9rem;
        padding: 0 0.1rem;
        border: 1px solid #e4e4e4;
        border-radius: 0.3rem;
        font-size: 0.3rem;
    }
    .textareaContainer{
        padding: 0.5rem 0 0.3rem;
    }
    .textareaBox {
        width: 90%;
        height: 2.5rem;
        margin: 0 auto;
    }
    .textareaBox .remark {
        width: 100%;
        height: 100%;
        font-size: 0.32rem;
        padding: 0.12rem 0.20rem;
        color: #555;
        border:1px solid #e0e0e0;
    }
    .saveBottonContainer{
        padding-bottom: 0.3rem;
    }
    .saveBotton {
        width: 90%;
        height: 0.9rem;
        line-height: 0.9rem;
        font-size: 0.36rem;
        margin: 0 auto;
        background-color: #4ec69d;
        color: #fff;
        border-radius: 0.10rem;
    }
    .popup-div {
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        width: 100%;
        height: 100%;
    }
    .rl-div {
        font-size:0.32rem;
        position: fixed;
        width: 100%;
        max-height: 200px;
        bottom: 0px;
        overflow-y: scroll;
        z-index: 9999;
    }
    .rl-div li {
        border-bottom: 1px solid #cecece;
        height: 0.8rem;
        text-align: center;
        line-height: 0.8rem;
        background-color: #FFF;
    }
    .rl-div .selectedLi{
        background-color: #43b597;
        color:#fff;
    }
    .blank{
        height: 0.8rem;
    }
    .errorData{
        position: absolute;
        left: 0;
        top: 0;
        background-color: #fff;
        z-index: 999;
    }
    .errorData .content{
        width: 100%;
        font-size: 0.40rem;
    }
    .errorData .content .btn{
        width: 60%;
        height: 0.8rem;
        line-height: 0.8rem;
        color: #fff;
        border-radius: 0.4rem;
        margin: 0 auto;
        margin-top: 1rem;
    }
    // 保存成功弹窗
    .imgBox{
        width: 5.6rem;
        height: 5.98rem;
        position: absolute;
        top: 50%;
        left:50%;
        margin-left: -2.8rem;
        margin-top: -2.99rem;
    }
    .imgBox img{
        width: 100%;
        height: 100%;
    }
    .imgBox .detail{
        width: 100%;
        position: absolute;
        left: 0;
        top: 2.9rem;
        color: #666;
        font-size: 0.36rem;
    }
    .imgBox .detail .reMarkTimes,
    .imgBox .detail .persent{
        color: #FF8400;
    }
    .imgBox .detail p{
        margin-bottom: 0.05rem;
    }
    .imgBox .detail .persent {
        font-size: 0.56rem;
        font-weight: 600;
    }
</style>

<script>
    import { Datetime, Group, XButton, Confirm, TransferDomDirective as TransferDom} from 'vux'
    // import { DatetimePicker } from 'mint-ui'
    import myMask from '../commomComponents/myMask'
    import healthScience from '../commomComponents/healthScience'
    import { setTimeout } from 'timers';
    import {FormDate, isEmptyString} from '../../utils/utils'
    import {validateEmoji} from '../../directives'
    import {userModel, commonApiModel, reportModel, tangyouCircleModel} from '../../api'
    export default {
        name:"addReport",
        data (){
            return {
                limitHourValue: '',
                startDate:"2015-01-01",
                endDate:"",
                sugerValue:null,// 血糖值
                sugarValueColor:"sugerText tac fl",
                sugerDic :[],// 血糖字典
                createTime:"",// 创建时间
                timeType:1,// 时段
                timeTypeName:"早餐前",
                minValue:"",// 该时段最小值
                maxValue:"",// 该时段最大值
                synckey:"",//去重同步戳
                remark:"",// 备注
                chooseList:[],// 时间段选择的
                maskIsShow:false,
                canEdit:false,
                submitFun:"add",
                saveFlag:true,//设置保存状态标志 , 防止重复保存
                isSelected:true,
                gauger:'1',
                remarkItemList: [
                    {
                        typeCode: 'diet',
                        typeName: '饮食',
                        textColor:'#da5f5f',
                        imgUrl: '/static/images/sugarTest/add_icon_food.png',
                        eachItemText: [ 
                            {text: '无', isSelected: false},
                            {text: '五分饱',isSelected: false},
                            {text: '七分饱',isSelected: false},
                            {text: '十分饱',isSelected: false}
                        ],
                        itemKey:''
                    },
                    {
                        typeCode: 'pharmacy',
                        typeName: '用药',
                        textColor:'#45b783',
                        imgUrl: '/static/images/sugarTest/add_icon_medicine.png',
                        eachItemText: [
                            {text: '无', isSelected: false},
                            {text: '忘记服药',isSelected: false},
                            {text: '口服药',isSelected: false},
                            {text: '胰岛素',isSelected: false}
                        ],
                        itemKey:''
                    },
                    {
                        typeCode: 'sport',
                        typeName: '运动',
                        textColor:'#54a0bf',
                        imgUrl: '/static/images/sugarTest/add_icon_sports.png',
                        eachItemText: [ 
                            {text: '无', isSelected: false},
                            {text: '低强度',isSelected: false},
                            {text: '中强度',isSelected: false},
                            {text: '高强度',isSelected: false}
                        ],
                        itemKey:''
                    }
                ],
                prevIndex:'',
                hiddenMain:false,// 数据为他人并从模板推送点击进入隐藏多余内容显示
                show:false,
                reMarkTimes: '',
                remarkPersent: '',
                tipsContent: '',
                saveDialogImgUrl: '',
                dialogFlag: false ,// 判断编辑血糖保存是否弹出备注统计弹窗 , 如果初始没有备注也没有选择用药运动等项目 , 第一次编辑就要弹出
                hasChange: false,
                showMask: false
            }
        },
        components:{
            // DatetimePicker,
            Datetime,
            Group,
            Confirm,
            XButton,
            Group,
            myMask,
            healthScience
        },
        methods:{
            onConfirm (val) {
                let _this = this;
                
            },
            change (value) {
                let _this = this;
                if(_this.submitFun == "add"){
                    if(new Date(value.replace(/\-/g, "/")).getTime()<=new Date((_this.createTime).replace(/\-/g, "/")).getTime()){
                        _this.createTime = value;
                    }
                }else{
                    if(new Date(value.replace(/\-/g, "/")).getTime()<=new Date().getTime()){
                        _this.createTime = value;
                    }
                }
                
            },
            getSugerDic:function(){
                let _this = this;
                userModel.getUserHealthTarget({}, function(res){
                    // 初始化血糖字典
                    _this.sugerDic = res.data.data.obj;
                    // 初始化下拉选择框
                    for (var i = 0; i < res.data.data.obj.length; i++) {
                        _this.chooseList.push({
                            key :  _this.sugerDic[i].timeType,
                            value :  _this.sugerDic[i].name,
                            minValue : _this.sugerDic[i].minValue,
                            maxValue : _this.sugerDic[i].maxValue
                        });
                    }
                    // 同步系统时间设置最大选择时间和新增去重key
                    commonApiModel.getServerTime({},function(res){
                        
                        _this.endDate = FormDate(new Date(res.data.data.timestamp),"yyyy-MM-dd");
                        _this.synckey = res.data.data.timestamp;

                        // 如果是修改,获取对象信息
                        let typeStr =  _this.$route.params.reportId;
                        if(typeof(typeStr) == 'undefined' || typeStr.length == 0 || typeStr == 'add'){
                            // 说明是新增,初始化为当前系统时间
                            // TODO:初始化下拉框
                            _this.createTime = res.data.data.currentTime.substring(0,16);
                            _this.limitHourValue = isEmptyString(_this.createTime);
                            _this.getTimeType(_this.createTime,"time");
                            _this.submitFun = "add";
                            _this.changeTextColor();
                            _this.canEdit = false;
                        }else{
                            _this.submitFun = "edit";
                            reportModel.getSugarTestById({testId:typeStr}, function(res){
                                if(!!res.data.data.existsFlag){
                                    let result = res.data.data.sugarTestVo;
                                    if(result.deviceImei){
                                        _this.canEdit = true;
                                    }else{
                                        _this.canEdit = false;
                                    }
                                    _this.sugerValue = result.sugar;
                                    // TODO:初始化下拉框, 颜色
                                    _this.timeType = result.timeType;
                                    for(let i=0; i< _this.sugerDic.length; i++) {
                                        if(_this.timeType == _this.sugerDic[i].timeType){
                                            _this.minValue = _this.sugerDic[i].minValue;
                                            _this.maxValue = _this.sugerDic[i].maxValue;
                                            _this.timeTypeName = _this.sugerDic[i].name;
                                            break;
                                        }
                                    }
                                    // 初始化备注
                                    if (result.tags.length > 0) {
                                        result.tags.forEach((item, index) => {
                                            _this.remarkItemList.forEach((v, i) => {
                                                if(v.typeCode == item.typeCode){
                                                    v.itemKey = item.itemKey;
                                                    v.eachItemText[item.itemKey].isSelected = true;
                                                }
                                            });
                                        });
                                    } else {
                                        if (isEmptyString(result.remark) == '') {
                                            _this.dialogFlag = true;
                                        }
                                    }
                                    _this.createTime = result.createTime.substring(0,16);
                                    _this.limitHourValue = isEmptyString(_this.createTime);
                                    _this.remark = result.remark;
                                    _this.changeTextColor();
                                }else{
                                    _this.hiddenMain = true;
                                }
                            })
                        }
                    });
                });
            },
            getTimeType:function(data,type){
                // date只有时分
                data = data.substring(11);
                data = data.replace(":", ".");
                data = parseFloat(data);
                var _this = this;
                for(let i=0;i<_this.sugerDic.length;i++){
                    if(type=="time"){
                        var dStartTime = parseFloat(_this.sugerDic[i].startTime.replace(":", "."));
                        var dEndTime = parseFloat(_this.sugerDic[i].endTime.replace(":", "."));
                        if (dStartTime == 0 && dEndTime == 23.59) {
                            continue;
                        }
                        if (dStartTime <= dEndTime) {
                            if (data >= dStartTime && data <= dEndTime) {
                                _this.timeType = _this.sugerDic[i].timeType;
                                _this.minValue = _this.sugerDic[i].minValue;
                                _this.maxValue = _this.sugerDic[i].maxValue;
                                _this.timeTypeName = _this.sugerDic[i].name;
                            }
                        } else {
                            if (data >= dStartTime && data <= 23.59) {
                                _this.timeType = _this.sugerDic[i].timeType;
                                _this.minValue = _this.sugerDic[i].minValue;
                                _this.maxValue = _this.sugerDic[i].maxValue;
                                _this.timeTypeName = _this.sugerDic[i].name;
                            }
                            if (data >= 0 && data <= dEndTime) {
                                _this.timeType = _this.sugerDic[i].timeType;
                                _this.minValue = _this.sugerDic[i].minValue;
                                _this.maxValue = _this.sugerDic[i].maxValue;
                                _this.timeTypeName = _this.sugerDic[i].name;
                            }
                        }
                    }else if(type=="timeType"){
                        if(data==_this.sugerDic[i].timeType){
                            _this.minValue = _this.sugerDic[i].minValue;
                            _this.maxValue = _this.sugerDic[i].maxValue;
                        }
                    }
                }
            },
            // 弹出备注统计弹窗
            showRemarkDialog (res) {
                this.reMarkTimes = res.data.data.editcount;
                // 判断背景是金牌还是银牌还是铜牌
                if (this.reMarkTimes * 1 < 13) {
                    this.saveDialogImgUrl = '/static/images/sugarTest/bronzeMedal.png';
                } else if (this.reMarkTimes * 1 > 31) {
                    this.saveDialogImgUrl = '/static/images/sugarTest/goldMedal.png';
                } else {
                    this.saveDialogImgUrl = '/static/images/sugarTest/silverMedal.png';
                }
                this.remarkPersent = res.data.data.percentage;
                this.showMask = true;
                // this.$refs.mask.setScrollTop().afterOpen();
            },
            // 编辑血糖成功处理
            eidiSuccess () {
                if(window.history.length<=1){
                   this.$router.replace("/guess");
                }else{
                   this.$router.go(-1);
                }
            },
            saveSuger:function(){
                var _this = this;
                let remark = _this.remark||"";
                let typeStr =  _this.$route.params.reportId;
                let data = {
                    timeType:_this.timeType,
                    createTime:isEmptyString(_this.createTime)+":00",
                    sugar:_this.sugerValue,
                    remark:remark
                };
                let remarkArr = [];
                if (this.gauger == '2') {
                    data.testType = '2';
                    // 测量人是他人 , 修改成已读
                    if(typeof(typeStr) == 'undefined' || typeStr.length == 0 || typeStr != 'add'){// 说明是修改
                        tangyouCircleModel.setAllReaded({testId: _this.$route.params.reportId}, function(res){
                        });
                    }
                }
                for(let k = 0; k < this.remarkItemList.length; k++){
                    if((this.remarkItemList[k].itemKey + '') != ''){
                        remarkArr.push({
                            typeCode: this.remarkItemList[k].typeCode,
                            typeName: this.remarkItemList[k].typeName,
                            itemKey: this.remarkItemList[k].itemKey,
                            itemValue: this.remarkItemList[k].eachItemText[this.remarkItemList[k].itemKey].text
                        });
                    }
                }
                if(remarkArr.length > 0){
                    data.tags = remarkArr;
                }
                if(_this.saveFlag){
                    if(_this.submitFun == "add"){
                        if(!!_this.sugerValue){
                            if(new Date((_this.limitHourValue).replace(/\-/g, "/")).getTime()>new Date().getTime()){
                                _this.showToast("所选时间不能超过当前时间");
                            }else{
                                data.synckey = _this.synckey;
                                _this.saveFlag = false;
                                reportModel.addSugarTest(data, function(res){
                                    if (remarkArr.length > 0 || isEmptyString(_this.remark) != '') {
                                            _this.showRemarkDialog(res);
                                        setTimeout(() => {
                                            _this.saveFlag = true;
                                            _this.$router.go(-1);
                                        },3000);
                                    } else {
                                        _this.saveFlag = true;
                                        _this.$router.go(-1);
                                    }
                                    
                                })
                            }
                        
                        }else{
                            // 给提示
                            _this.showToast("血糖值不能为空");
                        }
                    }else{
                        if(!!_this.sugerValue){
                            if(new Date((_this.limitHourValue).replace(/\-/g, "/")).getTime()>new Date().getTime()){
                                _this.showToast("所选时间不能超过当前时间");
                            }else{
                                data.testId = _this.$route.params.reportId;
                                _this.saveFlag = false;
                                reportModel.editSugarTest(data, function(res){
                                    _this.saveFlag = true;
                                    // 如果开始编辑没做任何备注 , 首次备注弹窗
                                    if (_this.dialogFlag && (remarkArr.length > 0 || isEmptyString(_this.remark) != '')) {
                                        _this.showRemarkDialog(res);
                                        setTimeout(() => {
                                            _this.eidiSuccess();
                                        },3000);
                                    } else {
                                        _this.eidiSuccess();
                                    }
                                })
                            }
                        }else{
                            _this.showToast("血糖值不能为空");
                        }
                    }
                }
            },
            chooseTimeType:function(){
                this.maskIsShow = true;
                if(this.canEdit){
                    this.timeTypeClass = this.$route.query.timeType;
                }
            },
            selectLi:function(item){
                this.timeType = item.key;
                this.timeTypeName = item.value;
                this.minValue = item.minValue;
                this.maxValue = item.maxValue;
                this.changeTextColor();
            },
            notFocus:function(){
                if(this.sugerValue*1>0&&this.sugerValue*1<0.3){
                    this.showToast("血糖不能低于0.3");
                    this.sugerValue=0.3;
                }else if(this.sugerValue*1>33.3){
                    this.showToast("血糖不能高于33.3");
                    this.sugerValue=33.3;
                    
                }else{
                    this.sugerValue = this.sugerValue*1>0?(this.sugerValue*1).toFixed(1):"";
                }
                
            },
            // 选择测量人
            chooseGauger:function(type){
                if(type == 'self'){
                    this.isSelected = true;
                    this.gauger = '1';
                }else{
                    this.isSelected = false;
                    this.gauger = '2';
                }
            },
            // 选择备注
            selectedRemarkItem:function(item, index, i){
                //循环将当前点击之外的选中状态置为false , 当前点击取反
                for(let j = 0; j < item.eachItemText.length ; j++){
                    j != i ? item.eachItemText[j].isSelected = false : item.eachItemText[j].isSelected = !item.eachItemText[j].isSelected ;
                }
                item.eachItemText[i].isSelected ? item.itemKey = i : item.itemKey = '';
            },
            // 更改血糖值字体颜色
            changeTextColor:function(){
                var _this = this;
                var _sugerValue = parseFloat(_this.sugerValue);
                var _minValue = parseFloat(_this.minValue);
                var _maxValue = parseFloat(_this.maxValue);
                if (typeof(_sugerValue) == '' || !_sugerValue) {
                    _this.sugarValueColor="sugerText tac fl";
                } else if (_sugerValue < _minValue) {
                    _this.sugarValueColor="sugerText tac fl colorLow";
                } else if (_sugerValue <= _maxValue) {
                    _this.sugarValueColor="sugerText tac fl colorBase";
                } else {
                    _this.sugarValueColor="sugerText tac fl colorHight";
                }

            },
            toDataTable:function(){
                this.$router.push('../../guess');
            },
            showConfirm:function(){
                if(this.gauger === '1'){
                    this.show = true;
                }
            },
            // 选择测量人确认
            chooseGaugerConfirm () {
                this.chooseGauger('ather');
            },
            getHealthTip () {
                reportModel.getHealthScienceTip({}, (res) => {
                    this.$refs.healthScience.tipsContent = res.data.data.healthMessage.content;
                })
            }
        },
        beforeMount(){
            this.getSugerDic();
            this.getHealthTip();
        },
        directives:{
            getmargin:{// 计算备注里每个选项的margin值
                inserted:function(el,binding,vnode,oldvnode){
                    let sumWidth = el.offsetWidth;
                    let childrenSumWidth = 0;
                    let paddingRight = window.getComputedStyle(el,null).paddingRight.split('px')[0]*1;
                    for(let i = 0; i < el.children.length ; i++ ){
                        childrenSumWidth = childrenSumWidth + el.children[i].offsetWidth;
                    }
                     for(let i = 0; i < el.children.length ; i++ ){
                         //sumWidth - childrenSumWidth - paddingRight-1   , 减去1是为了消除js浮点数的影响
                        el.children[i].style.marginRight = (sumWidth - childrenSumWidth - paddingRight-1) / (el.children.length - 1) + 'px';
                    }
                    el.children[el.children.length - 1].style.marginRight = '0px';
                }
            },
            TransferDom,
            validateEmoji
        }
    }
</script>
