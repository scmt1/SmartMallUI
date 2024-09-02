<template>
  <el-dialog
    :title="this.$i18n.t('admin.selePaySetMeal')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :width="dialogWidth"
  >
    <div class="mod-service-notifyTemplate">
      <el-row>
        <el-col :span="7" v-for="(smsPackage, index) in dataList" :key="index">
          <div style="padding: 14px;">
            <el-card :body-style="{ padding: '0px'}">
              <!-- <img
              src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
              class="image"
              />-->
              <div style="padding: 16px;line-height:40px;">
                
                <el-tooltip effect="dark" :content="smsPackage.packageName" placement="top" >
                  <span class="sms-package-text"style="font-size:20px;font-weight:bold">{{smsPackage.packageName}}</span>
                </el-tooltip>
                <br />
                
                <el-tooltip effect="dark" :content="smsPackage.smsDesc" placement="top" >
                  <span class="sms-package-text" style="font-size:15px;color:#808080;">{{smsPackage.smsDesc}}</span>
                </el-tooltip>
                <!-- <hr style="background-color:#808080;border:none;height: 1px;" /> -->
                <el-divider class="line"></el-divider>
                <span style="font-size:15px;color:#808080">{{$t("admin.proFeat")}}：</span>
                <br />
                <i class="el-icon-finished"></i>
                <el-tooltip effect="dark" :content="smsPackage.propertyOne"  placement="top" >
                  <span class="sms-package-text"style="font-size:15px;">{{smsPackage.propertyOne}}</span>
                </el-tooltip>
                
                <br />
                <i class="el-icon-finished"></i>
                <el-tooltip effect="dark" :content="smsPackage.propertyTwo"  placement="top" >
                  <span class="sms-package-text" style="font-size:15px;">{{smsPackage.propertyTwo}}</span>
                </el-tooltip>
                <br />
                <span
                  style="font-size:15px;color:#808080;  padding-top: 33px;"
                >{{$t("admin.eveMsm")}}{{Number.parseFloat(smsPackage.amount / smsPackage.smsNum).toFixed(3)}}</span>
                <br />
                <span
                  style="font-size: 22px;color: #ff8a00;padding-bottom: 13.5px;"
                >¥{{smsPackage.amount}}{{smsPackage.amoAndMon}} / {{smsPackage.smsNum}}{{$t("admin.num")}}</span>
                <div class="bottom clearfix">
                  <!-- <time class="time">{{ currentDate }}</time> -->
                  <!-- <el-button
                    type="text"
                    class="button"
                    @click="payHandle(smsPackage.smsPackageId,2)"
                  >{{$t("admin.aliBuy")}}</el-button>-->
                  <el-button
                    type="text"
                    class="button"
                    @click="payHandle(smsPackage.smsPackageId,3)"
                  >{{$t("admin.weCharBuy")}}</el-button>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
      <!-- 支付弹窗 -->
      <!-- <div class="popup-mask" v-if="isShowPop"></div>
      <div class="popup-box" v-if="isPayPop">
        <div class="tit">
          <div class="text">购买会员</div>
          <div class="close" @click="closePop"></div>
        </div>
        <div class="con">
          <div class="pay-number">
            <div class="text">您正在开通</div>
            <div class="number">{{userLevels[curIndex].levelName}}</div>
            <div class="text">套餐，请支付</div>
            <div class="number">{{userLevels[curIndex].needAmount}}</div>
            <div class="text">{{$t("admin.dollar")}}</div>
          </div>
          <div class="pay-way">
            <div class="item" @click="choosePayWay(PayTypeConstant.ALIPAY)">
              <img src="~@/assets/img/alpay.png" alt />
            </div>
            <div v-html="payHtml"></div>
            <div class="item" @click="choosePayWay(PayTypeConstant.WECHATPAY_SWEEP_CODE)">
              <img src="~@/assets/img/weixinpay.png" alt />
            </div>
          </div>
        </div>
      </div>-->
      <!-- /支付弹窗 -->
      <!-- 微信支付弹窗 -->
      <div class="popup-box" v-if="isWxPop">
        <div class="tit">
          <div class="text">{{$t("admin.weChatPay")}}</div>
          <div class="close" @click="closePop"></div>
        </div>
        <div class="con">
          <div class="weixin-pay-code">
            <div class="text">{{$t("admin.weCharScanPay")}}</div>
            <div class="qrcode">
              <canvas id="wxPayQrCode"></canvas>
            </div>
            <div class="btn-box">
              <a href="javascript:void(0)" class="btn" @click="paySuccess">{{$t("admin.payCom")}}</a>
              <a
                href="javascript:void(0)"
                class="btn gray"
                @click="closePop"
              >{{$t("crud.filter.cancelBtn")}}</a>
            </div>
          </div>
        </div>
      </div>
      <!-- /微信支付弹窗 -->

      <!-- 暂无数据 -->
      <div v-if="!dataList.length" class="d-tips">
        <span>暂无短信套餐</span>
      </div>
    </div>
    <div class="zhezhao" v-if='isWxPop'></div>
  </el-dialog>
</template>
<script>
// import AddOrUpdate from './smsPackage-add-or-update'
import QRCode from 'qrcode'
import { setDialogWidth, widthChange } from '@/utils/setDialogWidth'
export default {

  data () {
    return {
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      currentDate: new Date(),
      searchForm: {}, // 搜索
      visible: false,
      dataListLoading: false,
      isWxPop: false,  // 是否微信支付弹窗
      addOrUpdateVisible: false,
      dialogWidth: '',
      defWidth: 950
    }
  },
  components: {
    // AddOrUpdate
  },
  created () {
    // this.getDataList()
    this.dialogWidth = setDialogWidth(this.defWidth)
  },
  mounted () {
    widthChange(this, this.defWidth)
    this.getDataList()
  },
  methods: {
    init () {
      this.visible = true
      this.getDataList(this.page)
    },
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/shop/smsPackage/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            this.searchForm
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
        console.log(this.dataList)
      })
    },
    payHandle (smsPackageId, type) {
      if (type === 2) {
        // 支付宝部分
        this.$http({
          url: this.$http.adornUrl('/shop/sms/paySms'),
          method: 'post',
          data: this.$http.adornData({
            id: smsPackageId,
            payType: type,
            returnUrl: window.location.origin + '/member-center/member-center'
          })
        }).then(({ data }) => {
          this.payHtml = data
          this.$nextTick(() => {
            document.forms[0].submit()
          })
        }).catch(() => {
          this.getCaptcha()
        })
      } else if (type === 3) {
        // 微信部分
        this.$http({
          url: this.$http.adornUrl('/shop/sms/paySms'),
          method: 'post',
          data: this.$http.adornData({
            id: smsPackageId,
            payType: type
          })
        }).then(({ data }) => {
          this.isWxPop = true
          // this.dataList = []
          this.$nextTick(function () {
            QRCode.toCanvas(document.getElementById('wxPayQrCode'), data, { version: 6, errorCorrectionLevel: 'L' })
          })
        }).catch(() => {
          this.getDataList()
        })
      }
    },
    // 关闭弹窗
    closePop () {
      this.isShowPop = false
      this.isPayPop = false
      this.isWxPop = false
    },
    // 点击完成支付
    paySuccess () {
      this.isShowPop = false
      this.isPayPop = false
      this.isWxPop = false
      this.visible = false
      this.$emit('refreshDataList')
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
    },
    searchChange (params) {
      this.searchForm = params
      this.getDataList(this.page)
    }
  }
}
</script>
<style lang="scss">
.el-tooltip__popper {
    max-width: 30%!important;  //宽度可根据自己需要进行设置 
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding-left: 15px;
  float: right;
}

.image {
  width: 100%;
  display: block;
}
.line {
  margin-top: 15px;
  margin-bottom: 15px;
}
.popup-box {
  position: fixed;
  z-index: 10000;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 4px solid rgba(0, 0, 0, 0.05);
}
.popup-box .tit {
  background: #f9f9f9;
  padding: 10px;
  display: flex;
  height: 40px;
  line-height: 14px;
}
.popup-box .tit .text {
  color: #999;
  font-size: 18px;
  flex: 1;
}
.popup-box .tit .close {
  width: 12px;
  height: 12px;
  margin-top: 1px;
  background: url(~@/assets/img/icons.png) no-repeat;
  background-position: 0 -232px;
  cursor: pointer;
}
.weixin-pay-code .qrcode {
  margin: 20px auto;
  font-size: 0;
  width: 200px;
  height: 200px;
  border: 1px solid #eee;
}

.popup-box .con {
  padding: 20px;
  background: #fff;
  min-width: 370px;
  min-height: 100px;
}
.weixin-pay-code .text {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-top: 10px;
}
.weixin-pay-code .btn-box .btn {
  background: #e1251b;
  height: 32px;
  line-height: 32px;
  border-radius: 32px;
  width: 90px;
  text-align: center;
  color: #fff;
}
.weixin-pay-code .btn-box .btn.gray {
  background: #fff;
  color: #000;
  border: 1px solid #ddd;
  width: 80px;
  margin-left: 20px;
}
.weixin-pay-code .btn-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}
.sms-package-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  word-break:break-word; 
  overflow: hidden;
}
// 微信支付二维码 遮罩层
.zhezhao {
    z-index: 2099;
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: #000;
    opacity: 0.1;
}
.d-tips {
  text-align: center;
  color:#909399
}
</style>
