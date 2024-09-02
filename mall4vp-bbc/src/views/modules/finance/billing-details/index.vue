<template>
    <div class="manage-check">
      <div class="title-con">
        <div class="title">{{$t('settlementDetail.tip1')}}</div>
        <div class="settlement-instructions">
          <el-tooltip class="item" effect="dark" placement="right">
            <div slot="content" class="title-con-pit">
              <!-- <p>{{$t('settlementDetail.tip2')}}</p>
              <p>&nbsp;</p>
              <p>{{$t('settlementDetail.tip3')}}</p>
              <p>- {{$t('settlementDetail.tip4')}}</p>
              <p>- {{$t('settlementDetail.tip5')}}</p>
              <p>- {{$t('settlementDetail.tip6')}}</p>
              <p>- {{$t('settlementDetail.tip7')}}</p>
              <p>- {{$t('settlementDetail.tip8')}}</p>
              <p>- {{$t('settlementDetail.tip9')}}</p>
              <p>- {{$t('settlementDetail.tip10')}}</p>
              <p>- {{$t('settlementDetail.tip11')}}</p>
              <p>- {{$t('settlementDetail.tip12')}}</p>
              <p>- {{$t('settlementDetail.tip13')}}</p>
              <p>- {{$t('settlementDetail.tip14')}}</p>
              <p>- {{$t('settlementDetail.tip15')}}</p>
              <p>- {{$t('settlementDetail.tip16')}}</p>
              <p>- {{$t('settlementDetail.tip17')}}</p>
              <p>- {{$t('settlementDetail.tip18')}}</p> -->
              <!-- <p>- 店铺应收金额：每笔订单店铺应收金额=商品实付金额+退单改价差额+运费+平台优惠券优惠金额+使用积分-平台佣金-分销佣金；</p> -->
              <!-- <p>- {{$t('settlementDetail.tip19')}}</p>
              <p>- {{$t('settlementDetail.tip20')}}</p>
              <p>- {{$t('settlementDetail.tip21')}}</p>
              <p>- {{$t('settlementDetail.tip22')}}</p>
              <p>- {{$t('settlementDetail.tip23')}}</p>
              <p>- {{$t('settlementDetail.tip24')}}</p>
              <p>- {{$t('settlementDetail.tip25')}}</p>
              <p>- {{$t('settlementDetail.tip26')}}</p> -->

              <p>{{$t('settlementDetail.tip2_2')}}</p>
              <p>&nbsp;</p>
              <p>{{$t('settlementDetail.tip2_3')}}</p>
              <p>{{$t('settlementDetail.tip2_4')}}</p>
              <p>{{$t('settlementDetail.tip2_5')}}</p>
              <p>{{$t('settlementDetail.tip2_6')}}</p>
              <p>{{$t('settlementDetail.tip2_7')}}</p>
              <p>{{$t('settlementDetail.tip2_8')}}</p>
              <p>&nbsp;&nbsp;&nbsp;{{$t('settlementDetail.tip2_9')}}</p>
              <p>&nbsp;&nbsp;&nbsp;{{$t('settlementDetail.tip2_10')}}</p>
              <p>{{$t('settlementDetail.tip2_11')}}</p>
              <p>&nbsp;&nbsp;&nbsp;{{$t('settlementDetail.tip2_12')}}</p>
              <p>{{$t('settlementDetail.tip2_13')}}</p>
              <p>&nbsp;&nbsp;&nbsp;{{$t('settlementDetail.tip2_14')}}</p>
              <p>&nbsp;&nbsp;&nbsp;{{$t('settlementDetail.tip2_15')}}</p>
              <p>{{$t('settlementDetail.tip2_16')}}</p>
              <p>{{$t('settlementDetail.tip2_17')}}</p>
              <p>{{$t('settlementDetail.tip2_18')}}</p>
              <p>&nbsp;&nbsp;&nbsp;{{$t('settlementDetail.tip2_19')}}</p>
              <p>{{$t('settlementDetail.tip2_20')}}</p>
              <p>{{$t('settlementDetail.tip2_21')}}</p>
              <p>{{$t('settlementDetail.tip2_22')}}</p>
              <p>{{$t('settlementDetail.tip2_23')}}</p>
              <p>{{$t('settlementDetail.tip2_24')}}</p>
              <p>{{$t('settlementDetail.tip2_25')}}</p>
              <p>{{$t('settlementDetail.tip2_26')}}</p>
              <p>{{$t('settlementDetail.tip2_27')}}</p>
              <p>{{$t('settlementDetail.tip2_28')}}</p>
              <p>{{$t('settlementDetail.tip2_29')}}</p>
              <p>{{$t('settlementDetail.tip2_30')}}</p>
              <p>{{$t('settlementDetail.tip2_31')}}</p>
              <p>&nbsp;&nbsp;&nbsp;{{$t('settlementDetail.tip2_32')}}</p>
              <p>&nbsp;&nbsp;&nbsp;{{$t('settlementDetail.tip2_33')}}</p>
              <!-- <pre>{{$t('settlementDetail.tips')}}</pre> -->
            </div>
            <span >{{$t('settlementDetail.tip27')}}<i class="el-icon-question" /></span>
          </el-tooltip>
        </div>
      </div>
      <!-- <div class="shopInfo">
        <div class="message">
          <span>店铺名称：中山路精品洗车店</span>
          <span>商家编码：S00003</span>
          <span>结算时间段：2021-05-24～2021-05-30</span>
          <div>
            <span>结算单号：S0009265</span>
            <span>结算单生成时间：2021-05-31</span>
          </div>
        </div>
        <div class="total-amount">
          <div v-for="(item,index) in payList" :key="index" class="item">
            <div class="pay-name">{{ item.name }}</div>
            <div class="pay-amount">￥{{ item.amount }}</div>
          </div>
        </div>
      </div> -->
      <div class="main-container">
        <div class="table-con">
          <el-table
            :data="data.tableData"
            row-key="id"
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            header-cell-class-name="table-header"
            row-class-name="table-row-low"
            style="width: 100%"
          >
            <el-table-column
              fixed
              prop="shopName"
              :label="this.$i18n.t('shopProcess.shopName')"
              width="150"
            >
              <template slot-scope="scope">
                <span class="table-cell-text">{{scope.row.shopName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="prodName"
              :label="this.$i18n.t('product.prodName')"
              width="130"
            >
              <template slot-scope="scope">
                <span class="table-cell-text">{{scope.row.prodName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="categoryName"
              :label="this.$i18n.t('publics.category')"
              width="130"
            />

            <el-table-column
              prop="prodTotalAmount"
              :label="this.$i18n.t('settlementDetail.prodTotalAmount')"
              width="130"
            >
              <template slot-scope="scope">
                <span>￥ {{ scope.row.productTotalAmount }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="actualTotal"
              :label="this.$i18n.t('chat.userPaymentAmount')"
              width="130"
            >
              <template slot-scope="scope">
                <span>￥ {{ scope.row.actualTotal }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="multishopReduce"
              :label="this.$i18n.t('settlementDetail.multishopReduce')"
              width="130"
            >
              <template slot-scope="scope">
                <span>￥ {{ scope.row.multishopReduce }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="platformShareReduce"
              :label="this.$i18n.t('settlementDetail.platformShareReduce')"
              width="130"
            >
              <template slot-scope="scope">
                <span>￥ {{ scope.row.platformShareReduce }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="distributionAmount"
              :label="this.$i18n.t('settlementDetail.distributionAmount')"
              width="130"
            >
              <template slot-scope="scope">
                <span>￥ {{ scope.row.distributionAmount }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="useScore"
              :label="this.$i18n.t('settlementDetail.useScore')"
              width="130"
            />
            <el-table-column
              prop="rate"
              :label="this.$i18n.t('settlementDetail.rate')"
              width="130"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.rate }}%</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="platformCommission"
              :label="this.$i18n.t('shopWallet.platformCommission')"
              width="130"
            >
              <template slot-scope="scope">
                <span>￥ {{ scope.row.platformCommission }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="scoreAmount"
              :label="this.$i18n.t('settlementDetail.scoreAmount')"
              width="130"
            >
              <template slot-scope="scope">
                <span>￥ {{ scope.row.scoreAmount }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="memberAmount"
              :label="this.$i18n.t('settlementDetail.memberAmount')"
              width="130"
            >
              <template slot-scope="scope">
                <span>￥ {{ scope.row.memberAmount }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="platformCouponAmount"
              :label="this.$i18n.t('settlementDetail.platformCouponAmount')"
              width="160"
            >
              <template slot-scope="scope">
                <span>￥ {{ scope.row.platformCouponAmount }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="shopCouponAmount"
              :label="this.$i18n.t('settlementDetail.shopCouponAmount')"
              width="160"
            >
              <template slot-scope="scope">
                <span>￥ {{ scope.row.shopCouponAmount }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="discountAmount"
              :label="this.$i18n.t('settlementDetail.discountAmount')"
              width="130"
            >
              <template slot-scope="scope">
                <span>￥ {{ scope.row.discountAmount }}</span>
              </template>
            </el-table-column>

             <el-table-column
              prop="comboAmount"
              :label="this.$i18n.t('settlementDetail.comboAmount')"
              width="130"
            >
              <template slot-scope="scope">
                <span>￥ {{ scope.row.comboAmount }}</span>
              </template>
            </el-table-column>
             <el-table-column
              prop="seckillAmount"
              :label="this.$i18n.t('settlementDetail.seckillAmount')"
              width="130"
            >
              <template slot-scope="scope">
                <span>￥ {{ scope.row.seckillAmount }}</span>
              </template>
            </el-table-column>
             <el-table-column
              prop="groupAmount"
              :label="this.$i18n.t('settlementDetail.groupAmount')"
              width="130"
            >
              <template slot-scope="scope">
                <span>￥ {{ scope.row.groupAmount }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="platformFreeFreightAmount"
              :label="this.$i18n.t('settlementDetail.shopName')"
              width="140"
              align="center"
            >
              <template slot-scope="scope">
                <span>￥ {{ scope.row.platformFreeFreightAmount }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="freeFreightAmount"
              :label="this.$i18n.t('shopProcess.shopName')"
              width="140"
              align="center"
            >
              <template slot-scope="scope">
                <span>￥ {{ scope.row.freeFreightAmount }}</span>
              </template>
            </el-table-column> -->
            <el-table-column
              prop="shopChangeFreeAmount"
              :label="this.$i18n.t('settlementDetail.shopChangeFreeAmount')"
              width="130"
            >
              <template slot-scope="scope">
                <span>￥ {{ scope.row.shopChangeFreeAmount }}</span>
              </template>
            </el-table-column>
            <el-table-column
            prop="platformShopChangeAmount"
            :label="this.$i18n.t('settlementDetail.platformShopChangeAmount')"
            width="140"
            align="center"
          >
            <template slot-scope="scope">
              <span>￥ {{ scope.row.platformShopChangeAmount }}</span>
            </template>
          </el-table-column>
            <el-table-column
              prop="refundAmount"
              :label="this.$i18n.t('settlementDetail.refundAmount')"
              width="130"
            >
              <template slot-scope="scope">
                <span>￥ {{ scope.row.refundAmount }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="refundCount"
              :label="this.$i18n.t('settlementDetail.refundCount')"
              width="130"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.refundCount || 0 }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="message" v-if="data.freightAmount !== 0">
          <span>{{$t('publics.freight')}}：{{ data.freightAmount  }} {{$t('transport.yuan')}}</span>
        </div>
        <div v-if="data.freeFreightAmount !== 0" class="message">
          <span>{{$t('settlementDetail.freeFreightAmount')}}：{{ data.freeFreightAmount > 0 ? '+':'' }}{{ data.freeFreightAmount  }}  {{$t('transport.yuan')}}
            <el-tooltip class="item" effect="dark" :content="this.$i18n.t('settlementDetail.freeFreightAmountTips')" placement="top">
              <span style="font-size:14px;color:#46a6ff;cursor:pointer;"><i class="el-icon-question" /></span>
            </el-tooltip>
          </span>
        </div>
        <div v-if="data.platformFreeFreightAmount !== 0" class="message">
          <span>{{$t('settlementDetail.platformFreeFreightAmount')}}：{{ data.platformFreeFreightAmount  }} {{$t('transport.yuan')}}
            <el-tooltip class="item" effect="dark" :content="this.$i18n.t('settlementDetail.platformFreeFreightAmountTips')" placement="top">
              <span style="font-size:14px;color:#46a6ff;cursor:pointer;"><i class="el-icon-question" /></span>
            </el-tooltip>
          </span>
        </div>
        <div class="back">
          <div class="default-btn" @click="back">{{$t('shopFeature.edit.back')}}</div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      time: '',
      activeName: 'first',
      total: 0,
      orderNumber: this.$route.query.orderNumber,
      path: this.$route.query.path,
      refundSn: this.$route.query.refundSn || '',
      params: {
        pageNum: 1,
        pageSize: 10
      },
      data: {
        freightAmount: 0,
        tableData: []
      }
    }
  },

  mounted () {
    this.getData(this.orderNumber, this.refundSn)
  },

  methods: {
    handleClick (tab) {
      console.log(tab.name)
    },
    // 获取订单详情
    getData (orderNumber, refundSn) {
      this.$http({
        url: this.$http.adornUrl('/platform/order_item/get_order_detail'),
        method: 'get',
        params: {orderNumber, refundSn}
      }).then(({data}) => {
        this.data.freightAmount = data.freightAmount
        this.data.freeFreightAmount = data.freeFreightAmount ? data.freeFreightAmount : 0
        this.data.platformFreeFreightAmount = data.platformFreeFreightAmount ? data.platformFreeFreightAmount : 0
        this.data.tableData = data.orderItemDetailList
      })
    },
    back () {
      // if (Number(this.path) === 0) {
      //   this.$router.push('/finance-walletLog/index?load=1')
      // } else {
      //   this.$router.push('/finance-merchant-balance/index?load=1')
      // }
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
 .manage-check {
   .title-con {
      display: flex;
      justify-content: space-between;
    .title {
      font-size: 16px;
      font-weight: bold;
    }
    .settlement-instructions {
      color: #155bd4;
    }
   }
   .search {
     background: #F5F5F5;
     padding: 12px 16px 4px;
     margin-bottom: 30px;
     .search-btn {
       margin-left: 10px;
     }
   }
  .message {
    margin: 20px 0;
    span {
      font-size: 14px;
      margin-right: 60px;
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
 .table {
   margin-top: 20px;
 }
.title-con-pit>p{
  margin: 1em 0;
}
.title-con-pit{
  max-height:80vh ;
  max-width: 80vw;
  overflow-y: auto;
}
</style>
