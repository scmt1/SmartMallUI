<template>
  <!-- 商品信息 -->
  <div class="prodItem-container">
    <span class="title">{{ $t('group.prodInfo') }}</span>
    <el-divider></el-divider>
    <div v-if="isAuth('multishop:takeStockProd:select')" class="default-btn primary-btn" @click="selectSupplierProd()">
      {{ this.$i18n.t('shop.addProd') }}</div>
    <el-tooltip class="item" :disabled="takeStockProdItems.length === 0" effect="dark" :content="$t('takeStock.importErrorTip')" placement="top">
      <div class="default-btn" :class="{'disabled-btn': takeStockProdItems.length > 0}" @click="uploadSku">{{ $t('stock.batchImport') }}</div>
    </el-tooltip>
    <div class="count-desc-text">
      {{$t('takeStock.infoText1')}}{{takeStockProdItems.length}}{{$t('takeStock.infoText2')}}{{totalStock}}{{$t('takeStock.infoText3')}}{{profitCount}}{{$t('takeStock.infoText4')}}{{lossCount}}{{$t('takeStock.infoText5')}}
    </div>
    <div class="prodItem-table">
      <!-- 状态导航选择组件 -->
      <statusSelectTabs :statusArr="statusArr" :defaultKey="statusArr[0].key" @statusChange="statusChange" />
      <el-table
        :data="totalList.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize)"
        header-cell-class-name="table-header"
        row-class-name="table-row">
        <el-table-column :label="$t('group.prodInfo')" fixed="left" align="center" width="320px">
          <template slot-scope="scope">
            <div class="prod-info">
              <img v-if="scope.row.pic"
                   :src="scope.row.pic.indexOf('http')===-1 && scope.row.pic.indexOf('https')=== -1 ? resourcesUrl + scope.row.pic : scope.row.pic"
                   width="60" height="60">
              <img v-else src="../../../../assets/img/def.png" width="60" height="60">
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
          <template slot="header">
            {{ $t('takeStock.profitLossCount') }}
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
            <el-input type="number" size="small" style="maxWidth: 150px"
                      oninput="if(value<0 || value >1000000000)value=0"
                      onkeyup="value=value.replace(/[^\d]/g,'')"
                      @keydown.native="channelInputLimit"
                      v-model.number="scope.row.totalStock"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('publics.remark')" prop="remark" align="left">
          <template slot-scope="scope">
            <el-input size="small" style="maxWidth: 150px" show-word-limit maxlength="20" v-model="scope.row.remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('crud.menu')" fixed="right">
          <template slot-scope="scope">
            <div class="text-btn-con">
              <div class="default-btn text-btn" @click="deleteHandle(scope.row.skuId,totalList.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize))">{{ $t('text.delBtn') }}</div>
            </div>
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
    <!-- 供应商商品选择弹窗-->
    <supplier-prod-select
      v-if="supplierProdSelectVisible"
      ref="supplierProdSelect"
      @refreshSelectSupplier="supplierProdSelectHandle"
    ></supplier-prod-select>
    <takeStockProdUpload v-if="batchImportVisible" ref="takeStockProdUpload" @refreshDataList="refreshDataList"></takeStockProdUpload>
  </div>
</template>

<script>
import SupplierProdSelect from '@/components/supplier-prod-select'
import stockSkuUpload from './stock-sku-upload'
import statusSelectTabs from './status-select-tabs'
import takeStockProdUpload from './take-stock-prod-upload'
export default {
  components: {
    SupplierProdSelect,
    stockSkuUpload,
    statusSelectTabs,
    takeStockProdUpload
  },
  props: {
    takeStockId: {
      default: 0
    }
  },
  data () {
    return {
      that: this,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      retailProdSelectVisible: false,
      takeStockProdItems: [], // 已选择的商品项
      supplierProdSelectVisible: false,
      batchImportVisible: false, // 批量导入商品弹窗是否可见
      verifyFlag: true, // 数据校验标记，true：正确，false：错误
      totalStock: 0, // 实盘库存
      profitCount: 0, // 盘盈
      lossCount: 0, // 盘亏
      profitProdList: [], // 盘盈列表
      lossProdList: [], // 盘亏列表
      equalProdList: [], // 盘平列表
      totalList: [],
      statusArr: [
        { id: 0, key: null, label: this.$i18n.t('stock.all') },
        { id: 1, key: 1, label: this.$i18n.t('takeStock.profit') },
        { id: 2, key: 2, label: this.$i18n.t('takeStock.loss') },
        { id: 3, key: 0, label: this.$i18n.t('takeStock.equal') }
      ], // 状态导航组件参数
      page: {
        currentPage: 1, // 初始页
        pageSize: 10 // 每页数据大小
      },
      tab: {
        key: ''
      }
    }
  },
  computed: {
  },
  watch: {
    takeStockProdItems: {
      deep: true,
      handler (val) {
        this.countChange(val)
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.takeStockId = Number(this.takeStockId)
      if (this.takeStockId) {
        this.getSkuList()
      }
    },
    getSkuList () {
      this.$http({
        url: this.$http.adornUrl('/stock/takeStockProd/list'),
        method: 'get',
        params: this.$http.adornParams(
          {
            takeStockId: this.takeStockId
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
        default: this.totalList = this.takeStockProdItems
          break
      }
      this.page.currentPage = 1
      this.tab.key = item.key
    },
    countChange (newValue) {
      this.profitProdList = []
      this.lossProdList = []
      this.equalProdList = []
      let totalStock = 0
      let profitCount = 0
      let lossCount = 0
      newValue.forEach(item => {
        if (!item.totalStock && item.totalStock !== 0) {
          this.$set(item, 'totalStock', null)
        }
        item.takeStockId = this.takeStockId
        item.changeStock = item.totalStock - item.stocks
        totalStock += item.totalStock
        if (item.stocks > item.totalStock) {
          lossCount += item.stocks - item.totalStock
          this.lossProdList.push(item)
        } else if (item.stocks < item.totalStock) {
          profitCount += item.totalStock - item.stocks
          this.profitProdList.push(item)
        } else if (item.stocks === parseInt(item.totalStock) || (item.stocks === 0 && !item.totalStock)) {
          this.equalProdList.push(item)
        }
      })
      this.$forceUpdate()
      this.totalStock = Number(totalStock)
      this.profitCount = Number(profitCount)
      this.lossCount = Number(lossCount)
    },
    // 选择商品
    selectSupplierProd () {
      const ids = []
      this.takeStockProdItems.forEach(item => {
        ids.push(item.skuId)
      })
      let data = {
        skuIds: ids
      }
      this.supplierProdSelectVisible = true
      this.$nextTick(() => {
        this.$refs.supplierProdSelect.init(data)
      })
    },
    // 商品选择回调
    supplierProdSelectHandle (prodItem) {
      prodItem.forEach(prod => {
        if (!this.takeStockProdItems.find(el => el.skuId === prod.skuId)) {
          this.takeStockProdItems.push(prod)
        }
      })
      this.totalList = this.takeStockProdItems
      this.verifyFlag = this.totalList.length !== 0
    },
    uploadSku () {
      if (this.takeStockProdItems.length > 0) {
        return
      }
      this.batchImportVisible = true
      this.$nextTick(() => {
        this.$refs.takeStockProdUpload.init(this.takeStockId)
      })
    },
    refreshDataList () {
      this.getSkuList()
    },
    /**
     * 校验数据，校验成功返回数据项，不成功返回null
     */
    verifyDataForm () {
      if (this.takeStockProdItems.length === 0) {
        this.verifyFlag = false
        return null
      } else {
        this.verifyFlag = true
        return this.takeStockProdItems
      }
    },
    /**
     * 删除已选择的商品项
     * @param skuId 当前商品项在当前页的位置
     * @param list 当前列表
     */
    deleteHandle (skuId, list) {
      let index = 0
      for (let i = 0; i < this.takeStockProdItems.length; i++) {
        if (this.takeStockProdItems[i].skuId === skuId) {
          index = i
          break
        }
      }
      this.takeStockProdItems.splice(index, 1)
      // 判断当前页码是否超过删除后的页码大小
      if (this.page.currentPage > ((this.takeStockProdItems.length - 1) / this.page.pageSize + 1)) {
        this.page.currentPage = --this.page.currentPage || 1
      }
      this.countChange(this.takeStockProdItems)
      this.statusChange(this.tab)
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
    },
    channelInputLimit (e) {
      const key = e.key
      if (key === '.') {
        e.returnValue = false
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>

.prodItem-container {
  .title {
    color: #333333;
    font-size: 16px;
    font-weight: bold;
  }

  .count-desc-text {
    margin-top: 8px;
    margin-bottom: 8px;
    color: #333333;
    font-size: 14px;
  }

  .error-tips {
    color: #e43130;
    font-size: 14px;
    padding-bottom: 6px;
  }

  .disabled-btn {
    color: #C0C4CC;

    &:hover {
      cursor: not-allowed;
      color: #C0C4CC;
    }
  }

  .prodItem-table {
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

    .prod-info .text .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;

      .prod-info-container {
        display: flex;
        justify-content: space-between;

        .prod-image {
          margin-right: 20px;
          width: 80px;
          height: 80px;
        }

        .prod-name {
          width: 200px;
          height: 100px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          .prod-name-txt {
            font-size: 14px;
            color: #333333;
            word-break: break-all;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
          }

          .prod-no {
            font-size: 14px;
            color: #333333;
          }
        }
      }
    }
  }
}
@media (max-width: 1440px) {
  .el-card__body {
    padding-bottom: 40px !important;
  }
}
</style>
