function padStart(number, maxLength, fillString) {
    let str = String(number)
    if (str.length >= maxLength) {
        return str
    }

    fillString = String(fillString)
    if (fillString.length === 0) {
        fillString = ' '
    }

    let fillLen = maxLength - str.length
    let timesToRepeat = Math.ceil(fillLen / fillString.length)
    let truncatedStringFiller = fillString
        .repeat(timesToRepeat)
        .slice(0, fillLen)
    return truncatedStringFiller + str
}

export const FormDate = (time, endType = 'yyyy-MM-dd hh:mm:ss') => {
    if (time === 0) {
        return ''
    }

    // endType �yy--MM--dd形式传入
    let dTime
    if (time instanceof Date) {
        dTime = time
    } else {
        dTime = new Date(time)
    }

    const obj = {
        year: dTime.getFullYear() + '', // 年份
        month: dTime.getMonth() + 1 + '', // 月份
        date: dTime.getDate() + '', // �
        hours: dTime.getHours() + '', // 小时
        minutes: dTime.getMinutes() + '', // �
        seconds: dTime.getSeconds() + '' // �
    }

    return endType.replace('yyyy', obj.year)
        .replace('yy', obj.year.slice(2))
        .replace('MM', padStart(obj.month, 2, 0))
        .replace('M', obj.month)
        .replace('dd', padStart(obj.date, 2, 0))
        .replace('d', obj.date)
        .replace('hh', padStart(obj.hours, 2, 0))
        .replace('h', obj.hours)
        .replace('mm', padStart(obj.minutes, 2, 0))
        .replace('m', obj.minutes)
        .replace('ss', padStart(obj.seconds, 2, 0))
        .replace('s', obj.seconds)
}

export const isEmptyString = (value) => {
    if (value || value === 0) {
        return value.toString().trim()
    } else {
        return ''
    }
}

export const getQueryVariable = (name) => {
    var url = window.location.href
    var position = url.indexOf('?')
    if (position != -1) {
        var temp = url.substring(position + 1)
        var tempArray = temp.split('&')
        for (var i = 0; i < tempArray.length; i++) {
            if (tempArray[i].indexOf(name) != -1) {
                var retCode = tempArray[i].split('=')[1]
                return retCode
            }
        }
    }
    return null
}

export const getBirth = (birthday) => {
    if (!!birthday) {
      let now = new Date();
      let birth = new Date(birthday);
      let nowYear = now.getFullYear();
      let birthYear = birth.getFullYear();
      let nowMoth = now.getMonth();
      let birthMoth = birth.getMonth();
      let nowDay = now.getDate();
      let birthDay = birth.getDate();
      if (nowYear == birthYear) {
        if (nowMoth == birthMoth) {
          if (nowDay == birthDay) {
            return '新生儿';
          } else {
            return '出生' + (nowDay - birthDay) + '天';
          }
        } else {
          return nowMoth - birthMoth + '个月';
        }
      } else {
        return nowYear - birthYear + '岁';
      }
    } else {
      return '';
    }
  }

  export const getGender = (sex) => {
    if (sex) {
        return sex == '1' ? '男' : (sex == '2' ? '女' : '未知');
    } else {
        return '';
    }
  }
