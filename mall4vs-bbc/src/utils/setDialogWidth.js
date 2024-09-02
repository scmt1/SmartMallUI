/**
 * 设置弹出框的宽度 当弹框的宽度小于窗口宽度时不变，小于窗口宽度时等于窗口宽度
 * defWidth : 传入的默认宽度
 */
export const setDialogWidth = function (defWidth) {
  var val = document.body.clientWidth
  const def = defWidth || 850 // 默认宽度
  if (val < def) {
    return '97%'
  } else {
    return def + 'px'
  }
}

// 窗口宽度发生变化时
export const widthChange = function (obj, defWidth) {
  window.onresize = () => {
    return (() => {
      obj.dialogWidth = setDialogWidth(defWidth)
    })()
  }
}
