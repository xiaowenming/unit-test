import { Toast } from 'mint-ui'
export const validateEmoji = {
    bind: function (el, binding, vnode) {
        let reg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
        el.addEventListener('input', () => {
            if (reg.test(el.value)) {
                el.value = '';
                Toast({
                    message: '请不要输入表情',
                    position: 'middle',
                    duration: 2000
                })
            }
        })
    }
}

export const overFlowXFindDoctor = {
    inserted (el, binding, vnode) {
        let childrenNode = vnode.children;
        let widthSum = 0;
        childrenNode.forEach(item => {
            if (item.elm.offsetWidth) {
                widthSum += item.elm.offsetWidth;
            }
        });
        el.style.width = widthSum + 'px';
        let widthSum2 = 0;
        let childrenNode2 = vnode.children;
        childrenNode2.forEach(item => {
            if (item.elm.offsetWidth) {
                widthSum2 += item.elm.offsetWidth;
            }
        });
        if (widthSum2 > window.innerWidth * 0.72) {
            el.style.width = widthSum2 + window.innerWidth * 0.064  + 'px'; // 补充右边箭头遮挡处
        }
    }
}

export const overFlowXConsultList = {
    inserted (el, binding, vnode) {
        let childrenNode = vnode.children;
        let widthSum = 0;
        childrenNode.forEach(item => {
            if (item.elm.offsetWidth) {
                widthSum += item.elm.offsetWidth;
            }
        });
        el.style.width = widthSum + 'px';
        let widthSum2 = 0;
        let childrenNode2 = vnode.children;
        childrenNode2.forEach(item => {
            if (item.elm.offsetWidth) {
                widthSum2 += item.elm.offsetWidth;
            }
        });
        if (widthSum2 > window.innerWidth * 0.572) {
            el.style.width = widthSum2 + window.innerWidth * 0.064  + 'px'; // 补充右边箭头遮挡处
        }
    }
}