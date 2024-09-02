<template>
  <div class="mod-prod-brand">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="status" :label="$t('product.status')" class="search-form-item">
            <el-select v-model="searchForm.status" :placeholder="$t('product.status')">
              <el-option :label="$t('publics.disable')" :value="0"></el-option>
              <el-option :label="$t('publics.normal')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <div class="default-btn primary-btn" @click="searchChange">{{$t('crud.searchBtn')}}</div>
          <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('shop.resetMap')}}</div>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
        <div
          class="default-btn primary-btn"
          @click.stop="addOrUpdateHandle()"
          >{{$t('crud.addTitle')}}
        </div>
      </div>
      <div class="table-con spec-table">
        <el-table
          ref="specListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%">
          <el-table-column
            type="index"
            align="center"
            :label="$t('retailProd.number')">
          </el-table-column>

          <el-table-column
            align="center"
            prop="brandName"
            :label="$t('product.brandName')"
            width="300">
            <template slot-scope="scope">
              <div class="ellipsis-text">{{ scope.row.brandName }}</div>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            prop="brandPic"
            :label="$t('product.brandImg')"
            width="300">
             <template slot-scope="scope">
              <img
                :src="resourcesUrl + scope.row.brandPic"
                width="100"
                height="100"
                v-if="scope.row.brandPic"
              />
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            prop="seq"
            :label="$t('temp.sequence')"
            width="300">
          </el-table-column>

          <el-table-column
            align="center"
            prop="status"
            :label="$t('product.status')"
            width="300">

          </el-table-column>


          <el-table-column
            align="center"
            fixed="right"
            :label="$t('publics.operating')"
            width="auto"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(scope.row.brandId)"
                  >{{$t('crud.updateBtn')}}
                </div>
                <div
                  class="default-btn text-btn"
                  @click="deleteHandle(scope.row.brandId)"
                  >{{$t('text.delBtn')}}
                </div>
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
    <add-or-update v-if="addOrUpdateVisible" :isFirst="false" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './brand-add-or-update'

export default {
  data () {
    return {
      dataForm: {
        indexImg: ''
      },
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      // 修改
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        status: ''
      }
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
        url: this.$http.adornUrl('/admin/brand/page'),
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
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.imgId
      })
      this.$confirm(`${this.$i18n.t('sys.makeSure')}[${this.$i18n.t('text.delBtn')}]${this.$i18n.t('text.menu')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/admin/brand/' + ids),
          method: 'delete'
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
    selectionChange (val) {
      this.dataListSelections = val
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
.mod-prod-brand{
  ::v-deep .el-table__fixed-right {
    height: 100% !important; //设置高优先，以覆盖内联样式
  }
  ::v-deep .el-table__fixed{
    height: 100% !important; //设置高优先，以覆盖内联样式
  }
}
</style>
