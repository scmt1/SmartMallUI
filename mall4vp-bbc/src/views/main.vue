<template>
  <div
    class="site-wrapper"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <template v-if="!loading">
      <main-navbar v-if="isDecorate" />
      <main-sidebar v-if="isDecorate" />
      <div :class="{'site-content__wrapper' : isDecorate}" :style="{ 'min-height': documentClientHeight + 'px' }">
        <main-content />
      </div>
    </template>
  </div>
</template>

<script>
  import MainNavbar from './main-navbar'
  import MainSidebar from './main-sidebar'
  import MainContent from './main-content'
  export default {
    data () {
      return {
        loading: true
      }
    },
    components: {
      MainNavbar,
      MainSidebar,
      MainContent
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight },
        set (val) { this.$store.commit('common/updateDocumentClientHeight', val) }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold }
      },
      userId: {
        get () { return this.$store.state.user.id },
        set (val) { this.$store.commit('user/updateId', val) }
      },
      userName: {
        get () { return this.$store.state.user.name },
        set (val) { this.$store.commit('user/updateName', val) }
      },
      mobile: {
        get () { return this.$store.state.user.mobile },
        set (val) { this.$store.commit('user/updateMobile', val) }
      },
      isDecorate: {
        get () { return !(this.$route.name === 'platform-feature/create/edit/index' || this.$route.name === 'platform-decorate/create/edit/index') }
      }
    },
    created () {
      this.getUserInfo()
    },
    mounted () {
      this.resetDocumentClientHeight()
    },
    methods: {
      // 重置窗口可视高度
      resetDocumentClientHeight () {
        this.documentClientHeight = document.documentElement['clientHeight'] - 50
        window.onresize = () => {
          this.documentClientHeight = document.documentElement['clientHeight'] - 50
        }
      },
      // 获取当前管理员信息
      getUserInfo () {
        this.$http({
          url: this.$http.adornUrl('/sys/user/info'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.loading = false
          this.userId = data.userId
          this.userName = data.username
          this.mobile = data.mobile
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
.site-content__wrapper {
  background: #f5f6f9;
}
</style>