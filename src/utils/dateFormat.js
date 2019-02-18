//扩展Date的format方法
Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}

export const dateFormat = {
  /**
   * long类型时间戳转string类型
   * @param l 时间戳，单位毫秒
   * @param pattern 格式：如yyyy-MM-dd hh:mm:ss
   * @returns {*}
   */
  getFormatDateByLong: function (l, pattern) {
    return this.getFormatDate(new Date(l), pattern);
  },

  getFormatDate: function (date, pattern) {
    if (date === undefined) {
      date = new Date();
    }
    if (pattern === undefined) {
      pattern = "yyyy-MM-dd hh:mm:ss";
    }
    return date.format(pattern);
  }
}
