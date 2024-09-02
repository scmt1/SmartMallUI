<template>
  <div class="mod-distribution-user">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item :label="$t('distribUserWallet.mobileTelNumber') + ':'">
            <el-input type="text" v-model="searchForm.userMobile" :placeholder="$t('distribUserWallet.mobileTelNumber')"></el-input>
          </el-form-item>
<!--          状态-->
          <el-form-item  :label="$t('distribUserWallet.status') + ':'">
            <el-select v-model="searchForm.state" :placeholder="$t('distribUserWallet.status')" clearable>
              <el-option :label="$t('distribUserWallet.perBan')" :value="-1"></el-option>
              <el-option :label="$t('publics.normal')" :value="1"></el-option>
              <el-option :label="$t('distribUserWallet.ban')" :value="2"></el-option>
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
      <div class="table-con distribution-achievement-basic-table">
        <el-table
          ref="achievementBasicTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <!-- 分销员昵称 -->
          <el-table-column
            width="150"
            prop="nickName"
            :label="$t('distribUserWallet.distributorNickname')"
          >
            <template slot-scope="scope">
              {{scope.row.nickName}}
            </template>
          </el-table-column>
          <!-- 分销员手机号 -->
          <el-table-column
            width="110"
            prop="userMobile"
            :label="$t('distribUserWallet.mobileTelNumber')"
          >
            <template slot-scope="scope">
              {{scope.row.userMobile}}
            </template>
          </el-table-column>

          <!--          状态-->
          <el-table-column
            prop="state"
            :label="$t('distribUserWallet.status')"
          >
            <template slot-scope="scope">
              <div class="tag-text" v-if="scope.row.state === -1">{{ $t("distribUserWallet.perBan") }}</div>
              <div class="tag-text" v-if="scope.row.state === 1">{{ $t("publics.normal") }}</div>
              <div class="tag-text" v-if="scope.row.state === 2">{{ $t("distribUserWallet.ban") }}</div>
            </template>
          </el-table-column>

          <!-- 累计收益 -->
          <el-table-column
            prop="addupAmount"
            :label="$t('distribution.accumulateIncome')"
          >
            <template slot-scope="scope">
              <div
                v-if="
                  scope.row.distributionUserAchievementDataDto.distributionUserWallet
                    .addupAmount === null
                "
              >
                0
              </div>
              <div v-else>
                {{
                  scope.row.distributionUserAchievementDataDto.distributionUserWallet
                    .addupAmount
                }}
              </div>
            </template>
          </el-table-column>
          <!-- 直推奖励 -->
          <el-table-column
            width="100"
            prop="aGenerationCommission"
            :label="$t('distribIncome.generationCommission')"
            sortable
          >
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.distributionUserAchievementDataDto.distributionUserIncome
                  .agenerationCommission
                }}
              </span>
            </template>
          </el-table-column>
          <!-- 间推奖励 -->
          <el-table-column
            width="100"
            prop="secondGenerationCommission"
            :label="$t('distribIncome.secondGenerationCommission')"
            sortable
          >
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.distributionUserAchievementDataDto.distributionUserIncome
                  .secondGenerationCommission
                }}
              </span>
            </template>
          </el-table-column>
          <!-- 待结算金额 -->
          <el-table-column
            width="120"
            prop="unsettledAmount"
            :label="$t('distribUserWallet.waitTosettled')"
            sortable
          >
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.distributionUserAchievementDataDto.distributionUserWallet
                  .unsettledAmount
                }}
              </span>
            </template>
          </el-table-column>
          <!-- 可提现金额 -->
          <el-table-column
            width="120"
            prop="settledAmount"
            :label="$t('distribUserWallet.withdrawalAmount')"
            sortable
          >
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.distributionUserAchievementDataDto.distributionUserWallet
                  .settledAmount
                }}
              </span>
            </template>
          </el-table-column>
          <!-- 已失效金额 -->
          <el-table-column
            width="120"
            prop="invalidAmount"
            :label="$t('distribUserWallet.invalidAmount')"
            sortable
          >
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.distributionUserAchievementDataDto.distributionUserWallet
                  .invalidAmount
                }}
              </span>
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
      sortParam: 7,
      sortType: 2
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
    // 对应6种排序
    sortChange (data) {
      if (data.order === null) {
        // 当没有使用列进行排序时，恢复默认排序s
        this.sortParam = 7
        this.sortType = 2
        this.getDataList(this.page)
        return
      }
      // 排序字段 0无 1一代佣金 2二代佣金 3邀请奖励 4待结算金额 5可提现金额 6已失效金额
      switch (data.prop) {
        case 'aGenerationCommission': this.sortParam = 1
          break
        case 'secondGenerationCommission': this.sortParam = 2
          break
        case 'invitationRewards': this.sortParam = 3
          break
        case 'unsettledAmount': this.sortParam = 4
          break
        case 'settledAmount': this.sortParam = 5
          break
        case 'invalidAmount': this.sortParam = 6
          break
        default: this.sortParam = 7
          break
      }
      // 排序类型 0无 1 正序 2倒序
      switch (data.order) {
        case 'descending': this.sortType = 2
          break
        case 'ascending': this.sortType = 1
          break
        default: this.sortType = 2
          break
      }
      this.getDataList(this.page)
    },
    // 获取数据列表
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theParams = JSON.parse(JSON.stringify(this.searchForm))
        this.theData = {
          current: page ? page.currentPage : this.page.currentPage,
          size: page ? page.pageSize : this.page.pageSize,
          sortType: this.sortType,
          sortParam: this.sortParam
        }
      } else {
        this.theData.current = page ? page.currentPage : this.page.currentPage
        this.theData.size = page ? page.pageSize : this.page.pageSize
      }
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionUser/page/achievement'),
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
