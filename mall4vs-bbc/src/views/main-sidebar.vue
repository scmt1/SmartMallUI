<template>
  <aside class="site-sidebar">
    <div class="menu-mod">
      <el-scrollbar style="height: 100vh">
      <div class="menu-left">
        <ul>
          <li>
            <div :class="{'menu-left-active': selectLeftId === '', 'menu-left-item1' : $i18n.t('language') === 'English','menu-left-item' : $i18n.t('language') !== 'English'}" @click="toHome()">
              <icon-svg name="shouye" class="site-sidebar__menu-icon" style="font-size: 16px;margin-right: 3px !important; "></icon-svg>
              <span style="font-size: 14px">{{$t("homes.home")}}</span>
            </div>
          </li>
        </ul>
        <ul>
          <li v-for="menu in menuList" v-if="!menu.hidden && menu.nameEn != showName" class="menu-left-active">
            <div :class="{'menu-left-active': selectLeftId === menu.menuId, 'menu-left-item1' : $i18n.t('language') === 'English','menu-left-item' : $i18n.t('language') !== 'English'}" v-if="menu.list" @click="expandMenu(menu)">
              <icon-svg
                v-if="menu.icon"
                :name="menu.icon || ''"
                class="site-sidebar__menu-icon"
                style="font-size: 16px;margin-right: 3px !important;"
              ></icon-svg>
              <span class="item-text" :title="menu.name.length > 4 ? menu.name : ''" style="font-size: 14px">{{ menu.name }}</span>
            </div>
            <div v-else @click="gotoRouteHandle(menu)" :class="{'menu-left-active': selectLeftId === menu.menuId, 'menu-left-item1' : $i18n.t('language') === 'English','menu-left-item' : $i18n.t('language') !== 'English'}">
              <icon-svg
                v-if="menu.icon"
                :name="menu.icon || ''"
                style="font-size: 16px;margin-right: 3px !important;"
                class="site-sidebar__menu-icon"
              ></icon-svg>
              <span class="item-text" :title="menu.name.length > 4 ? menu.name : ''" style="font-size: 14px">{{ menu.name }}</span>
            </div>
          </li>
        </ul>
      </div>
      </el-scrollbar>
      <sub-menu
        v-if="!sidebarFold&&isTrue"
        :expand-menu="expandMenuList"
      >
      </sub-menu>
    </div>
  </aside>

</template>

<script>
  import SubMenu from './main-sidebar-sub-menu'
  import { isURL } from '@/utils/validate'
  import i18n from '../i18n/i18n'

  export default {
    data () {
      return {
        showName: 'Message box',
        dynamicMenuRoutes: [],
        imBoxFlag: null,
        expandMenuList: [],
        isTrue: true
      }
    },
    components: {
      SubMenu
    },
    computed: {
      sidebarLayoutSkin: {
        get () { return this.$store.state.common.sidebarLayoutSkin }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold },
        set (val) { this.$store.commit('common/updateSidebarFold', val) }
      },
      menuList: {
        get () { return this.$store.state.common.menuList },
        set (val) { this.$store.commit('common/updateMenuList', val) }
      },
      routeList: {
        get () { return this.$store.state.common.routeList },
        set (val) { this.$store.commit('common/updateRouteList', val) }
      },
      menuActiveName: {
        get () { return this.$store.state.common.menuActiveName },
        set (val) { this.$store.commit('common/updateMenuActiveName', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      mainTabsActiveName: {
        get () { return this.$store.state.common.mainTabsActiveName },
        set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
      },
      selectLeftId: {
        get () {
          this.handleRightRoute(this.$store.state.common.selectLeftId)
          return this.$store.state.common.selectLeftId || ''
        }
      }
    },
    watch: {
      $route: 'routeHandle'
    },
    created () {
      this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
      this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
      this.routeHandle(this.$route)
      this.imBoxFlag = this.menuList.some(element => {
        return element.name === '消息盒子'
      })
      if (this.selectLeftId) {
        this.handleRightRoute(this.selectLeftId)
      }
    },
    methods: {
      handleRightRoute (selectLeftId) {
        this.menuList.forEach(item => {
          if (selectLeftId === item.menuId) {
            this.expandMenu(item, true)
          }
        })
      },
      toHome () {
        this.$router.push({ name: 'home' })
        this.sidebarFold = true
        this.expandMenuList = []
        sessionStorage.setItem('isExpand', '0')
        this.$store.commit('common/updateSelectLeftId', '') // updateSelectLeftId
        this.$store.commit('common/updateSelectRightId', '')
      },
      // 路由操作
      routeHandle (route) {
        if (route.name === 'home') {
          this.expandMenuList = []
          sessionStorage.setItem('isExpand', '0')
          this.$store.commit('common/updateSelectLeftId', '')
          this.$store.commit('common/updateSelectRightId', '')
        }
        if (route.meta.isTab) {
          // tab选中, 不存在先添加
          var tab = this.mainTabs.filter(item => item.name === route.name)[0]
          if (!tab) {
            if (route.meta.isDynamic) {
              route = this.dynamicMenuRoutes.filter(item => item.name === route.name)[0]
              if (!route) {
                return console.error(i18n.t('publics.noAbleTabErr'))
              }
            }
            tab = {
              menuId: route.meta.menuId || route.name,
              name: route.name,
              title: route.meta.title,
              type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
              iframeUrl: route.meta.iframeUrl || ''
            }
            this.mainTabs = this.mainTabs.concat(tab)
          }
          this.menuActiveName = tab.menuId + ''
          this.mainTabsActiveName = tab.name
        }
      },
      openUrl () {
        sessionStorage.setItem('isExpand', '0')
        window.open(location.href.split('#')[0] + '#/imBox', 'view_window')
      },
      gotoRouteHandle (menu) {
        if (this.$router.history.current.name === menu.url.replace('/', '-')) {
          this.expandMenuList = []
          this.sidebarFold = true
          sessionStorage.setItem('isExpand', '0')
          this.$store.commit('common/updateSelectRightId', '')
          this.$store.commit('common/updateSelectLeftId', menu.menuId || '')
          return
        }
        if (menu.name === '消息' || menu.name === 'Message') {
          sessionStorage.setItem('isExpand', '0')
          window.open(location.href.split('#')[0] + '#/imBox', 'view_window')
        } else {
          this.expandMenuList = []
          this.sidebarFold = true
          sessionStorage.setItem('isExpand', '0')
          this.$store.commit('common/updateSelectRightId', '')
          this.$store.commit('common/updateSelectLeftId', menu.menuId || '')
          this.$router.push({ name: menu.url.replace('/', '-') })
        }
      },
      expandMenu (menu, flag) {
        this.expandMenuList = menu.list || []
        this.sidebarFold = menu.list === null
        this.isTrue = false
        setTimeout(() => { this.isTrue = true })
        const id1 = this.$store.state.common.selectLeftId
        this.$store.commit('common/updateSelectLeftId', menu.menuId || '')
        const id2 = this.$store.state.common.selectLeftId
        if (menu.list) {
          sessionStorage.setItem('isExpand', '1')
        }
        if (id1 !== id2) {
          this.routeJump(menu)
        }
      },
      // 默认跳转展开菜单的第一个路由
      routeJump (menu) {
        const routes = menu.list
        for (let i = 0; i < routes.length; i++) {
          if (!routes[i].hidden && !routes[i].list) {
            // 修改缓存页面
            this.$store.commit('router/updateIncludePageList', [routes[i].url.replace('/', '-')])
            this.$store.commit('router/pushHisPageList', [routes[i].url.replace('/', '-')])
            this.$router.push({ name: routes[i].url.replace('/', '-') })
            break
          } else if (routes[i].list) {
            let flag = false
            for (let j = 0; j < routes[i].list.length; j++) {
              if (!routes[i].list[j].hidden) {
                // 修改缓存页面
                this.$store.commit('router/updateIncludePageList', [routes[i].list[j].url.replace('/', '-')])
                this.$store.commit('router/pushHisPageList', [routes[i].list[j].url.replace('/', '-')])
                this.$router.push({ name: routes[i].list[j].url.replace('/', '-') })
                flag = true
                break
              }
            }
            if (flag) {
              break
            }
          }
        }
      }
    }
  }
</script>
<style scoped>
.menu-mod {
  display: flex;
}
.menu-left {
  background: #222222;
  color: #FFFFFF !important;
  width: 100px;
  height: calc(100vh - 50px);
  overflow-y: auto;
}
.menu-right {
  background: #FFFFFF;
}
.menu-mod .menu-left-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.menu-mod .menu-left-item1 {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  text-align: left;
  padding-left: 12px;
}
.menu-mod .menu-right-item {
  width: 140px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.site-sidebar__inner {
  background: #ffffff;
  width: 100px;
}
.menu-mod .menu-left ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: 100px;
    text-align: center;
}
.menu-mod .menu-right ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: 130px;
    text-align: center;
}
.menu-left li {
  background: #222222;
  color: #FFF;
  height: 40px;
  cursor:pointer;
  font-size: 14px;
  stroke: #FFF !important;
}

.menu-right li {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor:pointer;
  font-size: 14px;
  color: #333333;
}

/* 鼠标移动到选项上修改背景颜色 */
.menu-left li:hover {
    background-color: #FFFFFF;
    color: #155BD4;
    stroke: #155BD4 !important;
}
/* 鼠标移动到选项上修改背景颜色 */
.menu-right li:hover {
    background-color: rgba(21, 91, 212, 0.1);
    color: #155BD4;
}
.menu-right li:hover {
    background-color: rgba(21, 91, 212, 0.1);
    color: #155BD4;
}
.menu-left-active {
  background-color: #FFFFFF;
  color: #155BD4;
  stroke: #155BD4 !important;
}
.menu-right-active {
  background-color: rgba(21, 91, 212, 0.1);
  color: #155BD4;
}
.item-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  max-width: 70px;
}
</style>
