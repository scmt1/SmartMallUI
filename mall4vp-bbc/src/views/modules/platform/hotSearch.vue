<template>
  <div class="mod-hotSearcch">
    <div class="search-bar">
      <el-form :inline="true" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item prop="title" :label="$t('shop.hotTitle') + ':'">
            <el-input v-model="searchForm.title" size="small" :placeholder="$t('shop.hotTitle')"></el-input>
          </el-form-item>
          <el-form-item prop="content" :label="$t('shop.hotContent') + ':'">
            <el-input v-model="searchForm.content" size="small" :placeholder="$t('shop.hotContent')"></el-input>
          </el-form-item>
          <el-form-item prop="status" :label="$t('brand.status') + ':'">
            <el-select v-model="searchForm.status" :placeholder="$t('brand.status')">
              <el-option :label="$t('shop.notEna')" :value="0"></el-option>
              <el-option :label="$t('shop.ena')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('product.search')}}</div>
            <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('product.reset')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
        <el-checkbox v-model="selectAll" @change="handleSelectAll" class="all-check-btn" v-if="dataList.length">{{$t('publics.selectAll')}}</el-checkbox>
        <div
          class="default-btn primary-btn"
          v-if="isAuth('platform:hotSearch:save')"
          @click="addOrUpdateHandle()">
          {{$t('crud.addTitle')}}
        </div>
        <div
          :class="[dataListSelections.length <= 0 ? 'disabled-btn' : '', 'default-btn']"
          @click.stop="deleteHandle"
          v-if="isAuth('platform:indexImg:delete')"
        >{{$t('sys.batchDelete')}}
        </div>
      </div>
      <div class="table-con hot-search-table">
        <el-table
          ref="hotSearchListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          @selection-change="handleSelectionChange"
          style="width: 100%">
         <el-table-column
            type="selection"
            v-if="dataList.length"
            width="55">
          </el-table-column>
          <el-table-column
            align="left"
            prop="title"
            :label="$t('shop.hotTitle')"
            min-width="150">
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="content"
            :label="$t('shop.hotContent')"
             min-width="150">
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="recDate"
            :label="$t('shop.recDate')"
            min-width="200"
            sortable>
          </el-table-column>
          <el-table-column
            align="center"
            prop="seq"
            :label="$t('brand.sequence')"
            width="auto"
            sortable>
          </el-table-column>
          <el-table-column
            align="center"
            prop="status"
            :label="$t('brand.status')"
            width="auto">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0" class="tag-text">{{$t('groups.notEnabled')}}</span>
              <span v-else class="tag-text">{{$t('brand.enAble')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            width="240">
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  v-if="isAuth('platform:hotSearch:update')"
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(scope.row)"
                >{{$t('user.editBtn')}}</div>
                <div
                  v-if="isAuth('platform:hotSearch:delete')"
                  class="default-btn text-btn"
                  @click.stop="deleteHandle(scope.row,scope.index)"
                >{{$t('user.deleteBtn')}}</div>
              </div>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './hotSearch-add-or-update'
export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      dataForm: {

      },
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        content: '',
        status: '',
        title: ''
      },
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
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
        url: this.$http.adornUrl('/platform/hotSearch/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page == null ? this.page.currentPage : page.currentPage,
          size: page == null ? this.page.pageSize : page.pageSize
        }, this.theData))
      }).then(({ data }) => {
        this.page.total = data.total
        this.page.pageSize = data.size
        this.page.currentPage = data.current
        this.dataList = data.records
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 点击查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    // 删除
    deleteHandle (row, index) {
      var ids = row.hotSearchId ? [row.hotSearchId] : this.dataListSelections.map(item => {
        return item.hotSearchId
      })
      if (!ids.length && !this.dataListSelections.length) {
        return
      }
      // `确定进行[${row.hotSearchId ? '删除' : '批量删除'}]操作?`
      var tip = this.$i18n.t('remindPop.makeSure') + '[' + (row.hotSearchId ? this.$i18n.t('remindPop.delete') : this.$i18n.t('remindPop.batchDeletion'))
      tip = tip + ']' + this.$i18n.t('remindPop.operation') + '?'
      this.$confirm(tip, this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/hotSearch'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              if (!row.hotSearchId) {
                this.selectAll = false
              }
              if (this.dataList.length === 1) {
                this.page.currentPage = this.page.currentPage === 1 ? 1 : this.page.currentPage - 1
              }
              this.$forceUpdate()
              this.refreshChange()
            }
          })
        })
      }).catch(() => { })
    },
    // 刷新回调用
    refreshChange () {
      this.getDataList(this.page)
    },
    // 多选变化
    handleSelectionChange (val) {
      this.dataListSelections = val
      this.selectAll = val.length === this.dataList.length
      if (!val.length) {
        this.selectAll = false
      }
    },

    /**
     * 全选按钮
     */
    handleSelectAll () {
      if (this.$refs.hotSearchListTable.selection.length < this.dataList.length) {
        this.selectAll = true
      } else {
        this.selectAll = false
      }
      // this.selectAll = false
      // this.$forceUpdate()
      this.$refs.hotSearchListTable.toggleAllSelection()
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
      console.log(val)
      this.page.currentPage = val
      this.getDataList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
