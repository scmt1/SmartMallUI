<template>
  <div class="mod-prod-swiper">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item prop="status" :label="$t('publics.status') + ':'" class="search-form-item">
            <el-select v-model="searchForm.status" :placeholder="$t('publics.status')">
              <el-option :label="$t('publics.disable')" :value="0"></el-option>
              <el-option :label="$t('publics.normal')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="imgType" :label="$t('platform.platform') + ':'" class="search-form-item">
            <el-select v-model="searchForm.imgType" :placeholder="$t('platform.platform')">
              <el-option :label="$t('platform.mobile')" :value="0"></el-option>
              <el-option :label="$t('platform.PCTerminal')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('product.search')}}</div>
            <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('product.reset')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
        <el-checkbox v-model="selectAll" @change="handleSelectAll" class="all-check-btn" v-if="dataList.length">{{$t('publics.selectAll')}}</el-checkbox>
        <div
          class="default-btn primary-btn"
          v-if="isAuth('platform:indexImg:save')"
          @click.stop="addOrUpdateHandle()">
          {{$t('crud.addTitle')}}
          <el-tooltip class="item" effect="dark" :content="$t('publics.maxIndexImgNumOfPlatform')" placement="top">
            <i class="el-icon-warning"></i>
          </el-tooltip>
        </div>
        <div
          :class="[dataListSelections.length <= 0 ? 'disabled-btn' : '', 'default-btn']"
          @click="deleteHandle()"
          v-if="isAuth('platform:indexImg:delete')"
        >{{$t('sys.batchDelete')}}
        </div>
      </div>
      <div class="table-con banner-table">
        <el-table
          ref="bannerListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          @selection-change="handleSelectionChange"
          style="width: 100%">

          <el-table-column
            type="selection"
            v-if="dataList.length"
            width="55">
          </el-table-column>
          <el-table-column
            prop="imgUrl"
            :label="$t('platform.carouselPicture')"
            width="440">
            <template slot-scope="scope">
              <img :src="resourcesUrl + scope.row.imgUrl" height="100" @error="handlePicError" />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="seq"
            :label="$t('brand.sequence')"
            width="auto">
          </el-table-column>
          <el-table-column
            align="center"
            prop="status"
            :label="$t('product.status')"
            width="auto">
             <template slot-scope="scope">
              <span class="tag-text">{{[$t('brand.disable'), $t('brand.normal')][scope.row.status]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="imgType"
            :label="$t('platform.platform')"
            width="auto">
            <template slot-scope="scope">
              <span class="tag-text">{{scope.row.imgType === 0 ? $t('platform.mobile') : $t('platform.PCTerminal') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            width="250">
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('platform:indexImg:update')"
                  @click="addOrUpdateHandle(scope.row.imgId)"
                >{{$t('user.editBtn')}}</div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('platform:indexImg:delete')"
                  @click="deleteHandle(scope.row.imgId)"
                >{{$t('user.deleteBtn')}}</div>
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
import AddOrUpdate from './indexImg-add-or-update'
export default {
  data () {
    return {
      theData: {}, // 保存上次点击查询的请求条件
      dataForm: {
        indexImg: ''
      },
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      // 修改
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        status: '',
        imgType: ''
      },
      selectAll: false
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDataList()
  },
  methods: {
    handlePicError (event) {
      event.target.src = require('@/assets/img/def.png')
    },
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
        url: this.$http.adornUrl('/platform/indexImg/page'),
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
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.imgId
      })
      if (!id && !this.dataListSelections.length) {
        return
      }
      let tip = this.$i18n.t('remindPop.makeSure') + '[' + (id ? this.$i18n.t('remindPop.delete') : this.$i18n.t('remindPop.batchDeletion'))
      tip = tip + ']' + this.$i18n.t('remindPop.operation') + '?'
      this.$confirm(tip, this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/indexImg'),
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
    // 多选变化
    handleSelectionChange (val) {
      this.dataListSelections = val
      this.selectAll = val.length === this.dataList.length
    },

    /**
     * 全选按钮
     */
    handleSelectAll () {
      if (this.$refs.bannerListTable.selection.length < this.dataList.length) {
        this.selectAll = true
      } else {
        this.selectAll = false
      }
      this.$refs.bannerListTable.toggleAllSelection()
    },

    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.prodName = ''
      this.isTop = ''
      this.categoryId = null
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

<style scoped>
>>> .el-table__fixed-right {
  height: 98% !important
}
>>> .el-table__fixed-right::before {
  background-color: transparent;
}
>>> .el-table::before {
  z-index: 6
}
</style>
