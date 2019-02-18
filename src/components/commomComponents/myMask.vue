<template>
    <div class="myMask fullPage" v-show="showMask">
        <div class="content">
            <slot name="header"></slot>
            <slot name="body"></slot>
            <slot name="footer"></slot>
        </div>
    </div>
</template>
<style>
    .myMask{
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
    }
</style>
<script>
export default {
    name:'myMask',
    data () {
        return {
            showMask: false
        }
    },
    mounted (){
        this.showMask = true;
        this.setScrollTop().afterOpen();
    },
    beforeDestroy:function () {
        this.setScrollTop().beforeClose();
    },
    methods: {
        setScrollTop: function () {//获取和还原进度条位置
            let _this = this; 
            var ModalHelper = (function(bodyCls) {
                var scrollTop, reg;
                var bodyClassName = "";
                var bodyEle = document.body;
                var doc = document.documentElement.scrollTop ? document.documentElement : bodyEle;
                return {
                    afterOpen: function() {
                        scrollTop = doc.scrollTop;
            
                        if(bodyEle.classList){
                            bodyEle.classList.add(bodyCls)
                        }else{
                            bodyEle.className += " " + bodyCls;
                        }
            
                        bodyEle.style.top = -scrollTop + 'px';
                        bodyClassName = bodyEle.className;
                    },
                    
                    beforeClose: function() {
                        if(bodyEle.classList){
                            bodyEle.classList.remove(bodyCls)
                        }else{
                            reg = new RegExp("\\b" + bodyCls + "\\b", "g", "gi");
                            if(reg.test(bodyClassName)){
                                bodyClassName = bodyClassName.replace(reg, "");
                                bodyEle.className = bodyClassName;
                            }
                        }
                        
                        bodyEle.style.top = "";
                        //窗口滚动到父组件传过来的位置
                        window.scrollTo(0, _this._props.scrollValue*1);
                    }
                };
            })('modal-open');
            return ModalHelper;
        },
        closeMask: function () {
            this.showMask = false;
            this.setScrollTop().beforeClose();
            //通知父组件清除子组件
            this.$emit('closeMask',true);
        },
    },
    props:['scrollCallback', 'scrollValue']
}
</script>
