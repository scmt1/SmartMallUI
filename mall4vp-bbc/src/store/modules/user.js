export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    mobile: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateMobile (state, mobile) {
      state.mobile = mobile
    }
  }
}
