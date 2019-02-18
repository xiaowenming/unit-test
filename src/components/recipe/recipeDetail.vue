<template>
    <div class="fullPage reciptDetailPage noScrollbar">
        <commomHeader :headerTitle="headerTitle"></commomHeader>
        <div class="qrcoed">
            <img :src="qrCodeUrl" alt="">
        </div>
        <p class="tal drugstore fontSize36" v-if="recipeDetail">药店: <span>{{recipeDetail.rxRecord.storeName}}</span></p>
        <p class="tal drugstore-address fontSize36" v-if="recipeDetail">取药地址: <span>{{recipeDetail.rxRecord.storeAddress}}</span></p>
        <div class="recipe-main tal colorBlack" v-if="recipeDetail">
            <p class="hospital-name tac">{{recipeDetail.user.organName}}</p>
            <p class="recipe-number fontSize36">处方编码: {{recipeDetail.rxInfo.rxCode}}</p>
            <p class="diagnose-number fontSize36">诊号: {{recipeDetail.rxInfo.patientNo}}</p>
            <div class="patient-info fontSize36">
                <p>
                    <span class="patient-name">患者姓名: {{recipeDetail.customer.patientName}}</span>
                    <span class="patient-gender">性别: {{recipeDetail.customer.sex}}</span>
                    <span class="patient-old">年龄: {{getBirth(recipeDetail.customer.birthday)}}</span>
                </p>
                <p class="clearfix">
                    <span class="department fl">科室: {{recipeDetail.user.departmentName}}</span>
                    <span class="phone fr">手机号: {{recipeDetail.customer.phone}}</span>
                </p>
                <div class="diagnose">诊断:
                    <p  v-for="(item, index) in recipeDetail.rxContent"
                        :key="index">
                        {{index + 1}}、{{item.content}}
                    </p>
                </div>
            </div>
            <div class="drug-detail fontSize32">
                <p class="title">Rp:</p>
                <ul>
                    <li
                        class="each-drug"
                        v-for="(item, index) in recipeDetail.rxMedicineRelationship"
                        :key="index">
                            <p class="fw700 line1 clearfix">
                                <span class="drug-number fl">{{index + 1}}</span><span class="fl">.&nbsp;</span>
                                <span class="durg-name fl">{{item.medicineName}}</span>
                                <span class="durg-spec fr">{{item.specification}}</span>
                            </p>
                        <p class="line2">用法: <span>{{item.dosage}}</span> <span>{{item.rate}}</span> <span>{{item.usaged}}</span></p>
                    </li>
                </ul>
                <p class="tal tip">温馨提示: 购买药品后才能显示完整处方信息 , 并由专业的药师指导服用药品</p>
                <div class="recipe-info">
                    <p>医生: <span class="doctor-name">{{recipeDetail.user.nickName}}</span></p>
                    <p>开药日期: <span class="recipe-time">{{FormDate(recipeDetail.rxInfo.createTime)}}</span></p>
                    <p>审核药师: <span class="audit-apothecary">{{recipeDetail.rxInfo.auditUserName}}</span></p>
                    <p>审核日期: <span class="audit-time"></span>{{FormDate(recipeDetail.rxInfo.auditTime)}}</p>
                    <p>医生签名: </p>
                    <p>药师签名: </p>
                </div>
                <p class="tal tip">注意: 处方仅限本院指定药店配送, 自行下载配药不具有处方效力</p>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
    .reciptDetailPage{
        overflow-y: scroll;
        .qrcoed{
            margin-top: 0.4rem;
            img{
                width: 3rem;
                height: 3rem;
                margin: 0 auto;
            }
        }
        .drugstore, .drugstore-address{
            padding-left: 0.3rem;
            color: #000;
        }
        .drugstore-address{
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #EFEFF4;
        }
        .recipe-main{
            padding: 0.3rem;
            .hospital-name{
                font-size: 0.44rem;
                margin-bottom: 0.15rem;
            }
            .recipe-number, .diagnose-number{
                margin-bottom: 0.1rem;
            }
            .patient-info{
                padding: 0.2rem 0;
                border-top: 1px solid #000;
                border-bottom: 1px solid #000;
                .patient-name, .patient-gender{
                    padding-right: 0.3rem;
                }
                .diagnose{
                    p{
                        padding-left: 0.3rem;
                    }
                }
            }
            .drug-detail{
                .title{
                    font-size: 0.44rem;
                    padding: 0.2rem 0;
                }
                .each-drug{
                    margin-bottom: 0.4rem;
                    .line1{
                        padding-left: 0.4rem;
                        .durg-spec{
                            font-weight: normal;
                        }
                    }
                    .line2{
                        padding-left: 0.7rem;
                        margin-top: 0.1rem;
                    }
                }
                .tip{
                    color: #FB9120;
                    padding-bottom: 0.6rem;
                }
                .recipe-info{
                    padding-top: 0.2rem;
                    border-top: 1px solid #000;
                }
            }
        }
    }
</style>
<script>
import commomHeader from "../commomComponents/header";
import {recipeModel} from '../../api';
import {getBirth, getGender, FormDate} from '../../utils/utils'
export default {
    name: 'recipeDetail',
    data () {
        return{
            headerTitle: '处方详情',
            recipeDetail: null,
            qrCodeUrl: '',
            webim: require('../../../static/js/tencentIMJS/webim.js'),
        }
    },
    methods: {
        getRecipeDetail () {
            recipeModel.getRecipeDetail({infoId: this.$route.query.recipeId}, res => {
                this.recipeDetail = res.data.data;
                if (this.recipeDetail.rxSealExtend.length > 0) {
                    this.recipeDetail.rxSealExtend.forEach(ele => {
                        if (ele.type == '1') {
                            this.qrCodeUrl = ele.imgUrl;
                        }
                    });
                }
            });
        },
        getBirth(birth){
          return getBirth(birth);
        },
        FormDate(date){
          return FormDate(date);
        }
    },
    created () {
        this.getRecipeDetail();
    },
    components: {
        commomHeader
    }
}
</script>
