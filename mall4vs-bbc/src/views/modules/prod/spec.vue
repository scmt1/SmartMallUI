<template>
  <div class="mod-prod">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="propName" :label="$t('product.attributeName')" class="search-form-item">
            <el-input type="text" v-model="searchForm.propName" :placeholder="$t('product.attributeName')"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('crud.searchBtn')}}</div>
            <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('shop.resetMap')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
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
          row-class-name="table-row-low"
          style="width: 100%">
          <el-table-column
            type="index"
            align="left"
            :label="$t('retailProd.number')"
            width="100">
          </el-table-column>
          <el-table-column
            align="left"
            prop="propName"
            :label="$t('product.attributeName')"
            width="340">
            <template slot-scope="scope">
              <div class="table-cell-text">{{ scope.row.propName }}</div>
            </template>
          </el-table-column>

          <el-table-column
            align="left"
            prop="propNameEn"
            :label="$t('product.attributeNameEn')"
            width="340">
            <template slot-scope="scope">
              <div class="table-cell-text">{{ scope.row.propNameEn }}</div>
            </template>
          </el-table-column>

          <el-table-column
            align="left"
            prop="prodPropValues"
            :label="$t('product.attributeValue')"
            width="340">
            <template slot-scope="scope">
              <div class="table-cell-text">{{ scope.row.propValueList.join('/') }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="prodPropValuesEn"
            :label="$t('product.attributeValueEn')"
            width="340">
            <template slot-scope="scope">
              <div class="table-cell-text">{{ scope.row.propValueEnList.join('/') }}</div>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            fixed="right"
            width="130"
            :label="$t('publics.operating')"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('prod:spec:update')"
                  @click.stop="addOrUpdateHandle(scope.row)"
                  >{{$t('groups.edit')}}
                </div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('prod:spec:delete')"
                  @click.stop="deleteHandle(scope.row.propId)"
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './spec-add-or-update'
export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      dataForm: {
        prodProp: ''
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
        propName: ''
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
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/prod/spec/page'),
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
        for (let i = 0; i < data.records.length; i++) {
          let item = data.records[i]
          item.propValueList = []
          item.propValueEnList = []
          for (let j = 0; j < item.prodPropValues.length; j++) {
            const element = item.prodPropValues[j]
            item.propValueList.push(element.propValue)
            item.propValueEnList.push(element.propValueEn)
          }
        }
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (val) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(val)
      })
    },
    // 删除
    deleteHandle (id) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.propId
      })
      this.$confirm(`${this.$i18n.t('sys.makeSure')}[${id ? this.$i18n.t('text.delBtn') : this.$i18n.t('sys.batchDelete')}]${this.$i18n.t('text.menu')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/prod/spec/${ids}`),
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
    // 刷新回调用
    refreshChange () {
      this.getDataList(this.page)
    },
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.getDataList(this.page, newData)
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
</style>
