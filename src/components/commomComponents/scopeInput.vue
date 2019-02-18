<template>
    <div class="inputModel">
        <div class="inputBox pr bgWhite">
            <div class="left fl">
                <img v-if="!(inputName == 'drinkingDaily' || inputName == 'smokingDaily' || inputName == 'complicationsRemark')" class="icon fl" :style="{marginTop:((boxHeight || 1.2) - 0.35)/2 + 'rem'}" :src="iconSrc"/>
                <span class="text fl">{{inputTitle}}</span>
            </div>
            <div class="right">
                <input :class="{tar: true, noCursor:isReadOnly}" v-validateEmoji :type="inputType || 'text'" :readonly="isReadOnly" :placeholder="placeHolderText || '请选择'" v-model="modelValue" @click="defaultCallback" v-on:input="defaultInputCallback" @blur="defaultBlurCallback"/>
            </div>
            <i class="arrow center-y-right" v-if="arrowIsShow || false"></i>
        </div>
        <my-mask 
            v-if="maskShow && isReadOnly && componentType == 'select'"
            :scrollValue="pageScroll">
            <!-- 普通单选框 -->
            <div class="main" slot="footer" v-if="selectType != 'multi'">
                <div class="chooseBox">
                    <span class="giveup fl" @click="cancel">取消</span>
                    <span class="confirm fr" @click="confirm">确定</span>
                </div>
                <ul>
                    <li class="item pr" v-for="(item,index) in itemLiList" :key="index" @click="chooseLi(index,item.itemKey,item.itemValue)">
                        <i class="center-y" v-show="isSelected==index"></i>
                        <span>{{item.itemValue}}</span>
                    </li>
                </ul>
            </div>
            <!-- 并发症复选框 -->
            <div class="main" slot="footer" v-if="selectType == 'multi'">
                <div class="chooseBox">
                    <span class="giveup fl" @click="cancel">取消</span>
                    <span class="confirm fr" @click="confirm">确定</span>
                </div>
                <ul>
                    <li class="item pr" v-for="(item,index) in itemLiList" :key="index" @click="chooseLiMulti(index,item.itemKey,item.itemValue)">
                        <i v-if="chooseIconIsCreat" :ref="'multiLi' + index" class="center-y chooseIcon" style="display:none"></i>
                        <span>{{item.itemValue}}</span>
                    </li>
                </ul>
            </div>
        </my-mask>
    </div>
</template>
<style scoped lang='less'>
    *{
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-tap-highlight-color: transparent;
    }
    input, textarea{
        -webkit-appearance:none; /*去除input默认样式*/
        padding: 0px;
    }
    input[type="text number"]::-webkit-search-decoration,
    input[type="text number"]::-webkit-search-cancel-button,
    input[type="text number"]::-webkit-search-results-button,
    input[type="text number"]::-webkit-search-results-decoration{
        display: none;
    }
    .inputBox{
        width: 100%;
        height: 1.2rem;
        padding-left: 0.4rem;
        border-bottom: 1px solid #EFEFF4;
        font-size: 0.35rem;
    }
    .left{
        height: 100%;
        color: #111;
        line-height: 1.2rem;
    }
    .left img{
        display: inline-block;
        width: 0.35rem;
        height: 0.35rem;
        margin-right: 0.2rem;
    }
    .right{
        overflow: hidden;
        height: 100%;
        padding-right: 0.6rem;
        color: #000;
    }
    .right input{
        width: 100%;
        height: 1.2rem;
        padding: 0.4rem 0 0.4rem 0.25rem;
        box-sizing: border-box;
        font-size: 0.35rem;
        -webkit-box-sizing: border-box;
    }
    .noCursor{
        //readonly消除光标
        -webkit-user-select:none;
    }
    .right input::-webkit-input-placeholder{
        color: #999;
    }
    .arrow{
        width: 0.18rem;
        height: 0.3rem;
        right: 0.25rem;
        background: url('/static/images/customer/home_but_enter.png') no-repeat;
        background-size: cover;
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
</style>
<script>
import myMask from './myMask'
import {validateEmoji} from '../../directives'
export default {
    name:'scopeInput',
    data () {
        return {
            list: [],
            isSelected: null,
            chooseIconIsCreat: true,
            pageScroll: '',
            maskShow: false,
            modelValue: '', // 初始化以及表单点击确认后表单展示的值
            chooseLiValue: '', //点击每个下拉框li将值暂存
            multiIndex: [], // 复选框选中的index值暂存
            chooseKey: ''
        }
    },
    methods: {
        defaultCallback () {
            this.maskShow = true;
            // this.multiIndex = [];
            if (this.selectType == 'multi') {
                this.$nextTick(function () {
                    this.multiIndex.forEach(item => {
                        this.$refs['multiLi' + item][0].style.display = 'block';
                    });
                });
            }
            this.pageScroll = document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop;
            if (this.inputScopeCallback) {
                this.inputScopeCallback();
            }
        },
        cancel () {
            this.maskShow = false;
        },
        confirm () {
            if (this.selectType == 'single') {
                this.modelValue = this.chooseLiValue;
            } else {
                this.modelValue = '';
                this.chooseKey = '';
                this.multiIndex.forEach(ite => {
                    this.modelValue = this.modelValue + this.itemLiList[ite].itemValue + ',';
                    this.chooseKey = this.chooseKey +this.itemLiList[ite].itemKey + ',';
                });
                // console.log(this.modelValue);
                this.modelValue = this.modelValue.substring(0, this.modelValue.length-1);
                this.chooseKey = this.chooseKey.substring(0, this.chooseKey.length-1);
            }
            this.$emit('changeValue', this.modelValue, this.inputName, this.chooseKey);
            this.maskShow = false;
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
        chooseLiMulti (index, key, value) { // 并发症复选框逻辑
            if (value != '无') {
                if (this.$refs['multiLi' + index][0].style.display == 'none') {
                    this.$refs['multiLi' + index][0].style.display = 'block';
                    this.multiIndex.push(index);
                } else {
                    this.$refs['multiLi' + index][0].style.display = 'none';
                    this.multiIndex.forEach((item, ind) => {
                        if (item == index) {
                            this.multiIndex.splice(ind, 1);
                        }
                    });
                }
                if (this.multiIndex.indexOf(0) !== -1) {
                    this.$refs['multiLi0'][0].style.display = 'none';
                    this.multiIndex.splice(this.multiIndex.indexOf(0), 1);
                }
            } else {
                this.multiIndex = [];
                this.multiIndex.push(index);
                for (const key in this.$refs) {
                    this.$refs[key][0].style.display = 'none';
                }
                if (this.$refs['multiLi' + index][0].style.display == 'none') {
                    this.$refs['multiLi' + index][0].style.display = 'block';
                } else {
                    this.$refs['multiLi' + index][0].style.display = 'none';
                }
            }
        },
        setList () {
            this.list = this.itemLiList;
        },
        defaultInputCallback () {
            this.$emit('sendInputValue', this.modelValue, this.inputName);
        },
        defaultBlurCallback () {
            if (this.inputName == 'height' || this.inputName == 'weight') {
                if (!/^\d+(\.\d+)?$/.test(this.modelValue)) {
                    this.modelValue = '';
                }
            }
            this.$emit('inputBlurCallback', this.modelValue, this.inputName);
        }
    },
    created () {
        if (!!this.inputValue) {
            this.modelValue = this.inputValue;
            if (!!this.itemLiList) {
                this.itemLiList.forEach((item, index) => {
                    if (item.itemValue == this.inputValue) {
                        this.isSelected = index;
                    }
                });
            }
        }
    },
    components: {
        myMask
    },
    watch: {
        'itemLiList': function () {
            this.setList();
        },
        'inputValue': function () { // 监听父组件props变化 , 进行赋值
            this.modelValue = this.inputValue;
            this.chooseLiValue = this.inputValue;
            if (this.selectType == 'single') {
                this.itemLiList.forEach((item, index) => {
                    if (item.itemValue == this.inputValue) {
                        this.isSelected = index;
                        this.chooseKey = item.itemKey;
                    }
                });
            } else if (this.selectType == 'multi' && this.inputValue.length > 0) { // 多选逻辑
                this.multiIndex = [];
                this.itemLiList.forEach((item, index) => {
                    this.inputValue.split(',').forEach((ite, ind) => {
                        if (item.itemValue == ite) {
                            this.multiIndex.push(index);
                            this.chooseKey = this.chooseKey + index + ',';
                        }
                    });
                });
                this.chooseKey = this.chooseKey.substring(0,this.chooseKey.length - 1);
            }
        }
    },
    directives: {
        validateEmoji
    },
    props:['inputName', 'boxHeight','iconSrc','inputType', 'selectType', 'componentType', 'inputTitle', 'isReadOnly', 'placeHolderText', 'inputValue', 'inputCallback', 'arrowIsShow', 'itemLiList', 'inputScopeCallback']
}
</script>

