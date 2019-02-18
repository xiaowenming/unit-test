<template>
  <div class="tablePage">
       <table class="reportTable">
              <thead>
                  <tr>
                      <th rowspan="2" colspan="2" class="first pr"><p class="time">时段</p><p class="date">日期</p></th>
                      <th colspan="2">早餐</th>
                      <th colspan="2">午餐</th>
                      <th colspan="2">晚餐</th>
                      <th rowspan="2">睡 前</th>
                      <th rowspan="2">凌 晨</th>
                  </tr>
                  <tr> 
                      <th>空腹</th>
                      <th>后</th>
                      <th>前</th>
                      <th>后</th>
                      <th>前</th>
                      <th>后</th>
                  </tr>
              </thead>
              <tbody>
                    <tr v-for="(item,index) in sugerTestList" :key="index">
                        <td @click="toThisDayDetail(item[0].value)" colspan="2">{{item[0].value.substring(5,10).replace("-","/")}}</td>
                        <td @click="clickSugarValue(item[0].value, item[1], 1, item[1].value)" :class="{bgGray:true,maneyTimes:item[1].flag}" :style="{color:item[1].color}">{{item[1].value == '0' ? '' : item[1].value}}</td>
                        <td @click="clickSugarValue(item[0].value, item[2], 2, item[2].value)" :class="{bgGray:true,maneyTimes:item[2].flag}" :style="{color:item[2].color}">{{item[2].value == '0' ? '' : item[2].value}}</td>
                        <td @click="clickSugarValue(item[0].value, item[3], 3, item[3].value)" :class="{bgGray:false,maneyTimes:item[3].flag}" :style="{color:item[3].color}">{{item[3].value == '0' ? '' : item[3].value}}</td>
                        <td @click="clickSugarValue(item[0].value, item[4], 4, item[4].value)" :class="{bgGray:false,maneyTimes:item[4].flag}" :style="{color:item[4].color}">{{item[4].value == '0' ? '' : item[4].value}}</td>
                        <td @click="clickSugarValue(item[0].value, item[5], 5, item[5].value)" :class="{bgGray:true,maneyTimes:item[5].flag}" :style="{color:item[5].color}">{{item[5].value == '0' ? '' : item[5].value}}</td>
                        <td @click="clickSugarValue(item[0].value, item[6], 6, item[6].value)" :class="{bgGray:true,maneyTimes:item[6].flag}" :style="{color:item[6].color}">{{item[6].value == '0' ? '' : item[6].value}}</td>
                        <td @click="clickSugarValue(item[0].value, item[7], 7, item[7].value)" :class="{bgGray:false,maneyTimes:item[7].flag}" :style="{color:item[7].color}">{{item[7].value == '0' ? '' : item[7].value}}</td>
                        <td @click="clickSugarValue(item[0].value, item[8], 8, item[8].value)" :class="{bgGray:false,maneyTimes:item[8].flag}" :style="{color:item[8].color}">{{item[8].value == '0' ? '' : item[8].value}}</td>
                    </tr>
              </tbody>
              <tfoot v-show="tfootIsShow">
                  <tr><td colspan="10">没有数据了</td></tr>
              </tfoot>
          </table>
  </div>
</template>

<style lang="less" scoped>
    .tablePage{
        width: 100%;
        margin-bottom: 1rem;
    }
    .reportTable{
        width: 100%;
        font-size: 0.36rem;
    }
    .reportTable th{
        height: 0.4rem;
        border: 1px solid #d4d4d4;
        width: 2em;
        font-weight: normal;
    }
    .reportTable .first{
        background: url("/static/images/default/icon_segmentation.png") no-repeat center center/100% 100%;
    }
    .reportTable .first p{
        width: 50%;
    }
    .reportTable .first .time{
        position: absolute;
        right: 0;
        top:20%;
    }
    .reportTable .first .date{
        position: absolute;        
        left: 0;
        top:60%;
    }
    .maneyTimes{
        background: url("/static/images/sugarTestReport/mignxi_icon_more.png") no-repeat 100% 100%;
        background-size: 0.14rem 0.14rem;
    }
    .reportTable td{
        border: 1px solid #d4d4d4;
    }
    .bgGray{
        background-color: #f9f9f9;
    }
</style>

<script>
    export default {
        name:"myTable",
        data (){
            return {
                
            }
        },
        props: ['sugerTestList','toThisDayDetail','tfootIsShow','clickSugarValue']
    }
</script>