import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import { clearLoginInfo } from '@/utils'
import { Message } from 'element-ui'
import i18n from '../i18n/i18n'

const http = axios.create({
  timeout: 1000 * 80,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  config.headers['Authorization'] = Vue.cookie.get('Authorization_vp') // 请求头带上token
  config.headers['locale'] = localStorage.getItem('lang') || 'zh_CN'
  // 只针对get方式进行序列化
  if (config.method === 'get' || config.method === 'GET') {
    config.paramsSerializer = function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  // blob 格式处理
  if (response.request.responseType === 'blob') {
    return response
  }
  const res = response.data
  // 00000 请求成功
  if (res.code === '00000') {
    return res
  }
  // A00001 用于直接显示提示用户的错误,内容由输入决定
  if (res.code === 'A00001') {
    Message({
      message: res.msg || 'Error',
      type: 'error',
      duration: 1.5 * 1000
    })
    return Promise.reject(res)
  }
  // A00002 用于直接显示提示系统的成功,内容由输入决定
  if (res.code === 'A00002') {
    Message({
      message: res.msg,
      type: 'success',
      duration: 1.5 * 1000
    })
  }

  // A00004 未授权
  if (res.code === 'A00004') {
    clearLoginInfo()
    router.push({ name: 'login' })
  }

  // A00005 服务器异常
  if (res.code === 'A00005') {
    console.error('============== 请求异常 ==============')
    console.log('接口地址: ', response.config.url.replace(process.env.VUE_APP_BASE_API, ''))
    console.log('异常信息: ', res)
    console.error('============== 请求异常 end ==========')
    Message({
      message: i18n.t('utils.serverErr'),
      type: 'error',
      duration: 1.5 * 1000,
      customClass: 'element-error-message-zindex'
    })
    return Promise.reject(res)
  }
  if (res.code === 'A00014') {
    Message({
      message: res.msg,
      type: 'error',
      duration: 1.5 * 1000
    })
    return Promise.reject(res)
  }
}, error => {
  console.log('========请求失败========')
  console.log(error)
  switch (error.response.status) {
    case 400:
      Message({
        message: error.response.data,
        type: 'error',
        duration: 1500,
        customClass: 'element-error-message-zindex'
      })
      break
    case 401:
      clearLoginInfo()
      router.push({ name: 'login' })
      break
    case 405:
      Message({
        message: i18n.t('utils.requestErr'),
        type: 'error',
        duration: 1500,
        customClass: 'element-error-message-zindex'
      })
      break
    case 500:
      Message({
        message: i18n.t('utils.serverErr'),
        type: 'error',
        duration: 1500,
        customClass: 'element-error-message-zindex'
      })
      break
    case 501:
      Message({
        message: i18n.t('utils.serverNoSupp'),
        type: 'error',
        duration: 1500,
        customClass: 'element-error-message-zindex'
      })
      break
  }
  return Promise.reject(error)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName) => {
  return process.env.VUE_APP_BASE_API + actionName
}

/**
 * im请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornImUrl = (actionName) => {
  return process.env.VUE_APP_IM_API + actionName
}

/**
 * im ws 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornWsImUrl = (actionName) => {
  return process.env.VUE_APP_WS_IM_API + actionName
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    't': new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

var uploadFile = function (url, file) {
  let config = {
    // 添加请求头
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': Vue.cookie.get('Authorization_vp') // 请求头带上token
    }
  }
  let param = new FormData()
  // 通过append向form对象添加数据
  param.append('file', file)
  return axios.post(url, param, config)
}

export default http
export { uploadFile }
