/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}
export function validEmail (s) {
  const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 * 判断是否全为空格 只要有一个其他字符返回false
 * @param {String} str
 * @returns {Boolean}
 */
export function validNoEmptySpace (str) {
  var reg = /^\s+$/g
  return reg.test(str)
}

/**
 * 统一社会信用代码
 * @param value 输入值
 * @returns 匹配结果
 */
export function isCreditCode (value) {
  const reg = /^(([0-9A-Za-z]{15})|([0-9A-Za-z]{18})|([0-9A-Za-z]{20}))$/
  return reg.test(value)
}

/**
 * 用户名
 * 1.由字母、数字或下划线 4-16位组成
 * 2.不能为纯数字
 * @param userName 输入值
 * @returns 匹配结果
 */
export function isUserName (userName) {
  const reg = /^(?!\d+$)[a-zA-Z0-9_]{4,16}$/
  return reg.test(userName)
}

/**
 * 去除头尾两端空格
 */
export function removeHeadAndTailSpaces (value) {
  return value.trim()
}
