<template>
  <div class="mod-user">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item :label="$t('sys.userName') + ':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.username" :placeholder="$t('sys.userName')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('sys.nickName') + ':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.nickName" :placeholder="$t('sys.nickName')"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('crud.searchBtn')}}</div>
            <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('product.reset')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="main-container">
      <!-- 操作栏 -->
      <div class="operation-bar">
        <el-checkbox v-model="selectAll" :disabled="!dataList.length" @change="handleSelectAll" class="all-check-btn">{{$t('publics.selectAll')}}</el-checkbox>
        <!-- <span v-if="dataListSelections.length" class="had-selected">{{$t('dataAnalysis.selected')}} {{dataListSelections.length}}</span> -->
        <div
          v-if="isAuth('sys:user:save')"
          class="default-btn primary-btn"
          @click.stop="addOrUpdateHandle()"
        >
          {{ $t("sysManagement.add") }}
        </div>
        <div
          v-if="isAuth('sys:user:delete')"
          :class="[dataListSelections.length <= 0 ? 'disabled-btn' : '', 'default-btn']"
          :disabled="dataListSelections.length <= 0"
          @click="deleteHandle()">
          {{ $t('sys.batchDelete') }}
        </div>
      </div>

      <!-- 表格 -->
      <div class="table-con sys-user-table">
        <el-table
          ref="sysUserTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
          @selection-change="selectionChange"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <!-- 用户名 -->
          <el-table-column
            prop="username"
            :label="$t('sys.userName')"
          >
            <template slot-scope="scope">
              <span>{{scope.row.username}}</span>
              <span v-if="scope.row.userId === 1" class="super-admin">{{$t('sys.superAdmin')}}</span>
            </template>
          </el-table-column>
          <!-- 用户昵称 -->
          <el-table-column
            prop="nickName"
            :label="$t('sys.nickName')"
          >
            <template slot-scope="scope">
              {{scope.row.nickName}}
            </template>
          </el-table-column>
          <!-- 邮箱 -->
          <el-table-column
            prop="email"
            :label="$t('sys.email')"
          >
            <template slot-scope="scope">
              {{scope.row.email}}
            </template>
          </el-table-column>
          <!-- 联系电话 -->
          <el-table-column
            prop="mobile"
            :label="$t('publics.phoneNumber')"
          >
            <template slot-scope="scope">
              {{scope.row.mobile}}
            </template>
          </el-table-column>
          <!-- 创建时间 -->
          <el-table-column
            prop="createTime"
            :label="$t('sys.creationTime')"
          >
            <template slot-scope="scope">
              {{scope.row.createTime}}
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            prop="status"
            :label="$t('product.status')"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.status === 0">{{ $t('publics.disable') }}</div>
              <div v-if="scope.row.status === 1">{{ $t('publics.normal') }}</div>
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
                  v-if="isAuth('sys:user:update')"
                  class="default-btn text-btn"
                  @click.stop="addOrUpdateHandle(scope.row.userId)"
                >
                  {{$t('coupon.edit')}}
                </div>
                <div
                  v-if="isAuth('sys:user:delete')"
                  class="default-btn text-btn"
                  @click.stop="deleteHandle(scope.row.userId)"
                >
                  {{$t('coupon.delete')}}
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
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './user-add-or-update'
export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {},
      selectAll: false
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList (page, newData = false) {
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/sys/user/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            this.theData
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 条件查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    // 刷新回调用
    refreshChange () {
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    // 多选变化
    selectionChange (val) {
      this.dataListSelections = val
      this.selectAll = val.length === this.dataList.length
    },
    /**
     * 全选按钮
     */
    handleSelectAll () {
      if (this.$refs.sysUserTable.selection.length < this.dataList.length) {
        this.selectAll = true
      } else {
        this.selectAll = false
      }
      this.$refs.sysUserTable.toggleAllSelection()
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      var userIds = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
      })
      if (!id && !this.dataListSelections.length) {
        return
      }
      this.$confirm(`${this.$i18n.t('sysManagement.confirmSure')}${id ? this.$i18n.t('coupon.delete') : this.$i18n.t('sys.batchDelete')}${this.$i18n.t('sysManagement.operation')}`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('coupon.confirm'),
        cancelButtonText: this.$i18n.t('coupon.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/user'),
          method: 'delete',
          data: this.$http.adornData(userIds, false)
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
.mod-user {
  .super-admin {
    color: #e43130;
  }
}
</style>
