<template>
  <div class="mod-distribution-user">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item :label="$t('distribUserWallet.mobileTelNumber') + ':'">
            <el-input type="text" v-model="searchForm.userMobile" :placeholder="$t('distribUserWallet.mobileTelNumber')"></el-input>
          </el-form-item>
          <el-form-item prop="banReason" :label="$t('home.reasons') + ':'">
            <el-select v-model="searchForm.banReason" :placeholder="$t('home.reasons')" clearable>
              <el-option :label="$t('distribUserWallet.lostContact')" :value="0"></el-option>
              <el-option :label="$t('distribUserWallet.maliciousSwipe')" :value="1"></el-option>
              <el-option :label="$t('distribUserWallet.other')" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="state" :label="$t('publics.status') + ':'">
            <el-select v-model="searchForm.state" :placeholder="$t('publics.status')" clearable>
              <el-option :label="$t('publics.normal')" :value="1"></el-option>
              <el-option :label="$t('distribUserWallet.ban')" :value="2"></el-option>
              <el-option :label="$t('distribUserWallet.perBan')" :value="-1"></el-option>
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
      <div class="table-con distribution-ban-table">
        <el-table
          ref="distributionBanTable"
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
              <span class="table-cell-text line-clamp-one">{{scope.row.distributionUser.nickName}}</span>
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
          <!-- 原因 -->
          <el-table-column
            prop="banReason"
            :label="$t('home.reasons')"
          >
            <template slot-scope="scope">
              <div class="tag-text" v-if="scope.row.banReason === 0">{{ $t("distribUserWallet.lostContact") }}</div>
              <div class="tag-text" v-if="scope.row.banReason === 1">{{ $t("distribUserWallet.maliciousSwipe") }}</div>
              <div class="tag-text" v-if="scope.row.banReason === 2">{{ $t("distribUserWallet.other") }}</div>
            </template>
          </el-table-column>
          <!-- 备注 -->
          <el-table-column
            prop="remarks"
            :label="$t('publics.remark')"
          >
            <template slot-scope="scope">
              <div v-if="!scope.row.remarks">无</div>
              <div v-else class="table-cell-text">{{scope.row.remarks}}</div>
            </template>
          </el-table-column>
          <!-- 操作人 -->
          <el-table-column
            prop="username"
            :label="$t('distribUserWallet.operator')"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.sysUser">{{scope.row.sysUser.username}}</span>
            </template>
          </el-table-column>
          <!-- 操作时间 -->
          <el-table-column
            prop="updateTime"
            :label="$t('distribUserWallet.operatorTime')"
            sortable
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.updateTime">无</span>
              <span v-else>{{ scope.row.updateTime }}</span>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            align="center"
            prop="state"
            :label="$t('publics.status')"
          >
            <template slot-scope="scope">
              <div class="tag-text" v-if="scope.row.state === -1">{{ $t("distribUserWallet.perBan") }}</div>
              <div class="tag-text" v-if="scope.row.state === 1">{{ $t("publics.normal") }}</div>
              <div class="tag-text" v-if="scope.row.state === 2">{{ $t("distribUserWallet.ban") }}</div>
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
      addOrUpdateVisible: false
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
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionUserBan/page/anduser'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page ? page.currentPage : this.page.currentPage,
          size: page ? page.pageSize : this.page.pageSize
        }, this.theData))
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
