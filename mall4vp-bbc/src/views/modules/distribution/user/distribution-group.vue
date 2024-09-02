<template>
  <div class="mod-distribution-user">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="groupName" label="分组名称" class="search-form-item">
            <el-input type="text" v-model="searchForm.groupName" placeholder="分组名称"></el-input>
          </el-form-item>
        </div>
        <div class="btn-row">
          <div class="default-btn primary-btn" @click="searchChange">{{$t('product.search')}}</div>
          <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('product.reset')}}</div>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
        <el-checkbox v-model="selectAll" @change="handleSelectAll" class="all-check-btn">{{$t('publics.selectAll')}}</el-checkbox>
        <div class="default-btn primary-btn"
                   v-if="isAuth('distribution:distributionUserGroup:save')"
                   @click.stop="addOrUpdateHandle(scope.row)">新增</div>

        <div class="default-btn"
                   @click.stop="deleteHandle"
                   v-if="isAuth('distribution:distributionUserGroup:delete')"
                   >批量删除</div>
      </div>
      <div class="table-con prod-table">
        <el-table
          ref="prodListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column
            fixed
            align="center"
            prop="groupName"
            label="分组名称"
            width="auto">
          </el-table-column>
          <el-table-column
            fixed
            align="center"
            prop="updateTime"
            label="修改时间"
            width="auto">
          </el-table-column>
          <el-table-column
            fixed
            align="center"
            prop="username"
            label="操作人"
            width="auto">
          </el-table-column>

          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            width="230"
            >
            <template slot-scope="scope">
              <div class="default-btn text-btn"
                v-if="isAuth('distribution:distributionUserGroup:update')"
                @click="addOrUpdateHandle(scope.row)">编辑</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
import AddOrUpdate from './distribution-group-add-or-update'
export default {
  data () {
    return {
      dataForm: {
        groupName: ''
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      searchForm: {
        groupName: ''
      },
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      selectAll: false
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    // 多选回调
    selectionChange (list) {
      this.dataListSelections = list
    },
    // 新增 / 修改
    addOrUpdateHandle (data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(data)
      })
    },
    // 点击查询
    searchChange () {
      this.getDataList(this.page)
    },
    // 刷新回调
    refreshChange () {
      this.getDataList(this.page)
    },
    // 获取数据列表
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionUserGroup/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page ? page.currentPage : 1,
          size: page ? page.pageSize : 20
        }, this.searchForm))
      }).then(({ data }) => {
        this.page.total = data.total
        this.page.pageSize = data.size
        this.page.currentPage = data.current

        this.dataList = data.records
        this.dataListLoading = false
      })
    },
    // 表单提交
    dataFormSubmit (row, index, done, loading) {
      let param = this.dataForm
      this.$http({
        url: this.$http.adornUrl(`/distribution/distributionUserGroup`),
        method: param.groupId ? 'put' : 'post',
        data: this.$http.adornData(param)
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('remindPop.success'),
          type: 'success',
          duration: 1500,
          onClose: () => {
          }
        })
      })
    },

    // 删除
    deleteHandle (row, index) {
      var ids = row.groupId ? [row.groupId] : this.dataListSelections.map(item => {
        return item.groupId
      })
      if (!ids.length && this.dataListSelections.length <= 0) {
        return
      }
      this.$confirm(`确定进行[${row.groupId ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/distribution/distributionUserGroup'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.refreshChange()
            }
          })
        })
      }).catch(() => { })
    },
    // 多选变化
    handleSelectionChange (val) {
      this.dataListSelections = val
      this.selectAll = val.length === this.dataList.length
    },

    /**
     * 全选按钮
     */
    handleSelectAll () {
      if (this.$refs.bannerListTable.selection.length < this.dataList.length) {
        this.selectAll = true
      } else {
        this.selectAll = false
      }
      this.$refs.bannerListTable.toggleAllSelection()
    },

    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.prodName = ''
      this.isTop = ''
      this.categoryId = null
    },

    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList()
    }
  }
}
</script>
