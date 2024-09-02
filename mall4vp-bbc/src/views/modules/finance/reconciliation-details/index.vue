<template>
  <div class="manage-check">
    <!-- <div class="title">{{ $t("shopWallet.settlement") }}{{$t("shopWallet.riconciliazioneDetail")}}</div> -->
    <div class="title">{{ [$t("shopWallet.refundCheck"),$t("shopWallet.incomeCheck")][ioType] }}{{$t("shopWallet.riconciliazioneDetail")}}</div>
    <!-- <div class="shopInfo">
      <div class="message">
        <span>店铺名称：中山路精品洗车店</span>
        <span>商家编码：S00003</span>
        <span>结算时间段：2021-05-24～2021-05-30</span>
        <span>结算单号：S0009265</span>
        <span>结算单生成时间：2021-05-31</span>
      </div>
      <div class="total-amount">
        <div v-for="(item,index) in payList" :key="index" class="item">
          <div class="pay-name">{{ item.name }}</div>
          <div class="pay-amount">￥{{ item.amount | price }}</div>
        </div>
      </div>
    </div> -->
    <!-- 收入对账明细 -->
    <div v-if="ioType === 1" class="table-box">
      <el-table
        :data="tableData"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        style="width: 100%"
      >
        <el-table-column
          :label="this.$i18n.t('formData.serialNumber')"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="shopName"
          :label="this.$i18n.t('coupon.shopName')"
        />
        <el-table-column
          width="150"
          prop="payTime"
          :label="this.$i18n.t('user.payTime')"
        />
        <el-table-column
          prop="orderNumber"
          :label="this.$i18n.t('distribIncome.orderNumber')"
        />
        <el-table-column
          width="160"
          prop="bizPayNo"
          :label="this.$i18n.t('shopWallet.bizPayNo')"
        />
        <!-- <el-table-column
          prop="payEntry"
          label="支付入口"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ ['订单','充值','开通会员'][scope.row.payEntry] }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="payType"
          :label="this.$i18n.t('order.paymentMethod')"
        >
          <template slot-scope="scope">
            <span>
              {{
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
                  $t("order.payPalPayment"),
                ][scope.row.payType]
              }}</span>          </template>
        </el-table-column>
        <el-table-column
          prop="payNo"
          :label="this.$i18n.t('shopWallet.payNumber')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.payNo || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="alipayAmount"
          :label="this.$i18n.t('order.aliPay')"
        >
          <template slot-scope="scope">
            <span>￥{{ scope.row.alipayAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="wechatAmount"
          :label="this.$i18n.t('order.weixinPay')"
        >
          <template slot-scope="scope">
            <span>￥{{ scope.row.wechatAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="balanceAmount"
          :label="this.$i18n.t('publics.balancePay')"
        >
          <template slot-scope="scope">
            <span>￥{{ scope.row.balanceAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="scoreCount"
          :label="this.$i18n.t('user.scorePay')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.scoreCount || 0 }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="payAmount"
          :label="this.$i18n.t('publics.creditPayment')"
        >
          <template slot-scope="scope">
            <span>￥{{ scope.row.payAmount }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="paypalAmount"
          :label="this.$i18n.t('shopWallet.payPal')"
        >
          <template slot-scope="scope">
            <span>￥ {{ scope.row.paypalAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="total"
          :label="this.$i18n.t('shopWallet.totalNum')"
        >
          <template slot-scope="scope">
            <span>￥ {{ scope.row.total }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="payAmount"
          :label="this.$i18n.t('chat.paymentAmount')"
        >
          <template slot-scope="scope">
            <span>￥{{ scope.row.payAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="callbackTime"
          :label="this.$i18n.t('user.payTime')"
          width="160"
        /> -->
      </el-table>
    </div>
    <!-- 收入对账明细end -->

    <!-- 退款对账明细 -->
    <div v-else class="table-box">
      <el-table
        :data="tableData1"
        row-key="id"
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        style="width: 100%"
      >
        <el-table-column
          :label="this.$i18n.t('formData.serialNumber')"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="shopName"
          :label="this.$i18n.t('coupon.shopName')"
        />
        <el-table-column
          prop="payTime"
          :label="this.$i18n.t('user.payTime')"
        />
        <el-table-column
          prop="orderNumber"
          :label="this.$i18n.t('distribIncome.orderNumber')"
        />
        <el-table-column
          prop="bizPayNo"
          :label="this.$i18n.t('shopWallet.bizPayNo')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.bizPayNo || '-' }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="orderPayNo"
          :label="this.$i18n.t('shopWallet.orderPayNo')"
        />
        <el-table-column
          prop="refundSn"
          :label="this.$i18n.t('shopWallet.refundSn')"
        />
        <el-table-column
          prop="refundStatus"
          :label="this.$i18n.t('order.refundStatus')"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{$t("shopWallet.alreadlyRefund")}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="payType"
          :label="this.$i18n.t('order.paymentMethod')"
        >
          <template slot-scope="scope">
            <span>
              {{
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
                  $t("order.payPalPayment"),
                ][scope.row.payType]
              }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="payNo"
          :label="this.$i18n.t('shopWallet.payNumber')"
        >
        </el-table-column>
        <el-table-column
          prop="alipayAmount"
          :label="this.$i18n.t('order.aliPay')"
        >
          <template slot-scope="scope">
            <span>￥{{ scope.row.alipayAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="wechatAmount"
          :label="this.$i18n.t('order.weixinPay')"
        >
          <template slot-scope="scope">
            <span>￥{{ scope.row.wechatAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="balanceAmount"
          :label="this.$i18n.t('publics.balancePay')"
        >
          <template slot-scope="scope">
            <span>￥{{ scope.row.balanceAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="scoreCount"
          :label="this.$i18n.t('user.scorePay')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.scoreCount || 0 }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="payAmount"
          :label="this.$i18n.t('publics.creditPayment')"
        >
          <template slot-scope="scope">
            <span>￥{{ scope.row.payAmount }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="paypalAmount"
          :label="this.$i18n.t('shopWallet.payPal')"
        >
          <template slot-scope="scope">
            <span>￥ {{ scope.row.paypalAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="total"
          :label="this.$i18n.t('shopWallet.totalNum')"
        >
          <template slot-scope="scope">
            <span>￥ {{ scope.row.total }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="payAmount"
          :label="this.$i18n.t('chat.paymentAmount')"
        >
          <template slot-scope="scope">
            <span>￥{{ scope.row.payAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="callbackTime"
          :label="this.$i18n.t('user.payTime')"
          width="160"
        /> -->
        <!-- <el-table-column
          prop="refundAmount"
          :label="this.$i18n.t('order.refundAmount')"
        >
          <template slot-scope="scope">
            <span>￥{{ scope.row.refundAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="callbackTime"
          :label="this.$i18n.t('order.refundTime')"
        /> -->
      </el-table>
    </div>
    <!-- 退款对账明细end -->
    <div class="back">
      <div class="default-btn primary-btn" @click="back">{{$t('shopFeature.edit.back')}}</div>
      <!-- <el-button type="success" plain @click="back">返回</el-button> -->
    </div>
    <!-- 分页条 -->
    <!-- <pagination style="text-align: right" :total="total" :page.sync="params.pageNum" :limit.sync="params.pageSize" @pagination="pagination" /> -->
    <el-pagination
      v-if="total > 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="params.current"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="params.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  // import { getPayInfo, getRefundInfo } from '@/api/funds-management/index'
  // import Pagination from '@/components/Pagination'
  export default {
    // filters: {
    //   amount(value) {
    //     return (value / 100).toFixed(2)
    //   }
    // },
    // components: { Pagination },
    data () {
      return {
        time: '',
        activeName: 'first',
        total: 0,
        ioType: '',
        params: {
          current: 1,
          size: 10,
          startTime: '',
          endTime: '',
          shopName: ''
        },
        payList: [
          {
            name: '银联',
            amount: 0.00,
            percent: 0.00
          },
          {
            name: '微信',
            amount: 0.10,
            percent: 0.10
          },
          {
            name: '支付宝',
            amount: 0.10,
            percent: 0.10
          },
          {
            name: '积分兑换',
            amount: 0.30,
            percent: 0.40
          },
          {
            name: '转账汇款',
            amount: 0.10,
            percent: 0.10
          },
          {
            name: '企业银联',
            amount: 0.10,
            percent: 0.10
          },
          {
            name: '余额',
            amount: 0.10,
            percent: 0.10
          }
        ],
        tableData: [],
        tableData1: [],
        fromData: ''
      }
    },

    mounted () {
      console.log(this.$route)
      this.ioType = Number(this.$route.query.type)
      this.params.startTime = this.$route.query.startTime
      this.params.endTime = this.$route.query.endTime
      this.params.shopId = this.$route.query.shopId
      this.getData()
    },

    methods: {
      handleClick (tab) {
        console.log(tab.name)
      },
      getData () {
        if (this.ioType) {
          this.$http({
            url: this.$http.adornUrl('/platform/accountDetail/pageShopIncomeAccountDetail'),
            method: 'get',
            params: this.params
          }).then(({data}) => {
            this.tableData = data.records
            this.total = data.total
          })
        } else {
          this.$http({
            url: this.$http.adornUrl('/platform/accountDetail/pageShopRefundAccountDetail'),
            method: 'get',
            params: this.params
          }).then(({data}) => {
            console.log(data)
            this.tableData1 = data.records
            this.total = data.total
          })
        }
      },
      handleSizeChange (val) {
        this.params.size = val
        this.getData()
      },
      handleCurrentChange (val) {
        this.params.current = val
        this.getData()
      },
      back () {
        this.$router.back()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .manage-check {
    .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .search {
      background: #F5F5F5;
      padding: 12px 16px 4px;
      margin-bottom: 30px;
      .search-btn {
        margin-left: 10px;
      }
    }
  }
  .shopInfo {
    background: #F5F5F5;
    padding: 15px 30px;
    .total-amount {
      height: 67px;
      display: flex;
      justify-content: flex-start;
      .item {
        width: 127px;
        height: 65px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-right: 60px;
        .pay-name {
          color: #666;
          font-size: 14px;

        }
        .pay-amount {
          color: #46a6ff;
          font-size: 16px;
          margin-left: -5px;
          font-weight: bolder;
        }
        .pay-percent {
          color: rgba(0, 0, 0, 0.4);
          font-size: 14px;
        }
      }
    }
    .message {

      margin-bottom: 20px;
      span {
        font-size: 14px;
        margin-right: 60px;
      }
    }
  }
  .back {
    margin-top: 20px;
  }
</style>
