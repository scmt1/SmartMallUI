<template>
  <div class="mod-prod-brand">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item prop="status" :label="$t('product.status')+':'" class="search-form-item">
            <el-select v-model="searchForm.status" :placeholder="$t('product.status')">
              <el-option :label="$t('brand.lowerShelf')" :value="0"></el-option>
              <el-option :label="$t('publics.normal')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('crud.searchBtn')}}</div>
            <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('product.reset')}}</div>
          </el-form-item>
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
            width="80"
            :label="$t('brand.serialNumber')">
          </el-table-column>

          <el-table-column
            prop="name"
            :label="$t('brand.brandName')"
            width="300">
            <template slot-scope="scope">
              <div class="table-cell-text">{{ scope.row.name }}</div>
            </template>
          </el-table-column>

          <el-table-column
            prop="imgUrl"
            :label="$t('brandPopups.brandLogo')"
            >
             <template slot-scope="scope">
               <div class="table-cell-image">
                <img
                  :src="resourcesUrl + scope.row.imgUrl"
                  width="100"
                  height="100"
                  v-if="scope.row.imgUrl"
                />
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="firstLetter"
            :label="$t('brandPopups.brandInitials')"
            width="150">
          </el-table-column>

          <el-table-column
            prop="seq"
            :label="$t('brandPopups.seq')"
            width="300">
          </el-table-column>

          <el-table-column
            prop="status"
            :label="$t('product.status')"
            width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0" class="tag-text">{{$t("brand.lowerShelf")}}</span>
              <span v-else class="tag-text">{{$t("brand.normal")}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            fixed="right"
            :label="$t('publics.operating')"
            width="180"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(scope.row.brandId)"
                  >{{$t('crud.updateBtn')}}
                </div>
                <div
                  v-if="scope.row.status === 0"
                  class="default-btn text-btn"
                  @click="enableOrDisable(scope.row.brandId,scope.row.status)"
                >
                  <!-- 上架 -->
                  {{ $t('publics.UpperShelf') }}
                </div>
                <div
                  v-if="scope.row.status === 1"
                  class="default-btn text-btn"
                  @click="enableOrDisable(scope.row.brandId,scope.row.status)"
                >
                  <!-- 下架 -->
                  {{ $t('publics.LowerShelf') }}
                </div>
                <div
                  class="default-btn text-btn"
                  @click="deleteHandle(scope.row.brandId)"
                  >{{$t('brand.delete')}}
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
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
        url: this.$http.adornUrl('/platform/brand/page'),
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
        
        // 末尾页数据为空重新请求
        if (!this.dataList.length && data.current > 1) {
          this.page.currentPage = 1
          this.getDataList()
        }
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
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.brandId
      })
      this.$confirm(this.$i18n.t('remindPop.makeSure') + ' ' + `[${id ? this.$i18n.t('remindPop.delete') : this.$i18n.t('remindPop.batchDeletion')}]` + ' ' + this.$i18n.t('remindPop.operation') + '?', this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/brand'),
          method: 'delete',
          params: {
            brandId: id
          }
        }).then(({ data }) => {
          this.page.total = this.page.total - ids.length
          this.$message({
            message: this.$i18n.t('remindPop.succeeded'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.refreshChange()
            }
          })
        })
      })
    },
    /**
     * 上架/下架品牌
     */
    enableOrDisable (brandId, sts) {
      var brandObj = {}
      brandObj.brandId = brandId
      brandObj.status = sts === 0 ? 1 : 0
      this.$confirm(sts === 1 ? this.$i18n.t('brandPopups.isConfirmOffline') : this.$i18n.t('brandPopups.isConfirmUpload'), this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/brand/updateBrandStatus'),
          method: 'put',
          data: brandObj
        }).then((data) => {
          this.$message({
            message: this.$i18n.t('remindPop.succeeded'),
            type: 'success',
            duration: 1500,
            onClose: () => this.getDataList(this.page)
          })
        })
      }).catch(() => { })
    },
    // 条件查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
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
