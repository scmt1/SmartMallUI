<template>
  <div class="site-wrapper"
       :class="{ 'site-sidebar--fold': sidebarFold }"
       v-loading.fullscreen.lock="loading"
       :element-loading-text="this.$i18n.t('homes.loading')">
    <template v-if="!loading">
      <main-navbar v-if="isDecorate" />
      <main-sidebar v-if="isDecorate" />
      <div :class="{'site-content__wrapper' : isDecorate}"
           :style="{ 'min-height': documentClientHeight + 'px' }">
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
    shopUserName: {
      get () { return this.$store.state.user.userName },
      set (val) { this.$store.commit('user/updateUserName', val) }
    },
    shopStatus: {
      get () { return this.$store.state.user.shopStatus },
      set (val) { this.$store.commit('user/updateShopStatus', val) }
    },
    isDecorate: {
      get () { return !(this.$route.name === 'shop-feature/create/edit/index' || this.$route.name === 'shop-decorate/create/edit/index') }
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
        url: this.$http.adornUrl('/shop/shopDetail/info'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.loading = false
        this.userName = data.shopName
        this.mobile = data.mobile
        this.shopUserName = data.userName
        this.shopStatus = data.shopStatus
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.site-content__wrapper {
  background: #f5f6f9;
}
.el-message-box__wrapper .el-message-box .el-message-box__btns .el-button--primary:focus{
  color: #FFF;
  background-color: #155bd4;
  border-color: #155bd4
}
</style>