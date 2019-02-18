<template>
    <div class="hyperReportTablePage">
        <mescroll-vue class="container" ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
            <table class="bloodPressureTable w100">
                <thead>
                    <tr>
                        <td>日期</td>
                        <td class="bgGray">
                            <p>收缩压</p>
                            <p>(mm Hg)</p>
                        </td>
                        <td>
                            <p>舒张压</p>
                            <p>(mm Hg)</p>
                        </td>
                        <td class="bgGray">
                            <p>脉搏</p>
                            <p>(PM)</p>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in hyperReportList" :key="index" @click="clickEachLine(item)">
                        <td>{{item.createTime ? item.createTime.substring(0, 16) : ''}}</td>
                        <td class="bgGray">{{item.sbp}}</td>
                        <td>{{item.dbp}}</td>
                        <td class="bgGray">{{item.hr}}</td>
                    </tr>
                </tbody>
            </table>
        </mescroll-vue>
        <div class="noData fontSize32 tac w100 colorBlack" v-if="!hyperReportList || hyperReportList.length == 0">暂无血压数据</div>
        <div class="addHypertensionReport" @click="toAddHyperReport">
            <img src="/static/images/sugarTestReport/add_blood_but.png" alt="">
        </div>
    </div>
</template>
<style lang="less" scoped>
    .hyperReportTablePage{
        .container{
            position: fixed;
            top: 1.22rem;
            padding-bottom: 1.2rem;
        }
        .bloodPressureTable{
            color: #666;
            font-size: 0.28rem;
            thead{
                td{
                    height: 0.9rem;
                    border: 1px solid #e9ebef;
                }
            }
            tbody{
                td{
                    height: 0.82rem;
                    border: 1px solid #e9ebef;
                }
            }
        }
        .addHypertensionReport{
            width: 1rem;
            height: 1rem;
            position: fixed;
            right: 5%;
            bottom: 10%;
            z-index: 100;
        }
    }
    .noData{
        margin-top: 2rem;
    }
    .bgGray{
        background-color: #fbfbfd;
    }
</style>
<script>
import {FormDate} from '../../utils/utils';
import MescrollVue from 'mescroll.js/mescroll.vue'
import {reportModel} from '../../api'
export default {
    data () {
        return{
            hyperReportList: [],
            mescrollDown: {
                use: false
            },
            mescrollUp: { // 上拉加载的配置.
                callback: this.getHyperTensionList,
                page: {
                    num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                    size: 20 //每页数据条数,默认10
                },
                noMoreSize: 5,
                isLock: false
            },
            mescroll: null,
            dataIndex: 1
        }
    },
    methods: {
        FormDate (date, str) {
          return FormDate(date, str);
        },
        getHyperTensionList (page, mescroll) {
            reportModel.getHypertensionList({pageNo: page.num, pageSize: page.size}, res => {
                if(res.data.data.pageNo >= res.data.data.pageCount||res.data.data.pageCount==0){
                    this.mescrollUp.isLock = true;
                }else{
                    this.mescrollUp.isLock = false;
                }
                this.hyperReportList = this.hyperReportList.concat(res.data.data.items);
                this.$nextTick(() => {
                    this.mescroll.endSuccess(res.data.data.items.length);
                });
            }, err => {
                this.mescroll.endErr();
            });
        },
        toAddHyperReport () {
            sessionStorage.setItem("currentComponentsIndex", '3');
            this.$router.push('/bloodPressure/addBloodPressureReport/add');
        },
        clickEachLine (item) {
            sessionStorage.setItem("currentComponentsIndex", '3');
            this.$router.push('/bloodPressure/addBloodPressureReport/' + item.bpId);
        },
        mescrollInit (mescroll) {
            this.mescroll = mescroll;
        }
    },
    components: {
        MescrollVue
    }
}
</script>
