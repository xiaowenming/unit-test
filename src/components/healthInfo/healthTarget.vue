<template>
  <div class="healthTarget fullPage">
      <commomHeader :headerTitle="headerTitle" :rightIsShow="rightIsShow " :showArrow="showArrow" :showAdd="showAdd" 
      :rightPath="rightPath" :showText="showText" :rightText="rightText"></commomHeader>
      <div class="pageBanner">
          <img src="/static/images/health/health_goals_banner.png" alt="">
      </div>
      <div class="center">
          <ul>
              <li class="pr bgWhite" v-for="(item,index) in liListData" @click="showChooseBox(item.value,index)">
                  <div class="left fl">{{item.name}}</div>
                  <input type="text" class="right fr tar colorBase" readonly v-model="item.value">
                  <i class="icon center-y"></i>
              </li>
          </ul>
      </div>
      <div class="footer">
          <div class="submitData" @click="saveValue">保存</div>
      </div>
      <div class="reSet" @click="showConfirm">
          <group></group>
      </div>
      <div v-transfer-dom>
        <confirm v-model="show"
        :title="('')"
        @on-cancel="onCancel"
        @on-confirm="onConfirm"
        @on-show="onShow"
        @on-hide="onHide">
            <p style="text-align:center;">{{ ('重置后会恢复系统默认的数值,确定要重置吗?') }}</p>
        </confirm>
      </div>
      <!-- <div class="reSet" @click.native="showPlugin"></div> -->
      <!-- <div class="reSet"></div> -->
      <div class="selecteList fullPage" v-show="maskIsShow">
          <div class="optionBox">
              <div class="top">
                  <span class="tal" @click="cancel">取消</span>
                  <span class="tar" @click="ok">确定</span>
              </div>
              <div class="bottom">
                <div class="left tar" id="scrollLeft" @scroll="elScroll" v-scrollend>
                  <ul>
                    <li class="chooseLi" v-for="(item,index) in scrollList" :key="index">{{item}}</li>
                  </ul>
                </div>
                <div class="center">至</div>
                <div class="right tal" id="scrollRight" @scroll="elScroll" v-scrollend>
                  <ul>
                    <li class="chooseLi" v-for="(item,index) in scrollList" :key="index">{{item}}</li>
                  </ul>
                </div>   
              </div>
          </div>
      </div>
  </div>
</template>

<style lang="less" scoped>
    .healthTarget .pageBanner img{
        width: 100%;
        height: auto;
    }
    .healthTarget .center ul li{
        width: 100%;
        height: 0.80rem;
        line-height: 0.80rem;
        padding-left: 0.5rem;
        font-size: 0.32rem;
        border-bottom: 1px solid #e0e0e0;
    }
    .healthTarget .center input{
        -webkit-user-select:none;
    }
    .icon{
        width: 0.2rem;
        height: 0.35rem;
        left: 95%;
        background: url("/static/images/default/icon_right_gray.png") no-repeat ;
        background-size: cover;
    }
    .right{
        height: 98%;
        padding-right: 0.6rem;
    }
    .footer{
        margin-top: 0.6rem;
    }
    .footer .submitData{
        width: 7rem;
        height: 0.9rem;
        line-height: 0.9rem;
        margin: 0 auto 0.38rem;
        font-size: 0.36rem;
        border-radius: 0.12rem;
        box-sizing: content-box;
        color: #fff;
        background-color: #34b597;
        border: 1px solid #34b597;
    }
    .reSet{
        width: 0.73rem;
        height: 0.38rem;
        position: absolute;
        top: 0.3rem;
        right:0.4rem;
    }
    .selecteList{
        position: fixed;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }
    .optionBox{
        width: 100%;
        height: 240px;
        background-color: #fff;
        position: absolute;
        bottom: 0;
        left: 0;
    }
    .optionBox .top{
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        box-sizing: border-box;
        border-bottom: 1px solid #ccc;
    }
    .optionBox .top span{
        display: block;
        float: left;
        width: 50%;
        height: 100%;
        box-sizing: border-box;
    }
    .optionBox .top span.tal{
        padding-left: 25px;
    }
    .optionBox .top span.tar{
        padding-right: 25px;
    }
    .optionBox .bottom{
        width: 100%;
        height: 200px;
    }
    .optionBox .bottom li{
        height: 40px;
        line-height: 40px;
        font-size: 20px;
    }
    /*隐藏滚动条*/
    .optionBox .bottom div::-webkit-scrollbar {
        display: none;
    }
    .optionBox .bottom .left{
        width: 33.3333%;
        height: 200px;
        float: left;        
        overflow: scroll;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
    .optionBox .bottom .center{
        width: 33.3333%;
        flex: 1;
        height: 200px;
        line-height: 200px;
        font-size: 20px;
        float: left;
    }
    .optionBox .bottom .right{
        width: 33.3333%;
        float: left;        
        padding: 0;
        height: 200px;
        overflow: scroll;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
</style>

<script>
    import { Group,Confirm, TransferDomDirective as TransferDom } from 'vux'
    import commomHeader from "../commomComponents/header"
    import {userModel} from '../../api'
    export default {
        name:"guess",
        data (){
            return {
                headerTitle:"健康目标",
                rightIsShow:true,
                showArrow:"",
                showAdd:"",
                showText:"showText",
                rightText:"重置",
                rightPath:null,
                //弹窗配置
                show:false,
                timeTypeList:["空腹","早餐后","午餐前","午餐后","晚餐前","晚餐后","睡前","凌晨"],
                liListData:[],
                subList:[],
                maskIsShow:false,
                scrollList:["",""],
                eachLiHeight:"",//每个li的高度
                currentLiIndex:0,//选择弹窗中间显示的是哪个li
                currentChooseItemIndex:0,//当前选择的是哪个时段
                valueLeft:"",
                valueRight:"",
                lastDistanceLeft:0,
                lastDistanceRight:0,
            }
        },methods:{
            //创建弹出选择框中生成dom的数组
            //参数:minValue最小值,maxValue最大值,arithmeticValue等差值,targetArray构造的数组
            // preventScroll:function(e){
            //    e.preventDefault();
            // },
            creatArray:function(minValue,maxValue,arithmeticValue,targetArray){
                //判断传入目标数组参数是否为数组
                if(Object.prototype.toString.call(targetArray)=='[object Array]'){
                    for(let i=minValue;i<maxValue+arithmeticValue;i+=arithmeticValue){
                        targetArray.push(i.toFixed(1));
                    }
                    //添加两个空串,生成两个空li填补最后一个数据下面的空白
                    for(let i=0;i<2;i++){
                        targetArray.push("");
                    }
                }else{
                    throw new Error("paramError:targetArray must be an Array");
                }
            },
            //设置默认显示值
            setDefault:function(minValue,maxValue,arithmeticValue,defaultValueLeft,defaultValueRight){
                //获取左边要滑动的div
                let scrollTargetLeft = document.getElementById("scrollLeft");
                let scrollTargetRight = document.getElementById("scrollRight");
                //计算左边需要滑动的距离
                let scrollDistanceLeft = ((defaultValueLeft*1 - minValue*1)/arithmeticValue)*this.eachLiHeight;
                let scrollDistanceRight = ((defaultValueRight*1 - minValue*1)/arithmeticValue)*this.eachLiHeight;
                //左右滑块滑动
                this.lastDistanceLeft = scrollDistanceLeft;
                this.lastDistanceRight = scrollDistanceRight;
                // scrollTargetLeft.scrollTo(100,scrollDistanceLeft);
                // scrollTargetRight.scrollTo(100,scrollDistanceRight);
                scrollTargetLeft.scrollTop = scrollDistanceLeft;
                scrollTargetRight.scrollTop = scrollDistanceRight;
            },
            //滑动的时候渲染最中间li的文本颜色
            elScroll:function(e){
                e.preventDefault();
                let ele = e.target;
                //盒子滑动距离
                let eleScrollDistance = ele.scrollTop;
                let liIndex = parseInt(eleScrollDistance/this.eachLiHeight)+2;
                ele.children[0].children[liIndex-1].style.color = "#000";                
                ele.children[0].children[liIndex+1].style.color = "#000";                
                ele.children[0].children[liIndex].style.color = "#34b597";
            },
            //显示弹出框
            showChooseBox:function(value,index){
                let _this = this;
                this.valueLeft = value.split("-")[0];
                this.valueRight = value.split("-")[1];
                this.currentChooseItemIndex = index;
                this.maskIsShow = true;

                setTimeout(function(){
                    _this.eachLiHeight = document.getElementsByClassName("chooseLi")[0].offsetHeight;
                    _this.setDefault(1.1,33.3,0.1,_this.valueLeft,_this.valueRight);
                },50)
            },
            //点击确定获取当前滑动值并渲染
            ok:function(){
                if(this.valueLeft*1>=this.valueRight*1){
                    this.showToast("最小值应小于最大值");
                }else{
                    this.subList[this.currentChooseItemIndex].minValue = this.valueLeft;
                    this.subList[this.currentChooseItemIndex].maxValue = this.valueRight;
                    this.liListData[this.currentChooseItemIndex].value = this.valueLeft+"-"+this.valueRight;
                    this.maskIsShow = false;
                }
            },
            cancel:function(){
                this.maskIsShow = false;
            },
            //原生判断dom里面是否有某个class
            hasClass:function(){
                var div = document.createElement("div") ;
                if( "classList" in div && typeof div.classList.contains === "function" ) {
                    return function(elem, className){
                        return elem.classList.contains(className) ;
                    } ;
                } else {
                    return function(elem, className){
                        var classes = elem.className.split(/\s+/) ;
                        for(var i= 0 ; i < classes.length ; i ++) {
                            if( classes[i] === className ) {
                                return true ;
                            }
                        }
                        return false ;
                    } ;
                }
            },
            //保存数据
            saveValue:function(){
                let _this = this;
                userModel.saveUserHealthTarget({sugarObjectives:this.subList}, function(res){
                    _this.showToast("保存成功");
                    setTimeout(function(){
                        _this.$router.go(-1); 
                    },2500);
                },function(err){
                    _this.showToast("保存失败");
                });
            },
            showConfirm:function(){
                this.show = true;
            },
            onCancel () {
            },
            onConfirm () {
                let _this = this;
                userModel.resetUserHealthTarget({},function(res){
                    _this.liListData = res.data.data.obj.map((v, index) =>{
                        let tempObj = {};
                        tempObj.name = _this.timeTypeList[v.timeType-1];
                        tempObj.value = v.minValue+"-"+v.maxValue;
                        _this.subList[index].minValue = v.minValue;
                        _this.subList[index].maxValue = v.maxValue;
                        return tempObj;
                    });
                    _this.showToast("重置成功");
                })
            },
            onHide () {
                
            },
            onShow () {
                
            },
        },
        created:function(){
            //依据对象属性排序
            const compare = function (prop) {
                return function (obj1, obj2) {
                    var val1 = obj1[prop];
                    var val2 = obj2[prop];
                    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                        val1 = Number(val1);
                        val2 = Number(val2);
                    }
                    if (val1 < val2) {
                        return -1;
                    } else if (val1 > val2) {
                        return 1;
                    } else {
                        return 0;
                    }            
                } 
            }
            let _this = this;
            this.creatArray(1.1,33.3,0.1,this.scrollList);
            userModel.getUserHealthTarget({}, function(res){
                _this.liListData = res.data.data.obj.map(v =>{
                    let tempArr = [];
                    let tempObj = {};
                    tempObj.index = v.timeType-1;
                    tempObj.name = _this.timeTypeList[v.timeType-1];
                    tempObj.value = v.minValue+"-"+v.maxValue;
                    return tempObj;
                });
                _this.liListData.sort(compare('index'));
                _this.subList = res.data.data.obj.map(v =>{
                    let tempObj = {};
                    tempObj.timeType = v.timeType;
                    tempObj.minValue = v.minValue;
                    tempObj.maxValue = v.maxValue;
                    return tempObj;
                });
                _this.subList.sort(compare('timeType'));
            });
        },
        mounted:function(){
            this.setDefault(1.1,33.3,0.1,1.5,6.6);
        }
        ,components:{
            commomHeader,
            Confirm,
            Group
            
        },
        directives:{
            //滑动结束
            scrollend:{
                //参数 : el:当前dom , binding : 单次调用 , vnode :虚拟dom节点 , oldvnode : 上一个dom节点
                bind:function(el,binding,vnode,oldvnode){
                    let _this = vnode.context;//当前vue实例  
                    //let timeoutRef;//延时器id,开始时间,结束时间,必须执行方法的时间间隔

                    //原理:滚动事件触发设置延时器 , 当延时器id存在的时候清除延时器 , 滚动停止之前设置了最后一个延时器id , 滚动停止
                    //     最后一个延时器id没被清除,调用延时器回调      
                    // el.addEventListener("scroll",function(){
                    //     //当延时器id存在的时候清楚延时器id 
                    //     if(timeoutRef){
                    //         clearTimeout(timeoutRef);
                    //     }
                    //     //滚动事件触发 , 设置延时器
                    //     timeoutRef = setTimeout(callback ,100);
                    // })
                    function is_ios() {
                        var ua = navigator.userAgent.toLowerCase()
                        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                            return true
                        } else {
                            return false
                        }
                    }
                    if(is_ios()){
                        el.addEventListener("scroll",throttle(callback,200,400));
                    }else{
                        el.addEventListener("scroll",throttle(callback,50,100));
                    }
                    el.addEventListener("touchend",callback());
                    //延时器回调
                    function callback(){
                        // console.log(456);
                        //盒子移动距离                    
                        let boxScrollDistance = el.scrollTop;
                        //盒子内部ul高度
                        let ulInBoxHeight = el.children[0].offsetHeight;
                        //实际上没有移动时跳出回调
                        if((_this.hasClass()(el,"left")&&boxScrollDistance*1-_this.lastDistanceLeft==0)||(_this.hasClass()(el,"right")&&boxScrollDistance*1-_this.lastDistanceRight==0)){
                            return ;
                        }
                        
                        //当盒子移动总距离取余每一个li的高度大于每个li的高度的一半的时候 , 移动完剩余高度
                        if(boxScrollDistance*1%_this.eachLiHeight*1>=_this.eachLiHeight/2){
                            el.scrollTop = boxScrollDistance+_this.eachLiHeight-(boxScrollDistance%_this.eachLiHeight);
                            //当前最中间的li的index
                            _this.currentLiIndex = parseInt(el.scrollTop/_this.eachLiHeight)+2;
                            setColor();
                        }
                        if(boxScrollDistance*1%_this.eachLiHeight*1<_this.eachLiHeight/2){
                            el.scrollTop = boxScrollDistance-(boxScrollDistance%_this.eachLiHeight);
                            //当前最中间的li的index
                            _this.currentLiIndex = parseInt(el.scrollTop/_this.eachLiHeight)+2;
                            setColor();
                        }
                        //盒子滑动到最前面的时候 , 当前选中li为第一个
                        if(boxScrollDistance==0){
                            _this.currentLiIndex = 2;
                            setColor();                            
                        }
                        //滑动距离+盒子可视距离 = ul总高度 , 说明盒子滑到了底部 , 当前Li取最后一个
                        if(boxScrollDistance + el.clientHeight==ulInBoxHeight){
                            _this.currentLiIndex = el.children[0].children.length-3;
                            setColor();                                                        
                        }
                        //赋值
                        if(_this.hasClass()(el,"left")){
                            _this.valueLeft = el.children[0].children[_this.currentLiIndex].innerText||_this.valueLeft;
                        }
                        if(_this.hasClass()(el,"right")){
                            _this.valueRight = el.children[0].children[_this.currentLiIndex].innerText||_this.valueRight;
                        }
                        function setColor(){
                            //重置文本颜色
                            for(let i=0;i<el.children[0].children.length;i++){
                                if(i==_this.currentLiIndex){
                                    el.children[0].children[i].style.color = "#34b597";
                                }else{
                                    el.children[0].children[i].style.color = "#000";
                                }
                            }
                        }
                    }
                    //节流函数
                    function throttle(fn,wait,mustRun){
                        let timeoutRef,
                            startTime = new Date();
                        
                        return function(){
                            let _this = this,
                                args = arguments,
                                endTime = new Date();
                            clearTimeout(timeoutRef);
                            if(endTime-startTime>=mustRun){
                                fn.apply(_this,args);
                                startTime = endTime;
                            }else{
                                timeoutRef = setTimeout(fn,wait);
                            }
                        }
                    }
                }
            },
            TransferDom
        }
    }
</script>