<template>
  <div class="mod-home">
    <!-- <p class="strong">严正声明：</p>
    <p class="content">亚米商城专业版并非一个开源软件，作者保留全部的权利。 擅自窃用，即属严重侵权行为，与盗窃无异。产生的一切任何后果责任由侵权者自负。
    擅自窃用，必将追究法律责任！！！</p>-->

    <!-- 数据 -->

    <!-- 实时概况板块 -->
    <div class="realtime-situation">
      <!-- 商品概况列表 -->
      <div class="item-list">
        <el-form :model="form" class="form-inline">
          <el-form-item :label="$t('dataAnalysis.saleIndicators')">
            <el-checkbox-group v-model="form.saleIndex">
              <el-checkbox :label="$t('dataAnalysis.exposureTimes')" name="1"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.exposurePeoples')" name="2"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.numberOfVisitors')" name="3"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.pageviews')" name="4"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.addCartNumbers')" name="5"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.carNumbers')" name="6"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.paidNumbers')" name="7"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.unitConversionRate')" name="8"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.goodsPaid')" name="9"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.goodsPaidAmount')" name="10"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="$t('dataAnalysis.serviceIndicators')">
            <!-- :style="selectNum >= 8 ? 'pointer-events: none;' : ''" 设置不能点击 -->
            <el-checkbox-group v-model="form.serviceIndex">
              <el-checkbox :label="$t('dataAnalysis.refundOrdersCounts')" name="1"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.applyingForRefund')" name="2"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.refundedCounts')" name="3"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.refundedSuccessCounts')" name="4"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.successfulRefundAmount')" name="5"></el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.refundRate')" name="6"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <span class="form-inline-select">{{$t('dataAnalysis.selected')}} {{selectNum}}/{{$t('dataAnalysis.eightItems')}}</span>
          <!-- <el-button @click="submitTest">测试</el-button> -->
        </el-form>
        <span></span>
      </div>
      <!-- /商品概况列表 -->
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        saleIndex: [], // 销售指标
        serviceIndex: [] // 服务指标
      },
      selectNum: 0, // 选择指标的数量
      prodName: null
    }
  },
  mounted () {
    // this.getProdEffect()
  },
  updated () {
    // this.getpayInfo()
  },
  components: {
  },
  watch: {
    // 统计与判断多选框的选择数量
    // 但这里没能实现默认与最少得有一个选择，以及判断选择的上限
    'form.saleIndex' () {
      this.selectNum = this.form.serviceIndex.length + this.form.saleIndex.length
      this.prodData.form = this.form
      this.getProdEffect(this.page)
      // console.log(this.form.saleIndex)
    },
    'form.serviceIndex' () {
      this.selectNum = this.form.saleIndex.length + this.form.serviceIndex.length
      this.prodData.form = this.form
      this.getProdEffect(this.page)
    }
  },
  methods: {
    /**
     * 选择框改变
     */
    changeDataForm () {
      this.prodData.dataForm = this.dataForm
      this.getProdEffect(this.page)
    }
  }
}
</script>

<style lang="scss">
.mod-home {
  .item-list {
    margin: -10px 0;
  }
  .form-inline-select {
    margin-top: 10px;
    color: #9c9898;
    display: block;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .el-checkbox-group {
    margin-top: 10px;
  }
  .el-form-item__content {
    line-height: 20px;
  }
}
</style>
