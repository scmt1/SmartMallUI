<template>
  <div class="mod-supplier-supplier">
    <div class="search-bar">
        <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
          <div class="input-row">
            <el-form-item prop="supplierName" :label="$t('shop.supplierName')+':'">
              <el-input v-model="searchForm.supplierName" type="text" clearable  :placeholder="$t('shop.supplierName')" />
            </el-form-item>
            <el-form-item prop="supplierProdCount" :label="$t('shop.supplierCategoryName')+':'">
              <el-select v-model="searchForm.supplierCategoryId" :placeholder="this.$i18n.t('tip.select')">
                <el-option
                  v-for="category in categoryList"
                  :key="category.supplierCategoryId"
                  :label="category.name"
                  :value="category.supplierCategoryId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item >
              <div class="text-btn-con">
                <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
                <div class="default-btn" @click="resetForm('searchForm')">{{ $t('shop.resetMap') }}</div>
              </div>
            </el-form-item>
          </div>
        </el-form>
    </div>
    <div class="main-container">
      <div class="table-con">
        <el-table :data="dataList" header-cell-class-name="table-header" row-class-name="table-row" :row-style="{ height:'70px'}" style="width: 100%">
          <el-table-column :label="$t('shop.supplierName')" prop="supplierName" align="left">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.supplierName}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('shop.supplierCategoryName')" prop="categoryName" align="left">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.categoryName}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('shop.supplierProdCount')" prop="supplierProdCount" align="left">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.supplierProdCount}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('crud.menu')" width="220">
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div v-if="isAuth('supplier:prod:edit') && scope.row.isDefault !== 1" class="default-btn text-btn" @click="addOrUpdateHandle(scope.row.supplierId,scope.row.supplierName)">
                  {{ $t('text.editBtn') }}</div>
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
  </div>
</template>

<script>
  export default {
    name: 'stock-supplierProd',
    data () {
      return {
        theData: null, // 保存上次点击查询的请求条件
  
        dataList: [],
        categoryList: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        searchForm: {
          supplierName: '',
          supplierCategoryId: null
        }, // 搜索
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    mounted () {
      this.listCategory().then(({data}) => {
        this.categoryList = data
      })
    },
    activated () {
      this.getDataList(this.page)
    },
    methods: {
      getDataList (page, newData = false) {
        this.dataListLoading = true
        if (newData || !this.theData) {
          this.theData = JSON.parse(JSON.stringify(this.searchForm))
        }
        this.$http({
          url: this.$http.adornUrl('/supplier/supplier/prodSupplierPage'),
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
      addOrUpdateHandle (id, name) {
        this.$router.push({
          path: '/stock-new-supplier-prod',
          query: {
            supplierId: id,
            supplierName: name
          }
        })
      },
      listCategory () {
        return this.$http({
          url: this.$http.adornUrl(`/supplier/supplierCategory/list`),
          method: 'get',
          params: {
            isAll: 1
          }
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
