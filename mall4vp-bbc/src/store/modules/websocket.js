export default {
  state: {
    websocketConnect: false,
    messageValue: 1
  },
  mutations: {
    changeWebsocket (state, status) {
      state.websocketConnect = status
    },
    changeMessage (state, number) {
      state.messageValue = number
    }
  }
}
