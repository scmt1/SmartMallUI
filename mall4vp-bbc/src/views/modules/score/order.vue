<template>
  <div class="mod-score-order">
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="dataForm"
        @keyup.enter.native="getDataList(this.page)"
        size="small"
      >
      <div class="input-row">
        <el-form-item :label="$t('order.number') + ':'">
          <el-input
            v-model="dataForm.orderNumber"
            :placeholder="this.$i18n.t('order.number')"
            clearable
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('order.status') + ':'">
          <template>
            <el-select
              v-model="status"
              clearable
              :placeholder="this.$i18n.t('order.statusMsg')"
              size="small"
              @change="orderStatus"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item :label="$t('order.theRecipientSName') + ':'">
          <el-input
            v-model="dataForm.receiver"
            :placeholder="this.$i18n.t('order.pleaseEnRecipName')"
            clearable
            size="small"
          ></el-input>
        </el-form-item>

        <el-form-item :label="$t('order.contactTel') + ':'">
          <el-input
            v-model="dataForm.mobile"
            :placeholder="this.$i18n.t('order.pleaseEnterNumber')"
            clearable
            size="small"
            type="number"
            class="myinput-appearance"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('order.createTime') + ':'">
          <el-date-picker
            size="small"
            v-model="dateRange"
            type="datetimerange"
            range-separator="—"
            value-format="yyyy-MM-dd HH:mm:ss"
            :start-placeholder="this.$i18n.t('date.start')"
            :end-placeholder="this.$i18n.t('date.end')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="default-btn" @click="setDateRange(1)">{{ $t("date.t") }}</div>
          <div class="default-btn" @click="setDateRange(2)">{{ $t("date.y") }}</div>
          <div class="default-btn" @click="setDateRange(3)">{{ $t("date.n") }}</div>
          <div class="default-btn" @click="setDateRange(4)">{{ $t("th") }}</div>
        </el-form-item>

        <el-form-item>
          <div
            class="default-btn primary-btn"
            @click="searchChange(true)"
            >{{ $t("order.query") }}</div
          >
          <!-- <el-button @click="showConsignmentInfo()"
                    type="primary"
          size="small">导出待发货订单</el-button>-->
          <div
            class="default-btn"
            @click="clear()"
            >{{ $t("order.clear") }}</div
          >
          <div
            class="default-btn"
            @click="getSoldExcel()"
            >{{ $t("order.export") }}</div
          >

         <div
              class="default-btn"
              @click="uploadSpu"
              >{{ $t("order.BulkShipping") }}</div
            >
        </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container main">
      <div class="content">
        <!-- 导航 -->
        <div class="status-nav clearfix">
          <ul :class="['status-nav','clearfix',showHeadScroll?'status-nav-bottom':'']">
            <li
              :class="['nav-item', sts == 0 ? 'selected' : '']"
              data-sts="0"
              @click="selectNav($event)"
            >
              <p class="li-txt">{{ $t("date.a") }}</p>
            </li>
            <li
              :class="['nav-item', sts == 1 ? 'selected' : '']"
              data-sts="1"
              @click="selectNav($event)"
            >
              <p class="li-txt">{{ $t("order.pendingPayment") }}</p>
            </li>
            <li
              :class="['nav-item', sts == 2 ? 'selected' : '']"
              data-sts="2"
              @click="selectNav($event)"
            >
              <p class="li-txt">{{ $t("order.toBeShipped") }}</p>
            </li>
            <li
              :class="['nav-item', sts == 3 ? 'selected' : '']"
              data-sts="3"
              @click="selectNav($event)"
            >
              <p class="li-txt">{{ $t("order.pendingReceipt") }}</p>
            </li>
            <li
              :class="['nav-item', sts == 5 ? 'selected' : '']"
              data-sts="5"
              @click="selectNav($event)"
            >
              <p class="li-txt">{{ $t("order.successfulTransaction") }}</p>
            </li>
            <li
              :class="['nav-item', sts == 6 ? 'selected' : '']"
              data-sts="6"
              @click="selectNav($event)"
            >
              <p class="li-txt">{{ $t("order.transactionFailed") }}</p>
            </li>
            <!-- <li
              :class="['nav-item', sts == 7 ? 'selected' : '']"
              data-sts="7"
              @click="selectNav($event)"
            >
              <p class="li-txt">{{ $t("group.groupType") }}</p>
            </li> -->
          </ul>
          <ul class="nav-right"></ul>
        </div>

        <!-- 列标题 -->
        <div :class="['tit', showHeadScroll ? 'fixed-top' : '']">
          <el-row style="width: 100%">
            <el-col :span="7">
              <span class="item product">{{ $t("order.product") }}</span>
            </el-col>
            <el-col :span="3" class="transaction-price">
              <span class="item">{{ $t("order.transaQuantity") }}</span>
            </el-col>
            <el-col :span="3" class="column-title">
              <span class="item">{{ $t("order.paymentAmount") }}</span>
            </el-col>
            <el-col :span="3" class="column-title">
              <span class="item">{{ $t("order.paymentMethod") }}</span>
            </el-col>
            <el-col :span="3" class="column-title">
              <span class="item">{{ $t("order.buyerConsignee") }}</span>
            </el-col>
            <el-col :span="2" class="column-title">
              <span class="item">{{ $t("order.orderStatus") }}</span>
            </el-col>
            <!-- <el-col :span="2" class="column-title">
              <span class="item">{{ $t("order.afterSale") }}</span>
            </el-col> -->
            <el-col :span="3" class="column-title">
              <span class="item">{{ $t("order.operation") }}</span>
            </el-col>
          </el-row>
        </div>

        <div class="prod" v-for="order in dataList" :key="order.orderId">
          <div class="prod-tit">
            <span>{{ $t("order.number") }}：{{ order.orderNumber }}</span>
            <span>{{ $t("order.createTime") }}：{{ order.createTime }}</span>
            <span>{{ $t("prodList.shopName") }}：{{ order.shopName }}</span>
            <!-- <span>买家：19999999999</span>
            <span >联系电话：19999999999</span>-->
          </div>
          <div class="prod-cont">
            <el-row style="width: 100%">
              <el-col :span="10">
                <div class="prod-item">
                  <div
                    class="items name"
                    v-for="orderItem in order.orderItems"
                    :key="orderItem.orderItemId"
                  >
                    <div class="prod-image">
                      <img :src="resourcesUrl + orderItem.pic"  @error="handlePicError" />
                    </div>
                    <div class="prod-name">
                      <dir class="prod-con">
                        <div class="prod-name-txt">
                          {{ orderItem.prodName }}
                        </div>
                        <div
                          class="order-status"
                          v-if="order.status > 0 && order.status < 8"
                        >
                          {{
                            [
                              "",
                              $t("order.pendingPayment"),
                              $t("order.toBeShipped"),
                              $t("order.pendingReceipt"),
                              "",
                              $t("order.successfulTransaction"),
                              $t("order.transactionFailed"),
                              $t("group.waitGroup"),
                            ][order.status]
                          }}
                        </div>
                        <!-- <div
                          class="order-status"
                          v-if="order.status > 0 && order.status < 8"
                        >{{['','待付款','待发货','待收货','','交易成功','交易失败','待成团'][order.status]}}</div>-->
                        <!-- <span class="prod-info">{{orderItem.skuName}}</span> -->
                      </dir>
                    </div>
                    <div class="prod-price">
                      <span>{{ orderItem.price.toFixed(2) }}</span>
                      <span
                        >{{ orderItem.prodCount }}{{ $t("order.piece") }}</span
                      >
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="3" style="height: 100%">
                <div class="item">
                  <div>
                    <span class="totalprice"
                      >{{ $t("order.monetaryUnit")
                      }}{{ order.actualTotal.toFixed(2)
                      }}{{
                        order.score && order.score > 0
                          ? "+ " + order.score + " " + $t("order.score")
                          : ""
                      }}</span
                    >
                    <span class="totalprice" v-if="order.freightAmount"
                      >（{{ $t("order.includingFreight") }}：{{
                        $t("order.monetaryUnit")
                      }}{{ order.freightAmount.toFixed(2) }}）</span
                    >
                    <span
                      >{{ $t("order.total") }} {{ order.productNums }}
                      {{ $t("order.piece") }}</span
                    >
                  </div>
                </div>
              </el-col>
              <el-col :span="3" style="height: 100%">
                <div class="item">
                  <div>
                    <span v-if="(!order.payType && order.payType != 0) || order.status === 1">{{
                      $t("order.unpaid")
                    }}</span>
                    <span v-else>{{
                      [
                        $t("order.pointsPayment"),
                        $t("order.wecProPay"),
                        $t("order.alipayPCPayment"),
                        $t("order.wechatScanCodePayment"),
                        $t("order.wechatH5Payment"),
                        $t("order.weclAccountPay"),
                        $t("order.alipayH5Payment"),
                        $t("order.alipayAPPPayment"),
                        $t("order.wechatAPPPayment"),
                        $t("order.balancePayment"),
                        $t("order.payPalPayment")
                      ][order.payType]
                    }}</span>
                    <!-- <span
                      v-else
                    >{{['积分支付','微信小程序支付','支付宝PC端支付','微信扫码支付','微信H5支付','微信公众号支付','支付宝H5支付','支付宝APP支付','微信APP支付','用户余额支付','PayPal支付'][order.payType]}}</span>-->
                  </div>
                </div>
              </el-col>
              <el-col :span="3" style="height: 100%">
                <div class="item">
                  <div class="buyer-info">
                    <div class="buyer-name">
                      {{ order.receiverName }}
                    </div>
                    <div class="buyer-phone">
                      {{ order.receiverMobile }}
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="2" style="height: 100%">
                <div class="item">
                  <!-- <span v-if="order.refundStatus === 1" size="small" type="danger">退款申请中</span> -->
                  <span>
                    <span
                      v-if="order.status === 1"
                      size="small"
                      type="danger"
                      >{{ $t("order.pendingPayment") }}</span
                    >
                    <span
                      v-else-if="order.status === 2"
                      size="small"
                      type="danger"
                      >{{ $t("order.toBeShipped") }}</span
                    >
                    <span
                      v-else-if="order.status === 3"
                      size="small"
                      type="danger"
                      >{{ $t("order.pendingReceipt") }}</span
                    >
                    <span
                      v-else-if="order.status === 7"
                      size="small"
                      type="danger"
                      >{{ $t("group.waitGroup") }}</span
                    >
                    <span
                      v-else-if="order.status === 5"
                      size="small"
                      type="danger"
                      >{{ $t("order.successfulTransaction") }}</span
                    >
                    <span v-else-if="order.status === 6" size="small">{{
                      $t("order.transactionFailed")
                    }}</span>
                  </span>
                </div>
              </el-col>
              <!-- <el-col :span="2" style="height: 100%">
                <div class="item">
                  <span
                    v-if="order.refundStatus === 1"
                    size="small"
                    type="danger"
                    >{{ $t("order.requestingRefund") }}</span
                  >
                  <span
                    v-else-if="order.refundStatus === 2"
                    size="small"
                    type="danger"
                    >{{ $t("order.refundsuccessfully") }}</span
                  >
                  <span
                    v-else-if="order.refundStatus === 3"
                    size="small"
                    type="danger"
                    >{{ $t("order.partialRefundSucc") }}</span
                  >
                  <span
                    v-else-if="order.refundStatus === 4"
                    size="small"
                    type="danger"
                    >{{ $t("order.refundFailed") }}</span
                  >
                  <span v-else size="small" type="danger">{{
                    $t("order.noAfterSales")
                  }}</span>
                </div>
              </el-col> -->
              <el-col :span="3" style="height: 100%">
                <div class="item">
                  <div class="operate">
                    <!-- <button onclick="">打印订单</button><br> -->
                    <div
                      class="default-btn text-btn operate-btn"
                      @click="addOrUpdateHandle(order.orderNumber)"
                      >{{ $t("order.seeDetails") }}</div
                    >
                    <div
                      class="default-btn text-btn operate-btn marLeftNo block"
                      @click="toImbox(order)"
                      >{{ $t("order.contactBuyer") }}</div
                    >
                    <div
                      class="default-btn text-btn operate-btn marLeftNo"
                      @click="changeOrder(order)"
                      v-if="
                        order.status === 2 && order.dvyType !== 2 &&
                        (!order.refundStatus || order.refundStatus === 4)
                      "
                      >{{ $t("order.delivery") }}</div
                    >
                    <div
                        class="default-btn text-btn operate-btn marLeftNo"
                        @click="stationOrder(order)"
                        v-if="
                          order.status === 2 && order.dvyType === 2 &&
                          (!order.refundStatus || order.refundStatus === 4)
                      "
                    >提货</div
                    >
                    <!-- 退款信息 -->
                    <div
                      class="default-btn text-btn"
                      @click="refundRoute(order.orderNumber)"
                      v-if="order.refundStatus"
                      >{{ $t("order.refundInformation") }}</div
                    >
                    <div
                      class="default-btn text-btn marLeftNo"
                      v-if="
                        order.status == 3 &&
                        (!order.refundStatus || order.refundStatus > 2) &&
                        order.dvyType === 1
                      "
                      @click="reviseLogistics(order.orderNumber)"
                      >{{ $t("delivery.modifyLogistics") }}</div
                    >
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- <div class="remark">
            <div class="buyer-remark">
              <span>备注:{{order.remarks}}</span>
            </div>
          </div>-->
        </div>
        <div class="empty" v-if="!dataList.length">
          {{ $t("order.noData") }}
        </div>
      </div>
    </div>
    <el-pagination
      v-if="dataList.length"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="page.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.pageSize"
      :total="page.total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    ></add-or-update>
    <order-station
      v-if="orderStationVisible"
      ref="orderStation"
      @refreshOrderStationDataList="getDataList"
    ></order-station>
    <order-delivery-update
      v-if="devyVisible"
      ref="orderDeliveryUpdate"
      @refreshOrderDeliveryUpdate="getDataList"
    ></order-delivery-update>
    <consignment-info
      v-if="consignmentInfoVisible"
      ref="consignmentInfo"
      @inputCallback="getWaitingConsignmentExcel"
    ></consignment-info>
    <!-- 修改物流弹窗 -->
    <!-- <el-dialog :title="修改物流" width="70%"></el-dialog> -->
    <el-dialog
      :title="this.$i18n.t('delivery.modifyLogistics')"
      :close-on-click-modal="false"
      :visible.sync="logVisible"
      @closed="handleClose"
      class="LogModification"
      width="50%"
    >
      <!-- 修改 -->
      <div class="revise-log" v-if="isReviseLog">
        <div class="change-logistics">
          <div class="warning">{{ $t("delivery.ifModifyTheLog") }}</div>
          <div class="log-list">
            <div
              class="item"
              v-for="(logItem, index) in logisticsInfo"
              :key="index"
            >
              <div class="i-tit">
                <div class="big">
                  {{ $t("delivery.package") }}{{ index + 1 }}
                </div>
                <div class="text">
                  {{ $t("delivery.total") }} {{ logItem.productNums }}
                  {{ $t("marketing.item") }}{{ $t("order.product") }}
                </div>
              </div>
              <!-- <div class="i-con">
                   <div class="label">发货方式：</div>
                   <div class="con">
                     <div class="con-radio">
                       <input type="radio" name="checkit" value="" checked="true"/><span>需要物流</span>
                     </div>
                   </div>
                 </div>
                 <div class="i-con">
                   <div class="label">物流公司：</div>
                   <div class="con">
                     <div class="con-select">申通快递</div>
                     <div class="con-text">
                       <div class="text">运单号编：</div>
                       <input type="text" />
                     </div>
                   </div>
              </div>-->

              <el-form
                :model="logDataForm"
                ref="logDataForm"
                @keyup.enter.native="logDataFormSubmit()"
                label-width="95px"
                size="small"
              >
                <el-form-item
                  :label="$t('delivery.deliveryMethod') + '：'"
                  style="text-align: left"
                >
                  <el-radio-group v-model="logItem.deliveryType">
                    <el-radio :label="1" v-model="radio" disabled>{{
                        $t("delivery.needLogistics")
                      }}</el-radio>
                    <el-radio :label="3" v-model="radio" disabled>{{
                        $t("order.noNeedRequired")
                      }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <div class="info-int" v-if="logItem.deliveryType !== 3">
                  <el-form-item
                    :label="$t('delivery.courierCompany') + '：'"
                    class="form-item"
                  >
                    <div class="con">
                      <el-select class="int-frame" v-model="logItem.dvyId">
                        <!-- :placeholder="this.$i18n.t('tip.select')" -->
                        <el-option
                          v-for="item in logDataForm.dvyNames"
                          :key="item.dvyId"
                          :label="item.dvyName"
                          :value="item.dvyId"
                        ></el-option>
                      </el-select>
                    </div>
                  </el-form-item>
                  <el-form-item
                    :label="$t('delivery.trackingNumber') + '：'"
                    class="form-item"
                  >
                    <el-input
                      v-model="logItem.dvyFlowId"
                      controls-position="right"
                      :min="0"
                      :class="['int-frame', errorNum == 1 ? 'errortip' : '']"
                    ></el-input>
                    <!-- :label="this.$i18n.t('order.trackingNumber')" -->
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <!-- 确认 -->
      <div class="change-logistics" v-if="!isReviseLog">
        <div class="warning">{{ $t("delivery.ifModifyTheLog") }}</div>
        <el-table
          header-cell-class-name="table-header"
          row-class-name="table-row"
          :data="confirmList">
          <!-- <div v-for="(item,index) in confirmList" :key="index"> -->
          <el-table-column
            property="dvyIdName"
            :label="this.$i18n.t('delivery.packageName')"
            width="220"
            style="text-align: left"
          ></el-table-column>
          <el-table-column
            property="productNums"
            :label="this.$i18n.t('delivery.amountOfGoods')"
            width="140"
          ></el-table-column>
          <el-table-column
            property="delMethod"
            :label="this.$i18n.t('delivery.deliveryMethod')"
            width="140"
          ></el-table-column>
          <el-table-column
            property="dvyName"
            :label="this.$i18n.t('delivery.logisticsCompany')"
            width="170"
          ></el-table-column>
          <el-table-column
            property="dvyFlowId"
            :label="this.$i18n.t('delivery.trackingNumber')"
          ></el-table-column>
          <!-- </div> -->
        </el-table>
      </div>

      <div slot="footer" v-if="isReviseLog" class="dialog-footer">
        <div
          class="default-btn"
         @click="logVisible = false">{{
          $t("crud.filter.cancelBtn")
        }}</div>
        <div
          class="default-btn primary-btn"
          @click="logDataFormSubmit()">{{
          $t("distribution.save")
        }}</div>
      </div>

      <div slot="footer" v-if="!isReviseLog" class="dialog-footer">
        <div
          class="default-btn"
          @click="backToRevise()">{{
          $t("delivery.backToModify")
        }}</div>
        <div
          class="default-btn primary-btn"
          type="primary" @click="confirmRevise()">{{
          $t("delivery.confirmTheChanges")
        }}</div>
      </div>
    </el-dialog>
    <!-- 批量发货弹窗 -->
    <order-upload v-if="uploadVisible" ref="spuUpload" :param="dataForm" @refreshDataList1="getWaitingConsignmentExcel" />

  </div>
</template>

<script>
import AddOrUpdate from './orderInfo'
import ConsignmentInfo from './consignment-info'
import OrderDeliveryUpdate from './order-delivery-update'
import OrderStation from './order-station'
import moment from 'moment'
import OrderUpload from './order-upload'
export default {
  name: 'score-order',
  data () {
    return {
      sts: 0,
      dataForm: {},
      dateRange: [],
      status: null,
      options: [{
        value: 1,
        label: this.$i18n.t('order.pendingPayment')
      },
      {
        value: 2,
        label: this.$i18n.t('order.toBeShipped')
      },
      {
        value: 3,
        label: this.$i18n.t('order.pendingReceipt')
      },
      {
        value: 5,
        label: this.$i18n.t('order.successfulTransaction')
      },
      {
        value: 6,
        label: this.$i18n.t('order.transactionFailed')
      }],
      refund: [{
        value: 0,
        label: this.$i18n.t('order.noAfterSales')
      },
      {
        value: 1,
        label: this.$i18n.t('order.requestARefund')
      },
      {
        value: 2,
        label: this.$i18n.t('order.refundsuccessfully')
      },
      {
        value: 3,
        label: this.$i18n.t('order.partialRefundSucc')
      },
      {
        value: 4,
        label: this.$i18n.t('order.refundFailed')
      }],
      orderType: [{
        value: 0,
        label: this.$i18n.t('order.normalOrder')
      }, {
        value: 1,
        label: this.$i18n.t('order.groupPurchaseOrder')
      }, {
        value: 2,
        label: this.$i18n.t('order.spikeOrder')
      }],
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      // 确认修改弹窗
      isReviseLog: true,  // 是否正在修改物流信息
      confirmList: [],  // 确认修改信息
      radio: '1',
      logVisible: false,
      logDataForm: {
        dvyId: '', // 当前物流公司id
        dvyFlowId: '',  // 物流单号
        dvyNames: []  // 物流公司列表
      },
      logisticsInfo: [],  // 包裹列表
      showHeadScroll: false, // 修改物流相关
      dataListLoading: false,
      dataListSelections: [],
      orderDevyVisible: false,
      devyVisible: false,
      addOrUpdateVisible: false,
      consignmentInfoVisible: false,
      uploadVisible: false,
      oldPar: {},
      orderStationVisible:false
    }
  },
  components: {
    AddOrUpdate,
    ConsignmentInfo,
    OrderDeliveryUpdate,
    OrderUpload,
    OrderStation
  },
  created () {
    // 携带参数查询
    this.getDataList(this.page, this.$route.query)

    // 请求物流公司
    this.getLogisticsList()
  },
  activated () {
    // 携带参数查询
    var query = this.$route.query
    if (Object.keys(query).length > 0) {
      this.getDataList(this.page, query)
    }
  },
  mounted () {
    // 监听页面滚动
    window.addEventListener('scroll', this.scrollToTop)
  },
  methods: {
    handlePicError (event) {
      event.target.src = require('@/assets/img/def.png')
    },
    /**
     * 页面滚动事件
     */
    scrollToTop () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.showHeadScroll = scrollTop > 400
    },
    /**
     * 发货
     */
    changeOrder (order) {
      this.devyVisible = true
      this.$nextTick(() => {
        this.$refs.orderDeliveryUpdate.init(order)
      })
    },
    //提货
    stationOrder (order) {
      this.orderStationVisible = true
      this.$nextTick(() => {
        this.$refs.orderStation.init(order)
      })
    },
    /**
     * 获取数据列表
     */
    getDataList (page, params, type = 0, newData = false) {
      let par = Object.assign(
        {
          'orderNumber': this.dataForm.orderNumber,
              // 'prodName': this.dataForm.prodName,
          'shopName': this.dataForm.shopName,
          'receiver': this.dataForm.receiver,
          'mobile': this.dataForm.mobile,
          'status': this.status,
          'refundStatus': this.dataForm.refundStatus,
          'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
          'endTime': this.dateRange === null ? null : this.dateRange[1] // 结束时间
        },
            params
          )
      if (type === 0) {
        this.oldPar = par
      } else {
        par = this.oldPar
      }
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(par))
      }
      page = (page === undefined ? this.page : page)
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/score/order/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            this.theData,
            {
              status: this.status,
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            }
          ), false
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.sts = !this.status ? 0 : this.status
        this.dataListLoading = false

        // 末尾页数据为空重新请求
        if (!this.dataList.length && this.page.currentPage > 1) {
          this.page.currentPage = 1
          this.getDataList()
        }
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getDataList(this.page, {}, 1)
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.currentPage = val
      this.getDataList(this.page, {}, 1)
    },

    /**
     * 导航选择状态
     */
    selectNav (e) {
      this.page.currentPage = 1
      var sts = e.currentTarget.dataset.sts
      this.sts = parseInt(sts)
      this.status = this.sts === 0 ? null : parseInt(sts)
      this.getDataList(this.page)
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    orderStatus (val) {
      this.status = val
    },
    /**
     * 根据选项设置时间
     * 1:今天 2:昨天 3: 近七天 4:近30天 5:近60天
     */
    setDateRange (val) {
      var startDay = null
      var endDay = null
      if (val === 1) {
        startDay = 0
        endDay = 0
      } else if (val === 2) {
        startDay = -1
        endDay = -1
      } else if (val === 3) {
        startDay = -7
        endDay = -1
      } else if (val === 4) {
        startDay = -30
        endDay = -1
      } else {
        return
      }
      // 开始时间
      var startTime = moment().add(startDay, 'days').startOf('days').format('LL')
      // 结束时间
      var endTime = moment().add(endDay, 'days').endOf('days').format('LL')
      this.dateRange = [startTime, endTime]
    },
    // 新增 / 修改
    addOrUpdateHandle (val) {
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(val)
      // })
      this.$router.push({
        path: '/score-orderInfo',
        query: {
          orderNumber: val
        }
      })
    },
    // 退款路由跳转
    refundRoute (val) {
      this.$store.commit('router/updateIncludePageList', 'order-orderRefund')
      this.$store.commit('router/pushHisPageList', 'order-orderRefund')
      this.$router.push({
        path: '/order-orderRefund',
        query: { orderNumber: val }
      })
    },
    /**
     * 关闭 修改物流弹窗
     */
    handleClose () {
      this.isReviseLog = true
    },
    // 前往消息盒子
    toImbox (order) {
      window.open(location.href.split('#')[0] + '#/imBox?userId=' + order.userId + '&orderNumber=' + order.orderNumber, 'view_window')
    },
    // 删除
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.orderId
      })
      this.$confirm(this.$i18n.t('remindPop.makeSure') + ' ' + `[${id ? this.$i18n.t('remindPop.delete') : this.$i18n.t('remindPop.batchDeletion')}]` + ' ' + this.$i18n.t('remindPop.operation') + '?', this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/prod/spec/${ids}`),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.succeeded'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList(this.page)
            }
          })
        })
      }).catch(() => { })
    },
    showConsignmentInfo () {
      this.consignmentInfoVisible = true
      this.$nextTick(() => {
        this.$refs.consignmentInfo.init()
      })
    },
    // 清空按钮
    clear () {
      this.dataForm = {}
      this.dateRange = []
      this.status = null
    },
    /**
     * 获取包裹物流信息
     */
    reviseLogistics (orderNumber) {
      // console.log(orderNumber)
      this.logVisible = !this.logVisible
      this.$http({
        url: this.$http.adornUrl('/platform/orderDelivery/getOrderDeliveries/' + orderNumber),
        method: 'put'
      }).then(({ data }) => {
        this.logisticsInfo = data
        this.logisticsInfo.forEach((el, index) => {
          el.newDvyFlowId = el.dvyFlowId
          el.newDvyId = el.dvyId
          el.dvyIdName = this.$i18n.t('order.package') + Number(index + 1)
          // 修改弹窗
          this.confirmList = []  // 清空确认列表
        })
      })
      this.errorNum = 0
      // console.log(this.logisticsInfo)
    },
    /**
     * 请求物流公司列表
     */
    getLogisticsList () {
      this.$http({
        url: this.$http.adornUrl('/platform/delivery/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.logDataForm.dvyNames = data
      })
    },

    /**
     * 点击保存
     */
    logDataFormSubmit () {
      //  let reviseLogList = []
      let flag = true
      let logisticsInfo = this.logisticsInfo
      logisticsInfo.map((el, index) => {
        if (el.deliveryType === 3) {
          return
        }
        if (!flag) {
          return false
        }
        // console.log('logisticsInfo', el.logisticsInfo)
        // console.log('el.dvyFlowId', el.dvyFlowId)
        var reg = /^[a-zA-Z0-9]{4,30}$/
        if (el.dvyFlowId.length === 0) {
          this.$message({
            message: this.$i18n.t('order.logEmpty'),
            type: 'warning'
          })
          flag = false
          this.errorNum = 1
          // throw ('物流单号不能为空')
          // return false
        } else if (!reg.test(el.dvyFlowId)) {
          this.$message({
            message: this.$i18n.t('order.checkDvyId'),
            type: 'warning'
          })
          flag = false
          this.errorNum = 1
        } else {
          this.errorNum = 0
          // console.log(el.newDvyFlowId)
          let confirmList = this.confirmList
          if ((el.newDvyFlowId.length !== 0 && el.newDvyFlowId !== el.dvyFlowId) || (el.newDvyId !== el.dvyId)) {
            confirmList.push(el)
            confirmList.forEach((el, index) => {
              el.delMethod = this.$i18n.t('delivery.logistics')
              // el.packageName = "包裹" + Number(index+1)
              this.logDataForm.dvyNames.forEach((dvyName, index) => {
                if (el.dvyId === dvyName.dvyId) {
                  el.dvyName = dvyName.dvyName
                }
              })
            })
            this.confirmList = confirmList
          }
        }
        // console.log('确认列表:', this.confirmList)
        // this.confirmList.forEach((el, index) => {

        // })
      })
      // console.log(this.errorNum)
      if (this.errorNum === 1) {
        return
      } else if (this.confirmList.length === 0) {
        this.$message({
          message: this.$i18n.t('order.noLogIsChanged'),
          type: 'warning'
        })
        flag = false
      }
      if (flag) {
        this.isReviseLog = false // 修改弹窗
      }
    },
    /**
     * 确认修改物流信息
     */
    confirmRevise () {
      // let dvyOrderParam = {
      //   deliveryOrders: this.confirmList
      // }
      this.$http({
        url: this.$http.adornUrl('/platform/orderDelivery/updateOrderDeliveries'),
        method: 'put',
        data: this.$http.adornData({
          deliveryOrders: this.confirmList
        }),
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success'
        })
        this.isReviseLog = true
        this.logVisible = false
      })
    },
    /**
     * 返回修改（物流信息）
     */
    backToRevise () {
      this.isReviseLog = true
      // 修改弹窗
      this.confirmList = []  // 清空确认列表
    },
    // 搜索查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, null, 0, newData)
    },
    getSoldExcel () {
      if (!this.dateRange || this.dateRange.length < 2) {
        this.$message.error(this.$i18n.t('order.pleExpOrderFirst'))
        return
      }
      this.$confirm(this.$i18n.t('order.exportReport'), this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          target: '.main-container',
          customClass: 'export-load',
          background: 'transparent',
          text: this.$i18n.t('shop.exportIng')
        })
        this.$http({
          url: this.$http.adornUrl('/score/order/soldExcel'),
          method: 'get',
          params: this.$http.adornParams({
            'orderNumber': this.dataForm.orderNumber,
            // 'prodName': this.dataForm.prodName,
            'shopName': this.dataForm.shopName,
            'receiver': this.dataForm.receiver,
            'mobile': this.dataForm.mobile,
            'status': this.status,
            'refundStatus': this.dataForm.refundStatus,
            'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
            'endTime': this.dateRange === null ? null : this.dateRange[1] // 结束时间
          }),
          responseType: 'blob' // 解决文件下载乱码问题
        }).then(({ data }) => {
          loading.close()
          var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          const fileName = this.$i18n.t('order.orderInfCollationXls')
          const elink = document.createElement('a')
          if ('download' in elink) { // 非IE下载
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        }).catch((e) => {
          loading.close()
        })
      })
    },
    getWaitingConsignmentExcel () {
      this.getDataList(this.page)
    },
    uploadSpu () {
      this.dataForm.startTime = this.dateRange === null ? null : this.dateRange[0]
      this.dataForm.endTime = this.dateRange === null ? null : this.dateRange[1]
      this.uploadVisible = true
      this.$nextTick(() => {
        this.$refs.spuUpload.init()
      })
    }
  },
  destroyed () {
    // 页面销毁时移除监听
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
<style scoped>
.el-button + .el-button {
  margin-left: 0 !important;
  display: block;
}
.operation-box {
  display: inline-block;
  margin-left: 30px;
}
</style>

<style lang="scss" scoped>
  ::v-deep .export-load {
    top: -50% !important;
  }
.clearfix:after {
  /*伪元素是行内元素 正常浏览器清除浮动方法*/
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.clearfix {
  *zoom: 1; /*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
}
// .el-form-item {
//   margin-bottom: 10px !important;
// }
input.el-input__inner {
  // border: 0;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
}
.mod-score-order {
  .screening-conditions {
    display: block;
    padding: 20px;
    background: #f8f8f9;
    margin-bottom: 20px;
  }
  .main {
    .status-nav {
      position: relative;
      display: block;
      width: 100%;
      margin-bottom: 15px;
      height: 40px;
      border-bottom: 1px solid #ddd;
      line-height: 40px;
      .nav-list {
        position: absolute;
        left: 0;
        top: 0;
        width: 570px;
      }
      .nav-right {
        // width: 61.5%;
        // width: 70%;
        // height: 45px;
        // margin-left: 38.5%;
        // margin-left: 30%;
        // border-bottom: 1px solid #ddd;
      }
      .nav-item {
        float: left;
        height: 40px;
        line-height: 40px;
        background: #f7f8fa;
        border: 1px solid #ddd;
        padding: 0 20px;
        margin: 0 -1px -1px 0;
        cursor: pointer;
      }
      .li-txt {
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .nav-item:first-child {
        border-left: 1px solid #ddd;
      }
      .selected {
        background: #fff;
        border-bottom: none;
      }
    }
    .status-nav-bottom{
      margin-bottom: 72px;
    }

    .tit {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      background: #F7F8FA;
      z-index: 11;
      height: 57px;
      font-weight: bold;
    }
    .fixed-top {
      position: fixed;
      width: calc(83.5% + var(--tit-width-incremental));
      top: 90px;
    }
    .column-title {
      text-align: center;
    }
    .transaction-price {
      text-align: right;
      min-width: 140px;
    }
  }
  .prod {
    margin-bottom: 15px;
  }
  .tit {
    display: flex;
    height: 45px;
    align-items: center;
  }
  .tit .item {
    padding: 0 10px;
    width: 10%;
    text-align: center;
  }
  .tit .product {
    width: 25%;
  }
  .prod-tit {
    padding: 10px;
    background: #f8f8f9;
    border-left: 1px solid #dddee1;
    border-top: 1px solid #dddee1;
    border-right: 1px solid #dddee1;
  }
  .prod-tit span {
    margin-right: 15px;
  }
  .prod-cont {
    display: flex;
    border-top: 1px solid #dddee1;
    border-bottom: 1px solid #dddee1;
    border-left: 1px solid #dddee1;
    color: #495060;
  }
  .prod-cont .item {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    // width: 10%;
    border-right: 1px solid #dddee1;
    text-align: center;
    height: 100%;
  }
  .prod-cont .item span {
    display: block;
  }
  .prod-cont .prod-item {
    // width: 38%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #dddee1;
  }
  .prod-name {
    // display: flex;
    // align-items: center;
    width: 55%;
    text-align: left;
    vertical-align: middle;
  }
  .prod-con {
    display: block;
    padding: 0 !important;
    .prod-name-txt {
      padding-right: 10px;
      box-sizing: border-box;
      display: -webkit-box;
      word-break: break-word;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
  .prod-price {
    position: absolute;
    right: 10px;
    text-align: center;
  }
  .prod-price span {
    display: block;
  }
  .prod-price span:first-child {
    margin-bottom: 10px;
  }
  .prod-name .prod-info {
    display: block;
    color: #80848f;
    margin-top: 30px;
  }
  .buyer-info {
    display: block;
    width: 100%;
  }
  .buyer-name {
    margin-bottom: 10px;
  }
  .order-status {
    display: inline-block;
    margin-top: 15px;
    padding: 2px 4px;
    border: 1px solid #e43130;
    border-radius: 2px;
    color: #e43130;
  }
  .prod-cont .items.name {
    display: flex;
    align-items: center;
    position: relative;
    padding: 10px;
    // height: 100px;
    border-bottom: 1px solid #dddee1;
  }
  .prod-cont .items.name:last-child {
    border-bottom: none;
  }
  .prod-image {
    margin-right: 20px;
    width: 80px;
    height: 80px;
  }
  .prod-image img {
    width: 100%;
    height: 100%;
  }
  // .item span {
  //   display: block;
  //   margin-bottom: 10px;
  // }
  .totalprice {
    margin-bottom: 10px;
  }
  .item .operate {
    color: #2d8cf0;
  }
  .item .totalprice {
    color: #c00;
  }
  .prod .remark {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #e8f7f6;
    border-left: 1px solid #dddee1;
    border-right: 1px solid #dddee1;
    border-bottom: 1px solid #dddee1;
    margin-bottom: 20px;
  }
  .buyer-remark {
    padding: 0 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .el-form-item {
    margin-bottom: 20px !important;
  }
  .el-form-item__label {
    width: 100px;
  }
}
.empty {
  display: block;
  height: 200px;
  line-height: 200px;
  text-align: center;
  color: #aaa;
}
// 修改物流弹窗
.change-logistics {
  color: #333;
  padding: 0 20px;
}
// .change-logistics,
// .revise-log {
//   max-height: 300px;
//   overflow-y: auto;
// }
.LogModification {
  .i-tit {
    margin-bottom: 10px;
  }
  .el-button + .el-button {
    display: inline-block;
    margin-left: 10px !important;
  }
  input.el-input__inner {
    border: 0 !important;
  }
  .log-list {
    max-height: 600px;
    overflow-y: auto;
  }
}

.log-info-table {
  margin-top: 20px;
  max-height: 600px;
  overflow-y: auto;
}

.change-logistics .warning {
  padding: 10px;
  border: 1px solid #f1924e;
  background: #fff5ed;
}

.change-logistics .item {
  padding-bottom: 20px;
}

.change-logistics .item .i-tit {
  display: flex;
  align-items: center;
}

.change-logistics .item .i-tit .big {
  font-weight: 600;
  margin-right: 15px;
}

.change-logistics .item .i-con {
  display: flex;
  align-items: center;
  margin-top: 15px;
}

.change-logistics .item .i-con .label {
  width: 80px;
}

.change-logistics .item .i-con .con {
  display: flex;
  align-items: center;
}

.change-logistics .item .i-con .con .con-radio {
  margin-right: 10px;
}

.change-logistics .item .i-con .con .con-radio input,
.change-logistics .item .i-con .con .con-radio span {
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}

.change-logistics .item .i-con .con .con-radio input[type="radio"] {
  margin-left: 5px;
}

.change-logistics .item .i-con .con .con-select {
  position: relative;
  padding: 6px 25px 6px 12px;
  width: 220px;
  height: 32px;
  line-height: 18px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 2px;
}

.change-logistics .item .i-con .con .con-select::after {
  position: absolute;
  top: 13px;
  right: 8px;
  display: block;
  width: 0;
  height: 0;
  content: " ";
  font-size: 0;
  border: 5px solid transparent;
  border-top: 5px solid #333;
  border-radius: 2px;
}

.change-logistics .item .i-con .con .con-text {
  margin-left: 10px;
  display: flex;
  align-items: center;
}

.change-logistics .item .i-con .con .con-text .text {
  width: 80px;
}

.change-logistics .item .i-con .con .con-text input[type="text"] {
  border: 1px solid #ddd;
  padding: 0 10px;
  height: 30px;
  width: 160px;
  border-radius: 2px;
}
// 修改物流弹窗end

// 修改物流信息弹窗
.log-list {
  margin-top: 30px;
}
.el-form-item__label {
  // text-align: left;
  width: 100px;
}
.el-form-item {
  margin-bottom: 0;
  // margin-top: 10px;
}
.info-int {
  display: flex;
}
.form-item {
  margin-right: 15px;
}
.int-frame {
  // border-radius: 0;
  border: 0;
  // border: 1px solid #ddd;
}
.info-int .el-form-item__content,
.info-int .el-form-item__label,
.el-input__suffix-inner,
.el-input__icon {
  height: 32px;
  line-height: 32px;
}
// 修改物流信息弹窗end
// 确认修改
.el-table .cell {
  text-align: center;
}
.errortip {
  border-color: #e43130;
}
.block {
  display: block !important;
}
.marLeftNo {
  margin-left: 0 !important;
}
@media (max-width:1660px) {
  .fixed-top {
    width: calc(79.5% + var(--tit-width-incremental)) !important;
  }
}
@media (max-width:1360px) {
  .fixed-top {
    width: calc(75.5% + var(--tit-width-incremental)) !important;
  }
}
div ::v-deep .el-row {
  display: flex;
}
</style>

<style>
  .mod-score-order .search-bar .input-row .myinput-appearance>  input::-webkit-outer-spin-button,
.mod-score-order .search-bar .input-row .myinput-appearance>  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
.mod-score-order .search-bar .input-row .myinput-appearance>input[type="number"] {
    -moz-appearance: textfield;
}
</style>
