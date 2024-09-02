<template>
  <div class="mod-prod">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="formName" :label="$t('form.formName')+':'">
            <el-input v-model="searchForm.formName" type="text" clearable  :placeholder="$t('form.formName')"></el-input>
          </el-form-item>
          <el-form-item prop="timeType" :label="$t('form.reportType')+':'">
            <el-select v-model="searchForm.timeType" clearable  :placeholder="$t('form.reportType')">
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
            <div class="default-btn" @click="resetForm('searchForm')">{{ $t('shop.resetMap') }}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="main-container">
       <div class="operation-bar">
        <div
          class="default-btn primary-btn"
          v-if="isAuth('admin:form:save')"
          @click.stop="addOrUpdateHandle()"
        >{{$t("crud.addTitle")}}</div>
      </div>
      <div class="table-con form-table">
          <el-table
            :data="dataList"
            header-cell-class-name="table-header"
            row-class-name="table-row-low"
            style="width: 100%"
          >
            <el-table-column
              align="left"
              prop="formName"
              :label="$t('form.formName')"
            >
            </el-table-column>
            <el-table-column
              align="left"
              prop="updateTime"
              :label="$t('home.updateTime')"
            >
            </el-table-column>
            <el-table-column
              align="left"
              :label="$t('form.reportType')"
            >
              <template slot-scope="scope">
                <span>{{ ['',$t('form.day'),$t('form.week'),$t('form.month')][scope.row.timeType] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('crud.menu')"
              width="220"
              >
              <template slot-scope="scope">
                <div class="text-btn-con">
                  <div class="default-btn text-btn" v-if="isAuth('admin:form:save')" @click="addOrUpdateHandle(scope.row.formId)">{{ $t('text.updateBtn') }}</div>
                  <div class="default-btn text-btn" v-if="isAuth('admin:form:formExcel')" @click="getFormExcel(scope.row)">{{$t("formData.export")}}</div>
                  <div class="default-btn text-btn" v-if="isAuth('admin:form:delete')" @click="deleteHandle(scope.row.formId)">{{ $t('text.delBtn') }}</div>
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
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        timeType: null,
        formName: ''
      },
      reportType: [
        {
          label: this.$i18n.t('form.day'),
          value: 1
        }, {
          label: this.$i18n.t('form.week'),
          value: 2
        }, {
          label: this.$i18n.t('form.month'),
          value: 3
        }
      ]
    }
  },
  components: {
    AddOrUpdate
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
        url: this.$http.adornUrl('/admin/form/page'),
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
        this.$refs.addOrUpdate.init(id, false)
      })
    },
    // 删除
    deleteHandle (id) {
      this.$confirm(`${this.$i18n.t('admin.isDeleOper')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/admin/form/' + id),
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
    searchChange (newData = false) {
      this.getDataList(this.page, newData)
    },
    // 刷新回调
    refreshChange () {
      // this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList()
    },
    getFormExcel (form) {
      this.$http({
        url: this.$http.adornUrl('/admin/form/formExcel'),
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
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList()
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
