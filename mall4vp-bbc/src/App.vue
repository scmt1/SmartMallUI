<template>
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
export default {
  mounted () {
    // 检测浏览器路由改变页面不刷新问题,hash模式的工作原理是hashchange事件
    window.addEventListener('hashchange', () => {
      let currentPath = window.location.hash.slice(1)
      if (this.$route.path !== currentPath) {
        this.$router.push(currentPath)
      }
    }, false)
  },
  computed: {
    key () {
      return this.$route.path + Math.random()
    }
  },
  watch: {
    // $route: function(val) { // 监听路由
    //   console.log(val)
    //   if(val.path === '/platform-decorate/create/edit/index') {

    //   }
    // }
  }
}
</script>

<style>
.maxindex {
  z-index: 99999!important;
}
.el-scrollbar__wrap::-webkit-scrollbar{
  display:none !important
}

.el-select-dropdown__list::-webkit-scrollbar{
  display: none !important
}

.el-message-box__wrapper .el-message-box .el-message-box__btns .el-button--primary:focus{
  color: #FFF;
  background-color: #155bd4;
  border-color: #155bd4
}
</style>