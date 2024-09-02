<template>
    <div class="memberRecord">
        <!-- 搜索 -->
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
                    <el-form-item prop="payNo" label="支付单号:" class="search-form-item">
                        <el-input type="text" style="width: 200px;" v-model="searchForm.payNo" clearable placeholder="请输入支付单号"></el-input>
                    </el-form-item>
                    <el-form-item label="使用时间:">
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
        <div class="main-container">
            <!-- 表格 -->
            <div class="table-con sys-user-table">
                <el-table ref="memberRecordTable"
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
                    <el-table-column prop="payNo" label="支付单号" min-width="140"></el-table-column>
                    <el-table-column prop="shopName" label="核销店铺" min-width="110"></el-table-column>
                    <el-table-column prop="changeBalance" label="金额" min-width="110">
                        <template slot-scope="scope">
                            <span class="totalprice">{{ scope.row.changeBalance.toFixed(2) }}</span>
                        </template>
                    </el-table-column>
<!--                    <el-table-column prop="shopAmount" label="店铺实得金额（元）"/>-->
<!--                    <el-table-column prop="rateAmount" label="费率扣除金额（元）"/>-->
                    <el-table-column prop="createTime" label="使用时间" min-width="150"></el-table-column>
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
          settlement:'',
          writeOffPersonId:'',
          payNo:''
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
          totalRateAmount:0
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
      },
      //统计数据
      getStatistic () {
        this.$http({
          url: this.$http.adornUrl('/multishop/userBalanceUseLog/statisticBalanceUse'),
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
        this.$http({
          url: this.$http.adornUrl('/multishop/userBalanceUseLog/getUseBalanceRecord'),
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
          target: '.memberRecord',
          customClass: 'export-load',
          background: 'transparent',
          text: "数据导出中......"
        })
        this.$http({
          url: this.$http.adornUrl('/multishop/userBalanceUseLog/download'),
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
    .useBalanceDetail{
        .search-bar{
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding: 10px 20px 10px;
        }
    }
</style>
