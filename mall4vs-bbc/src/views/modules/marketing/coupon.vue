<template>
  <div class="mod-marketing-coupon">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="test-form" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item :label="$t('coupon.couponName')+':'">
              <el-input v-model="searchForm.couponName" :placeholder="$t('coupon.couponName')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('coupon.expStatus')+':'">
            <el-select v-model="searchForm.overdueStatus" :placeholder="$t('coupon.expStatus')">
              <el-option
                v-for="item in overdueStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('coupon.launchStatus')+':'">
            <el-select v-model="searchForm.putonStatus" :placeholder="$t('coupon.launchStatus')">
              <el-option
                v-for="item in putonStatuList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 日期组件 -->
          <el-form-item :label="$t('coupon.expire')+':'">
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              :range-separator="$t('time.tip')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="$t('time.start')"
              :end-placeholder="$t('time.end')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="投放时间">
            <el-date-picker
                    v-model="launchDateRange"
                    type="datetimerange"
                    :range-separator="$t('time.tip')"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :start-placeholder="$t('time.start')"
                    :end-placeholder="$t('time.end')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('shopFeature.searchBar.search')}}</div>
            <div class="default-btn" @click="clearSearch">{{$t('shop.resetMap')}}</div>
            <div
                    class="default-btn primary-btn"
                    v-if="isAuth('seckill:seckill:save')"
                    @click="addOrUpdateHandle()"
            >{{ $t("crud.addTitle") }}
            </div>
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
<!--        <div-->
<!--          class="default-btn primary-btn"-->
<!--          v-if="isAuth('seckill:seckill:save')"-->
<!--          @click="addOrUpdateHandle()"-->
<!--          >{{ $t("crud.addTitle") }}-->
<!--        </div>-->
<!--        <div-->
<!--                class="default-btn primary-btn"-->
<!--                @click.stop="statisticClick()">-->
<!--          {{statisticName}}-->
<!--        </div>-->
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
            <div class="detail">
              <span @click.stop="useNumDetail()" class="detail-text" >明细</span>
            </div>
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
<!--        :summary-method="getSummaries"-->
<!--        show-summary-->
        <el-table
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%">
          <el-table-column
            prop="couponName"
            :label="$t('coupon.couponName')"
            min-width="280"
            fixed="left"
            >
            <template slot-scope="scope">
              <div>
                <span class="table-cell-text line-clamp-one">{{ scope.row.couponName }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="startTime"
            :label="$t('coupon.startTime')"
            min-width="180"
            >
          </el-table-column>

          <el-table-column
            prop="endTime"
            :label="$t('coupon.endTime')"
            min-width="180"
            >
          </el-table-column>

          <el-table-column
            prop="couponType"
            :label="$t('coupon.couponType')"
            min-width="150"
            >
            <template slot-scope="scope">
              <div class="tag-text">
                {{['',$t("coupon.voucher"), $t("coupon.discountCoupon"),
                $t("coupon.excCerti"),"提货卡/券"]
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
            prop="overdueStatus"
            :label="$t('coupon.expStatus')"
            min-width="100"
            >
            <template slot-scope="scope">
              <div class="tag-text">
                {{[$t("coupon.exp"), $t("coupon.notExp")]
                [scope.row.overdueStatus]}}</div>
            </template>
          </el-table-column>

          <el-table-column
            prop="putonStatus"
            :label="$t('coupon.launchStatus')"
            min-width="130"
            >
            <template slot-scope="scope">
              <div class="tag-text" v-if="scope.row.putonStatus!==-1">
                {{[$t("coupon.waitAutoLaunch"), $t("coupon.launched"), $t("coupon.illOff"), $t("coupon.waitReview"), $t("coupon.waitLaunch")]
                [scope.row.putonStatus]}}
              </div>
              <div class="tag-text" v-else>
                {{$t("coupon.cancelLaunch")}}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left" prop="launchTime" :label="$t('coupon.timeToMarket')" width="180"></el-table-column>
          <el-table-column
            prop="stocks"
            :label="$t('coupon.stock')"
            sortable
            min-width="100"
            >
          </el-table-column>

          <el-table-column
            prop="takeNum"
            :label="$t('dataAnaly.numberOfRe')"
            sortable
            min-width="110"
            >
          </el-table-column>

          <el-table-column
            prop="useNum"
            :label="$t('dataAnaly.microMallUsage')"
            sortable
            min-width="160"
            >
          </el-table-column>
          <el-table-column
                  prop="getWay"
                  :label="$t('coupon.getWay')"
                  width="auto">
            <template slot-scope="scope">
              <span class="tag-text">{{ [$t('coupon.receiveDirectly'), $t('coupon.exchangeOrSystemIssue')][scope.row.getWay] }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$i18n.t('crud.menu')" width="180" fixed="right">
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('admin:coupon:update')"
                  @click="addOrUpdateHandle(scope.row.couponId)"
                  >{{ $t("temp.modify") }}</div
                >
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('admin:coupon:auditApply') && scope.row.putonStatus > 1 && scope.row.putonStatus < 4"
                  @click="auditEventHandle(scope.row.couponId)"
                  >{{
                    scope.row.putonStatus === 2
                      ? $t("groups.applyForListing")
                      : $t("coupon.waitReview")
                  }}</div
                >
                  <div
                      class="default-btn text-btn"
                      @click="couponReceive(scope.row.couponId,scope.row.couponType)"
                  >领取明细
                  </div>
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('admin:coupon:delete')"
                  @click="deleteHandle(scope.row.couponId)"
                  >{{ $t("text.delBtn") }}</div
                >
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
        :total="page.total">
      </el-pagination>
    </div>
    <!-- 表格主体end -->

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="refreshChange"
    ></add-or-update>
    <!-- 下线管理弹窗-->
    <offlineEventHandle
      v-if="offlineEventHandleVisible"
      selectUrl="/admin/coupon/getOfflineHandleEventByCouponId"
      applyUrl="/admin/coupon/auditApply"
      ref="offlineEvent"
      @refreshDataList="refreshChange"
    ></offlineEventHandle>
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
                    prop="couponName"
                    label="优惠券名称"
            >
            </el-table-column>
            <el-table-column
                    prop="useNum"
                    label="已核销数量"
                    width="200"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer">
                <div @click="useNumDetailShow = false" class="default-btn">取消</div>
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
import OfflineEventHandle from '@/components/offline-event-handle'
import CouponReceiveDetail from '@/components/coupon-receive-detail'
import CardBuyDetail from '@/components/card-buy-detail'

export default {
  name: 'marketing-coupon',
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件
      theParams: null, // 保存上次点击查询的请求条件
      couponReceiveDetailVisible:false,
      search: {
        slot: ''
      },
      dataForm: {
        orderNumber: '',
        status: null
      },
      dateRange: [],
      launchDateRange:[],
      overdueOptions: [{
        value: 0,
        label: this.$i18n.t('coupon.exp')
      },
      {
        value: 1,
        label: this.$i18n.t('coupon.notExp')
      }],
      PutonOptions: [{
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
        label: this.$i18n.t('coupon.illOff')
      },
      {
        value: 3,
        label: this.$i18n.t('coupon.waitReview')
      },
      {
        value: 4,
        label: this.$i18n.t('coupon.waitLaunch')
      }],
      dataList: [],
      dataListLoading: false,
      offlineEventHandleVisible: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      // 头部搜索表单
      searchForm: {
        couponName: null,
        overdueStatus: null,
        putonStatus: null
      },
      overdueStatusList: [
        {
          value: 1,
          label: this.$i18n.t('coupon.notExp')
        }, {
          value: 0,
          label: this.$i18n.t('coupon.exp')
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
          label: this.$i18n.t('coupon.illOff')
        },
        {
          value: 3,
          label: this.$i18n.t('coupon.waitReview')
        },
        {
          value: 4,
          label: this.$i18n.t('coupon.waitLaunch')
        }
      ],
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
    OfflineEventHandle,
    CouponReceiveDetail,
    CardBuyDetail
  },
  mounted () {
    this.getDataList()
    this.statisticCoupon()
    this.shopReceiveAndUseStatistic()
  },
  activated () {
    this.getDataList()
    this.statisticCoupon()
    this.shopReceiveAndUseStatistic()
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
    couponWriteOffDetail(newData = false){
      if (newData || !this.statisticData) {
        this.theParams = JSON.parse(JSON.stringify(this.searchForm))
        this.statisticData = {
          'couponName': this.dataForm.couponName,
          'overdueStatus': this.dataForm.overdueStatus,
          'putonStatus': this.dataForm.putonStatus,
          'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
          'endTime': this.dateRange === null ? null : this.dateRange[1], // 结束时间
          'launchTime': this.launchDateRange === null ? null : this.launchDateRange[0], // 开始时间
          'launchEndTime': this.launchDateRange === null ? null : this.launchDateRange[1], // 结束时间
        }
      }
      this.$http({
        url: this.$http.adornUrl('/admin/couponUseRecord/writeOffDetail'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
                  this.statisticData,
                  this.theParams
          ), false
        )
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
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '单页合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (column.property === "stocks" || column.property === "takeNum" || column.property === "useNum" ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += '张';
        } else {
          sums[index] = '';
        }
      });
      return sums;
    },
    // 获取数据列表
    getDataList (page, newData = false) {
      if (this.page) {
        let size = Math.ceil(this.page.total / this.page.pageSize)
        this.page.currentPage = (this.page.currentPage > size ? size : this.page.currentPage) || 1
      }
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
          'endTime': this.dateRange === null ? null : this.dateRange[1], // 结束时间
          'launchTime': this.launchDateRange === null ? null : this.launchDateRange[0], // 开始时间
          'launchEndTime': this.launchDateRange === null ? null : this.launchDateRange[1], // 结束时间
        }
      } else {
        this.theData.current = page == null ? this.page.currentPage : page.currentPage
        this.theData.size = page == null ? this.page.pageSize : page.pageSize
      }
      this.$http({
        url: this.$http.adornUrl('/admin/coupon/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            this.theData,
            this.theParams
          ), false
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.page.currentPage = data.current
        this.dataListLoading = false
      })
    },
    //优惠券领取使用统计
    shopReceiveAndUseStatistic(newData = false){
      if (newData || !this.statisticData) {
        this.theParams = JSON.parse(JSON.stringify(this.searchForm))
        this.statisticData = {
          'couponName': this.dataForm.couponName,
          'overdueStatus': this.dataForm.overdueStatus,
          'putonStatus': this.dataForm.putonStatus,
          'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
          'endTime': this.dateRange === null ? null : this.dateRange[1], // 结束时间
          'launchTime': this.launchDateRange === null ? null : this.launchDateRange[0], // 开始时间
          'launchEndTime': this.launchDateRange === null ? null : this.launchDateRange[1], // 结束时间
        }
      }

      this.$http({
        url: this.$http.adornUrl('/admin/coupon/shopReceiveAndUseStatistic'),
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
          'endTime': this.dateRange === null ? null : this.dateRange[1], // 结束时间
          'launchTime': this.launchDateRange === null ? null : this.launchDateRange[0], // 开始时间
          'launchEndTime': this.launchDateRange === null ? null : this.launchDateRange[1], // 结束时间
        }
      }

      this.$http({
        url: this.$http.adornUrl('/admin/coupon/statistic'),
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
    orderStatus () {

    },
    // 新增 / 修改
    addOrUpdateHandle (val) {
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(val)
      // })
      this.$router.push({
        path: '/marketing-new-coupon',
        query: {
          couponId: val
        }
      })
    },
    // 删除
    deleteHandle (id) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.couponId
      })
      this.$confirm(`${this.$i18n.t('sys.makeSure')}[${id ? this.$i18n.t('text.delBtn') : this.$i18n.t('sys.batchDelete')}]${this.$i18n.t('text.menu')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/admin/coupon'),
            method: 'delete',
            data: this.$http.adornData(id, false)
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
        .catch(() => { })
    },
    // 条件查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.getDataList(this.page, newData)
      this.statisticCoupon(newData)
      this.shopReceiveAndUseStatistic(newData)
    },
    // 刷新回调用
    refreshChange () {
      // this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
      this.statisticCoupon()
      this.shopReceiveAndUseStatistic()
    },
    // 多选变化
    selectionChange (val) {
      this.dataListSelections = val
    },
    // 清空自定义数据
    searchReset () {
      this.dateRange = []
      this.launchDateRange = []
    },
    // 下线管理
    auditEventHandle (id) {
      this.offlineEventHandleVisible = true
      this.$nextTick(() => {
        this.$refs.offlineEvent.init(id)
      })
    },
    clearSearch () {
      this.dateRange = []
      this.launchDateRange = []
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
<style lang="scss">
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
