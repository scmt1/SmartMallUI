<template>
  <div>
    <el-dialog
      :title="$t('user.selectCoupons')"
      :visible.sync="visible"
      width="50%"
      class="select-coupon-dialog"
    >
      <el-form :inline="true" :model="searchForm" class="demo-form-inline form">
        <el-form-item>
          <el-input
            v-model="couponName"
            size="small"
            :placeholder="$t('user.couponTip1')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div
            class="default-btn primary-btn"
            @click="searchChange"
          >{{$t("pictureManager.query")}}</div>
        </el-form-item>
      </el-form>
      <div class="main-container">
        <div class="prods-select-body table-con">
          <el-table
            ref="couponTable"
            :data="dataList"
            header-cell-class-name="table-header"
            row-class-name="table-row-low"
            v-loading="dataListLoading"
            @selection-change="selectChangeHandle"
            style="width: 100%;"
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
              width="50"
            ></el-table-column>
            <el-table-column
              prop="couponName"
              :label="$t('marketing.couponName')"
              width="200"
            >
              <template slot-scope="scope">
                <span class="table-cell-text"> {{scope.row.couponName}} </span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="subTitle"
              :label="$t('user.couponDscription')"
            >
              <template slot-scope="scope">
                <span class="table-cell-text"> {{scope.row.subTitle}} </span>
              </template></el-table-column> -->
            <el-table-column
              prop="couponType"
              :label="$t('coupon.couponType')"
            ></el-table-column>
            <el-table-column
              prop="stocks"
              :label="$t('user.stockNum')"
            ></el-table-column>
            <el-table-column
              prop="limitNum"
              :label="$t('user.couponUpperLimit')"
            ></el-table-column>
            <el-table-column
              align="center"
              :label="$t('user.perRecevies')"
              width="160"
            >
              <template slot="header">
                <span>{{$t('user.perRecevies')}}</span>
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  :content="$t('user.couponTip2')"
                >
                  <i class="el-icon-question" slot="reference"></i>
                </el-popover>
              </template>
              <template slot-scope="scope">
                <el-input-number
                  size="mini"
                  v-model="scope.row.eachObtain"
                  controls-position="right"
                  @change="handleChange(scope.row,scope.$index)"
                  :min="scope.row.stocks>0?1:0"
                  :max=" scope.row.stocks>0?(scope.row.stocks >= scope.row.limitNum ? scope.row.limitNum:scope.row.stocks):0"
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          v-if="dataList.length"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page.pageSize"
          :total="page.total"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
        <!-- <div v-if="tagList.length < 1">暂无数据</div> -->
      </div>

      <!-- 分页 -->
      <!-- <el-pagination
        v-if="dataList.length"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>-->
      <!-- /分页 -->
              <el-alert
                :title="this.$i18n.t('publics.sendCouponTips')"
          type="warning"
          show-icon
          :closable="false">
        </el-alert>
      <span slot="footer">
        <div @click="visible = false" class="default-btn">{{$t('remindPop.cancel')}}</div>
        <div class="default-btn primary-btn" @click="submitProds()">{{$t('remindPop.confirm')}}</div>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { Debounce } from '@/utils/debounce'
export default {

  data () {
    return {
      visible: false,
      confirmLoad: false,
      dataForm: {
        userIds: [],
        coupons: []
      },
      dataList: [], // 标签
      dataRule: {
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataListLoading: false,
      searchForm: {},
      couponName: null,
      dataListSelections: []
    }
  },
  components: {
  },
  props: {
    value: {
      default: '',
      type: String
    },
    // 获取方式 null:默认（客户领取+平台发放） 0=客户领取 1=平台发放
    getWay: {
      default: null,
      type: Number
    },
    isSingle: {
      default: false,
      type: Boolean
    },
    // 最大上传数量
    limit: {
      default: 9,
      type: Number
    }
  },
  mounted () {
  },
  methods: {
    init (ids) {
      this.visible = true
      this.dataForm.userIds = ids
      this.getDataList()
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    },
    // 分页获取标签
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/coupon/list'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize,
              getWay: this.getWay
            },
            this.searchForm
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.dataList.forEach(item => {
          // 平台投放 / 用户领取
          item.couponType = item.couponType === 1 ? this.$t('coupon.cashCoupon') : (item.couponType === 2 ? this.$t('coupon.discountVoucher') : (item.couponType === 3 ? this.$t('coupon.coinCertificate') : ''))
          // item.eachObtain = 1
          this.$set(item, 'eachObtain', 1)
        })
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 搜索
    searchChange () {
      this.searchForm.couponName = this.couponName
      this.getDataList(this.page)
    },
    // 单选商品事件
    getSelectProdRow (row) {
      // console.log('aa')
      this.dataListSelections = [row]
    },
    // 多选
    // 多选点击事件
    selectChangeHandle (selection) {
      this.dataList.forEach((tableItem) => {
        let selectedProdIndex = selection.findIndex((selectedCoupon) => {
          if (!selectedCoupon) {
            this.dataListSelections = []
            return false
          }
          return selectedCoupon.couponId === tableItem.couponId
        })
        let dataSelectedProdIndex = this.dataListSelections.findIndex((dataSelectedCoupon) => dataSelectedCoupon.couponId === tableItem.couponId)
        if (selectedProdIndex > -1 && dataSelectedProdIndex === -1) {
          this.dataListSelections.push(tableItem)
        } else if (selectedProdIndex === -1 && dataSelectedProdIndex > -1) {
          this.dataListSelections.splice(dataSelectedProdIndex, 1)
        }
      })
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
        // this.$emit('refreshSelectCouponList', [])
      } else {
        this.dataListSelections.forEach(item => {
          let couponIndex = coupons.findIndex((coupon) => coupon.couponId === item.couponId)
          if (couponIndex === -1) {
            coupons.push({ couponId: item.couponId, couponName: item.couponName, subTitle: item.subTitle, limitNum: item.limitNum, eachObtain: item.eachObtain })
          }
        })
        // this.$emit('refreshSelectCouponList', coupons)
      }
      this.dataForm.coupons = coupons
      this.dataListSelections = []
      this.confirm()
    },
    confirm: Debounce(function () {
      if (!this.dataForm.userIds) {
        return
      }
      if (!this.dataForm.coupons || !this.dataForm.coupons.length) {
        return this.$message.error(this.$t('coupon.pleaseSelectCoupon'))
      }
      this.confirmLoad = true
      let coupons = []
      this.dataForm.coupons.forEach(element => {
        let obj = {}
        obj.couponId = element.couponId
        obj.nums = element.eachObtain
        coupons.push(obj)
      })
      this.dataForm.coupons = coupons
      let param = this.dataForm
      console.log(param)
      this.$http({
        url: this.$http.adornUrl(`/platform/coupon/sendUserCoupon`),
        method: 'put',
        data: this.$http.adornData(param)
      }).then(({ data }) => {
        this.active = []
        this.$message({
          message: this.$i18n.t('remindPop.success'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.visible = false
            this.confirmLoad = false
            this.$emit('refreshDataList', this.page)
          }
        })
      }).catch((e) => {
      })
    }, 1000),
    handleChange (row, index) {
      this.$set(this.dataList, index, this.dataList[index])
    }
  }
}
</script>
<style lang="scss" scoped>
.active {
  float: left;
  margin-left: 10px;
  padding: 10px;
  background: #e6a23c;
  margin-bottom: 10px;
  border-radius: 4px;
  font-size: 14px;
}
.Classification {
  float: left;
  margin-left: 10px;
  padding: 10px;
  background: #f7f7f7;
  margin-bottom: 10px;
  border-radius: 4px;
  font-size: 14px;
}
.select-coupon-dialog {
  .el-form-item {
    margin-bottom: 0;
  }
  .el-input.el-input--small {
    width: 200px;
  }
  .main-container {
    margin-bottom: 20px;
  }
}
</style>
