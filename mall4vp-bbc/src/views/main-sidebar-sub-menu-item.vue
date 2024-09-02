<template>
  <div class="muen-mod" v-if="expandMenu.hidden === 0">
    <div v-if="expandMenu.list">
      <el-submenu :index="expandMenu.menuId + ''">
        <template slot="title">
          <span style="font-size: 14px;" :title="expandMenu.name.length > 4 ? expandMenu.name : ''">{{ expandMenu.name}}</span>
        </template>
        <el-menu-item-group class="menu-right-el-item">
          <el-menu-item  v-if="!item.hidden" style="font-size: 14px !important;height: 40px !important; line-height:40px;padding-left: 30px !important;padding-right: 10px !important;"  @click="gotoRouteHandle(item)" v-for="item in expandMenu.list" :key="item.menuId" class="item-text menu-right-el-item is-active" :class="{'menu-active': selectRightId === item.menuId}">
            <span :title="item.name.length > 4 ? item.name : ''">{{ item.name }}</span>
            <sub-menu-item v-if="item.list" :expand-menu="item" />
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </div>
    <div v-else>
      <el-menu-item v-if="!expandMenu.hidden" style="font-size: 14px !important;height: 40px !important;padding-left: 15px !important;line-height: 40px;"  @click="gotoRouteHandle(expandMenu)" :key="expandMenu.menuId" class="item-text menu-right-el-item is-active" :class="{'menu-active': selectRightId === expandMenu.menuId}">
        <span :title="expandMenu.name.length > 4 ? expandMenu.name : ''">{{ expandMenu.name }}</span>
          <!-- <sub-menu-item v-if="expandMenu.list" :expand-menu="expandMenu" /> -->
      </el-menu-item>
    </div>
  </div>
</template>

<script>
import SubMenuItem from './main-sidebar-sub-menu-item'
export default {
  name: 'sub-menu-item',
  components: {
    SubMenuItem
  },
  data () {
    return {
    }
  },
  props: {
    expandMenu: {
      type: Object,
      default () {
        return {}
      }
    },
    menuIndex: {
      type: String,
      default: ''
    }
  },
  computed: {
    sidebarLayoutSkin: {
      get () { return this.$store.state.common.sidebarLayoutSkin }
    },
    selectRightId: {
      get () { return this.$store.state.common.selectRightId }
    }
  },
  watch: {
    $route: 'routeHandle'
  },
  mounted () {
  },
  methods: {
    // 路由操作
    routeHandle (route) {
      // console.log(this.menuIndex)
      // console.log(route.meta)
      if (route.meta.isTab) {
        this.$store.commit('common/updateSelectRightId', route.meta.menuId || '')
      }
    },
    // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
    gotoRouteHandle (menu) {
      if (this.$router.history.current.name === menu.url.replace('/', '-')) {
        return
      }
      // 修改缓存页面
      this.$store.commit('router/updateIncludePageList', [menu.url.replace('/', '-')])
      this.$store.commit('router/pushHisPageList', [menu.url.replace('/', '-')])
      this.$router.push({ name: menu.url.replace('/', '-') })
    },
    handleOpen (key, keyPath) {
    },
    handleClose (key, keyPath) {
    }
  }
}
</script>
<style>
.el-submenu .el-menu-item {
  width: 130px !important;
  min-width: 130px !important;
  font-size: 14px !important;
  line-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-menu-item.is-active{
  background: #FFFFFF;
  border-bottom: 0px solid transparent;
  color: #333333 !important;
}
.muen-mod .el-submenu  .el-submenu__icon-arrow {
  margin-right: -5px !important;
}
.el-menu-item  {
  white-space: normal;
  word-break: break-word;
  padding: 0 !important;
  align-items: center;
}

.el-submenu__title {
  white-space: normal;
  word-break: break-word;
  line-height: 20px;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}
.el-menu-item-group__title {
  padding: 0;
}
</style>
<style scoped>
.menu-active {
  background: rgba(21, 91, 212, 0.1);
  color: #155BD4 !important;
}
::v-deep .el-menu-item-group__title {
  padding: 0;
}
.el-menu-item:hover {
  color: #155BD4;
}
div ::v-deep .el-submenu__title {
  height: 40px;
  line-height: 40px;
  padding-left: 15px !important;
}
div ::v-deep .el-submenu__title span {
  display: inline-block;
  width: 85px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-submenu .el-menu-item {
  height: 40px;
}
.item-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
