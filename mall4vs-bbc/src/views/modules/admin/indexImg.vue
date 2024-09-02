<template>
  <div class="mod-prod-swiper">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
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
          <el-form-item prop="imgType" :label="$t('platform.platform')+':'">
            <el-select v-model="searchForm.imgType" clearable  :placeholder="$t('platform.platform')">
              <el-option
                v-for="item in imgTypes"
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
    <div class="main-container">
      <div class="operation-bar">
        <el-checkbox v-if="isAuth('admin:indexImg:delete')" v-model="selectAll" @change="handleSelectAll" class="all-check-btn">{{$t('publics.selectAll')}}</el-checkbox>
        <span v-if="dataListSelections.length" class="had-selected">{{$t('publics.selected')}} {{dataListSelections.length}}</span>
        <div v-if="isAuth('admin:indexImg:save')" class="default-btn primary-btn" @click="addOrUpdateHandle(0)">
          {{ $t('crud.addBtn') }}
          <el-tooltip class="item" effect="dark" :content="$t('publics.maxIndexImgNumOfPlatform')" placement="top">
            <i class="el-icon-warning"></i>
          </el-tooltip>
        </div>
        <div v-if="isAuth('admin:indexImg:delete')" :class="[!dataListSelections.length ? 'disabled-btn':'','default-btn']"  @click="deleteHandle()">{{ $t('sys.batchDelete') }}</div>
      </div>
      <div class="table-con">
        <el-table
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          :row-style="{ height:'120px'}"
          style="width: 100%"
          ref="imgTable"
          @selection-change="selectionChange"
          @select-all="clearAllSelection"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            :label="$t('temp.rotaImg')"
            align="center"
            prop="imgUrl"
            width="350"
          >
            <template slot-scope="scope">
              <div class="table-cell-image banner-img">
                <img :src="resourcesUrl + scope.row.imgUrl" alt="">
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="seq"
            :label="$t('temp.sequence')"
          >
          </el-table-column>
          <el-table-column
            align="left"
            :label="$t('publics.status')"
          >
            <template slot-scope="scope">
              <span>{{ [$t('publics.disable'),$t('publics.normal')][scope.row.status] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="imgType"
            :label="$t('platform.platform')"
          >
            <template slot-scope="scope">
              <span>{{ [$t('platform.mobile'),$t('platform.pc')][scope.row.imgType] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('crud.menu')"
            width="220"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div v-if="isAuth('admin:indexImg:update')" class="default-btn text-btn" @click="addOrUpdateHandle(scope.row.imgId)">{{ $t('text.updateBtn') }}</div>
                <div v-if="isAuth('admin:indexImg:delete')" class="default-btn text-btn" @click="deleteHandle(scope.row.imgId)">{{ $t('text.delBtn') }}</div>
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
import AddOrUpdate from './indexImg-add-or-update'
export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件

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
        status: null,
        imgType: null
      },
      imgTypes: [
        {
          label: this.$i18n.t('platform.mobile'),
          value: 0
        }, {
          label: this.$i18n.t('platform.pc'),
          value: 1
        }
      ],
      status: [
        {
          label: this.$i18n.t('publics.disable'),
          value: 0
        }, {
          label: this.$i18n.t('publics.normal'),
          value: 1
        }
      ],
      selectAll: false
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDataList(this.page)
  },
  methods: {
    // 清空全选框选中状态
    clearAllSelection () {
      if (!this.dataList.length) {
        this.$refs.imgTable.clearSelection()
      }
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
        url: this.$http.adornUrl('/admin/indexImg/page'),
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
    /**
     * 全选按钮
     */
    handleSelectAll () {
      if (this.$refs.imgTable.selection.length < this.dataList.length) {
        this.selectAll = true
      } else {
        this.selectAll = false
      }
      this.$refs.imgTable.toggleAllSelection()
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
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.imgId
      })
      if (!ids.length) {
        return
      }
      this.$confirm(`${this.$i18n.t('sys.makeSure')}[${id ? this.$i18n.t('text.delBtn') : this.$i18n.t('sys.batchDelete')}]${this.$i18n.t('text.menu')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/admin/indexImg'),
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
      // this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
    },
    // 多选变化
    selectionChange (val) {
      this.dataListSelections = val
      this.selectAll = val.length === this.dataList.length
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
    }
  }
}
</script>

<style lang="scss" scoped>
.mod-prod-swiper{
  .banner-img {
    width: auto;
    height: 94px;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
  }
}

</style>
