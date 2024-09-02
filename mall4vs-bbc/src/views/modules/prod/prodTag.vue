<template>
  <div class="mod-prod-prodTag">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="title" :label="$t('publics.label')" class="search-form-item">
            <el-input type="text" v-model="searchForm.title" :placeholder="$t('publics.label')"></el-input>
          </el-form-item>
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
          @click="addOrUpdateHandle()">{{$t("crud.addTitle")}}
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
            :label="$t('number')">
          </el-table-column>
          <el-table-column
            align="center"
            prop="title"
            :label="$t('publics.label')"
            width="300">
          </el-table-column>

          <el-table-column
            align="center"
            prop="status"
            :label="$t('product.status')"
            width="300">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0"
                class="tag-text"
                    >{{$t("publics.disable")}}</span>
              <span v-else
                      class="tag-text">{{$t("publics.normal")}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            prop="isDfault"
            :label="$t('publics.type')"
            width="300">
            <template slot-scope="scope">
              <span v-if="scope.row.isDefault === 0"
                class="tag-text">{{$t("publics.customType")}}</span>
              <span v-else
                      class="tag-text">{{$t("publics.defaultType")}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="seq"
            :label="$t('publics.seq')"
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
                <div class="default-btn text-btn"
                  @click="addOrUpdateHandle(scope.row.id)">{{$t("crud.updateBtn")}}</div>
                <div class="default-btn text-btn"
                  @click.stop="deleteHandle(scope.row.id)">{{$t("text.delBtn")}}</div>
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

    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './prodTag-add-or-update'
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
        title: '',
        status: ''
      },
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
  },
  mounted () {
  },
  methods: {
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/prod/prodTag/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page == null ? this.page.currentPage : page.currentPage,
          size: page == null ? this.page.pageSize : page.pageSize
        }, this.searchForm))
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
      this.$confirm(this.$i18n.t('admin.isDeleOper') + '?', this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/prod/prodTag/' + id),
          method: 'delete',
          data: this.$http.adornData({})
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
    // 刷新回调用
    refreshChange () {
      this.getDataList(this.page)
    },
    searchChange () {
      this.getDataList(this.page)
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
