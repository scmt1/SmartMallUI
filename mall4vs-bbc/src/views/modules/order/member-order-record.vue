<template>
    <div class="memberRechargeRecord">
        <!-- 搜索 -->
        <div class="search-bar">
            <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
                <div class="input-row">
<!--                    <el-form-item prop="userMobile" label="会员手机号:" class="search-form-item">-->
<!--                        <el-input type="text" style="width: 160px;" v-model="searchForm.userMobile" clearable placeholder="请输入会员手机号"></el-input>-->
<!--                    </el-form-item>-->
                    <el-form-item label="充值时间:">
                        <el-date-picker
                                clearable
                                size="small"
                                v-model="dateRange"
                                type="datetimerange"
                                range-separator="至"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
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
                    <div class="title">实际累计金额</div>
                    <div class="amount"  style="color: rgb(26, 102, 255);"><span
                            class="amount-num">{{rechargeStatistic.actualAmount ? rechargeStatistic.actualAmount : 0}}</span>元
                    </div>
                </div>
                <div class="item">
                    <div class="title">累计充值笔数</div>
                    <div class="amount"  style="color: rgb(250, 173, 20);">
                        <span class="amount-num">{{rechargeStatistic.rechargeCount ? rechargeStatistic.rechargeCount : 0}}</span>笔
                    </div>
                </div>
                <div class="item">
                    <div class="title">实际累计充值金额</div>
                    <div class="amount"  style="color: rgb(26, 102, 255);"><span
                            class="amount-num">{{rechargeStatistic.sumPayAmount ? rechargeStatistic.sumPayAmount : 0}}</span>元
                    </div>
                </div>
                <div class="item">
                    <div class="title">实际累计赠送金额</div>
                    <div class="amount"  style="color: rgb(26, 102, 255);"><span
                            class="amount-num">{{rechargeStatistic.sumGiveAmount ? rechargeStatistic.sumGiveAmount : 0}}</span>元
                    </div>
                </div>
                <div class="item">
                    <div class="title">昨日充值金额</div>
                    <div class="amount"  style="color: rgb(26, 102, 255);">
                        <span class="amount-num">{{rechargeStatistic.yesterdayAmount ? rechargeStatistic.yesterdayAmount : 0}}</span>元
                    </div>
                    <div class="detail" style="margin-bottom: 10px;">
                        <span style="margin-right: 10px;">赠送金额：<span style="color: rgb(26, 102, 255);font-size: 20px;">{{rechargeStatistic.yesterdayGiveAmount ? rechargeStatistic.yesterdayGiveAmount : 0}}</span>元</span>
                    </div>
                    <div class="detail">
                        <span style="margin-right: 10px;">{{rechargeStatistic.yesterdayCount ? rechargeStatistic.yesterdayCount : 0}}笔</span>
                    </div>
                </div>
                <div class="item">
                    <div class="title">当日充值金额</div>
                    <div class="amount"  style="color: rgb(26, 102, 255);">
                        <span class="amount-num">{{rechargeStatistic.toDayAmount ? rechargeStatistic.toDayAmount : 0}}</span>元
                    </div>
                    <div class="detail" style="margin-bottom: 10px;">
                        <span style="margin-right: 10px;">赠送金额：<span style="color: rgb(26, 102, 255);font-size: 20px;">{{rechargeStatistic.toDayGiveAmount ? rechargeStatistic.toDayGiveAmount : 0}}</span>元</span>
                    </div>
                    <div class="detail">
                        <span style="margin-right: 10px;">{{rechargeStatistic.toDayCount ? rechargeStatistic.toDayCount : 0}}笔</span>
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
                    <el-table-column prop="nickName" label="充值会员昵称" min-width="100">
                        <template slot-scope="scope">
                            {{ scope.row.nickName ? scope.row.nickName : "暂无" }}
                        </template>
                    </el-table-column>
<!--                    <el-table-column prop="userMobile" label="会员手机号" min-width="110">-->
<!--                        <template slot-scope="scope">-->
<!--                            {{ scope.row.userMobile ? scope.row.userMobile : "暂无" }}-->
<!--                        </template>-->
<!--                    </el-table-column>-->
                    <el-table-column prop="payNo" label="支付单号" min-width="140"></el-table-column>
                    <el-table-column prop="payAmount" label="充值金额" min-width="110">
                        <template slot-scope="scope">
                            <span class="totalprice">{{ scope.row.payAmount.toFixed(2) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="giveAmount" label="赠送金额" min-width="110">
                        <template slot-scope="scope">
                            <span class="totalprice">{{ scope.row.giveAmount.toFixed(2) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="changeBalance" label="实得金额" min-width="110">
                        <template slot-scope="scope">
                            <span class="totalprice">{{ scope.row.changeBalance.toFixed(2) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="充值时间" min-width="150"></el-table-column>
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
    name: 'member-order-record',
    data(){
      return {
        searchForm:{
          userMobile:'',
        },
        dateRange:[],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        tableLoading:false,
        dataList:[],
        rechargeStatistic:{
          actualAmount:0,
          rechargeCount:0,
          yesterdayAmount:0,
          yesterdayCount:0,
          toDayAmount:0,
          toDayCount:0,
          sumPayAmount:0,
          sumGiveAmount:0,
          toDayGiveAmount:0,
          yesterdayGiveAmount:0
        },
        statisticName: '数据统计',
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
      init(){
        this.getDataList()
        this.getStatistic()
      },
      //统计数据
      getStatistic () {
        this.$http({
          url: this.$http.adornUrl('/multishop/userBalanceUseLog/statisticBalanceRecharge'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign({
              'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
              'endTime': this.dateRange === null ? null : this.dateRange[1], // 结束时间
            },this.searchForm)
          )
        }).then(({ data }) => {
          this.rechargeStatistic = data;
        })
      },
      //列表查询
      getDataList (page) {
        this.tableLoading = true
        this.$http({
          url: this.$http.adornUrl('/multishop/userBalanceUseLog/getRechargePage'),
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
          url: this.$http.adornUrl('/multishop/userBalanceUseLog/RechargeRecordDownload'),
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
          let fileName = "会员充值记录数据.xlsx";
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
