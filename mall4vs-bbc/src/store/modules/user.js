import http from '@/utils/httpRequest'

export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    mobile: '',
    userName: '',
    shopId: '',
    type: '',
    employeeId: '',
    shopStatus: -2
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateType (state, type) {
      state.type = type
    },
    updateMobile (state, mobile) {
      state.mobile = mobile
    },
    updateUserName (state, userName) {
      state.userName = userName
    },
    updateShopId (state, shopId) {
      state.shopId = shopId
    },
    updateEmployeeId (state, employeeId) {
      state.employeeId = employeeId
    },
    updateShopStatus (state, shopStatus) {
      state.shopStatus = shopStatus
    }
  },
  actions: {
    login ({ commit, state }) {
      return new Promise((resolve, reject) => {
        http({
          url: http.adornUrl('/shop/shopDetail/info'),
          method: 'get',
          params: http.adornParams()
        }).then(({ data }) => {
          commit('updateName', data.shopName)
          commit('updateMobile', data.mobile)
          commit('updateType', data.type)
          commit('updateUserName', data.userName)
          commit('updateShopStatus', data.shopStatus)
          commit('updateShopId', data.shopId)
          commit('updateEmployeeId', data.employeeId)
          resolve(state)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getUserInfo ({ commit, state }) {
      if (state.shopStatus !== -2) {
        // 已经获取值，直接返回
        return state
      }
      return new Promise((resolve, reject) => {
        http({
          url: http.adornUrl('/shop/shopDetail/info'),
          method: 'get',
          params: http.adornParams()
        }).then(({ data }) => {
          commit('updateName', data.shopName)
          commit('updateMobile', data.mobile)
          commit('updateType', data.type)
          commit('updateUserName', data.userName)
          commit('updateShopStatus', data.shopStatus)
          commit('updateShopId', data.shopId)
          commit('updateEmployeeId', data.employeeId)
          resolve(state)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
