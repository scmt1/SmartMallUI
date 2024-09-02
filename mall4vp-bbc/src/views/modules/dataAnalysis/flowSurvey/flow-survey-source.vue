<template>
  <div class="source">
    <div class="flow-title">
      <div class="flow-title-left">
        <div class="line" />
        <div class="text">
          {{$t('dataAnalysis.dealTrans')}}
        </div>
      </div>
      <div class="flow-title-right">
        <div
          v-if="isAuth('flow:sour:export')"
          class="default-btn primary-btn export-btn"
          @click="exportCategory()"
        >{{$t("order.export")}}</div>
      </div>
    </div>

    <!-- 多项选择 -->
    <div class="radio-box flow-form">
      <el-form :model="form">
        <el-form-item :label="$t('dataAnalysis.pageBrowsing') + ':'">
          <el-checkbox-group v-model="form.saleIndex">
            <el-checkbox class="checkbox-item" name="saleIndex" :label="$t('dataAnalysis.perVisitor')" checked></el-checkbox>
            <el-checkbox class="checkbox-item" name="saleIndex" :label="$t('dataAnalysis.numberOfVisitors')" checked></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('dataAnalysis.dealTrans') + ':'">
          <div class="" style="display:flex; flex-wrap: wrap;">
            <el-checkbox-group v-model="form.serviceIndex">
              <el-checkbox name="saleIndex" :label="$t('dataAnalysis.uvPrice')"></el-checkbox>
              <el-checkbox name="saleIndex" :label="$t('dataAnalysis.addCartNumbers')"></el-checkbox>
              <el-checkbox name="saleIndex" :label="$t('dataAnalysis.paidPeoples')"></el-checkbox>
              <el-checkbox name="saleIndex" :label="$t('dataAnalysis.paidAmount')" checked></el-checkbox>
              <el-checkbox name="saleIndex" :label="$t('dataAnalysis.visitOrder')"></el-checkbox>
              <el-checkbox name="saleIndex" :label="$t('dataAnalysis.paidNumbers')"></el-checkbox>
              <el-checkbox name="saleIndex" :label="$t('dataAnalysis.paymentAmount')" checked></el-checkbox>
              <el-checkbox name="saleIndex" :label="$t('dataAnalysis.vToP')"></el-checkbox>
              <el-checkbox name="saleIndex" :label="$t('dataAnalysis.customerUnitPrice')"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item :label="$t('dataAnalysis.dealTrans') + ':'" class="hide-label">
          <div class="limit-num" :class="{'out-limit': outLimit}">
            <span id="maxSelectSpan">{{$t('dataAnalysis.upTo5')}}</span>
            {{$t('dataAnalysis.selected')}}
            <span class="item-num">{{selectNum}}</span>/{{$t('dataAnalysis.fiveItems')}}
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!-- /多项选择 -->
    <!--告示-->
    <div class="notice">
      <p>{{$t('dataAnalysis.notice1')}}</p>{{$t('dataAnalysis.notice2')}}
    </div>
    <!--告示-->
    <!-- 表格 -->
    <div class="table-con">
      <el-table
        :data="tableData"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
      >
        <el-table-column prop="prodInfo" :label="$t('dataAnalysis.sourceType')" fixed="left"></el-table-column>
        <el-table-column
          v-if="tableItemShow.isVisible1"
          class="table-item"
          prop="userNumsRatio"
          :label="$t('dataAnalysis.perVisitor')"
          sortable
        ></el-table-column>
        <el-table-column
          v-if="tableItemShow.isVisible2"
          class="table-item"
          prop="userNums"
          :label="$t('dataAnalysis.numberOfVisitors')"
          sortable
        ></el-table-column>
        <el-table-column
          v-if="tableItemShow.isVisible3"
          class="table-item"
          prop="uvprice"
          :label="$t('dataAnalysis.uvPrice')"
          sortable
        ></el-table-column>
        <el-table-column
          v-if="tableItemShow.isVisible4"
          class="table-item"
          prop="plusShopCartUser"
          :label="$t('dataAnalysis.addCartNumbers')"
          sortable
        ></el-table-column>
        <el-table-column
          v-if="tableItemShow.isVisible5"
          class="table-item"
          prop="placeOrderUser"
          :label="$t('dataAnalysis.paidPeoples')"
          sortable
        ></el-table-column>
        <el-table-column
          v-if="tableItemShow.isVisible6"
          class="table-item"
          prop="placeOrderAmount"
          :label="$t('dataAnalysis.paidAmount')"
          sortable
        ></el-table-column>
        <el-table-column
          v-if="tableItemShow.isVisible7"
          class="table-item"
          prop="placeOrderRate"
          :label="$t('dataAnalysis.visitOrder')"
          sortable
        ></el-table-column>
        <el-table-column
          v-if="tableItemShow.isVisible8"
          class="table-item"
          prop="payUser"
          :label="$t('dataAnalysis.paidNumbers')"
          sortable
        ></el-table-column>
        <el-table-column
          v-if="tableItemShow.isVisible9"
          class="table-item"
          prop="payAmount"
          :label="$t('dataAnalysis.paymentAmount')"
          sortable
        ></el-table-column>
        <el-table-column
          v-if="tableItemShow.isVisible10"
          class="table-item"
          prop="payRate"
          :label="$t('dataAnalysis.vToP')"
          sortable
        ></el-table-column>
        <el-table-column
          v-if="tableItemShow.isVisible11"
          class="table-item"
          prop="customerPrice"
          :label="$t('dataAnalysis.customerUnitPrice')"
          sortable
        ></el-table-column>
        <!--        <el-table-column prop="edit" fixed="right" label="操作"></el-table-column>-->
      </el-table>
    </div>
    <!-- /表格 -->
  </div>
</template>


<script>
import { Debounce } from '@/utils/debounce'
export default {
  data () {
    return {
      platValue: 'H5', // 选择不同端
      outLimit: false, // 判断是否选中数量超过限制数量
      form: {
        saleIndex: [], // 游览访问
        serviceIndex: [] // 成交转化
      },
      tableData: [],
      systemTypeName: [this.$i18n.t('date.a'), 'PC', 'H5', this.$i18n.t('sysManagement.miniPrograms'), this.$i18n.t('dataAnalysis.android'), 'IOS'], // 0 1 2 3 4 5
      timeType: this.$parent.timeType,
      startTime: this.$parent.startTime,
      endTime: this.$parent.endTime,
      selectNum: 0, // 选择指标的数量s
      sumData: [], // 所有指标
      tableItemShow: {
        isVisible1: false,
        isVisible2: false,
        isVisible3: false,
        isVisible4: false,
        isVisible5: false,
        isVisible6: false,
        isVisible7: false,
        isVisible8: false,
        isVisible9: false,
        isVisible10: false,
        isVisible11: false,
        isVisible12: false
      }
    }
  },
  mounted () {
    this.getFlowSour()
  },
  // watch: {
  //   startTime (val) {
  //     this.updateTimeName()
  //     this.getAnalysisData()
  //   }
  // },
  methods: {
    getFlowSour () {
      // console.log('第三部分发送请求')
      this.$http({
        url: this.$http.adornUrl('/platform/flowAnalysis/flowSour'),
        method: 'get',
        params: this.$http.adornParams({
          start: !this.startTime ? null : this.startTime,
          end: !this.endTime ? null : this.endTime,
          timeType: this.timeType
        })
      }).then(({ data }) => {
        if (data) {
          var name = null
          this.tableData = []
          for (let i = 0; i < data.length; i++) {
            name = this.systemTypeName[data[i].systemType]
            data[i].prodInfo = name
            data[i].userNumsRatio = (data[i].userNumsRatio * 100).toFixed(2) + '%'
            data[i].placeOrderRate = (data[i].placeOrderRate * 100).toFixed(2) + '%'
            data[i].payRate = (data[i].payRate * 100).toFixed(2) + '%'
            this.tableData.push(data[i])
          }
        }
      })
    },

    // 导出
    exportCategory: Debounce(function () {
      // let params = {}
      // params = JSON.parse(JSON.stringify(this.searchForm))
        const loading = this.$loading({
          lock: true,
          target: '.source',
          customClass: 'export-load',
          background: 'transparent',
          text: this.$i18n.t('shop.exportIng')
        })
      this.$http({
        url: this.$http.adornUrl('/platform/flowAnalysis/flowSourExport'),
        method: 'get',
        params: this.$http.adornParams({
          start: !this.startTime ? null : this.startTime,
          end: !this.endTime ? null : this.endTime,
          timeType: this.timeType
        }),
        responseType: 'blob'
      }).then(({data}) => {
        loading.close()
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const fileName = this.$t('dataAnalysis.dealTrans') + '.xlsx'
        const elink = document.createElement('a')
        if ('download' in elink) {
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          // URL.revokeObjectURL(elink.href) // 释放URL 对象
          // document.body.removeChild(elink)
        } else {
          navigator.msSaveBlob(blob, fileName)
        }
        this.$message({
          message: this.$i18n.t('shop.exportSuccess'),
          type: 'success',
          duration: 1500
        })
      }).catch((e) => {
        loading.close()
      })
    }),
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
    },
    /**
     * 控制表格列显隐
     */
    changVisibles () {
      this.tableItemShow.isVisible1 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.perVisitor'))
      this.tableItemShow.isVisible2 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.numberOfVisitors'))
      this.tableItemShow.isVisible3 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.uvPrice'))
      this.tableItemShow.isVisible4 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.addCartNumbers'))
      this.tableItemShow.isVisible5 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.paidPeoples'))
      this.tableItemShow.isVisible6 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.paidAmount'))
      this.tableItemShow.isVisible7 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.visitOrder'))
      this.tableItemShow.isVisible8 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.paidNumbers'))
      this.tableItemShow.isVisible9 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.paymentAmount'))
      this.tableItemShow.isVisible10 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.vToP'))
      this.tableItemShow.isVisible11 = this.judgeStrArrIncludeOtherString(this.$i18n.t('dataAnalysis.customerUnitPrice'))
    },
    judgeStrArrIncludeOtherString (str) {
      var strArr = this.sumData
      return strArr.includes(str)
    }
  },
  watch: {
    startTime (val) {
      this.getFlowSour()
    },
    endTime (val) {
      this.getFlowSour()
    },
    timeType (val) {
      this.getFlowSour()
    },
    // 第三部分的最多项多选款监听
    'form.saleIndex' () {
      this.selectNum = this.form.saleIndex.length + this.form.serviceIndex.length
      // sumData是用来存放点击选中的文本框信息
      this.sumData = []
      this.sumData = this.sumData.concat(this.form.saleIndex).concat(this.form.serviceIndex)
      var checks = document.getElementsByName('saleIndex')
      var span = document.getElementById('maxSelectSpan')
      checks.forEach(i => {
        if (this.selectNum >= 5) {
          this.textShare(span, 'red')
          if (!i.checked) {
            i.setAttribute('disabled', 'true')
          }
        }
      })
      if (this.selectNum < 5) {
        this.textShare(span, 'grey')
        checks.forEach(i => {
          i.removeAttribute('disabled')
        })
      }
    },
    'form.serviceIndex' () {
      this.selectNum = this.form.saleIndex.length + this.form.serviceIndex.length
      // debugger
      this.sumData = []
      this.sumData = this.sumData.concat(this.form.saleIndex).concat(this.form.serviceIndex)
      var checks = document.getElementsByName('saleIndex')
      var span = document.getElementById('maxSelectSpan')
      checks.forEach(i => {
        if (this.selectNum >= 5) {
          this.textShare(span, 'red')
          if (!i.checked) {
            i.setAttribute('disabled', 'true')
          }
        }
      })
      if (this.selectNum < 5) {
        this.textShare(span, 'grey')
        checks.forEach(i => {
          i.removeAttribute('disabled')
        })
      }
    },
    // 将存放的选择框数据调用函数来执行数据响应展示操作
    'sumData' () {
      this.changVisibles()
    }
  }
}
</script>

<style lang="scss" scoped>
.source {
  .flow-form {
    border-bottom: 1px solid #eee;
    .hide-label {
      ::v-deep .el-form-item__label {
        color: transparent;
      }
    }
  }
  .table-con {
    border: 1px solid #eee;
    border-bottom: none;
  }

  @keyframes shake {
    0%,
    100% {
      -webkit-transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      -webkit-transform: translateX(-5px);
    }
    20%,
    40%,
    60%,
    80% {
      -webkit-transform: translateX(5px);
    }
  }
  /* /多项选择 */

  /* 告示 */
  .notice {
    margin: 30px 0 20px 0;
    font-size: 14px;
    color: #666;
    line-height: 19px;
  }
  .notice p {
    margin-bottom: 8px;
  }
  /* /告示 */
}
</style>
<style scoped>
  /* .el-checkbox {
    width: 125px;
  } */
 div >>> .el-checkbox__input.is-checked .el-checkbox__inner {
    border-color: #155bd4;
    background: #155bd4;
  }
 div >>> .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #155bd4;
  }
  >>> .export-load {
    top: -50% !important;
  }
</style>

