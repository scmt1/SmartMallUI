export default {
  namespaced: true,
  state: {
    includePageList: [],
    hisPageList: []
  },
  mutations: {
    updateIncludePageList (state, page) {
      state.includePageList = page
    },
    pushIncludePageList (state, page) {
      state.includePageList.push(page)
    },
    pushHisPageList (state, page) {
      state.hisPageList.push(page)
      state.hisPageList = [...new Set(state.hisPageList)]
    }

  }
}
