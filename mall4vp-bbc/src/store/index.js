import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import user from './modules/user'
import prod from './modules/prod'
import router from './modules/router'
import webConfig from './modules/webConfig'
import websocket from './modules/websocket'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    user,
    prod,
    router,
    websocket,
    webConfig
  },
  mutations: {

  },
  strict: process.env.NODE_ENV !== 'production'
})
