<template>
  <div class="table-con">
    <el-table
      :data="tableData"
      style="width: 100%"
      header-cell-class-name="table-header"
      row-class-name="table-row-low"
      v-if="sumData.length"
    >
      <el-table-column prop="pageName" :label="pageType === '1'?$t('dataAnalysis.visitPage'):$t('product.prodName')" fixed="left" width="300"></el-table-column>
      <el-table-column prop="visis" :label="$t('dataAnalysis.pageviews')" v-if="isVisible1">
        <template slot="header" slot-scope="scope">
          {{$t('dataAnalysis.pageviews')}}
          <sortButton :index="0" :type="1" :isSort="isSort[0]" @changeSort="changeSort" />
        </template>
      </el-table-column>
      <el-table-column prop="visitUser" :label="$t('dataAnalysis.numberOfVisitors')" v-if="isVisible2">
        <template slot="header" slot-scope="scope">
          {{$t('dataAnalysis.numberOfVisitors')}}
          <sortButton :index="1" :type="2" :isSort="isSort[1]" @changeSort="changeSort" />
        </template>
      </el-table-column>
      <el-table-column prop="click" :label="$t('dataAnalysis.clicks')" v-if="isVisible3" ></el-table-column>
      <el-table-column prop="clickUser" :label="$t('dataAnalysis.clicksVisitors')" v-if="isVisible4">
        <template slot="header" slot-scope="scope">
          {{$t('dataAnalysis.clicksVisitors')}}
          <sortButton :index="3" :type="4" :isSort="isSort[3]" @changeSort="changeSort" />
        </template>
      </el-table-column>
      <el-table-column prop="clickRate" :label="$t('dataAnalysis.clicksRatio')" v-if="isVisible5" ></el-table-column>
      <!-- <el-table-column prop="loseRate" :label="$t('dataAnalysis.zzzzzzz')" v-if="isVisible6" ></el-table-column> -->
      <el-table-column prop="averageStopTime" :label="$t('dataAnalysis.stayTime')" v-if="isVisible7" >
        <!-- <template slot="header" slot-scope="scope">
          {{$t('dataAnalysis.stayTime')}}
          <sortButton :index="5" :type="4" :isSort="isSort[5]" @changeSort="changeSort" />
        </template> -->
      </el-table-column>
      <el-table-column prop="shareVisit" :label="$t('dataAnalysis.shareTimes')" v-if="isVisible8" >
        <template slot="header" slot-scope="scope">
          {{$t('dataAnalysis.shareTimes')}}
          <sortButton :index="6" :type="5" :isSort="isSort[6]" @changeSort="changeSort" />
        </template>
      </el-table-column>
      <el-table-column prop="shareVisitUser" :label="$t('dataAnalysis.sharePeopleTimes')" v-if="isVisible9" >
        <template slot="header" slot-scope="scope">
          {{$t('dataAnalysis.sharePeopleTimes')}}
          <sortButton :index="7" :type="6" :isSort="isSort[7]" @changeSort="changeSort" />
        </template>
      </el-table-column>
      <el-table-column prop="placeOrderAmount" :label="$t('dataAnalysis.gTOrderAmount')" v-if="isVisible10" >
        <template slot="header" slot-scope="scope">
          {{$t('dataAnalysis.gTOrderAmount')}}
          <sortButton :index="8" :type="7" :isSort="isSort[8]" @changeSort="changeSort" />
        </template>
      </el-table-column>
      <el-table-column prop="placeOrderUser" :label="$t('dataAnalysis.gTNumber')" v-if="isVisible11" >
        <template slot="header" slot-scope="scope">
          {{$t('dataAnalysis.gTNumber')}}
          <sortButton :index="9" :type="8" :isSort="isSort[9]" @changeSort="changeSort" />
        </template>
      </el-table-column>
      <el-table-column prop="visitToPlaceOrderRate" :label="$t('dataAnalysis.bAOC')" v-if="isVisible12" ></el-table-column>
      <el-table-column prop="payAmount" :label="$t('dataAnalysis.gtPA')" v-if="isVisible13" >
        <template slot="header" slot-scope="scope">
          {{$t('dataAnalysis.gtPA')}}
          <sortButton :index="11" :type="9" :isSort="isSort[11]" @changeSort="changeSort" />
        </template>
      </el-table-column>
      <el-table-column prop="payUser" :label="$t('dataAnalysis.gPayNumber')" v-if="isVisible14" >
        <template slot="header" slot-scope="scope">
          {{$t('dataAnalysis.gPayNumber')}}
          <sortButton :index="12" :type="10" :isSort="isSort[12]" @changeSort="changeSort" />
        </template>
      </el-table-column>
      <el-table-column prop="visitToPayRate" :label="$t('dataAnalysis.gVToP')" v-if="isVisible15" ></el-table-column>
    </el-table>
    <div class="empty" v-else>
      {{ $t("dataAnalysis.pleaseSelectIndicator") }}
    </div>
  </div>
</template>

<script>
import sortButton from './sort-button'

export default {
  props: {
    prodData: {
      type: Object,
      default: null
    },
    pageType: {
      type: String,
      default: 1
    }
  },
  components: {
    sortButton
  },
  watch: {
    prodData: {
      handler (newValue, oldValue) {
        // console.log('11111111111111')
        // console.log(newValue)
        this.tableData = newValue.data
        this.sumData = newValue.sumData
        console.log('--------------', newValue)
        this.changVisibles()
      },
      deep: true
    }
  },
  data () {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      trendVisible: false, // 单个商品趋势弹窗
      tableData: this.prodData.data,
      sumData: this.prodData.sumData,
      params: this.prodData.params,
      dateArr: [564, 324, 234, 123], // 趋势图时间数组
      seriesDataArr: [], // 趋势图数据
      isVisible1: false,
      isVisible2: false,
      isVisible3: false,
      isVisible4: false,
      isVisible5: false,
      isVisible6: false,
      isVisible7: false,
      isVisible8: false,
      isVisible9: false,
      isVisible10: false,
      isVisible11: false,
      isVisible12: false,
      isVisible13: false,
      isVisible14: false,
      isVisible15: false,

      isSort: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    }
  },
  methods: {
    handleClick (row) {
      this.trendVisible = true
      // console.log(row)
      this.singleProdTrendData(row.prodId)
    },
    judgeStrArrIncludeOtherString (str) {
      var strArr = this.sumData
      return strArr.includes(str)
    },
    /**
     * 控制表格列显隐
     */
    changVisibles () {
      this.isVisible1 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.pageviews'))
      this.isVisible2 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.numberOfVisitors'))
      this.isVisible3 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.clicks'))
      this.isVisible4 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.clicksVisitors'))
      this.isVisible5 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.clicksRatio'))
      // this.isVisible6 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.gTOrderAmount'))
      this.isVisible7 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.stayTime'))
      this.isVisible8 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.shareTimes'))
      this.isVisible9 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.sharePeopleTimes'))
      this.isVisible10 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.gTOrderAmount'))
      this.isVisible11 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.gTNumber'))
      this.isVisible12 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.bAOC'))
      this.isVisible13 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.gtPA'))
      this.isVisible14 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.gPayNumber'))
      this.isVisible15 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.gVToP'))
    },
    /**
     * 初始化一个obj
     */
    initObj (name) {
      let obj = {}
      obj.name = name
      obj.type = 'line'
      obj.stack = this.$i18n.t('home.totals')
      obj.smooth = true
      obj.data = []
      return obj
    },
    // 为表格头行添加样式
    getRowClass ({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background:#ebeaef'
      }
    },

    changeSort(sort, num, type) {
      const val = this.isSort[num] !== sort ? sort : 0
      this.isSort = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      this.$set(this.isSort, num, val)
      this.$emit('sortData', sort, type)
    }
  }
}
</script>
<style scoped>
.table-con {
  margin-top: 20px;
  border: 1px solid #eee;
  border-bottom: none;
}
.prod-image {
  display: flex;
  align-items: center;
}
.prod-image .name {
  margin-left: 10px;
  line-height: 20px;
  color: darkblue;
}
.prod-price {
  color: red;
}
.empty {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #eee;
}
</style>
