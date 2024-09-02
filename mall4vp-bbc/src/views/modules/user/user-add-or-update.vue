<template>
  <div>
    <el-dialog
      :title="
        !dataForm.userId
          ? this.$i18n.t('sysManagement.add')
          : this.$i18n.t('user.details')
      "
      :close-on-click-modal="false"
      :visible.sync="visible"
      @close="handleDialogClose"
      class="user-update-dialog"
      width="70%"
    >
    <!-- 用户信息 -->
    <div class="user-info-item">
      <el-divider class="info-title" content-position="left">
        <h3>{{ $t('user.userInfo') }}</h3>
      </el-divider>
      <div class="info-content">
        <div class="base-info"></div>
        <div class="user-status"></div>
      </div>
    </div>
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        :label-width="
          this.$i18n.t('language') === 'language' ? '130px' : '80px'"
      >
        <el-container style="margin-top:20px">
          <el-aside width="210px">
            <el-form-item :label="$t('publics.profilePicture')" prop="pic">
              <img
                src="~@/assets/img/userImg.jpg"
                v-if="!dataForm.pic"
                width="130"
                height="130"
              />
              <img
                v-else
                :src="dataForm.pic"
                class="image"
                width="130"
                height="130"
              />
            </el-form-item>
          </el-aside>
          <el-container>
            <el-main>
              <el-row>
                <el-col :span="7" justify="start">
                  <el-form-item
                    :label="$t('users.name') + ':'"
                    prop="nickName"
                    size="mini"
                  >
                    <span v-if="nameVisible">{{ dataForm.nickName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="$t('publics.status') + ':'"
                    size="mini"
                    prop="status"
                  >
                    <span v-if="dataForm.status == 0">{{
                      $t("publics.disable")
                    }}</span>
                    <span v-if="dataForm.status == 1">{{
                      $t("publics.normal")
                    }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item
                    :label="$t('user.registrationTime') + ':'"
                    prop="userRegtime"
                    size="mini"
                  >
                    <span>{{ dataForm.userRegtime }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-main>
            <el-footer>
              <el-row :gutter="10" type="flex">
                <el-col :span="$t('language') == '语言' ? 4 : 5">
                  <div v-if="isAuth('platform:coupon:sendUserCoupon')" @click="updateCoupon()" class="default-btn primary-btn">
                    {{ $t("user.sendCoupons") }}
                  </div>
                </el-col>
                <el-col :span="$t('language') == '语言' ? 5: 7">
                  <div @click="updateUserInfo()" class="default-btn primary-btn">
                    {{ $t("components.editInfo") }}
                  </div>
                </el-col>
                <el-col :span="$t('language') == '语言' ? 5 : 7">
                  <div @click="updateTags()" class="default-btn primary-btn">
                    {{ $t("user.tagging") }}
                  </div>
                </el-col>
              </el-row>
            </el-footer>
          </el-container>
        </el-container>
        <el-form-item :label="$t('user.customerLabel')" prop="userTagParam">
          <div v-if="userTag.length > 0">
            <el-tag
              :key="tag.tagId"
              v-for="tag in userTag"
              :closable="tag.tagType === 0"
              :disable-transitions="false"
              @close="handleClose(tag)"
              >{{ tag.tagName }}</el-tag
            >
          </div>
        </el-form-item>
        <!-- 账户资产 -->
        <el-divider content-position="left">
          <h3>{{ $t("user.accountAssets") }}</h3>
        </el-divider>
        <el-container>
          <el-main>
            <div>
              <h4>{{ $t("user.accountWallet") }}</h4>
              <br />
              <div>
                <span
                  >{{ $t("user.currentBalance") }}：{{
                    dataForm.sumBalance
                  }}</span
                >
                <span style="margin-left: 60px"
                  >{{ $t("user.cumulativeBalances") }}：{{
                    dataForm.currentBalance
                  }}</span
                >
                <br />
                <span
                  >{{ $t("user.rechargeAmount") }}：{{
                    dataForm.rechargeAmount
                  }}</span
                >
                <span style="margin-left: 60px"
                  >{{ $t("user.rechargeTimes") }}：{{
                    dataForm.rechargeTimes
                  }}</span
                >
              </div>
              <br />
            </div>
            <br />
            <div>
              <h4>{{ $t("order.score") }}</h4>
              <br />
              <div>
                <span>{{ $t("user.currentScore") }}：{{ dataForm.score }}</span>
                <span style="margin-left: 60px"
                  >{{ $t("user.cumulativeScore") }}：{{
                    dataForm.sumScore
                  }}</span
                >
              </div>
              <br />
            </div>
            <br />
            <div>
              <h4>
                {{ $t("user.coupons") }}
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  :content="$t('user.couponTip3')"
                >
                  <i class="el-icon-question" slot="reference"></i>
                </el-popover>
              </h4>
              <br />
              <div>
                <span
                  >{{ $t("user.notUsed") }}：{{
                    couponUserParam.couponUsableNums
                  }}&nbsp;&nbsp;{{ $t("marketing.piece") }}</span
                >
                <span style="margin-left: 60px"
                  >{{ $t("user.used") }}：{{
                    couponUserParam.couponUsedNums
                  }}&nbsp;&nbsp;{{ $t("marketing.piece") }}</span
                >
                <br />
                <span
                  >{{ $t("user.invalid") }}：{{
                    couponUserParam.couponExpiredNums
                  }}&nbsp;&nbsp;{{ $t("marketing.piece") }}</span
                >
              </div>
              <br />
            </div>
          </el-main>
        </el-container>
        <el-divider content-position="left">
          <h3>{{ $t("user.otherInfo") }}</h3>
        </el-divider>
      </el-form>
      <div>
        <el-tabs>
          <el-tab-pane :label="$t('user.distributionInfo')">
            <div>
              <span
                >{{ $t("distributionMsg.invitees") }}：{{
                  distributionUser.parentName
                    ? distributionUser.parentName
                    : "---"
                }}</span
              >
              <span style="margin-left: 40px"
                >{{ $t("user.distributionTime") }}：{{
                  distributionUser.bindTime ? distributionUser.bindTime : "---"
                }}</span
              >
              <span
                v-if="distributionUser.state == null"
                style="margin-left: 20px"
                >{{ $t("brand.status") }}：{{ "---" }}</span
              >
              <span
                v-else-if="distributionUser.state == -1"
                style="margin-left: 20px"
                >{{ $t("brand.status") }}：{{
                  $t("distribUserWallet.ban")
                }}</span
              >
              <span
                v-else-if="distributionUser.state > -1"
                style="margin-left: 20px"
                >{{ $t("brand.status") }}：{{
                  [
                    $t("product.pendingReview"),
                    $t("brand.normal"),
                    $t("distribUserWallet.cleared"),
                    $t("liveRoom.auditFailed"),
                  ][distributionUser.state]
                }}</span
              >
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('user.tradeDetails')">
            <trade-detail ref="tradeDetail" />
          </el-tab-pane>
          <el-tab-pane :label="$t('user.scoreDetails')">
            <score-detail ref="scoreDetail" />
          </el-tab-pane>
          <el-tab-pane :label="$t('user.balanceDetails')">
            <balance-detail ref="balanceDetail" />
          </el-tab-pane>
          <el-tab-pane :label="$t('user.couponDetails')">
            <coupon-detail ref="couponDetail" />
          </el-tab-pane>
          <el-tab-pane :label="$t('user.growthLog')">
            <growth-detail ref="growthDetail"/>
          </el-tab-pane>
        </el-tabs>
      </div>

      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="visible = false">{{
          $t("remindPop.cancel")
        }}</el-button> -->
        <div class="default-btn primary-btn" @click="dataFormSubmit()">{{ $t("remindPop.confirm") }}</div>
      </span>
    </el-dialog>
    <!-- 送优惠券弹窗 -->
    <update-coupon
      v-if="updateCouponVisible"
      ref="updateCoupon"
      :getWay="1"
      @refreshDataList="refreshChange"
    ></update-coupon>
    <!-- 打标签弹窗 -->
    <update-tags
      v-if="updateTagsVisible"
      ref="updateTags"
      @refreshDataList="refreshChange"
    ></update-tags>
    <!-- 修改用户基本信息 -->
    <update-user-info
      v-if="updateUserInfoVisible"
      ref="updateUserInfo"
      @refreshUserInfo="refreshInfo"
    ></update-user-info>
  </div>
</template>

<script>
import UpdateCoupon from './update-user-copon'
import UpdateTags from './update-user-tags'
import TradeDetail from './trade-detail.vue'
import ScoreDetail from './score-detail.vue'
import BalanceDetail from './balance-detail.vue'
import CouponDetail from './coupon-detail.vue'
import UpdateUserInfo from './update-user-info.vue'
import GrowthDetail from './growth-detail.vue'
export default {
  components: {
    UpdateCoupon,
    UpdateTags,
    TradeDetail,
    ScoreDetail,
    BalanceDetail,
    CouponDetail,
    UpdateUserInfo,
    GrowthDetail
  },
  data () {
    return {
      visible: false,
      isSubmit: false,
      nameVisible: true,
      statusVisible: true,
      updateCouponVisible: false,
      updateUserInfoVisible: false,
      updateTagsVisible: false,
      dataForm: {
        userId: 0,
        nickName: '',
        pic: '',
        status: 1
      },
      couponUserParam: {
        couponUsableNums: 0,
        couponUsedNums: 0,
        couponExpiredNums: 0
      },
      // 分销信息
      distributionUser: {
        parentName: null,
        bindTime: null,
        state: null
      },
      userTag: [{ 'agId': 0, 'tagName': null }],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataRule: {
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.userId = id || 0
      // console.log('aa', id, this.dataForm)
      this.visible = true
      this.isSubmit = false
      this.clearVueData()
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
      if (this.dataForm.userId) {
        if (this.isSubmit) {
          return false
        }
        this.isSubmit = true
        this.$http({
          url: this.$http.adornUrl(`/admin/user/info/${this.dataForm.userId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm = data
          this.couponUserParam = this.dataForm.couponUserParam
          this.userTag = this.dataForm.userTagParam
          this.getDistribution()
          this.initTradeDetail(this.dataForm.userId)
          this.initScoreDetail(this.dataForm.userId)
          this.initBalanceDetail(this.dataForm.userId)
          this.initCouponDetail(this.dataForm.userId)
          this.initGrowthDetail(this.dataForm.userId)
        }).catch((e) => {
          this.isSubmit = false
        })
      }
    },
    // 修改后刷新
    refreshChange () {
      this.init(this.dataForm.userId)
    },
    // 移除标签
    handleClose (tag) {
      this.$http({
        url: this.$http.adornUrl('/user/userTag/deleteUserTag'),
        method: 'delete',
        data: this.$http.adornData({
          userId: this.dataForm.userId,
          userTagId: tag.tagId
        })
      }).then(({ data }) => {
        this.init(this.dataForm.userId)
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.visible = false
      // this.$refs['dataForm'].validate(valid => {
      //   if (valid) {
      //     this.$http({
      //       url: this.$http.adornUrl(`/admin/user`),
      //       method: 'put',
      //       data: this.$http.adornData({
      //         userId: this.dataForm.userId,
      //         nickName: this.dataForm.nickName,
      //         status: this.dataForm.status
      //       })
      //     }).then(({ data }) => {
      //       this.init(this.dataForm.userId)
      //       this.nameVisible = true
      //       this.statusVisible = true
      //       this.$message({
      //         message: this.$i18n.t('publics.operation'),
      //         type: 'success',
      //         duration: 1500,
      //         onClose: () => {
      //           this.visible = false
      //           this.$emit('refreshDataList', this.page)
      //         }
      //       })
      //     }).catch((e) => {
      //       this.isSubmit = false
      //     })
      //   }
      // })
    },
    // 打标签
    updateTags (id) {
      var ids = id ? [id] : [this.dataForm.userId]
      this.updateTagsVisible = true
      this.$nextTick(() => {
        this.$refs.updateTags.init(ids)
      })
    },
    // 送优惠券
    updateCoupon (id) {
      var ids = id ? [id] : [this.dataForm.userId]
      this.updateCouponVisible = true
      this.$nextTick(() => {
        this.$refs.updateCoupon.init(ids)
      })
    },
    // 修改用户信息
    updateUserInfo () {
      this.updateUserInfoVisible = true
      this.$nextTick(() => {
        this.$refs.updateUserInfo.init(this.dataForm)
      })
    },
    // 修改昵称
    updateName () {
      this.nameVisible = false
    },
    // 修改状态
    updateStatus () {
      this.statusVisible = false
    },
    // 清空数据
    clearVueData () {
      // this.$refs['couponUserParam'].resetFields()
      Object.assign(this.couponUserParam, this.$options.data().couponUserParam)
    },
    // 获取分销员信息
    getDistribution () {
      this.$http({
        url: this.$http.adornUrl(`/distribution/distributionUser/getInfo/${this.dataForm.userId}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data) {
          this.distributionUser.bindTime = data.bindTime
          this.distributionUser.state = data.state
          if (data.parentDistributionUser) {
            this.distributionUser.parentName = this.data.parentDistributionUser.nickName
          }
        }
      })
    },
    // 调用交易信息组件方法
    initTradeDetail (id) {
      this.$refs.tradeDetail.init(id)
    },
    // 调用积分详情组件方法
    initScoreDetail (id) {
      this.$refs.scoreDetail.init(id)
    },
    // 余额明细
    initBalanceDetail (id) {
      this.$refs.balanceDetail.init(id)
    },
    // 优惠券明细
    initCouponDetail (id) {
      this.$refs.couponDetail.init(id)
    },
    // 调用成长值记录组件方法
    initGrowthDetail (id) {
      this.$refs.growthDetail.init(id)
    },
    // 修改名称或者状态完成后刷新详情
    refreshInfo () {
      this.init(this.dataForm.userId)
      this.$emit('refreshDataList', this.page)
    },
    /**
     * 关闭回调
     */
    handleDialogClose () {
      this.distributionUser = {
        parentName: null,
        bindTime: null,
        state: null
      }
    }
  }
}
</script>
<style  lang="scss">
.user-update-dialog {
  .el-tabs__content {
    overflow: auto;
  }
  .user-edit-table {
    margin-bottom: 20px;
  }
}
</style>
