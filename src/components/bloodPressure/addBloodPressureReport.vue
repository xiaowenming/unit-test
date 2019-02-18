<template>
    <div class="addHyperReportPage fullPage">
        <commomHeader :headerTitle="headerTitle"></commomHeader>
        <div class="normalInput eachItem pr">
            <div class="fl left tal">收缩压 (mm Hg)</div>
            <input type="number" :readonly="isTestByDevice" v-model="systolic" :class="{fr:true, h100:true, right:true, tar:true, noSelect: isTestByDevice}" placeholder="未填写">
        </div>
        <div class="normalInput eachItem pr">
            <div class="fl left tal">舒张压 (mm Hg)</div>
            <input type="number" :readonly="isTestByDevice" v-model="diastolic" class="fr h100 right tar" :class="{fr:true, h100:true, right:true, tar:true, noSelect: isTestByDevice}" placeholder="未填写">
        </div>
        <div class="normalInput eachItem pr">
            <div class="fl left tal">脉搏 (PM)</div>
            <input type="number" :readonly="isTestByDevice" v-model="pulse" class="fr h100 right tar" :class="{fr:true, h100:true, right:true, tar:true, noSelect: isTestByDevice}" placeholder="未填写">
        </div>
        <scope-datetime 
            :placeHolderText="'未选择'"
            :arrowIsShow="true"
            :inputTitle="'时间'"
            :inputValue="createTime"
            :isReadonly="isTestByDevice"
            :format="'YYYY-MM-DD HH:mm'"
            :inputName="'time'"
            v-on:sendInputValue="setValue">
        </scope-datetime>
        <div class="title tal fontSize32">备注</div>
        <textarea class="remark w100 tar fontSize32" maxlength="140" placeholder="请填写详细内容" v-model="remark"></textarea>
        <div class="save fontSize36 bgBase w100 colorWhite" @click="addBloodPressureReport">保存</div>
    </div>
</template>
<style>
    .addHyperReportPage .weui-cell_access .weui-cell__ft:after{
        display: none;
    }
    .addHyperReportPage .vux-cell-value{
        color: #000;
    }
</style>
<style lang="less" scoped>
    .title{
        height: 0.8rem;
        line-height: 0.8rem;
        padding-left: 0.4rem;
        background-color: #f4f4f4;
    }
    .remark{
        height: 5rem;
        border: none;
        padding: 0.2rem;
    }
    .remark::-webkit-input-placeholder{
        text-align: right;
        color: #999;
    }
    .save{
        height: 1rem;
        line-height: 1rem;
        position: fixed;
        bottom: 0;
    }
    .addHyperReportPage .left{
        width: 50%;
    }
    .addHyperReportPage .right{
        width: 50%;
    }
    .normalInput input.noSelect{
        -webkit-user-select: none;
    }
</style>
<script>
import commomHeader from "../commomComponents/header";
import scopeDatetime from '../commomComponents/scopeDatetime';
import myTextarea from '../commomComponents/myTextarea';
import {reportModel} from '../../api';
import {validateString, validateLessNumber, validateUpperNumber} from '../../utils/validate';
import {FormDate} from '../../utils/utils';
export default {
    name: 'addBloodPressureReport',
    data () {
        return {
            headerTitle: '添加血压',
            systolic: '', //收缩压
            diastolic: '', // 舒张压
            pulse:'', // 脉搏
            createTime: '',
            remark: '',
            addFlag: true,
            isTestByDevice: false,
            canEdit: true,
            subType: 'add',
            bpId: ''
        }
    },
    methods: {
        setValue (value) {
            this.createTime = value;
        },
        addBloodPressureReport () {
            if (!validateString(this.systolic)) {
                this.showToast('请填写收缩压');
            } else if (validateLessNumber(this.systolic, 1) || validateUpperNumber(this.systolic, 250)) {
                this.showToast('收缩压范围在1~250之间');
            } else if (!validateString(this.diastolic)) {
                this.showToast('请填写舒张压');
            } else if (validateLessNumber(this.diastolic, 1) || validateUpperNumber(this.diastolic, 250)) {
                this.showToast('舒张压范围在1~250之间');
            } else if (!validateString(this.pulse)) {
                this.showToast('请填写脉搏');
            } else if (validateLessNumber(this.pulse, 1) || validateUpperNumber(this.pulse, 250)) {
                this.showToast('脉搏范围在1~250之间');
            } else {
                let data = {sbp: this.systolic, dbp: this.diastolic, hr: this.pulse, createTimeStr: this.createTime + ':00'};
                if (validateString(this.remark)) {
                    data.remark = this.remark;
                }
                if (this.addFlag) {
                    this.addFlag = false;
                    if (this.subType == 'add') {
                        reportModel.addHypertensionReport(data, res => {
                            this.addFlag = true;
                            this.$router.go(-1);
                        }, err => {
                            this.addFlag = true;
                        });
                    } else {
                        data.bpId = this.bpId;
                        reportModel.editHypertensionReport(data, res => {
                            this.addFlag = true;
                            if (window.history.length <= 1) {
                                sessionStorage.setItem('currentComponentsIndex', '3');
                                this.$router.replace("/guess");
                            } else {
                                this.$router.go(-1);
                            }
                        }, err => {
                            this.addFlag = true;
                        });
                    }
                }
            }
        },
        getHyperReportById (id) {
            let data = {bpId: id};
            reportModel.getHypertensionById(data, res => {
                let testData = res.data.data.bloodPressureVo;
                if (!!testData && validateString(testData.deviceImei)) {
                    this.isTestByDevice = true;
                } else {
                    this.isTestByDevice = false;
                }
                this.systolic = testData.sbp;
                this.diastolic = testData.dbp;
                this.createTime = testData.createTime.substring(0, 16);
                this.pulse = testData.hr;
                this.remark = testData.remark;
                this.bpId = testData.bpId;
            });
        },
        initPage () {
            let param = this.$route.params.hyperReportId;
            if (param != 'add') {
                this.subType = 'edit';
                this.getHyperReportById(param)
            } else {
                this.createTime = FormDate(new Date().getTime(), 'yyyy-MM-dd hh:mm');
            }
        }
    },
    created () {
        this.initPage();
    },
    components: {
        commomHeader,
        scopeDatetime
    }
}
</script>
