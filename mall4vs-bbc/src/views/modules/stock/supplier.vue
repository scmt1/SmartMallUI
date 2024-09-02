<template>
  <div class="mod-supplier-supplier">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="supplierName" :label="$t('shop.supplierName')+':'">
            <el-input v-model="searchForm.supplierName" size="small" type="text" clearable  :placeholder="$t('shop.supplierName')" />
          </el-form-item>
          <el-form-item prop="contactName" :label="$t('shop.contactName')+':'">
            <el-input v-model="searchForm.contactName" size="small" type="text" clearable  :placeholder="$t('shop.contactName')" />
          </el-form-item>
          <el-form-item prop="contactTel" :label="$t('shop.contactTel')+':'">
            <el-input v-model="searchForm.contactTel" size="small" type="text" clearable  :placeholder="$t('shop.contactTel')" />
          </el-form-item>
          <el-form-item prop="status" :label="$t('product.supplierStatus')+':'">
            <el-select size="small" v-model="searchForm.status" :placeholder="this.$i18n.t('tip.select')">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="supplierProdCount" :label="$t('shop.supplierCategoryName')+':'">
            <el-select size="small" v-model="searchForm.supplierCategoryId" :placeholder="this.$i18n.t('tip.select')">
              <el-option
                v-for="category in categoryList"
                :key="category.supplierCategoryId"
                :label="category.name"
                :value="category.supplierCategoryId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item >
            <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
            <div class="default-btn" @click="resetForm('searchForm')">{{ $t('shop.resetMap') }}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
        <div v-if="isAuth('supplier:supplier:save')" class="default-btn primary-btn" @click="addOrUpdateHandle()">{{ $t("crud.addTitle") }}</div>
        <div class="default-btn" @click.stop="getUpload()">{{ $t('order.ImportingFiles') }}</div>
        <div v-if="isAuth('supplier:supplier:export')" class="default-btn" @click="getExportExcel()">{{ $t('order.ExportingFiles') }}</div>
      </div>
      <div class="table-con">
        <el-table
            :data="dataList"
            header-cell-class-name="table-header"
            row-class-name="table-row-low"
            style="width: 100%">
          <el-table-column :label="$t('shop.supplierName')" prop="supplierName" align="left" width="390">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.supplierName}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('shop.supplierCategoryName')" prop="supplierCategoryName" align="left" width="230">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.categoryName}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('shop.tel')" prop="tel" align="left" width="230">
            <template slot-scope="scope">
                <span class="table-cell-text line-clamp-one">{{scope.row.tel}}</span>
              </template>
          </el-table-column>
          <el-table-column :label="$t('shop.contactName')" prop="contactName" align="left">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.contactName}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('shop.contactTel')" prop="contactTel" align="left" width="110">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.contactTel}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('product.status')" prop="status" align="center">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one" v-if="scope.row.status === 0">{{ $t("publics.disable") }}</span>
              <span class="table-cell-text line-clamp-one" v-if="scope.row.status === 1">{{ $t("shop.ena") }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" :label="$t('crud.menu')" width="220">
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div v-if="isAuth('supplier:supplier:update')" class="default-btn text-btn" @click="addOrUpdateHandle(scope.row.supplierId)">
                  {{ $t('temp.modify') }}</div>
                <div class="default-btn text-btn" v-if="isAuth('supplier:prod:edit') && scope.row.status === 1 && scope.row.isDefault !== 1"
                     @click="addOrUpdateHandleProd(scope.row.supplierId,scope.row.supplierName)">
                  {{ $t('shop.editProd') }}</div>
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
          layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="refreshChange"
                   @refreshCategoryList="listCategory()"></add-or-update>
    <supplier-upload v-if="uploadVisible"
                     ref="supplierUpload"
                     @refreshDataList="getWaitingExcel"></supplier-upload>
  </div>
</template>

<script>
  import AddOrUpdate from './supplier-add-or-update'
  import SupplierUpload from './components/supplier-upload'
  export default {
    data () {
      return {
        theData: null, // 保存上次点击查询的请求条件

        dataList: [],
        categoryList: [],
        options: [{
          value: 0,
          label: '禁用'
        }, {
          value: 1,
          label: '启用'
        }],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        searchForm: {
          supplierName: '',
          contactName: '',
          contactTel: '',
          status: '', // 状态 0禁用 1启用
          supplierCategoryId: null
        }, // 搜索
        dataListLoading: false,
        addOrUpdateVisible: false,
        uploadVisible: false
      }
    },
    components: {
      AddOrUpdate,
      SupplierUpload
    },
    mounted () {
      this.getDataList(this.page)
      this.listCategory()
    },
    methods: {
      getDataList (page, newData = false) {
        this.dataListLoading = true
        if (newData || !this.theData) {
          this.theData = JSON.parse(JSON.stringify(this.searchForm))
        }
        this.$http({
          url: this.$http.adornUrl('/supplier/supplier/page'),
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
        }).then(({data}) => {
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
      // 编辑供应商商品
      addOrUpdateHandleProd (id, name) {
        this.$router.push({
          path: '/stock-new-supplier-prod',
          query: {
            supplierId: id,
            supplierName: name
          }
        })
      },
      getWaitingExcel () {
        this.getDataList(this.page)
      },
      // 跳转至导入选择
      getUpload () {
        this.uploadVisible = true
        this.$nextTick(() => {
          this.$refs.supplierUpload.init()
        })
      },
      getExportExcel () {
        this.$confirm(`${this.$i18n.t('shop.exportTip')}`, this.$i18n.t('text.tips'), {
          confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
          cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
          type: 'warning'
        }).then(() => {
          const loading = this.$loading({
            lock: true,
            target: '.mod-supplier-supplier',
            customClass: 'export-load',
            background: 'transparent',
            text: this.$i18n.t('formData.exportIng')
          })
          this.$http({
            url: this.$http.adornUrl('/supplier/supplier/exportSupplier'),
            method: 'get',
            params: this.$http.adornParams(this.searchForm),
            responseType: 'blob' // 解决文件下载乱码问题
          }).then(({ data }) => {
            loading.close()
            var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
            const fileName = this.$i18n.t('shop.comInfoSorXls')
            const elink = document.createElement('a')
            if ('download' in elink) { // 非IE下载
              elink.download = fileName
              elink.style.display = 'none'
              elink.href = URL.createObjectURL(blob)
              document.body.appendChild(elink)
              elink.click()
              URL.revokeObjectURL(elink.href) // 释放URL 对象
              document.body.removeChild(elink)
            } else { // IE10+下载
              navigator.msSaveBlob(blob, fileName)
            }
          }).catch((e) => {
            loading.close()
          })
        })
      },
      listCategory () {
        this.$http({
          url: this.$http.adornUrl(`/supplier/supplierCategory/list`),
          method: 'get',
          params: {
            isAll: 0
          }
        }).then(({data}) => {
          this.categoryList = data
        })
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
        this.searchForm.supplierCategoryId = null
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
