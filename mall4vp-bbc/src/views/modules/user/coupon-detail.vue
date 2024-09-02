<template>
  <div>
    <div class="user-coupon-detail-select-con">
      <el-select
        v-model="status"
        clearable
        @change="statusChange()"
        size="mini"
        style="margin-bottom:10px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <el-table :data="dataList"
      header-cell-class-name="table-header"
      row-class-name="table-row-low"
      class="user-edit-table"
      style="width: 100%"
    >
      <el-table-column
        prop="receiveTime"
        :label="$t('user.getCouponTime')"
        width="250"
        align="left"
      ></el-table-column>
      <el-table-column :label="$t('marketing.couponName')" width="120" align="center">
        <template slot-scope="scope">
          <div>
            <span>{{ scope.row.coupon.couponName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('coupon.couponType')" width="120" align="center">
        <template slot-scope="scope">
          <span>{{
            [
              $t("coupon.cashCoupon"),
              $t("coupon.discountVoucher"),
              $t("coupon.coinCertificate"),
            ][scope.row.coupon.couponType - 1]
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="score"
        :label="$t('user.effectiveTime')"
        width="300"
        align="center"
      >
        <template slot-scope="scope">
          <div>
            <span
              >{{ scope.row.userStartTime }}{{ $t("text.to")
              }}{{ scope.row.userEndTime }}</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        :label="$t('user.couponStatus')"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{
            [$t("user.invalid"), $t("user.notUsed"), $t("user.used")][
              scope.row.status
            ]
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.userRules')" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.coupon.couponType == 1">
            <span
              >{{ $t("marketing.full") }}{{'￥' + scope.row.coupon.cashCondition
              }}{{ $t("marketing.reducea")
              }}{{'￥' +  scope.row.coupon.reduceAmount}}</span
            >
          </div>
          <div v-if="scope.row.coupon.couponType == 2">
            <!-- <span>{{$t('marketing.full')}}{{scope.row.coupon.cashCondition}}打{{$t('marketing.reducea')}}{{scope.row.coupon.couponDiscount}}{{$t('marketing.fold')}}</span> -->
            <span>{{
              $t("user.discountMsg")
                .replace("PRICE", scope.row.coupon.cashCondition)
                .replace("FOLD", scope.row.coupon.couponDiscount)
            }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-if="dataList.length"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="page.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.pageSize"
      :total="page.total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- /分页 -->
  </div>
</template>

<script>
import i18n from '@/i18n/i18n'
export default {
  components: {
  },
  created () {
    this.getData()
  },
  data () {
    return {
      index: 0,
      addOrUpdateVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataList: [],
      maxLength: 0,
      options: [
        {
          value: 0,
          label: i18n.t('user.invalid')
        }, {
          value: 1,
          label: i18n.t('user.notUsed')
        }, {
          value: 2,
          label: i18n.t('user.used')
        }],
      status: null
    }
  },
  methods: {
    init (id) {
      this.status = null
      this.userId = id
      Object.assign(this.page, this.$options.data().page)
      this.getData(this.page)
    },
    // 获取数据
    getData (page) {
      if (!this.userId) {
        return
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/coupon/pageByUserId'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            { userId: this.userId, status: this.status }
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (index) {
      this.addOrUpdateVisible = true
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getData(this.page)
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.currentPage = val
      this.getData(this.page)
    },
    statusChange () {
      this.page.currentPage = 1
      this.getData(this.page)
    },
    errorMsg (message) {
      this.$message({
        message: message,
        type: 'error',
        duration: 1500
      })
    }
  }
}
</script>

<style lang="scss">
.user-coupon-detail-select-con {
  margin-bottom: 10px;
}
.distribution-level-set {
  .el-input__inner {
    padding: 2px;
    border-radius: 3px;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 0px;
  }
  .award-box {
    input {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    .el-input-group__append,
    .el-input-group__prepend {
      padding: 0 10px;
    }
  }
}
.level-table-box {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  margin-top: 10px;
  padding: 5px;
}
.elTable th {
  padding: 10px 0 !important;
}
.elTable td {
  padding: 2px 0 !important;
}
.table-input-box {
  margin-top: 20px;
  width: 75px !important;
}
.table-template {
  text-align: center;
}
.table-template > * {
  display: inline-block;
  margin: auto;
}
.card-prod-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
