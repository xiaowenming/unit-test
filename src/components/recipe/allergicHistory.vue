<template>
    <div class="fullPage allergicHistoryPage bgBaseGray pr">
        <commomHeader :headerTitle="headerTitle"></commomHeader>
        <ul class="bgWhite">
            <li class="eachAllergicItem tal colorBlack fontSize36 bdbBase pr" 
                v-for="(item, index) in allergicList" 
                :key="index" 
                @click="chooseLi(index)">
                    <p class="allergicName">{{item.itemValue}}</p>
                    <i class="choosed center-y-right" v-show="item.show"></i>
            </li>
        </ul>
        <div class="bgBaseGray hei20"></div>
        <textarea class="moreAllergic w100 bdn fontSize36" v-model="allergicDetail" :disabled="textareaIsDisanle" :placeholder="'过敏史选择其他时 , 可输入补充你的药物过敏情况'"></textarea>
        <div class="comfirm bgBase poab w100 h1rem colorWhite fontSize36" @click="confirmAllergic">确定</div>
    </div>
</template>
<style lang="less" scoped>
    .eachAllergicItem{
        height: 1.21rem;
        line-height: 1.21rem;
        padding-left: 0.3rem;
    }
    .moreAllergic{
        height: 4rem;
        padding: 0.3rem;
    }
    .comfirm{
        line-height: 1rem;
    }
    .choosed{
        display: block;
        width: 0.312rem;
        height: 0.228rem;
        right: 0.3rem;
        background: url('/static/images/recipe/choosed.png') no-repeat;
        background-size: cover;
    }
</style>
<script>
import commomHeader from "../commomComponents/header";
import {IsInArray, validateString} from '../../utils/validate';
import {commonApiModel} from '../../api'
const multiChooseList = [1, 2, 3];
export default {
    name: 'allergicHistory',
    data () {
        return{
            headerTitle: '过敏史',
            allergicList: [],
            allergicDetail: '',
            textareaIsDisanle: true,
            selected: []
        }
    },
    methods: {
        getAllergicHistoryDic () {
            commonApiModel.getDcByCode({typeCode: 'allergic_history'}, res => {
                this.allergicList = res.data.data.items.map(item => {
                    item.show = false;
                    return item;
                });
                this.setSelected();
            });
        },
        chooseLi (index) {
            if (IsInArray(multiChooseList, index)) {
                this.allergicList[0].show = false;
                this.allergicList[4].show = false;
                this.allergicList[index].show = true;
                this.textareaIsDisanle = true;
            } else {
                this.allergicList.forEach((ite, ind) => {
                    if (ind != index) {
                        this.allergicList[ind].show = false;
                    } else {
                        this.allergicList[ind].show = true;
                    }
                    if (index == 5) {
                        this.textareaIsDisanle = false;
                    } else {
                        this.textareaIsDisanle = true;
                    }
                });
            }
        },
        confirmAllergic () {
            let str = '';
            this.allergicList.forEach(item => {
                if (item.show == true) {
                    str = str + item.itemValue + ',';
                }
            });
            str = str.substring(0 ,str.length - 1);
            if (!validateString(str)) {
                this.showToast('请选择过敏史');
            } else if (!this.textareaIsDisanle && !validateString(this.allergicDetail)) {
                this.showToast('请输入详细过敏史');
            } else {
                let data = JSON.stringify({allergicHistoryItem: str, allergicDetail: this.allergicDetail});
                sessionStorage.setItem('allergicData', data);
                this.$router.push('/recipe/discripIllness');
            }
        },
        setSelected () {
            if (sessionStorage.getItem('allergicData')) {
                let allergicHistoryStr = JSON.parse(sessionStorage.getItem('allergicData')).allergicHistoryItem;
                this.selected = allergicHistoryStr.split(',');
                this.allergicList.forEach(item => {
                    this.selected.forEach(ele => {
                        if (item.itemValue == ele) {
                            item.show = true;
                            if (item.itemKey == 6) {
                                this.textareaIsDisanle = false;
                                this.allergicDetail = JSON.parse(sessionStorage.getItem('allergicData')).allergicDetail;
                            }
                        }
                    });
                });
            }
        }
    },
    created () {
        this.getAllergicHistoryDic();
    },
    components: {
        commomHeader
    }
}
</script>
