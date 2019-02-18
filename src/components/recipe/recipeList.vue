<template>
    <div class="fullPage recipeListPage">
        <commomHeader :headerTitle="headerTitle"></commomHeader>
        <mescroll-vue class="containerScroll" ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
            <ul v-if="recipeList.length > 0" class="bgWhite">
                <li class="each-recipe tal bdbBase pr" v-for="(item, index) in recipeList" :key="index" @click="toRecipeDetail(item)">
                    <p class="doctor-name fontSize36">{{item.userName}}</p>
                    <p class="recipe-content fontSize32">{{item.rxContent.length > 14 ? item.rxContent.substring(0, 14) + '...' : item.rxContent}}</p>
                    <p class="recipe-time color999">{{item.createTime}}</p>
                    <i class="center-y arrow"></i>
                </li>
            </ul>
        </mescroll-vue>
        <p class="fontSize32 tac noRecipeList" v-if="recipeList.length == 0">暂无记录</p>
    </div>
</template>
<style lang="less" scoped>
    .recipeListPage::-webkit-scrollbar{
        display: none;
    }
    .each-recipe{
        height: 1.76rem;
        padding: 0.18rem 0.3rem 0;
    }
    .recipe-time{
        font-size: 0.2rem;
    }
    .arrow{
        display: block;
        width: 0.18rem;
        height: 0.3rem;
        left: 7.02rem;
        background: url('/static/images/customer/home_but_enter.png') no-repeat;
        background-size: cover;
    }
    .noRecipeList{
        margin-top: 1rem;
    }
</style>
<script>
import commomHeader from "../commomComponents/header"
import {recipeModel} from '../../api'
import MescrollVue from 'mescroll.js/mescroll.vue'
import {FormDate} from '../../utils/utils'
export default {
    name: 'recipeList',
    data () {
        return{
            headerTitle: '处方记录',
            recipeList: [],
            pageNo: 1,
            pageSize: 10,
            mescroll: null,
            mescrollDown: {
                use: false
            },
            mescrollUp: { // 上拉加载的配置.
                callback: this.getRecipeList,
                page: {
                    num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                    size: 10 //每页数据条数,默认10
                },
                noMoreSize: 5,
                isLock: false
            }
        }
    },
    methods: {
        toRecipeDetail (item) {
            this.$router.push({path: '/recipe/recipeDetail', query: {recipeId: item.infoId}})
        },
        getRecipeList (page, mescroll) {
            recipeModel.getRecipeList({pageNo: page.num, pageSize: page.size}, res => {
                if(res.data.data.pageNo >= res.data.data.pageCount){
                    this.mescrollUp.isLock = true;
                } else {
                    this.mescrollUp.isLock = false;
                }
                let list = res.data.data.rxInfoVos;
                if (list) {
                    list.forEach(item => {
                        item.createTime = FormDate(item.createTime, 'yyyy-MM-dd hh:mm');
                    });
                    this.recipeList = this.recipeList.concat(list);
                }
                this.$nextTick(() => {
                    mescroll.endSuccess(res.data.data.rxInfoVos ? res.data.data.rxInfoVos.length : 0);
                });
            }, err => {
                mescroll.endErr();
            });
        },
        mescrollInit (mescroll) {
            this.mescroll = mescroll;
        }
    },
    components: {
        commomHeader,
        MescrollVue
    }
}
</script>
