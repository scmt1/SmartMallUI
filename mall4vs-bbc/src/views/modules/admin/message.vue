<template>
  <div class="mod-user">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="userName" :label="$t('sys.userName')" class="search-form-item">
            <el-input type="text" v-model="searchForm.userName" :placeholder="$t('sys.userName')"></el-input>
          </el-form-item>
          <el-form-item prop="status" :label="$t('productComm.status')">
            <el-select v-model="searchForm.status" :placeholder="$t('productComm.status')">
              <el-option :label="$t('productComm.waitPass')" :value="0"></el-option>
              <el-option :label="$t('productComm.pass')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange">{{$t('crud.searchBtn')}}</div>
            <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('shop.resetMap')}}</div>
          </el-form-item>
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
      </div>
      <div class="table-con message-table">
        <el-table
          ref="messageListTable"
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
            prop="createTime"
            :label="$t('sys.creationTime')"
            width="300">
          </el-table-column>

          <el-table-column
            align="center"
            prop="userName"
            :label="$t('sys.userName')"
            width="300">
          </el-table-column>

          <el-table-column
            align="center"
            prop="email"
            :label="$t('sys.email')"
            width="300">
          </el-table-column>
          <el-table-column
            align="center"
            prop="contact"
            :label="$t('sys.connInfo')"
            width="300">
          </el-table-column>
          <el-table-column
            align="center"
            prop="status"
            :label="$t('productComm.status')"
            width="300">
             <template slot-scope="scope">
              <span v-if="scope.row.status === 0"
                      class="tag-text">{{$t("productComm.waitPass")}}</span>
              <span v-else
                     class="tag-text">{{$t("productComm.pass")}}</span>
            </template>
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
                   @click="setMessageRelease(scope.row.id)">{{$t("admin.publicMsg")}}</div>
                <div class="default-btn text-btn"
                          @click="setMessageCancel(scope.row.id)">{{$t("admin.cancelPublic")}}</div>
                <div class="default-btn text-btn"
                          @click="addOrUpdateHandle(scope.row.id)">{{$t("crud.updateBtn")}}</div>
                <div class="default-btn text-btn"
                          @click="deleteHandle(scope.row.id)">{{$t("text.delBtn")}}</div>
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
import AddOrUpdate from './message-add-or-update'

export default {
  data () {
    return {
      dataForm: {
        message: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        userName: '',
        status: ''
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
    // 获取数据列表
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/admin/message/page'),
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
    // 公开留言
    setMessageRelease (id) {
      if (id) {
        this.$http({
          url: this.$http.adornUrl(`/admin/message/release/${id}`),
          method: 'put',
          data: this.$http.adornData({
            id: id
          })
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.visible = false
              this.getDataList(this.page)
            }
          })
        })
      }
    },
    // 取消公开留言
    setMessageCancel (id) {
      if (id) {
        this.$http({
          url: this.$http.adornUrl(`/admin/message/cancel/${id}`),
          method: 'put',
          data: this.$http.adornData({
            id: id
          })
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.visible = false
              this.getDataList(this.page)
            }
          })
        })
      }
    },
    // 删除
    deleteHandle (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      if (!ids.lenght) {
        return
      }
      this.$confirm(`${this.$i18n.t('sys.makeSure')}[${id ? this.$i18n.t('text.delBtn') : this.$i18n.t('sys.batchDelete')}]${this.$i18n.t('text.menu')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/admin/message/${ids}`),
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
    // 条件查询
    searchChange () {
      this.getDataList(this.page)
    },
    // 刷新回调
    refreshChange () {
      this.getDataList(this.page)
    },
    // 多选变化
    handleSelectionChange (val) {
      this.dataListSelections = val
      this.selectAll = val.length === this.dataList.length
    },
    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.prodName = ''
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
.mod-user {
  
}
</style>
