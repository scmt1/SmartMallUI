import { Message } from 'element-ui'
let messageInstance = null
const message = (options) => {
  if (messageInstance) {
    messageInstance.close()
  }
  messageInstance = Message(options)
}
['error', 'success', 'info', 'warning'].forEach(type => {
  message[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options,
        customClass: 'maxindex'
      }
    }
    options.type = type
    return message(options)
  }
})
export const newMessage = message
