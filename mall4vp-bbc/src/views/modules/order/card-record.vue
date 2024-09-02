<template>
    <div class="cardRecord">
        <!-- 搜索 -->
        <div class="search-bar">
            <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
                <div class="input-row">
                    <el-form-item prop="cardShopId" label="发放来源">
                        <el-select v-model="searchForm.cardShopId" filterable clearable
                                   placeholder="请选择发放来源">
                            <el-option label="运营平台" value="0"></el-option>
                            <el-option
                                    v-for="item in shopList"
                                    :key="item.shopId"
                                    :label="item.shopName"
                                    :value="item.shopId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="userMobile" label="用户手机号:" class="search-form-item">
                        <el-input type="text" style="width: 160px;" v-model="searchForm.userMobile" clearable placeholder="请输入用户手机号"></el-input>
                    </el-form-item>
                    <el-form-item prop="cardCode" label="卡号:" class="search-form-item">
                        <el-input type="text" style="width: 160px;" v-model="searchForm.cardCode" clearable placeholder="请输入卡号"></el-input>
                    </el-form-item>
                    <el-form-item prop="orderNumber" label="订单号:" class="search-form-item">
                        <el-input type="text" style="width: 200px;" v-model="searchForm.orderNumber" clearable placeholder="请输入订单号"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="cardType">
                        <el-select filterable v-model="searchForm.cardType" clearable placeholder="请选择类型" style="width: 100%">
                            <el-option v-for="item in cardTypeList" :key="item.value" :label="item.title" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="buyCardType" label="团卡类型:">
                        <el-select v-model="searchForm.buyCardType" clearable filterable placeholder="请选择">
                            <el-option
                                    label="工会团卡(券)"
                                    value="0">
                            </el-option>
                            <el-option
                                    label="个人团卡"
                                    value="1">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="writeOffShopId" label="核销店铺:">
                        <el-select v-model="searchForm.writeOffShopIds" multiple clearable filterable placeholder="请选择">
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
                        <div class="default-btn primary-btn" v-if="isAuth('platform:order:cardOrderSettlement')" @click="settlement()">结算</div>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div v-if="statisticName == '关闭统计'" class="data-statistics" style="background: rgb(250, 250, 250);">
            <div class="statistics-list">
                <div class="item">
                    <div class="title">实际累计核销金额</div>
                    <div class="amount"  style="color: rgb(26, 102, 255);"><span
                            class="amount-num">{{cardStatistic.actualAmount ? cardStatistic.actualAmount : 0}}</span>元
                    </div>
                    <div class="detail">
                        <span @click.stop="useCardDetail()" class="detail-text" >明细</span>
                    </div>
                </div>
                <div class="item">
                    <div class="title">累计核销笔数</div>
                    <div class="amount"  style="color: rgb(250, 173, 20);">
                        <span class="amount-num">{{cardStatistic.writeOffCount ? cardStatistic.writeOffCount : 0}}</span>笔
                    </div>
                </div>
                <div class="item">
                    <div class="title">昨日核销金额</div>
                    <div class="amount"  style="color: rgb(26, 102, 255);">
                        <span class="amount-num">{{cardStatistic.yesterdayAmount ? cardStatistic.yesterdayAmount : 0}}</span>元
                    </div>
                    <div class="detail">
                        <span style="margin-right: 10px;">{{cardStatistic.yesterdayCount ? cardStatistic.yesterdayCount : 0}}笔</span>
                    </div>
                </div>
                <div class="item">
                    <div class="title">当日核销金额</div>
                    <div class="amount"  style="color: rgb(26, 102, 255);">
                        <span class="amount-num">{{cardStatistic.toDayAmount ? cardStatistic.toDayAmount : 0}}</span>元
                    </div>
                    <div class="detail">
                        <span style="margin-right: 10px;">{{cardStatistic.toDayCount ? cardStatistic.toDayCount : 0}}笔</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="main-container">
            <!-- 表格 -->
            <div class="table-con sys-user-table">
                <el-table ref="cardRecordTable"
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
                    <el-table-column prop="nickName" label="使用人" min-width="90">
                        <template slot-scope="scope">
                            {{ scope.row.nickName ? scope.row.nickName : "暂无" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="userMobile" label="用户手机号" min-width="110">
                        <template slot-scope="scope">
                            {{ scope.row.userMobile ? scope.row.userMobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "暂无" }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="cardTitle" label="卡名称" min-width="120"></el-table-column>
                    <el-table-column prop="cardCode" label="卡号" min-width="100"></el-table-column>
                    <el-table-column prop="orderNumber" label="订单号" min-width="140"></el-table-column>
                    <el-table-column prop="cardType" label="卡类别" min-width="80">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.cardType === 1 ? 'success' : ''" effect="dark">{{
                                cardTypeList.find(item => item.value == scope.row.cardType)
                                .title
                                }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="buyCardType" label="团卡(券)类型" min-width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.buyCardType == 0">工会团卡(券)</span>
                            <span v-if="scope.row.buyCardType == 1">个人团卡</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="shopName" label="核销店铺" min-width="110"></el-table-column>
                    <el-table-column prop="amount" label="金额(元)" min-width="110">
                        <template slot-scope="scope">
                            <span class="totalprice">{{ scope.row.amount.toFixed(2) }}</span>
                        </template>
                    </el-table-column>
                  <el-table-column
                      prop="shopAmount"
                      label="店铺承担金额(元)"
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.shopAmount">{{scope.row.shopAmount}}</span>
                      <span v-else>0</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="wyAmount"
                      label="物业承担金额(元)"
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.wyAmount">{{scope.row.wyAmount}}</span>
                      <span v-else>0</span>
                    </template>
                  </el-table-column>
                    <el-table-column prop="useTime" label="使用时间" min-width="150"></el-table-column>
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
        <!--  提货卡使用情况查看  -->
        <el-dialog
                title="提货卡(券)使用情况"
                :visible.sync="useCardDetailShow"
                width="750px"
                class="useCardDetail"
        >
            <div class="main-container">
                <div class="search-bar">
                    <el-form :inline="true" class="search-form" ref="detailSearchForm" :model="detailSearchForm" size="small">
                        <div class="input-row">
                            <el-form-item label="类型:" prop="cardType">
                                <el-select filterable v-model="detailSearchForm.cardType" clearable placeholder="请选择类型" style="width: 100%">
                                    <el-option v-for="item in cardTypeList" :key="item.value" :label="item.title" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="buyCardType" label="团卡类型:">
                                <el-select v-model="detailSearchForm.buyCardType" clearable filterable placeholder="请选择">
                                    <el-option
                                            label="工会团卡(券)"
                                            value="0">
                                    </el-option>
                                    <el-option
                                            label="个人团卡"
                                            value="1">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="使用时间:" class="search-form-item">
                                <el-date-picker
                                        style="height: 30px;"
                                        v-model="useCardDateRange"
                                        type="datetimerange"
                                        range-separator="至"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                ></el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <div class="default-btn primary-btn" @click="searchUseCardDetail()">{{
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
                            v-loading="useCardLoading"
                            max-height="500"
                            ref="couponUseTable"
                            :data="cardUseList"
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
                                            @click="getShopWriteOffDetail(scope.row.writeOffShopId,scope.row.shopName)"
                                    >明细
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <span slot="footer">
                <div @click="useCardDetailShow = false" class="default-btn">{{ $t('remindPop.cancel') }}</div>
            </span>
        </el-dialog>
        <!--  店铺提货卡核销明细查看  -->
        <el-dialog
                title="店铺提货卡(券)核销明细"
                :visible.sync="shopWriteOffDetailShow"
                width="1100px"
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
                                label="名称"
                                prop="cardTitle"
                                align="left"
                        />
                        <el-table-column
                                fixed
                                label="使用人"
                                prop="nickName"
                                align="left"
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
                                align="left"
                        >
                            <template slot-scope="scope">
                                <span v-if="scope.row.userMobile">{{scope.row.userMobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}}</span>
                                <span v-else>暂无</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="订单编号"
                                prop="orderNumber"
                                width="180"
                        />
                        <el-table-column
                                prop="amount"
                                label="核销金额(元)"
                                width="120"
                        />
                      <el-table-column
                          prop="shopAmount"
                          label="店铺承担金额(元)"
                      >
                        <template slot-scope="scope">
                          <span v-if="scope.row.shopAmount">{{scope.row.shopAmount}}</span>
                          <span v-else>0</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                          prop="wyAmount"
                          label="物业承担金额(元)"
                      >
                        <template slot-scope="scope">
                          <span v-if="scope.row.wyAmount">{{scope.row.wyAmount}}</span>
                          <span v-else>0</span>
                        </template>
                      </el-table-column>
                        <el-table-column
                                prop="useTime"
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
          userMobile:'',
          writeOffShopId:'',
          cardShopId:'',
          settlement:'',
          cardCode:'',
          orderNumber:'',
          buyCardType:'',
          cardType:'',
          writeOffShopIds:[]
        },
        dateRange:[],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        shopList:[],
        cardTypeList: [],
        tableLoading:false,
        dataList:[],
        cardStatistic:{
          actualAmount:0,
          writeOffCount:0,
          yesterdayAmount:0,
          yesterdayCount:0,
          toDayAmount:0,
          toDayCount:0
        },
        statisticName: '数据统计',
        useCardDateRange:[],
        useCardDetailShow:false,
        detailSearchForm:{},
        useCardLoading:false,
        cardUseList:[],
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
        selectCardUseRecord:[],
        cardUseRecordIds:[]
      }
    },
    methods:{
      getRowKeys (row) {
        return row.cardUseRecordId
      },
      // 全选
      selectAll (e) {
        if (e.length > 0) {
          this.selectCardUseRecord = this.selectCardUseRecord.filter(value => this.dataList.map(val => val.cardUseRecordId).indexOf(value.cardUseRecordId) === -1)
          this.dataList.map(value => {
            this.selectCardUseRecord.push(value)
          })
        } else {
          this.selectCardUseRecord = this.selectCardUseRecord.filter(value => this.dataList.map(val => val.cardUseRecordId).indexOf(value.cardUseRecordId) === -1)
        }
      },
      // 手动勾选数据行的 Checkbox 时触发的事
      selectHandle (selection, row) {
        // 判断是否选中
        let selectionStatu = selection.map(element => element.cardUseRecordId).indexOf(row.cardUseRecordId) !== -1
        if (selectionStatu && selection.length > 0 && selection) {
          // 选中添加
          this.selectCardUseRecord.push(row)
        } else {
          // 未选中删除
          this.selectCardUseRecord = this.selectCardUseRecord.filter(element => element.cardUseRecordId !== row.cardUseRecordId)
        }
      },
      //结算
      settlement(){
        if(this.selectCardUseRecord.length > 1){
          let b = this.selectCardUseRecord.every(item=>item.settlement === this.selectCardUseRecord[0].settlement)
          if(!b){
            this.$message.warning("勾选记录存在不同结算状态");
            return
          }
        }
        this.cardUseRecordIds = this.selectCardUseRecord.map(item => item.cardUseRecordId);
        if(this.cardUseRecordIds.length < 1){
          this.$message.warning("请勾选需要结算的订单");
          return
        }
        this.$confirm('确定结算吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/platform/cardUseRecord/updateCardUseRecordSettlementStatusByIds'),
            method: 'post',
            data:  this.$http.adornData({
              cardUseRecordIds: this.cardUseRecordIds
            })
          }).then(({data}) => {
            this.getDataList()
            this.selectCardUseRecord = []
            this.$refs.cardRecordTable.clearSelection()
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
            })
          })
        })
      },
      //核销详细
      useCardDetail(){
        this.useCardDateRange = []
        this.cardWriteOffDetail()
        this.useCardDetailShow = true
      },
      //搜索明细
      searchUseCardDetail(){
        this.cardWriteOffDetail()
      },
      //重置明细搜索
      resetDetailSearchForm(formName){
        this.$refs[formName].resetFields()
        this.useCardDateRange = null
        this.detailSearchForm = {}
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
      //获取提货卡使用记录列表
      getWriteOffRecordList(page){
        this.writeOffLoading = true;
        this.$http({
          url: this.$http.adornUrl('/platform/cardUseRecord/shopWriteOffDetail'),
          method: 'get',
          params: this.$http.adornParams(
            {
              writeOffShopId:this.writeOffShopId,
              current: page == null ? this.shopWriteOffPage.currentPage : page.currentPage,
              size: page == null ? this.shopWriteOffPage.pageSize : page.pageSize,
              startTime: this.useCardDateRange ? this.useCardDateRange[0] : null, // 开始时间
              endTime: this.useCardDateRange ? this.useCardDateRange[1] : null, // 结束时间
              cardType: this.detailSearchForm.cardType,
              buyCardType: this.detailSearchForm.buyCardType,
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
          url: this.$http.adornUrl('/platform/cardUseRecord/shopDownloadWriteOff'),
          method: 'GET',
          params: this.$http.adornParams({
            writeOffShopId:this.writeOffShopId,
            startTime: this.useCardDateRange ? this.useCardDateRange[0] : null, // 开始时间
            endTime: this.useCardDateRange ? this.useCardDateRange[1] : null, // 结束时间
            cardType: this.detailSearchForm.cardType,
            buyCardType: this.detailSearchForm.buyCardType,
          }),
          responseType: 'blob'
        }).then(({data}) => {
          loading.close()
          let fileName = this.shopName + "提货卡(券)核销记录数据.xlsx";
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
      //提货卡各店铺明细
      cardWriteOffDetail(){
        this.useCardLoading = true;
        this.$http({
          url: this.$http.adornUrl('/platform/cardUseRecord/writeOffDetailStatistic'),
          method: 'get',
          params: this.$http.adornParams(
            {
              'startTime': this.useCardDateRange === null ? null : this.useCardDateRange[0], // 开始时间
              'endTime': this.useCardDateRange === null ? null : this.useCardDateRange[1], // 结束时间
              'cardType': this.detailSearchForm.cardType,
              'buyCardType': this.detailSearchForm.buyCardType,
            }
          )
        }).then(({data}) => {
          this.cardUseList = data
        }).finally(()=>{
          this.useCardLoading = false;
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
        this.searchForm.writeOffShopIds = []
        this.getShopList()
        this.getDataList()
        this.getStatistic()
        this.getTypeData()
      },
      // 获取类型
      getTypeData () {
        let type = 'card_type'
        this.$http({
          url: this.$http.adornUrl(`/sys/dictData/getByType/${type}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.cardTypeList = data
        })
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
        this.$http({
          url: this.$http.adornUrl('/platform/cardUseRecord/statistic'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign({
              'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
              'endTime': this.dateRange === null ? null : this.dateRange[1], // 结束时间
            },this.searchForm)
          )
        }).then(({ data }) => {
          this.cardStatistic = data;
        })
      },
      //列表查询
      getDataList (page) {
        this.tableLoading = true
        this.$http({
          url: this.$http.adornUrl('/platform/card/queryWriteOffCardList'),
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
            if (this.selectCardUseRecord.length > 0) {
              this.dataList.map(element => {
                if (this.selectCardUseRecord.map(item => item.cardUseRecordId).indexOf(element.cardUseRecordId) !== -1) {
                  this.$refs.cardRecordTable.toggleRowSelection(element, true)
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
        this.dateRange = []
        this.selectCardUseRecord = []
        this.searchForm.writeOffShopIds = []
        this.$refs.cardRecordTable.clearSelection()
      },
      //导出核销记录
      exportFrom(){
        const loading = this.$loading({
          lock: true,
          target: '.cardRecord',
          customClass: 'export-load',
          background: 'transparent',
          text: "数据导出中......"
        })
        this.$http({
          url: this.$http.adornUrl('/platform/card/download'),
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
          let fileName = "提货卡核销记录数据.xlsx";
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
      }
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
    .useCardDetail{
        .search-bar{
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding: 10px 20px 10px;
        }
    }
</style>
