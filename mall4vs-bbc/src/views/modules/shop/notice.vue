<template>
  <div class="mod-shop-notice">
    <div class="notice-list-mod">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
          <div class="input-row">
            <el-form-item prop="title" :label="$t('shop.announcementTitle')+':'">
              <el-input v-model="searchForm.title" type="text" clearable  :placeholder="$t('shop.announcementTitle')"></el-input>
            </el-form-item>
            <el-form-item prop="status" :label="$t('product.status')+':'">
              <el-select v-model="searchForm.status" clearable  :placeholder="$t('product.status')">
                <el-option
                  v-for="item in status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="isTop" :label="$t('shop.isTop')+':'">
              <el-select v-model="searchForm.isTop" clearable  :placeholder="$t('shop.isTop')">
                <el-option
                  v-for="item in isTopOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
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
      <!-- 搜索栏end -->
      <!-- 表格 -->
      <div class="main-container">
        <div class="operation-bar">
          <div v-if="isAuth('shop:notice:save')" class="default-btn primary-btn" @click="addOrUpdateHandle(0)">{{ $t('crud.addBtn') }}</div>
        </div>
        <div class="table-con notice-table">
          <el-table
            :data="dataList"
            header-cell-class-name="table-header"
            row-class-name="table-row-low"
            style="width: 100%"
          >
            <el-table-column
              :label="$t('number')"
              type="index"
              align="left"
              width="150">
            </el-table-column>
            <el-table-column
              align="left"
              prop="title"
              :label="$t('shop.announcementTitle')"
            >
              <template slot-scope="scope">
                <span class="table-cell-text">{{ scope.row.title}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              :label="$t('product.status')"
            >
              <template slot-scope="scope">
                <span>{{ [$t('publics.cancel'),$t('publics.publicar')][scope.row.status] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              prop="isTop"
              :label="$t('product.isTop')"
            >
              <template slot-scope="scope">
                <span>{{ [$t('publics.no'),$t('publics.yes')][scope.row.isTop] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              prop="isTop"
              width="150"
              :label="$t('publics.releaseTime')"
            >
              <template slot-scope="scope">
                <span>{{scope.row.publishTime}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('crud.menu')"
              width="200"
              fixed="right"
              >
              <template slot-scope="scope">
                <div class="text-btn-con">
                  <div v-if="isAuth('shop:notice:update')" class="default-btn text-btn" @click="addOrUpdateHandle(scope.row.id)">{{ $t('text.updateBtn') }}</div>
                  <div v-if="isAuth('shop:notice:delete')" class="default-btn text-btn" @click="deleteHandle(scope.row.id)">{{ $t('text.delBtn') }}</div>
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
      <!-- 表格end -->
    </div>
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './notice-add-or-update'
export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        title: null,
        status: null,
        isTop: null
      },
      dataListLoading: false,
      addOrUpdateVisible: false,
      isTopOptions: [
        {
          label: this.$i18n.t('publics.no'),
          value: 0
        }, {
          label: this.$i18n.t('publics.yes'),
          value: 1
        }
      ],
      status: [
        {
          label: this.$i18n.t('publics.cancel'),
          value: 0
        }, {
          label: this.$i18n.t('publics.publicar'),
          value: 1
        }
      ]
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDataList()
  },
  methods: {
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
        url: this.$http.adornUrl('/shop/notice/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page == null ? this.page.currentPage : page.currentPage,
          size: page == null ? this.page.pageSize : page.pageSize
        }, this.theData))
      }).then(({ data }) => {
        console.log(data)
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
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(this.$i18n.t('admin.isDeleOper') + '?', this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/shop/notice/' + id),
          method: 'delete',
          data: this.$http.adornData({})
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
      // this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
    },
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.getDataList(this.page, newData)
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

<style lang="scss" scoped>

</style>
