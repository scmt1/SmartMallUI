<template>
  <div class="mod-category main-container">
    <div class="main-container">
      <div class="operation-bar">
        <div
          class="default-btn primary-btn"
          v-if="isAuth('prod:category:save')"
          @click="addOrUpdateHandle()">{{$t("crud.addTitle")}}</div>
        <div
          class="default-btn primary-btn"
          v-if="isAuth('prod:category:export')"
          @click="exportCategory()">{{$t("order.ExportingFiles")}}</div>
      </div>
      <div class="table-con">
        <el-table :data="dataList"
                  header-cell-class-name="table-header"
                  row-class-name="table-row-low"
                  row-key="categoryId"
                  style="width: 100%;">
          <el-table-column prop="categoryName"
                          treeKey="categoryId"
                          align="left"
                          :label="this.$i18n.t('publics.categoryCn')">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.categoryName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="categoryNameEn"
                          treeKey="categoryId"
                          align="left"
                          :label="this.$i18n.t('publics.categoryEn')">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.categoryNameEn}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status"
                          align="left"
                          :label="this.$i18n.t('product.status')">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0"
                    class="tag-text">{{$t("live.offline")}}</span>
              <span v-else
                    class="tag-text">{{$t("publics.normal")}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="seq"
                          align="left"
                          width="150"
                          :label="this.$i18n.t('hotSearch.seq')">
          </el-table-column>
          <el-table-column fixed="right"
                          align="center"
                          :label="this.$i18n.t('text.menu')">
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('prod:category:update')"
                  @click="addOrUpdateHandle(scope.row.categoryId)">{{$t("groups.edit")}}</div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('prod:category:delete')"
                  @click="deleteHandle(scope.row.categoryId)">{{$t("text.delBtn")}}</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-pagination
      layout="total,sizes, prev, pager, next, jumper"
      :current-page="pages.current"
      :page-size="pages.size"
      :total="pages.total"
      :page-sizes="[10, 20, 30, 40]"
      @size-change="handleSizeChange"
      @current-change="onPageNumChange"
    ></el-pagination>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList(pages.current)"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './category-add-or-update'
// import { treeDataTranslate } from '@/utils'

export default {
  data () {
    return {
      dataForm: {},
      searchForm: {
        categoryName: null,
        status: null
      },
      options: [
        {
          label: this.$i18n.t('publics.normal'),
          value: 1
        },
        {
          label: this.$i18n.t('live.offline'),
          value: 0
        }
      ],
      pages: {
        total: 0, // 总页数
        current: 1, // 当前页数
        size: 10 // 每页显示多少条
      },
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDataList()
  },
  methods: {
    /**
     * 分页页面变化时刷新数据
     * @param page
     */
    onPageNumChange (page) {
      this.getDataList(page)
    },
    /**
     * 分页页目大小变化时刷新数据
     * @param size
     */
    handleSizeChange (size) {
      this.pages.size = size
      this.getDataList()
    },
    // 获取数据列表
    getDataList (current = 1) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/prod/category/pageCategory'),
        method: 'get',
        params: this.$http.adornParams({
          current,
          size: this.pages.size
        })
      }).then(({ data }) => {
        this.pages.total = data.total
        this.pages.current = data.current
        // this.dataList = treeDataTranslate(data.records, 'categoryId', 'parentId')
        this.dataList = data.records
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
      this.$confirm(`${this.$i18n.t('sys.makeSure')}[${this.$i18n.t('text.delBtn')}]${this.$i18n.t('text.menu')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/prod/category/${id}`),
          method: 'delete',
          data: this.$http.adornData()
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList(this.pages.current)
            }
          })
        })
      })
    },

    // 导出
    exportCategory () {
      // let params = {}
      // params = JSON.parse(JSON.stringify(this.searchForm))
      const loading = this.$loading({
        lock: true,
        target: '.mod-category',
        customClass: 'export-load',
        background: 'transparent',
        text: this.$i18n.t('formData.exportIng')
      })
      this.$http({
        url: this.$http.adornUrl('/prod/category/export'),
        method: 'get',
        // params: this.$http.adornParams(params),
        responseType: 'blob'
      }).then(({data}) => {
        loading.close()
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const fileName = this.$i18n.t('category.exportXls')
        const elink = document.createElement('a')
        if ('download' in elink) {
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          // URL.revokeObjectURL(elink.href) // 释放URL 对象
          // document.body.removeChild(elink)
        } else {
          navigator.msSaveBlob(blob, fileName)
        }
        this.$message({
          message: this.$i18n.t('stock.exportSuccess'),
          type: 'success',
          duration: 1500
        })
      }).catch((e) => {
        loading.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-container {
  margin-top: 0;
  padding-top: 0;
}
</style>
