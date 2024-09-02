<template>
  <div class="mod-distribution-auditing">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item :label="$t('distributionMsg.distriTelPhone') + ':'">
            <el-input type="text" v-model="searchForm.userMobile" :placeholder="$t('distributionMsg.distriTelPhone')"></el-input>
          </el-form-item>
          <el-form-item prop="state" :label="$t('distributionMsg.auditStatus') + ':'">
            <el-select v-model="searchForm.state" :placeholder="$t('distributionMsg.auditStatus')" clearable>
              <el-option :label="$t('product.pendingReview')" :value="0"></el-option>
              <el-option :label="$t('productComm.pass')" :value="1"></el-option>
              <el-option :label="$t('productComm.noPass')" :value="-1"></el-option>
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
      <div class="table-con distribution-auditing-table">
        <el-table
          ref="distributionAuditingTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <!-- 昵称 -->
          <el-table-column
            prop="nickName"
            :label="$t('users.nickName')"
          >
            <template slot-scope="scope">
              {{scope.row.nickName}}
            </template>
          </el-table-column>
          <!-- 分销员手机号 -->
          <el-table-column
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
              <span v-if="!scope.row.parentUserMobile">无</span>
              <span v-else>{{scope.row.parentUserMobile}}</span>
            </template>
          </el-table-column>
          <!-- 邀请人 -->
          <el-table-column
            prop="parentNickName"
            :label="$t('distributionMsg.invitees')"
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.parentNickName">无</span>
              <span v-else>{{scope.row.parentNickName}}</span>
            </template>
          </el-table-column>
          <!-- 积累消费金额 -->
          <el-table-column
            prop="sumOfConsumption"
            width="180"
            :label="$t('distributionMsg.accumulatedConsumptionAmount')"
            sortable
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.sumOfConsumption">0</span>
              <span v-else>{{scope.row.sumOfConsumption}}</span>
            </template>
          </el-table-column>
          <!-- 积累消费笔数 -->
          <el-table-column
            prop="expenseNumber"
            width="180"
            :label="$t('distributionMsg.accumulatedConsumptionTimes')"
            sortable
          >
            <template slot-scope="scope">
              <span v-if="!scope.row.expenseNumber">0</span>
              <span v-else>{{scope.row.expenseNumber}}</span>
            </template>
          </el-table-column>
          <!-- 加入时间 -->
          <el-table-column
            prop="auditingTime"
            width="180"
            :label="$t('order.applicationTime')"
            sortable
          >
            <template slot-scope="scope">
              {{ scope.row.auditingTime }}
            </template>
          </el-table-column>
          <!-- 审核状态 -->
          <el-table-column
            prop="state"
            :label="$t('distributionMsg.auditStatus')"
          >
            <template slot-scope="scope">
              <div class="tag-text" v-if="scope.row.state === -1">{{ $t("productComm.noPass") }}</div>
              <div class="tag-text" v-if="scope.row.state === 0">{{ $t("product.pendingReview") }}</div>
              <div class="tag-text" v-if="scope.row.state === 1">{{ $t("productComm.pass") }}</div>
            </template>
          </el-table-column>
          <!-- 操作人 -->
          <el-table-column
            prop="sysUsername"
            :label="$t('distribUserWallet.operator')"
          >
            <template slot-scope="scope">
              {{scope.row.sysUsername}}
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            width="150"
          >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  v-if="scope.row.state === 0 && isAuth('distribution:distributionAuditing:update')"
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(scope.row,true)"
                >
                  {{$t('productComm.audit')}}
                </div>
                <div
                  v-if="scope.row.state !== 0 && isAuth('distribution:distributionAuditing:info')"
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(scope.row,false)"
                >
                  {{$t('seckill.view')}}
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './distribution-auditing-update'
export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      dataForm: {

        // 手机号
        userMobile: '',
        // 状态
        state: '',
        // 时间区间
        dateRange: [],
        nickName: '',
        // 自定义查询
        customQuery: '',
        startTime: null,
        endTime: null,
        startExpenseNumber: '',
        endExpenseNumber: '',
        startPayAmount: '',
        endPayAmount: ''
      },
      searchForm: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 新增 / 修改
    addOrUpdateHandle (data, isEdit) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(data, isEdit)
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
      this.dataListLoading = true
      var params = Object.assign(this.searchForm, {})
      // 日期赋值
      if (params && params.dateRange) {
        params.startTime = params.dateRange[0]
        params.endTime = params.dateRange[1]
        params.dateRange = null
      }
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionAuditing/page'),
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

        // 末尾页数据为空重新请求
        if (!this.dataList.length && this.page.currentPage > 1) {
          this.page.currentPage = 1
          this.getDataList()
        }
      })
    },
    // 表单提交
    dataFormSubmit (row, index, done, loading) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let param = this.dataForm
          this.$http({
            url: this.$http.adornUrl(`/distribution/distributionAuditing`),
            method: 'put',
            data: this.$http.adornData(
              param
              , false)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('remindPop.success'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
              }
            })
          })
        }
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

