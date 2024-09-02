<template>
  <div class="body">
    <div class="chat-box">
      <!-- 消息盒子头部 -->
      <div class="chat-box-top">{{$t('chat.messageBox')}}</div>

      <div class="chat-box-main">
        <!-- 消息盒子左侧栏 -->
        <div class="chat-box-left">
          <!-- 左侧用户信息栏 -->
          <ul class="shop-list"
            v-infinite-scroll="scrollUserList"
            infinite-scroll-immediate="false"
          >
            <li
              :class="['shop-item',item.userId == selectedF ? 'changeUser' : '',item.message?'newMessage':'']"
              v-for="(item, index) in friends"
              :key="index"
              @click="changeImContent(item.userId,index)"
            >
              <img
                src="~@/assets/img/userImg.jpg"
                class="shop-icon"
                v-if="!item.pic"
              />
              <img :src="item.pic" class="shop-icon" v-else />
              <div class="shop-info">
                <span class="shop-info-name">
                  <span class="name">{{ item.friendName }}</span>
                  <span class="tips" v-if="item.unread > 0">{{ item.unread }}</span>
                </span>
                <span class="shop-info-icon">{{ item.latestMsg }}</span>
                <!-- <div class="unread-box" v-if="item.unread">
                  <div class="number">{{item.unread}}</div>
                </div> -->
              </div>
            </li>
          </ul>
        </div>

        <!-- 消息盒子右侧信息回复栏 -->
        <div class="chat-box-right">
          <div class="im-box">
            <div class="im-main">
              <div class="chat-main-form">
                <!-- 聊天内容栏 -->
                <div class="display-infor">
                  <div class="more" @click="moreInfo()" v-if='moreMess && pages>1'>{{$t('chat.clickToLoadMore')}}</div>
                  <div class="more" v-if='!moreMess && pages>1'>{{$t('chat.noMore')}}</div>
                  <div class="row" v-for="(row, index) in msgList" :key="index">
                    <!-- 用户消息 -->
                    <div class="topTime" v-if="row.timeStr">{{ row.timeStr }}</div>
                    <!-- 用户发出的消息 -->
                    <div class="my" v-if="row.source == 2">
                      <!-- 右-消息 -->
                      <div class="left">
                        <img
                          src="~@/assets/img/userImg.jpg"
                          class="avatar"
                          v-if="!row.userHeadUrl"
                        />
                        <img :src="row.userHeadUrl" class="avatar" v-else />
                      </div>
                      <!-- 左-头像 -->
                      <div class="right">
                        <div class="username">
                          <div class="name">{{ row.userName }}</div>
                        </div>
                        <div
                          class="bubble"
                          v-if="row.type == 1 && !row.prodInfo"
                        >
                          　　　　　　
                          <el-image :src="row.content" class="longimage" :preview-src-list="[row.content]"></el-image> 　　　
                        </div>
                        <!-- 文字消息 -->
                        <div
                          v-if="row.type == 0 && !row.prodInfo"
                          class="bubble"
                        >
                          <span>{{ row.content }}</span>
                        </div>
                        <!-- 商品链接 -->
                        <div v-if="row.prodInfo"
                         class="prod-link">
                            <div class="link-prod">
                            <div class="prod-number" v-if="row.prodInfo.orderFlag" @click="toProdDetail(row.prodInfo,1,row.prodInfo.orderType)">{{$t('chat.orderNumber')}}:{{row.prodInfo.orderNumber}}</div>
                            <div class="prod-box" @click="toProdDetail(row.prodInfo,0,row.prodInfo.orderType)">
                                <img :src="row.prodInfo.imgs" alt="" />
                                <div class="link-detail">
                                  <div class="prod-name">
                                    {{ row.prodInfo.prodName }}
                                  </div>
                                  <div class="prod-price">
                                    <!-- <span class= 'payment-amount' v-if="row.prodInfo.orderFlag">{{$t('chat.paymentAmount')+'：'}}{{ row.prodInfo.actualTotal?'￥'+row.prodInfo.actualTotal:$t('chat.paymentAmount') }}<span v-if="row.prodInfo.useScore">+{{row.prodInfo.useScore}} {{$t('order.integral')}}</span></span> -->
                                    <span>￥{{ row.prodInfo.price }}</span>
                                    <!-- <span class= 'prod-status' v-if="row.prodInfo.orderFlag">
                                      {{
                                        [
                                          '',
                                          $t('chat.pendingPayment'),
                                          $t('chat.pendingDelivery'),
                                          $t('chat.pendingReceiptt'),
                                          $t('chat.pendinEvaluation'),
                                          $t('chat.completed'),
                                          $t('chat.canceled'),
                                          $t('chat.grouping')
                                        ][row.prodInfo.status]
                                      }}
                                    </span> -->
                                  </div>
                                </div>
                              </div>
                            </div>
                        </div>

                      </div>
                    </div>

                    <!-- 别人发出的消息 -->
                    <div
                      class="other"
                      v-if="
                        (row.source == 0 || row.source == 1) &&
                        row.forwardCode != 1
                      "
                    >
                      <!-- 右-商家名称-时间-消息 -->
                      <div class="left">
                        <div class="username">
                          <div class="name">{{ row.shopName }}</div>
                        </div>
                        <div class="message-box">
                          <div class="unread" v-if="row.userUnread">{{$t('chat.read')}}</div>
                          <div class="unread" v-else>{{$t('chat.unRead')}}</div>
                            <!-- 文字消息 -->
                            <div v-if="row.type == 0" class="bubble">
                              <span>{{ row.content }}</span>
                            </div>
                            <!-- 图片消息 -->
                            <div
                              v-if="row.type == 1"
                              class="bubble"
                            >
                              <!-- <img
                                :src="row.content"
                                class="longimage"
                                mode="widthFix"
                                @click="onBigImg(row.content)"
                              /> -->
                              <el-image :src="row.content" class="longimage" :preview-src-list="[row.content]"></el-image>
                            </div>
                        </div>
                        <div class="take-charge-of" v-if="row.employeeId !== employeeId ">
                           {{$t('chat.transferred')}}
                        </div>

                      </div>
                      <!-- 头像 -->
                      <div class="right">
                        <img :src="chatImg" class="avatar" />
                      </div>
                    </div>
                    <!-- 系统提示: 客服接入/转接、客户离线、用户状态异常-->
                    <!-- <div
                      class="sys-tips"
                      v-if="(row.source == -1 && row.tipsType) || row.type == 2"
                    >
                      <text class="tips-content" v-if="row.type == 2">{{
                        row.content
                      }}</text>
                      <text class="tips-content" v-else>{{
                        row.tipsType == 1
                          ? i18n.customerOffline
                          : row.tipsType == 2
                          ? i18n.loginOtherSide
                          : i18n.reLogin
                      }}</text>
                    </div> -->
                  </div>
                </div>

                <!-- 未读消息提示 -->
                <div class="unread-info">

                </div>
                <!-- 下方发送信息栏 -->
                <div class="reply">
                  <div class="small-box">
                     <div class="upload"></div>
                     <div class="customerService" @click="customerService()">{{$t('chat.transferToCustomerService')}}</div>
                  </div>
                  <label for="iii" class="imgUp"
                    ><a class="upload" style="cursor: pointer"></a
                  ></label>
                  <input
                    accept="image/png, image/jpeg"
                    type="file"
                    ref="file"
                    @change="toolEvent"
                    class="search-btnn"
                    id="iii"
                  />
                  <div class="reply-area">
                    <textarea
                      name=""
                      id=""
                      cols="20"
                      rows="4"
                      v-model="textMsg"
                      @keydown="messageSendlisten($event)"
                    ></textarea>
                  </div>
                  <div class="send" @click="sendText()">{{$t('chat.send')}}</div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 放大图片栏 -->

    <!-- 转接客服弹窗 -->
    <el-dialog
      :title="$t('chat.selectOnlineCustomerService')"
      :modal="false"
      top="61px"
      width='980px'
      :close-on-click-modal="false"
      append-to-body
      :visible.sync="visible"
    >
      <div class="prods-select-body">
        <el-table
          ref="prodTable"
          :data="serviceList"
          border
          style="width: 100%"
        >
          <el-table-column
            v-if="isSingle"
            width="50"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                <el-radio
                  :label="scope.row.userId"
                  v-model="platformUserId"
                  @change.native="getSelectProdRow(scope.row)"
                  >&nbsp;</el-radio
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!isSingle"
            type="selection"
            header-align="center"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column
            prop="nickName"
            header-align="center"
            align="center"
            :label="this.$i18n.t('homes.userName')"
          ></el-table-column>
        </el-table>
      </div>
      <span slot="footer">
        <el-button @click="visible = false">{{
          $t("crud.filter.cancelBtn")
        }}</el-button>
        <el-button type="primary" @click="transferDetermination()">{{
          $t("crud.filter.submitBtn")
        }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { uploadFile } from '@/utils/httpRequest.js'
import { clearLoginInfo } from '@/utils/'
import { Base64 } from 'js-base64'
export default {
  data () {
    return {
      currentUserId: null,
      textMsg: '',
      employeeId: null, // 当前负责人id
      bigImg: null, // 要放大的图片
      current: 1, // 聊天内容当前页
      pages: null,
      userCurrent: 1, // 左侧用户栏当前页
      userPages: null,
      selectedF: null, // 选中的用户
      newUserIndex: null, // 订单用户下标
      headerConfig: {
        img: '',
        name: '',
        callback: this.headerEvent
      },
      chatImg: require('@/assets/img/customer-service.png'), // 官方头像
      friends: [],
      msgList: [],
      serviceList: [],

      messageInfo: {}, // 商家发送的文本消息
      userRead: true,  // 用户的已读未读判断
      userSend: false, // 是否是用户发送的消息判断

      visible: false, // 客服转接弹窗显隐
      dataForm: {},
      userName: null, // 账号
      platformUserId: 0,
      isSingle: true,
      heartCheckFlag: 0, // 第一次连接先发心跳

      moreMess: null, // true 有更多 false 没有更多
      imSocketTask: null,
      serviceStatus: 1, // 是否为正确的对接客服
      shopName: null,
      shopLogo: null,
      userId: null,
      lockReconnect: false, // 判断有无客服连接上
      ortherUser: false, // 别的账号登录判断
      noAccountable: true, // 转接判断
      plooTime: 0,
      isShine: true, //
      defaultTitle: document.title, // 存储默认标题
      messageReminding: true, // 存放标题闪烁定时器
      switchingHistory: null// 判断是否是转接客服的历史记录
    }
  },
  watch: {
    // 防止订单页面跳转过来数据不对应
    '$route' (to, from) { // 监听路由是否变化
      if (to.query !== from.query) {
        location.reload()
      }
    }
  },
  computed: {
    disabled () {
      return this.loading
    }
  },
  created () {
    this.getUserInfo()
    localStorage.setItem('imBox', true)
  },
  beforeDestroy () {
    if (this.imSocketTask != null) {
      this.imSocketTask.close()
    }
  },
  destroyed () {
    clearInterval(this.messageReminding)
  },
  methods: {
    // 点击放大图片
    onBigImg (img) {
      this.bigImg = img
    },
    // 清除消息提醒时器
    clearMeagess () {
      clearInterval(this.messageReminding)
      document.title = this.defaultTitle
    },
    // 消息提醒标题闪烁
    messageRemindingFn () {
      var ths = this
      window.onfocus = function () {
        ths.clearMeagess()
      }
      clearInterval(this.messageReminding)
      this.messageReminding = setInterval(function () {
        var title = document.title
      // 如果没有获取焦点就判断名称是否包含未读消息
        if (/您有新消息/.test(title) === false) {
            // 如果包含就显示为空
          document.title = '【您有新消息】'
        } else {
            // 否则显示未读消息，间隔0.5秒实现闪烁
          document.title = ths.defaultTitle
        }
      }, 500)
    },
    // 获取当前管理员信息
    getUserInfo () {
      this.$http({
        url: this.$http.adornUrl('/sys/user/info'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.shopName = data.nickName
        this.employeeId = data.userId
        this.userId = data.userId
        this.getConversations()
      })
    },
    /**
     * 获取左侧历史联系人信息
     */
    async getConversations () {
      var that = this
      window.onfocus = function () {
        that.clearMeagess()
      }
      window.onblur = function () {
        that.messageReminding = null
      }
      // 防止已在在消息盒子页面右下方弹出不停弹出
      window.onbeforeunload = function () {
        if (that.$route.name === 'imBox') {
          localStorage.removeItem('imBox')
        }
      }
      let {data} = await this.$http({
        url: this.$http.adornImUrl('/p/platform/conversations') + '?current=' + this.userCurrent + '&size=20',
        method: 'POST'
      })
      if (data.records && data.pages) {
        data.records.forEach(item => {
          let a = this.isJSON(item.latestMsg)
          if (item.type === 1) {
            item.latestMsg = '[' + this.$i18n.t('publics.image') + ']'
          } else if (a && JSON.parse(item.latestMsg) instanceof Object) {
            item.latestMsg = '[' + this.$i18n.t('chat.productLinks') + ']'
          }
        })
        // sort按时间正序排序 最新的消息在前面
        data.records.sort(function (a, b) {
          return b.timestamp - a.timestamp
        })

        if (this.friends.length >= 1) {
          this.friends.forEach(item => {
            data.records = data.records.filter(itemInde => {
              return item.userId !== itemInde.userId
            })
          }) // 过滤左侧已存在的用户
          this.friends = this.friends.concat(data.records)
        } else {
          if (this.$route.query.userId) {
            // 用户要是已存在就记录下标
            let newUserFlag = data.records.some((item, index) => {
              if (item.userId === this.$route.query.userId) {
                this.newUserIndex = index
                return item.userId === this.$route.query.userId
              }
            }) // 过滤已存在的用户
            if (newUserFlag) {
              this.friends = data.records
              this.friends = this.elChangeExForArray(this.newUserIndex, 0, this.friends)
              this.currentUserId = this.$route.query.userId
            } else {
              let res = await this.$http({
                url: this.$http.adornImUrl('/p/platform/userInfo?userId=' + this.$route.query.userId),
                method: 'GET'
              })
              this.friends.push(res.data[0])
              this.currentUserId = res.data[0].userId
              this.friends = this.friends.concat(data.records)
            }
          } else {
            this.friends = data.records
            this.currentUserId = data.records[0].userId
          }
          this.openWs() // 开启webstocket
        }
      } else {
        // 商家联系买家
        if (this.$route.query.orderNumber && this.$route.query.userId && !this.friends.length) {
          this.getNewUser()
        }
        this.openWs()
      }
      this.userPages = data.pages
    },

    // 添加新的用户栏到左侧
    async getNewUser () {
      let res = await this.$http({
        url: this.$http.adornImUrl('/p/platform/userInfo?userId=' + this.$route.query.userId),
        method: 'GET'
      })
      this.friends.push(res.data[0])
      this.selectedF = res.data[0].userId
      this.currentUserId = res.data[0].userId
    },

    /**
     * 开启webstocket
     */
    openWs () {
      var ths = this
      this.imSocketTask = new WebSocket(
        this.$http.adornWsImUrl(
          '/im/websocket/platform/' +
          Base64.encode(this.$cookie.get('Authorization_vp')) + '/' + this.userId
        )
      )
      ths.imSocketTask.onopen = function (event) {
        heartCheck.reset().start() // 成功建立连接后，重置心跳检测
        ths.ortherUser = false
        // ths.imSocketTask.send(
        //     JSON.stringify({
        //       sendType: ths.chatType,
        //       content: 'HEART_BEAT',
        //       msgType: 0,
        //       toId: ths.currentUserId
        //     })
        // )
        ths.getMsgItems()
      }
      this.imSocketTask.onmessage = (res) => {
        heartCheck.reset().start() // 成功建立连接后，重置心跳检测
        let result = JSON.parse(res.data)
        if (result.code !== '00000') {
          result.code = Number(result.code)
        }
        if (result.code === 10) {
          clearLoginInfo()
          this.$router.push({
            name: 'login'
          })
          return
        }
        if (result.code === 11) {
          this.ortherUser = true
          this.$confirm(this.$i18n.t('idIsLoginInElse'), {
            showClose: false,
            showCancelButton: false,
            confirmButtonText: this.$i18n.t('remindPop.confirm')
          }).then(() => {
            window.close()
          })
          return
        }
        if (result.code === 12) {
          console.log(this.$i18n.t('otherParIsNoOL'))
          return
        }
        if (result.code === 15) {
          this.$message.error(this.$i18n.t('chat.notYourResponsibility'))
          this.messageInfo = null
          this.noAccountable = false
          return false
        }
        if (!result.data) {
          return
        }

        /**
         * 新的聊天信息
         */
        if (result.code === '00000' || result.code === 4) {
          let index = null
          // 消息提醒标题闪烁
          if (result.data && !this.messageReminding) { this.messageRemindingFn() }

          // 进行未读消息的加减
          if (this.friends.length && result.code !== 4) {
            this.friends.some((item, indexx) => {
              // console.log(item.userId, result.data.userId, 'result.data.userId', item.userId === result.data.userId)
              if (item.userId === result.data.userId) {
                index = indexx
              }
            })
            if (index != null && this.selectedF !== result.data.userId) {
              this.friends[index].unread = Number(this.friends[index].unread) + 1
            }
          }

          if (this.msgList.length) {
            // 时间转换
            let prevTime = this.tsToDate(this.msgList[this.msgList.length - 1].timestamp, 'M月D日 h:m')
            let nowTime = this.tsToDate(result.data.timestamp, 'M月D日 h:m')
            if (prevTime.slice(0, prevTime.indexOf(' ')) === nowTime.slice(0, nowTime.indexOf(' '))) {
              result.data.timeStr = this.tsToDate(new Date().getTime(), 'h:m')
            } else {
              result.data.timeStr = this.tsToDate(new Date().getTime(), 'M月D日 h:m')
            }
          }

          if (result.code === 4) {
            this.currentUserId = result.data.userId
            this.switchingHistory = 1
            this.clearMeagess()
            if (!this.friends.length) {
              this.friends.unshift({
                pic: result.data.userHeadUrl,
                friendName: result.data.userName,
                latestMsg: result.data.content,
                shopId: result.data.shopId,
                userId: result.data.userId,
                unread: 0,
                message: result.data.userId === this.currentUserId ? 0 : 1
              })
            }
            this.getMsgItems(1)
          }

          if (result.data.userId === this.currentUserId && this.msgList.length) {
            let readed = {
              read: 1,
              msgIds: [result.data.itemId],
              toId: this.currentUserId,
              sendType: 0
            }
            this.imSocketTask.send(JSON.stringify(readed))
          }

          this.changeFriendsWhenMsg(result.data)
          if (result.data.userId === this.currentUserId) {
            this.pushMsgItem(1, result.data)
          }
        }

        /**
         * 聊天记录
         */
        if (result.code === 2) {
          let msgIds = []
          let index = null
          if (result && result.data.pages) {
            result.data.records = result.data.records.reverse()
            if (this.friends.length) {
              this.friends.some((item, indexx) => {
                if (item.userId === result.data.records[0].userId) {
                  index = indexx
                }
              })
            }

            // 进行是否是商品链接的判断
            result.data.records.forEach(item => {
              let a = this.isJSON(item.content)

              if (a && JSON.parse(item.content) instanceof Object) {
                item.prodInfo = JSON.parse(item.content)
              }

              item.timeStr = this.tsToDate(item.timestamp, 'M月D日 h:m')

              if (item.type === 1 && !a) {
                item.content = item.content.indexOf(process.env.VUE_APP_RESOURCES_URL) === 0 ? item.content : process.env.VUE_APP_RESOURCES_URL + item.content
              }

              msgIds.push(item.itemId)

              // 进行未读消息的加减
              if (!item.employeeUnread) { this.friends[index].unread = this.friends[index].unread - 1 }
              item.employeeUnread = 1
            })

            let readed = {
              read: 1,
              msgIds,
              toId: this.currentUserId,
              sendType: 0
            }
            this.imSocketTask.send(JSON.stringify(readed))

            result.data.records.reduce((prev, cur) => {
              // 将时间更换为某某月某某日 要是是当天即去掉月日
              let now = this.tsToDate(prev.timestamp, 'M月D日 h:m')
              let next = this.tsToDate(cur.timestamp, 'M月D日 h:m')
              if (now.slice(0, now.indexOf(' ')) === next.slice(0, next.indexOf(' '))) {
                cur.timeStr = this.tsToDate(cur.timestamp, 'h:m')
              }

              // 历史记录进行时间段显示判断
              if (result.data.records.length > 2) {
                let timeFlag = this.timeBeApart(prev.timestamp, cur.timestamp)
                if (timeFlag) {
                  delete cur.timeStr
                }
              }
              return cur
            })
          }

          if (this.current === 1) {
            this.msgList = result.data.records || []
            this.pages = result.data.pages
            this.switchingHistory = null // 重置转接客服聊天消息
            this.scrollToBottom()
          }

          if (this.current !== 1) {
            result.data.records = result.data.records.reverse()
            // 数组反转拼接
            if (!this.switchingHistory) {
              result.data.records.forEach(item => {
                this.msgList.unshift(item)
              })
            } else {
              result.data.records = result.data.records.reverse()
              this.msgList = result.data.records || []
              this.pages = result.data.pages
              this.switchingHistory = null // 重置转接客服聊天消息
              this.current = 1
            }
          }

          if (result.data.pages > 1) {
            this.moreMess = true
          } else {
            this.moreMess = false
          }
          if (result.data.pages !== 0) {
            this.selectedF = result.data.records[0].userId
          } else {
            this.selectedF = this.$route.query.userId ? this.$route.query.userId : ''
          }
        }

        /**
         * 转接客服
         */
        if (result.code === 3) {
          this.serviceList = result.data
        }

        /**
         * 未读信息转成已读
         */
        if (result.code === 5) {
          if (this.userSend) {
            this.userRead = false
            this.userSend = false
            this.pushMsgItem(this.msgList, this.messageInfo)
          }
          this.msgList.forEach(item => {
            this.$set(item, 'userUnread', 1)
          })
          this.scrollToBottom()
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
                  sendType: ths.chatType,
                  content: 'HEART_BEAT',
                  msgType: 0,
                  toId: ths.currentUserId
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
            this.$confirm(ths.$i18n.t('chat.connetBroken'), ths.$i18n.t('chat.tips'), {
              confirmButtonText: ths.$i18n.t('chat.confirm'),
              cancelButtonText: ths.$i18n.t('chat.cancel'),
              type: 'warning'
            }).then(() => {
              location.reload()
            }).catch(() => {

            })
          }
        }
      }
    },

    /**
     * 转接客服
     */
    customerService () {
      let messageInfo = {
        toId: this.currentUserId,
        platformUserList: 1,
        msgType: 0
      }

      this.imSocketTask.send(JSON.stringify(messageInfo))
      let time = setTimeout(() => { if (this.noAccountable) { this.visible = true }; clearTimeout(time) }, 100)
    },
    /**
     * 有消息过来的时候，改变左边历史联系人列表（先删除消息对应联系人的信息，再将联系人放到第一个）
     */
    changeFriendsWhenMsg (msgItem) {
      // 消息内容
      let msgContent = ''
      let isJson = this.isJSON(msgItem.content)
      // 图片消息
      if (msgItem.type === 1) {
        msgContent = '[' + this.$i18n.t('publics.image') + ']'
      } else if (isJson && JSON.parse(msgItem.content) instanceof Object) {
        msgContent = '[' + this.$i18n.t('chat.productLinks') + ']'
      } else {
        msgContent = msgItem.content
      }
      for (var i = 0; i < this.friends.length; i++) {
        var item = this.friends[i]
        // 更新最新消息
        if (msgItem.userId === item.userId) {
          item.latestMsg = msgContent
          item.timeStr = msgItem.timeStr
          msgItem.unread = item.unread
          this.friends.splice(i, 1)
          break
        }
      }
      // 新消息
      this.friends.unshift({
        pic: msgItem.userHeadUrl,
        friendName: msgItem.userName,
        latestMsg: msgContent,
        shopId: msgItem.shopId,
        userId: msgItem.userId,
        unread: msgItem.unread || (this.currentUserId === msgItem.userId ? msgItem.unread : 1),
        message: msgItem.userId === this.currentUserId ? 0 : 1
      })
    },

    isJSON (str) {
      if (typeof str === 'string') {
        try {
          JSON.parse(str)
          return true
        } catch (e) {
          return false
        }
      }
    },
    /**
     * 换个联系人聊条
     */
    changeImContent (itemUserId, index) {
      if (this.currentUserId === itemUserId) {
        return
      }
      this.currentUserId = itemUserId
      this.current = 1
      this.noAccountable = 1
      this.friends[index].message = 0
      let time = setTimeout(() => {
        this.getMsgItems()
        clearTimeout(time)
      }, 100)
    },
    /**
     * 获取聊天记录
     */
    getMsgItems (current) {
      let messageInfo = {
        history: true,
        current: current || this.current,
        size: 10,
        sendType: 0,
        toId: this.currentUserId
      }
      this.imSocketTask.send(JSON.stringify(messageInfo))
    },

    /**
     * 添加联系人发送过来的消息内容
     */
    pushMsgItem (msgList, msgItem) {
      if (msgItem.type === 1) {
        msgItem.content = process.env.VUE_APP_RESOURCES_URL + msgItem.content
      }

      let a = this.isJSON(msgItem.content)
      if (a && JSON.parse(msgItem.content) instanceof Object) {
        msgItem.prodInfo = JSON.parse(msgItem.content)
      }
      // 首次进入
      if (this.msgList.length) {
        let prevTime = this.tsToDate(this.msgList[this.msgList.length - 1].timestamp, 'M月D日 h:m')
        let nowTime = this.tsToDate(msgItem.timestamp, 'M月D日 h:m')
        if (prevTime.slice(0, prevTime.indexOf(' ')) === nowTime.slice(0, nowTime.indexOf(' '))) {
          msgItem.timeStr = this.tsToDate(new Date().getTime(), 'h:m')
        } else {
          msgItem.timeStr = this.tsToDate(new Date().getTime(), 'M月D日 h:m')
        }
        let timeFlag = this.timeBeApart(this.msgList[this.msgList.length - 1].timestamp, new Date().getTime())
        if (timeFlag) {
          delete msgItem.timeStr
        }
      } else {
        msgItem.timeStr = this.tsToDate(new Date().getTime(), 'M月D日 h:m')
      }
      msgItem.timestamp = new Date().getTime()
      this.msgList.push(msgItem)
      this.noAccountable = true
      this.scrollToBottom()
    },

    /**
     * textarea回车事件
     */
    messageSendlisten (event) {
      if (event.keyCode === 13) {
        this.sendText() // 发送文本
        event.preventDefault() // 阻止浏览器默认换行操作
        return false
      }
    },

    /**
     * 发送文本消息
     */
    sendText () {
      if (this.textMsg === '' || !this.currentUserId || this.textMsg.match(/^\s+$/)) {
        return
      }
      let messageInfo = {
        toId: this.currentUserId,
        content: this.textMsg,
        msgType: 0
      }
      this.addMessage(messageInfo)
      this.textMsg = ''
    },

    addMessage (messageInfo) {
      this.userRead = true // 重置,防止用户不在线时可以继续发消息
      this.userSend = true
      this.imSocketTask.send(JSON.stringify(messageInfo))
      let msgItem = {
        shopName: this.shopName,
        shopLogo: process.env.VUE_APP_RESOURCES_URL + this.shopLogo,
        type: messageInfo.msgType,
        timestamp: new Date(),
        employeeId: this.employeeId,
        source: 1,
        content: messageInfo.content
      }
      this.messageInfo = msgItem
       // 转接客服异步返回结果所以设下定时器
      let time = setTimeout(() => { if (this.noAccountable && this.userRead) { this.pushMsgItem(this.msgList, msgItem); this.userSend = false }; clearTimeout(time) }, 100)
    },

    // 发送图片
    toolEvent (type, res) {
      if (this.$refs['file'].files[0]) {
        this.selectFileobj = this.$refs['file'].files[0]
      }
      uploadFile(
        this.$http.adornUrl('/admin/file/upload/imFile'),
        this.selectFileobj
      ).then(({ data }) => {
        let messageInfo = {
          toId: this.currentUserId,
          content: data.data,
          msgType: 1
        }
        this.$refs['file'].value = null // 解决上传同一图片不显示bug
        this.addMessage(messageInfo)
      })
    },
    headerEvent () {},
    bindClick (play) {
    },

    /**
     * 进行相隔时间判断
     *
     * true 删除显示时间
     * false 保留显示时间
     */
    timeBeApart (uppTime, preTime) {
      if (!uppTime) {
        return false
      }
      var dateDiff = preTime - uppTime// 时间差的毫秒数
      var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000))// 计算出相差天数
      var leave1 = dateDiff % (24 * 3600 * 1000)    // 计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000))// 计算出小时数
      // 计算相差分钟数
      var leave2 = leave1 % (3600 * 1000)    // 计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000))// 计算相差分钟数

      // console.log('相差' + dayDiff + '天')
      // console.log('相差' + hours + '小时')
      // console.log('相差' + minutes + '分钟')

      if (dayDiff >= 1 || hours >= 1 || minutes > 4) {
        return false
      } else {
        return true
      }
    },

    /**
     * 改变日期
     */
    tsToDate (number, format) {
      var formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
      var returnArr = []

      var date = new Date(number)
      returnArr.push(date.getFullYear())
      returnArr.push(
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      )
      returnArr.push(
        date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      )

      returnArr.push(
        date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      )
      returnArr.push(
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      )
      returnArr.push(
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      )

      for (var i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i])
      }
      return format
    },

    /**
     * 主体消息点击加载更多
     */
    moreInfo () {
      this.current += 1
      if (this.current > this.pages) {
        this.moreMess = false
      } else {
        this.switchingHistory = null
        this.getMsgItems()
      }
    },

    /**
     * 滚动加载用户列表
     */
    scrollUserList () {
      this.userCurrent += 1
      if (this.userCurrent > this.userPages) {
        this.loading = true
      } else {
        this.getConversations()
        this.loading = false
      }
    },

    // 滚动条自动到底部
    scrollToBottom () {
      this.$nextTick(() => {
        let msg = document.getElementsByClassName('display-infor')[0] // 获取对象
        msg.scrollTop = msg.scrollHeight // 滚动高度
      })
    },

    // 交换两个数组的位置
    elChangeExForArray (index1, index2, array) {
      let temp = array[index1]
      array[index1] = array[index2]
      array[index2] = temp
      return array
    },

    // 选中客服
    getSelectProdRow (row) {
      this.platformUserId = row.userId
    },

    /**
     * 转接客服确定
     */
    transferDetermination () {
      if (this.platformUserId) {
        let messageInfo = {
          toId: this.currentUserId,
          changeTo: 1,
          platformUserId: this.platformUserId,
          msgType: 0
        }
        this.imSocketTask.send(JSON.stringify(messageInfo))
        this.visible = false
      } else {
        this.$message.error(this.$i18n.t('chat.pleaseSelectAcustomerService'))
      }
      this.platformUserId = 0
    },

    /**
     * 链接点击去往商品详情或订单详情
     */
    toProdDetail (prodInfo, type, orderType) {
      let routeUrl = null
      if (type) {
        routeUrl = this.$router.resolve({
          path: (orderType === 3 ? 'score-order?orderNumber=' : '/order-order?orderNumber=') + prodInfo.orderNumber
        })
      } else {
        let prodName = prodInfo.prodName
        let skuName = prodInfo.skuName
        let prodId = prodInfo.prodId

        if (skuName) {
          let prodNameArray = prodName.split(' ')
          let skuNameArray = skuName.split(' ')
          // 过滤掉sku名称
          prodNameArray = prodNameArray.filter(item => {
            return skuNameArray.every(item1 => {
              return item !== item1
            })
          })

          prodName = prodNameArray.join('')
        }

        routeUrl = this.$router.resolve({
          path: (orderType === 3 ? `/prod-scoreProdList?prodName=${prodName}&prodId=${prodId}` : `/prod-prodList?prodName=${prodName}&prodId=${prodId}`)
        })
      }
      window.open(routeUrl.href, '_blank', 'noopener,noreferrer', 'noopener,noreferrer')
    }

  }
}
</script>
<style lang="scss" scoped>
.imbox {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // background: #000;
  // filter: alpha(opacity=30);
  // -ms-filter: "alpha(opacity=30)";
  // opacity: 0.3;
  // z-index: 10000;
}

.imboxItem {
  top: 50%;
  left: 50%;
  margin-left: -433px;
  margin-top: -300px;
  z-index: 10001;
  display: block;
  position: fixed;
  _position: absolute;
  box-shadow: 2px 2px 4px #a0a0a0, -2px -2px 4px #a0a0a0;
}

.web__tools dl {
  display: none;
}

.ChatPage .main .rightBox {
  border-left: 1px solid #f1f1f1;
}

.rightBox .item {
  margin-bottom: 10px;
}

.wrapper span {
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  position: relative;
  line-height: 1.5;
  word-wrap: break-word;
  word-break: break-all;
}

.body {
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: #2e2f3d;
  // margin-top: -16px;
  padding: 0;
}

.base {
  min-height: 535px;
  padding-bottom: 0rem !important;
  flex-direction: column;
}

.body .chat-box {
  width: 980px;
  height: 797px;
  background: #ffffff;
  opacity: 1;
  margin: 61px auto 0 auto;
}

.chat-box .chat-box-top {
  width: 100%;
  height: 53px;
  padding-left: 15px;
  box-sizing: border-box;
  background: #f7f8fa;
  border-bottom: 1px solid #eceef0;
  opacity: 1;
  border-radius: 5px 5px 0px 0px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  line-height: 53px;
  color: #333333;
  opacity: 1;
}

.chat-box .chat-box-main {
  display: flex;
  height: 744px;
}

/* 左侧用户名和商家栏样式 */
.body .chat-box .chat-box-left {
  overflow:auto;
  width: 287px;
  height: 100%;
  background: #ffffff;
  opacity: 1;
  border-right: 1px solid #eceef0;
}

.chat-box-left .shop-list {
  padding: 0;
  margin: 0;
}

.chat-box-left .shop-list .shop-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.chat-box-left .shop-list .shop-item:hover {
  background-color: #d0e9ff;
}

.chat-box-left .shop-item img {
  width: 36px;
  height: 36px;
  margin: 12px 12px 12px 15px;
}

.chat-box-left .shop-item .shop-info {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.chat-box-left .shop-item .shop-info .shop-info-name {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 20px;
  color: #333333;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

.shop-info-name .name{
  width: 80%;
  color: #333333;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

.shop-info-name .tips{
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  border-radius: 16px;
  padding: 0 5px;
  margin-right: 5px;
  box-sizing: border-box;
  color: #fff;
  font-size: 10px;
  content: " ";
  background: #fc1b35;
}

.chat-box-left .shop-item .shop-info .shop-info-icon {
  width: 110px;
  margin-top: 5px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #a1a6af;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

.chat-box-left .shop-item .shop-info .ye {
  background-color: #ffc267;
}

/* 右侧主要信息聊天栏 */
.body .chat-box .chat-box-right {
  width: 100%;
  height: 100%;
}

.chat-box-right .shop-name-tittle {
  line-height: 20px;
  padding: 20px 0px 21px 21px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;
  border-bottom: 1px solid #ebedf0;
}

.chat-box-right .im-box {
  display: flex;
}

.chat-box-right .im-main {
  width: 100%;
  height: 735px;
  border-right: 1px solid #ebedf0;
}

.im-main .chat-main-form {
  display: flex;
  flex-direction: column;
}

.im-main .chat-main-form .display-infor {
  height: 588px;
  padding-top: 15px;
  overflow-y: auto;
  box-sizing: border-box;
}

.im-main .chat-main-form .reply {
  width: 100%;
  height: 147px;
  border-top: 1px solid #ebedf0;
  position: relative;
}
.im-main .chat-main-form .reply .small-box {
  display: flex;
}
.im-main .chat-main-form .reply .small-box .customerService {
   margin: 17px 0 8px 22px;
   cursor: pointer;
}
.im-main .chat-main-form .reply .upload {
  width: 22px;
  height: 18px;
  background-image: url("../../assets/img/upload.png");
  margin: 17px 0 8px 22px;
  cursor: pointer;
}

.im-main .chat-main-form .reply .reply-area textarea {
  margin-left: 12px;
  border: none;
  resize: none;
  outline: none;
  box-shadow: none;
  width: 98%;
}

.im-main .chat-main-form .reply .send {
  width: 62px;
  height: 26px;
  line-height: 26px;
  position: absolute;
  right: 20px;
  text-align: center;
  background: #155bd4;
  color: #fff;
  cursor: pointer;
  opacity: 1;
  border-radius: 16px;
}

/* 主要聊天信息栏 */

.row {
  padding: 15px;
}

.row .system {
  display: flex;
  justify-content: center;
}

.row .system view {
  padding: 0 30upx;
  height: 50upx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #c9c9c9;
  color: #fff;
  font-size: 24upx;
  border-radius: 40upx;
}

.row .system .red-envelope image {
  margin-right: 5upx;
  width: 30upx;
  height: 30upx;
}

.row:first-child {
  margin-top: 20upx;
}

.row .other .right {
  padding-right:15px
}

.row .my .left,
.row .other .right {
  flex-shrink: 0;
  width: 80upx;
  height: 80upx;
  margin-top: 20px;
  margin-left: 20px;

}

.row .my .left .bubble,
.row .other .right .bubble {
  max-width: 40%;
  padding: 12px 14px 11px 16px;
  word-break: break-word;
  box-sizing: border-box;
}

.row .my .right .bubble .longimage,
.row .other .left .bubble .longimage {
  width: 88px;
  height: 88px;
  cursor: pointer;
  object-fit: contain;
}

.row .my .left .bubble .longimage,
.row .other .right .bubble .longimage {
  cursor: pointer;
  width: 34px;
  height: 34px;
}

.row .my .right,
.row .other .left {
  width: 100%;
  display: flex;
  margin-left: 12px;
  flex-direction: column;
  margin-bottom: 20px;
}

.row .my .right .avatar,
.row .other .left .avatar {
  width: 34px;
  height: 34px;
  margin-right: 20px;
}

.row .my .left img,
.row .other .right img {
  width: 40px;
  height: 40px;
  border-radius: 5px;
}

.row .my {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.row .my .left {
  min-height: 80upx;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.row .my .left .bubble {
  background-color: #d0e9ff;
  color: #000;
  opacity: 1;
  border-radius: 8px 0px 8px 8px;
}

.row .my .right .bubble {
  max-width: 40%;
  margin-top: 6px;
  color: #000;
  opacity: 1;
  border-radius: 8px 0px 8px 8px;
}

.row .my .right .bubble span {
  display: inline-block;
  padding: 12px 14px 11px 16px;
  word-break: break-word;
  box-sizing: border-box;
  background-color: #f3f3f3;
  color: #000;
  opacity: 1;
  border-radius: 8px 0px 8px 8px;
}

.row .other .right .bubble {
  justify-content: flex-end;
  opacity: 1;
  border-radius: 0px 8px 8px 8px;
}

.row .my .left .no-bg {
  background-color: none;
}

@keyframes my-play {
  0% {
    transform: translateX(80%);
  }

  100% {
    transform: translateX(0%);
  }
}

.row .my .left .bubble.play .icon:after {
  border-left: solid 10upx rgba(240, 108, 122, 0.5);
  animation: my-play 1s linear infinite;
}

.phone-icon {
  width: 60rpx;
  height: 60rpx;
}

.row .my .right {
  margin-left: 15upx;
}

.row .other {
  width: 100%;
  display: flex;
}

.row .other .left {
  margin-right: 15upx;
}

.row .other .right {
  flex-wrap: wrap;
  margin-left: -8px;
}

.row .other .left .username,
.row .other .left .take-charge-of,
.row .my .left .username {
  width: 100%;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 14px;
  color: #999;
  display: flex;
  align-items: center;
}

.row .my .left .username,
.row .other .left .take-charge-of,
.row .other .left .username {
  justify-content: flex-end;
}
.row .other .left .take-charge-of {
  margin-top:10px;
}

.row .my .right .username .name {
  max-width: 70%;
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row .my .left .username .time {
  text-align: center;
  margin-left: 40rpx;
}

.row .other .left .username .name {
  max-width: 70%;
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row .other .left .bubble {
  align-self: flex-end;
  max-width: 40%;
  margin-top: 6px;
  margin-right: 14px;
  opacity: 1;
  border-radius: 8px 0px 8px 8px;
  color: #333;
}

.row .other .left .bubble span {
  display: inline-block;
  padding: 12px 14px 11px 16px;
  word-break: break-word;
  box-sizing: border-box;
  background-color: #d0e9ff;
  color: #333333;
  opacity: 1;
  border-radius: 8px 0px 8px 8px;
}

@keyframes other-play {
  0% {
    transform: translateX(-80%);
  }

  100% {
    transform: translateX(0%);
  }
}

.row .other .right .bubble.play .icon:after {
  border-right: solid 10upx rgba(255, 255, 255, 0.8);
  animation: other-play 1s linear infinite;
}

.windows .mask {
  position: fixed;
  top: 100%;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: opacity 0.2s ease-out;
}

.windows .layer {
  position: fixed;
  width: 80%;
  height: 70%;
  left: 10%;
  z-index: 1001;
  border-radius: 20upx;
  overflow: hidden;
  top: 100%;
  transform: scale3d(0.5, 0.5, 1);
  transition: all 0.2s ease-out;
}

.windows.show {
  display: block;
}

.windows.show .mask {
  top: 0;
  opacity: 1;
}

.windows.show .layer {
  transform: translate3d(0, -85vh, 0) scale3d(1, 1, 1);
}

.windows.hide {
  display: block;
}

.windows.hide .mask {
  top: 0;
  opacity: 0;
}

.open-redenvelope {
  width: 100%;
  height: 70vh;
  background-color: #cf3c35;
  position: relative;
}

.open-redenvelope .top {
  width: 100%;
  background-color: #fe5454;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  border-radius: 0 0 100% 100%;
  box-shadow: inset 0 -20upx 0 #9c1712;
  margin-bottom: 65upx;
}

.open-redenvelope .top .close-btn {
  width: 100%;
  height: 80upx;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 30upx;
}

.open-redenvelope .top .close-btn .icon {
  color: #9c1712;
  margin-top: 10upx;
  margin-right: 10upx;
}

.open-redenvelope .top image {
  width: 130upx;
  height: 130upx;
  border: solid 12upx #cf3c35;
  border-radius: 100%;
  margin-bottom: -65upx;
}

.open-redenvelope .from,
.open-redenvelope .blessing,
.open-redenvelope .money,
.open-redenvelope .showDetails {
  width: 90%;
  padding: 5upx 5%;
  display: flex;
  justify-content: center;
  font-size: 32upx;
  color: #fff;
}

.open-redenvelope .money {
  font-size: 100upx;
  color: #f8d757;
  display: flex;
  padding-top: 20upx;
}

.open-redenvelope .showDetails {
  position: absolute;
  bottom: 20upx;
  align-items: center;
  font-size: 28upx;
  color: #f8d757;
}

.open-redenvelope .showDetails .icon {
  font-size: 26upx;
  color: #f8d757;
}

.flex-wrap {
  flex: auto;
}

/* 返回图标 */
.back-icon {
  position: absolute;
  left: 0;
  top: 36rpx;
  width: 50rpx;
  height: 30rpx;
  transform: rotate(90deg);
}

.shop-tit {
  text-align: center;
  max-width: 80%;
  margin: 0 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 系统提示 */
.sys-tips {
  display: flex;
  justify-content: center;
}

.tips-content {
  color: #999999;
  font-size: 28rpx;
}

/* 中间时间样式 */
.topTime {
  text-align: center;
  margin-bottom: 15px;
  height: 28rpx;
  font-size: 10px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 28rpx;
  color: #aaaaaa;
  opacity: 1;
}

/* 右侧正在查询和我的订单 */
.order-column {
  flex: 1;
}

.order-column .tab-switch {
  display: flex;
  height: 37px;
}

.order-column .inquiry,
.order-column .my-order {
  flex: 1;
  text-align: center;
  line-height: 37px;
  cursor: pointer;
  font-size: 12px;
  border-bottom: 1px solid #eceef0;
  background: #f8f8f8;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #999999;
  opacity: 1;
}

.order-column .active {
  color: #e1251b;
  background-color: #fff;
  border: none;
}

.order-column .browse {
  width: 100%;
  border-bottom: 1px solid #eceef0;
  text-align: center;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 14px;
  color: #666666;
  opacity: 1;
}

.order-column .text {
  width: 60px;
  padding: 11px 0 5px 0px;
  margin: auto;
  border-bottom: 2px solid #e1251b;
}

/* 订单商品详情 */
.recent-list,
.order-list {
  padding-left: 12px;
  height: 663px;
  overflow-y: auto;
}

.prod-item {
  display: flex;
  padding: 18px 0;
  border-bottom: 1px solid #eceef0;
  border-top: 1px solid #eceef0;
  margin-top: -1px;
}

.order-column .order-list .botl {
  border-bottom: 9px solid #faf9f9;
  flex-direction: column;
  padding-bottom: 0;
}

.prod-item .prod-detail {
  padding-right: 12px;
  flex: 1;
}

.prod-item img {
  width: 60px;
  height: 60px;
  margin-right: 12px;
}

.prod-item .prod-name {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 18px;
  color: #333333;
  opacity: 1;
  word-break: break-word;
}

.prod-item .interval {
  width: 100%;
  height: 10px;
  background: #faf9f9;
  opacity: 1;
}

.prod-b {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.prod-b .prod-price {
  margin-top: 5px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 18px;
  color: #e1251b;
  opacity: 1;
}

.prod-b .prod-send {
  width: 46px;
  height: 24px;
  cursor: pointer;
  text-align: center;
  border: 1px solid #e9eaec;
  opacity: 1;
  border-radius: 12px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 24px;
  color: #333333;
  opacity: 1;
}

.prod-b .prod-send:hover {
  border: 1px solid #e1251b;
  color: #e1251b;
}

/* 我的订单样式 */
.order-box {
  display: flex;
}

.order-number {
  padding-bottom: 6px;
  border-bottom: 1px solid #ebedf0;
  margin-bottom: 12px;
}

.order-box .number,
.order-box .time {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 14px;
  color: #666666;
  opacity: 1;
}

.order-number .number {
  display: inline-block;
  margin-right: 16px;
}

.order-list .bottom-tips {
  text-align: center;
  padding-top: 20px;
}

// 图片上传
.search-btnn {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.imgUp {
  position: absolute;
  left: 22px;
  top: 18px;
}
.imgUp:hover {
  background-image: url("~@/assets/img/upload-on.png");
  cursor: pointer;
}

/* 商品链接样式 */
.prod-number {
  margin-bottom: 5px;
}
.link-prod {
  width: 65%;
  border: 1px solid #f2f2f2;
  box-sizing: border-box;
  margin-top: 6px;
  padding: 15px 0 18px 12px;
  cursor: pointer;
}
.prod-box {
  display: flex;
}
.link-prod img {
  width: 88px;
  height: 88px;
}
.link-prod .link-detail {
  display: flex;
  width: 70%;
  flex-direction: column;
  justify-content: space-between;
  margin: 15px;
  box-sizing: border-box;
}
.link-detail .prod-name {
  font-size: 10px;
  font-family: PingFang SC;
  padding-top: 10rpx;
  font-weight: 400;
  color: #333333;
  opacity: 1;
  word-break: break-word;
}
.link-prod .prod-price {
  margin-top: 10px;
  font-size: 10px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #999999;
  opacity: 1;
  display: flex;
  justify-content: space-between;
  word-break: break-all;
}
.link-prod .payment-amount {
  flex: 1;
}
.link-prod .prod-status {
  width: 35%;
  text-align: end;
}
.link-send {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 98rpx;
  text-align: center;
  color: #e43130;
}
.link-send-right {
  width: 10rpx;
  height: 17rpx;
  margin-left: 14rpx;
  display: inline-block;
  background: url("../../assets/img/link-send.png");
}

.img-view {
  position: inherit;
  width: 100%;
  height: 100%;
}
/*遮罩层样式*/
.img-layer {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  width: 100%;
  height: 100%;
  overflow: hidden;
}
/*不限制图片大小，实现居中*/
.img-layer .img {
  max-width: 50%;
  max-height: 50%;
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  z-index: 1000;
  cursor: pointer;
}
.img-layer img {
  width: 100%;
  height: 100%;
  cursor: pointer;
  object-fit: contain
}
/* 点击加载更多 */
.display-infor .more {
    font-size: 12px;
    color: #5a606b;
    text-align: center;
    margin-bottom: 20px;
    cursor: pointer;
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select: none;
}

.unread{
    font-size: 12px;
    color: #AAAAAA;
    margin-right: 9px;
}
.left .message-box{
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

/*客服转接弹窗样式*/
// ::v-deep .el-dialog {
//   margin-top: 0.61rem!important;
//   width: 9.8rem!important;
//   height: 7.97rem!important;
// }

.prods-select-body {
  height: 630px;
  overflow: auto;
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}

@media screen and ( max-width: 1680px ){

.body .chat-box {
    opacity: 1;
    /* width: 960px; */
    margin: 20px auto 20px auto;
}
.body{
   position: absolute;
   height: calc(110vh + 200px)
   /* height: auto; */
}

}
// 新消息过来 背景颜色 以及 选中的背景颜色
.newMessage{
 background-color: #FFF9cd;
}
.changeUser{
  background-color: #D0E9FF;
}

/* 放大图片的右侧关闭图标 */
.bubble ::v-deep .el-image-viewer__close{
  color:red !important
}

.unread-box {
  position: absolute;
  right: 8px;
  top: -5px;
  height: 16px;
  margin-top: 5px;
}

.unread-box .number {
    background: #fff;
    font-size: 0;
  }

.unread-box .number {
    min-width: 16px;
    height: 16px;
    line-height: 16px;
    border-radius: 16px;
    padding: 0 5px;
    box-sizing: border-box;
    color: #fff;
    font-size: 10px;
    content: " ";
    background: #fc1b35;
}
</style>
