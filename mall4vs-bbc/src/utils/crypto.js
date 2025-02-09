import CryptoJS from 'crypto-js'
// 加密
const keyStr = '-mall4j-password' // 解密用的key
export function encrypt (word) {
  const time = Date.now()

  const key = CryptoJS.enc.Utf8.parse(keyStr)
  const srcs = CryptoJS.enc.Utf8.parse(time + word) // 格式为: 时间戳 + 密码
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7})
  return encrypted.toString()
}
