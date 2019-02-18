export const fileUtils = {
  /**
   * base64图片转文件 格式（/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDA*****）
   * @param dataurl
   * @param filename
   * @returns {File}
   */
  dataURLtoFile: function (dataurl, filename) {
    // var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    //   bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    let bstr = atob(dataurl)
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename)
  }
}
