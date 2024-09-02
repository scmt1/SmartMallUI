<template>
  <div class="new-supplier-mod">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">{{ $t('takeStock.inventoryDetail') }}</div>
    </div>
    <div class="info-title">{{ $t('shopProcess.basicInfo') }}</div>
    <el-divider/>
    <el-form :model="dataForm" ref="dataForm" class="form-box" label-width="auto">
      <el-form-item :label="$t('takeStock.InventoryNo')" prop="takeStockNo">
        <span class="table-cell-text line-clamp-one">{{dataForm.takeStockNo}}</span>
      </el-form-item>
      <el-form-item :label="$t('takeStock.InventoryStatus')" prop="billStatus">
        <span class="table-cell-text line-clamp-one" v-if="dataForm.billStatus === 0">{{ $t('takeStock.voided') }}</span>
        <span class="table-cell-text line-clamp-one" v-if="dataForm.billStatus === 1">{{ $t('takeStock.taking') }}</span>
        <span class="table-cell-text line-clamp-one" v-if="dataForm.billStatus === 2">{{ $t('takeStock.complete') }}</span>
      </el-form-item>
      <el-form-item :label="$t('takeStock.createTime')" prop="createTime">
        <span class="table-cell-text line-clamp-one">{{dataForm.createTime}}</span>
      </el-form-item>
      <el-form-item :label="$t('takeStock.regionName')" prop="stockRegionName">
        <span class="table-cell-text line-clamp-one">{{dataForm.stockRegionName}}</span>
      </el-form-item>
      <el-form-item :label="$t('publics.remark')" prop="remark">
        <span class="table-cell-text line-clamp-one">{{dataForm.remark}}</span>
      </el-form-item>
    </el-form>
    <span class="info-title">{{ this.$i18n.t('group.prodInfo') }}</span>
    <el-divider/>
    <!--sku列表-->
    <div class="prod-container">
      <div class="sub-tit">
        {{$t('takeStock.infoText1')}}{{takeStockProdItems.length}}{{$t('takeStock.infoText2')}}{{totalStock}}{{$t('takeStock.infoText3')}}{{profitNum}}{{$t('takeStock.infoText4')}}{{lossNum}}{{$t('takeStock.infoText5')}}
      </div>
      <div class="prodItem-table">
        <!-- 状态导航选择组件 -->
        <statusSelectTabs :statusArr="statusArr" :defaultKey="statusArr[0].key" @statusChange="statusChange">
          <div v-if="isAuth('multishop:takeStockProd:export')" slot="export" @click="getExportExcel">{{ $t('takeStock.exportProdDetail') }}</div>
        </statusSelectTabs>
        <el-table
          :data="totalList.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize)"
          header-cell-class-name="table-header"
          row-class-name="table-row">
          <el-table-column :label="this.$i18n.t('group.prodInfo')" prop="reason" fixed="left" align="center" width="320px">
            <template slot-scope="scope">
              <div class="prod-info">
                <img v-if="scope.row.pic"
                     :src="scope.row.pic.indexOf('http')===-1 && scope.row.pic.indexOf('https')=== -1 ? resourcesUrl + scope.row.pic : scope.row.pic"
                     width="60" height="60">
                <img v-else src="../../../assets/img/def.png" width="60" height="60">
                <div class="text">
                  <span class="name">{{ scope.row.prodName }}</span>
                  <span class="name">{{ scope.row.skuName }}</span>
                  <span class="name">{{ scope.row.partyCode }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="bookStock" :label="$t('takeStock.bookStock')" align="center">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.stocks}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="stock_count" align="center">
            <template slot="header">{{ $t('takeStock.profitLossCount') }}
              <el-tooltip class="item" effect="dark" :content="$t('takeStock.profitLossTip')" placement="top">
                <i class="el-icon-info"/>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.changeStock > 0 ? '+'+scope.row.changeStock : scope.row.changeStock}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('takeStock.totalStock')" prop="totalStock" align="left">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.totalStock}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('publics.remark')" prop="remark" align="left">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.remark}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-size="page.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="totalList.length"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import statusSelectTabs from './components/status-select-tabs'
export default {
  components: {
    statusSelectTabs
  },
  data () {
    return {
      page: {
        currentPage: 1, // 初始页
        pageSize: 10 // 每页数据大小
      },
      prodsSelectVisible: false,
      uploadVisible: false,
      supplierProdSelectVisible: false,
      isEdit: false,
      lang: localStorage.getItem('lang'),
      dataForm: {
        takeStockId: null,
        takeStockNo: null,
        billStatus: null,
        createTime: null,
        stockRegionName: null,
        remark: null,
        shopId: null,
        takeStockProdItems: []
      },
      takeStockProdItems: [],
      totalStock: 0, // 实盘库存
      profitCount: 0, // 盘盈
      profitNum: 0, // 盘盈件数
      lossCount: 0, // 盘亏
      lossNum: 0, // 盘亏件数
      equalCount: 0, // 盘平
      exceptionCount: 0, // 异常
      profitProdList: [], // 盘盈列表
      lossProdList: [], // 盘亏列表
      equalProdList: [], // 盘平列表
      exceptionProdList: [], // 异常列表
      totalList: [],
      statusArr: [
        { id: 0, key: 3, label: this.$i18n.t('stock.all') },
        { id: 1, key: 1, label: '' },
        { id: 2, key: 2, label: '' },
        { id: 3, key: 0, label: '' },
        { id: 4, key: -1, label: '' }
      ], // 状态导航组件参数
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataListLoading: false,
      value: ''
    }
  },
  mounted () {
    if (this.$route.query.takeStockId) {
      this.dataForm.takeStockId = this.$route.query.takeStockId
    }
    if (this.$route.query.billStatus) {
      this.dataForm.billStatus = this.$route.query.billStatus
    }
    this.getDataList()
    this.getSkuList()
  },
  methods: {
    getDataList () {
      this.$http({
        url: this.$http.adornUrl('/stock/takeStock/info/' + this.dataForm.takeStockId),
        method: 'get',
        params: this.$http.adornParams({
          takeStockId: this.dataForm.takeStockId
        })
      }).then(({data}) => {
        this.dataForm = data
      })
    },
    getSkuList () {
      this.$http({
        url: this.$http.adornUrl('/stock/takeStockProd/list'),
        method: 'get',
        params: this.$http.adornParams(
          {
            takeStockId: this.dataForm.takeStockId
          }
        )
      }).then(({data}) => {
        this.takeStockProdItems = data
        this.statusChange(this.statusArr[0])
        this.countChange(this.takeStockProdItems)
      })
    },
    /**
     * 导航选择状态
     */
    statusChange (item) {
      this.totalList = []
      switch (item.key) {
        case 1: this.totalList = this.profitProdList
          break
        case 2: this.totalList = this.lossProdList
          break
        case 0: this.totalList = this.equalProdList
          break
        case -1: this.totalList = this.exceptionProdList
          break
        default: this.totalList = this.takeStockProdItems
          break
      }
      this.page.currentPage = 1
    },
    countChange (newValue) {
      this.profitProdList = []
      this.lossProdList = []
      this.equalProdList = []
      this.exceptionProdList = []
      let totalStock = 0
      let profitCount = 0
      let profitNum = 0
      let lossCount = 0
      let lossNum = 0
      let equalCount = 0
      let exceptionCount = 0
      newValue.forEach(item => {
        if (!item.totalStock && item.totalStock !== 0) {
          this.$set(item, 'totalStock', null)
        }
        item.takeStockId = this.dataForm.takeStockId
        item.changeStock = item.totalStock - item.stocks
        totalStock += item.totalStock
        // ioType 0盘平 1盘盈 2盘亏 -1异常
        switch (item.ioType) {
          case 2 : lossNum += item.stocks - item.totalStock
            lossCount++
            this.lossProdList.push(item)
            break
          case 1 : profitNum += item.totalStock - item.stocks
            profitCount++
            this.profitProdList.push(item)
            break
          case 0 : equalCount++
            this.equalProdList.push(item)
            break
          case -1 : exceptionCount++
            this.exceptionProdList.push(item)
            break
        }
      })
      this.totalStock = totalStock
      this.profitCount = profitCount
      this.profitNum = profitNum
      this.lossCount = lossCount
      this.lossNum = lossNum
      this.equalCount = equalCount
      this.exceptionCount = exceptionCount
      this.statusArr.forEach(el => {
        if (el.key === 1) { el.label = `${this.$i18n.t('takeStock.profit')}(${this.profitCount})` }
        if (el.key === 2) { el.label = `${this.$i18n.t('takeStock.loss')}(${this.lossCount})` }
        if (el.key === 0) { el.label = `${this.$i18n.t('takeStock.equal')}(${this.equalCount})` }
        if (el.key === -1) { el.label = `${this.$i18n.t('takeStock.exception')}(${this.exceptionCount})` }
      })
      this.$forceUpdate()
    },
    getWaitingExcel () {
      this.getDataList(this.page)
    },
    getExportExcel () {
      this.$confirm(`${this.$i18n.t('shop.exportProdTip_store')}`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/stock/takeStockProd/exportTakeStockProd'),
          method: 'get',
          params: this.$http.adornParams({
            takeStockId: this.dataForm.takeStockId
          }),
          responseType: 'blob' // 解决文件下载乱码问题
        }).then(({ data }) => {
          var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          const fileName = this.$i18n.t('takeStock.prodDetailFileName')
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
        })
      })
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
    }
  }
}
</script>

<style scoped>
div >>>.is-success .el-input-number__decrease,
div >>>.is-success .el-input-number__increase,
div >>>.is-error .el-input-number__decrease,
div >>>.is-error .el-input-number__increase {
  right: 1px !important;
}
div >>>.el-date-editor .el-range-separator {
  width: 8%;
}
.form-box {
  margin-left: 10px;
}
.new-supplier-mod .footer {
  height: 50px;
  position: fixed;
  bottom: 0;
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 -3px 5px #eee;
  background: #FFF;
}
.info-title {
  color: #333333;
  font-size: 16px;
  font-weight: bold;
}
.prod-info {
  display: flex;
  align-items: center;
}
.prod-info .text {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: 10px;
  width: 170px;
}
.prod-info .text .name{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  text-align: left;
}
.prod-container .sub-tit{
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
  color: #323233;
}
</style>
