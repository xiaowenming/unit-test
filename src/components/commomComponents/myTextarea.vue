<template>
    <div class="textareaBox">
        <textarea rows="2" :placeholder="textareaPlaceholderText || ''" v-validateEmoji v-model="areaText" v-on:input="defaultInputCallback"></textarea>
    </div>
</template>
<style scoped>
    textarea{
        display: block;
        height: 100%;
        border: none;
        line-height: 0.5rem;
        border-bottom: 1px solid #EFEFF4;
        width: 100%;
        padding: 0.4rem;
        resize: none;
        font-size: 0.35rem;
    }
    textarea::-webkit-input-placeholder{
        text-align: right;
        color: #999;
    }
</style>
<script>
import {validateEmoji} from '../../directives'
export default {
    name:'myTextarea',
    data () {
        return{
            areaText: ''
        }
    },
    methods: {
        defaultInputCallback () {
            this.$emit('sendInputValue', this.areaText, this.inputName);
        }
    },
    watch: {
        'inputValue': function () {
            this.areaText = this.inputValue;
        }
    },
    directives: {
        validateEmoji
    },
    props: ['inputName', 'textareaPlaceholderText', 'inputValue']
}
</script>
