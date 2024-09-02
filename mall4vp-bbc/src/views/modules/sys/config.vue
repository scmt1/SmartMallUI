<template>
  <div class="mod-config">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row margin-bottom-none">
          <el-form-item :label="$t('sys.parameteName') + ':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.paramKey" :placeholder="$t('sys.parameteName')"></el-input>
          </el-form-item>
          <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('crud.searchBtn')}}</div>
          <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('product.reset')}}</div>
        </div>
      </el-form>
    </div>

    <div class="main-container">
      <!-- 操作栏 -->
      <div class="operation-bar">
        <el-checkbox v-model="selectAll" :disabled="!dataList.length" @change="handleSelectAll" class="all-check-btn">{{$t('publics.selectAll')}}</el-checkbox>
        <div
          class="default-btn primary-btn"
          @click.stop="addOrUpdateHandle()"
        >
          {{ $t("sysManagement.add") }}
        </div>
        <div
          :class="[dataListSelections.length <= 0 ? 'disabled-btn' : '', 'default-btn']"
          :disabled="dataListSelections.length <= 0"
          @click="deleteHandle()"
        >
          {{ $t('publics.batchDelete') }}
        </div>
      </div>

      <!-- 表格 -->
      <div class="table-con config-table">
        <el-table
          ref="configTable"
          :data="dataList"
          header-cell-class-name="table-header"
          style="width: 100%"
          @selection-change="selectionChange"
          :row-key="getRowKeys"
        >
          <el-table-column
            type="selection"
            :reserve-selection="true"
            width="55">
          </el-table-column>
          <!-- 参数名 -->
          <el-table-column
            prop="paramKey"
            :label="$t('sys.parameteName')"
          >
            <template slot-scope="scope">
              {{scope.row.paramKey}}
            </template>
          </el-table-column>
          <!-- 参数值 -->
          <el-table-column
            prop="paramValue"
            :label="$t('sys.parameterValue')"
          >
            <template slot-scope="scope">
              {{scope.row.paramValue}}
            </template>
          </el-table-column>
          <!-- 备注 -->
          <el-table-column
            prop="remark"
            :label="$t('publics.remark')"
          >
            <template slot-scope="scope">
              {{scope.row.remark}}
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
                  class="default-btn text-btn"
                  @click.stop="addOrUpdateHandle(scope.row.id)"
                >
                  {{$t('coupon.edit')}}
                </div>
                <div
                  class="default-btn text-btn"
                  @click.stop="deleteHandle(scope.row.id)"
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
import AddOrUpdate from './config-add-or-update'
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
  beforeDestroy () {
    this.$refs.configTable.clearSelection()
  },
  created () {
    this.getDataList(this.page)
  },
  methods: {
    // 获取数据列表
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/sys/config/page'),
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
    getRowKeys (row) {
      return row.id
    },
    /**
     * 全选按钮
     */
    handleSelectAll () {
      this.selectAll = this.$refs.configTable.selection.length < this.dataList.length
      this.$refs.configTable.toggleAllSelection()
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
      if (!id && !this.dataListSelections.length) {
        return
      }
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`${this.$i18n.t('sysManagement.confirmSure')}${id ? this.$i18n.t('coupon.delete') : this.$i18n.t('sys.batchDelete')}${this.$i18n.t('sysManagement.operation')}`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('coupon.confirm'),
        cancelButtonText: this.$i18n.t('coupon.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/config'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          this.$refs.configTable.clearSelection()
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

</style>
