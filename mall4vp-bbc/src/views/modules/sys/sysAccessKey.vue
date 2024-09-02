<template>
  <div class="mod-shop-notice">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="title" :label="$t('sys.keyName') + ':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.name" maxlength="30" :placeholder="$t('sys.keyName')"></el-input>
          </el-form-item>
          <el-form-item prop="title" :label="$t('sys.accessId') + ':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.accessId" maxlength="30" :placeholder="$t('sys.accessId')"></el-input>
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
        <div
          class="default-btn primary-btn"
          v-if="isAuth('platform:sysAccessKey:save')"
          @click="addOrUpdateHandle()">
          {{ $t('sysManagement.add') }}
        </div>
      </div>
      <div class="table-con notice-table">
        <el-table
          ref="noticeListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%">

          <el-table-column
            fixed
            align="left"
            prop="title"
            :label="$t('sys.keyName')">
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column
            fixed
            align="left"
            prop="accessId"
            :label="$t('sys.accessId')">
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.accessId }}</span>
            </template>
          </el-table-column>

          <el-table-column
            fixed
            align="left"
            prop="remark"
            :label="$t('crud.remark')">
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.remark }}</span>
            </template>
          </el-table-column>


          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  v-if="isAuth('platform:sysAccessKey:update')"
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(scope.row.sysAccessKeyId)"
                >{{$t('user.editBtn')}}</div>
                <div
                  v-if="isAuth('platform:sysAccessKey:reset')"
                  class="default-btn text-btn"
                  @click="resetKeyHandle(scope.row.sysAccessKeyId)"
                >{{$t('sys.resetKey')}}</div>
                <div
                  v-if="isAuth('platform:sysAccessKey:delete')"
                  class="default-btn text-btn"
                  @click.stop="deleteHandle(scope.row.sysAccessKeyId)"
                >{{$t('remindPop.delete')}}</div>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './sysAccessKey-add-or-update'
export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        name: '',
        accessId: ''
      },
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/platform/sysAccessKey/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page == null ? this.page.currentPage : page.currentPage,
          size: page == null ? this.page.pageSize : page.pageSize
        }, this.theData))
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
    // 重置密钥
    resetKeyHandle (id) {
      this.$confirm(this.$i18n.t('sys.isResetKey'), this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/sysAccessKey/resetAccessKey'),
          method: 'put',
          data: id
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
    deleteHandle (id) {
      this.$confirm(this.$i18n.t('seckill.isDeleOper'), this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/sysAccessKey/' + id),
          method: 'delete',
          data: this.$http.adornData({})
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
    // 刷新回调用
    refreshChange () {
      this.getDataList(this.page)
    },
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.searchForm = {
        name: '',
        accessId: ''
      }
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
</style>
