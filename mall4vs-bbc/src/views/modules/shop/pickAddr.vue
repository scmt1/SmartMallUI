<template>
  <div class="mod-pickAddr">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="addrName" :label="$t('station.stationNames')" class="search-form-item">
            <el-input type="text" v-model="searchForm.addrName" :placeholder="$t('station.stationNames')"></el-input>
          </el-form-item>
          <el-form-item prop="mobile" :label="$t('distribution.phoneNum')" class="search-form-item">
            <el-input type="text" v-model="searchForm.mobile" :placeholder="$t('distribution.phoneNum')"></el-input>
          </el-form-item>
          <div class="default-btn primary-btn" @click="searchChange">{{$t('crud.searchBtn')}}</div>
          <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('shop.resetMap')}}</div>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
        <el-checkbox v-model="selectAll" @change="handleSelectAll" class="all-check-btn">{{$t('publics.selectAll')}}</el-checkbox>
        <span v-if="dataListSelections.length" class="had-selected">{{$t('publics.selected')}} {{dataListSelections.length}}</span>
        <div class="default-btn primary-btn"
            @click.stop="addOrUpdateHandle()">{{$t("crud.addTitle")}}</div>

        <div :class="[!dataListSelections.length ? 'disabled-btn':'','default-btn']" 
          @click="deleteHandle()"
          >{{$t("sys.batchDelete")}}</div>
                   
        <div
          class="default-btn primary-btn"
          @click="addOrUpdateHandle()"
          v-if="isAuth('prod:spec:save')"
          >{{$t("crud.addTitle")}}
        </div>
      </div>
      <div class="table-con spec-table">
        <el-table
          ref="specListTable"
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
            type="index"
            align="center"
            :label="$t('number')">
          </el-table-column>
          <el-table-column
            align="center"
            prop="addrName"
            :label="$t('station.stationNames')"
            width="300">
            <template slot-scope="scope">
              <div class="ellipsis-text">{{ scope.row.addrName }}</div>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            prop="mobile"
            :label="$t('distribution.phoneNum')"
            width="auto">
          </el-table-column>

          <el-table-column
            align="center"
            prop="province"
            :label="$t('address.province')"
            width="auto">
          </el-table-column>
          <el-table-column
            align="center"
            prop="city"
            :label="$t('address.city')"
            width="auto">
          </el-table-column>
          <el-table-column
            align="center"
            prop="area"
            :label="$t('temp.area')"
            width="auto">
          </el-table-column>
          <el-table-column
            align="center"
            prop="addr"
            :label="$t('address.addr')"
            width="auto">
          </el-table-column>

          <el-table-column
            align="center"
            fixed="right"
            :label="$t('publics.operating')"
            width="auto"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div class="default-btn text-btn"
                  @click.stop="addOrUpdateHandle(scope.row.addrId)">{{$t("groups.edit")}}</div>
                <div class="default-btn text-btn"
                  @click.stop="deleteHandle(scope.row.addrId)">{{$t("text.delBtn")}}</div>
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
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './pickAddr-add-or-update'
export default {
  data () {
    return {
      dataForm: {
        addrName: ''
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
        addrName: '',
        mobile: ''
      },
      selectAll: false
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    // 获取数据列表
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/shop/pickAddr/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            this.searchForm
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
          return item.addrId
        })
      if (!ids.length) {
        return
      }
      this.$confirm(
        `${this.$i18n.t('sys.makeSure')}[${id ? this.$i18n.t('text.delBtn') : this.$i18n.t('sys.batchDelete')}]${this.$i18n.t('text.menu')}?`,
        this.$i18n.t('text.tips'),
        {
          confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
          cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
          type: 'warning'
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/shop/pickAddr'),
            method: 'delete',
            data: this.$http.adornData(ids, false)
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
        })
        .catch(() => { })
    },
    // 刷新回调用
    refreshChange () {
      this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
    },
    // 条件查询
    searchChange () {
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
      if (this.$refs.prodListTable.selection.length < this.dataList.length) {
        this.selectAll = true
      } else {
        this.selectAll = false
      }
      this.$refs.prodListTable.toggleAllSelection()
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
