import { Toast } from 'mint-ui'
const onBridgeReady = (data, callback) => {
    WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: data.appId, //公众号名称，由商户传入
          timeStamp: data.timeStamp, //时间戳，自1970年以来的秒数
          nonceStr: data.nonceStr, //随机串
          package: data.package,
          signType: data.signType, //微信签名方式：
          paySign: data.paySign //微信签名
        },
        callback
      );
}/**
 * 
 * 
 * @param {any} data 用于支付的参数
 * @param {any} callback 支付后的回调
 */
export const callpay = (data, callback) => { // 唤起支付
    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener(
            "WeixinJSBridgeReady",
            onBridgeReady,
            false
            );
        } else if (document.attachEvent) {
            document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
            document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
        }
    } else {
        onBridgeReady(data, callback);
    }
}
/**
 * 位置支付通用回调处理
 * 
 * @param {any} res 微信支付返回值
 * @param {any} callBackObjOfPayStatus 根据不同支付状态处理回调
 */

export const payCallBack = (res, callBackObjOfPayStatus) => { // 支付回调
    if (res.err_msg == "get_brand_wcpay_request:ok") {
        Toast("支付成功");
        if (callBackObjOfPayStatus.successCallBack) {
            callBackObjOfPayStatus.successCallBack();
        }
    }
    if (res.err_msg == "get_brand_wcpay_request:fail") {
        Toast("支付失败！请重试");
        if (callBackObjOfPayStatus.failCallBack) {
            callBackObjOfPayStatus.failCallBack();
        }
    }
    if (res.err_msg == "get_brand_wcpay_request:cancel") {
        Toast("支付取消");
        if (callBackObjOfPayStatus.cancelCallBack) {
            callBackObjOfPayStatus.cancelCallBack();
        }
    }
}