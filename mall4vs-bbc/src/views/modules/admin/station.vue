<template>
  <div class="mod--station station-mod">
    <div class="search-bar">
      <el-form :inline="true" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
         <el-form-item prop="stationName" :label="$t('station.stationName')+':'">
            <el-input type="text" v-model="searchForm.stationName" :placeholder="$t('station.stationName')"></el-input>
          </el-form-item>
          <el-form-item prop="addr" :label="$t('station.addr')+':'">
            <el-input type="text" v-model="searchForm.addr" :placeholder="$t('station.addr')"></el-input>
          </el-form-item>
          <el-form-item prop="account" :label="$t('station.account')+':'">
            <el-input type="text" v-model="searchForm.account" :placeholder="$t('station.account')"></el-input>
          </el-form-item>
          <el-form-item prop="status" :label="$t('publics.status')+':'">
            <el-select v-model="searchForm.status" :placeholder="$t('publics.status')">
              <el-option :label="$t('station.close')" :value="0"></el-option>
              <el-option :label="$t('station.business')" :value="1"></el-option>
              <el-option :label="$t('components.platformOffline')" :value="2"></el-option>
              <el-option :label="$t('station.underReview')" :value="3"></el-option>
              <el-option :label="$t('station.auditFailure')" :value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('crud.searchBtn')}}</div>
            <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('shop.resetMap')}}</div>
          </el-form-item>
        </div>
        <!-- <div class="btn-row">
          <div class="default-btn primary-btn" @click="searchChange">{{$t('crud.searchBtn')}}</div>
          <div class="default-btn" @click="resetSearchForm('searchForm')">{{$t('shop.resetMap')}}</div>
        </div> -->
      </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
          <div class="default-btn primary-btn"
            @click="addOrUpdateHandle()"
            v-if="isAuth('admin:station:save')">
            {{ $t("crud.addTitle") }}
        </div>
      </div>
      <!-- 表格 -->
      <div class="table-con prod-table">
        <el-table
          ref="stationTable"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <el-table-column
            :label="$t('formData.serialNumber')"
            type="index"
            width="85">
          </el-table-column>
          <el-table-column
            align="left"
            prop="stationName"
            :label="$t('station.stationName')"
            width="270">
            <template slot-scope="scope">
              <span class="table-cell-text" style="display:block;white-space: nowrap;">{{scope.row.stationName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="addr"
            :label="$t('station.addr')"
            width="390">
            <template slot-scope="scope">
              <span class="table-cell-text">{{scope.row.province}}{{scope.row.city}}{{scope.row.area}}{{scope.row.addr}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="phone"
            :label="$t('station.number')"
            width="220">
            <template slot-scope="scope">
              <span v-if="scope.row.phonePrefix && scope.row.phonePrefix !== null">{{scope.row.phonePrefix}}-</span>
              <span>{{scope.row.phone}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="account"
            :label="$t('station.account')"
            width="210">
          </el-table-column>
          <el-table-column
            align="left"
            prop="status"
            :label="$t('publics.status')"
            width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 4">{{$t("station.auditFailure")}}</div>
              <div v-else-if="scope.row.status === 3">{{$t("station.underReview")}}</div>
              <div v-else-if="scope.row.status === 2">{{$t("components.platformOffline")}}</div>
              <div v-else-if="scope.row.status === 1">{{$t("station.business")}}</div>
              <div v-else>{{$t("station.close")}}</div>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            prop="account"
            :label="$t('text.menu')"
            width="240">
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div class="default-btn text-btn"
                    v-if="isAuth('admin:station:update')"
                    @click="addOrUpdateHandle(scope.row.stationId)">
                    {{$t("crud.updateBtn")}}</div>
                <div class="default-btn text-btn"
                    v-if="isAuth('admin:station:changeAccountInfo')"
                    @click="checkStationAccount(scope.row.stationId)">
                   {{scope.row.account?$t("admin.resetPwd"):$t("admin.createAcc")}}</div>
                <div class="default-btn text-btn"
                    v-if="isAuth('admin:station:auditApply') && scope.row.status > 1"
                    @click="auditEventHandle(scope.row.stationId)">
                    {{scope.row.status === 3?$t("coupon.waitReview"):$t("groups.applyForListing")}}</div>
                <div class="default-btn text-btn"
                    v-if="isAuth('admin:station:delete')"
                    @click="deleteHandle(scope.row.stationId)">
                    {{$t("text.delBtn")}}</div>
              </div>
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
        :total="page.total"
      >
      </el-pagination>
    </div>
     <!-- 新增编辑弹窗-->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
    <!-- 账号弹窗-->
    <station-account
      v-if="stationAccountVisible"
      ref="stationAccount"
      @refreshDataList="refreshChange"
    ></station-account>
    <!-- 下线管理弹窗-->
    <offlineEventHandle
      v-if="offlineEventHandleVisible"
      selectUrl="/admin/station/getOfflineHandleEventByStatonId"
      applyUrl="/admin/station/auditApply"
      ref="offlineEvent"
      @refreshDataList="refreshChange"
    ></offlineEventHandle>
  </div>
</template>

<script>
import StationAccount from './station-account'
import AddOrUpdate from './station-add-or-update'
import OfflineEventHandle from '@/components/offline-event-handle'

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
        stationName: '',  // 自提点
        addr: '', // 地址
        account: '',  // 账号
        status: ''  // 状态
      }, // 搜索
      dataListLoading: false,
      offlineEventHandleVisible: false,
      addOrUpdateVisible: false,
      stationAccountVisible: false
    }
  },
  components: {
    AddOrUpdate,
    StationAccount,
    OfflineEventHandle
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
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.$http({
        url: this.$http.adornUrl('/admin/station/page'),
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
    deleteHandle (id) {
      this.$confirm(this.$i18n.t('admin.isDeleOper') + '?', this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/admin/station/' + id),
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
    /**
     * 下线管理
     */
    auditEventHandle (id) {
      this.offlineEventHandleVisible = true
      this.$nextTick(() => {
        this.$refs.offlineEvent.init(id)
      })
    },
    /**
     * 账号管理
     */
    checkStationAccount (id) {
      this.stationAccountVisible = true
      this.$nextTick(() => {
        this.$refs.stationAccount.init(id)
      })
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      // this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
    },
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    // 重置表单
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
