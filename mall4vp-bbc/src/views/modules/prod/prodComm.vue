<template>
  <div class="mod-prod-prodComm">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="prodName" :label="$t('product.prodName')" class="search-form-item">
            <el-input type="text" v-model="searchForm.prodName" :placeholder="$t('product.prodName')"></el-input>
          </el-form-item>
          <el-form-item prop="nickName" :label="$t('users.nickName')" class="search-form-item">
            <el-input type="text" v-model="searchForm.nickName" :placeholder="$t('users.nickName')"></el-input>
          </el-form-item>
          <el-form-item prop="status" :label="$t('product.reviewStatus')" class="search-form-item">
            <el-select v-model="searchForm.status" :placeholder="$t('product.reviewStatus')">
              <el-option :label="$t('productComm.pass')" :value="1"></el-option>
              <el-option :label="$t('productComm.noPass')" :value="-1"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="input-row">
          <el-form-item :label="this.$i18n.t('productComm.recTime')">
            <el-date-picker
              v-model="recDateRange"
              type="datetimerange"
              :range-separator="this.$i18n.t('date.tip')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="this.$i18n.t('date.start')"
              :end-placeholder="this.$i18n.t('date.end')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item :label="this.$i18n.t('productComm.replyTime')">
            <el-date-picker
              v-model="replyDateRange"
              type="datetimerange"
              :range-separator="this.$i18n.t('date.tip')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="this.$i18n.t('date.start')"
              :end-placeholder="this.$i18n.t('date.end')"
            ></el-date-picker>
          </el-form-item>
        </div>
      </el-form>
      <div class="default-btn primary-btn" @click="searchChange">{{$t('crud.searchBtn')}}</div>
      <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('shop.resetMap')}}</div>
    </div>
    <div class="main-container">
      <div class="table-con prod-conmm-table">
        <el-table
          ref="prodCommTable"
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
            prop="prodName"
            :label="$t('product.prodName')"
            width="320">
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.prodName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="nickName"
            :label="$t('users.nickName')"
            width="170">
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.nickName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="score"
            :label="$t('productComm.score')"
            width="170">
          </el-table-column>
          <el-table-column
            align="center"
            prop="isAnonymous"
            :label="$t('productComm.isAnonymous')"
            width="170">
            <template slot-scope="scope">
              <div class="tag-text">{{[$t('publics.no'), $t('publics.yes')][scope.row.isAnonymous]}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="status"
            :label="$t('product.reviewStatus')"
            width="170">
            <template slot-scope="scope">
              <div class="tag-text" v-if="scope.row.status === -1">{{ $t("productComm.noPass") }}</div>
              <div class="tag-text" v-if="scope.row.status === 1">{{ $t("productComm.pass") }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="recTime"
            :label="$t('productComm.recTime')"
            width="170">
            <template slot-scope="scope">
              <div>{{scope.row.recTime}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="replyTime"
            :label="$t('productComm.replyTime')"
            width="170">
            <template slot-scope="scope">
              <div>{{scope.row.replyTime}}</div>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            width="180"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('prod:prodComm:update')"
                  @click="addOrUpdateHandle(scope.row.prodCommId, true)"
                  >{{$t('groups.edit')}}
                </div>
                <div
                  class="default-btn text-btn"
                  @click="addOrUpdateHandle(scope.row.prodId, false)"
                  >{{$t('live.view')}}
                </div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('prod:prodComm:delete')"
                  @click="deleteHandle(scope.row.prodId)"
                  >{{$t("text.delBtn")}}
                </div>
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
import AddOrUpdate from './prodComm-add-or-update'

export default {
  data () {
    return {
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      searchForm: {
        prodName: '',
        nickName: '',
        status: ''
      },
      recDateRange: [],
      replyDateRange: [],
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
    getDataList (page) {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/prod/prodComm/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          current: page == null ? this.page.currentPage : page.currentPage,
          size: page == null ? this.page.pageSize : page.pageSize,
          'recStartTime': this.recDateRange === null ? null : this.recDateRange[0],
          'recEndTime': this.recDateRange === null ? null : this.recDateRange[1],
          'replyTimeStart': this.replyDateRange === null ? null : this.replyDateRange[0],
          'replyTimeEnd': this.replyDateRange === null ? null : this.replyDateRange[1]
        }, this.searchForm))
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.page.pageSize = data.size
        this.page.currentPage = data.current
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id, isEdit) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, isEdit)
      })
    },
    deleteHandle: function (prodCommId) {
      this.$confirm(this.$i18n.t('admin.isDeleOper'), this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/prod/prodComm/' + prodCommId),
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
      this.page.currentPage = 1
      this.getDataList(this.page)
    },

    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.replyDateRange = []
      this.recDateRange = []
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
