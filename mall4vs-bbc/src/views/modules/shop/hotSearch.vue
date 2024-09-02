<template>
  <div class="mod-hotSearcch">
  <div class="search-bar">
    <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
      <div class="input-row">
        <el-form-item prop="title" :label="$t('shop.hotTitle')+':'">
          <el-input v-model="searchForm.title" type="text" clearable  :placeholder="$t('shop.hotTitle')"></el-input>
        </el-form-item>
        <el-form-item prop="content" :label="$t('shop.hotContent')+':'">
          <el-input v-model="searchForm.content" type="text" clearable  :placeholder="$t('shop.hotContent')"></el-input>
        </el-form-item>
        <el-form-item prop="status" :label="$t('shop.enableStatus')+':'">
          <el-select v-model="searchForm.status" clearable  :placeholder="$t('shop.enableStatus')">
            <el-option
              v-for="item in enableStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
          <div class="default-btn" @click="resetForm('searchForm')">{{ $t('shop.resetMap') }}</div>
        </el-form-item>
      </div>
    </el-form>
  </div>
  <div class="main-container">
    <div class="operation-bar">
      <el-checkbox v-if="isAuth('admin:indexImg:delete')" v-model="selectAll" @change="handleSelectAll" class="all-check-btn">{{$t('publics.selectAll')}}</el-checkbox>
      <span v-if="dataListSelections.length" class="had-selected">{{$t('publics.selected')}} {{dataListSelections.length}}</span>
      <div class="default-btn primary-btn" v-if="isAuth('admin:hotSearch:save')" @click="addOrUpdateHandle()">{{$t("crud.addTitle")}}</div>
      <div :class="[!dataListSelections.length?'disabled-btn':'','default-btn']" v-if="isAuth('admin:hotSearch:delete')" @click.stop="deleteHandle">{{$t("sys.batchDelete")}}</div>
    </div>
    <div class="table-con">
      <el-table
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          @selection-change="selectionChange"
          style="width: 100%"
          ref="hotTable"
          @select-all="clearAllSelection"
      >
        <el-table-column
          type="selection"
          width="65">
        </el-table-column>
        <el-table-column
          :label="$t('shop.hotTitle')"
          align="left"
          prop="title">
          <template slot-scope="scope">
            <span class="table-cell-text">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          align="left"
          :label="$t('shop.hotContent')"
        >
          <template slot-scope="scope">
            <span class="table-cell-text">{{ scope.row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="recDate"
          align="left"
          :label="$t('shop.recDate')"
        >
        </el-table-column>
        <el-table-column
          align="left"
          prop="seq"
          :label="$t('temp.sequence')"
        >
        </el-table-column>
        <el-table-column
          align="left"
          :label="$t('shop.enableStatus')"
        >
          <template slot-scope="scope">
            <span>{{ [$t('live.offline'),$t('publics.normal')][scope.row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('crud.menu')"
          fixed="right"
          width="180"
          >
          <template slot-scope="scope">
            <div class="text-btn-con">
              <div v-if="isAuth('admin:hotSearch:update')" class="default-btn text-btn" @click="addOrUpdateHandle(scope.row)">{{ $t('text.updateBtn') }}</div>
              <div v-if="isAuth('admin:hotSearch:delete')" class="default-btn text-btn" @click="deleteHandle(scope.row,scope.index)">{{ $t('text.delBtn') }}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="refreshChange"></add-or-update>
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
        title: '',
        content: '',
        status: null
      },
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      enableStatus: [
        {
          label: this.$i18n.t('live.offline'),
          value: 0
        }, {
          label: this.$i18n.t('publics.normal'),
          value: 1
        }
      ],
      selectAll: false
    }
  },
  components: {
    AddOrUpdate
  },
  mounted () {
    this.getDataList(this.page)
  },
  methods: {
    // 清空全选框选中状态
    clearAllSelection () {
      if (!this.dataList.length) {
        this.$refs.hotTable.clearSelection()
      }
    },
    // 获取数据列表
    getDataList (page, newData = false) {
      if (this.page) {
        let size = Math.ceil(this.page.total / this.page.pageSize)
        this.page.currentPage = (this.page.currentPage > size ? size : this.page.currentPage) || 1
      }
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/admin/hotSearch/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page ? page.currentPage : 1,
          size: page ? page.pageSize : 20
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
     * 全选按钮
     */
    handleSelectAll () {
      if (this.$refs.hotTable.selection.length < this.dataList.length) {
        this.selectAll = true
      } else {
        this.selectAll = false
      }
      this.$refs.hotTable.toggleAllSelection()
    },
    // 多选回调
    selectionChange (list) {
      this.dataListSelections = list
      this.selectAll = list.length === this.dataList.length
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
      this.page.pageSize = 10
      this.getDataList(this.page, newData)
    },
    // 删除
    deleteHandle (row, index) {
      var ids = row.hotSearchId ? [row.hotSearchId] : this.dataListSelections.map(item => {
        return item.hotSearchId
      })
      if (!ids.length) {
        return
      }
      this.$confirm(`${this.$i18n.t('sys.makeSure')}[${row.hotSearchId ? this.$i18n.t('text.delBtn') : this.$i18n.t('sys.batchDelete')}]${this.$i18n.t('text.menu')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/admin/hotSearch'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          this.page.total = this.page.total - ids.length
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
    // 刷新回调用
    refreshChange () {
      this.getDataList(this.page)
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList(this.page)
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
