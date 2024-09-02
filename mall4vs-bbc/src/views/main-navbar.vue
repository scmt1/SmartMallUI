<template>
  <div>
    <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
      <div class="site-navbar__header" :class="{'is-fold': sidebarFold,'no-fold': sidebarFold }" :style="{ 'margin-right': sidebarFold ? 0 : '20px'}">
        <div class="site-navbar__brand" style="width: auto;">
          <!--<a class="site-navbar__brand-lg" href="javascript:;">{{
            $t("homes.names")
          }}</a>
          <a class="site-navbar__brand-mini" href="javascript:;">{{
            $t("homes.shortName")
          }}</a>-->
<!--          <img-->
<!--            class="menu-image-logo"-->
<!--            v-if="configuration.bsTopBarIcon"-->
<!--            :src="configuration.bsTopBarIcon"-->
<!--          >-->
          <img
              class="menu-image-logo"
              style="border-radius: 25px;width: 40px;"
              v-if="shopInfo.shopLogo"
              :src="resourcesUrl + shopInfo.shopLogo"
          >
          <a
            class="site-navbar__brand-lg"
            style="text-transform:none;"
            href="javascript:;"
          >
            {{
              $i18n.t('language') === 'English' ?
              configuration.bsMenuTitleOpenEn : configuration.bsMenuTitleOpenCn
            }}
          </a>
          <a
            class="site-navbar__brand-mini"
            style="text-transform:none;"
            href="javascript:;"
            :style="fontCloseSize"
          >
            {{
              $i18n.t('language') === 'English' ?
              configuration.bsMenuTitleCloseEn : configuration.bsMenuTitleCloseCn
            }}
          </a>
        </div>
      </div>
      <div class="site-navbar__content clearfix">
        <el-menu class="site-navbar__menu" mode="horizontal">
          <el-menu-item
            class="site-navbar__switch"
            index="0"
            @click="setSidebarFold()"
          >
            <icon-svg style="font-size: 18px" name="zhedie"></icon-svg>
          </el-menu-item>
        </el-menu>
        <el-menu
          class="site-navbar__menu msg-item"
          mode="horizontal"
          v-if="dataList.length"
        >
          <el-menu-item class="site-navbar__avatar" index="1">
            <div class="navbar-notice">
              <div><img src="~@/assets/img/horn.png" style="width:16px;height:16px;"   alt /></div>
              <!-- 消息播放 -->
              <div class="navbar-notice-right">
                <el-carousel
                  class="swiper-wrapper"
                  direction="vertical"
                  height="34px"
                >
                  <el-carousel-item
                    class="swiper-slide"
                    v-for="(item, index) in dataList"
                    :key="index"
                  >
                    <div class="item" @click="viewNoticeDetail(item.id)">
                      {{ item.title }}
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </div>
              <!-- 消息播放end -->
            </div>
          </el-menu-item>
        </el-menu>
        <el-menu
          class="site-navbar__menu site-navbar__menu--right"
          mode="horizontal"
          style="margin-right: 20px"
        >
          <el-menu-item class="site-navbar__avatar" index="3">
            <el-dropdown :show-timeout="0" placement="bottom">
              <span class="el-dropdown-link">{{ userName }}</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="updatePasswordHandle()">{{
                  $t("homes.updatePwd")
                }}</el-dropdown-item>
                <el-dropdown-item @click.native="logoutHandle()">{{
                  $t("homes.exit")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-menu-item>
        </el-menu>
        <el-menu
          class="site-navbar__menu site-navbar__menu--right"
          mode="horizontal"
        >
          <el-menu-item class="site-navbar__avatar" index="2">
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
          </el-menu-item>
        </el-menu>
        <el-menu
          class="site-navbar__menu site-navbar__menu--right"
          v-if="isAuth('message:message:view')"
          mode="horizontal"
          style="height:50px;"
        >
          <el-menu-item class="site-navbar__avatar" index="2" style="maxWidth: 18px" @click="openUrl">
            <div :class="['im-box',showHidden?'show':'hidden']">
              <img style="width: 18px;height: 18px;" src="../assets/img/msg.png" alt="">
              <i class="message-radio" v-if="message"></i>
            </div>
            <div v-show="!showHidden" class="im-box" style="width: 18px;height:100%;cursor: pointer;"></div>
          </el-menu-item>
          <el-menu-item class="site-navbar__avatar" index="2" style="maxWidth: 110px" @click="openUrl">
             <span class="customerService">{{$t("home.customerService")}}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <!-- 弹窗, 修改密码 -->
      <update-password
        v-if="updatePassowrdVisible"
        ref="updatePassowrd"
      ></update-password>
    </nav>

    <!-- 公告弹窗 -->
    <el-dialog
      :title="this.$i18n.t('notice.plaNotice')"
      :visible.sync="viewDialog"
      width="30%"
    >
      <p style="text-align: center">{{ noticeData.title }}</p>
      <br />
      <span v-html="noticeData.content"></span>
      <span slot="footer" class="dialog-footer">
        <div class="primary-btn default-btn" @click="viewDialog = false">{{$t("order.confirm")}}</div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UpdatePassword from './main-navbar-update-password'
import { Debounce } from '@/utils/debounce'
import { clearLoginInfo, isAuth } from '@/utils'
import { Base64 } from 'js-base64'

export default {
  data () {
    return {
      updatePassowrdVisible: false,
      newMessage: null,
      showHidden: true,
      shopStatus: 1,
      messageReminding: null, // 控制图标闪烁
      message: null, // 消息提示数字
      lockReconnect: false, // 判断有无客服连接上
      notification: false, // 通知权限判断
      ortherUser: false, // 别的账号登录判断
      notificationDebounce: 1, // 防止连续发送的消息导致右下方弹窗不断
      fontOpenSize: {
        fontSize: '16px'
      },
      fontCloseSize: {
        fontSize: '18px'
      },
      configuration: {
        bsLoginLogoImg: null,
        bsLoginBgImg: null,
        bsCopyrightCn: null,
        bsCopyrightEn: null,
        bsTitleContentCn: null,
        bsTitleContentEn: null,
        bsTitleImg: null,
        bsMenuTitleOpenCn: null,
        bsMenuTitleOpenEn: null,
        bsMenuTitleCloseCn: null,
        bsMenuTitleCloseEn: null
      },
      dataList: [],
      noticeData: {},
      viewDialog: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      shopInfo:{}
    }
  },
  components: {
    UpdatePassword
  },
  computed: {
    navbarLayoutType: {
      get () { return this.$store.state.common.navbarLayoutType }
    },
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold },
      set (val) { this.$store.commit('common/updateSidebarFold', val) }
    },
    mainTabs: {
      get () { return this.$store.state.common.mainTabs },
      set (val) { this.$store.commit('common/updateMainTabs', val) }
    },
    userName: {
      get () { return this.$store.state.user.name }
    },
    shopId: {
      get () { return this.$store.state.user.shopId }
    },
    employeeId: {
      get () { return this.$store.state.user.employeeId }
    }
  },

  created () {
    this.getShopInfo()
    this.shopStatus = this.$store.state.user.shopStatus
    let notifFlag = true
    if (window.Notification && this.shopStatus === 1) {
        // 浏览器通知--window.Notification
      if (Notification.permission === 'granted') {
        console.log('允许通知')
        this.notification = false
        notifFlag = false
      } else if (Notification.permission !== 'denied') {
        console.log('需要通知权限')
        this.notification = false
        Notification.requestPermission((permission) => { console.log('权限赋予') })
      }
    } else {
      this.notification = true
      console.error('浏览器不支持Notification')
    }
    if (notifFlag && this.shopStatus === 1) {
      this.notification = true
    }
  },

  mounted () {
    this.updateWebConfigData()
    this.getDataList()
    if (process.env.VUE_APP_WS_IM_API && isAuth('message:message:view') && this.shopStatus === 1) {
      this.openWs()
    }
  },
  methods: {
    getShopInfo () {
      this.$http({
        url: this.$http.adornUrl('/shop/shopDetail/info'),
        method: 'GET'
      }).then(({ data }) => {
        this.shopInfo = data
      })
    },
    openUrl () {
      window.open(location.href.split('#')[0] + '#/imBox', 'view_window')
      this.message = null
      this.showHidden = true
      clearInterval(this.messageReminding)
    },

    // 右下角消息通知
    popNotice (user, content) {
      let that = this
      if (Notification.permission === 'granted') {
        let notification = new Notification(user, {
          body: content
        })
        notification.onclick = function (e) {
          that.$nextTick(() => {
            setTimeout(() => {
              that.notificationDebounce = 1
              that.message = null
              window.open(location.href.split('#')[0] + '#/imBox', 'view_window')
                // 具体操作
            }, 500)
          })
          // 可直接打开通知notification相关联的tab窗
          window.focus()
          notification.close()
        }
        notification.onshow = function (e) {
          setTimeout(() => {
            that.notificationDebounce = 1
            notification.close.bind(notification)
          }, 3000)
        }
      }
    },

    // 图标提醒标题闪烁
    messageRemindingFn () {
      var ths = this
      clearInterval(this.messageReminding)
      this.messageReminding = setInterval(function () {
      // 如果没有获取焦点就判断名称是否包含未读消息
        if (ths.newMessage) {
            // 如果包含就显示为空
          ths.showHidden = false
          ths.newMessage = false
        } else {
            // 否则显示未读消息，间隔0.5秒实现闪烁
          ths.showHidden = true
          ths.newMessage = true
        }
      }, 500)
    },

    /**
     * 开启webstocket
     */
    openWs () {
      var ths = this
      this.imSocketTask = new WebSocket(
        this.$http.adornWsImUrl(
        `/im/websocket/online/shop/${Base64.encode(this.$cookie.get('Authorization_vs'))}/${this.shopId}/${this.employeeId}`)
      )
      this.imSocketTask.onopen = function (event) {
        heartCheck.reset().start() // 成功建立连接后，重置心跳检测
        ths.ortherUser = false
        ths.imSocketTask.send(
          JSON.stringify({
            content: 'HEART_BEAT',
            msgType: 0
          })
        )
      }
      this.imSocketTask.onmessage = (res) => {
        heartCheck.reset().start() // 成功建立连接后，重置心跳检测
        let result = JSON.parse(res.data)
        if (result.code !== '00000') {
          result.code = Number(result.code)
        }
        if (result.code === 10) {
          console.log(this.$i18n.t('noGetUserInfor'))
          return
        }
        if (result.code === 11) {
          return
        }
        if (result.code === 12) {
          console.log(this.$i18n.t('otherParIsNoOL'))
          return
        }
        if (result.code === 15) {
          this.$message.error(this.$i18n.t('chat.notYourResponsibility'))
          this.noAccountable = false
          return false
        }
        if (result.code === '00000' && result.data) {
          // localStorage.getItem('imBox')防止已在在消息盒子页面右下方弹出不停弹出
          this.message = 1
          if (result.data.newMessage && this.notificationDebounce && !localStorage.getItem('imBoxShop')) {
            this.notificationDebounce = null // 防止连续发送的消息导致右下方弹窗不断
            this.popNotice(this.$i18n.t('home.notification'), this.$i18n.t('home.haveANewUnreadMessage')) // 启用通知
          }
          this.newMessage = true
          clearInterval(this.messageReminding)
          if (this.notification) {
            this.showMessage()
          }
          this.messageRemindingFn()
        }
      }
      var heartCheck = {
        timeout: 19000, // 19s发一次心跳，比server端设置的连接时间稍微小一点，在接近断开的情况下以通信的方式去重置连接时间。 尽量一个小时发送三次
        serverTimeoutObj: null,
        reset: function () {
          clearTimeout(this.serverTimeoutObj)
          return this
        },
        start: function () {
          this.serverTimeoutObj = setTimeout(function () {
            if (!ths.imSocketTask) {
              return
            }
            if (ths.imSocketTask.readyState === 1) {
              console.log('连接状态，发送消息保持连接')
              ths.imSocketTask.send(
                JSON.stringify({
                  content: 'HEART_BEAT',
                  msgType: 0
                })
              )
              heartCheck.reset().start() // 如果获取到消息，说明连接是正常的，重置心跳检测
            } else {
              ths.imSocketTask.close()
              ths.imSocketTask = null
              ths.lockReconnect = false
              console.log('断开状态，尝试重连')
            }
          }, this.timeout)
        }
      }
      this.imSocketTask.onclose = (res) => {
        if (!this.ortherUser) {
          console.log('断线,开始重连')
          this.ortherUser = false
          if (this.plooTime < 3) {
            this.plooTime ++
            if (this.lockReconnect) return
            this.lockReconnect = true
            setTimeout(() => {     // 没连接上会一直重连，设置延迟避免请求过多
              this.openWs()
              this.lockReconnect = false
            }, 2000)
          } else {
            // this.$confirm(ths.$i18n.t('chat.connetBroken'), ths.$i18n.t('chat.tips'), {
            //   confirmButtonText: ths.$i18n.t('chat.confirm'),
            //   cancelButtonText: ths.$i18n.t('chat.cancel'),
            //   type: 'warning'
            // }).then(() => {
            //   location.reload()
            // }).catch(() => {

            // })
          }
        }
      }
    },

    showMessage: Debounce(function () {
      this.$message({
        message: '您有新的未读消息',
        offset: 10,
        duration: 1500
      })
    }, 1800),

    setSidebarFold () {
      const len = this.$store.state.common.selectMenu.length
      const flag = sessionStorage.getItem('isExpand')
      if ((this.$route.path === '/home' || len === 1) && flag === '0') {
        this.sidebarFold = true
        return
      }
      this.sidebarFold = !this.sidebarFold
    },
    // 获取平台公告列表
    getDataList () {
      this.$http({
        url: this.$http.adornUrl('/shop/notice/listPage'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: 1,
          size: 6
        }, this.searchForm))
      }).then(({ data }) => {
        this.dataList = data.records
      })
    },
    // 查看单个平台公告
    viewNoticeDetail (id) {
      this.noticeData.id = id || 0
      this.viewDialog = true
      this.$nextTick(() => {
        if (this.noticeData.id) {
          this.$http({
            url: this.$http.adornUrl('/shop/notice/info/' + this.noticeData.id),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            data.content = this.DOMPurify.sanitize(data.content)
            this.noticeData = data
          })
        }
      })
    },
    // 修改密码
    updatePasswordHandle () {
      this.updatePassowrdVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init()
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
    },
    // 更新网站配置信息
    updateWebConfigData () {
      this.$http({
        url: this.$http.adornUrl('/sys/webConfig/getActivity'),
        method: 'get'
      }).then(({data}) => {
        this.$store.commit('webConfig/addData', data)
        this.configuration = data
        if (data.bsMenuTitleOpenEn.length >= 17) {
          this.fontOpenSize.fontSize = '16px'
        } else if (data.bsMenuTitleOpenCn.length >= 10) {
          this.fontOpenSize.fontSize = '16px'
        }

        if (data.bsMenuTitleCloseEn.length >= 6) {
          this.fontCloseSize.fontSize = '18px'
        } else if (data.bsMenuTitleCloseCn.length >= 4) {
          this.fontCloseSize.fontSize = '18px'
        }
      })
    }
  }
}
</script>

<style scoped>
.site-navbar__brand {
  font-size: 16px;
  white-space: normal;
  display: flex;
  align-items: center;
  font-weight: bold;
  padding: 5px 0;
  margin-right: 6px;
}
.site-navbar__brand-lg {
  margin: 0 auto;
  word-break: break-all; /* 按字符截断换行 支持IE和chrome，FF不支持*/
  word-wrap: break-word; /* 按英文单词整体截断换行  以上三个浏览器均支持 */
  color: #333333;
}
.site-navbar__brand-lg:hover {
  color: #333;
}
.site-navbar__brand-mini {
  color: #333333;
}
.navbar-notice{
  width: 160px;
  display: flex;
  height: 50px;
}
.navbar-notice img{
  width: 20px;
  height: 20px;
  margin: 8px;
}
.navbar-notice .navbar-notice-right{
  width: 130px;
  overflow: hidden;
}
.navbar-notice .navbar-notice-right .swiper-wrapper{
  /* height: 100px; */
  color: #606266;
}
.navbar-notice .navbar-notice-right .swiper-wrapper .item{
  font-size: 14px;
  width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
div >>> .el-carousel__indicators{
  display: none;
}
.site-navbar >>> .el-menu.el-menu--horizontal {
  border-bottom: none;
}
.site-navbar >>> .el-menu--horizontal > .el-menu-item {
  height: 50px;
  line-height: 47px;
  padding: 0 !important;
}
.site-navbar__header {
  margin-right: 20px;
}
.notice-box {
  margin-left: 20px;
}
div >>> .site-navbar__menu--right {
  margin-right: 25px;
}
div >>> .el-icon-arrow-down {
  font-size: 16px;
  margin: 0;
  width: 16px;
}
.msg-item {
  margin-left: 20px;
}
.fold {
  margin-left: 20px !important;
}
.no-fold {
  margin-left: 20px !important;
}
.site-navbar {
  overflow: hidden;
  border-bottom: 1px solid #EBEDF0;
}
.site-navbar__content {
  width: 100%;
}
.customerService {
  margin-left: 5px;
  color: #606266;
  font-size: 14px;
}
.im-box{
  position: relative;
}
.message-radio {
  border-radius: 50%;
  width: 5px;
  height: 5px;
  background-color: red;
  display: inline-block;
  position: absolute;
  top: 15px;
  left: 12px;
}
.show {
  display: block;
}
.hidden{
  display: none;
}
.menu-image-logo {
  object-fit: contain;
  width: 59px;
  margin-right: 10px;
}
.site-navbar__switch {
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
}

.site-sidebar--fold .site-navbar__header,
.site-sidebar--fold .el-menu.site-sidebar__menu {
  min-width: 170px;
}
.site-navbar__brand-lg:focus,
.site-navbar__brand-lg:hover,
.site-navbar__brand-mini:focus,
.site-navbar__brand-mini:hover {
  color: #333333;
}
</style>
