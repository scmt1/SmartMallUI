<template>
  <div class="container">
    <span class="title">{{$t('product.basicInformation')}}</span>
    <el-divider></el-divider>
    <div class="basic-container">
      <div class="basic-row">
        <div class="basic-row-item">
          <p class="sub-tit">{{ $t('stock.outStockOrderNo') }}:</p>
          <p class="txt">{{stockBillLogInfo.stockBillNo}}</p>
        </div>
        <div class="basic-row-item">
          <p class="sub-tit">{{ $t('stock.billStatus') }}:</p>
          <p class="txt">{{stockBillLogInfo.status | status}}</p>
        </div>
        <div class="basic-row-item">
          <p class="sub-tit">{{ $t('stock.stockBillType') }}:</p>
          <p class="txt">{{stockBillLogInfo.stockBillType | type}}{{stockBillLogInfo.reason ? '-' + stockBillLogInfo.reason : ''}}</p>
        </div>
      </div>
      <div class="basic-row">
        <div class="basic-row-item">
          <p class="sub-tit">{{ $t('takeStock.maker') }}:</p>
          <p class="txt">{{stockBillLogInfo.employeeMobile}}</p>
        </div>
        <div class="basic-row-item">
          <p class="sub-tit">{{ $t('stock.createOrderTime') }}:</p>
          <p class="txt">{{stockBillLogInfo.createTime}}</p>
        </div>
        <div class="basic-row-item">
          <p class="sub-tit">{{ $t('stock.createOrderRemark') }}:</p>
          <p class="txt">{{stockBillLogInfo.remark}}</p>
        </div>
      </div>
      <div class="basic-row">
        <div class="basic-row-item">
          <p class="sub-tit">{{ $t('stock.sourceOrderNo') }}:</p>
          <p class="txt">{{stockBillLogInfo.sourceOrderNo}}</p>
        </div>
        <div class="basic-row-item">
          <p class="sub-tit">{{ $t('stock.outStockTime') }}:</p>
          <p class="txt">{{stockBillLogInfo.businessTime}}</p>
        </div>
      </div>
    </div>
    <div style="height: 20px"></div>
    <span class="title">{{ $t('stock.appendix') }}</span>
    <el-divider></el-divider>
    <div class="qualifications-container">
      <span class="sub-tit">{{ $t('stock.deliveryCertificate') }}:</span>
      <div v-if="imgs.length">
        <el-image
          v-for="(img,index) in imgs"
          :key="index"
          class="tab-img"
          :src="img"
          :preview-src-list="imgs"
        />
      </div>
      <span v-if="!imgs.length">--</span>
    </div>
    <div style="height: 20px"></div>
    <span class="title">{{ $t('group.prodInfo') }}</span>
    <el-divider></el-divider>
    <div class="prod-container">
      <div class="sub-tit">
        {{ $t('order.total') }}{{stockBillLogItems.length}}{{ $t('stock.prodCountOutTips') }}:{{totalCount}},{{ $t('stock.totalOutAmount2') }}:{{totalAmount}}
      </div>
      <div class="prodItem-table">
        <el-table
          :data="stockBillLogItems.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize)"
          header-cell-class-name="table-header"
          row-class-name="table-row"
        >
          <el-table-column
            :label="this.$i18n.t('group.prodInfo')"
            prop="reason"
            fixed="left"
            align="center"
            width="320px"
          >
            <template slot-scope="scope">
              <div class="prod-info-container">
                <div class="prod-image">
                  <img v-if="scope.row.pic" :src="resourcesUrl + scope.row.pic">
                  <img v-else src="">
                </div>
                <div class="prod-name">
                  <el-tooltip :content="scope.row.prodName" placement="top" effect="light">
                    <div class="prod-name-txt">
                      {{scope.row.prodName}}
                    </div>
                  </el-tooltip>
                  <el-tooltip :content="scope.row.skuName" placement="top" effect="light">
                    <div class="spec">
                      {{scope.row.skuName}}
                    </div>
                  </el-tooltip>
                  <div class="prod-no">
                    {{scope.row.partyCode}}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.unit')"
            prop="type"
            align="center"
          >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{ $t('stock.pieces') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.deliveryCount')"
            prop="type"
            align="center"
          >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.stockCount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.costAmount')"
            prop="type"
            align="center"
          >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.unitPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.costTotalAmount')"
            prop="type"
            align="center"
          >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.totalAmount }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-size="page.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="stockBillLogItems.length"
        ></el-pagination>
      </div>
    </div>
    <div v-if="stockBillLogInfo.status === 2" class="foot-btn">
      <el-button type="primary" @click="editHandle">{{ $t('text.editBtn') }}</el-button>
      <el-button @click="voidedHandle">{{ $t('takeStock.voidInventory') }}</el-button>
    </div>
    <!-- 作废提示对话框 -->
    <el-dialog
      :title="$t('text.tips')"
      :visible.sync="voidedVisibleDialog"
    >
      <div>
        {{ $t('stock.voidInventoryTips') }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="voidedVisibleDialog = false">{{ $t('crud.filter.cancelBtn') }}</el-button>
        <el-button type="primary" @click="confirmVoided">{{ $t('crud.filter.submitBtn') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Big from 'big.js'

let vueApp = null
export default {
  filters: {
    status (val) {
      switch (val) {
        case 0:
          return vueApp.$i18n.t('stock.voided')
        case 1:
          return vueApp.$i18n.t('stock.inOutbound')
        case 2:
          return vueApp.$i18n.t('stock.waitSubmit')
      }
    },
    type (val) {
      switch (val) {
        case 4:return vueApp.$i18n.t('stock.sellOut')
        case 5:return vueApp.$i18n.t('stock.editOutBound')
        case 6:return vueApp.$i18n.t('stock.otherOutbound')
        case 10:return vueApp.$i18n.t('stock.profitStorage')
        case 11:return vueApp.$i18n.t('stock.lossOutBound')
      }
    }
  },
  data () {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      isSubmit: false,
      stockBillLogId: null,
      stockBillLogInfo: {},
      stockBillLogItems: [],
      totalCount: '',
      totalAmount: '',
      imgs: [],
      page: {
        currentPage: 1, // 初始页
        pageSize: 10 // 每页数据大小
      },
      voidedVisibleDialog: false
    }
  },
  beforeCreate () {
    vueApp = this
  },
  created () {
    this.stockBillLogId = this.$route.query.stockBillLogId
    this.init()
  },
  methods: {
    init () {
      this.getStockBillInfo()
      this.getSkuList()
    },
    getStockBillInfo () {
      this.$http({
        url: this.$http.adornUrl('/shop/stockBillLog/info/' + this.stockBillLogId),
        method: 'get',
        params: this.$http.adornParams(
          {
            stockBillLogId: this.stockBillLogId
          }
        )
      }).then(({data}) => {
        this.imgs = data.qualifications ? data.qualifications.split(',') : []
        this.imgs = this.imgs.map(item => {
          return this.resourcesUrl + item
        })
        this.stockBillLogInfo = data
        this.totalAmount = data.totalAmount
      })
    },
    getSkuList () {
      this.$http({
        url: this.$http.adornUrl('/shop/stockBillLogItem/list'),
        method: 'get',
        params: this.$http.adornParams(
          {
            stockBillLogId: this.stockBillLogId
          }
        )
      }).then(({data}) => {
        this.stockBillLogItems = data
        let totalCount = 0
        // let totalAmount = 0
        this.stockBillLogItems.forEach(item => {
          totalCount += parseInt(item.stockCount)
          item.totalAmount = this.bigProductTotalAmount(item.unitPrice, item.stockCount)
          // totalAmount += parseInt(item.totalAmount)
        })
        this.totalCount = totalCount
        // this.totalAmount = totalAmount
      })
    },
    editHandle () {
      this.$router.push({
        path: '/stock-send-add-or-update',
        query: {
          type: 1,
          stockBillLogId: this.stockBillLogId
        }
      })
    },
    confirmVoided () {
      if (this.isSubmit) {
        return
      }
      this.isSubmit = true
      this.$http({
        url: this.$http.adornUrl('/shop/stockBillLog/voided'),
        method: 'put',
        params: this.$http.adornParams(
          {stockBillLogId: this.stockBillLogId}
        )
      }).then(() => {
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1000
        })
        this.voidedVisibleDialog = false
        this.isSubmit = false
        this.getStockBillInfo()
      }).catch(() => {
        this.voidedVisibleDialog = false
        this.isSubmit = false
      })
    },
    voidedHandle () {
      this.voidedVisibleDialog = true
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
    },
    // 精度运算-乘法
    bigProductTotalAmount: function (a, b) {
      return new Big(a).times(b)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  padding-bottom: 80px;
  .title {
    color: #333333;
    font-size: 14px;
    font-weight: bold;
  }
  .basic-container {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    height: 150px;
    .basic-row {
      display: flex;
      flex-direction: column;
      margin-right: 10px;
      .basic-row-item {
        width: 400px;
        height: 50px;
        display: flex;
        flex-direction: row;
        .sub-tit {
          min-width: 80px;
          font-size: 14px;
          color: #333333;
        }
        .txt {
          font-size: 14px;
          color: #333333;
          word-break: break-word;
        }
      }
    }
  }
  .qualifications-container {
    display: flex;
    flex-direction: row;
    .sub-tit {
      font-size: 14px;
      color: #333333;
      margin-right: 10px;
    }
    .tab-img {
      width: 60px;
      height: 60px;
      margin-right: 5px;
      cursor: pointer;
    }
  }
  .prod-container {
    .sub-tit {
      font-size: 14px;
      color: #333333;
      margin-bottom: 16px;
    }
    .prodItem-table {
      .prod-info-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .prod-image {
          margin-right: 20px;
          width: 80px;
          height: 80px;
        }
        .prod-name {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .prod-name-txt {
            font-size: 14px;
            color: #333333;
            box-sizing: border-box;
            display: -webkit-box;
            word-break: break-word !important;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2 !important;
            overflow: hidden;
          }
          .spec {
            font-size: 14px;
            color: #333333;
            word-break: break-all;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
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
  /* 脚部按钮 */
  .foot-btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 15px 0;
    display: flex;
    justify-content: center;
    background: #fff;
    // border-top: 1px solid #ddd;
    box-shadow: 0 -2px 3px rgba(139, 139, 139, 0.1);
    z-index: 1999;
  }
}
</style>
