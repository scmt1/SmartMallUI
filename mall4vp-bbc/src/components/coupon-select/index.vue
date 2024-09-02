<template>
  <el-dialog
    :title="$t('user.selectCoupons')"
    top="5vh"
    :before-close="close"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :append-to-body="visible"
  >
    <div class="prods-select-body">
      <el-table
        ref="couponTable"
        :data="dataList"
         header-cell-class-name="table-header"
        row-class-name="table-row-low"
        v-loading="dataListLoading"
        :row-key="getRowKeys"
        @selection-change="selectChangeHandle"
        style="width: 100%;"
        height="600"
      >
        <el-table-column v-if="isSingle" width="50">
          <template slot-scope="scope">
            <div>
              <el-radio
                :label="scope.row.couponId"
                v-model="singleSelectCouponId"
                @change.native="getSelectProdRow(scope.row)"
              >&nbsp;</el-radio>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!isSingle"
          type="selection"
           :reserve-selection="true"
          width="50"
        ></el-table-column>
        <el-table-column prop="couponName" :label="$t('marketing.couponName')">
          <template slot-scope="scope">
            <div class="table-cell-text">
              {{scope.row.couponName}}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="subTitle" :label="$t('user.couponDscription')">
          <template slot-scope="scope">
            <div class="table-cell-text">
              {{scope.row.subTitle}}
            </div>
          </template>
        </el-table-column> -->
        <el-table-column prop="couponType" :label="$t('coupon.couponType')"></el-table-column>
        <el-table-column prop="limitNum" :label="$t('user.couponUpperLimit')"></el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="pagination"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <span slot="footer">
      <div class="default-btn" @click="close">{{$t("coupon.cancel")}}</div>
      <div class="default-btn primary-btn" @click="submitProds()">{{$t("coupon.confirm")}}</div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        product: ''
      },
      singleSelectCouponId: 0,
      allData: [],
      selectCoupons: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      nowSelectCoupons: []
    }
  },
  props: {
    isSingle: {
      default: false,
      type: Boolean
    },
    // 获取方式 null:默认（客户领取+平台发放） 0=客户领取 1=平台发放
    getWay: {
      default: null,
      type: Number
    },
    dataUrl: {
      default: '/platform/coupon/list',
      type: String
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    close () {
      this.dataList.forEach(row => {
        this.$refs.couponTable.toggleRowSelection(row, false)
      })
      this.visible = false
    },

    // 获取数据列表
    init (selectCoupons) {
      this.selectCoupons = selectCoupons
      this.visible = true
      this.dataListLoading = true
      this.selectCoupons = selectCoupons
      if (this.selectCoupons) {
        this.selectCoupons.forEach(row => {
          this.dataListSelections.push(row)
        })
      }
      this.nowSelectCoupons = JSON.parse(JSON.stringify(this.selectCoupons))
      this.getDataList()
    },
    getDataList () {
      this.$http({
        url: this.$http.adornUrl(this.dataUrl),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: this.pageIndex,
              size: this.pageSize
            },
            {
              prodName: this.dataForm.prodName,
              getWay: this.getWay
            }
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.dataList.forEach(item => {
          // 平台投放 / 用户领取
          // item.getWay = item.getWay === 1 ? this.$t('coupon.platformDistribution') : this.$t('coupon.userClaim')
          item.couponType = item.couponType === 1 ? this.$t('coupon.cashCoupon') : (item.couponType === 2 ? this.$t('coupon.discountVoucher') : (item.couponType === 3 ? this.$t('coupon.coinCertificate') : ''))
        })
        this.totalPage = data.total
        this.dataListLoading = false
        if (this.selectCoupons.length) {
          this.$nextTick(() => {
            this.selectCoupons.forEach(row => {
              let index = this.dataList.findIndex((couponItem) => couponItem.couponId === row.couponId)
              if (index >= 0) {
                this.$refs.couponTable.toggleRowSelection(this.dataList[index], true)
              }
            })
          })
        }
        // if (this.nowSelectCoupons.length) {
        //   this.$nextTick(() => {
        //     this.nowSelectCoupons.forEach(row => {
        //       let index = this.dataList.findIndex((couponItem) => couponItem.couponId === row.couponId)
        //       this.$refs.couponTable.toggleRowSelection(this.dataList[index])
        //     })
        //   })
        // }
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 单选商品事件
    getSelectProdRow (row) {
      this.dataListSelections = [row]
    },
    // 多选点击事件
    selectChangeHandle (selection) {
      this.dataListSelections = selection
    },
    // 记录选中状态
    getRowKeys (row) {
      console.log(row.couponId, '2222')
      return row.couponId
    },
    // 确定事件
    submitProds () {
      // 商品单选的情况
      if (this.isSingle) {
        this.dataListSelections.length && this.$emit('refreshSelectCouponList', this.dataListSelections[0])
        this.dataListSelections = []
        this.visible = false
        return
      }
      // 多选
      let coupons = []
      // console.log('this.dataListSelections', this.dataListSelections, this.dataListSelections.length < 1)
      if (this.dataListSelections.length < 1) {
        this.$emit('refreshSelectCouponList', [])
      } else {
        this.dataListSelections.forEach(item => {
          let couponIndex = coupons.findIndex((coupon) => coupon.couponId === item.couponId)
          if (couponIndex === -1) {
            coupons.push({ couponId: item.couponId, couponName: item.couponName, subTitle: item.subTitle, limitNum: item.limitNum })
          }
        })
        this.$emit('refreshSelectCouponList', coupons)
      }
      this.dataListSelections = []
      this.visible = false
    }
  },
  beforeDestroy () {
    this.$refs.couponTable.clearSelection()
  }
}
</script>
<style scoped>
.prods-select-body {
  height: 601px;
  overflow: auto;
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
}
.table-cell-text {
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  -webkit-text-overflow: ellipsis;
  -moz-text-overflow: ellipsis;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  overflow: hidden;
  /* autoprefixer: ignore next */
  -webkit-box-orient: vertical;
  line-height: 20px;
}
.pagination {
  margin-top: 20px;
}
</style>
