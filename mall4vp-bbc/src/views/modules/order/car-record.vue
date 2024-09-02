<template>
    <div class="carRecord">
        <el-tabs v-model="tabActive" @tab-click="tabHandleClick">
            <el-tab-pane label="其他支付停车订单" name="first">
                <div class="search-bar">
                    <el-form
                            :inline="true"
                            :model="carDataForm"
                            size="small"
                    >
                        <el-form-item label="支付时间">
                            <el-date-picker
                                    size="small"
                                    v-model="payDateRange"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                            ></el-date-picker
                            >
                        </el-form-item>
                        <el-form-item label="支付方式">
                            <template>
                                <el-select
                                        v-model="carDataForm.wayCode"
                                        clearable
                                        placeholder="支付方式"
                                        size="small"
                                >
                                    <el-option
                                            v-for="item in payWayList"
                                            :key="item.wayCode"
                                            :label="item.wayName"
                                            :value="item.wayCode"
                                    ></el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                        <el-form-item label="车牌号">
                            <el-input
                                    @input="carNoInput"
                                    v-model="carDataForm.carNo"
                                    placeholder="请输入车牌号"
                                    clearable
                                    size="small"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="车辆类型">
                            <template>
                                <el-select
                                        @change="carTypeChange"
                                        v-model="carDataForm.carType"
                                        clearable
                                        placeholder="车辆类型"
                                        size="small"
                                >
                                    <el-option label="蓝牌车" value="蓝牌车"></el-option>
                                    <el-option label="新能源车" value="新能源车"></el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                        <el-form-item>
                            <div
                                    class="default-btn primary-btn"
                                    @click="searchCarChange(true)"
                            >查询</div
                            >
                            <div
                                    class="default-btn"
                                    @click="carClear()"
                            >重置</div
                            >
                            <div
                                    class="default-btn"
                                    @click="downloadCarRecord()"
                            >导出</div
                            >
                            <div
                                    class="default-btn primary-btn"
                                    @click.stop="statisticClick()">
                                {{statisticName}}
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <div v-if="statisticName == '关闭统计'" class="data-statistics" style="background: rgb(250, 250, 250);">
                    <div class="statistics-list">
                        <div class="item">
                            <div class="title">实际累计收款金额</div>
                            <div class="amount"  style="color: rgb(26, 102, 255);"><span
                                    class="amount-num">{{carStatistic.actualAmount}}</span>元
                            </div>
                        </div>
                        <div class="item">
                            <div class="title">成交订单</div>
                            <div class="amount"  style="color: rgb(250, 173, 20);">
                                <span class="amount-num">{{carStatistic.payAmount}}</span>元
                            </div>
                            <div class="detail">
                                <span style="margin-right: 10px;">{{carStatistic.payCount}}笔</span>
                            </div>
                        </div>
                        <div class="item">
                            <div class="title">昨日停车收费</div>
                            <div class="amount"  style="color: rgb(26, 102, 255);">
                                <span class="amount-num">{{carStatistic.yesterdayPayAmount}}</span>元
                            </div>
                            <div class="detail">
                                <span style="margin-right: 10px;">{{carStatistic.yesterdayPayCount}}笔</span>
                            </div>
                        </div>
                        <div class="item">
                            <div class="title">当日停车收费</div>
                            <div class="amount"  style="color: rgb(26, 102, 255);">
                                <span class="amount-num">{{carStatistic.toDayPayAmount}}</span>元
                            </div>
                            <div class="detail">
                                <span style="margin-right: 10px;">{{carStatistic.toDayPayCount}}笔</span>
                            </div>
                        </div>
                        <div class="item">
                            <div class="title">手续费金额</div>
                            <div class="amount">
                                <span class="amount-num">{{carStatistic.mchFeeAmount}}</span>元
                            </div>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 10px;">
                    <el-table
                            v-loading="carOrderLoading"
                            ref="carOrderListTable"
                            :data="carOrderList"
                            header-cell-class-name="table-header"
                            row-class-name="table-row-low"
                            style="width: 100%">
                        <el-table-column
                                fixed
                                prop="payOrderId"
                                width="250"
                                label="订单号">
                            <template slot-scope="scope">
                                <p style="margin: 5px 0;">
                                    <span>{{scope.row.payOrderId}}</span>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="extParam.carNo"
                                width="100"
                                label="车牌号">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="amount"
                                label="支付金额"
                        >
                            <template slot-scope="scope">
                                <span>￥{{scope.row.amount}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                align="center"
                                width="180"
                                prop="extParam.entranceTime"
                                label="入场时间">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                width="180"
                                prop="extParam.parkTime"
                                label="停车时长">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="extParam.carType"
                                label="车辆类型">
                        </el-table-column>
                        <el-table-column
                                fixed="right"
                                align="center"
                                prop="createdAt"
                                width="180"
                                label="创建时间">
                        </el-table-column>
                        <el-table-column
                                fixed="right"
                                align="center"
                                prop="successTime"
                                width="180"
                                label="支付时间">
                        </el-table-column>
                        <el-table-column
                                width="160"
                                align="center"
                                prop="wayCode"
                                label="支付方式">
                            <template slot-scope="scope">
                                <span v-if="scope.row.wayCode === 'AUTO_BAR'">条码聚合支付</span>
                                <span v-if="scope.row.wayCode === 'ALI_BAR'">支付宝条码支付</span>
                                <span v-if="scope.row.wayCode === 'ALI_JSAPI'">支付宝生活号</span>
                                <span v-if="scope.row.wayCode === 'ALI_LITE'">支付宝小程序支付</span>
                                <span v-if="scope.row.wayCode === 'ALI_APP'">支付宝app支付</span>
                                <span v-if="scope.row.wayCode === 'ALI_PC'">支付宝电脑网站支付</span>
                                <span v-if="scope.row.wayCode === 'ALI_WAP'">支付宝wap支付</span>
                                <span v-if="scope.row.wayCode === 'ALI_QR'">支付宝二维码付款</span>
                                <span v-if="scope.row.wayCode === 'YSF_BAR'">云闪付条码支付</span>
                                <span v-if="scope.row.wayCode === 'YSF_JSAPI'">云闪付服务窗支付</span>
                                <span v-if="scope.row.wayCode === 'WX_JSAPI'">微信公众号</span>
                                <span v-if="scope.row.wayCode === 'WX_LITE'">微信小程序支付</span>
                                <span v-if="scope.row.wayCode === 'WX_BAR'">微信条码支付</span>
                                <span v-if="scope.row.wayCode === 'WX_H5'">微信H5支付</span>
                                <span v-if="scope.row.wayCode === 'WX_NATIVE'">微信扫码支付</span>
                                <span v-if="scope.row.wayCode === 'UP_APP'">银联App支付</span>
                                <span v-if="scope.row.wayCode === 'UP_WAP'">银联手机网站支付</span>
                                <span v-if="scope.row.wayCode === 'UP_QR'">银联二维码(主扫)</span>
                                <span v-if="scope.row.wayCode === 'UP_BAR'">银联二维码(被扫)</span>
                                <span v-if="scope.row.wayCode === 'UP_B2B'">银联企业网银支付</span>
                                <span v-if="scope.row.wayCode === 'UP_PC'">银联网关支付</span>
                                <span v-if="scope.row.wayCode === 'UP_JSAPI'">银联JS支付</span>
                                <span v-if="scope.row.wayCode === 'PP_PC'">Paypal支付</span>
                                <span v-if="scope.row.wayCode === 'SAND_H5'">杉德H5收银台</span>
                                <span v-if="scope.row.wayCode === 'PRE_ORDER'">汇付斗拱预下单</span>
                                <span v-if="scope.row.wayCode === 'HY_PAY'">红云余额支付</span>
                                <span v-if="scope.row.wayCode === 'QR_CASHIER'">QR_CASHIER</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                fixed="right"
                                align="center"
                                prop="state"
                                width="120"
                                label="支付状态">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.state === 0">订单生成</el-tag>
                                <el-tag v-if="scope.row.state === 1" type="danger">支付中</el-tag>
                                <el-tag v-if="scope.row.state === 2" type="success">支付成功</el-tag>
                                <el-tag v-if="scope.row.state === 3" type="warning">支付失败</el-tag>
                                <el-tag v-if="scope.row.state === 4" type="danger">已撤销</el-tag>
                                <el-tag v-if="scope.row.state === 5" type="warning">已退款</el-tag>
                                <el-tag v-if="scope.row.state === 6" type="info">订单关闭</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-pagination
                        style="margin-top: 10px;"
                        v-if="carOrderList.length"
                        @size-change="carOrderSizeChangeHandle"
                        @current-change="carOrderCurrentChangeHandle"
                        :current-page="carOrderPage.currentPage"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="carOrderPage.pageSize"
                        :total="carOrderPage.total"
                        layout="total, sizes, prev, pager, next, jumper"
                ></el-pagination>
            </el-tab-pane>
            <el-tab-pane label="会员余额停车订单" name="second">
                <div class="search-bar">
                    <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
                        <div class="input-row">
                            <el-form-item prop="settlement" label="结算状态:">
                                <el-select v-model="searchForm.settlement" clearable filterable placeholder="请选择">
                                    <el-option
                                            label="未结算"
                                            value="0">
                                    </el-option>
                                    <el-option
                                            label="已结算"
                                            value="1">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="carNo" label="车牌号:" class="search-form-item">
                                <el-input type="text" style="width: 200px;" v-model="searchForm.carNo" clearable placeholder="请输入支付单号"></el-input>
                            </el-form-item>
                            <el-form-item label="车辆类型" prop="carType">
                                <template>
                                    <el-select
                                            v-model="searchForm.carType"
                                            clearable
                                            placeholder="车辆类型"
                                            size="small"
                                    >
                                        <el-option label="蓝牌车" value="蓝牌车"></el-option>
                                        <el-option label="新能源车" value="新能源车"></el-option>
                                    </el-select>
                                </template>
                            </el-form-item>
                            <el-form-item label="支付时间:">
                                <el-date-picker
                                        clearable
                                        size="small"
                                        v-model="dateRange"
                                        type="datetimerange"
                                        :range-separator="$t('date.tip')"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        :start-placeholder="$t('text.startTime')"
                                        :end-placeholder="$t('date.end')"
                                ></el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('product.search')}}</div>
                                <div class="default-btn" @click="resetForm('searchForm')">{{$t('product.reset')}}</div>
                                <div class="default-btn primary-btn" @click="exportFrom()">{{$t('order.export')}}</div>
                                <div
                                        class="default-btn primary-btn"
                                        @click.stop="statisticClick()">
                                    {{statisticName}}
                                </div>
                                <div class="default-btn primary-btn" v-if="isAuth('platform:order:carBalanceOrderSettlement')" @click="settlement()">结算</div>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
                <div v-if="statisticName == '关闭统计'" class="data-statistics" style="background: rgb(250, 250, 250);">
                    <div class="statistics-list">
                        <div class="item">
                            <div class="title">实际累计使用金额</div>
                            <div class="amount"  style="color: rgb(26, 102, 255);"><span
                                    class="amount-num">{{balanceUseStatistic.actualAmount ? balanceUseStatistic.actualAmount : 0}}</span>元
                            </div>
                        </div>
                        <div class="item">
                            <div class="title">累计使用笔数</div>
                            <div class="amount"  style="color: rgb(250, 173, 20);">
                                <span class="amount-num">{{balanceUseStatistic.writeOffCount ? balanceUseStatistic.writeOffCount : 0}}</span>笔
                            </div>
                        </div>
<!--                        <div class="item">-->
<!--                            <div class="title">店铺实得金额</div>-->
<!--                            <div class="amount"  style="color: rgb(26, 102, 255);"><span-->
<!--                                    class="amount-num">{{balanceUseStatistic.totalShopAmount ? balanceUseStatistic.totalShopAmount : 0}}</span>元-->
<!--                            </div>-->
<!--                        </div>-->
<!--                        <div class="item">-->
<!--                            <div class="title">费率扣除金额</div>-->
<!--                            <div class="amount"  style="color: rgb(26, 102, 255);"><span-->
<!--                                    class="amount-num">{{balanceUseStatistic.totalRateAmount ? balanceUseStatistic.totalRateAmount : 0}}</span>元-->
<!--                            </div>-->
<!--                        </div>-->
                        <div class="item">
                            <div class="title">当日使用金额</div>
                            <div class="amount"  style="color: rgb(26, 102, 255);">
                                <span class="amount-num">{{balanceUseStatistic.toDayAmount ? balanceUseStatistic.toDayAmount : 0}}</span>元
                            </div>
                            <div class="detail">
                                <span style="margin-right: 10px;">{{balanceUseStatistic.toDayCount ? balanceUseStatistic.toDayCount : 0}}笔</span>
                            </div>
                        </div>
                        <div class="item">
                            <div class="title">昨日使用金额</div>
                            <div class="amount"  style="color: rgb(26, 102, 255);">
                                <span class="amount-num">{{balanceUseStatistic.yesterdayAmount ? balanceUseStatistic.yesterdayAmount : 0}}</span>元
                            </div>
                            <div class="detail">
                                <span style="margin-right: 10px;">{{balanceUseStatistic.yesterdayCount ? balanceUseStatistic.yesterdayCount : 0}}笔</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 10px;">
                    <el-table ref="memberRecordTable"
                              @select="selectHandle"
                              @select-all="selectAll"
                              v-loading="tableLoading"
                              :data="balanceUseDataList"
                              :row-key="getRowKeys"
                              header-cell-class-name="table-header"
                              row-class-name="table-row-low" style="width: 100%">
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column prop="settlement" label="结算状态">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.settlement === 0">未结算</el-tag>
                                <el-tag v-if="scope.row.settlement === 1" type="success">已结算</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="userMobile" label="用户手机号" min-width="110">
                            <template slot-scope="scope">
                                {{ scope.row.userMobile ? scope.row.userMobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "暂无" }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="changeBalance" label="支付金额" min-width="110">
                            <template slot-scope="scope">
                                <span class="totalprice">{{ scope.row.changeBalance.toFixed(2) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="entranceTime" label="入场时间" min-width="140"></el-table-column>
                        <el-table-column prop="parkTime" label="停车时长" min-width="140"></el-table-column>
                        <el-table-column prop="carType" label="车辆类型" min-width="140"></el-table-column>
                        <el-table-column prop="carNo" label="车牌号"/>
<!--                        <el-table-column prop="shopAmount" label="店铺实得金额（元）"/>-->
<!--                        <el-table-column prop="rateAmount" label="费率扣除金额（元）"/>-->
<!--                        <el-table-column prop="wyAmount" label="物业承担金额（元）"/>-->
<!--                        <el-table-column prop="scAmount" label="首诚承担金额（元）"/>-->
                        <el-table-column prop="createTime" label="支付时间" min-width="150"></el-table-column>
                    </el-table>
                </div>
                <el-pagination
                        style="margin-top: 10px;"
                        v-if="carOrderList.length"
                        @size-change="carBalanceSizeChangeHandle"
                        @current-change="carBalanceCurrentChangeHandle"
                        :current-page="page.currentPage"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="page.pageSize"
                        :total="page.total"
                        layout="total, sizes, prev, pager, next, jumper"
                ></el-pagination>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
  export default {
    name: 'car-record',
    data(){
      return {
        payWayList:[
          {
            "wayName": "支付宝APP",
            "wayType": "ALIPAY",
            "wayCode": "ALI_APP"
          },
          {
            "wayName": "支付宝条码",
            "wayType": "ALIPAY",
            "wayCode": "ALI_BAR"
          },
          {
            "wayName": "支付宝生活号",
            "wayType": "ALIPAY",
            "wayCode": "ALI_JSAPI"
          },
          {
            "wayName": "支付宝小程序",
            "wayType": "ALIPAY",
            "wayCode": "ALI_LITE"
          },
          {
            "wayName": "支付宝PC网站",
            "wayType": "ALIPAY",
            "wayCode": "ALI_PC"
          },
          {
            "wayName": "支付宝二维码",
            "wayType": "ALIPAY",
            "wayCode": "ALI_QR"
          },
          {
            "wayName": "支付宝WAP",
            "wayType": "ALIPAY",
            "wayCode": "ALI_WAP"
          },
          {
            "wayName": "红云余额支付",
            "wayType": "OTHER",
            "wayCode": "HY_PAY"
          },
          {
            "wayName": "汇付斗拱预支付",
            "wayType": "OTHER",
            "wayCode": "PRE_ORDER"
          },
          {
            "wayName": "银联App支付",
            "wayType": "UNIONPAY",
            "wayCode": "UP_APP"
          },
          {
            "wayName": "银联企业网银支付",
            "wayType": "UNIONPAY",
            "wayCode": "UP_B2B"
          },
          {
            "wayName": "银联二维码(被扫)",
            "wayType": "UNIONPAY",
            "wayCode": "UP_BAR"
          },
          {
            "wayName": "银联Js支付",
            "wayType": "UNIONPAY",
            "wayCode": "UP_JSAPI"
          },
          {
            "wayName": "银联网关支付",
            "wayType": "UNIONPAY",
            "wayCode": "UP_PC"
          },
          {
            "wayName": "银联二维码(主扫)",
            "wayType": "UNIONPAY",
            "wayCode": "UP_QR"
          },
          {
            "wayName": "银联手机网站支付",
            "wayType": "UNIONPAY",
            "wayCode": "UP_WAP"
          },
          {
            "wayName": "微信APP",
            "wayType": "WECHAT",
            "wayCode": "WX_APP"
          },
          {
            "wayName": "微信条码",
            "wayType": "WECHAT",
            "wayCode": "WX_BAR"
          },
          {
            "wayName": "微信H5",
            "wayType": "WECHAT",
            "wayCode": "WX_H5"
          },
          {
            "wayName": "微信公众号",
            "wayType": "WECHAT",
            "wayCode": "WX_JSAPI"
          },
          {
            "wayName": "微信小程序",
            "wayType": "WECHAT",
            "wayCode": "WX_LITE"
          },
          {
            "wayName": "微信扫码",
            "wayType": "WECHAT",
            "wayCode": "WX_NATIVE"
          },
          {
            "wayName": "云闪付条码",
            "wayType": "YSFPAY",
            "wayCode": "YSF_BAR"
          },
          {
            "wayName": "云闪付jsapi",
            "wayType": "YSFPAY",
            "wayCode": "YSF_JSAPI"
          }
        ],
        statisticName:"数据统计",
        tabActive:'first',
        carOrderList:[],//停车订单
        carOrderLoading:false,
        carOrderPage:{
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        carStatistic:{
          actualAmount:0,
          mchFeeAmount:0,
          payAmount:0,
          payCount:0,
          refundAmount:0,
          refundCount:0,
          toDayPayAmount:0,
          toDayPayCount:0,
          yesterdayPayAmount:0,
          yesterdayPayCount:0,
        },
        payDateRange:[],//支付时间
        carDataForm:{
          state:2,
          wayCode:'',
          carNo:'',
          carType:''
        },
        carMchNo:'',
        balanceUseStatistic:{
          actualAmount:0,
          writeOffCount:0,
          yesterdayAmount:0,
          yesterdayCount:0,
          toDayAmount:0,
          toDayCount:0,
          totalShopAmount:0,
          totalRateAmount:0
        },
        balanceUseDataList:[],
        searchForm:{
          settlement:'',
          carNo:''
        },
        dateRange:[],
        selectMemberRecord:[],
        payNos:[],
        tableLoading:false
      }
    },
    methods:{
      tabHandleClick(){
        this.carOrderPage = {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        }
        this.page = {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        }
        this.statisticName = "数据统计"
        if(this.tabActive === "first"){
          this.getCarMchNo()
        }else if(this.tabActive === "second"){
          this.getDataList(this.page)
          this.getStatistic()
        }
      },
      //余额支付停车订单数据
      // 停车订单每页数
      carBalanceSizeChangeHandle (val) {
        this.page.pageSize = val
        this.page.currentPage = 1
        this.getTodayCarOrder()
        this.getDataList(this.page)
      },
      // 停车订单当前页
      carBalanceCurrentChangeHandle (val) {
        this.page.currentPage = val
        this.getTodayCarOrder()
        this.getDataList(this.page)
      },
      //列表查询
      getDataList (page) {
        this.tableLoading = true
        this.searchForm.payType = 1
        this.$http({
          url: this.$http.adornUrl('/user/userBalanceUseLog/getUseBalanceRecord'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign({
              'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
              'endTime': this.dateRange === null ? null : this.dateRange[1], // 结束时间
              current: page ? page.currentPage : this.page.currentPage,
              size: page ? page.pageSize : this.page.pageSize
            },this.searchForm)
          )
        }).then(({ data }) => {
          this.balanceUseDataList = data.records
          this.page.total = data.total
          this.tableLoading = false
          this.$nextTick(() => {
            if (this.selectMemberRecord.length > 0) {
              this.dataList.map(element => {
                if (this.selectMemberRecord.map(item => item.payNo).indexOf(element.payNo) !== -1) {
                  this.$refs.memberRecordTable.toggleRowSelection(element, true)
                }
              })
            }
          })
        })
      },
      //统计数据
      getStatistic () {
        this.searchForm.payType = 1
        this.$http({
          url: this.$http.adornUrl('/user/userBalanceUseLog/statisticBalanceUse'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign({
              'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
              'endTime': this.dateRange === null ? null : this.dateRange[1], // 结束时间
            },this.searchForm)
          )
        }).then(({ data }) => {
          this.balanceUseStatistic = data;
        })
      },
      getRowKeys (row) {
        return row.payNo
      },
      // 全选
      selectAll (e) {
        if (e.length > 0) {
          this.selectMemberRecord = this.selectMemberRecord.filter(value => this.dataList.map(val => val.payNo).indexOf(value.payNo) === -1)
          this.dataList.map(value => {
            this.selectMemberRecord.push(value)
          })
        } else {
          this.selectMemberRecord = this.selectMemberRecord.filter(value => this.dataList.map(val => val.payNo).indexOf(value.payNo) === -1)
        }
      },
      // 手动勾选数据行的 Checkbox 时触发的事
      selectHandle (selection, row) {
        // 判断是否选中
        let selectionStatu = selection.map(element => element.payNo).indexOf(row.payNo) !== -1
        if (selectionStatu && selection.length > 0 && selection) {
          // 选中添加
          this.selectMemberRecord.push(row)
        } else {
          // 未选中删除
          this.selectMemberRecord = this.selectMemberRecord.filter(element => element.payNo !== row.payNo)
        }
      },
      //结算
      settlement(){
        if(this.selectMemberRecord.length > 1){
          let b = this.selectMemberRecord.every(item=>item.settlement === this.selectMemberRecord[0].settlement)
          if(!b){
            this.$message.warning("勾选记录存在不同结算状态");
            return
          }
        }
        this.payNos = this.selectMemberRecord.map(item => item.payNo);
        if(this.payNos.length < 1){
          this.$message.warning("请勾选需要结算的订单");
          return
        }
        this.$confirm('确定结算吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/user/userBalanceUseLog/updateBalanceUseRecordSettlementStatusByPayNos'),
            method: 'post',
            data:  this.$http.adornData({
              payNos: this.payNos
            })
          }).then(({data}) => {
            this.getDataList()
            this.selectMemberRecord = []
            this.$refs.memberRecordTable.clearSelection()
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
            })
          })
        })
      },
      searchChange () {
        this.page.currentPage = 1
        this.getDataList(this.page)
        this.getStatistic()
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.dateRange = []
        this.selectMemberRecord = []
        this.$refs.memberRecordTable.clearSelection()
      },
      //导出核销记录
      exportFrom(){
        const loading = this.$loading({
          lock: true,
          target: '.carRecord',
          customClass: 'export-load',
          background: 'transparent',
          text: "数据导出中......"
        })
        this.searchForm.payType = 1
        this.$http({
          url: this.$http.adornUrl('/user/userBalanceUseLog/carRecordDownload'),
          method: 'GET',
          params: this.$http.adornParams(
            Object.assign({
              'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
              'endTime': this.dateRange === null ? null : this.dateRange[1], // 结束时间
            },this.searchForm)
          ),
          responseType: 'blob'
        }).then(({data}) => {
          loading.close()
          let fileName = "会员卡停车缴费记录.xlsx";
          let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
          const elink = document.createElement('a')
          if ('download' in elink) {
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            navigator.msSaveBlob(blob, fileName)
          }
          this.$message({
            message: "导出成功",
            type: 'success',
            duration: 1500,
            onClose: () => {

            }
          })
        }).catch((e) => {
          loading.close()
        })
      },
      //结束
      init(){
        this.tabActive = "first";
        this.carOrderPage = {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        }
        this.getCarMchNo()
      },
      //查询停车商户号
      getCarMchNo(){
        this.$http({
          url: this.$http.adornUrl('/sys/config/info/configQuery'),
          method: 'get',
          params: this.$http.adornParams({
            configName:"MCH_NO"
          })
        }).then(({ data }) => {
          this.carMchNo = data
          this.carOrderPage.currentPage = 1
          this.getTodayCarOrder()
          this.getYesterdayCarOrder()
          this.getCarOrder(this.carOrderPage)
        })
      },
      //数据统计点击
      statisticClick () {
        if (this.statisticName === '数据统计') {
          this.statisticName = '关闭统计'
        } else {
          this.statisticName = '数据统计'
        }
      },
      //车牌号改变
      carNoInput(e){
        this.carDataForm.carType = "";
      },
      //车辆类型改变
      carTypeChange(e){
        this.carDataForm.carNo = "";
      },
      //停车订单查询
      searchCarChange(newData = false){
        this.carOrderPage.currentPage = 1
        this.getTodayCarOrder()
        this.getYesterdayCarOrder()
        this.getCarOrder(this.carOrderPage, null, newData)
      },
      //停车清空搜索
      carClear(){
        this.carDataForm = {}
        this.payDateRange = []
      },
      // 停车订单每页数
      carOrderSizeChangeHandle (val) {
        this.carOrderPage.pageSize = val
        this.carOrderPage.currentPage = 1
        this.getTodayCarOrder()
        this.getCarOrder(this.carOrderPage)
      },
      // 停车订单当前页
      carOrderCurrentChangeHandle (val) {
        this.carOrderPage.currentPage = val
        this.getTodayCarOrder()
        this.getCarOrder(this.carOrderPage)
      },
      //查询停车订单
      getCarOrder(page){
        this.carOrderLoading = true
        this.$http({
          url: this.$http.adornUrl('/platform/order/queryOfflinePaymentOrders'),
          method: 'GET',
          params: this.$http.adornParams({
            current: page == null ? this.carOrderPage.currentPage : page.currentPage,
            size: page == null ? this.carOrderPage.pageSize : page.pageSize,
            mchNo: this.carMchNo,
            mchNoList:[],
            'extParam': this.carDataForm.carNo ? this.carDataForm.carNo : this.carDataForm.carType ? this.carDataForm.carType : '',
            'wayCode': this.carDataForm.wayCode,
            'state': 2,
            'queryDateRange': this.payDateRange !== null && this.payDateRange[0] && this.payDateRange[1] ? "customDateTime_" + this.payDateRange[0] + " 00:00:00_" + this.payDateRange[1] + " 23:59:59" : "" , // 开始时间
          })
        }).then(({ data }) => {
          for (let i = 0; i < data.records.length; i++) {
            data.records[i].amount = this.regFenToYuan(data.records[i].amount)
            data.records[i].refundAmount = this.regFenToYuan(data.records[i].refundAmount)
            data.records[i].mchFeeAmount = this.regFenToYuan(data.records[i].mchFeeAmount)
            if(data.records[i].extParam){
              data.records[i].extParam = JSON.parse(data.records[i].extParam)
            }
          }
          if(data.totalData){
            this.carStatistic.actualAmount = ((data.totalData.payAmount - data.totalData.mchFeeAmount) / 100).toFixed(2)
            this.carStatistic.payAmount = (data.totalData.payAmount / 100).toFixed(2)
            this.carStatistic.mchFeeAmount = (data.totalData.mchFeeAmount / 100).toFixed(2)
            this.carStatistic.payCount = data.totalData.payCount
            this.carStatistic.refundAmount = (data.totalData.refundAmount / 100).toFixed(2)
            this.carStatistic.refundCount = data.totalData.refundCount
          }
          this.carOrderList = data.records
          this.carOrderPage.total = data.total
        }).finally(()=>{
          this.carOrderLoading = false
        })
      },
      regFenToYuan(fen){
        let num = fen;
        num=fen*0.01;
        num+='';
        let reg = num.indexOf('.') >-1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g;
        num=num.replace(reg,'$1');
        num = this.toDecimal2(num)
        return num
      },
      toDecimal2(x){
        var f = parseFloat(x);
        if (isNaN(f)) {
          return false;
        }
        var f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
          rs = s.length;
          s += '.';
        }
        while (s.length <= rs + 2) {
          s += '0';
        }
        return s;
      },
      //导出停车订单
      downloadCarRecord(){
        const loading = this.$loading({
          lock: true,
          target: '.mod-order-order',
          customClass: 'export-load',
          background: 'transparent',
          text: '数据导出中......'
        })
        let extParam = "";
        if(this.carDataForm.carNo){
          extParam = this.carDataForm.carNo
        }
        this.$http({
          url: this.$http.adornUrl('/platform/carManage/downloadCarRecord'),
          method: 'GET',
          params: this.$http.adornParams({
            'mchNo':this.carMchNo,
            'extParam': this.carDataForm.carNo ? this.carDataForm.carNo : this.carDataForm.carType ? this.carDataForm.carType : '',
            'wayCode': this.carDataForm.wayCode,
            'state': 2,
            'queryDateRange': this.payDateRange !== null && this.payDateRange[0] && this.payDateRange[1] ? "customDateTime_" + this.payDateRange[0] + " 00:00:00_" + this.payDateRange[1] + " 23:59:59" : "" , // 开始时间
          }),
          responseType: 'blob'
        }).then(({data}) => {
          loading.close()
          let fileName = '停车记录数据.xlsx'
          let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
          const elink = document.createElement('a')
          if ('download' in elink) {
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            navigator.msSaveBlob(blob, fileName)
          }
          this.$message({
            message: '导出成功',
            type: 'success',
            duration: 1500,
            onClose: () => {

            }
          })
        }).catch((e) => {
          loading.close()
        })
      },
      //查询当日停车订单
      getTodayCarOrder(){
        this.$http({
          url: this.$http.adornUrl('/platform/order/queryOfflinePaymentOrders'),
          method: 'GET',
          params: this.$http.adornParams({
            mchNo: this.carMchNo,
            mchNoList:[],
            'state': 2,
            'queryDateRange': "today", // 开始时间
          })
        }).then(({ data }) => {
          if(data.totalData){
            this.carStatistic.toDayPayAmount = (data.totalData.payAmount / 100).toFixed(2)
            this.carStatistic.toDayPayCount = data.totalData.payCount
          }
        })
      },
      //查询昨日停车订单
      getYesterdayCarOrder(){
        this.$http({
          url: this.$http.adornUrl('/platform/order/queryOfflinePaymentOrders'),
          method: 'GET',
          params: this.$http.adornParams({
            mchNo: this.carMchNo,
            mchNoList:[],
            'state': 2,
            'queryDateRange': "yesterday", // 开始时间
          })
        }).then(({ data }) => {
          if(data.totalData){
            this.carStatistic.yesterdayPayAmount = (data.totalData.payAmount / 100).toFixed(2)
            this.carStatistic.yesterdayPayCount = data.totalData.payCount
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
    .totalprice {
        color: #ff4141;
    }
    .data-statistics {
        margin: 15px 0 0;
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
                    display: flex;
                    align-items: baseline;
                    .amount-num {
                        padding-right: 3px;
                        font-weight: 600;
                        font-size: 20px;
                    }
                }
                .detail {
                    display: flex;
                }
                .detail-text {
                    color: #1965ff;
                    cursor: pointer;
                }
            }
        }
    }
</style>
