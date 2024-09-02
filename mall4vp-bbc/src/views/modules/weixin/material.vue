<template>
  <div class="mod-weixin-material">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row margin-bottom-none">
          <el-form-item prop="mediaName" :label="$t('weixin.materialName')">
            <el-input type="text" v-model="searchForm.mediaName" :placeholder="$t('weixin.materialName')"></el-input>
          </el-form-item>
          <el-form-item prop="mediaType" :label="$t('weixin.materialType')">
            <el-select v-model="searchForm.mediaType" :placeholder="$t('weixin.materialType')">
              <el-option :label="$t('weixin.image')" value="image"></el-option>
              <el-option :label="$t('weixin.voice')" value="voice"></el-option>
              <el-option :label="$t('weixin.video')" value="video"></el-option>
              <el-option :label="$t('weixin.news')" value="news"></el-option>
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
          v-if="isAuth('weixin:material:sync')"
          @click.stop="dataFormSubmit()"
        >{{ $t("weixin.synchronizateMedia")  }}</div
        >
      </div>
      <!-- 表格 -->
      <div class="table-con prod-table">
        <el-table
          ref="prodListTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%">
          <el-table-column
            fixed
            align="center"
            prop="mediaName"
            :label="$t('weixin.materialName')"
            width="auto">
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.mediaName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="mediaType"
            :label="$t('weixin.materialType')"
            width="auto">
          </el-table-column>
          <el-table-column
            align="center"
            prop="content"
            :label="$t('weixin.materialContent')"
            width="auto">
            <template slot-scope="scope">
              <div v-if="scope.row.mediaType === 'text'">{{scope.row.content}}</div>
              <a v-else-if="scope.row.mediaType === 'news'" :href="scope.row.news.url" target="_blank" rel="noopener noreferrer">{{ $t("weixin.watch")  }}</a>
              <div  v-else-if="scope.row.mediaType === 'image'" class="table-cell-image">
                <img :src="scope.row.content" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="updateTime"
            :label="$t('weixin.updateTime')"
            width="auto">
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            width="200"
            >
            <template slot-scope="scope">
              <div
                class="default-btn text-btn"
                v-if="isAuth('admin:user:delete')"
                @click.stop="deleteHandle(scope.row.mediaId)"
                >{{ $t("weixin.delete")  }}</div
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
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

  </div>
</template>

<script>
export default {
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        mediaName: '',
        mediaType: ''
      }
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/weixin/material/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            this.searchForm
          )
        )
      }).then(({ data }) => {
        data.records.forEach(item => {
          if (item.mediaType === 'news') {
            item.news = JSON.parse(item.content)
          }
        })
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 表单提交
    dataFormSubmit () {
      let dataForm = this.searchForm
      if (!dataForm.mediaType) {
        this.$message.error(this.$i18n.t('weixin.selectMediaType'))
        return
      }
      const loading = this.$loading({
        lock: true,
        text: this.$i18n.t('weixin.synchronizating')
      })
      this.$http({
        url: this.$http.adornUrl(`/weixin/material/sync/${dataForm.mediaType}`),
        method: 'post',
        data: this.$http.adornData({
        })
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('weixin.synchronizating'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            loading.close()
            this.getDataList()
          }
        })
      }).catch(() => {
        loading.close()
      })
    },
    // 刷新回调
    refreshChange () {
      this.getDataList(this.page)
    },
    // 条件查询
    searchChange () {
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    // 删除
    deleteHandle (id) {
      this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/weixin/material/${id}`),
          method: 'delete'
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
      }).catch(() => { })
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
.mod-weixin-material {
  .el-table {
    img {
      max-height: 150px;
    }
  }
}
</style>
