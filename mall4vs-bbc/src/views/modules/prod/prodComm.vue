<template>
  <div class="mod-prod-prodComm">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item prop="prodName" :label="$t('product.prodName') + ':'">
            <el-input type="text" v-model="searchForm.prodName" :placeholder="$t('product.prodName')"></el-input>
          </el-form-item>
          <el-form-item prop="nickName" :label="$t('users.name') + ':'">
            <el-input type="text" v-model="searchForm.nickName" :placeholder="$t('users.name')"></el-input>
          </el-form-item>
<!--          <el-form-item prop="status" :label="$t('product.reviewStatus') + ':'">-->
<!--            <el-select v-model="searchForm.status" :placeholder="$t('product.reviewStatus')">-->
<!--              <el-option :label="$t('productComm.pass')" :value="1"></el-option>-->
<!--              <el-option :label="$t('productComm.noPass')" :value="-1"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item :label="$t('productComm.recTime') + ':'">
            <el-date-picker
              v-model="recDateRange"
              type="datetimerange"
              :range-separator="$t('time.tip')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="$t('time.start')"
              :end-placeholder="$t('time.end')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('productComm.replyTime') + ':'">
            <el-date-picker
              v-model="replyDateRange"
              type="datetimerange"
              :range-separator="$t('time.tip')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="$t('time.start')"
              :end-placeholder="$t('time.end')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('crud.searchBtn')}}</div>
            <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('shop.resetMap')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="table-con prod-table">
        <el-table
          ref="prodCommTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%">
          <el-table-column
            align="left"
            prop="prodName"
            :label="$t('product.prodName')"
            width="360">
            <template slot-scope="scope">
              <div class="table-cell-con">
                <div v-if="scope.row.prodPic" class="table-cell-image">
                  <img :src="scope.row.prodPic" alt="">
                </div>
                <span class="table-cell-text">{{ scope.row.prodName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="nickName"
            :label="$t('users.name')"
            width="250">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.nickName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="score"
            :label="$t('productComm.score')"
            width="130">
          </el-table-column>
          <el-table-column
            align="left"
            prop="isAnonymous"
            :label="$t('productComm.isAnonymous')"
            width="130">
            <template slot-scope="scope">
              <div class="tag-text">{{[$t('publics.no'), $t('publics.yes')][scope.row.isAnonymous]}}</div>
            </template>
          </el-table-column>
<!--          <el-table-column-->
<!--            align="left"-->
<!--            prop="status"-->
<!--            :label="$t('product.reviewStatus')"-->
<!--            width="130">-->
<!--            <template slot-scope="scope">-->
<!--              <div class="tag-text" v-if="scope.row.status === -1">{{ $t("productComm.noPass") }}</div>-->
<!--              <div class="tag-text" v-if="scope.row.status === 0">{{ $t("productComm.waitPass") }}</div>-->
<!--              <div class="tag-text" v-if="scope.row.status === 1">{{ $t("productComm.pass") }}</div>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column
            align="left"
            prop="recTime"
            :label="$t('productComm.recTime')"
            width="250">
            <template slot-scope="scope">
              <div>{{scope.row.recTime}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="replyTime"
            :label="$t('productComm.replyTime')"
            width="250">
            <template slot-scope="scope">
              <div>{{scope.row.replyTime}}</div>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('publics.operating')"
            width="200"
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
                  @click="addOrUpdateHandle(scope.row.prodCommId, false)"
                  >{{$t('live.view')}}
                </div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('prod:prodComm:delete')"
                  @click="deleteHandle(scope.row.prodCommId)"
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
      theData: null, // 保存上次点击查询的请求条件
      theParams: null, // 保存上次点击查询的请求条件

      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        prodName: '',
        nickName: ''
      },
      recDateRange: [],
      replyDateRange: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
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
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theParams = JSON.parse(JSON.stringify(this.searchForm))

        this.theData = {
          current: page == null ? this.page.currentPage : page.currentPage,
          size: page == null ? this.page.pageSize : page.pageSize,
          'recStartTime': this.recDateRange === null ? null : this.recDateRange[0],
          'recEndTime': this.recDateRange === null ? null : this.recDateRange[1],
          'replyTimeStart': this.replyDateRange === null ? null : this.replyDateRange[0],
          'replyTimeEnd': this.replyDateRange === null ? null : this.replyDateRange[1]
        }
      } else {
        this.theData.current = page == null ? this.page.currentPage : page.currentPage
        this.theData.size = page == null ? this.page.pageSize : page.pageSize
      }
      this.$http({
        url: this.$http.adornUrl('/prod/prodComm/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign(this.theData, this.theParams))
      }).then(({ data }) => {
        this.dataList = data.records
        this.dataList.forEach(element => {
          element.nickName = !element.user ? '' : element.user.nickName ? element.user.nickName : ''
          element.prodPic = element.prodPic.indexOf('http') > -1 ? element.prodPic : this.resourcesUrl + element.prodPic
          // element.pic = element.pics ? element.pics.split(',')[0] : ''
          element.pic = element.pics ? element.pics.split(',')[0] : require('@/assets/img/def.png')
        })
        this.page.total = data.total
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
      this.$confirm(this.$i18n.t('admin.isDeleOper') + '?', this.$i18n.t('text.tips'), {
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
    searchChange (newData = false) {
      this.getDataList(this.page, newData)
    },

    /**
     * 重置表单
     * @param {String} formName 表单名称
     */
    resetSearchForm (formName) {
      this.$refs[formName].resetFields()
      this.replyDateRange = []
      this.recDateRange = []
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
.mod-prod-prodComm {
  .table-cell-text {
    margin-right: 70px;
  }
}
</style>
