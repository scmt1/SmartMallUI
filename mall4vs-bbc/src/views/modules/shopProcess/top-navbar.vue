<template>
  <div class="shop-process-navbar">
    <div class="navbar-content">
      <div class="left-menu">
        <div class="title">{{ $t('shopProcess.topNavbarTitle') }}</div>
      </div>
      <div class="right-menu">
        <div class="item">
          <el-dropdown @command="switchLang">
            <span class="el-dropdown-link">
              {{ $t("language") }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="zh_CN">简体中文</el-dropdown-item>
              <el-dropdown-item command="en">English</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="item">
          <el-dropdown class="avatar-container" trigger="hover">
            <span class="el-dropdown-link">{{ shopName ? shopName : shopUserName }}</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="logoutHandle()">{{ $t("homes.exit") }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { clearLoginInfo } from '@/utils'
export default {
  data () {
    return {
      shopName: '',
      shopUserName: ''
    }
  },

  created () {
    this.getUserInfo()
  },

  methods: {
    // 获取当前管理员信息
    getUserInfo () {
      this.$http({
        url: this.$http.adornUrl('/shop/shopDetail/info'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.loading = false
        this.shopName = data.shopName
        this.mobile = data.mobile
        this.shopUserName = data.userName
      })
    },

    switchLang (lang) {
      localStorage.setItem('lang', lang)
      window.location.reload()
    },

    // 退出
    logoutHandle () {
      this.$confirm(this.$i18n.t('homes.isExit'), this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('homes.yes'),
        cancelButtonText: this.$i18n.t('homes.no'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/logOut'),
          method: 'post',
          data: this.$http.adornData()
        }).then(({ data }) => {
          clearLoginInfo()
          this.$router.push({ name: 'login' })
        })
      }).catch(() => { })
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-process-navbar {
  display: block;
  width: 100%;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0, .08);
  font-size: 15px;
  .navbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .right-menu {
      padding-right: 10px;
      .item {
        display: inline-block;
        margin-left: 20px;
        .avatar-container.el-dropdown {
          padding: 0 20px;
        }
      }
    }
    .el-dropdown-link {
      cursor: pointer;
    }
  }
}
</style>
