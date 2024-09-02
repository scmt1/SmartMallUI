<template>
  <div class="mod-role">
    <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
          <div class="input-row">
            <el-form-item prop="roleName" :label="$t('sys.roleName')+':'">
              <el-input v-model="searchForm.roleName" type="text" clearable  :placeholder="$t('sys.roleName')"></el-input>
            </el-form-item>
            <el-form-item >
              <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
              <div class="default-btn" @click="resetForm('searchForm')">{{ $t('shop.resetMap') }}</div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!-- 搜索栏end -->
      <div class="main-container">
        <div class="operation-bar">
          <el-checkbox v-model="selectAll" @change="handleSelectAll" class="all-check-btn">{{$t('publics.selectAll')}}</el-checkbox>
          <span v-if="dataListSelections.length" class="had-selected">{{$t('publics.selected')}} {{dataListSelections.length}}</span>
          <div v-if="isAuth('sys:shopRole:save')" class="default-btn primary-btn" @click="addOrUpdateHandle(0)">{{ $t('crud.addBtn') }}</div>
          <div v-if="isAuth('sys:shopRole:delete')" :class="[!dataListSelections.length ? 'disabled-btn':'','default-btn']"  @click="deleteHandle()">{{ $t('sys.batchDelete') }}</div>
        </div>
        <div class="table-con">
          <el-table
            :data="dataList"
            header-cell-class-name="table-header"
            row-class-name="table-row-low"
            style="width: 100%"
            ref="Table"
            @selection-change="selectionChange"
          >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              align="left"
              prop="roleName"
              :label="$t('sys.roleName')"
            />
            <el-table-column
              align="left"
              prop="remark"
              :label="$t('publics.remark')"
            />
            <el-table-column
              align="left"
              prop="createTime"
              :label="$t('sys.creationTime')"
            />
            <el-table-column
              align="center"
              :label="$t('crud.menu')"
              width="250"
              >
              <template slot-scope="scope">
                <div class="text-btn-con">
                  <div v-if="isAuth('sys:shopRole:update')" class="default-btn text-btn" @click="addOrUpdateHandle(scope.row.roleId)">{{ $t('temp.modify') }}</div>
                  <div v-if="isAuth('sys:shopRole:delete')" class="default-btn text-btn" @click="deleteHandle(scope.row.roleId)">{{ $t('text.delBtn') }}</div>
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
import AddOrUpdate from './shopRole-add-or-update'
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
  mounted () {
    this.getDataList(this.page)
  },
  methods: {
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
        url: this.$http.adornUrl('/sys/shopRole/page'),
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
    /**
     * 全选按钮
     */
    handleSelectAll () {
      if (this.$refs.Table.selection.length < this.dataList.length) {
        this.selectAll = true
      } else {
        this.selectAll = false
      }
      this.$refs.Table.toggleAllSelection()
    },
    // 刷新回调用
    refreshChange () {
      this.getDataList(this.page)
    },
    // 多选变化
    selectionChange (val) {
      this.dataListSelections = val
      this.selectAll = val.length === this.dataList.length
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList(this.page)
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    },
    resetForm () {
      this.searchForm = {
        username: '',
        nickName: ''
      }
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
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.roleId
      })
      if (!ids.length) {
        return
      }
      this.$confirm(`${this.$i18n.t('sys.makeSure')}${id ? this.$i18n.t('text.delBtn') : this.$i18n.t('sys.batchDelete')}${this.$i18n.t('text.menu')}`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/shopRole'),
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
    }
  }
}
</script>
<style lang="scss" scoped>
.mod-role {
}
</style>
