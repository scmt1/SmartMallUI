<template>
    <div class="cardRecord">
        <!-- 搜索 -->
        <div class="search-bar">
            <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
                <div class="input-row">
                    <el-form-item label="核销人员" prop="writeOffPersonId">
                        <el-select v-model="searchForm.writeOffPersonId" clearable filterable placeholder="请选择">
                            <el-option
                                    v-for="(item,index) in shopEmployeeList"
                                    :label="item.nickname"
                                    :value="item.employeeId"
                                    :key="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="userMobile" label="用户手机号：" class="search-form-item">
                        <el-input type="text" style="width: 200px;" v-model="searchForm.userMobile" clearable placeholder="请输入用户手机号"></el-input>
                    </el-form-item>
                    <el-form-item prop="cardCode" label="卡号：" class="search-form-item">
                        <el-input type="text" style="width: 200px;" v-model="searchForm.cardCode" clearable placeholder="请输入卡号"></el-input>
                    </el-form-item>
                    <el-form-item label="类型：" prop="cardType">
                        <el-select filterable v-model="searchForm.cardType" clearable placeholder="请选择类型" style="width: 100%">
                            <el-option v-for="item in cardTypeList" :key="item.value" :label="item.title" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="buyCardType" label="团卡类型：">
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
                    <el-form-item prop="settlement" label="结算状态：">
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
                    <el-form-item label="使用时间：">
                        <el-date-picker
                                clearable
                                size="small"
                                v-model="dateRange"
                                type="datetimerange"
                                range-separator="至"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <div class="default-btn primary-btn" @click="searchChange(true)">搜索</div>
                        <div class="default-btn" @click="resetForm('searchForm')">重置</div>
                        <div class="default-btn primary-btn" @click="exportFrom()">导出</div>
                        <div
                                class="default-btn primary-btn"
                                @click.stop="statisticClick()">
                            {{statisticName}}
                        </div>
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
                          v-loading="tableLoading"
                          :data="dataList"
                          header-cell-class-name="table-header"
                          row-class-name="table-row-low" style="width: 100%">
                    <el-table-column prop="settlement" label="结算状态">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.settlement === 0">未结算</el-tag>
                            <el-tag v-if="scope.row.settlement === 1" type="success">已结算</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="nickName" label="使用人" min-width="100">
                        <template slot-scope="scope">
                            {{ scope.row.nickName ? scope.row.nickName : "暂无" }}
                        </template>
                    </el-table-column>
<!--                    <el-table-column prop="userMobile" label="用户手机号" min-width="110">-->
<!--                        <template slot-scope="scope">-->
<!--                            {{ scope.row.userMobile ? scope.row.userMobile : "暂无" }}-->
<!--                        </template>-->
<!--                    </el-table-column>-->
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
                    <el-table-column prop="amount" label="金额" min-width="110">
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
                    <el-table-column prop="employeeNickName" label="核销人员" width="150"/>
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
          settlement:'',
          cardCode:'',
          buyCardType:'',
          cardType:'',
          writeOffPersonId:'',
        },
        dateRange:[],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
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
        shopEmployeeList:[]
      }
    },
    methods:{
      //数据统计点击
      statisticClick () {
        if (this.statisticName === '数据统计') {
          this.statisticName = '关闭统计'
        } else {
          this.statisticName = '数据统计'
        }
      },
      //获取店铺员工账号
      getShopEmployeeList () {
        this.$http({
          url: this.$http.adornUrl('/multishop/userBalanceUseLog/getShopEmployee'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.shopEmployeeList = data
        })
      },
      init(){
        this.getShopEmployeeList()
        this.getDataList()
        this.getStatistic()
        this.getTypeData()
      },
      // 获取类型
      getTypeData () {
        let type = 'card_type'
        this.$http({
          url: this.$http.adornUrl(`/multishop/sys/dictData/getByType/${type}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.cardTypeList = data
        })
      },
      //统计数据
      getStatistic () {
        this.$http({
          url: this.$http.adornUrl('/admin/card/statistic'),
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
          url: this.$http.adornUrl('/admin/card/queryWriteOffCardList'),
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
          url: this.$http.adornUrl('/admin/card/download'),
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
