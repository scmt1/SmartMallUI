<template>
  <div class="mod-p-delivery">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item prop="dvyName" :label="$t('order.logisticsCompanyName') + ':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.dvyName" :placeholder="$t('order.logisticsCompanyName')"></el-input>
          </el-form-item>
          <el-form-item prop="dvyNo" :label="`${$t('platform.logisticsCompanyNumber')}(${$t('sysManagement.expressBird')}):`" class="search-form-item">
            <el-input type="text" v-model="searchForm.dvyNo" :placeholder="`${$t('platform.logisticsCompanyNumber')}(${$t('sysManagement.expressBird')})`"></el-input>
          </el-form-item>

          <el-form-item prop="dvyNoHd" :label="`${$t('platform.logisticsCompanyNumber')}(${$t('sysManagement.quick100')}):`" class="search-form-item">
            <el-input type="text" v-model="searchForm.dvyNoHd" :placeholder="`${$t('platform.logisticsCompanyNumber')}(${$t('sysManagement.quick100')})`"></el-input>
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
          v-if="isAuth('platform:delivery:save')"
          @click="addOrUpdateHandle()">
          {{ $t('sysManagement.add') }}
        </div>
      </div>
      <div class="table-con delivery-table">
        <el-table
          ref="deliveryListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%">
          <el-table-column
            fixed
            type="index"
            :label="$t('brand.serialNumber')"
            width="80">
          </el-table-column>

          <el-table-column
            fixed
            prop="dvyName"
            :label="$t('order.logisticsCompanyName')"
            width="300">
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.dvyName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="companyHomeUrl"
            :label="$t('platform.companyHomepage')"
            width="370">
          </el-table-column>
          <el-table-column
            prop="dvyNo"
            :label="`${$t('platform.logisticsCompanyNumber')}（${$t('sysManagement.expressBird')}）`"
            width="220">
          </el-table-column>

          <el-table-column
            prop="dvyNoHd"
            :label="`${$t('platform.logisticsCompanyNumber')}（${$t('sysManagement.quick100')}）`"
            width="220">
          </el-table-column>

          <el-table-column
            prop="aliNo"
            :label="`${$t('platform.logisticsCompanyNumber')}（${$t('sysManagement.ali')}）`"
            width="220">
          </el-table-column>

          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            width="180"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  v-if="isAuth('platform:delivery:update')"
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(scope.row.dvyId)"
                >{{$t('user.editBtn')}}</div>
                <div
                  v-if="isAuth('platform:delivery:delete')"
                  class="default-btn text-btn"
                 @click="deleteHandle(scope.row.dvyId)"
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
import AddOrUpdate from './delivery-add-or-update'
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
        dvyName: '',
        dvyNo: '',
        dvyNoHd: ''
      }, // 搜索
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
      if (this.page) {
        let size = Math.ceil(this.page.total / this.page.pageSize)
        this.page.currentPage = (this.page.currentPage > size ? size : this.page.currentPage) || 1
      }
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/delivery/page'),
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
    deleteHandle (id) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.dvyId
      })
      this.$confirm(this.$i18n.t('seckill.isDeleOper'), this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/delivery/' + id),
          method: 'delete',
          data: this.$http.adornData({})
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
     * 刷新回调
     */
    refreshChange () {
      this.getDataList(this.page)
    },
    searchChange (newData = false) {
      this.getDataList(this.page, newData)
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
<style lang="scss" scoped>
.mod-p-delivery {
  .search-bar {
    .input-row {
      ::v-deep .el-form-item__label-wrap:first-child {
        margin-left: 0 !important;
      }
    }
  }
}
</style>
