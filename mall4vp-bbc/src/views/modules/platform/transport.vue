<template>
  <div class="mod-transport">
    <div class="search-bar">
      <el-form :inline="true" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item prop="transName" :label="$t('transport.name') + ':'">
            <el-input v-model="searchForm.transName" size="small" :placeholder="$t('transport.name')"></el-input>
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
        <el-checkbox v-model="selectAll" @change="handleSelectAll" class="all-check-btn">{{$t('publics.selectAll')}}</el-checkbox>
        <div
          class="default-btn primary-btn"
          v-if="isAuth('platform:transport:save')"
          @click="addOrUpdateHandle()">
          {{$t('crud.addTitle')}}
        </div>
        <div
          :class="[dataListSelections.length <= 0 ? 'disabled-btn' : '', 'default-btn']"
          @click.stop="deleteHandle('')"
          v-if="isAuth('platform:transport:delete')"
        >{{$t('sys.batchDelete')}}
        </div>
      </div>
      <div class="table-con transport-table">
        <el-table
          ref="transportListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          @selection-change="handleSelectionChange"
          style="width: 100%">
         <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="left"
            prop="transName"
            :label="$t('transport.name')"
            width="auto">
          </el-table-column>
<!-- <el-table-column
            :label="$t('transport.type')"
            prop="type"
          >
            <template slot-scope="scope">
              <span>{{[$t('transport.buyerPrice'),$t('transport.shopPrice')][scope.row.isFreeFee] }}</span>
            </template>
          </el-table-column> -->

          <el-table-column
            align="left"
            prop="imgType"
            :label="$t('transport.chargePrice')"
          >
            <template slot-scope="scope">
              <span>{{[$t('transport.byCount'),$t('transport.byWeight'),$t('transport.byVolume')][scope.row.chargeType] }}</span>
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
                  v-if="isAuth('platform:transport:update')"
                  class="default-btn text-btn"
                  @click.stop="addOrUpdateHandle(scope.row.transportId)"
                >{{$t('user.editBtn')}}</div>
                <div
                  v-if="isAuth('platform:transport:delete')"
                  class="default-btn text-btn"
                  @click.stop="deleteHandle(scope.row.transportId)"
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @close="addOrUpdateClose" @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './transport-add-or-update'

export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      dataForm: {
        transName: ''
      },
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        transName: ''
      },
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
    addOrUpdateClose () {
      this.addOrUpdateVisible = false
    },
    // 获取数据列表
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (this.page) {
        let size = Math.ceil(this.page.total / this.page.pageSize)
        this.page.currentPage = (this.page.currentPage > size ? size : this.page.currentPage) || 1
      }
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/platform/transport/page'),
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
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.transportId
        })
      if (!ids.length && !this.dataListSelections.length) {
        return
      }
      this.$confirm(
        `${this.$i18n.t('sys.makeSure')}${id ? this.$i18n.t('text.delBtn') : this.$i18n.t('sys.batchDelete')}${this.$i18n.t('text.menu')}?`,
        this.$i18n.t('text.tips'),
        {
          confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
          cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
          type: 'warning'
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/platform/transport'),
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
        })
        .catch(() => { })
    },

    // 条件查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    // 刷新回调用
    refreshChange () {
      this.getDataList(this.page)
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
      if (this.$refs.transportListTable.selection.length < this.dataList.length) {
        this.selectAll = true
      } else {
        this.selectAll = false
      }
      this.$refs.transportListTable.toggleAllSelection()
    },
    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
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
<style lang="scss" scoped>
.mod-transport {

}
</style>
