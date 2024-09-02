import router from '@/router'

export default {
  namespaced: true,
  state: {
    // 页面文档可视高度(随窗口改变大小)
    documentClientHeight: 0,
    // 导航条, 布局风格, defalut(默认) / inverse(反向)
    navbarLayoutType: 'default',
    // 侧边栏, 布局皮肤, light(浅色) / dark(黑色)
    sidebarLayoutSkin: 'dark',
    // 侧边栏, 折叠状态
    sidebarFold: true,
    // 侧边栏, 菜单
    menuList: [],
    menuActiveName: '',
    // 主入口标签页
    mainTabs: [],
    mainTabsActiveName: '',
    // 当前选择的标签
    selectMenu: [],
    // 路由列表
    routeList: [],
    menuIds: [],
    selectLeftId: '',
    selectRightId: ''
  },
  mutations: {
    updateDocumentClientHeight (state, height) {
      state.documentClientHeight = height
    },
    updateSidebarFold (state, fold) {
      state.sidebarFold = fold
      document.body.style.setProperty('--tit-width-incremental', fold ? '130px' : '0px')
    },
    updateMenuList (state, list) {
      state.menuList = list
    },
    updateRouteList (state, list) {
      state.routeList = list
    },
    updateMenuActiveName (state, name) {
      state.menuActiveName = name
    },
    updateMainTabs (state, tabs) {
      state.mainTabs = tabs
    },
    updateMainTabsActiveName (state, name) {
      state.mainTabsActiveName = name
    },
    updateSelectMenu (state, list) {
      state.selectMenu = list
    },
    updateSelectLeftId (state, id) {
      state.selectLeftId = id
    },
    updateSelectRightId (state, id) {
      state.selectRightId = id
    },
    replaceSelectMenu (state, title) {
      state.selectMenu.splice(state.selectMenu.length - 1, 1, title)
    },
    updateMenuIds (state, list) {
      state.menuIds = []
      list.forEach(menu => {
        state.menuIds.push(String(menu.menuId + ''))
      })
    },
    removeMainActiveTab (state) {
      state.mainTabs = state.mainTabs.filter(item => item.name !== state.mainTabsActiveName)
      if (state.mainTabs.length >= 1) {
        // 当前选中tab被删除
        router.push({ name: state.mainTabs[state.mainTabs.length - 1].name }, () => {
          state.mainTabsActiveName = state.mainTabs[state.mainTabs.length - 1].name
        })
      } else {
        state.menuActiveName = ''
        router.push({ name: 'home' })
      }
    }
  }
}
