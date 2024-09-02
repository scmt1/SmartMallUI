<template>
  <div class="mod-weixin-material-select">
    <el-dialog :modal="false"
               :title="this.$i18n.t('weixin.selectMaterial')"
               :close-on-click-modal="false"
               :visible.sync="visible">
      <!-- <el-form :inline="true"
               :model="dataForm"
               @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.mediaName"
                    placeholder="素材名称"
                    clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="dataList"
                border
                v-loading="dataListLoading"
                style="width: 100%;">
        <el-table-column header-align="center"
                         align="center"
                         label="选择">
          <template slot-scope="scope">
            <el-radio :label="scope.$index"
                      v-model="rowIndex">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="mediaName"
                         header-align="center"
                         align="center"
                         label="素材名称">
        </el-table-column>
        <el-table-column prop="mediaType"
                         header-align="center"
                         align="center"
                         label="素材类型">
          <template slot-scope="scope">
            <el-tag size="small">{{mediaTypes[scope.row.mediaType]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="mediaUrl"
                         header-align="center"
                         align="center"
                         label="素材">
          <template slot-scope="scope">
            <a v-if="scope.row.mediaType === 'news'" :href="scope.row.news.url" target="_yami_weixin_news">查看</a>
            <img v-else-if="scope.row.mediaType === 'image'" :src="scope.row.content"/>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime"
                         header-align="center"
                         align="center"
                         label="更新时间">
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChangeHandle"
                     @current-change="currentChangeHandle"
                     :current-page="pageIndex"
                     :page-sizes="[10, 20, 50, 100]"
                     :page-size="pageSize"
                     :total="totalPage"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination> -->
      <div class="search-bar">
        <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
          <div class="input-row">
            <el-form-item prop="mediaName" :label="$t('weixin.materialName')">
              <el-input type="text" v-model="searchForm.mediaName" :placeholder="$t('weixin.materialName')"></el-input>
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
              prop="rowIndex"
              :label="$t('number')"
              width="55">
              <template slot-scope="scope">
                <el-radio :label="scope.row.$index"
                          v-model="rowIndex">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="mediaName"
              :label="$t('weixin.materialName')"
              width="auto">
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
                <img v-else-if="scope.row.mediaType === 'image'" :src="scope.row.content" />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="updateTime"
              :label="$t('weixin.updateTime')"
              width="auto">
            </el-table-column>
            <!-- <el-table-column
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
            </el-table-column> -->
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


      <span slot="footer"
            class="dialog-footer">
        <div class="default-btn" @click="visible = false">{{ $t("weixin.cancel")  }}</div>
        <div class="default-btn primary-btn"
                   @click="dataFormSubmit()">{{ $t("weixin.confirm")  }}</div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataList: [],
      dataListLoading: false,
      rowIndex: 0,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        mediaName: ''
      }
    }
  },
  methods: {
    init (mediaType) {
      this.visible = true
      this.getDataList(this.page, {mediaType: mediaType})
    },
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
    // 刷新回调
    refreshChange () {
      this.getDataList(this.page)
    },
    // 条件查询
    searchChange () {
      this.getDataList(this.page)
    },
    // 表单提交
    dataFormSubmit () {
      this.$emit('callBack', this.dataList[this.rowIndex])
      this.visible = false
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
