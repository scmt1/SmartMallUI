/* eslint-disable camelcase */
/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
// import menuList from './menuList'
import {clearLoginInfo} from '@/utils'
import i18n from '../i18n/i18n'
import { isURL } from '@/utils/validate'
import store from '@/store'
Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  {path: '/401', component: _import('common/401'), name: '401', meta: {title: i18n.t('homes.noPermission')}},
  {path: '/404', component: _import('common/404'), name: '404', meta: {title: i18n.t('homes.notFound')}},
  {path: '/login', component: _import('common/login'), name: 'login', meta: {title: i18n.t('homes.login')}},
  {path: '/register', component: _import('common/register'), name: 'register', meta: {title: i18n.t('homes.register')}},
  {path: '/findPwd', component: _import('common/findPwd'), name: 'findPwd', meta: {title: '找回密码'}},
  {path: '/imBox', component: _import('common/imBox'), name: 'imBox', meta: {title: i18n.t('home.msgBox')}},
  // 开店
  {path: '/shopProcess', component: _import('modules/shopProcess/shopProcess'), name: 'shopProcess', meta: {title: i18n.t('shopProcess.openAShop')}},

  {path: '/billingCashier', component: _import('modules/billingCashier/billingCashier'), name: 'billingCashier', meta: {title: '开单'}},
  {path: '/cashierOrder', component: _import('modules/cashierOrder/index'), name: 'cashierOrder', meta: {title: '订单'}},
  {path: '/rooms', component: _import('modules/rooms/roomsIndex'), name: 'rooms', meta: {title: '桌位'}},
  {path: '/pickup', component: _import('modules/pickup/pickupIndex'), name: 'pickup', meta: {title: '取餐'}},
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: {name: 'home'},
  meta: {title: i18n.t('homes.layout')},
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    {path: '/home', component: _import('common/home'), name: 'home', meta: {title: i18n.t('homes.home')}},
    // { path: '/prodInfo', component: _import('modules/prod/prodInfo'), name: 'prodInfo', meta: { isTab: true, title: '产品详情' } },
    {path: '/prodInfo', component: _import('modules/prod/prodInfo'), name: 'prodInfo', meta: {title: i18n.t('homes.productDetails')}},
    {
      path: '/discountInfo',
      component: _import('modules/marketing/discountInfo'),
      name: 'discountInfo',
      meta: {title: i18n.t('activityDetails'), isTab: true}
    },
    {path: '/roomProds', component: _import('modules/live/room/roomProds'), name: 'roomProds', meta: {title: i18n.t('menuList.liveRoomMerchand')}},
    {path: '/groupProds', component: _import('modules/group/groupProd'), name: 'groupProds', meta: {title: i18n.t('groups.manageEventProducts')}},
    // 订单结算明细页
    {path: '/billing-details', component: _import('modules/finance/billing-details/index'), name: 'billingDetails', meta: {title: '结算明细'}},
    // 微页面编辑页
    { path: '/shop/feature-create', component: _import('modules/shop/feature/create/edit/index'), name: 'featureCreate', meta: {title: i18n.t('shopFeature.editMiniPage'), isTab: false} }
  ],
  beforeEnter (to, from, next) {
    let authorization = Vue.cookie.get('Authorization_vs')
    if (!authorization || !/\S/.test(authorization)) {
      clearLoginInfo()
      next({name: 'login'})
    }
    store.commit('router/updateIncludePageList', to.name)
    store.commit('router/pushHisPageList', to.name)
    next()
  }
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({y: 0}),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach(async (to, from, next) => {
  // 路由返回加入keep-alive
  const hisPageList = store.state.router.hisPageList
  if (to.name && hisPageList.indexOf(to.name) > -1) {
    store.commit('router/updateIncludePageList', to.name)
  }
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  let user
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    if (to.path === '/shopProcess' || to.path === '/imBox') {
      try {
        user = await store.dispatch('user/getUserInfo')
      } catch (error) {
        await router.push({name: 'login'})
        return
      }
      const shopStatus = user.shopStatus
      if (shopStatus !== 4 && shopStatus !== 5) {
        if (to.path === '/shopProcess') {
          next({ path: '/home', replace: true })
          return
        }
      } else {
        if (to.path === '/imBox') {
          next({ path: '/401', replace: true })
          return
        }
      }
    }
    let routeList = store.state.common.routeList
    let navTitles = []
    let leftMenuId = ''
    routeList.forEach(item => {
      if (to.meta.menuId === item.menuId) {
        navTitles.push(item.name)
        routeList.forEach(item1 => {
          if (item.parentId === item1.menuId) {
            navTitles.push(item1.name)
            leftMenuId = item.parentId
            routeList.forEach(item2 => {
              if (item1.parentId === item2.menuId) {
                navTitles.push(item2.name)
                leftMenuId = item1.parentId
              }
            })
          }
        })
      }
    })
    navTitles = navTitles.reverse()
    if (to.meta.isLeftMenu || to.path === '/home' || leftMenuId) {
      if (leftMenuId) {
        store.commit('common/updateSelectLeftId', leftMenuId)
        store.commit('common/updateSelectRightId', to.meta.menuId)
      } else {
        store.commit('common/updateSidebarFold', true)
        store.commit('common/updateSelectLeftId', to.path === '/home' ? '' : to.meta.menuId)
      }
    }
    store.commit('common/updateSelectMenu', navTitles)
    next()
  } else {
    try {
      user = await store.dispatch('user/getUserInfo')
    } catch (error) {
      await router.push({name: 'login'})
      return
    }
    const shopStatus = user.shopStatus
    if (shopStatus === 4 || shopStatus === 5) {
      // if (to.path === '/home') {
      next({path: '/shopProcess', replace: true})
      return
      // } else {
      //   next({ path: '/401', replace: true })
      //   return
      // }
    }
    http({
      url: http.adornUrl('/sys/shopMenu/nav'),
      method: 'get',
      params: http.adornParams()
    }).then(({ data }) => {
      sessionStorage.setItem('authorities', JSON.stringify(data.authorities || '[]'))
      router.options.isAddDynamicMenuRoutes = true
      let rList = []
      data.menuList.forEach(item => {
        item.isLeftMenu = item.parentId === 0
        rList.push({
          menuId: item.menuId,
          name: item.name,
          parentId: item.parentId,
          url: item.url.replace('/', '-')
        })
        if (item.list) {
          item.list.forEach(item1 => {
            item1.isLeftMenu = item1.parentId === 0
            rList.push({
              menuId: item1.menuId,
              name: item1.name,
              parentId: item1.parentId,
              url: item1.url.replace('/', '-')
            })
            if (item1.list) {
              item1.list.forEach(item2 => {
                item2.isLeftMenu = item2.parentId === 0
                rList.push({
                  menuId: item2.menuId,
                  name: item2.name,
                  parentId: item2.parentId,
                  url: item2.url.replace('/', '-')
                })
              })
            }
          })
        }
      })
      fnAddDynamicMenuRoutes(data.menuList)
      sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'))
      store.commit('common/updateRouteList', rList)
      store.commit('common/updateMenuIds', rList)
      next({ ...to, replace: true })
    }).catch((e) => {
      console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
      router.push({ name: 'login' })
    })
  }
})

/**
 * 处理偶现Loading chunk {n} failed问题
 */
router.onError((error) => {
  // console.error('路由异常', error)
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  if (isChunkLoadFailed) {
    // 出现错误时刷新页面
    location.reload()
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: '',
          isLeftMenu: menuList[i].isLeftMenu
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) { }
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      {path: '*', redirect: {name: '404'}}
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
  }
}

// push
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

// replace
const VueRouterReplace = Router.prototype.replace
Router.prototype.replace = function replace (to) {
  return VueRouterReplace.call(this, to).catch(err => err)
}

export default router
