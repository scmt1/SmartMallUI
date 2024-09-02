<template>
    <div class="writeOffRecord">
        <div class="writeOffBtn">
            <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
                <div class="input-row">
                    <el-form-item prop="nickName" label="会员昵称:">
                        <el-input type="text" style="width: 160px;" v-model="searchForm.nickName" clearable placeholder="请输入会员昵称"></el-input>
                    </el-form-item>
                    <el-form-item prop="writeOffShopId" label="核销店铺">
                        <el-select v-model="searchForm.writeOffShopId" clearable filterable placeholder="请选择店铺">
                            <el-option
                                    v-for="item in shopList"
                                    :key="item.shopId"
                                    :label="item.shopName"
                                    :value="item.shopId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="couponShopId" label="发放来源">
                        <el-select v-model="searchForm.couponShopId" filterable clearable
                                   @change="couponShopIdChange"
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
                    <el-form-item prop="putSource" label="投放来源:"
                                  label-width="80px" class="search-form-item">
                        <el-select v-model="searchForm.putSource" placeholder="请选择投放来源">
                            <el-option label="平台" :value="1"></el-option>
                            <el-option label="工会" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="couponId" label="优惠券">
                        <el-select v-model="searchForm.couponId" clearable placeholder="请选择优惠券">
                            <el-option
                                    v-for="item in couponList"
                                    :key="item.couponId"
                                    :label="item.couponName"
                                    :value="item.couponId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="使用时间">
                        <el-date-picker
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
                        <div class="default-btn primary-btn" @click="exportData">导出</div>
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
                            class="amount-num">{{couponUseStatistic.actualAmount ? couponUseStatistic.actualAmount : 0}}</span>元
                    </div>
                </div>
                <div class="item">
                    <div class="title">累计使用笔数</div>
                    <div class="amount"  style="color: rgb(250, 173, 20);">
                        <span class="amount-num">{{couponUseStatistic.writeOffCount ? couponUseStatistic.writeOffCount : 0}}</span>笔
                    </div>
                </div>
                <div class="item">
                    <div class="title">当日核销金额</div>
                    <div class="amount"  style="color: rgb(26, 102, 255);">
                        <span class="amount-num">{{couponUseStatistic.toDayAmount ? couponUseStatistic.toDayAmount : 0}}</span>元
                    </div>
                    <div class="detail">
                        <span style="margin-right: 10px;">{{couponUseStatistic.toDayCount ? couponUseStatistic.toDayCount : 0}}笔</span>
                    </div>
                </div>
                <div class="item">
                    <div class="title">昨日核销金额</div>
                    <div class="amount"  style="color: rgb(26, 102, 255);">
                        <span class="amount-num">{{couponUseStatistic.yesterdayAmount ? couponUseStatistic.yesterdayAmount : 0}}</span>元
                    </div>
                    <div class="detail">
                        <span style="margin-right: 10px;">{{couponUseStatistic.yesterdayCount ? couponUseStatistic.yesterdayCount : 0}}笔</span>
                    </div>
                </div>
            </div>
        </div>
        <div style="margin: 10px 0;">
            <el-table
                    :data="recordList"
                    header-cell-class-name="table-header"
                    row-class-name="table-row-low"
                    style="width: 100%"
            >
                <el-table-column
                        fixed
                        label="优惠券"
                        prop="couponName"
                        align="left"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.type === 0">抖音减{{scope.row.amount}}元优惠券</span>
                        <span v-else>{{scope.row.couponName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed
                        label="会员昵称"
                        prop="nickName"
                        align="left"
                />
                <el-table-column
                        fixed
                        label="联系电话"
                        prop="userMobile"
                >
                    <template slot-scope="scope">
                        {{ scope.row.userMobile ? scope.row.userMobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "暂无" }}
                    </template>
                </el-table-column>
                <el-table-column
                        fixed
                        label="订单编号"
                        prop="orderNumber"
                        align="left"
                />
                <el-table-column
                        prop="amount"
                        label="减免金额(元)"
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
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="page.pageSize"
                :total="page.total"
                layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
    </div>
</template>

<script>
  export default {
    name: 'writeOffRecord',
    data() {
      return {
        recordList:[],
        dataListLoading: false,
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        couponList:[],
        searchForm: {
          couponId:'',
          writeOffShopId:'',
          nickName:'',
          couponShopId:'',
          putSource:'',
          status:2
        },
        dateRange: [],
        shopList:[],
        statisticName:'数据统计',
        couponUseStatistic:{
          actualAmount:0,
          writeOffCount:0,
          yesterdayAmount:0,
          yesterdayCount:0,
          toDayAmount:0,
          toDayCount:0,
        }
      }
    },
    mounted () {
      this.getCouponList()
      this.getShopList()
      this.getWriteOffRecordList(this.page)
      this.getStatistic()
    },
    methods: {
      //数据统计点击
      statisticClick () {
        if (this.statisticName === '数据统计') {
          this.statisticName = '关闭统计'
        } else {
          this.statisticName = '数据统计'
        }
      },
      //发放平台改变
      couponShopIdChange(v){
        if(v !== "0"){
          this.searchForm.writeOffShopId = v
        }else{
          this.searchForm.writeOffShopId = ""
        }
        this.searchForm.couponId = ''
        this.getCouponList()
      },
      //统计数据
      getStatistic () {
        this.$http({
          url: this.$http.adornUrl('/platform/couponUseRecord/statisticCouponUse'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign({
              'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
              'endTime': this.dateRange === null ? null : this.dateRange[1], // 结束时间
            },this.searchForm)
          )
        }).then(({ data }) => {
          this.couponUseStatistic = data;
        })
      },
      //导出
      exportData () {
        const loading = this.$loading({
          lock: true,
          target: '.recordList',
          customClass: 'export-load',
          background: 'transparent',
          text: "数据导出中......"
        })
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
        this.theData.beginTime = this.dateRange ? this.dateRange[0] : null, // 开始时间
          this.theData.endTime = this.dateRange ? this.dateRange[1] : null // 结束时间
        this.$http({
          url: this.$http.adornUrl('/platform/couponUseRecord/download'),
          method: 'GET',
          params: this.$http.adornParams(this.theData),
          responseType: 'blob'
        }).then(({data}) => {
          loading.close()
          let fileName = "优惠券核销记录数据.xlsx";
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
      //获取所有店铺
      getShopList(){
        this.$http({
          url: this.$http.adornUrl('/platform/shopDetail/getAllShop'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.shopList = data
        })
      },
      //获取店铺核销优惠券列表
      getWriteOffRecordList(page,newData = false){
        if (newData || !this.theData) {
          this.theData = JSON.parse(JSON.stringify(this.searchForm))
          this.theData.beginTime = this.dateRange ? this.dateRange[0] : null, // 开始时间
            this.theData.endTime = this.dateRange ? this.dateRange[1] : null // 结束时间
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/platform/couponUseRecord/writeOffRecordPage'),
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
        }).then(({data}) => {
          this.recordList = data.records
          this.page.total = data.total
          this.dataListLoading = false
        })
      },
      //获取所有优惠券信息
      getCouponList(){
        this.$http({
          url: this.$http.adornUrl('/platform/coupon/getAllCouponList'),
          method: 'get',
          params: this.$http.adornParams({
            shopId:this.searchForm.couponShopId
          })
        }).then(({data}) => {
          this.couponList = data
        })
      },
      handleSizeChange (val) {
        this.page.pageSize = val
        this.getWriteOffRecordList(this.page)
      },
      handleCurrentChange (val) {
        this.page.currentPage = val
        this.getWriteOffRecordList(this.page)
      },
      // 条件查询
      searchChange (newData = false) {
        this.page.currentPage = 1
        this.getWriteOffRecordList(this.page, newData)
        this.getStatistic()
      },
      //重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.dateRange = []
      },
    }
  }
</script>

<style lang="scss" scoped>
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
</style>
