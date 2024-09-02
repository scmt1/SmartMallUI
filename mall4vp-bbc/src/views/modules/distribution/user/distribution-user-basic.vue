<template>
  <div class="mod-distribution-user">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item :label="$t('distributionMsg.distriTelPhone') + ':'">
            <el-input type="text" v-model="searchForm.userMobile" :placeholder="$t('distributionMsg.distriTelPhone')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('distributionMsg.inviteesPhoneNumber') + ':'">
            <el-input type="text" v-model="searchForm.parentUserMobile" :placeholder="$t('distributionMsg.inviteesPhoneNumber')"></el-input>
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
      <div class="table-con distribution-user-table">
        <el-table
          ref="distributionUserTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <!-- 昵称 -->
          <el-table-column
            fixed="left"
            prop="nickName"
            :label="$t('users.nickName')"
            width="230"
          >
            <template slot-scope="scope">
              {{scope.row.nickName}}
            </template>
          </el-table-column>
          <!-- 分销员手机号 -->
          <el-table-column
            fixed="left"
            width="150"
            prop="userMobile"
            :label="$t('distributionMsg.distriTelPhone')"
          >
            <template slot-scope="scope">
              {{scope.row.userMobile}}
            </template>
          </el-table-column>
          <!-- 邀请人手机号 -->
          <el-table-column
            width="150"
            prop="parentUserMobile"
            :label="$t('distributionMsg.inviteesPhoneNumber')"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.parentDistributionUser">无</span>
              <span v-else>{{scope.row.parentDistributionUser.userMobile}}</span>
            </template>
          </el-table-column>
          <!-- 邀请人 -->
          <el-table-column
            prop="parentName"
            :label="$t('distributionMsg.invitees')"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.parentDistributionUser">无</span>
              <span v-else>{{scope.row.parentDistributionUser.nickName}}</span>
            </template>
          </el-table-column>
          <!-- 等级 -->
          <!-- <el-table-column
            prop="level"
            :label="$t('user.level')"
          >
            <template slot-scope="scope">
              {{ scope.row.levelName }}
            </template>
          </el-table-column> -->
          <!-- 加入时间 -->
          <el-table-column
            prop="bindTime"
            width="200"
            :label="$t('distributionMsg.joiningTime')"
            sortable
          >
            <template slot-scope="scope">
              {{ scope.row.bindTime }}
            </template>
          </el-table-column>
          <!-- 累计客户 -->
          <el-table-column
            prop="distributionUserAchievementDataDto.boundCustomers"
            :label="$t('distributionMsg.cumulativeCustomers')"
            sortable
          >
            <template slot-scope="scope">
              {{ scope.row.distributionUserAchievementDataDto.boundCustomers }}
            </template>
          </el-table-column>
          <!-- 累计邀请 -->
          <el-table-column
            prop="distributionUserAchievementDataDto.invitedVeeker"
            :label="$t('distributionMsg.cumulativeInvitation')"
            sortable
          >
            <template slot-scope="scope">
              {{ scope.row.distributionUserAchievementDataDto.invitedVeeker }}
            </template>
          </el-table-column>
          <!-- 累计收益 -->
          <el-table-column
            prop="distributionUserAchievementDataDto.distributionUserWallet.addupAmount"
            :label="$t('distributionMsg.cumulativeIncome')"
            sortable
          >
            <template slot-scope="scope">
              {{ scope.row.distributionUserAchievementDataDto.distributionUserWallet.addupAmount }}
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            prop="state"
            :label="$t('product.status')"
          >
            <template slot-scope="scope">
              <div class="tag-text" v-if="scope.row.state === -1">{{ $t("distribUserWallet.perBan") }}</div>
              <div class="tag-text" v-if="scope.row.state === 0">{{ $t("product.pendingReview") }}</div>
              <div class="tag-text" v-if="scope.row.state === 1">{{ $t("publics.normal") }}</div>
              <div class="tag-text" v-if="scope.row.state === 2">{{ $t("distribUserWallet.ban") }}</div>
              <div class="tag-text" v-if="scope.row.state === 3">{{ $t("publics.unPassed") }}</div>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            width="200"
          >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  v-if="isAuth('distribution:distributionUser:info')"
                  class="default-btn text-btn"
                  @click="info(scope.row)"
                >
                  {{$t('seckill.view')}}
                </div>
                <div
                  v-if="isAuth('distribution:distributionUser:update') && scope.row.state !== -1"
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(scope.row)"
                >
                  {{$t('distributionMsg.updateStatus')}}
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


    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="refreshChange"
    ></add-or-update>

    <!-- 弹窗, 新增 / 修改 -->
    <Info v-if="infoVisible" ref="info"></Info>
  </div>
</template>
<script>
import AddOrUpdate from './distribution-user-update'
import Info from './distribution-user-info'
export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件
      theParams: null, // 保存上次点击查询的请求条件

      dataForm: {
        // 分销员手机号
        mobile: null,
        // 邀请人手机号
        parentMobile: null,
        // 加入时间区间
        dateRange: []
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {},
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      infoVisible: false,
      sortParam: 1, // 0无 1加入时间 2累计客户 3累计邀请 4累计收益
      sortType: 2 // 0无 1 正序 2倒序
    }
  },
  components: {
    AddOrUpdate,
    Info
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 新增 / 修改
    addOrUpdateHandle (data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(data)
      })
    },
    // 新增 / 修改
    info (data) {
      this.infoVisible = true
      this.$nextTick(() => {
        this.$refs.info.init(data)
      })
    },
    // 点击查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    // 刷新回调
    refreshChange () {
      this.page.currentPage = 1
      this.getDataList(this.page)
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
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionUser/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign(this.theData, this.theParams))
      }).then(({ data }) => {
        this.page.total = data.total
        this.dataList = data.records
        this.dataListLoading = false

        // 末尾页数据为空重新请求
        if (!this.dataList.length && this.page.currentPage > 1) {
          this.page.currentPage = 1
          this.getDataList()
        }
      })
    },
    sortChange (data) {
      // 排序字段 0无 1加入时间 2累计客户 3累计邀请 4累计收益
      switch (data.prop) {
        case 'bindTime': this.sortParam = 1
          break
        case 'boundCustomers': this.sortParam = 2
          break
        case 'invitedVeeker': this.sortParam = 3
          break
        case 'addupAmount': this.sortParam = 4
          break
        default: this.sortParam = 1
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
