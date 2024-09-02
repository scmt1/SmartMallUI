<template>
  <div class="mod-marketing-coupon">

    <!-- 新版规范 -->
    <div class="coupon-mod">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" class="search-form" ref="test-form" :model="searchForm" size="small">
          <div class="input-row">
            <el-form-item :label="$t('coupon.shopName') + ':'" class="search-form-item">
                <el-input v-model="searchForm.shopName" :placeholder="$t('coupon.shopName')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('coupon.couponName') + ':'" class="search-form-item">
                <el-input v-model="searchForm.couponName" :placeholder="$t('coupon.couponName')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('coupon.expiredStatus') + ':'" class="search-form-item">
              <el-select v-model="searchForm.overdueStatus" :placeholder="$t('coupon.expiredStatus')">
                <el-option
                  v-for="item in searchForm.overdueStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('coupon.deliveryStatus') + ':'" class="search-form-item">
              <el-select v-model="searchForm.putonStatus" :placeholder="$t('coupon.deliveryStatus')">
                <el-option
                  v-for="item in searchForm.putonStatuList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

<!--            获取方式  0=客户领取 1=平台发放-->
            <!-- <el-form-item :label="$t('coupon.getWay') + ':'" class="search-form-item">
              <el-select v-model="searchForm.getWay" :placeholder="$t('coupon.getWay')">
                <el-option :label="$t('coupon.getWay0')" value="0"></el-option>
                <el-option :label="$t('coupon.getWay1')" value="0"></el-option>
              </el-select>
            </el-form-item> -->

            <!-- 日期组件 -->
            <el-form-item :label="$t('coupon.expire') + ':'">
              <el-date-picker
                v-model="dateRange"
                type="datetimerange"
                :range-separator="$t('date.tip')"
                value-format="yyyy-MM-dd HH:mm:ss"
                :start-placeholder="$t('date.start')"
                :end-placeholder="$t('date.end')"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('shopFeature.searchBar.search')}}</div>
              <div class="default-btn" @click="clearSearch">{{$t('product.reset')}}</div>
              <div
                      class="default-btn primary-btn"
                      @click.stop="statisticClick()">
                {{statisticName}}
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!-- 搜索栏end -->
      <!-- 表格主体 -->
      <div class="main-container">
        <div class="operation-bar">
          <div
            class="default-btn primary-btn"
            v-if="isAuth('seckill:seckill:save')"
            @click="addOrUpdateHandle()"
            >{{ $t("crud.addTitle") }}
          </div>
<!--          <div-->
<!--            class="default-btn primary-btn"-->
<!--            @click.stop="statisticClick()">-->
<!--            {{statisticName}}-->
<!--          </div>-->
        </div>
        <div v-if="statisticName == '关闭统计'" class="data-statistics" style="background: rgb(250, 250, 250);">
          <div class="statistics-list">
            <div class="item">
              <div class="title">发放总量</div>
              <div class="amount"  style="color: rgb(26, 102, 255);"><span
                      class="amount-num">{{couponStatistic.sourceStockTotal}}</span>张
              </div>
            </div>
            <div class="item">
              <div class="line"></div>
              <div class="title"></div>
            </div>
            <div class="item">
              <div class="title">已领取数量</div>
              <div class="amount">
                <span class="amount-num">{{couponStatistic.takeNumTotal}}</span>张
              </div>
            </div>
            <div class="item">
              <div class="line"></div>
              <div class="title"></div>
            </div>
            <div class="item">
              <div class="title">剩余数量</div>
              <div class="amount">
                <span class="amount-num">{{couponStatistic.stocksTotal}}</span>张
              </div>
            </div>
            <div class="item">
              <div class="line"></div>
              <div class="title"></div>
            </div>
            <div class="item">
              <div class="title">已核销数量</div>
              <div class="amount"  style="color: rgb(250, 173, 20);">
                <span class="amount-num">{{couponStatistic.useNumTotal}}</span>张
              </div>
<!--              <div class="detail">-->
<!--                <span @click.stop="useNumDetail()" class="detail-text" >明细</span>-->
<!--              </div>-->
            </div>
          </div>
          <div class="statistics-list" style="margin-top: 15px;">
            <div class="item">
              <div class="title">今日领取数量</div>
              <div class="amount"><span
                      class="amount-num">{{receiveAndUseStatistic.todayReceiveTotal}}</span>张
              </div>
            </div>
            <div class="item">
              <div class="line"></div>
              <div class="title"></div>
            </div>
            <div class="item">
              <div class="title">昨日领取数量</div>
              <div class="amount">
                <span class="amount-num">{{receiveAndUseStatistic.yesterDayReceiveTotal}}</span>张
              </div>
            </div>
            <div class="item">
              <div class="line"></div>
              <div class="title"></div>
            </div>
            <div class="item">
              <div class="title">今日使用数量</div>
              <div class="amount">
                <span class="amount-num">{{receiveAndUseStatistic.todayUseTotal}}</span>张
              </div>
            </div>
            <div class="item">
              <div class="line"></div>
              <div class="title"></div>
            </div>
            <div class="item">
              <div class="title">昨日使用数量</div>
              <div class="amount">
                <span class="amount-num">{{receiveAndUseStatistic.yesterDayUseTotal}}</span>张
              </div>
            </div>
          </div>
        </div>
        <!-- 表格 -->
        <div class="table-con seckill-table">
<!--          :summary-method="getSummaries"-->
<!--          show-summary-->
          <el-table
            v-loading="dataListLoading"
            :data="dataList"
            header-cell-class-name="table-header"
            row-class-name="table-row-low"
            style="width: 100%">

            <el-table-column
              fixed
              prop="shopName"
              :label="$t('coupon.shopName')"
              min-width="120"
              >
              <template slot-scope="scope">
                <div>
                  <span class="table-cell-text">{{ scope.row.shopName }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              fixed
              prop="couponName"
              :label="$t('coupon.couponName')"
              min-width="200"
              >
              <template slot-scope="scope">
                <div>
                  <span class="table-cell-text">{{ scope.row.couponName }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="couponType"
              :label="$t('coupon.couponType')"
              min-width="120"
              >
              <template slot-scope="scope">
                <div class="tag-text">
                  {{['',$t("coupon.cashCoupon"), $t("coupon.discountVoucher"),
                  $t("coupon.coinCertificate"),"提货卡/券"]
                  [scope.row.couponType]}}</div>
              </template>
            </el-table-column>

            <el-table-column
                    prop="isGroup"
                    label="是否团购"
                    min-width="100"
            >
              <template slot-scope="scope">
                <div class="tag-text">
                  {{["否","是"]
                  [scope.row.isGroup]}}</div>
              </template>
            </el-table-column>

            <el-table-column
              prop="startTime"
              :label="$t('coupon.startTime')"
              min-width="160"
              >
            </el-table-column>

            <el-table-column
              prop="endTime"
              :label="$t('coupon.endTime')"
              min-width="160"
              >
            </el-table-column>

            <el-table-column
              prop="overdueStatus"
              :label="$t('coupon.expiredStatus')"
              min-width="120">
              <template slot-scope="scope">
                <div class="tag-text">
                  {{[$t("coupon.expired"), $t("coupon.notExpired")]
                  [scope.row.overdueStatus]}}</div>
              </template>
            </el-table-column>

            <el-table-column
              prop="putonStatus"
              :label="$t('coupon.deliveryStatus')"
              min-width="120"
              >
              <template slot-scope="scope">
                <div class="tag-text" v-if="scope.row.putonStatus!==-1">
                  {{[$t("coupon.waitAutoLaunch"), $t("coupon.launched"), $t("coupon.violationOffShelf"), $t("coupon.waitingForReview"), $t("coupon.waitLaunch")]
                  [scope.row.putonStatus]}}</div>
                <div class="tag-text" v-else>
                  {{$t("coupon.cancelLaunch")}}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="launchTime"
              :label="$t('coupon.timeToMarket')"
              min-width="160"
            >
            </el-table-column>

            <el-table-column
              prop="stocks"
              :label="$t('coupon.stock')"
              sortable
              min-width="100"
              >
            </el-table-column>

            <el-table-column
              prop="takeNum"
              :label="$t('dataAnalysis.receiveTimes')"
              sortable
              min-width="100"
              >
              <template slot-scope="scope">
                <span v-if="scope.row.couponType === 4" class="tag-text">{{ scope.row.version }}</span>
                <span v-else class="tag-text">{{ scope.row.takeNum }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="useNum"
              :label="$t('dataAnalysis.miniMallUsedTimes')"
              sortable
              min-width="160"
              >
            </el-table-column>

            <el-table-column
              fixed="right"
              align="center"
              :label="$i18n.t('crud.menu')"
              min-width="250"
              >
              <template slot-scope="scope">
                <div class="text-btn-con">
                  <div
                    class="default-btn text-btn"
                    @click="addOrUpdateHandle(scope.row.couponId)"
                  >{{$t("seckill.view")}}</div>
                  <div
                          class="default-btn text-btn"
                          @click="couponReceive(scope.row.couponId,scope.row.couponType)"
                  >领取明细
                  </div>
                  <div
                    class="default-btn text-btn"
                    v-if="isAuth('platform:coupon:update') && (scope.row.putonStatus<2 || scope.row.putonStatus === 4)"
                    @click="offlineCouponHandle(scope.row)"
                    >{{ $t("product.violation") }}</div
                  >
                  <div
                    class="default-btn text-btn"
                    v-if="isAuth('platform:coupon:update') && scope.row.putonStatus > 1 && scope.row.putonStatus < 4"
                    @click="couponAuditHandle(scope.row.couponId)"
                    >{{
                      scope.row.putonStatus === 2
                        ? $t("prodList.offShelfManage")
                        : $t("coupon.checkPending")
                    }}</div
                  >
                  <div
                    class="default-btn text-btn"
                    @click="deleteHandle(scope.row.couponId)"
                    >{{ $t("coupon.delete") }}</div
                  >
                </div>
              </template>
            </el-table-column>

                  <!-- <template slot-scope="scope" slot="menu">
        <el-button
          icon="el-icon-edit"
          type="text"
          size="small"
          @click="addOrUpdateHandle(scope.row.couponId)"
        >{{$t("coupon.viewDetails")}}</el-button>
        <el-button
          icon="el-icon-bottom"
          size="small"
          type="text"
          v-if="isAuth('platform:coupon:update') && scope.row.putonStatus<2"
          @click="offlineCouponHandle(scope.row)"
        >{{$t("coupon.offlineActivities")}}</el-button>
        <el-button
          icon="el-icon-document-checked"
          size="small"
          type="text"
          v-if="isAuth('platform:coupon:update') && scope.row.putonStatus > 1"
          @click="couponAuditHandle(scope.row.couponId)"
        >{{scope.row.putonStatus === 2?$t("coupon.violationOffShelf"):$t("coupon.checkPending")}}</el-button>
        <el-button
          icon="el-icon-delete"
          size="small"
          type="text"
          style="color:red"
          @click="deleteHandle(scope.row.couponId)"
        >{{$t("coupon.delete")}}</el-button>
      </template> -->

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
      <!-- 表格主体end -->
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
    <!-- 商品审核弹窗 -->
    <CouponAudit
      v-if="couponAuditVisible"
      ref="couponAudit"
      selectUrl="/platform/coupon/getOfflineHandleEventByCouponId"
      updateUrl="/platform/coupon/auditCoupon"
      @refreshDataList="refreshChange"
    ></CouponAudit>
    <!-- 下线弹窗 -->
    <el-dialog
      :title="this.$i18n.t('text.tips')"
      :visible.sync="offlineDialogVisible"
      append-to-body
      :close-on-click-modal="false"
      destroy-on-close
      class="remarks"
    >
      <el-input
        v-model="offlineReason"
        type="textarea"
        :rows="2"
        maxlength="200"
        :placeholder="this.$i18n.t('coupon.offlineReasonTips')"
      />
      <span slot="footer" class="dialog-footer">
        <div class="default-btn" @click="offlineDialogVisible = false">{{ $t('remindPop.cancel') }}</div>
        <div class="default-btn primary-btn" @click="offlineSubmit">{{ $t('shopProcess.submit') }}</div>
      </span>
    </el-dialog>
    <!--  优惠券使用情况查看  -->
    <el-dialog
            title="优惠券使用情况"
            :visible.sync="useNumDetailShow"
            width="30%"
            class="select-coupon-dialog"
    >
      <div class="main-container">
        <div class="prods-select-body">
          <el-table
                  max-height="500"
                  ref="couponUseTable"
                  :data="couponUseList"
                  header-cell-class-name="table-header"
                  row-class-name="table-row-low"
                  style="width: 100%;"
                  show-summary
          >
            <el-table-column
                    prop="shopName"
                    label="店铺名称"
            >
            </el-table-column>
            <el-table-column
                    prop="writeOffNum"
                    label="已核销数量"
                    width="200"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer">
                <div @click="useNumDetailShow = false" class="default-btn">{{ $t('remindPop.cancel') }}</div>
            </span>
    </el-dialog>
    <!-- 优惠券领取记录 -->
    <CouponReceiveDetail
            v-if="couponReceiveDetailVisible"
            ref="couponReceiveDetail"></CouponReceiveDetail>
    <!-- 提货卡券购买记录 -->
    <CardBuyDetail
            v-if="cardBuyDetailVisible"
            ref="cardBuyDetail"></CardBuyDetail>
  </div>
</template>

<script>
import AddOrUpdate from './coupon-add-or-update'
import CouponAudit from '@/components/offline-audit'
import CouponReceiveDetail from '@/components/coupon-receive-detail'
import CardBuyDetail from '@/components/card-buy-detail'
export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件
      theParams: null, // 保存上次点击查询的请求条件

      search: {
        slot: ''
      },
      dataForm: {
        orderNumber: '',
        status: null
      },
      dateRange: [],
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      couponAuditVisible: false,
      isSubmit: false,
      offlineDialogVisible: false, // 下线提示弹窗
      offlineReason: '', // 下线理由
      couponId: '', // 当前操作的优惠券id
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      // 头部搜索表单
      searchForm: {
        shopName: null,
        couponName: null,
        overdueStatus: null,
        putonStatus: null,
        getWay: null,
        overdueStatusList: [
          {
            value: 1,
            label: this.$i18n.t('coupon.notExpired')
          }, {
            value: 0,
            label: this.$i18n.t('coupon.expired')
          }
        ],
        putonStatuList: [
          {
            value: -1,
            label: this.$i18n.t('coupon.cancelLaunch')
          },
          {
            value: 0,
            label: this.$i18n.t('coupon.waitAutoLaunch')
          },
          {
            value: 1,
            label: this.$i18n.t('coupon.launched')
          },
          {
            value: 2,
            label: this.$i18n.t('coupon.violationOffShelf')
          },
          {
            value: 3,
            label: this.$i18n.t('coupon.waitingForReview')
          },
          {
            value: 4,
            label: this.$i18n.t('coupon.waitLaunch')
          }
        ],
      },
      statisticData: null, // 保存上次点击查询的请求条件
      statisticName: '数据统计',
      couponStatistic:{
        stocksTotal:0,
        sourceStockTotal:0,
        takeNumTotal:0,
        useNumTotal:0
      },
      useNumDetailShow:false,
      couponUseList:[],
      couponReceiveDetailVisible:false,
      receiveAndUseStatistic:{
        yesterDayReceiveTotal:0,
        todayReceiveTotal:0,
        yesterDayUseTotal:0,
        todayUseTotal:0
      },
      cardBuyDetailVisible:false
    }
  },
  components: {
    AddOrUpdate,
    CouponAudit,
    CouponReceiveDetail,
    CardBuyDetail
  },
  mounted () {
    this.getDataList()
    this.statisticCoupon()
    this.platformReceiveAndUseStatistic()
  },
  methods: {
    //优惠券领取明细
    couponReceive(couponId,couponType){
      if(couponType == 4){
        this.cardBuyDetailVisible = true
        this.$nextTick(() => {
          this.$refs.cardBuyDetail.init(couponId)
        })
      }else{
        this.couponReceiveDetailVisible = true
        this.$nextTick(() => {
          this.$refs.couponReceiveDetail.init(couponId)
        })
      }
    },
    //核销详细
    useNumDetail(){
      this.couponWriteOffDetail()
      this.useNumDetailShow = true
    },
    //优惠券核销详情
    couponWriteOffDetail(){
      this.$http({
        url: this.$http.adornUrl('/platform/couponUseRecord/writeOffDetail'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.couponUseList = data
      })
    },
    //数据统计点击
    statisticClick () {
      if (this.statisticName == '数据统计') {
        this.statisticName = '关闭统计'
      } else {
        this.statisticName = '数据统计'
      }
    },
    //表格自定义统计
    getSummaries (param) {
      const {columns, data} = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '单页合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (column.property === 'stocks' || column.property === 'takeNum' || column.property === 'useNum') {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += '张'
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    //优惠券统计
    platformReceiveAndUseStatistic(newData = false){
      if (newData || !this.statisticData) {
        this.theParams = JSON.parse(JSON.stringify(this.searchForm))
        this.statisticData = {
          'couponName': this.dataForm.couponName,
          'overdueStatus': this.dataForm.overdueStatus,
          'putonStatus': this.dataForm.putonStatus,
          'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
          'endTime': this.dateRange === null ? null : this.dateRange[1] // 结束时间
        }
      }

      this.$http({
        url: this.$http.adornUrl('/platform/coupon/platformReceiveAndUseStatistic'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
                  this.statisticData,
                  this.theParams
          ), false
        )
      }).then(({data}) => {
        if(data){
          this.receiveAndUseStatistic = data
        }else{
          this.receiveAndUseStatistic ={
            yesterDayReceiveTotal:0,
            todayReceiveTotal:0,
            yesterDayUseTotal:0,
            todayUseTotal:0
          }
        }
      })
    },
    //优惠券统计
    statisticCoupon(newData = false){
      if (newData || !this.statisticData) {
        this.theParams = JSON.parse(JSON.stringify(this.searchForm))
        this.statisticData = {
          'couponName': this.dataForm.couponName,
          'overdueStatus': this.dataForm.overdueStatus,
          'putonStatus': this.dataForm.putonStatus,
          'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
          'endTime': this.dateRange === null ? null : this.dateRange[1] // 结束时间
        }
      }

      this.$http({
        url: this.$http.adornUrl('/platform/coupon/statistic'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
                  this.statisticData,
                  this.theParams
          ), false
        )
      }).then(({data}) => {
        if(data){
          this.couponStatistic = data
        }else{
          this.couponStatistic = {
            stocksTotal:0,
            sourceStockTotal:0,
            takeNumTotal:0,
            useNumTotal:0
          }
        }
      })
    },
    // 获取数据列表
    getDataList (page, newData = false) {
      this.dataListLoading = true
      if (newData || !this.theData) {
        this.theParams = JSON.parse(JSON.stringify(this.searchForm))
        this.theData = {
          current: page == null ? this.page.currentPage : page.currentPage,
          size: page == null ? this.page.pageSize : page.pageSize,
          'couponName': this.dataForm.couponName,
          'overdueStatus': this.dataForm.overdueStatus,
          'putonStatus': this.dataForm.putonStatus,
          'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
          'endTime': this.dateRange === null ? null : this.dateRange[1] // 结束时间
        }
      } else {
        this.theData.current = page == null ? this.page.currentPage : page.currentPage
        this.theData.size = page == null ? this.page.pageSize : page.pageSize
      }
      this.$http({
        url: this.$http.adornUrl('/platform/coupon/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(this.theData, this.theParams), false
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        // 末尾页数据为空重新请求
        if (!this.dataList.length && this.page.currentPage > 1) {
          this.page.currentPage = 1
          this.getDataList()
        }
      }).finally(()=>{
        this.dataListLoading = false
      })
    },
    orderStatus () {

    },
    // 新增 / 修改
    addOrUpdateHandle (val) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(val)
      })
    },
    // 删除
    deleteHandle (id) {
      this.$confirm(this.$t('coupon.Tips2') + `${id ? this.$t('coupon.delete') : this.$t('coupon.batchDelete')}` + this.$t('coupon.Tips3'), this.$t('coupon.TipsTitle'), {
        confirmButtonText: this.$t('coupon.confirm'),
        cancelButtonText: this.$t('coupon.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/platform/coupon'),
            method: 'delete',
            data: this.$http.adornData(id, false)
          }).then(({ data }) => {
            this.$message({
              message: this.$t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.refreshChange()
              }
            })
          })
        })
        .catch(() => { })
    },
    // 条件查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
      this.statisticCoupon(newData)
      this.platformReceiveAndUseStatistic(newData)
    },
    // 刷新回调用
    refreshChange () {
      this.getDataList(this.page)
      this.statisticCoupon()
      this.platformReceiveAndUseStatistic()
    },
    // 多选变化
    selectionChange (val) {
      this.dataListSelections = val
    },
    // 清空自定义数据
    searchReset () {
      this.dateRange = []
    },
    // 下线活动
    offlineCouponHandle (row) {
      this.$prompt(this.$t('coupon.Tips0') + row.couponName + this.$t('coupon.Tips1'), this.$t('coupon.TipsTitle'), {
        confirmButtonText: this.$i18n.t('coupon.confirm'),
        cancelButtonText: this.$i18n.t('coupon.cancel'),
        inputPattern: /\s\S+|S+\s|\S/, // 不能全为空格 空字符串
        inputErrorMessage: this.$i18n.t('coupon.offlineReasonNotEmpty'),
        inputValidator: (value) => {
          if (value.length > 100) {
            return this.$i18n.t('seckill.offlineReasonTip1')
          }
        }
      }).then((obj) => {
        this.$http({
          url: this.$http.adornUrl(`/platform/coupon/offline`),
          method: 'post',
          data: this.$http.adornData({
            handleId: row.couponId,
            offlineReason: obj.value || null
          })
        }).then(({ data }) => {
          this.$message({
            message: this.$t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList(this.page)
            }
          })
        })
      })

      // this.offlineReason = ''
      // this.couponId = row.couponId
      // this.offlineDialogVisible = true
    },
    // 提交下线操作
    offlineSubmit () {
      if (this.isSubmit) {
        return
      }
      this.isSubmit = true
      if (!this.offlineReason.trim() || this.offlineReason.trim().length > 200) {
        this.$message({
          message: this.$i18n.t('coupon.offlineReasonNotEmpty'),
          type: 'error',
          duration: 1000
        })
        this.isSubmit = false
        return
      }
      this.$http({
        url: this.$http.adornUrl(`/platform/coupon/offline`),
        method: 'post',
        data: this.$http.adornData({
          handleId: this.couponId,
          offlineReason: this.offlineReason
        })
      }).then(({data}) => {
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.offlineDialogVisible = false
            this.isSubmit = false
            this.getDataList(this.page)
          }
        })
      }).catch((e) => {
        this.isSubmit = false
      })
    },
    // 弹窗处理
    couponAuditHandle (id) {
      this.couponAuditVisible = true
      this.$nextTick(() => {
        this.$refs.couponAudit.init(id)
      })
    },
    clearSearch () {
      this.dateRange = []
      this.searchForm.shopName = null
      this.searchForm.couponName = null
      this.searchForm.overdueStatus = null
      this.searchForm.putonStatus = null
    },
    // 每页数量变更
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList()
    },
    // 页数变更
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList()
    }
  }
}
</script>
<style lang="scss" scoped>
.mod-order-order {
  .tit {
    display: flex;
    height: 45px;
    align-items: center;
  }
  .tit .item {
    padding: 0 10px;
    width: 10%;
    text-align: center;
  }
  .tit .product {
    width: 25%;
  }
  .prod-tit {
    padding: 10px;
    background: #f8f8f9;
    border-left: 1px solid #dddee1;
    border-top: 1px solid #dddee1;
    border-right: 1px solid #dddee1;
  }
  .prod-tit span {
    margin-right: 15px;
  }
  .prod-cont {
    display: flex;
    border-top: 1px solid #dddee1;
    border-bottom: 1px solid #dddee1;
    border-left: 1px solid #dddee1;
    color: #495060;
  }
  .prod-cont .item {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    // width: 10%;
    border-right: 1px solid #dddee1;
    text-align: center;
    height: 100%;
  }
  .prod-cont .item span {
    display: block;
  }
  .prod-cont .prod-item {
    // width: 38%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #dddee1;
  }
  .prod-name {
    width: 55%;
    text-align: left;
  }
  .prod-price {
    position: absolute;
    right: 40px;
    text-align: center;
  }
  .prod-price span {
    display: block;
    margin-bottom: 10px;
  }
  .prod-name .prod-info {
    display: block;
    color: #80848f;
    margin-top: 30px;
  }
  .prod-cont .items.name {
    display: flex;
    position: relative;
    padding: 20px;
    // height: 100px;
    border-bottom: 1px solid #dddee1;
  }
  .prod-cont .items.name:last-child {
    border-bottom: none;
  }
  .prod-image {
    margin-right: 20px;
    width: 100px;
    height: 100px;
  }
  .prod-image img {
    width: 100px;
    height: 100px;
  }
  .item span {
    display: block;
    margin-bottom: 10px;
  }
  .item .operate {
    color: #2d8cf0;
  }
  .item .totalprice {
    color: #c00;
  }
  .prod .remark {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #e8f7f6;
    border-left: 1px solid #dddee1;
    border-right: 1px solid #dddee1;
    border-bottom: 1px solid #dddee1;
    margin-bottom: 20px;
  }
  .buyer-remark {
    padding: 0 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.data-statistics {
  margin: 30px 0 0;
  padding: 28px 0 32px;
  border-radius: 3px;
  border: 1px solid #EBEBEB;
  .statistics-list {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    .item {
      .title {
        color: gray;
        margin-bottom: 10px;
      }
      .amount {
        margin-bottom: 10px;
        .amount-num {
          padding-right: 3px;
          font-weight: 600;
          font-size: 20px;
        }
      }
      .detail-text {
        color: #1965ff;
        cursor: pointer;
      }
    }
  }
}

</style>
