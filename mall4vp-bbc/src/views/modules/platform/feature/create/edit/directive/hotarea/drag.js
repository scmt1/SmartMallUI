// 注册一个全局自定义指令 `v-focus`
import Vue from 'vue'
Vue.directive('drag', function (el, binding) {
  const oDiv = el // 获取当前元素
  window.vm.$nextTick(() => {
    /** 添加子节点 */
    const styles = [{
      style: 'position: absolute; user-select: none; width: 100%; height: 10px; top: -5px; left: 0px; cursor: row-resize;',
      position: 'top'
    },
    {
      style: 'position: absolute; user-select: none; width: 10px; height: 100%; top: 0px; right: -5px; cursor: col-resize;',
      position: 'right'
    },
    {
      style: 'position: absolute; user-select: none; width: 100%; height: 10px; bottom: -5px; left: 0px; cursor: row-resize;',
      position: 'bottom'
    },
    {
      style: 'position: absolute; user-select: none; width: 10px; height: 100%; top: 0px; left: -5px; cursor: col-resize;',
      position: 'left'
    },
    {
      style: 'position: absolute; user-select: none; width: 20px; height: 20px; right: -10px; top: -10px; cursor: ne-resize;',
      position: 'topRight'
    },
    {
      style: 'position: absolute; user-select: none; width: 20px; height: 20px; right: -10px; bottom: -10px; cursor: se-resize;',
      position: 'bottomRight'
    },
    {
      style: 'position: absolute; user-select: none; width: 20px; height: 20px; left: -10px; bottom: -10px; cursor: sw-resize;',
      position: 'bottomLeft'
    },
    {
      style: 'position: absolute; user-select: none; width: 20px; height: 20px; left: -10px; top: -10px; cursor: nw-resize;',
      position: 'topLeft'
    }
    ]
    const $spanDom = document.createElement('span')
    styles.map(res => {
      const $divDom = document.createElement('div')
      $divDom.style = res.style
      $divDom.onmousedown = (e) => {
        if (e && e.stopPropagation) {
          e.stopPropagation()
        } else { // 否则，我们需要使用IE的方式来取消事件冒泡
          window.event.cancelBubble = true
        }
        changeSize(e, res.position)
      }
      $spanDom.appendChild($divDom)
    })
    oDiv.appendChild($spanDom)
    const $forVal = binding.value
    // console.log($forVal);
    /** 获取当前准备编辑的图片热区列表 */
    const $cacheImageActiveBox = $forVal.cacheImageActiveBox[$forVal.index]
    const parameter = {
      parentNode: null, // 父级
      parentNodeInfo: {
        width: null,
        height: null
      },
      currentNodeInfo: {
        link: $cacheImageActiveBox.link || '',
        title: $cacheImageActiveBox.title || '',
        type: $cacheImageActiveBox.type,
        width: $cacheImageActiveBox.width,
        height: $cacheImageActiveBox.height,
        left: 0,
        top: 0,
        translateX: $cacheImageActiveBox.translateX,
        translateY: $cacheImageActiveBox.translateY
      }
    }

    const setParentNode = () => {
      parameter.parentNode = oDiv.parentNode.firstChild
      parameter.parentNodeInfo = { // 父级的宽高
        width: parameter.parentNode.offsetWidth,
        height: parameter.parentNode.offsetHeight
      }
    }
    setParentNode()

    if (parameter.currentNodeInfo) {
      oDiv.style.transform = 'translate(' + parameter.currentNodeInfo.translateX + 'px, ' + parameter.currentNodeInfo.translateY + 'px)'
      oDiv.style.width = parameter.currentNodeInfo.width + 'px'
      oDiv.style.height = parameter.currentNodeInfo.height + 'px'
    }
    oDiv.onmousedown = (e) => {
      // 算出鼠标相对元素的位置
      if (e && e.stopPropagation) {
        e.stopPropagation()
      } else { // 否则，我们需要使用IE的方式来取消事件冒泡
        window.event.cancelBubble = true
      }
      const $transform = oDiv.style.transform
      let $translateX = 0
      let $translateY = 0
      if ($transform) { // 计算当前的偏移量
        const $splitTransform = $transform.split(',')
        $translateX = $splitTransform[0].match(/\((\S*)px/)[1]
        if ($splitTransform.length > 1) {
          $translateY = $splitTransform[1].match(/(\S*)px/)[1]
        }
      }
      const disX = e.clientX - $translateX
      const disY = e.clientY - $translateY

      document.onmousemove = (e) => {
        if (e && e.stopPropagation) {
          e.stopPropagation()
        } else { // 否则，我们需要使用IE的方式来取消事件冒泡
          window.event.cancelBubble = true
        }
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        parameter.currentNodeInfo.translateX = e.clientX - disX
        parameter.currentNodeInfo.translateY = e.clientY - disY
        // 移动当前元素
        setPoint(true)
      }
      document.ondragstart = (ev) => {
        ev.preventDefault()
      }
      document.ondragend = (ev) => {
        ev.preventDefault()
      }
      document.onmouseup = (e) => { // 鼠标放开
        if (e && e.stopPropagation) {
          e.stopPropagation()
          e.preventDefault()
        } else { // 否则，我们需要使用IE的方式来取消事件冒泡
          window.event.cancelBubble = true
        }
        document.onmousemove = null
        document.onmouseup = null
        setPoint(true)
        saveInVuex()
        if (parameter.currentNodeInfo) {
          oDiv.style.transform = 'translate(' + parameter.currentNodeInfo.translateX + 'px, ' + parameter.currentNodeInfo.translateY + 'px)'
          oDiv.style.width = parameter.currentNodeInfo.width + 'px'
          oDiv.style.height = parameter.currentNodeInfo.height + 'px'
        }
      }
    }
    /** 设置位置 */
    const setPoint = () => {
      setParentNode()
      const wW = parameter.parentNodeInfo.width - parameter.currentNodeInfo.width
      if (parameter.currentNodeInfo.translateX >= wW) { // 是否溢出右边
        parameter.currentNodeInfo.translateX = wW
      }
      const hH = parameter.parentNodeInfo.height - parameter.currentNodeInfo.height
      if (parameter.currentNodeInfo.translateY >= hH) { // 是否溢出底部
        parameter.currentNodeInfo.translateY = hH
      }
      // 设置最小的宽高
      if (parameter.currentNodeInfo.width <= 10) {
        parameter.currentNodeInfo.width = 10
      }
      if (parameter.currentNodeInfo.height <= 10) {
        parameter.currentNodeInfo.height = 10
      }
      // 设置最大的宽高
      if (parameter.currentNodeInfo.width >= parameter.parentNodeInfo.width) {
        parameter.currentNodeInfo.width = parameter.parentNodeInfo.width
      }
      if (parameter.currentNodeInfo.height >= parameter.parentNodeInfo.height) {
        parameter.currentNodeInfo.height = parameter.parentNodeInfo.height
      }
      if (parameter.currentNodeInfo.translateY <= 0) { // 是否溢出上面
        parameter.currentNodeInfo.translateY = 0
      }
      if (parameter.currentNodeInfo.translateX <= 0) { // 是否溢出左边
        parameter.currentNodeInfo.translateX = 0
      }
      oDiv.style.transform = 'translate(' + parameter.currentNodeInfo.translateX + 'px, ' + parameter.currentNodeInfo.translateY + 'px)'
      oDiv.style.width = parameter.currentNodeInfo.width + 'px'
      oDiv.style.height = parameter.currentNodeInfo.height + 'px'
    }
    /** 以下为拖动放大的操作 */
    const changeSize = (e, $position = 'right') => {
      // 算出鼠标相对元素的位置 拖动边缘
      const firstTranslateX = parameter.currentNodeInfo.translateX
      const firstTranslateY = parameter.currentNodeInfo.translateY
      const firstWidth = parameter.currentNodeInfo.width
      const firstHeight = parameter.currentNodeInfo.height

      const dragChildDisY = e.clientY
      const dragChildDisX = e.clientX
      document.onmousemove = (e) => {
        if (e && e.stopPropagation) {
          e.stopPropagation()
        } else { // 否则，我们需要使用IE的方式来取消事件冒泡
          window.event.cancelBubble = true
        }
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        const chanceW = e.clientX - dragChildDisX
        const chanceH = e.clientY - dragChildDisY
        switch ($position) {
          case 'top': // 顶部 ok
            parameter.currentNodeInfo.height = firstHeight - chanceH
            parameter.currentNodeInfo.translateY = firstTranslateY + chanceH
            break
          case 'bottom': // 底部 ok
            parameter.currentNodeInfo.height = firstHeight + chanceH
            break
          case 'right': // 右边 ok
            parameter.currentNodeInfo.width = firstWidth + chanceW
            break
          case 'left': // 左边 ok
            parameter.currentNodeInfo.width = firstWidth - chanceW
            parameter.currentNodeInfo.translateX = firstTranslateX + chanceW
            break
          case 'bottomLeft': // 左下角
            parameter.currentNodeInfo.width = firstWidth - chanceW
            parameter.currentNodeInfo.height = firstHeight + chanceH
            parameter.currentNodeInfo.translateX = firstTranslateX + chanceW
            break
          case 'topLeft': // 左上角
            parameter.currentNodeInfo.width = firstWidth - chanceW
            parameter.currentNodeInfo.height = firstHeight - chanceH
            parameter.currentNodeInfo.translateX = firstTranslateX + chanceW
            parameter.currentNodeInfo.translateY = firstTranslateY + chanceH
            break
          case 'topRight': // 右上角 ok
            parameter.currentNodeInfo.height = firstHeight + chanceH
            parameter.currentNodeInfo.width = firstWidth + chanceW
            break
          case 'bottomRight': // 右下角 ok
            parameter.currentNodeInfo.height = firstHeight + chanceH
            parameter.currentNodeInfo.width = firstWidth + chanceW
            break
        }
        setPoint()
      }
      document.onmouseup = (e) => { // 鼠标放开
        if (e && e.stopPropagation) {
          e.stopPropagation()
        } else { // 否则，我们需要使用IE的方式来取消事件冒泡
          window.event.cancelBubble = true
        }
        document.onmousemove = null
        document.onmouseup = null
        if (parameter.currentNodeInfo) {
          oDiv.style.transform = 'translate(' + parameter.currentNodeInfo.translateX + 'px, ' + parameter.currentNodeInfo.translateY + 'px)'
          oDiv.style.width = parameter.currentNodeInfo.width + 'px'
          oDiv.style.height = parameter.currentNodeInfo.height + 'px'
        }
        setPoint(true)
        saveInVuex()
      }
    }
    /** 保存进入vuex currentNodeInfo */
    const saveInVuex = () => {
      $forVal.cacheImageActiveBox[$forVal.index] = parameter.currentNodeInfo
      // window.vm.$store.dispatch({
      //   type: 'hotarea',
      //   hotarea: $forVal.cacheImageActiveBox
      // })
    }
  })
})
