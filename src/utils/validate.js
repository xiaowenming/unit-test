// 验证字符串是否为空
export const validateString = (string) => {
    if (string == null || string == undefined) {
        return false;
    } else {
        let str = string.toString().trim();
        return str.length > 0 ? true : false;
    }
}
// 手机号验证
export const validatePhoneNumber = (phone) => {
    let reg = /^1[0-9]{10}$/;
    return reg.test(phone);
}
// 验证数值是否小于某数值
export const validateLessNumber = (value, lowerValue) => {
    return (value * 1 < lowerValue * 1) ? true : false;
}
// 验证数值是否大于某数值
export const validateUpperNumber = (value, upperValue) => {
    return (value * 1 > upperValue * 1) ? true : false;
}
export const validateIdCard = (idCard) => {
    //15位和18位身份证号码的正则表达式
    var regIdCard=/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
   
    //如果通过该验证，说明身份证格式正确，但准确性还需计算
    if(regIdCard.test(idCard)){
        if(idCard.length==18){
            var idCardWi=new Array( 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ); //将前17位加权因子保存在数组里
            var idCardY=new Array( 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
            var idCardWiSum=0; //用来保存前17位各自乖以加权因子后的总和
        for(var i=0;i<17;i++){
            idCardWiSum+=idCard.substring(i,i+1)*idCardWi[i];
        }
    
        var idCardMod=idCardWiSum%11;//计算出校验码所在数组的位置
        var idCardLast=idCard.substring(17);//得到最后一位身份证号码
    
        //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
        if(idCardMod==2){
            if(idCardLast=="X"||idCardLast=="x"){
                return true;
            }else{
                return false;
            }
            }else{
            //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
            if(idCardLast==idCardY[idCardMod]){
                return true;
            }else{
                return false;
            }
        }
     } 
    }else{
        return false;
    }
}
// 验证字符串或者数字长度是否超长 , 超长返回true , 否则返回false
export const overlengthStr = (value, standard) => {
    let str = value.toString();
    return str.length > standard ? true : false;
}
// 判断数组中是否存在某个值 , 存在返回true , 不存在返回false
export const IsInArray = (arr,val) => {
　　var testStr = ',' + arr.join(",") + ",";
　　return testStr.indexOf("," + val + ",") != -1;
} 