<template>
  <div class="mod-distribution-income">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item :label="$t('distribUserWallet.mobileTelNumber') + ':'">
            <el-input type="text" v-model="searchForm.userMobile" :placeholder="$t('distribUserWallet.mobileTelNumber')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('distribIncome.orderNumber') + ':'">
            <el-input type="text" v-model="searchForm.orderNumber" :placeholder="$t('distribIncome.orderNumber')"></el-input>
          </el-form-item>
          <el-form-item prop="state" :label="$t('distribIncome.commissionStatus') + ':'">
            <el-select v-model="searchForm.state" :placeholder="$t('distribIncome.commissionStatus')" clearable>
              <el-option :label="$t('distributionProdLog.pendingSettlement')" :value="1"></el-option>
              <el-option :label="$t('distribIncome.withdrawable')" :value="2"></el-option>
              <el-option :label="$t('seckill.loseEffectiveness')" :value="-1"></el-option>
            </el-select>
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
      <div class="table-con distribution-income-table">
        <el-table
          ref="distributionIncomeTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <!-- 分销员昵称 -->
          <el-table-column
            prop="nickName"
            :label="$t('distribUserWallet.distributorNickname')"
          >
            <template slot-scope="scope">
              {{scope.row.distributionUser.nickName}}
            </template>
          </el-table-column>
          <!-- 分销员手机号 -->
          <el-table-column
            prop="userMobile"
            :label="$t('distribUserWallet.mobileTelNumber')"
          >
            <template slot-scope="scope">
              {{scope.row.distributionUser.userMobile}}
            </template>
          </el-table-column>
          <!-- 订单号 -->
          <el-table-column
            prop="orderNumber"
            :label="$t('distribIncome.orderNumber')"
          >
            <template slot-scope="scope">
              {{scope.row.orderNumber}}
            </template>
          </el-table-column>
          <!-- 佣金 -->
          <el-table-column
            prop="aGenerationCommission"
            :label="$t('distribIncome.commission')"
            sortable
          >
            <template slot-scope="scope">
              {{ scope.row.incomeAmount }}
            </template>
          </el-table-column>
          <!-- 创建时间 -->
          <el-table-column
            prop="createTime"
            :label="$t('sys.creationTime')"
            sortable
          >
            <template slot-scope="scope">
              {{ scope.row.createTime }}
            </template>
          </el-table-column>
          <!-- 更新时间 -->
          <el-table-column
            prop="updateTime"
            :label="$t('home.updateTime')"
            sortable
          >
            <template slot-scope="scope">
              {{ scope.row.updateTime }}
            </template>
          </el-table-column>
          <!-- 奖励类型 -->
          <el-table-column
            prop="incomeType"
            :label="$t('distribIncome.rewardRype')"
          >
            <template slot-scope="scope">
              <div class="tag-text" v-if="scope.row.incomeType === 1">{{ $t("distribIncome.levelReward1") }}</div>
              <div class="tag-text" v-if="scope.row.incomeType === 2">{{ $t("distribIncome.secondaryReward") }}</div>
              <div class="tag-text" v-if="scope.row.incomeType === 3">{{ $t("distribIncome.invitationReward") }}</div>
            </template>
          </el-table-column>
          <!-- 订单状态 -->
          <el-table-column
            prop="status"
            :label="$t('order.orderStatus')"
          >
            <template slot-scope="scope" v-if="scope.row.order">
              <span v-if="scope.row.order.status === 1">{{$t('order.pendingPayment')}}</span>
              <span v-if="scope.row.order.status === 2">{{$t('order.toBeShipped')}}</span>
              <span v-if="scope.row.order.status === 3">{{$t('order.pendingReceipt')}}</span>
              <span v-if="scope.row.order.status === 4">{{$t('order.toBeEvaluated')}}</span>
              <span v-if="scope.row.order.status === 5">{{$t('order.success')}}</span>
              <span v-if="scope.row.order.status === 6">{{$t('order.fail')}}</span>
            </template>
          </el-table-column>
          <!-- 佣金状态 -->
          <el-table-column
            align="center"
            prop="state"
            :label="$t('distribIncome.commissionStatus')"
          >
            <template slot-scope="scope">
              <div class="tag-text" v-if="scope.row.state === 1">{{ $t("distributionProdLog.pendingSettlement") }}</div>
              <div class="tag-text" v-if="scope.row.state === 2">{{ $t("distribIncome.withdrawable") }}</div>
              <div class="tag-text" v-if="scope.row.state === -1">{{ $t("seckill.loseEffectiveness") }}</div>
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
      theParams: null, // 保存上次点击查询的请求条件

      createdateRange: [],
      dataForm: {
        userMobile: null
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {},
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      sortParam: 2, // 0无 1佣金 2创建时间 3更新时间
      sortType: 2 // 0无 1 正序 2倒序
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
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    // 点击查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    // 获取数据列表
    getDataList (page, newData = false) {
      console.log(this.searchForm)
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theParams = JSON.parse(JSON.stringify(this.searchForm))
        this.theData = {
          current: page ? page.currentPage : this.page.currentPage,
          size: page ? page.pageSize : this.page.pageSize,
          sortParam: this.sortParam,
          sortType: this.sortType
        }
      } else {
        this.theData.current = page ? page.currentPage : this.page.currentPage
        this.theData.size = page ? page.pageSize : this.page.pageSize
      }
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionUserIncome/page/anduser'),
        method: 'get',
        params: this.$http.adornParams(Object.assign(this.theData, this.theParams))
      }).then(({ data }) => {
        this.page.total = data.total
        this.page.pageSize = data.size
        this.page.currentPage = data.current
        this.dataList = data.records
        this.dataListLoading = false
      })
    },
    sortChange (data) {
      // 排序字段 0无 1佣金 2创建时间 3更新时间
      switch (data.prop) {
        case 'incomeAmount': this.sortParam = 1
          break
        case 'createTime': this.sortParam = 2
          break
        case 'updateTime': this.sortParam = 3
          break
        default: this.sortParam = 0
          break
      }
      // 排序类型 0无 1 正序 2倒序
      switch (data.order) {
        case 'descending': this.sortType = 2
          break
        case 'ascending': this.sortType = 1
          break
        default: this.sortType = 0
          break
      }
      this.getDataList(this.page)
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
