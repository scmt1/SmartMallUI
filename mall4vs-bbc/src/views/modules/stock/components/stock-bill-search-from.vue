<template>
  <div>
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <!-- 表单项 -->
        <div class="input-row">
          <el-form-item :label="$t('takeStock.productFilter')">
            <el-select v-model="searchForm.prodKeyType" @change="prodKeyTypeChange">
              <el-option
                v-for="node in prodKeyArr"
                :key="node.key"
                :label="node.label"
                :value="node.key"
              ></el-option>
            </el-select>
            <el-input type="text" v-model="searchForm.prodKey" :placeholder="prodKeyArr[searchForm.prodKeyType - 1].inputTips"/>
          </el-form-item>
        </div>
        <div class="input-row">
          <el-form-item :label="$t('stock.createOrderTime')">
            <el-date-picker
              size="small"
              v-model="createDateRange"
              type="datetimerange"
              :range-separator="this.$i18n.t('time.tip')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="this.$i18n.t('time.start')"
              :end-placeholder="this.$i18n.t('time.end')"
              @change="createTimeChange"
            ></el-date-picker
            >&nbsp;
            <div class="select-time-btn" :class="{ 'is-active': createTimeActive === 1 }" @click="setDateRange(1, 'createTime')">{{
                $t("time.t")
              }}</div>
            <div class="select-time-btn" :class="{ 'is-active': createTimeActive === 2 }" @click="setDateRange(2, 'createTime')">{{
                $t("time.y")
              }}</div>
            <div class="select-time-btn" :class="{ 'is-active': createTimeActive === 3 }" @click="setDateRange(3, 'createTime')">{{
                $t("time.n")
              }}</div>
            <div class="select-time-btn" :class="{ 'is-active': createTimeActive === 4 }" @click="setDateRange(4, 'createTime')">{{
                $t("temp.m")
              }}</div>
          </el-form-item>
        </div>
        <div class="input-row">
          <el-form-item :label="type === 1 ? $t('stock.outStockTime') : $t('stock.inStockTime')">
            <el-date-picker
              size="small"
              v-model="businessDateRange"
              type="datetimerange"
              :range-separator="this.$i18n.t('time.tip')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="this.$i18n.t('time.start')"
              :end-placeholder="this.$i18n.t('time.end')"
              @change="businessTimeChange"
            ></el-date-picker
            >&nbsp;
            <div class="select-time-btn" :class="{ 'is-active': businessTimeActive === 1 }" @click="setDateRange(1, 'businessTime')">{{
                $t("time.t")
              }}</div>
            <div class="select-time-btn" :class="{ 'is-active': businessTimeActive === 2 }" @click="setDateRange(2, 'businessTime')">{{
                $t("time.y")
              }}</div>
            <div class="select-time-btn" :class="{ 'is-active': businessTimeActive === 3 }" @click="setDateRange(3, 'businessTime')">{{
                $t("time.n")
              }}</div>
            <div class="select-time-btn" :class="{ 'is-active': businessTimeActive === 4 }" @click="setDateRange(4, 'businessTime')">{{
                $t("temp.m")
              }}</div>
          </el-form-item>
        </div>
        <div class="input-row">
          <el-form-item :label="type === 1 ? $t('stock.outStockOrderNo') : $t('stock.inStockOrderNo')">
            <el-input type="text" v-model="searchForm.stockBillNo" :placeholder="type === 1 ? $t('stock.outStockOrderNo') : $t('stock.inStockOrderNo')"/>
          </el-form-item>
          <el-form-item :label="$t('stock.sourceOrderNo')">
            <el-input type="text" v-model="searchForm.sourceOrderNo" :placeholder="$t('stock.sourceOrderNo')"/>
          </el-form-item>
        </div>
        <div class="input-row">
          <el-form-item :label="$t('stock.stockBillType')">
            <el-select v-model="searchForm.stockBillType" filterable>
              <el-option
                v-for="node in businessDetailType"
                :key="node.stockBillType"
                :label="node.label"
                :value="node.stockBillType"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('takeStock.maker')">
            <el-select v-model="searchForm.employeeId" filterable>
              <el-option
                v-for="node in employeeList"
                :key="node.employeeId"
                :label="node.mobile"
                :value="node.employeeId"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="input-row">
          <el-form-item >
            <div class="text-btn-con">
              <div class="default-btn primary-btn" @click="searchChange">{{ $t('crud.searchBtn') }}</div>
              <div v-if="(isAuth('multishop:receiveStock:export') && type === 2) || (isAuth('multishop:sendStock:export') && type === 1)" class="default-btn primary-btn" @click="exportStockLog">{{ $t('order.ExportingFiles') }}</div>
              <div class="default-btn" @click="resetForm()">{{ $t('shop.resetMap') }}</div>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      createTimeActive: 0,
      businessTimeActive: 0,
      stockBillTypeInStrArr: [
        {
          stockBillType: 1, label: this.$i18n.t('stock.purchaseInStock')
        },
        {
          stockBillType: 2, label: this.$i18n.t('stock.returnToStorage')
        },
        {
          stockBillType: 3, label: this.$i18n.t('stock.otherEntries')
        },
        {
          stockBillType: 7, label: this.$i18n.t('stock.inventoryInitialization')
        },
        {
          stockBillType: 8, label: this.$i18n.t('stock.orderCancelled')
        },
        {
          stockBillType: 9, label: this.$i18n.t('stock.editStorage')
        },
        {
          stockBillType: 10, label: this.$i18n.t('stock.profitStorage')
        }
      ],
      stockBillTypeOutStrArr: [
        {
          stockBillType: 4, label: this.$i18n.t('stock.sellOut')
        },
        {
          stockBillType: 5, label: this.$i18n.t('stock.editOutBound')
        },
        {
          stockBillType: 6, label: this.$i18n.t('stock.otherOutbound')
        },
        {
          stockBillType: 11, label: this.$i18n.t('stock.lossOutBound')
        }
      ],
      employeeList: [], // 员工列表
      prodKeyArr: [
        { key: 1, label: this.$i18n.t('product.prodName'), inputTips: this.$i18n.t('takeStock.inputName') },
        { key: 2, label: this.$i18n.t('product.commodityCode'), inputTips: this.$i18n.t('takeStock.inputPartyCode') }
      ], // 商品筛选类型
      businessDetailType: [], // 单据类型
      createDateRange: [], // 制单时间范围
      businessDateRange: [] // 入库时间范围
    }
  },
  props: {
    searchForm: {
      default: {
        prodKeyType: 1, // 1：商品名称 2：商品编码
        prodKey: '', // 搜索商品关键词
        stockBillNo: '', // 单据编号
        sourceOrderNo: '', // 关联单号
        stockBillType: '', // 单据类型
        employeeId: '', // 制单员工id
        createStartTime: '', // 制单起始时间
        createEndTime: '', // 制单结束时间
        businessStartTime: '', // 出入库起始时间
        businessEndTime: '', // 出入库结束时间
        type: 0 // 1 出库 2 入库
      },
      type: Object
    },
    type: {
      default: 0,
      type: Number
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.searchForm.type = this.type
      this.businessDetailType = this.type === 1 ? this.stockBillTypeOutStrArr : this.stockBillTypeInStrArr
      // 获取员工列表
      this.getEmployeeList()
    },
    getEmployeeList () {
      this.$http({
        url: this.$http.adornUrl('/sys/shopEmployee/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.employeeList = data
      })
    },
    searchChange () {
      // 发送搜索事件
      this.$emit('searchChange')
    },
    exportStockLog () {
      // 发送导出事件
      this.$emit('exportStockLog')
    },
    resetForm () {
      this.searchForm.prodKeyType = 1
      this.searchForm.prodKey = ''
      this.searchForm.stockBillNo = null
      this.searchForm.sourceOrderNo = ''
      this.searchForm.stockBillType = ''
      this.searchForm.employeeId = ''
      this.searchForm.createStartTime = ''
      this.searchForm.createEndTime = ''
      this.searchForm.businessStartTime = ''
      this.searchForm.businessEndTime = ''
      this.createTimeActive = 0
      this.businessTimeActive = 0

      this.createDateRange = []
      this.businessDateRange = []
    },
    prodKeyTypeChange () {
      this.searchForm.prodKey = ''
    },
    createTimeChange () {
      if (!this.createDateRange || this.createDateRange.length === 0) {
        this.searchForm.createStartTime = null
        this.searchForm.createEndTime = null
      } else {
        this.searchForm.createStartTime = this.createDateRange[0]
        this.searchForm.createEndTime = this.createDateRange[1]
      }
    },
    businessTimeChange () {
      if (!this.businessDateRange || this.businessDateRange.length === 0) {
        this.searchForm.businessStartTime = null
        this.searchForm.businessEndTime = null
      } else {
        this.searchForm.businessStartTime = this.businessDateRange[0]
        this.searchForm.businessEndTime = this.businessDateRange[1]
      }
    },
    /**
     * 根据选项设置时间
     * 1:今天 2:昨天 3: 近七天 4:近30天 5:近60天
     */
    setDateRange (val, type) {
      let startDay = null
      let endDay = null
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
      let startTime = moment().add(startDay, 'days').startOf('days').format('LL')
      // 结束时间
      let endTime = moment().add(endDay, 'days').endOf('days').format('LL')
      if (type === 'createTime') {
        this.createDateRange = [startTime, endTime]
        this.searchForm.createStartTime = startTime
        this.searchForm.createEndTime = endTime
        this.createTimeActive = val
      } else if (type === 'businessTime') {
        this.businessDateRange = [startTime, endTime]
        this.searchForm.businessStartTime = startTime
        this.searchForm.businessEndTime = endTime
        this.businessTimeActive = val
      }
    }
  }
}
</script>

<style lang="scss">
.select-time-btn {
  margin: 0 12px;
  display: inline-block;
  color: #AAAAAA;
  font-size: 14px;
  cursor:pointer;
}
.el-form-item {
  .is-active {
    color: #155BD4;
  }
}
</style>
