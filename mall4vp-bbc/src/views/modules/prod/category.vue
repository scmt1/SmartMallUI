<template>
  <div class="mod-category">
    <el-form>
      <el-form-item>
        <el-alert
          :title="this.$i18n.t('publics.alertMessage1')"
          type="warning"
          show-icon
          :closable="false">
        </el-alert>
      </el-form-item>
    </el-form>
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <div
          v-if="isAuth('prod:category:save')"
          class="default-btn primary-btn"
          @click="addOrUpdateHandle()"
        >{{$t("brand.add")}}</div>
      </el-form-item>
      <el-form-item>
        <div
          v-if="isAuth('prod:category:export')"
          class="default-btn primary-btn"
          @click="exportCategory()"
        >{{$t("order.export")}}</div>
      </el-form-item>
    </el-form>
    <el-table
      ref="table"
      :data="dataList"
      row-key="categoryId"
      style="width: 100%;"
      header-cell-class-name="table-header"
      row-class-name="table-row">
      <el-table-column
        prop="categoryName"
        treeKey="categoryId"
        :label="this.$i18n.t('publics.category')"
      ></el-table-column>
      <el-table-column
        prop="pic"
        width="400px"
        :label="this.$i18n.t('publics.image')"
      >
        <template slot-scope="scope">
          <img :src="resourcesUrl + scope.row.pic " height="100" v-if="scope.row.grade !== 1"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        width="110px"
        :label="this.$i18n.t('publics.status')"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0" class="tag-text">{{$t("brand.offline")}}</span>
          <span v-else class="tag-text">{{$t("brand.normal")}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="seq"
        width="140px"
        align="center"
        :label="this.$i18n.t('hotSearch.seq')"
      ></el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200px"
        :label="this.$i18n.t('crud.menu')"
      >
        <template slot-scope="scope">
          <div class="text-btn-con">
            <div
              v-if="isAuth('prod:category:update')"
              class="default-btn text-btn"
              @click="addOrUpdateHandle(scope.row.categoryId)"
            >{{$t("brand.revise")}}</div>
            <div
              v-if="isAuth('prod:category:delete')"
              class="default-btn text-btn"
              @click="deleteHandle(scope.row.categoryId)"
            >{{$t("brand.delete")}}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './category-add-or-update'
import { treeDataTranslate } from '@/utils'

export default {
  data () {
    return {
      dataForm: {},
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
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/prod/category/listCategory'),
        method: 'get',
        params: this.$http.adornParams({
          maxGrade: 2
        })
      }).then(({ data }) => {
        this.dataList = treeDataTranslate(data, 'categoryId', 'parentId')
        this.$nextTick(() => {
          this.$refs.table.doLayout() // 解决表格错位
        })
        // console.log(this.dataList)
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
    // 导出
    exportCategory () {
      // let params = {}
      // params = JSON.parse(JSON.stringify(this.searchForm))
      const loading = this.$loading({
        lock: true,
        target: '.mod-category',
        customClass: 'export-load',
        background: 'transparent',
        text: this.$i18n.t('shop.exportIng')
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
          message: this.$i18n.t('shop.exportSuccess'),
          type: 'success',
          duration: 1500
        })
      }).catch((e) => {
        loading.close()
      })
    },
    // 删除
    deleteHandle (id) {
      this.$confirm(this.$i18n.t('remindPop.makeSure') + ' ' + `[${this.$i18n.t('remindPop.delete')}]` + ' ' + this.$i18n.t('remindPop.operation') + '？', this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/prod/category/${id}`),
          method: 'delete',
          data: this.$http.adornData()
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.mod-category {
  // ::v-deep .el-table__fixed-right {
  //   height: 100% !important; //设置高优先，以覆盖内联样式
  // }
  // ::v-deep .el-table__fixed{
  //   height: 100% !important; //设置高优先，以覆盖内联样式
  // }

  img {
    height: 80px;
  }
  ::v-deep .el-form-item__content{
    line-height: 24px;
  }
  ::v-deep .el-alert__content {
    // line-height: 1.5em;
    padding: 6px 8px;
  }
  ::v-deep .export-load {
    top: -50% !important;
    left: -10% !important;
  }
}
</style>
