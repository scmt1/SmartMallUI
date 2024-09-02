<template>
  <div class="mod-retailProd">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="barCode" :label="$t('retailProd.barCode')+':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.barCode" :placeholder="$t('retailProd.barCode')"></el-input>
          </el-form-item>
          <el-form-item prop="name" :label="$t('retailProd.name')+':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.name" :placeholder="$t('retailProd.name')"></el-input>
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
        <!-- <el-checkbox v-model="selectAll" @change="handleSelectAll" class="all-check-btn">{{$t('publics.selectAll')}}</el-checkbox> -->
        <!-- <span v-if="dataListSelections.length" class="had-selected">{{$t('publics.selected')}} {{dataListSelections.length}}</span> -->
        <div
          class="default-btn primary-btn"
         @click="addOrUpdateHandle()"
          v-if="isAuth('shop:retailProd:save')"
          >{{ $t("product.addNew") }}
        </div>
        <div
          class="default-btn"
          v-if="isAuth('shop:retailProd:import')"
          @click="inportRetailProd()"
          >{{ $t("retailProd.import") }}
        </div>
        <div
          class="default-btn"
          @click="exportRetailProd()"
          v-if="isAuth('shop:retailProd:export')"
          >{{ $t("formData.export") }}
        </div>
        <div
          :class="[!dataListSelections.length ? 'disabled-btn':'','default-btn']"
          @click="deleteHandle()"
          v-if="isAuth('shop:retailProd:delete')"
          >{{ $t("sys.batchDelete") }}
        </div>
      </div>
      <div class="table-con prod-table">
        <el-table
          ref="prodListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            fixed
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            fixed
            align="left"
            prop="pic"
            :label="$t('retailProd.pic')"
            width="100">
            <template slot-scope="scope">
              <div class="table-cell-image">
                <img v-if="scope.row.pic" :src="scope.row.pic">
                <img v-else src="../../../assets/img/def.png">
              </div>
            </template>
          </el-table-column>

          <el-table-column
            align="left"
            prop="barCode"
            :label="$t('retailProd.barCode')"
            width="260">
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.barCode }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="left"
            prop="name"
            :label="$t('retailProd.name')"
            width="260">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="left"
            prop="spec"
            :label="$t('retailProd.spec')"
            width="160">
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.spec }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="left"
            prop="categoryName"
            :label="$t('retailProd.categoryName')"
            width="160">
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.categoryName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="left"
            prop="costPrice"
            :label="$t('retailProd.costPrice')"
            width="160">
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.costPrice }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="left"
            prop="stocks"
            :label="$t('retailProd.stocks')"
            width="150">
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.stocks }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="left"
            prop="unit"
            :label="$t('retailProd.unit')"
            width="150">
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.unit }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            :label="$t('publics.operating')"
            width="130"
            fixed="right"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('shop:retailProd:update')"
                  @click="addOrUpdateHandle(scope.row.retailProdId)"
                  >{{$t('groups.edit')}}
                </div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('shop:retailProd:delete')"
                  @click="deleteHandle(scope.row.retailProdId)"
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
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="refreshChange"
    ></add-or-update>
    <retail-prod-upload
      v-if="uploadVisible"
      ref="retailProdUpload"
      @refreshUpload="refreshUpload"
    ></retail-prod-upload>
  </div>
</template>

<script>
import AddOrUpdate from './retailProd-add-or-update'
import RetailProdUpload from './retail-prod-upload'

export default {
  data () {
    return {
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        barCode: '',
        name: ''
      }, // 搜索
      dataListSelections: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      uploadVisible: false,
      selectAll: false
    }
  },
  components: {
    AddOrUpdate,
    RetailProdUpload
  },
  created () {
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/shop/retailProd/page'),
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
    deleteHandle (id) {
      if (!id && !this.dataListSelections.length) {
        this.$message.warning(this.$i18n.t('marketing.pleaseSelectAProduct'))
        return
      }
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.retailProdId
      })
      this.$confirm(`${this.$i18n.t('sys.makeSure')}[${id ? this.$i18n.t('text.delBtn') : this.$i18n.t('sys.batchDelete')}]${this.$i18n.t('text.menu')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/shop/retailProd'),
          method: 'delete',
          // data: this.$http.adornData({})
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
      }).catch(() => { })
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    refreshUpload () {
      this.getDataList(this.page)
    },
    searchChange () {
      this.getDataList(this.page)
    },
    // 多选变化
    handleSelectionChange (val) {
      this.dataListSelections = val
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
     * 导入单品
     */
    inportRetailProd () {
      this.uploadVisible = true
      this.$nextTick(() => {
        this.$refs.retailProdUpload.init()
      })
    },
    /**
     * 导出单品
     */
    exportRetailProd () {
      this.$http({
        url: this.$http.adornUrl('/shop/retailProd/exportRetailProd'),
        method: 'get',
        params: this.$http.adornParams(this.searchForm),
        responseType: 'blob' // 解决文件下载乱码问题
      }).then(({ data }) => {
        var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const fileName = '单品信息表.xlsx'
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
      })
    },

    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.getDataList()
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
.mod-retailProd {
 .leftP {
   padding-left: 20px;
 }
}
</style>
