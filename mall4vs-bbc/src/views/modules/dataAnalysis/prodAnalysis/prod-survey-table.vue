<template>
  <!-- 商品概况表格 -->
  <div class="item-list">
    <!-- 商品概况表格 -->
    <div class="ranking-right">
      <table class="table" style="width: 100%;">
        <!-- 商品概况行 -->
        <tr>
          <td>
            <span style="font-size: 14px; font-weight:bold;color: black; margin-left:20px;">{{$t("dataAnaly.commodityOverview")}}</span>
          </td>
          <td>
            <span class="ranking-text">{{this.$i18n.t('dataAnaly.numberOfNewProducts')}}</span>
            <el-popover placement="top" width="200" trigger="hover" :content="this.$i18n.t('dataAnaly.addProdDescribe')">
              <i class="el-icon-question ranking-text" slot="reference"></i>
            </el-popover>
            <br />
            <span style="font-size: 14px; font-weight:bold;color: black;">{{prodData.data.newProd ? prodData.data.newProd : 0}}</span>
            <br />
            <span
              :class="['font-set',prodData.dateValue === 1 ? 'hidden':'']"
            >{{[' -',' -',this.$i18n.t('dataAnaly.days7Before'),this.$i18n.t('dataAnaly.days30Before'),this.$i18n.t('dataAnaly.fromThePreviousDay'),this.$i18n.t('dataAnaly.monthBefore')][prodData.dateValue]}}</span>
            <img 
              src="~@/assets/img/downArrow.png"
              v-if="prodData.rate.newProdRate < 0 && prodData.dateValue !== 1" 
              style="margin-bottom: 2px" 
              width="8px" 
              height="10px" alt="">
            <img 
              src="~@/assets/img/upArrow.png" 
              v-if="prodData.rate.newProdRate > 0 && prodData.dateValue !== 1" 
              style="margin-bottom: 2px" 
              width="8px" 
              height="10px" alt="">
            <span
              class="font-set"
              :class="[prodData.rate.newProdRate > 0 ? 'font-green' : 'font-red']"
              v-if="prodData.rate.newProdRate !== 0 && prodData.dateValue !== 1"
            >{{(prodData.rate.newProdRate * 100).toFixed(2) | ratio}}</span>
            <span
              class="font-set font-gray"
              v-if="prodData.rate.newProdRate === 0 && prodData.dateValue !== 1"
            >- 0%</span>
          </td>
          <td>
            <span class="ranking-text">{{this.$i18n.t('dataAnaly.numberOfProductsVisited')}}</span>
            <el-popover
              placement="top"
              width="200"
              trigger="hover"
              :content="this.$i18n.t('dataAnaly.prodTip2')"
            >
              <i class="el-icon-question ranking-text" slot="reference"></i>
            </el-popover>
            <br />
            <span
              style="font-size: 14px; font-weight:bold;color: black;"
            >{{prodData.data.visitedProd ? prodData.data.visitedProd : 0}}</span>
            <br />
            <span
              :class="['font-set',prodData.dateValue === 1 ? 'hidden':'']"
            >{{[' -',' -',this.$i18n.t('dataAnaly.days7Before'),this.$i18n.t('dataAnaly.days30Before'),this.$i18n.t('dataAnaly.fromThePreviousDay'),this.$i18n.t('dataAnaly.monthBefore')][prodData.dateValue]}}</span>
            <!-- <span
              class="pointerUpT el-icon-top"
              v-if="prodData.rate.visitedProdRate > 0 && prodData.dateValue !== 1"
            ></span>
            <span
              class="pointerBuT el-icon-bottom"
              v-if="prodData.rate.visitedProdRate < 0 && prodData.dateValue !== 1"
            ></span> -->
            <img 
              src="~@/assets/img/downArrow.png"
              v-if="prodData.rate.visitedProdRate < 0 && prodData.dateValue !== 1" 
              style="margin-bottom: 2px" 
              width="8px" 
              height="10px" alt="">
            <img 
              src="~@/assets/img/upArrow.png" 
              v-if="prodData.rate.visitedProdRate > 0 && prodData.dateValue !== 1" 
              style="margin-bottom: 2px" 
              width="8px" 
              height="10px" alt="">
            <span
              class="font-set"
              :class="[prodData.rate.visitedProdRate > 0 ? 'font-green' : 'font-red']"
              v-if="prodData.rate.visitedProdRate !== 0 && prodData.dateValue !== 1"
            >{{((prodData.rate.visitedProdRate * 100).toFixed(2)) | ratio}}</span>
            <span
              class="font-set font-gray"
              v-if="prodData.rate.visitedProdRate === 0 && prodData.dateValue !== 1"
            >- 0%</span>
          </td>
          <td>
            <span class="ranking-text">{{this.$i18n.t('dataAnaly.numberOfProductsForSale')}}</span>
            <el-popover placement="top" width="200" trigger="hover" :content="this.$i18n.t('dataAnaly.timeTip0')">
              <i class="el-icon-question ranking-text" slot="reference"></i>
            </el-popover>
            <br />
            <span
              style="font-size: 14px; font-weight:bold;color: black;"
            >{{prodData.data.dynamicSale ? prodData.data.dynamicSale : 0}}</span>
            <br />
            <span
              :class="['font-set',prodData.dateValue === 1 ? 'hidden':'']"
            >{{[' -',' -',this.$i18n.t('dataAnaly.days7Before'),this.$i18n.t('dataAnaly.days30Before'),this.$i18n.t('dataAnaly.fromThePreviousDay'),this.$i18n.t('dataAnaly.monthBefore')][prodData.dateValue]}}</span>
            <!-- <span
              class="pointerUpT el-icon-top"
              v-if="prodData.rate.dynamicSaleRate > 0 && prodData.dateValue !== 1"
            ></span>
            <span
              class="pointerBuT el-icon-bottom"
              v-if="prodData.rate.dynamicSaleRate < 0 && prodData.dateValue !== 1"
            ></span> -->
            <img 
              src="~@/assets/img/downArrow.png"
              v-if="prodData.rate.dynamicSaleRate < 0 && prodData.dateValue !== 1" 
              style="margin-bottom: 2px" 
              width="8px" 
              height="10px" alt="">
            <img 
              src="~@/assets/img/upArrow.png" 
              v-if="prodData.rate.dynamicSaleRate > 0 && prodData.dateValue !== 1" 
              style="margin-bottom: 2px" 
              width="8px" 
              height="10px" alt="">
            <span
              class="font-set"
              :class="[prodData.rate.dynamicSaleRate > 0 ? 'font-green' : 'font-red']"
              v-if="prodData.rate.dynamicSaleRate !== 0 && prodData.dateValue !== 1"
            >{{(prodData.rate.dynamicSaleRate * 100).toFixed(2) | ratio}}</span>
            <span
              class="font-set font-gray"
              v-if="prodData.rate.dynamicSaleRate === 0 && prodData.dateValue !== 1"
            >- 0%</span>
          </td>
        </tr>
        <!-- /商品概况行 -->
        <!-- 商品流量行 -->
        <tr>
          <td>
            <span style="font-size: 14px; font-weight:bold;color: black; margin-left:20px;">{{$t("dataAnaly.commodityFlow")}}</span>
          </td>
          <td>
            <span class="ranking-text">{{this.$i18n.t('dataAnaly.shareVisits')}}</span>
            <el-popover
              placement="top"
              width="200"
              trigger="hover"
              :content="this.$i18n.t('dataAnaly.timeTip1')"
            >
              <i class="el-icon-question ranking-text" slot="reference"></i>
            </el-popover>
            <br />
            <span style="font-size: 14px; font-weight:bold;color: black;">{{prodData.data.shareVisit ? prodData.data.shareVisit : 0}}</span>
            <br />
            <span
              :class="['font-set',prodData.dateValue === 1 ? 'hidden':'']"
            >{{[' -',' -',this.$i18n.t('dataAnaly.days7Before'),this.$i18n.t('dataAnaly.days30Before'),this.$i18n.t('dataAnaly.fromThePreviousDay'),this.$i18n.t('dataAnaly.monthBefore')][prodData.dateValue]}}</span>
            <!-- <span
              class="pointerUpT el-icon-top"
              v-if="prodData.rate.exposeRate > 0 && prodData.dateValue !== 1"
            ></span>
            <span
              class="pointerBuT el-icon-bottom"
              v-if="prodData.rate.exposeRate < 0 && prodData.dateValue !== 1"
            ></span> -->
            <img 
              src="~@/assets/img/downArrow.png"
              v-if="prodData.rate.shareVisitRate < 0 && prodData.dateValue !== 1" 
              style="margin-bottom: 2px" 
              width="8px" 
              height="10px" alt="">
            <img 
              src="~@/assets/img/upArrow.png" 
              v-if="prodData.rate.shareVisitRate > 0 && prodData.dateValue !== 1" 
              style="margin-bottom: 2px" 
              width="8px" 
              height="10px" alt="">
            <span
              class="font-set"
              :class="[prodData.rate.shareVisitRate > 0 ? 'font-green' : 'font-red']"
              v-if="prodData.rate.shareVisitRate !== 0 && prodData.dateValue !== 1"
            >{{(prodData.rate.shareVisitRate * 100).toFixed(2) | ratio}}</span>
            <span
              class="font-set font-gray"
              v-if="prodData.rate.shareVisitRate === 0 && prodData.dateValue !== 1"
            >- 0%</span>
          </td>
          <td>
            <span class="ranking-text">{{this.$i18n.t('dataAnaly.productViews')}}</span>
            <el-popover
              placement="top"
              width="200"
              trigger="hover"
              :content="this.$i18n.t('dataAnaly.timeTip2')"
            >
              <i class="el-icon-question ranking-text" slot="reference"></i>
            </el-popover>
            <br />
            <span style="font-size: 14px; font-weight:bold;color: black;">{{prodData.data.browse ? prodData.data.browse : 0}}</span>
            <br />
            <span
              :class="['font-set',prodData.dateValue === 1 ? 'hidden':'']"
            >{{[' -',' -',this.$i18n.t('dataAnaly.days7Before'),this.$i18n.t('dataAnaly.days30Before'),this.$i18n.t('dataAnaly.fromThePreviousDay'),this.$i18n.t('dataAnaly.monthBefore')][prodData.dateValue]}}</span>
            <!-- <span
              class="pointerUpT el-icon-top"
              v-if="prodData.rate.browseRate > 0 && prodData.dateValue !== 1"
            ></span>
            <span
              class="pointerBuT el-icon-bottom"
              v-if="prodData.rate.browseRate < 0 && prodData.dateValue !== 1"
            ></span> -->
            <img 
              src="~@/assets/img/downArrow.png"
              v-if="prodData.rate.browseRate < 0 && prodData.dateValue !== 1" 
              style="margin-bottom: 2px" 
              width="8px" 
              height="10px" alt="">
            <img 
              src="~@/assets/img/upArrow.png" 
              v-if="prodData.rate.browseRate > 0 && prodData.dateValue !== 1" 
              style="margin-bottom: 2px" 
              width="8px" 
              height="10px" alt="">
            <span
              class="font-set"
              :class="[prodData.rate.browseRate > 0 ? 'font-green' : 'font-red']"
              v-if="prodData.rate.browseRate !== 0 && prodData.dateValue !== 1"
            >{{(prodData.rate.browseRate * 100).toFixed(2) | ratio}}</span>
            <span
              class="font-set font-gray"
              v-if="prodData.rate.browseRate === 0 && prodData.dateValue !== 1"
            >- 0%</span>
          </td>
          <td>
            <span class="ranking-text">{{this.$i18n.t('dataAnaly.commodityVisitors')}}</span>
            <el-popover
              placement="top"
              width="200"
              trigger="hover"
              :content="this.$i18n.t('dataAnaly.timeTip3')"
            >
              <i class="el-icon-question ranking-text" slot="reference"></i>
            </el-popover>
            <br />
            <span style="font-size: 14px; font-weight:bold;color: black;">{{prodData.data.visitor ? prodData.data.visitor : 0}}</span>
            <br />
            <span
              :class="['font-set',prodData.dateValue === 1 ? 'hidden':'']"
            >{{[' -',' -',this.$i18n.t('dataAnaly.days7Before'),this.$i18n.t('dataAnaly.days30Before'),this.$i18n.t('dataAnaly.fromThePreviousDay'),this.$i18n.t('dataAnaly.monthBefore')][prodData.dateValue]}}</span>
            <!-- <span
              class="pointerUpT el-icon-top"
              v-if="prodData.rate.visitorRate > 0 && prodData.dateValue !== 1"
            ></span>
            <span
              class="pointerBuT el-icon-bottom"
              v-if="prodData.rate.visitorRate < 0 && prodData.dateValue !== 1"
            ></span> -->
            <img 
              src="~@/assets/img/downArrow.png"
              v-if="prodData.rate.visitorRate < 0 && prodData.dateValue !== 1" 
              style="margin-bottom: 2px" 
              width="8px" 
              height="10px" alt="">
            <img 
              src="~@/assets/img/upArrow.png" 
              v-if="prodData.rate.visitorRate > 0 && prodData.dateValue !== 1" 
              style="margin-bottom: 2px" 
              width="8px" 
              height="10px" alt="">
            <span
              class="font-set"
              :class="[prodData.rate.visitorRate > 0 ? 'font-green' : 'font-red']"
              v-if="prodData.rate.visitorRate !== 0 && prodData.dateValue !== 1"
            >{{(prodData.rate.visitorRate * 100).toFixed(2) | ratio}}</span>
            <span
              class="font-set font-gray"
              v-if="prodData.rate.visitorRate === 0 && prodData.dateValue !== 1"
            >- 0%</span>
          </td>
        </tr>
        <!-- /商品流量行 -->
        <!-- 商品转换行 -->
        <tr>
          <td>
            <span style="font-size: 14px; font-weight:bold;color: black; margin-left:20px;">{{$t("dataAnaly.commodityConversion")}}</span>
          </td>
          <td>
            <span class="ranking-text">{{this.$i18n.t('dataAnaly.numberOfCases')}}</span>
            <el-popover placement="top" width="200" trigger="hover" :content="this.$i18n.t('dataAnaly.timeTip4')">
              <i class="el-icon-question ranking-text" slot="reference"></i>
            </el-popover>
            <br />
            <span style="font-size: 14px; font-weight:bold;color: black;">{{prodData.data.addCart ? prodData.data.addCart : 0}}</span>
            <br />
            <span
              :class="['font-set',prodData.dateValue === 1 ? 'hidden':'']"
            >{{[' -',' -',this.$i18n.t('dataAnaly.days7Before'),this.$i18n.t('dataAnaly.days30Before'),this.$i18n.t('dataAnaly.fromThePreviousDay'),this.$i18n.t('dataAnaly.monthBefore')][prodData.dateValue]}}</span>
            <!-- <span
              class="pointerUpT el-icon-top"
              v-if="prodData.rate.addCartRate > 0 && prodData.dateValue !== 1"
            ></span>
            <span
              class="pointerBuT el-icon-bottom"
              v-if="prodData.rate.addCartRate < 0 && prodData.dateValue !== 1"
            ></span> -->
            <img 
              src="~@/assets/img/downArrow.png"
              v-if="prodData.rate.addCartRate < 0 && prodData.dateValue !== 1" 
              style="margin-bottom: 2px" 
              width="8px" 
              height="10px" alt="">
            <img 
              src="~@/assets/img/upArrow.png" 
              v-if="prodData.rate.addCartRate > 0 && prodData.dateValue !== 1" 
              style="margin-bottom: 2px" 
              width="8px" 
              height="10px" alt="">
            <span
              class="font-set"
              :class="[prodData.rate.addCartRate > 0 ? 'font-green' : 'font-red']"
              v-if="prodData.rate.addCartRate !== 0 && prodData.dateValue !== 1"
            >{{(prodData.rate.addCartRate * 100).toFixed(2) | ratio}}</span>
            <span
              class="font-set font-gray"
              v-if="prodData.rate.addCartRate === 0 && prodData.dateValue !== 1"
            >- 0%</span>
          </td>
          <td>
            <span class="ranking-text">{{this.$i18n.t('dataAnaly.orderNumber')}}</span>
            <el-popover
              placement="top"
              width="200"
              trigger="hover"
              :content="this.$i18n.t('dataAnaly.timeTip5')"
            >
              <i class="el-icon-question ranking-text" slot="reference"></i>
            </el-popover>
            <br />
            <span style="font-size: 14px; font-weight:bold;color: black;">{{prodData.data.orderNum ? prodData.data.orderNum : 0}}</span>
            <br />
            <span
              :class="['font-set',prodData.dateValue === 1 ? 'hidden':'']"
            >{{[' -',' -',this.$i18n.t('dataAnaly.days7Before'),this.$i18n.t('dataAnaly.days30Before'),this.$i18n.t('dataAnaly.fromThePreviousDay'),this.$i18n.t('dataAnaly.monthBefore')][prodData.dateValue]}}</span>
            <!-- <span
              class="pointerUpT el-icon-top"
              v-if="prodData.rate.orderNumRate > 0 && prodData.dateValue !== 1"
            ></span>
            <span
              class="pointerBuT el-icon-bottom"
              v-if="prodData.rate.orderNumRate < 0 && prodData.dateValue !== 1"
            ></span> -->
            <img 
              src="~@/assets/img/downArrow.png"
              v-if="prodData.rate.orderNumRate < 0 && prodData.dateValue !== 1" 
              style="margin-bottom: 2px" 
              width="8px" 
              height="10px" alt="">
            <img 
              src="~@/assets/img/upArrow.png" 
              v-if="prodData.rate.orderNumRate > 0 && prodData.dateValue !== 1" 
              style="margin-bottom: 2px" 
              width="8px" 
              height="10px" alt="">
            <span
              class="font-set"
              :class="[prodData.rate.orderNumRate > 0 ? 'font-green' : 'font-red']"
              v-if="prodData.rate.orderNumRate !== 0 && prodData.dateValue !== 1"
            >{{(prodData.rate.orderNumRate * 100).toFixed(2) | ratio}}</span>
            <span
              class="font-set font-gray"
              v-if="prodData.rate.orderNumRate === 0 && prodData.dateValue !== 1"
            >- 0%</span>
          </td>
          <td>
            <span class="ranking-text">{{this.$i18n.t('dataAnaly.numberOfPayment')}}</span>
            <el-popover
              placement="top"
              width="200"
              trigger="hover"
              :content="this.$i18n.t('dataAnaly.timeTip6')"
            >
              <i class="el-icon-question ranking-text" slot="reference"></i>
            </el-popover>
            <br />
            <span style="font-size: 14px; font-weight:bold;color: black;">{{prodData.data.payNum ? prodData.data.payNum : 0}}</span>
            <br />
            <span
              :class="['font-set',prodData.dateValue === 1 ? 'hidden':'']"
            >{{[' -',' -',this.$i18n.t('dataAnaly.days7Before'),this.$i18n.t('dataAnaly.days30Before'),this.$i18n.t('dataAnaly.fromThePreviousDay'),this.$i18n.t('dataAnaly.monthBefore')][prodData.dateValue]}}</span>
            <!-- <span
              class="pointerUpT el-icon-top"
              v-if="prodData.rate.payNumRate > 0 && prodData.dateValue !== 1"
            ></span>
            <span
              class="pointerBuT el-icon-bottom"
              v-if="prodData.rate.payNumRate < 0 && prodData.dateValue !== 1"
            ></span> -->
            <img 
              src="~@/assets/img/downArrow.png"
              v-if="prodData.rate.payNumRate < 0 && prodData.dateValue !== 1" 
              style="margin-bottom: 2px" 
              width="8px" 
              height="10px" alt="">
            <img 
              src="~@/assets/img/upArrow.png" 
              v-if="prodData.rate.payNumRate > 0 && prodData.dateValue !== 1" 
              style="margin-bottom: 2px" 
              width="8px" 
              height="10px" alt="">
            <span
              class="font-set"
              :class="[prodData.rate.payNumRate > 0 ? 'font-green' : 'font-red']"
              v-if="prodData.rate.payNumRate !== 0 && prodData.dateValue !== 1"
            >{{(prodData.rate.payNumRate * 100).toFixed(2) | ratio}}</span>
            <span
              class="font-set font-gray"
              v-if="prodData.rate.payNumRate === 0 && prodData.dateValue !== 1"
            >- 0%</span>
          </td>
        </tr>
        <!-- /商品转换行 -->
      </table>
    </div>
    <!-- /商品概况表格 -->
  </div>
</template>

<script>
export default {
  props: {
    prodData: {
      type: Object,
      default: null
    }
  },
  filters: {
    ratio (value) {
      value = isNaN(value) ? 0 : value
      if (value < 0) {
        return value * -1 + '%'
      }
      return value + '%'
    }
  },
  data () {
    return {
      data: {
        newProd: 0, // 新增商品数
        visitedProd: 0, // 被访问商品数
        dynamicSale: 0, // 动销商品数
        expose: 0, // 商品曝光数
        browse: 0, // 商品浏览量
        visitor: 0, // 商品访客数
        addCart: 0, // 加购件数
        orderNum: 0, // 下单件数
        payNum: 0 // 支付件数
      } // 商品整体概况数据
    }
  },
  mounted () {
  },
  methods: {
    getChange () {
    }
  },
  watch: {
    prodData: {
      handler (newValue, oldValue) {
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.font-set {
  color: darkgrey;
  font-size: 12px;
  margin-right: 10px;
}
.pointerUpT {
  // border-width: 0 4px 5px 4px;
  // border-color: #fff #fff #ff0000 #fff;
  // border-style: solid;
  // height: 0;
  // width: 0;
  color: #ff0000;
}
.pointerBuT {
  color: greenyellow;
}
.hidden {
  visibility: hidden; // 不显示内容，但是需要占位
}
.table {
  border-collapse: collapse;
}
.table tr {
  margin: 5px 0;
  border-bottom: 1px whitesmoke solid; // 每一行表格的结束的分割线
}
.table tr td {
  padding-top: 5px;
  padding-bottom: 5px;
  text-align: left;
  line-height: 2em;
}
.table tr td span {
  margin-top: 0.5em;
}
.ranking-text {
  font-size: 12px;
  font-weight: 400;
  color: #666666;
}
.font-green {
  color: #3CC480;
}
.font-gray {
  color: darkgrey;
}
.font-red {
  color: #FF4141;
}
</style>