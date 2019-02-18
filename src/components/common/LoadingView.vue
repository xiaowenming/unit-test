<template>

    <div  v-if="loading" class="mark-loading">
        <div class="loading">
            <clip-loader :color="spinnerColor" :size="spinnerSize" style="margin-top:10px;"></clip-loader>
            <p style="color:#fff;text-align:center;font-size:12px;">{{msg}}</p>
        </div>
    </div>
</template>
<script>
    import ClipLoader from './ClipLoader.vue';

    export default {
        name:'loading-view',
        props : {
            loading:{
                type:Boolean,
                default:false
            },
            msg : {
                type:String,
                default:''
            }
        },
        data : function() {
            return {
                spinnerColor: "#fff",
                spinnerSize : "28px"
            }
        },
        methods: {
            show:function() {
                this.loading = true;
            },
            show:function(msg) {
                this.loading = true;
                this.msg = msg;
            },
            hide:function() {
                this.loading = false;
            }
        },
        components : {
            'ClipLoader': ClipLoader
        }
    }
</script>

<style>
    .mark-loading{
        height: 100%;
        width: 100%;
        top: 0;
        z-index: 999;
        position: fixed;
    }
    .loading {
        position:fixed;
        border-radius:2px;
        z-index:1999;
        margin-left:-60px;
        margin-top:-33px;
        left:50%;
        top:50%;
        width:120px;
        height:66px;
        background:#333333;
        filter:alpha(opacity=70);
        -moz-opacity:0.7;
        opacity:0.7;
    }
</style>