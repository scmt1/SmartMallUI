<template>
    <div class="batchInfo">
        <!-- 搜索栏 -->
        <div class="search-bar">
            <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
                <div class="input-row">
                    <el-form-item label="卡前缀" class="search-form-item">
                        <el-input v-model="searchForm.cardPrefix" size="small" clearable placeholder="请输入卡前缀"></el-input>
                    </el-form-item>
                    <el-form-item label="批次号" class="search-form-item">
                        <el-select filterable v-model="searchForm.batchNumber" clearable placeholder="请选择" style="width: 100%">
                            <el-option :label="item" :value="item" v-for="(item,index) in batchNumList" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="类型" class="search-form-item">
                        <el-select filterable v-model="searchForm.cardType" clearable placeholder="请选择类型" style="width: 100%">
                            <el-option v-for="item in cardTypeList" :key="item.value" :label="item.title" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态" class="search-form-item">
                        <el-select filterable v-model="searchForm.status" clearable placeholder="请选择" style="width: 100%">
                            <el-option label="已失效" :value="-1"></el-option>
                            <el-option label="已出售" :value="2"></el-option>
                            <el-option label="已绑定" :value="3"></el-option>
                            <el-option label="已冻结" :value="4"></el-option>
                            <el-option label="已置换" :value="5"></el-option>
                            <el-option label="已核销" :value="6"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="批次时间" label-width="70px">
                        <el-date-picker
                                v-model="launchDateRange"
                                type="datetimerange"
                                :range-separator="$t('coupon.to')"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :start-placeholder="$t('coupon.startTime')"
                                :end-placeholder="$t('coupon.endTime')"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <div class="default-btn primary-btn" @click="searchChange()">{{ $t('crud.searchBtn') }}</div>
                        <div class="default-btn" @click="resetSearchForm('searchForm')">{{ $t('product.reset') }}</div>
                        <div
                                class="default-btn primary-btn"
                                @click.stop="statisticClick()">
                            {{statisticName}}
                        </div>
                        <div class="default-btn primary-btn" @click.stop="downLoadBatchInfo()">导出记录</div>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div v-if="statisticName == '关闭统计'" class="data-statistics" style="background: rgb(250, 250, 250);">
            <div class="statistics-list">
                <div class="item">
                    <div class="title">累计卡(券)数量</div>
                    <div class="amount"  style="color: rgb(26, 102, 255);"><span
                            class="amount-num">{{cardStatistic.cardCount ? cardStatistic.cardCount : 0}}</span>张
                    </div>
                </div>
                <div class="item">
                    <div class="title">累计卡(券)金额</div>
                    <div class="amount"  style="color: rgb(250, 173, 20);">
                        <span class="amount-num">{{cardStatistic.cardTotalAmount ? cardStatistic.cardTotalAmount : 0}}</span>元
                    </div>
                </div>
            </div>
        </div>
        <div class="main-container">
            <!-- 表格 -->
            <div class="table-con sys-user-table">
                <el-table style="width: 100%;background: none" :data="batchInfoList">
                    <el-table-column label="批次号" prop="batchNumber" min-width="100">
                    </el-table-column>
                    <el-table-column label="编号" prop="sellRecordNum" min-width="100">
                    </el-table-column>
                    <el-table-column label="类型" prop="cardType" min-width="80">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.cardType === 1 ? 'success' : ''" effect="dark">{{cardTypeList.find(item => item.value == scope.row.cardType)
                                .title}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cardNum" label="数量" min-width="60">
                    </el-table-column>
                    <el-table-column prop="totalAmount" label="累计金额(元)" min-width="80">
                    </el-table-column>
                    <el-table-column prop="balance" label="单张金额(元)" min-width="80">
                    </el-table-column>
                    <el-table-column prop="status" label="状态" min-width="60">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status === -1" type="info" effect="dark">已失效</el-tag>
                            <el-tag v-if="scope.row.status === 0" type="info" effect="dark">未制卡(券)</el-tag>
                            <el-tag v-if="scope.row.status === 1" type="" effect="dark">未出售</el-tag>
                            <el-tag v-if="scope.row.status === 2" type="danger" effect="dark">已出售</el-tag>
                            <el-tag v-if="scope.row.status === 3" type="success" effect="dark">已绑定</el-tag>
                            <el-tag v-if="scope.row.status === 4" type="warning" effect="dark">已冻结</el-tag>
                            <el-tag v-if="scope.row.status === 5" type="warning" effect="dark">已置换</el-tag>
                            <el-tag v-if="scope.row.status === 6" type="warning" effect="dark">已核销</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="batchTime" label="批次时间" min-width="100">
                    </el-table-column>
                    <el-table-column prop="buyUnit" label="购买单位" min-width="100">
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <el-pagination
                    v-if="batchInfoList.length"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
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
    name: 'batchInfo',
    data() {
      return {
        batchInfoList:[],
        batchNumList: [],
        searchForm: {},
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        cardTypeList: [],
        launchDateRange: null,
        cardStatistic:{
          cardCount:0,
          cardTotalAmount:0
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
        this.getTypeData();
        this.getBatchNum();
        this.getStatistic();
        this.getDataList();
      },
      // 条件查询
      searchChange () {
        this.page.currentPage = 1
        this.getDataList(this.page)
        this.getStatistic()
      },
      /**
       * 重置表单
       * @param {String} formName 表单名称
       */
      resetSearchForm (formName) {
        this.$refs[formName].resetFields()
        this.launchDateRange = null
        this.searchForm = {}
      },
      handleSizeChange (val) {
        this.page.pageSize = val
        this.getDataList(this.page)
      },
      handleCurrentChange (val) {
        this.page.currentPage = val
        this.getDataList(this.page)
      },
      //统计数据
      getStatistic () {
        this.$http({
          url: this.$http.adornUrl('/platform/card/batchInfoStatistic'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign({
              'startTime': this.launchDateRange === null ? null : this.launchDateRange[0], // 开始时间
              'endTime': this.launchDateRange === null ? null : this.launchDateRange[1], // 结束时间
            },this.searchForm)
          )
        }).then(({ data }) => {
          this.cardStatistic = data;
        })
      },
      // 获取数据列表
      getDataList (page) {
        this.$http({
          url: this.$http.adornUrl('/platform/card/batchCardDetailsPage'),
          method: 'get',
          params: this.$http.adornParams(
            Object.assign(
              {
                current: page == null ? this.page.currentPage : page.currentPage,
                size: page == null ? this.page.pageSize : page.pageSize,
                startTime: this.launchDateRange === null ? null : this.launchDateRange[0],
                endTime: this.launchDateRange === null ? null : this.launchDateRange[1]
              },
              this.searchForm
            )
          )
        }).then(({data}) => {
          this.batchInfoList = data.records
          this.page.total = data.total
        }).finally(() => {
        })
      },
      // 获取批次号
      getBatchNum () {
        this.$http({
          url: this.$http.adornUrl('/platform/card/queryBatchNumList'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if(data){
            this.batchNumList = data.reverse();
          }
        })
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
      //导出提货卡/券记录
      downLoadBatchInfo(){
        const loading = this.$loading({
          lock: true,
          target: '.batchInfo',
          customClass: 'export-load',
          background: 'transparent',
          text: "数据导出中......"
        })

        this.$http({
          url: this.$http.adornUrl('/platform/card/downloadBatchInfo'),
          method: 'GET',
          params: this.$http.adornParams(
            Object.assign(
              {
                startTime: this.launchDateRange === null ? null : this.launchDateRange[0],
                endTime: this.launchDateRange === null ? null : this.launchDateRange[1]
              },
              this.searchForm
            )
          ),
          responseType: 'blob'
        }).then(({data}) => {
          loading.close()
          let fileName = "批次信息记录数据.xlsx";
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

<style lang="scss">
    .batchInfo{
        .search-bar .input-row .el-form-item--small .el-form-item__content .el-input {
            width: 180px;
        }
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
