<template>
    <div class="fullPage chooseDrugStorePage">
        <commomHeader :headerTitle="headerTitle"></commomHeader>
        <ul class="bgWhite">
            <li class="each-drug tal pr" v-for="(item, index) in drugStoreList" :key="index" @click="chooseDrugStore(item, index)">
                <div class="drug-name">{{item.store}}</div>
                <p class="drug-address color999">{{item.address}}</p>
                <i class="choosed center-y-right" v-show="selected === index"></i>
            </li>
        </ul>
    </div>
</template>
<style lang="less" scoped>
    .each-drug{
        height: 1.41rem;
        padding: 0.28rem 0.3rem 0;
        border-bottom: 1px solid #EFEFF4;
        .drug-name{
            height: 0.45rem;
            font-size: 0.34rem
        }
        .drug-address{
            height: 0.36rem;
            line-height: 0.36rem;
            font-size: 0.32rem;
        }
        .choosed{
            display: block;
            width: 0.312rem;
            height: 0.228rem;
            right: 0.3rem;
            background: url('/static/images/recipe/choosed.png') no-repeat;
            background-size: cover;
        }
    }
</style>
<script>
import commomHeader from "../commomComponents/header"
import {eventBus} from '../../utils/eventBus'
import {recipeModel} from '../../api'
export default {
    name: 'chooseDrugStore',
    data () {
        return{
            headerTitle: '选择药店',
            drugStoreList: [
                // {addressId: '123456', store: '南北药房', address: '深圳市高新北五道博讯大厦'}
            ],
            selected: null
        }
    },
    methods: {
        getDrugStoreList () {
            let data = JSON.parse(sessionStorage.getItem('locationData'));
            recipeModel.getDrugStoreByLocation(data, res => {
                this.drugStoreList = res.data.data.items;
            });
        },
        chooseDrugStore (item, index) {
            this.selected = index;
            let data = JSON.stringify({
                    storeId: item.addressId,
                    storeName: item.store,
                    storeAddress: item.address
                });
            sessionStorage.setItem('durgStoreData', data);
            this.$router.push({
                path: '/recipe/discripIllness'
            });
        }
    },
    created () {
        this.getDrugStoreList();
    },
    components: {
        commomHeader
    }
}
</script>
