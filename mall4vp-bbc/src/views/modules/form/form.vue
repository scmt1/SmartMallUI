<template>
  <div class="mod-form">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item prop="formName" :label="$t('formData.formName')+':'">
            <el-input v-model="searchForm.formName" type="text" clearable  :placeholder="$t('formData.formName')"></el-input>
          </el-form-item>
          <el-form-item prop="timeType" :label="$t('formData.reportType')+':'">
            <el-select v-model="searchForm.timeType" clearable  :placeholder="$t('formData.reportType')">
              <el-option
                v-for="item in reportType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
            <div class="default-btn" @click="resetForm('searchForm')">{{ $t('product.reset') }}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
        <div @click.stop="addOrUpdateHandle()" class="default-btn primary-btn">{{$t("crud.addTitle")}}</div>
      </div>
      <div class="table-con">
          <el-table
              :data="dataList"
              header-cell-class-name="table-header"
              row-class-name="table-row-low"
              style="width: 100%"
          >
            <el-table-column
              type="index"
              :label="$t('brand.serialNumber')"
              fixed
              width="80">
            </el-table-column>
            <el-table-column
              :label="$t('formData.formName')"
              prop="formName"
              >
            </el-table-column>
            <el-table-column
              prop="updateTime"
              :label="$t('home.updateTime')"
            >
            </el-table-column>
            <el-table-column
              :label="$t('formData.reportType')"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.timeType === 1">{{$t('formData.day')}}</span>
                <span v-if="scope.row.timeType === 2">{{$t('formData.week')}}</span>
                <span v-if="scope.row.timeType === 3">{{$t('formData.month')}}</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              align="center"
              :label="$t('crud.menu')"
              width="200"
              >
              <template slot-scope="scope">
                <div class="text-btn-con">
                  <div
                    class="default-btn text-btn"
                    @click="addOrUpdateHandle(scope.row.formId)"
                  >{{$t("crud.updateBtn")}}</div>
                  <div
                    class="default-btn text-btn"
                    @click="getFormExcel(scope.row)"
                  >{{$t("formData.export")}}</div>
                  <div
                    class="default-btn text-btn"
                    @click="deleteHandle(scope.row.formId)"
                  >{{$t("crud.delBtn")}}</div>
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
          layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './form-add-or-update'
export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      dataForm: {
        indexImg: ''
      },
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      // 修改
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        timeType: null,
        formName: ''
      },
      isInit: true,
      reportType: [
        {
          label: this.$i18n.t('formData.day'),
          value: 1
        }, {
          label: this.$i18n.t('formData.week'),
          value: 2
        }, {
          label: this.$i18n.t('formData.month'),
          value: 3
        }
      ]
    }
  },
  components: {
    AddOrUpdate
  },
  activated () {
    if (this.isInit) {
      this.isInit = false
      return
    }
    this.getDataList()
  },
  mounted () {
    this.getDataList(this.page)
  },
  methods: {
    // 获取数据列表
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/platform/form/page'),
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
        if (!this.dataList.length && this.page.currentPage > 1) {
          this.page.currentPage = 1
          this.getDataList()
        }
      })
    },

    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, false)
      })
    },
    // 删除
    deleteHandle (id) {
      this.$confirm(this.$i18n.t('seckill.isDeleOper'), this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/form/' + id),
          method: 'delete'
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.succeeded'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              if (this.page.currentPage > 1 && this.dataList.length === 1) {
                this.page.currentPage --
              }
              this.refreshChange()
            }
          })
        })
      })
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
    },
    getFormExcel (form) {
      this.$http({
        url: this.$http.adornUrl('/platform/form/formExcel'),
        method: 'get',
        params: this.$http.adornParams({
          'formId': form.formId
        }),
        responseType: 'blob' // 解决文件下载乱码问题
      }).then(({ data }) => {
        var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const fileName = form.formName + '.xlsx'
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
    }
  }
}
</script>
<style lang="scss" scoped>
.mod-form {
  
}
</style>
