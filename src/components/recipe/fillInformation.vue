<template>
    <div class="fullPage pr fillInforPage">
        <commomHeader :headerTitle="headerTitle"></commomHeader>
        <div class="normalInput eachItem">
            <div class="fl left tal">姓名</div>
            <input type="text" class="fr h100 right tar" v-model="userInfo.patientName" placeholder="请填写真实姓名">
        </div>
        <div class="normalInput eachItem">
            <div class="fl left tal">身份证号</div>
            <input type="text" class="fr h100 right tar" v-model="userInfo.idCard" placeholder="未填写">
        </div>
        <scope-datetime 
            :placeHolderText="'请选择出生日期'"
            :arrowIsShow="true"
            :inputTitle="'出生日期'"
            :inputValue="birthDay"
            :inputName="'birthDay'"
            v-on:sendInputValue="setValue">
        </scope-datetime>
        <div class="normalInput eachItem pr hasArrow" @click="showMaskEvent">
            <div class="fl left tal">性别</div>
            <input type="text" readonly class="fr h100 right tar noCursor" v-model="userInfo.sex" placeholder="未选择">
            <i class="arrow center-y"></i>
        </div>
        <div class="normalInput eachItem">
            <div class="fl left tal">手机号</div>
            <input type="text" class="fr h100 right tar" :readonly="!!phone" v-model="phone" placeholder="未填写">
        </div>
        <div class="saveInfo bgBase w100" @click="saveInfo">保存</div>
        <div v-transfer-dom>
            <confirm v-model="show"
            :title="('')"
            :cancel-text="'否'"
            :confirm-text="'是'"
            @on-cancel="onCancel">
                <p class="tal" style="color: #000">{{ (content) }}</p>
            </confirm>
        </div>
        <my-mask 
            v-if="maskShow">
            <!-- 普通单选框 -->
            <div class="main" slot="footer">
                <div class="chooseBox">
                    <span class="giveup fl" @click="cancel">取消</span>
                    <span class="confirm fr" @click="confirm">确定</span>
                </div>
                <ul>
                    <li class="item pr" v-for="(item,index) in itemLiList" :key="index" @click="chooseLi(index,item.itemKey,item.itemValue)">
                        <i class="center-y" v-show="isSelected == index"></i>
                        <span>{{item.itemValue}}</span>
                    </li>
                </ul>
            </div>
        </my-mask>
    </div>
</template>
<style>
    .fillInforPage .weui-cell_access .weui-cell__ft:after{
        display: none;
    }
    .fillInforPage .vux-cell-value{
        color: #000;
    }
</style>

<style lang="less" scoped>
    .fillInforPage{
        background: #EFEFF4;
    }
    .normalInput .right{
        width: 4.9rem;
    }
    .main .chooseBox{
        width: 100%;
        height: 0.8rem;
        line-height: 0.8rem;
        font-size: 0.32rem;
        padding: 0 0.2rem;
        background-color: #fff;
    }
    .chooseBox span{
        display: block;
        width: 50%;
        text-align: center;
    }
    .main .item{
        height: 1.1rem;
        line-height: 1.1rem;
        font-size: 0.36rem;
        border-top: 1px solid #e0e0e0;
    }
    .main ul{
        background-color: #fff;
        max-height: 4.4rem;
        overflow: scroll;
    }
    .main{
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 120;
        overflow: scroll;
    }
    .main .item i{
        width: 0.4rem;
        height: 0.4rem;
        vertical-align: middle;
        position: absolute;
        left: 10%;
        background:url("/static/images/patient/jkda_select_icon.png") no-repeat;
        background-size: cover;
    }
    .saveInfo{
        height: 1rem;
        line-height: 1rem;
        font-size: 0.35rem;
        position: absolute;
        bottom: 0;
        left: 0;
        color: white;
    }
    .noCursor{
        //readonly消除光标
        -webkit-user-select:none;
    }
</style>
<script>
import commomHeader from "../commomComponents/header"
import myMask from '../commomComponents/myMask'
import {Confirm, TransferDomDirective as TransferDom } from 'vux'
import {userModel} from '../../api'
import {validateString, validateIdCard} from '../../utils/validate'
import scopeDatetime from '../commomComponents/scopeDatetime'
export default {
    name: 'fillInformation',
    data () {
        return{
            headerTitle: '填写信息',
            maskShow: false,
            itemLiList: [
                {itemKey: '1', itemValue: '男'},
                {itemKey: '2', itemValue: '女'},
                {itemKey: '0', itemValue: '未知'}
            ],
            genderObj: {
                0: '未知',
                1: '男',
                2: '女'
            },
            birthDay: '',
            isSelected: null,
            show: true,
            content: '申请开处方功能只面向糖尿病的就诊用户哦, 请问您是复诊用户吗？',
            userInfo: {},
            subData: {},
            phone: ''
        }
    },
    methods: {
        getHealthInfo () {
            userModel.getUserHealthInfo({}, res => {
                this.userInfo = res.data.data;
                this.itemLiList.forEach((item, index) => {
                    if (item.itemKey == this.userInfo.sex) {
                        this.isSelected = index;
                    }
                });
                if (validateString(validateString)) {
                    this.userInfo.sex = this.genderObj[this.userInfo.sex];
                }
                if (!!res.data.data.birthday) {
                    this.birthDay = res.data.data.birthday.substring(0, 11);
                }
                userModel.getUserInfo({}, res => {
                    this.phone = res.data.data.customerVo.phone;
                });
            });
            
        },
        setValue (value, name, index) {
            this.birthDay = value;
        },
        showMaskEvent () {
            this.maskShow = true;
        },
        chooseLi (index, key, value) {
            if (this.isSelected == index) {
                this.isSelected = null;
                this.chooseLiValue = '';
                this.chooseKey = '';
            } else {
                this.isSelected = index;
                this.chooseLiValue = value;
                this.chooseKey = key;
            }
        },
        cancel () {
            this.maskShow = false;
        },
        confirm () {
            if (this.isSelected == null) {
                this.userInfo.sex = '';
            } else {
                this.userInfo.sex = this.itemLiList[this.isSelected].itemValue;
            }
            this.maskShow = false;
        },
        onCancel () {
            this.$router.push('/');
        },
        saveInfo () {
            if (validateString(this.userInfo.idCard) && validateString(this.userInfo.sex) && validateString(this.userInfo.patientName) && validateString(this.birthDay)) {
                if (validateIdCard(this.userInfo.idCard)) {
                    this.subData = Object.assign({}, this.userInfo);
                    this.subData.phone = this.phone;
                    this.subData.birthday = this.birthDay;
                    for (const key in this.genderObj) {
                        if (this.genderObj.hasOwnProperty(key)) {
                            const element = this.genderObj[key];
                            if (element == this.userInfo.sex) {
                                this.subData.sex = key;
                            }
                        }
                    }
                    userModel.subUserHealthInfo(this.subData, res => {
                        this.$router.push({path: '/recipe/discripIllness',});
                    });
                } else {
                    this.showToast('请输入正确的身份证号');
                }
            } else {
                this.showToast('所有选项都为必填');
            }
        }
    },
    created () {
        this.getHealthInfo();
    },
    components: {
        commomHeader,
        myMask,
        Confirm,
        scopeDatetime
    },
    directives: {
        TransferDom
    }
}
</script>
