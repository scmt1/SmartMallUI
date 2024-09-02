<template>
  <div>
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <!-- 表单项 -->
        <div class="input-row">
          <el-form-item :label="$t('takeStock.productFilter')+':'">
            <el-select v-model="searchForm.prodKeyType" @change="prodKeyTypeChange">
              <el-option
                v-for="node in prodKeyArr"
                :key="node.key"
                :label="node.label"
                :value="node.key">
              </el-option>
            </el-select>
            <el-input type="text" v-model="searchForm.prodKey" :placeholder="prodKeyArr[searchForm.prodKeyType - 1].inputTips"/>
          </el-form-item>
          <el-form-item :label="$t('takeStock.InventoryNo')+':'">
            <el-input type="text" v-model="searchForm.takeStockNo" :placeholder="$t('takeStock.InventoryNo')"/>
          </el-form-item>
          <el-form-item :label="$t('takeStock.InventoryStatus')+':'">
            <el-select v-model="searchForm.billStatus">
              <el-option :label="$t('takeStock.voided')" value="0"></el-option>
              <el-option :label="$t('takeStock.taking')" value="1"></el-option>
              <el-option :label="$t('takeStock.complete')" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('takeStock.maker')+':'">
            <el-select v-model="searchForm.maker">
              <el-option
                v-for="node in employeeList"
                :key="node.employeeId"
                :label="node.mobile"
                :value="node.employeeId">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="input-row">
          <el-form-item :label="$t('takeStock.createTime')+':'">
            <el-date-picker size="small" v-model="createDateRange" type="datetimerange"
              :range-separator="$t('time.tip')" value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="$t('time.start')"
              :end-placeholder="$t('time.end')"
              @change="createTimeChange"></el-date-picker>&nbsp;
            <div class="select-time-btn" :class="{ 'is-active': createTimeActive === 1 }" @click="setDateRange(1)">
              {{ $t("time.t") }}</div>
            <div class="select-time-btn" :class="{ 'is-active': createTimeActive === 2 }" @click="setDateRange(2)">
              {{ $t("time.y") }}</div>
            <div class="select-time-btn" :class="{ 'is-active': createTimeActive === 3 }" @click="setDateRange(3)">
              {{ $t("time.n") }}</div>
            <div class="select-time-btn" :class="{ 'is-active': createTimeActive === 4 }" @click="setDateRange(4)">
              {{ $t("temp.m") }}</div>
          </el-form-item>
          <el-form-item>
            <div class="text-btn-con">
              <div class="default-btn primary-btn" @click="searchChange">{{ $t("crud.searchBtn") }}</div>
              <div v-if="isAuth('multishop:takeStock:export')" class="default-btn primary-btn" @click="confirmExport">{{ $t("order.ExportingFiles") }}</div>
              <div class="default-btn" @click="resetForm()">{{ $t("shop.resetMap") }}</div>
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
      employeeList: [], // 员工列表
      prodKeyArr: [
        { key: 1, label: this.$i18n.t('product.prodName'), inputTips: this.$i18n.t('takeStock.inputName') },
        { key: 2, label: this.$i18n.t('product.commodityCode'), inputTips: this.$i18n.t('takeStock.inputPartyCode') }
      ], // 商品筛选类型
      createDateRange: [] // 制单时间范围
    }
  },
  props: {
    searchForm: {
      default: {
        takeStockNo: '', // 盘点单号
        billStatus: '', // 盘点状态 0已作废 1盘点中 2已完成
        maker: '', // 制单人id
        prodKeyType: 1, // 1：商品名称 2：商品编码
        prodKey: '', // 搜索商品关键词(0:商品名称 1：商品编码)
        startTime: '', // 制单起始时间
        endTime: '', // 制单结束时间
        prodName: '',
        partyCode: ''
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.searchForm.type = this.type
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
    confirmExport () {
      // 发送导出事件
      this.$emit('confirmExport')
    },
    resetForm () {
      this.searchForm.takeStockNo = '' // 盘点单号
      this.searchForm.billStatus = '' // 盘点状态 0已作废 1盘点中 2已完成
      this.searchForm.maker = '' // 制单人ID
      this.searchForm.prodKeyType = 1 // 1：商品名称 2：商品编码
      this.searchForm.prodKey = '' // 搜索商品关键词(0:商品名称 1：商品编码)
      this.searchForm.startTime = '' // 盘点起始时间
      this.searchForm.endTime = '' // 盘点结束时间
      this.createDateRange = [] // 盘点时间
    },
    prodKeyTypeChange () {
      this.searchForm.prodKey = ''
    },
    createTimeChange () {
      this.searchForm.startTime = this.createDateRange[0]
      this.searchForm.endTime = this.createDateRange[1]
    },
    /**
     * 根据选项设置时间
     * 1:今天 2:昨天 3: 近七天 4:近30天 5:近60天
     */
    setDateRange (val) {
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
      let startTime = moment()
        .add(startDay, 'days')
        .startOf('days')
        .format('LL')
      // 结束时间
      let endTime = moment().add(endDay, 'days').endOf('days').format('LL')
      this.createDateRange = [startTime, endTime]
      this.searchForm.startTime = startTime
      this.searchForm.endTime = endTime
      this.createTimeActive = val
    }
  }
}
</script>
<style lang="scss" scoped>
.select-time-btn {
  margin: 0 12px;
  display: inline-block;
  color: #aaaaaa;
  font-size: 14px;
  cursor: pointer;
}
.el-form-item {
  .is-active {
    color: #155bd4;
  }
}
</style>
