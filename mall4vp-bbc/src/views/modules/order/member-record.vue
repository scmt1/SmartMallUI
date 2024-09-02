<template>
    <div class="memberRecord">
        <!-- 搜索 -->
        <div class="search-bar">
            <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
                <div class="input-row">
                    <el-form-item prop="nickName" label="会员昵称:">
                        <el-input type="text" style="width: 160px;" v-model="searchForm.nickName" clearable placeholder="请输入会员昵称"></el-input>
                    </el-form-item>
                    <el-form-item prop="shopId" label="核销店铺:">
                        <el-select v-model="searchForm.shopIds" clearable filterable multiple placeholder="请选择">
                            <el-option
                                    v-for="item in shopList"
                                    :key="item.shopId"
                                    :label="item.shopName"
                                    :value="item.shopId">
                            </el-option>
                        </el-select>
                    </el-form-item>
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
                    <el-form-item prop="payNo" label="支付单号:" class="search-form-item">
                        <el-input type="text" style="width: 200px;" v-model="searchForm.payNo" clearable placeholder="请输入支付单号"></el-input>
                    </el-form-item>
                    <el-form-item label="使用时间:">
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
                        <div class="default-btn primary-btn" v-if="isAuth('platform:order:memberOrderSettlement')" @click="settlement()">结算</div>
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
                    <div class="detail">
                        <span @click.stop="useBalanceDetail()" class="detail-text" >明细</span>
                    </div>
                </div>
                <div class="item">
                    <div class="title">累计使用笔数</div>
                    <div class="amount"  style="color: rgb(250, 173, 20);">
                        <span class="amount-num">{{balanceUseStatistic.writeOffCount ? balanceUseStatistic.writeOffCount : 0}}</span>笔
                    </div>
                </div>
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
<!--                <div class="item">-->
<!--                    <div class="title">店铺实得金额</div>-->
<!--                    <div class="amount"  style="color: rgb(26, 102, 255);"><span-->
<!--                            class="amount-num">{{balanceUseStatistic.totalShopAmount ? balanceUseStatistic.totalShopAmount : 0}}</span>元-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="item">-->
<!--                    <div class="title">费率扣除金额</div>-->
<!--                    <div class="amount"  style="color: rgb(26, 102, 255);"><span-->
<!--                            class="amount-num">{{balanceUseStatistic.totalRateAmount ? balanceUseStatistic.totalRateAmount : 0}}</span>元-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="item">-->
<!--                    <div class="title">物业承担金额</div>-->
<!--                    <div class="amount"  style="color: rgb(26, 102, 255);"><span-->
<!--                            class="amount-num">{{balanceUseStatistic.wyTotalAmount ? balanceUseStatistic.wyTotalAmount : 0}}</span>元-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="item">-->
<!--                    <div class="title">首诚承担金额</div>-->
<!--                    <div class="amount"  style="color: rgb(26, 102, 255);"><span-->
<!--                            class="amount-num">{{balanceUseStatistic.scTotalAmount ? balanceUseStatistic.scTotalAmount : 0}}</span>元-->
<!--                    </div>-->
<!--                </div>-->
            </div>
        </div>
        <div class="main-container">
            <!-- 表格 -->
            <div class="table-con sys-user-table">
                <el-table ref="memberRecordTable"
                          @select="selectHandle"
                          @select-all="selectAll"
                          v-loading="tableLoading"
                          :data="dataList"
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
                    <el-table-column prop="nickName" label="会员昵称" min-width="100">
                        <template slot-scope="scope">
                            {{ scope.row.nickName ? scope.row.nickName : "暂无" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="userMobile" label="用户手机号" min-width="110">
                        <template slot-scope="scope">
                            {{ scope.row.userMobile ? scope.row.userMobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "暂无" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="payNo" label="支付单号" min-width="140"></el-table-column>
                    <el-table-column prop="shopName" label="核销店铺" min-width="110"></el-table-column>
                    <el-table-column prop="changeBalance" label="金额" min-width="110">
                        <template slot-scope="scope">
                            <span class="totalprice">{{ scope.row.changeBalance.toFixed(2) }}</span>
                        </template>
                    </el-table-column>
<!--                    <el-table-column prop="shopAmount" label="店铺实得金额（元）"/>-->
<!--                    <el-table-column prop="rateAmount" label="费率扣除金额（元）"/>-->
<!--                    <el-table-column prop="wyAmount" label="物业承担金额（元）"/>-->
<!--                    <el-table-column prop="scAmount" label="首诚承担金额（元）"/>-->
                    <el-table-column prop="createTime" label="使用时间" min-width="150"></el-table-column>
                    <el-table-column prop="employeeNickName" label="核销人员"/>
                </el-table>
            </div>
            <!-- 分页 -->
            <el-pagination
                    v-if="dataList.length"
                    @size-change="sizeChangeHandle"
                    @current-change="currentChangeHandle"
                    :current-page="page.currentPage"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="page.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="page.total">
            </el-pagination>
        </div>

        <!--  会员卡使用情况查看  -->
        <el-dialog
                title="会员卡余额店铺使用情况"
                :visible.sync="useBalanceDetailShow"
                width="750px"
                class="useCardDetail"
        >
            <div class="main-container">
                <div class="search-bar">
                    <el-form :inline="true" class="search-form" ref="detailSearchForm" size="small">
                        <div class="input-row">
                            <el-form-item label="使用时间:" class="search-form-item">
                                <el-date-picker
                                        style="height: 30px;"
                                        v-model="useBalanceDateRange"
                                        type="datetimerange"
                                        range-separator="至"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                ></el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <div class="default-btn primary-btn" @click="searchUseBalanceDetail()">{{
                                    $t('product.search') }}
                                </div>
                                <div class="default-btn" @click="resetDetailSearchForm('detailSearchForm')">{{ $t('product.reset') }}
                                </div>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
                <div class="prods-select-body">
                    <el-table
                            v-loading="useBalanceLoading"
                            max-height="500"
                            ref="shopBalanceUseTable"
                            :data="shopBalanceUseList"
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
                                prop="writeOffTotalAmount"
                                label="已核销金额"
                        ></el-table-column>
                        <el-table-column
                                prop="writeOffNum"
                                label="已核销笔数"
                        ></el-table-column>
                        <el-table-column
                                fixed="right"
                                align="center"
                                :label="$t('publics.operating')"
                                width="80"
                        >
                            <template slot-scope="scope">
                                <div class="text-btn-con">
                                    <div
                                            class="default-btn text-btn"
                                            @click="getShopWriteOffDetail(scope.row.shopId,scope.row.shopName)"
                                    >明细
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <span slot="footer">
                <div @click="useBalanceDetailShow = false" class="default-btn">{{ $t('remindPop.cancel') }}</div>
            </span>
        </el-dialog>

        <!--  店铺会员卡核销明细查看  -->
        <el-dialog
                title="会员卡店铺使用明细"
                :visible.sync="shopWriteOffDetailShow"
                width="900px"
                class="shopWriteOffDetail"
        >
            <div class="main-container">
                <div>
                    <el-button type="primary" size="small" @click="exportData">导出</el-button>
                </div>
                <div style="margin: 10px 0;">
                    <el-table
                            v-loading="writeOffLoading"
                            :data="shopWriteOffList"
                            header-cell-class-name="table-header"
                            row-class-name="table-row-low"
                            style="width: 100%"
                    >
                        <el-table-column
                                fixed
                                label="使用人"
                                prop="nickName"
                                width="120"
                        >
                            <template slot-scope="scope">
                                <span v-if="scope.row.nickName">{{scope.row.nickName}}</span>
                                <span v-else>暂无</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                fixed
                                label="联系电话"
                                prop="userMobile"
                                width="120"
                        >
                            <template slot-scope="scope">
                                <span v-if="scope.row.userMobile">{{scope.row.userMobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}}</span>
                                <span v-else>暂无</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="支付单号"
                                prop="payNo"
                                width="180"
                        />
                        <el-table-column
                                prop="changeBalance"
                                label="金额（元）"
                                width="120"
                        />
                        <el-table-column
                                prop="createTime"
                                label="使用时间"
                        />
                        <el-table-column
                                prop="shopName"
                                label="核销店铺"
                        />
                        <div slot="empty">
                            &nbsp;
                        </div>
                    </el-table>
                </div>
                <el-pagination
                        @size-change="shopWriteOffHandleSizeChange"
                        @current-change="shopWriteOffHandleCurrentChange"
                        :current-page="shopWriteOffPage.currentPage"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="shopWriteOffPage.pageSize"
                        :total="shopWriteOffPage.total"
                        layout="total, sizes, prev, pager, next, jumper"
                ></el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'card-record',
    data(){
      return {
        theData: null, // 保存上次点击查询的请求条件
        searchForm:{
          shopId:'',
          settlement:'',
          nickName:'',
          payNo:'',
          shopIds:[]
        },
        dateRange:[],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        shopList:[],
        tableLoading:false,
        dataList:[],
        balanceUseStatistic:{
          actualAmount:0,
          writeOffCount:0,
          yesterdayAmount:0,
          yesterdayCount:0,
          toDayAmount:0,
          toDayCount:0,
          totalShopAmount:0,
          totalRateAmount:0,
          scTotalAmount:0,
          wyTotalAmount:0
        },
        statisticName: '数据统计',
        selectMemberRecord:[],
        payNos:[],
        useBalanceDateRange:[],
        useBalanceDetailShow: false,
        useBalanceLoading: false,
        shopBalanceUseList:[],
        shopWriteOffDetailShow:false,
        shopWriteOffPage: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        writeOffLoading:false,
        shopWriteOffList:[],
        writeOffShopId:'',
        shopName:'',
      }
    },
    methods:{
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
      //数据统计点击
      statisticClick () {
        if (this.statisticName === '数据统计') {
          this.statisticName = '关闭统计'
        } else {
          this.statisticName = '数据统计'
        }
      },
      init(){
        this.getShopList()
        this.getDataList()
        this.getStatistic()
      },
      // 获取所有营业店铺
      getShopList() {
        this.$http({
          url: this.$http.adornUrl("/platform/shopDetail/getAllShop"),
          method: "get",
          params: this.$http.adornParams(),
        }).then(({ data }) => {
          this.shopList = data;
        });
      },
      //统计数据
      getStatistic () {
        this.searchForm.payType = 0
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
      //列表查询
      getDataList (page) {
        this.tableLoading = true
        this.searchForm.payType = 0
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
          this.dataList = data.records
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
      // 每页数
      sizeChangeHandle (val) {
        this.page.pageSize = val
        this.page.currentPage = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.page.currentPage = val
        this.getDataList()
      },
      searchChange () {
        this.page.currentPage = 1
        this.getDataList(this.page)
        this.getStatistic()
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.searchForm.shopIds = []
        this.dateRange = []
        this.selectMemberRecord = []
        this.$refs.memberRecordTable.clearSelection()
      },
      //导出核销记录
      exportFrom(){
        const loading = this.$loading({
          lock: true,
          target: '.memberRecord',
          customClass: 'export-load',
          background: 'transparent',
          text: "数据导出中......"
        })
        this.searchForm.payType = 0
        this.$http({
          url: this.$http.adornUrl('/user/userBalanceUseLog/download'),
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
          let fileName = "会员卡使用记录数据.xlsx";
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
      //核销详细
      useBalanceDetail(){
        this.useBalanceDateRange = []
        this.balanceUseDetail()
        this.useBalanceDetailShow = true
      },
      //搜索明细
      searchUseBalanceDetail(){
        this.balanceUseDetail()
      },
      //重置明细搜索
      resetDetailSearchForm(){
        this.useBalanceDateRange = null
      },
      //会员卡各店铺使用明细
      balanceUseDetail(){
        this.useBalanceLoading = true;
        this.$http({
          url: this.$http.adornUrl('/user/userBalanceUseLog/statisticShopBalanceUse'),
          method: 'get',
          params: this.$http.adornParams(
            {
              'startTime': this.useBalanceDateRange === null ? null : this.useBalanceDateRange[0], // 开始时间
              'endTime': this.useBalanceDateRange === null ? null : this.useBalanceDateRange[1], // 结束时间
              'payType': 0
            }
          )
        }).then(({data}) => {
          this.shopBalanceUseList = data
        }).finally(()=>{
          this.useBalanceLoading = false;
        })
      },
      //查询核销明细
      getShopWriteOffDetail(shopId,shopName){
        this.writeOffShopId = shopId
        this.shopName = shopName
        this.shopWriteOffDetailShow = true
        this.shopWriteOffPage.currentPage = 1
        this.shopWriteOffPage.pageSize = 10
        this.getWriteOffRecordList(this.shopWriteOffPage)
      },
      //获取会员卡使用记录列表
      getWriteOffRecordList(page){
        this.writeOffLoading = true;
        this.$http({
          url: this.$http.adornUrl('/user/userBalanceUseLog/getUseBalanceRecord'),
          method: 'get',
          params: this.$http.adornParams(
            {
              shopId:this.writeOffShopId,
              current: page == null ? this.shopWriteOffPage.currentPage : page.currentPage,
              size: page == null ? this.shopWriteOffPage.pageSize : page.pageSize,
              startTime: this.useBalanceDateRange ? this.useBalanceDateRange[0] : null, // 开始时间
              endTime: this.useBalanceDateRange ? this.useBalanceDateRange[1] : null, // 结束时间
              payType:0
            }
          )
        }).then(({data}) => {
          this.shopWriteOffList = data.records
          this.shopWriteOffPage.total = data.total
        }).finally(()=>{
          this.writeOffLoading = false;
        })
      },
      shopWriteOffHandleSizeChange (val) {
        this.shopWriteOffPage.pageSize = val
        this.getWriteOffRecordList()
      },
      shopWriteOffHandleCurrentChange (val) {
        this.shopWriteOffPage.currentPage = val
        this.getWriteOffRecordList()
      },
      //导出
      exportData () {
        const loading = this.$loading({
          lock: true,
          target: '.shopWriteOffDetail',
          customClass: 'export-load',
          background: 'transparent',
          text: "数据导出中......"
        })
        this.$http({
          url: this.$http.adornUrl('/user/userBalanceUseLog/download'),
          method: 'GET',
          params: this.$http.adornParams({
            shopId:this.writeOffShopId,
            startTime: this.useBalanceDateRange ? this.useBalanceDateRange[0] : null, // 开始时间
            endTime: this.useBalanceDateRange ? this.useBalanceDateRange[1] : null, // 结束时间
            payType:0
          }),
          responseType: 'blob'
        }).then(({data}) => {
          loading.close()
          let fileName = this.shopName + "会员卡核销记录数据.xlsx";
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
    }
  }
</script>

<style lang="scss" scoped>
    .totalprice {
        color: #ff4141;
    }
    .data-statistics {
        margin: 15px 0 0;
        border-radius: 3px;
        border: 1px solid #EBEBEB;
        .statistics-list {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            .item {
                height: 100px;
                flex: 1;
                text-align: center;
                margin: 0 20px 20px 0; // 间隙为20px
                padding-top: 20px;
                box-sizing: border-box;
                width: calc((100% - 60px) / 4);
                min-width: calc((100% - 60px) / 4);
                max-width: calc((100% - 60px) / 4);
                &:nth-child(4n + 4) {
                    margin-right: 0;
                }
                .title {
                    color: gray;
                    margin-bottom: 10px;
                }
                .amount {
                    margin-bottom: 10px;
                    display: flex;
                    align-items: baseline;
                    justify-content: center;
                    .amount-num {
                        padding-right: 3px;
                        font-weight: 600;
                        font-size: 20px;
                    }
                }
                .detail {
                    display: flex;
                    justify-content: center;
                }
                .detail-text {
                    color: #1965ff;
                    cursor: pointer;
                }
            }
        }
    }
    .useBalanceDetail{
        .search-bar{
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding: 10px 20px 10px;
        }
    }
</style>
