<template>
  <div class="mod-distribution-prod">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item prop="shopName" :label="$t('coupon.shopName') + ':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.shopName" :placeholder="$t('coupon.shopName')"></el-input>
          </el-form-item>
          <el-form-item prop="prodName" :label="$t('coupon.commodityName') + ':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.prodName" :placeholder="$t('coupon.commodityName')"></el-input>
          </el-form-item>
          <el-form-item prop="nickName" :label="$t('distributionProdLog.distributor') + ':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.nickName" :placeholder="$t('distributionProdLog.distributor')"></el-input>
          </el-form-item>
          <el-form-item prop="userMobile" :label="$t('users.phoneNumber') + ':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.userMobile" maxlength="11" :placeholder="$t('users.phoneNumber')"></el-input>
          </el-form-item>
          <el-form-item prop="state" :label="$t('distributionProdLog.distributionStatus') + ':'" class="search-form-item">
            <el-select v-model="searchForm.state" :placeholder="$t('distributionProdLog.distributionStatus')" clearable>
              <el-option :label="$t('distributionProdLog.pendingSettlement')" :value="1"></el-option>
              <el-option :label="$t('distributionProdLog.alreadySettled')" :value="2"></el-option>
              <el-option :label="$t('distributionProdLog.invalidOrder')" :value="-1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-form-item :label="$t('distribIncome.orderNumber') + ':'">
              <el-input type="text" v-model="searchForm.orderNumber" :placeholder="$t('distribIncome.orderNumber')"></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('crud.searchBtn')}}</div>
            <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('product.reset')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="main-container">
      <!-- 表格 -->
      <div class="table-con sales-record-table">
        <el-table
          ref="salesRecordTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
        >
          <!-- 店铺名称 -->
          <el-table-column
            prop="shopName"
            fixed
            :label="$t('coupon.shopName')"
          >
            <template slot-scope="scope">
              {{scope.row.shopName}}
            </template>
          </el-table-column>
          <!-- 产品名称 -->
          <el-table-column
            prop="prodName"
            fixed
            width="300"
            :label="$t('coupon.commodityName')"
          >
            <template slot-scope="scope">
              <div class="table-cell-text">{{scope.row.prodName}}</div>
            </template>
          </el-table-column>
          <!-- 产品图片 -->
          <el-table-column
            prop="pic"
            width="120"
            :label="$t('discount.commodityPictures')"
          >
            <template slot-scope="scope">
              <div class="table-cell-image">
                <img :src="resourcesUrl + scope.row.pic" :alt="scope.row.prodName">
              </div>
            </template>
          </el-table-column>
<!--          佣金类型-->
          <el-table-column :label="$t('distributionProdLog.incomeType')" prop="incomeType" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.incomeType === 1">{{ $t('distributionProdLog.Reward1') }}</span>
              <span v-if="scope.row.incomeType === 2">{{ $t('distributionProdLog.Reward2') }}</span>
            </template>
          </el-table-column>
          <!-- 佣金数额 -->
          <el-table-column
            prop="incomeAmount"
            :label="$t('distributionProdLog.commissionAmount')"
          >
            <template slot-scope="scope">
              {{scope.row.incomeAmount}}
            </template>
          </el-table-column>
          <!-- 分销员 -->
          <el-table-column
            prop="nickName"
            :label="$t('distributionProdLog.distributor')"
          >
            <template slot-scope="scope">
              {{scope.row.nickName}}
            </template>
          </el-table-column>
          <!-- 手机号 -->
          <el-table-column
            prop="userMobile"
            :label="$t('users.phoneNumber')"
          >
            <template slot-scope="scope">
              {{scope.row.userMobile}}
            </template>
          </el-table-column>
          <!-- 下单时间 -->
          <el-table-column
            prop="placeTime"
            :label="$t('order.createTime')"
          >
            <template slot-scope="scope">
              {{scope.row.placeTime}}
            </template>
          </el-table-column>
          <!-- 订单号 -->
          <el-table-column
            prop="orderNumber"
            width="180"
            :label="$t('chat.orderNumber')"
          >
            <template slot-scope="scope">
              {{scope.row.orderNumber}}
            </template>
          </el-table-column>
          <!-- 分销状态 -->
          <el-table-column
            align="center"
            prop="state"
            :label="$t('distributionProdLog.distributionStatus')"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.state === -1">{{ $t('distributionProdLog.invalidOrder') }}</span>
              <span v-if="scope.row.state === 1">{{ $t('distributionProdLog.pendingSettlement') }}</span>
              <span v-if="scope.row.state === 2">{{ $t('distributionProdLog.alreadySettled') }}</span>
            </template>
          </el-table-column>
<!--          失效-->
          <el-table-column
            align="center"
            prop="reson"
            :label="$t('distributionProdLog.lapseCase')"
          >
            <template  slot-scope="scope">
<!--              <span v-if="scope.row.reson === 0">{{ $t('distributionProdLog.lapse0') }}</span>-->
              <span v-if="scope.row.reson === 1">{{ $t('distributionProdLog.lapse1') }}</span>
              <span v-if="scope.row.reson === 2">{{ $t('distributionProdLog.lapse2') }}</span>
              <span v-if="scope.row.reson === 3">{{ $t('distributionProdLog.lapse3') }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <el-pagination
        v-if="dataList.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      dataForm: {
        prodName: ''
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataListLoading: false,
      dataList: [],
      searchForm: {}
    }
  },
  components: {
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 刷新回调
    refreshChange () {
      this.getDataList(this.page)
    },
    // 获取数据列表
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/platform/distributionProd/getDistributionProdLogPage'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page ? page.currentPage : 1,
          size: page ? page.pageSize : 10
        }, this.theData))
      }).then(({ data }) => {
        this.page.total = data.total
        this.page.pageSize = data.size
        this.page.currentPage = data.current
        this.dataList = data.records
        this.dataListLoading = false
      })
    },
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },

    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.searchForm = {}
    },

    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList(this.page)
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
