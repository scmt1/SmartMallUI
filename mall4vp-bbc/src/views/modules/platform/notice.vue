<template>
  <div class="mod-shop-notice">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item prop="title" :label="$t('shop.announcementTitle') + ':'" class="search-form-item">
            <el-input type="text" v-model="searchForm.title" :placeholder="$t('shop.announcementTitle')"></el-input>
          </el-form-item>
          <el-form-item prop="type" :label="$t('sysManagement.type') + ':'" class="search-form-item">
            <el-select v-model="searchForm.type" :placeholder="$t('sysManagement.type')">
              <el-option :label="$t('shop.showOnPlatform')" :value="1"></el-option>
              <el-option :label="$t('shop.showOnTheUserSide')" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="status" :label="$t('brand.status') + ':'" class="search-form-item">
            <el-select v-model="searchForm.status" :placeholder="$t('brand.status')">
              <el-option :label="$t('publics.cancel')" :value="0"></el-option>
              <el-option :label="$t('publics.publicar')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="isTop" :label="$t('publics.isTop') + ':'" class="search-form-item">
            <el-select v-model="searchForm.isTop" :placeholder="$t('publics.isTop')">
              <el-option :label="$t('publics.no')" :value="0"></el-option>
              <el-option :label="$t('publics.yes')" :value="1"></el-option>
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
        <div
          class="default-btn primary-btn"
          v-if="isAuth('platform:notice:save')"
          @click="addOrUpdateHandle()">
          {{ $t('sysManagement.add') }}
        </div>
      </div>
      <div class="table-con notice-table">
        <el-table
          ref="noticeListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%">
          <el-table-column
            fixed
            type="index"
            width="80"
            :label="$t('brand.serialNumber')">
          </el-table-column>

          <el-table-column
            fixed
            align="left"
            prop="title"
            :label="$t('shop.announcementTitle')"
            width="500">
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.title }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="type"
            :label="$t('sysManagement.type')"
            width="auto">
            <template slot-scope="scope">
              <!-- <span v-if="scope.row.type === 1" class="tag-text">{{ $t('shop.showOnPlatform') }}</span>
              <span v-if="scope.row.type === 2" class="tag-text">{{ $t('shop.showOnTheUserSide') }}</span> -->
              <span class="tag-text">{{ scope.row.exhibition }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="status"
            :label="$t('publics.status')"
            width="auto">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1" class="tag-text">{{ $t('publics.publicar') }}</span>
              <span v-if="scope.row.status === 0" class="tag-text">{{ $t('publics.cancel') }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="isTop"
            :label="$t('publics.isTop')"
            width="auto">
            <template slot-scope="scope">
              <span v-if="scope.row.isTop === 0" class="tag-text">{{$t('publics.no')}}</span>
              <span
                v-else-if="scope.row.isTop === 1"
                class="tag-text"
              >{{$t('publics.yes')}}</span>
            </template>
          </el-table-column>
          
          <el-table-column
            prop="isTop"
            :label="$t('publics.releaseTime')"
            width="150">
            <template slot-scope="scope">
              <span
                class="tag-text"
              >{{scope.row.publishTime}}</span>
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            width="230"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  v-if="isAuth('platform:notice:update')"
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(scope.row.id)"
                >{{$t('user.editBtn')}}</div>
                <div
                  v-if="isAuth('platform:notice:delete')"
                  class="default-btn text-btn"
                  @click.stop="deleteHandle(scope.row.id)"
                >{{$t('remindPop.delete')}}</div>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
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
        title: '',
        isTop: '',
        status: '',
        type: ''
      },
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    getDataList (page, newData = false) {
      if (this.page) {
        let size = Math.ceil(this.page.total / this.page.pageSize)
        this.page.currentPage = (this.page.currentPage > size ? size : this.page.currentPage) || 1
      }
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/notice/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page == null ? this.page.currentPage : page.currentPage,
          size: page == null ? this.page.pageSize : page.pageSize
        }, this.theData))
      }).then(({ data }) => {
        this.dataList = data.records
        this.dataList.forEach(item => {
          const arr = item.types.split(',').map(el => ['', '商家端', '用户端', '供应商端'][el])
          item.exhibition = arr.length ? `在${arr.join('/')}展示` : ''
        })
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
      this.$confirm(this.$i18n.t('seckill.isDeleOper'), this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/notice/' + id),
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
      this.getDataList(this.page)
    },
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
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
