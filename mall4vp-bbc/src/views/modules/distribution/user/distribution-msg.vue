<template>
  <!-- 分销通知 -->
  <div class="mod-distribution-auditing">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item :label="$t('distributionBind.noticetitle') + ':'">
            <el-input type="text" v-model="searchForm.msgTitle" :placeholder="$t('distributionBind.noticetitle')"></el-input>
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
        <!-- <el-checkbox v-model="selectAll" :disabled="!dataList.length" @change="handleSelectAll" class="all-check-btn">{{$t('publics.selectAll')}}</el-checkbox> -->
        <!-- <span v-if="dataListSelections.length" class="had-selected">{{$t('dataAnalysis.selected')}} {{dataListSelections.length}}</span> -->
        <div
          v-if="isAuth('distribution:distributionMsg:save')"
          class="default-btn primary-btn"
          @click.stop="addOrUpdateHandle()"
        >
          {{ $t("seckill.newAdd") }}
        </div>
        <div
          v-if="isAuth('distribution:distributionMsg:delete')"
          :class="[dataListSelections.length <= 0 ? 'disabled-btn' : '', 'default-btn']"
          :disabled="!dataListSelections.length"
          @click.stop="deleteHandle"
        >
          {{ $t('remindPop.batchDeletion') }}
        </div>
      </div>

      <!-- 表格 -->
      <div class="table-con distribution-msg-table">
        <el-table
          ref="distributionMsgTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
          @selection-change="selectionChange"
        >
          <el-table-column
            type="selection"
            width="60">
          </el-table-column>
          <!-- 通知标题 -->
          <el-table-column
            prop="msgTitle"
            :label="$t('distributionBind.noticetitle')"
            width="500"
          >
            <template slot-scope="scope">
              {{scope.row.msgTitle}}
            </template>
          </el-table-column>
          <!-- 生效时间 -->
          <el-table-column
            min-width="160"
            prop="startTime"
            :label="$t('marketing.castTime')"
            sortable
          >
            <template slot-scope="scope">
              {{ scope.row.startTime }}
            </template>
          </el-table-column>
          <!-- 失效时间 -->
          <el-table-column
            min-width="160"
            prop="endTime"
            :label="$t('marketing.endTime')"
            sortable
          >
            <template slot-scope="scope">
              {{ scope.row.endTime }}
            </template>
          </el-table-column>
          <!-- 操作人 -->
          <el-table-column
            prop="username"
            :label="$t('distribUserWallet.operator')"
          >
            <template slot-scope="scope">
              {{scope.row.sysUser ? scope.row.sysUser.username : ''}}
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
                  v-if="isAuth('distribution:distributionMsg:update')"
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(scope.row.msgId)"
                >
                  {{$t('coupon.edit')}}
                </div>
                <div
                  v-if="isAuth('prod:prod:delete')"
                  class="default-btn text-btn"
                  @click="deleteHandle(scope.row)"
                >
                  {{$t('remindPop.delete')}}
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
import AddOrUpdate from './distribution-msg-add-or-update'
export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      dataForm: {
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
    // 多选回调
    selectionChange (list) {
      this.dataListSelections = list
      this.selectAll = list.length === this.dataList.length
    },
    /**
     * 全选按钮
     */
    handleSelectAll () {
      if (this.$refs.distributionMsgTable.selection.length < this.dataList.length) {
        this.selectAll = true
      } else {
        this.selectAll = false
      }
      this.$refs.distributionMsgTable.toggleAllSelection()
    },
    // 新增 / 修改
    addOrUpdateHandle (msgId) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(msgId)
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
      if (this.page) {
        let size = Math.ceil(this.page.total / this.page.pageSize)
        this.page.currentPage = (this.page.currentPage > size ? size : this.page.currentPage) || 1
      }
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/distribution/distributionMsg/page'),
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
    // 删除
    deleteHandle (row, index) {
      var ids = row.msgId ? [row.msgId] : this.dataListSelections.map(item => {
        return item.msgId
      })
      if (!row.msgId && !this.dataListSelections.length) {
        return
      }
      // `确定进行[${row.msgId ? '删除' : '批量删除'}]操作?`
      var tip = this.$i18n.t('remindPop.makeSure') + '[' + (row.msgId ? this.$i18n.t('remindPop.delete') : this.$i18n.t('remindPop.batchDeletion'))
      tip = tip + ']' + this.$i18n.t('remindPop.operation') + '?'
      this.$confirm(tip, this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/distribution/distributionMsg'),
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
.mod-distribution-auditing {
  .separator {
    line-height: 2.5;
    display: inline-block;
    margin-right: 8px;
  }
}
</style>

