<template>
  <div class="">
    <div class="menu-right-el">
<!--      :default-openeds="openeds"-->
      <el-menu
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose">
        <sub-menu-item v-for="(item,index) in expandMenu" :key="index" :expand-menu="item" />
      </el-menu>
    </div>
  </div>
</template>

<script>
import SubMenuItem from './main-sidebar-sub-menu-item'
export default {
  name: 'sub-menu',
  data () {
    return {
      aaa: this.expandMenu
    }
  },
  props: {
    expandMenu: {
      type: Array,
      default () {
        return []
      }
    }
  },
  components: {
    SubMenuItem
  },
  computed: {
    sidebarLayoutSkin: {
      get () { return this.$store.state.common.sidebarLayoutSkin }
    },
    openeds: {
      get () {
        return this.$store.state.common.menuIds
      }
    }
  },
  methods: {
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
}
</style>
<style scoped>
.menu-left {
  background: #222222;
  color: #FFFFFF !important;
  width: 100px;
  height: 100vh;
}
.el-menu {
  border-right: none !important;
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
.menu-mod .menu-right-item {
  width: 130px;
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
  color: #FFFFFF;
  height: 55px;
  cursor:pointer;
  font-size: 14px;
  color: #FFFFFF;
}

.menu-right li {
  height: 55px;
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
}
/* 鼠标移动到选项上修改背景颜色 */
.menu-right li:hover {
    background-color: rgba(21, 91, 212, 0.1);
    color: #155BD4;
}
.menu-left-active {
  background-color: #FFFFFF;
  color: #155BD4;
}
.menu-right-active {
  background-color: rgba(21, 91, 212, 0.1);
  color: #155BD4;
}
.menu-right-el {
  width: 130px !important;
  border-top: 1px solid #EBEDF0;
  height: calc(100vh - 50px);
  overflow-y: auto;
}
.el-menu-vertical-demo {
  height: 100%;
}
.menu-right-el-item {
  width: 130px !important;
}
</style>
