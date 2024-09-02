<template>
  <!-- 会员贡献价值分析 -->
  <div class="member-analysis member-contribution-value-analysis">
    <div class="board-title">{{$t('dataAnalysis.valueAnalysisOfMemberContributions')}}</div>

    <!-- 选项 -->
    <!-- 复选框选项组 -->
    <div class="checkbox-options-group">
      <!-- 选项 -->
      <div class="data-radio">


         

        <el-checkbox-group v-model="form.saleIndex">
          <!-- 浏览访问 -->
          <div class="item browse-visits">
            <span class="tit">{{$t('dataAnalysis.basicIndicators')}}：</span>
            <div class="radio-group">
              <el-checkbox :label="$t('dataAnalysis.totalMembership')" name="saleIndex" checked>{{$t('dataAnalysis.totalMembership')}}</el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.totalMembershipRatio')" name="saleIndex" checked>{{$t('dataAnalysis.totalMembershipRatio')}}</el-checkbox>
            </div>
          </div>

          <!-- 引导转化 -->
          <div class="item conversions">
            <span class="tit">{{$t('dataAnalysis.clinchADealtheIndicators')}}：</span>
            <div class="radio-group">
              <el-checkbox :label="$t('dataAnalysis.MemberTransactions')" name="saleIndex" checked>{{$t('dataAnalysis.MemberTransactions')}}</el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.tradedMembersRatio')"  name="saleIndex" checked>{{$t('dataAnalysis.tradedMembersRatio')}}</el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.payOrderQuantity')" name="saleIndex" checked>{{$t('dataAnalysis.payOrderQuantity')}}</el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.customerUnitPrice')" name="saleIndex">{{$t('dataAnalysis.customerUnitPrice')}}</el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.paymentAmount')" name="saleIndex">{{$t('dataAnalysis.paymentAmount')}}</el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.proportionOfPaymentAmount')" name="saleIndex">{{$t('dataAnalysis.proportionOfPaymentAmount')}}</el-checkbox>
              <el-checkbox :label="$t('dataAnalysis.perCapitaConsumptionFrequency')" name="saleIndex">{{$t('dataAnalysis.perCapitaConsumptionFrequency')}}</el-checkbox>
            </div>
          </div>
        </el-checkbox-group>
        
        <div class="check-list"><span id="maxSelectSpan">{{$t('dataAnalysis.upTo8')}}</span>&nbsp;{{$t('dataAnalysis.selected')}}<span class="mark">&nbsp;{{ selectNum }}&nbsp;</span>/{{$t('dataAnalysis.eightItems')}}</div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-box">
      <el-table
        :data="tableData5"
        header-cell-class-name="table-header"
        row-class-name="table-row"
      >
        <el-table-column
          highlight-current-row="true"
          fixed
          prop="custType"
          :label="$t('dataAnalysis.customerType')"
        />
        <el-table-column v-if="isVisible1" prop="totalMember" :label="$t('dataAnalysis.totalMembership')" />
        <el-table-column v-if="isVisible2" prop="totalMemberRate" :label="$t('dataAnalysis.totalMembershipRatio')" />
        <el-table-column v-if="isVisible3" prop="payMemberNum" :label="$t('dataAnalysis.numberOfTradedMembers')" />
        <el-table-column v-if="isVisible10" prop="payMemberNum" :label="$t('dataAnalysis.MemberTransactions')" />
        <el-table-column v-if="isVisible4" prop="payMemberNumRate" :label="$t('dataAnalysis.tradedMembersRatio')" />
        <el-table-column v-if="isVisible5" prop="payOrderNum" :label="$t('dataAnalysis.payOrderQuantity')" />
        <el-table-column v-if="isVisible6" prop="pricePerMember" :label="$t('dataAnalysis.customerUnitPrice')" />
        <el-table-column v-if="isVisible7" prop="payAmount" :label="$t('dataAnalysis.paymentAmount')" />
        <el-table-column v-if="isVisible8" prop="payAmountRate" :label="$t('dataAnalysis.proportionOfPaymentAmount')" />
        <el-table-column v-if="isVisible9" prop="frequencyOfConsume" :label="$t('dataAnalysis.perCapitaConsumptionFrequency')" />
      </el-table>
    </div>

    <!-- 数据分析思路 -->
    <div class="data-analysis-ideas">
      <img src="@/assets/icon/data-nalysis-ideas@2x.png" class="left-icon">
      <div class="txt">
        <p>{{$t('dataAnalysis.dataAnalysisIdeas')}}</p>
        <p>{{$t('dataAnalysis.memberLevelDateText1')}} <el-link type="primary" href="javascript: void();">{{$t('dataAnalysis.coupon')}}</el-link> {{$t('dataAnalysis.maybe')}} <el-link type="primary" href="javascript: void();">{{$t('dataAnalysis.memberTransactionsTask')}}</el-link> {{$t('dataAnalysis.memberLevelDateText2')}}</p>
      </div>
    </div>

  </div>
</template>

<script>
// import checkboxOptionsGroup from './checkbox-options-group'

export default {
  data () {
    return {
      membershipRadio: 0,
      dateType: 1,
      dateRange: [],
      tableData5: [
        {
          custType: this.$t('dataAnalysis.allFreeGradeMembers')
        },
        {
          custType: this.$t('dataAnalysis.allPaidMembers')
        }],
      form: {
        saleIndex: [], // 基础指标
        serviceIndex: [] // 成交指标
      },
      tableInfo: [{
        customerType: this.$t('dataAnalysis.allFreeGradeMembers'), // 客户类型
        cumulativeMembership: 789, // 累计会员数
        cumulativeMembershipShare: '59.8%', // 累计会员占比
        membersSoldNumber: 859, // 成交会员数
        membersSoldPercentage: '58.7%', // 成交会员占比
        paidOrdersNumber: 189 // 支付订单数
      },
      {
        customerType: this.$t('dataAnalysis.allPaidMembers'), // 客户类型
        cumulativeMembership: 456, // 累计会员数
        cumulativeMembershipShare: '25.3%', // 累计会员占比
        membersSoldNumber: 259, // 成交会员数
        membersSoldPercentage: '35.6%', // 成交会员占比
        paidOrdersNumber: 99 // 支付订单数
      }],
      checkList: [0, 3, 6, 9],
      sumData: [], // 所有指标
      selectNum: 0, // 选择指标的数量
      isVisible1: true,
      isVisible2: true,
      isVisible3: true,
      isVisible4: true,
      isVisible5: true,
      isVisible6: false,
      isVisible7: false,
      isVisible8: false,
      isVisible9: false,
      isVisible10: true,
      options: [
        {
          value: 0,
          label: this.$t('dataAnalysis.allGroup')
        }
      ],
      value: 0,
      options2: [
        {
          value: 0,
          label: this.$t('dataAnalysis.todayRealTime')
        }
      ],
      value2: 0
    }
  },
  watch: {
    dateRange () {
      this.dateType = this.$parent.timeType
      // 会员概览后台数据
      this.getMemberContributeData()
    },
    'form.saleIndex' () {
      this.selectNum = this.form.saleIndex.length + this.form.serviceIndex.length
      // console.log(this.customIndexForm.prodSurvey)
      // sumData是用来存放点击选中的文本框信息
      this.sumData = []
      this.sumData = this.sumData.concat(this.form.saleIndex).concat(this.form.serviceIndex)
      var checks = document.getElementsByName('saleIndex')
      var span = document.getElementById('maxSelectSpan')
      checks.forEach(i => {
        if (this.selectNum >= 8) {
          this.textShare(span, 'red')
          if (!i.checked) {
            i.setAttribute('disabled', 'true')
          }
        }
      })
      if (this.selectNum < 8) {
        this.textShare(span, 'grey')
        checks.forEach(i => {
          i.removeAttribute('disabled')
        })
      }
    },
    'form.serviceIndex' () {
      this.selectNum = this.form.saleIndex.length + this.form.serviceIndex.length
      this.sumData = []
      this.sumData = this.sumData.concat(this.form.saleIndex).concat(this.form.serviceIndex)
      // console.log(this.sumData)
      var checks = document.getElementsByName('saleIndex')
      var span = document.getElementById('maxSelectSpan')
      checks.forEach(i => {
        if (this.selectNum >= 8) {
          this.textShare(span, 'red')
          if (!i.checked) {
            i.setAttribute('disabled', 'true')
          }
        }
      })
      if (this.selectNum < 8) {
        this.textShare(span, 'grey')
        checks.forEach(i => {
          i.removeAttribute('disabled')
        })
      }
    },
    // 将存放的选择框数据调用函数来执行数据响应展示操作
    'sumData' () {
      this.changVisibles()
      // this.getRealTimechartData()
    }
  },
  // components: { checkboxOptionsGroup },
  mounted () {
    this.dateType = this.$parent.timeType
    this.changVisibles()
    // 会员贡献价值分析
    // this.getMemberContributeData()
  },
  methods: {
    getMemberContributeData () {
      if (this.$parent.dateRange && this.$parent.dateRange.length > 0) {
        this.startTime = this.$parent.dateRange[0]
        this.endTime = this.$parent.dateRange[1]
      } else {
        this.startTime = this.$parent.startTime
        this.endTime = this.$parent.endTime
      }
      let param = {
        dateType: this.dateType,
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.$http({
        url: this.$http.adornUrl('/platform/flowCustomerAnalysis/getMemberVontributeValue'),
        method: 'get',
        params: this.$http.adornParams(param)
      }).then(data => {
        data = data.data
        if (data) {
          data.publicMember.custType = this.tableData5[0].custType
          data.paidMember.custType = this.tableData5[1].custType
          this.tableData5 = []
          this.tableData5.push(data.publicMember)
          this.tableData5.push(data.paidMember)

          this.tableData5.forEach(i => {
            i.payMemberNumRate = (i.payMemberNumRate * 100).toFixed(2) + '%'
            i.totalMemberRate = (i.totalMemberRate * 100).toFixed(2) + '%'
          })
        }
      })
    },
    /**
     * 控制表格列显隐
     */
    changVisibles () {
      this.isVisible1 = this.judgeStrArrIncludeOtherString(this.$t('dataAnalysis.totalMembership'))
      this.isVisible2 = this.judgeStrArrIncludeOtherString(this.$t('dataAnalysis.totalMembershipRatio'))
      this.isVisible3 = this.judgeStrArrIncludeOtherString(this.$t('dataAnalysis.numberOfTradedMembers'))
      this.isVisible4 = this.judgeStrArrIncludeOtherString(this.$t('dataAnalysis.tradedMembersRatio'))
      this.isVisible10 = this.judgeStrArrIncludeOtherString(this.$t('dataAnalysis.MemberTransactions'))
      this.isVisible5 = this.judgeStrArrIncludeOtherString(this.$t('dataAnalysis.payOrderQuantity'))
      this.isVisible6 = this.judgeStrArrIncludeOtherString(this.$t('dataAnalysis.customerUnitPrice'))
      this.isVisible7 = this.judgeStrArrIncludeOtherString(this.$t('dataAnalysis.paymentAmount'))
      this.isVisible8 = this.judgeStrArrIncludeOtherString(this.$t('dataAnalysis.proportionOfPaymentAmount'))
      this.isVisible9 = this.judgeStrArrIncludeOtherString(this.$t('dataAnalysis.perCapitaConsumptionFrequency'))
    },
    judgeStrArrIncludeOtherString (str) {
      // console.log(str)
      // console.log(this.sumData)
      // console.log(444)
      var strArr = this.sumData
      return strArr.includes(str)
    },
    /**
     * 格式化时间
     */
    formatDate: function (date) {
      var tempDate = date + ''
      return tempDate.substring(0, 4) + '-' + tempDate.substring(4, 6) + '-' + tempDate.substring(6, 8)
    },
    /**
     * 文字效果
     */
    textShare (div, color) {
      // 文字跳动
      // var timer = null
      // var i = 0
      // clearInterval(timer)
      // timer = setInterval(function () {
      //   div.style.display = i++ % 2 ? 'none' : 'block'
      //   i > 6 && (clearInterval(timer))
      // }, 80)
      div.style.color = color
    }
  }
}
</script>

<style lang="scss">
.member-analysis.member-contribution-value-analysis {
  // 表格
  .table-box {
    margin: 20px 0;
    .table-header {
      height: 60px;
    }
    .table-row {
      height: 56px;
    }
  }
.checkbox-options-group{
  // 选项
  .data-radio {
    display: block;
    padding: 30px 25px;
    font-size: 14px;
    background: #f7f8fa;
    .item {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      .tit {
        display: block;
        font-size: 14px;
        min-width: 70px;
      }
      .radio-group {
        // .el-checkbox {
        //   width: 140px;
        // }
        // .el-checkbox__input.is-checked .el-checkbox__inner {
        //   border-color: #02A1E9;
        //   background: #02A1E9;
        // }
        .el-checkbox__input.is-checked + .el-checkbox__label {
          color: #333;
        }
      }
    }
    .item:first-child {
      margin-bottom: 30px;
    }
    .check-list {
      display: block;
      margin-top: 30px;
      margin-left: 70px;
      font-size: 12px;
      color: #999;
      .mark {
        color: #02A1E9;
        font-weight: bold;
      }
      .red {
        color: #FF4141;
      }
    }
  }

}
  // 数据分析思路
  .data-analysis-ideas {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: #f7f8fa;
    padding: 20px;
    .left-icon {
      display: block;
      width: 52px;
      height: 52px;
      margin-right: 20px;
    }
    .txt {
      font-size: 14px;
      color: #333;
      line-height: 1.5em;
      p {
        margin: 0;
      }
      p:first-child {
        font-size: 16px;
        margin-bottom: 8px;
      }
      p:last-child {
        color: #666;
      }
      .el-link.el-link--primary {
        color: #02a1e9;
      }
    }
  }
}
</style>
