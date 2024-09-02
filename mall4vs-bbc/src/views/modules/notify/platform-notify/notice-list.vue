<template>
  <div class="mod-shop-notice">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
          <div class="input-row">
            <el-form-item prop="title" :label="$t('shop.announcementTitle')+':'">
              <el-input v-model="searchForm.title" type="text" clearable  :placeholder="$t('shop.announcementTitle')"></el-input>
            </el-form-item>
            <el-form-item prop="publishTime" :label="$t('publics.releaseTime')+':'">
              <el-date-picker
                v-model="dateRange"
                type="datetimerange"
                :range-separator="$t('time.tip')"
                value-format="yyyy-MM-dd HH:mm:ss"
                :start-placeholder="$t('time.start')"
                :end-placeholder="$t('time.end')"
              ></el-date-picker>
            </el-form-item>
            <el-form-item >
              <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
              <div class="default-btn" @click="resetForm('searchForm')">{{ $t('shop.resetMap') }}</div>
            </el-form-item>
          </div>
        </el-form>
    </div>
    <div class="main-container">
      <div class="table-con">
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
            width="100"
          />
          <el-table-column
            prop="title"
            :label="$t('shop.announcementTitle')"
          />
          <el-table-column
            prop="publishTime"
            :label="$t('publics.releaseTime')"
          />
          <el-table-column
            align="center"
            :label="$t('crud.menu')"
            width="250"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div class="default-btn text-btn" @click="viewNotice(scope.row.id)">{{$t('live.view')}}</div>
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
    <el-dialog
      :title="this.$i18n.t('notice.plaNotice')"
      :visible.sync="viewDialog"
      width="690px"
      :before-close="handleClose">
      <p style="text-align: center">{{dataForm.title}}</p>
      <div class="notice-html-con">
        <span v-html="dataForm.content"></span>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="default-btn primary-btn" @click="viewDialog = false">{{$t('groups.determine')}}</div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        theData: null, // 保存上次点击查询的请求条件
        theParams: null, // 保存上次点击查询的请求条件
        dataList: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        searchForm: {
          title: ''
        },
        dateRange: [],
        dataListLoading: false,
        viewDialog: false,
        dataForm: {}
      }
    },
    created () {
    },
    mounted () {
      this.getDataList(this.page)
      let title = this.$t('notice.plaNotice')
      this.$store.commit('common/replaceSelectMenu', title)
    },
    methods: {
      // 查看单个平台公告
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl('/shop/notice/info/' + this.dataForm.id),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              data.content = this.DOMPurify.sanitize(data.content)
              this.dataForm = data
            })
          }
        })
      },
      // 关闭弹窗
      handleClose (done) {
        done()
        this.viewDialog = false
      },
      getDataList (page, newData = false) {
        if (newData || !this.theData) {
          this.theParams = JSON.parse(JSON.stringify(this.searchForm))
          this.theData = {
            current: page == null ? this.page.currentPage : page.currentPage,
            size: page == null ? this.page.pageSize : page.pageSize,
            'beginTime': this.dateRange ? this.dateRange[0] : null, // 开始时间
            'endTime': this.dateRange ? this.dateRange[1] : null // 结束时间
          }
        } else {
          this.theData.current = page == null ? this.page.currentPage : page.currentPage
          this.theData.size = page == null ? this.page.pageSize : page.pageSize
        }
        this.$http({
          url: this.$http.adornUrl('/shop/notice/listPage'),
          method: 'get',
          params: this.$http.adornParams(Object.assign(this.theData, this.theParams))
        }).then(({data}) => {
          this.dataList = data.records
          this.page.total = data.total
          this.dataListLoading = false
        })
      },
      // 查看
      viewNotice (id) {
        this.viewDialog = true
        this.$nextTick(() => {
          this.init(id)
        })
      },
      // 清空自定义数据
      searchReset () {
        this.dateRange = []
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
        this.dateRange = []
      }
    }
  }
</script>

<style lang="scss" scoped>
.mod-shop-notice {
  .notice-html-con {
    max-height: 370px;
    overflow-x: hidden;
    word-break: break-word;
  }
  .notice-html-con::-webkit-scrollbar {
    width: 6px;
    height: 1px;
    border-radius: 4px;
    background: #f7f8fa;
  }
  .notice-html-con::-webkit-scrollbar-thumb {
    background: #e9ecf3;
    border-radius: 4px;
  }
}
</style>

