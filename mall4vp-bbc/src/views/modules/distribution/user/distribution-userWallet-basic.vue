<template>
  <!-- 分销钱包-钱包管理 -->
  <div class="mod-distribution-distributionUserWallet">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item :label="$t('distributionMsg.distriTelPhone') + ':'">
            <el-input type="text" v-model="searchForm.userMobile" :placeholder="$t('distributionMsg.distriTelPhone')"></el-input>
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
      <div class="table-con distr-user-wallet-basic-table">
        <el-table
          ref="distrUserWalletBasicTable"
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
              {{scope.row.distributionUser ? scope.row.distributionUser.nickName : '' }}
            </template>
          </el-table-column>
          <!-- 分销员手机号 -->
          <el-table-column
            prop="userMobile"
            :label="$t('distribUserWallet.mobileTelNumber')"
          >
            <template slot-scope="scope">
              {{ scope.row.distributionUser ? scope.row.distributionUser.userMobile : '' }}
            </template>
          </el-table-column>
<!--          状态-->
          <el-table-column
            prop="state"
            :label="$t('distribUserWallet.status')"
          >
            <template slot-scope="scope">
<!--              <p  v-if="scope.row.distributionUser.state === -1">{{ $t('distribUserWallet.perBan') }}</p>-->
              <div class="tag-text" v-if="scope.row.state === -1">{{ $t("distribUserWallet.perBan") }}</div>
              <div class="tag-text" v-if="scope.row.state === 0">{{ $t("product.pendingReview") }}</div>
              <div class="tag-text" v-if="scope.row.state === 1">{{ $t("publics.normal") }}</div>
              <div class="tag-text" v-if="scope.row.state === 2">{{ $t("distribUserWallet.ban") }}</div>
              <div class="tag-text" v-if="scope.row.state === 3">{{ $t("publics.unPassed") }}</div>
            </template>
          </el-table-column>

          <!-- 待结算金额 -->
          <el-table-column
            prop="unsettledAmount"
            :label="$t('distribUserWallet.waitTosettled')"
          >
            <template slot-scope="scope">
              {{ scope.row.unsettledAmount }}
            </template>
          </el-table-column>
          <!-- 可提现金额 -->
          <el-table-column
            prop="settledAmount"
            :label="$t('distribUserWallet.withdrawalAmount')"
          >
            <template slot-scope="scope">
              {{ scope.row.settledAmount }}
            </template>
          </el-table-column>
          <!-- 已失效金额 -->
          <el-table-column
            prop="invalidAmount"
            :label="$t('distribUserWallet.invalidAmount')"
          >
            <template slot-scope="scope">
              {{ scope.row.invalidAmount }}
            </template>
          </el-table-column>
          <!-- 积累收益 -->
          <el-table-column
            prop="addupAmount"
            :label="$t('distribution.accumulateIncome')"
          >
            <template slot-scope="scope">
              {{ scope.row.addupAmount }}
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
              <div class="text-btn-con" v-if="scope.row.state === 1">
                <div
                  v-if="isAuth('admin:distributionUserWallet:update')"
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(scope.row)"
                >
                  {{$t('crud.updateBtn')}}
                </div>
                <div
                  v-if="isAuth('distribution:distributionUserWallet:delete')"
                  class="default-btn text-btn"
                  @click="deleteHandle(scope.row.walletId)"
                >
                  {{$t('text.delBtn')}}
                </div>
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

    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './distribution-userWallet-update'
export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {},
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionUserWallet/pageAndUser'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page == null ? this.page.currentPage : page.currentPage,
          size: page == null ? this.page.pageSize : page.pageSize
        }, this.theData))
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (val) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(val)
      })
    },
    deleteHandle: function (id) {
      this.$confirm(this.$i18n.t('scoreProdList.isDelete'), this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/distribution/distributionUserWallet/' + id),
          method: 'delete',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.refreshChange()
            }
          })
        })
      }).catch(() => { })
    },
    // 刷新回调
    refreshChange () {
      this.page.currentPage = 1
      this.getDataList(this.page)
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
