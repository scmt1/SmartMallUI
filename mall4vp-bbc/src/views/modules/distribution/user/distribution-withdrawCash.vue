<template>
  <div class="mod-distribution-user">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item :label="$t('distributionMsg.distriTelPhone') + ':'">
            <el-input type="text" v-model="searchForm.userMobile" :placeholder="$t('distributionMsg.distriTelPhone')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('distributionMsg.serialNumber') + ':'">
            <el-input type="text" v-model="searchForm.merchantOrderId" :placeholder="$t('distributionMsg.serialNumber')"></el-input>
          </el-form-item>
          <el-form-item prop="state" :label="$t('distributionMsg.withdrawalStatus') + ':'">
            <el-select v-model="searchForm.state" :placeholder="$t('distributionMsg.withdrawalStatus')" clearable>
              <el-option :label="$t('distributionMsg.applying')" :value="0"></el-option>
              <el-option :label="$t('distributionMsg.withdrawalSuccessful')" :value="1"></el-option>
               <el-option :label="$t('distributionMsg.withdrawalFailed')" :value="-1"></el-option>
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
      <div class="table-con distribution-withdrawCash-table">
        <el-table
          ref="distributionWithdrawCashTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <!-- 分销员昵称 -->
          <el-table-column
            width="120"
            prop="nickName"
            :label="$t('distribUserWallet.distributorNickname')"
          >
            <template slot-scope="scope">
              {{scope.row.distributionUser ? scope.row.distributionUser.nickName : '' }}
            </template>
          </el-table-column>
          <!-- 分销员手机号 -->
          <el-table-column
            width="120"
            prop="userMobile"
            :label="$t('distribUserWallet.mobileTelNumber')"
          >
            <template slot-scope="scope">
              {{ scope.row.distributionUser ? scope.row.distributionUser.userMobile : '' }}
            </template>
          </el-table-column>
          <!-- 流水号 -->
          <el-table-column
            prop="merchantOrderId"
            width="230"
            :label="$t('distributionMsg.serialNumber')"
          >
            <template slot-scope="scope">
              {{ scope.row.merchantOrderId }}
            </template>
          </el-table-column>
          <!-- 金额 -->
          <el-table-column
            prop="amount"
            :label="$t('home.amount')"
            sortable
          >
            <template slot-scope="scope">
              {{ scope.row.amount }}
            </template>
          </el-table-column>
          <!-- 提现时间 -->
          <el-table-column
            prop="createTime"
            :label="$t('distributionMsg.withdrawalTime')"
            sortable
            width="180"
          >
            <template slot-scope="scope">
              {{ scope.row.createTime }}
            </template>
          </el-table-column>
          <!-- 提现类型 -->
          <el-table-column
            prop="type"
            :label="$t('distributionMsg.withdrawalType')"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.type === 0">{{ $t('distributionMsg.manualWithdrawal') }}</span>
              <span v-if="scope.row.type === 1">{{ $t('distributionMsg.automaticWithdrawal') }}</span>
            </template>
          </el-table-column>
          <!-- 提现状态 -->
          <el-table-column
            prop="state"
            :label="$t('distributionMsg.withdrawalStatus')"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.state === 0">{{ $t('distributionMsg.applying') }}</span>
              <span v-if="scope.row.state === 1">{{ $t('distributionMsg.withdrawalSuccessful') }}</span>
              <span v-if="scope.row.state === 2">{{ $t('distributionMsg.withdrawalFailed') }}</span>
            </template>
          </el-table-column>
          <!-- 更新时间 -->
          <el-table-column
            prop="updateTime"
            :label="$t('home.updateTime')"
            sortable
            width="180"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.updateTime">无</span>
              <span v-else>{{ scope.row.updateTime }}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            width="130"
          >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  v-if="
                    scope.row.state === 0 &&
                    isAuth('platform:distributionWithdrawCash:update')
                  "
                  class="default-btn text-btn"
                  @click="updateToSuccess(scope.row.withdrawCashId)"
                >
                  {{$t('distribUserWallet.setWithdrawal')}}
                </div>
                <div v-else>无</div>
              </div>
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
      sortParam: 3, // 0无 1金额 2手续费 3提现时间 4更新时间
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
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/distributionWithdrawCash/page'),
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
      // 排序字段 0无 1金额 2手续费 3提现时间 4更新时间
      switch (data.prop) {
        case 'amount': this.sortParam = 1
          break
        case 'fee': this.sortParam = 2
          break
        case 'createTime': this.sortParam = 3
          break
        case 'updateTime': this.sortParam = 4
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
    // 新增 / 修改
    updateToSuccess (withdrawCashId) {
      this.$confirm(this.$i18n.t('distribUserWallet.confirmSetWithdrawal'), this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/distributionWithdrawCash/toSuccess/' + withdrawCashId),
          method: 'put'
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        })
      })
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
