<template>
  <div class="overview">
    <!-- 轮播 -->
    <div class="scroll-wrapper">
      <div class="scroll-con">
        <div
          v-for="(item, index) in systemTypeName"
          :key="index"
          :class="item.select?'item selected':'item'"
          @click="seleFlowOverview(item.id)"
        >
          <div class="item-data">
            <span>{{item.name}}</span>
            <span>{{$t('dataAnalysis.numberOfVisitors')}}</span>
          </div>
          <div class="item-data">
            <span class="number">{{item.userNum}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 轮播 -->

    <!-- 数据展示 -->
    <div class="show-data-wrap">
      <div class="show-data">
        <div class="data-board data-board-left">
          <div class="data-board__title visit-title">
            <div>
              <img src="~@/assets/img/visit.png" style="margin-bottom: 10px" />
              <p>{{$t('dataAnalysis.pageBrowsing1')}}</p>
            </div>
          </div>
          <div class="data-board__content visit-content">
            <div class="data-board__content-item_box flex-box1">
              <div class="data-board__content-item">
                <div class="data-board__content-item_tittle">{{$t('dataAnalysis.numberOfVisitors')}}</div>
                <div class="num">{{dataArray.userNums}}</div>
                <div class="compare" v-if="timeType!==4">
                  {{this.typeName}}
                  <!-- <span class="arrow">
                    <span v-if="ratio.userNumsRatio===0">-</span>
                    <span v-if="ratio.userNumsRatio!==0">
                      <span v-if="ratio.userNumsRatioRise===false">↓</span>
                      <span v-if="ratio.userNumsRatioRise===true">↑</span>
                      <span>{{ratio.userNumsRatio + '%'}}</span>
                    </span>
                  </span> -->
                  <div v-if="ratio" :class="['lift-rate', ratio.userNumsRatioRise ===false ? 'down' : 'rise']">
                    <img v-if="ratio.userNumsRatioRise===false" src="~@/assets/img/downArrow@2x.png" class="arrows">
                    <img v-else src="~@/assets/img/upArrow@2x.png" class="arrows">
                    <span class="percentage">{{ Math.abs(ratio.userNumsRatio) }}%</span>
                  </div>
                </div>
              </div>

              <div class="data-board__content-item" v-if="timeType!==4">
                <div class="data-board__content-item_tittle">{{$t('dataAnalysis.stayTime')}}</div>
                <div class="num">{{dataArray.averageStopTime}}</div>
                <div class="compare">
                  {{this.typeName}}
                  <!-- <span class="arrow">
                    <span v-if="ratio.averageStopTimeRatio===0">-</span>
                    <span v-if="ratio.averageStopTimeRatio!==0">
                      <span v-if="ratio.averageStopTimeRatioRise===false">↓</span>
                      <span v-if="ratio.averageStopTimeRatioRise===true">↑</span>
                      <span>{{ratio.averageStopTimeRatio + '%'}}</span>
                    </span>
                  </span> -->
                  <div v-if="ratio" :class="['lift-rate', ratio.averageStopTimeRatioRise===false ? 'down' : 'rise']">
                    <img v-if="ratio.averageStopTimeRatioRise===false" src="~@/assets/img/downArrow@2x.png" class="arrows">
                    <img v-else src="~@/assets/img/upArrow@2x.png" class="arrows">
                    <span class="percentage">{{ Math.abs(ratio.averageStopTimeRatio) }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="data-board__content-item_box flex-box2">
              <div class="data-board__content-item" v-if="timeType!==4">
                <div class="data-board__content-item_tittle">{{$t('dataAnalysis.newVisitor')}}</div>
                <div class="num">{{dataArray.newUser}}</div>
                <div class="compare">
                  {{this.typeName}}
                  <!-- <span class="arrow">
                    <span v-if="ratio.newUserRatio===0">-</span>
                    <span v-if="ratio.newUserRatio!==0">
                      <span v-if="ratio.newUserRatioRise===false">↓</span>
                      <span v-if="ratio.newUserRatioRise===true">↑</span>
                      <span>{{ratio.newUserRatio + '%'}}</span>
                    </span>
                  </span> -->
                  <div v-if="ratio" :class="['lift-rate', ratio.newUserRatioRise===false ? 'down' : 'rise']">
                    <img v-if="ratio.newUserRatioRise===false" src="~@/assets/img/downArrow@2x.png" class="arrows">
                    <img v-else src="~@/assets/img/upArrow@2x.png" class="arrows">
                    <span class="percentage">{{ Math.abs(ratio.newUserRatio) }}%</span>
                  </div>
                </div>
              </div>

              <div class="data-board__content-item">
                <div class="data-board__content-item_tittle">{{$t('dataAnalysis.perVisits')}}</div>
                <div class="num">{{dataArray.averageVisitNums}}</div>
                <div class="compare" v-if="timeType!==4">
                  {{this.typeName}}
                  <!-- <span class="arrow">
                    <span v-if="ratio.averageVisitNumsRatio===0">-</span>
                    <span v-if="ratio.averageVisitNumsRatio!==0">
                      <span v-if="ratio.averageVisitNumsRatioRise===false">↓</span>
                      <span v-if="ratio.averageVisitNumsRatioRise===true">↑</span>
                      <span>{{ratio.averageVisitNumsRatio + '%'}}</span>
                    </span>
                  </span> -->
                  <div v-if="ratio" :class="['lift-rate', ratio.averageVisitNumsRatioRise===false ? 'down' : 'rise']">
                    <img v-if="ratio.averageVisitNumsRatioRise===false" src="~@/assets/img/downArrow@2x.png" class="arrows">
                    <img v-else src="~@/assets/img/upArrow@2x.png" class="arrows">
                    <span class="percentage">{{ Math.abs(ratio.averageVisitNumsRatio) }}%</span>
                  </div>
                </div>
              </div>
            </div>

          <div class="data-board__content-item_box flex-box3">
              <div class="data-board__content-item">
                <div class="data-board__content-item_tittle">{{$t('dataAnalysis.views')}}</div>
                <div class="num">{{dataArray.visitNums}}</div>
                <div class="compare" v-if="timeType!==4">
                  {{this.typeName}}
                  <!-- <span class="arrow">
                    <span v-if="ratio.visitNumsRatio===0">-</span>
                    <span v-if="ratio.visitNumsRatio!==0">
                      <span v-if="ratio.visitNumsRatioRise===false">↓</span>
                      <span v-if="ratio.visitNumsRatioRise===true">↑</span>
                      <span>{{ratio.visitNumsRatio + '%'}}</span>
                    </span>
                  </span> -->
                  <div v-if="ratio" :class="['lift-rate', ratio.visitNumsRatioRise===false ? 'down' : 'rise']">
                    <img v-if="ratio.visitNumsRatioRise===false" src="~@/assets/img/downArrow@2x.png" class="arrows">
                    <img v-else src="~@/assets/img/upArrow@2x.png" class="arrows">
                    <span class="percentage">{{ Math.abs(ratio.visitNumsRatio) }}%</span>
                  </div>
                </div>
              </div>

              <div class="data-board__content-item" v-if="timeType!==4">
                <div class="data-board__content-item_tittle">{{$t('dataAnalysis.lossRate')}}</div>
                <div class="num">{{dataArray.lossUserRate}}%</div>
                <div class="compare">
                  {{this.typeName}}
                  <!-- <span class="arrow">
                    <span v-if="ratio.lossUserRatio===0">-</span>
                    <span v-if="ratio.lossUserRatio!==0">
                      <span v-if="ratio.lossUserRatioRise===false">↓</span>
                      <span v-if="ratio.lossUserRatioRise===true">↑</span>
                      <span>{{ratio.lossUserRatio + '%'}}</span>
                    </span>
                  </span> -->
                  <div v-if="ratio" :class="['lift-rate', ratio.lossUserRatioRise===false ? 'down' : 'rise']">
                    <img v-if="ratio.lossUserRatioRise===false" src="~@/assets/img/downArrow@2x.png" class="arrows">
                    <img v-else src="~@/assets/img/upArrow@2x.png" class="arrows">
                    <span class="percentage">{{ Math.abs(ratio.lossUserRatio) }}%</span>
                  </div>
                </div>
              </div>
          </div>
          </div>
        </div>
        <div class="data-board data-board-right">
          <div class="data-board__title deal-title">
            <div>
              <img src="~@/assets/img/deal.png" style="margin-bottom: 10px" />
              <p>{{$t('dataAnalysis.dealTrans')}}</p>
            </div>
          </div>

          <div class="data-board__content deal-content">
            <div class="data-board__content-item">
              <div class="data-board__content-item_tittle">{{$t('dataAnalysis.paidNumbers')}}</div>
              <div class="num">{{dataArray.payUser}}</div>
              <div class="compare" v-if="timeType!==4">
                {{this.typeName}}
                <!-- <span class="arrow">
                  <span v-if="ratio.payUserRatio===0">-</span>
                  <span v-if="ratio.payUserRatio!==0">
                    <span v-if="ratio.payUserRatioRise===false">↓</span>
                    <span v-if="ratio.payUserRatioRise===true">↑</span>
                    <span>{{ratio.payUserRatio + '%'}}</span>
                  </span>
                </span> -->
                  <div v-if="ratio" :class="['lift-rate', ratio.payUserRatioRise===false ? 'down' : 'rise']">
                    <img v-if="ratio.payUserRatioRise===false" src="~@/assets/img/downArrow@2x.png" class="arrows">
                    <img v-else src="~@/assets/img/upArrow@2x.png" class="arrows">
                    <span class="percentage">{{ Math.abs(ratio.payUserRatio) }}%</span>
                  </div>
              </div>
            </div>
            <div class="data-board__content-item" v-if="timeType!==4">
              <div class="data-board__content-item_tittle">{{$t('dataAnalysis.vToP')}}</div>
              <div class="num">{{dataArray.payRate}}%</div>
              <div class="compare">
                {{this.typeName}}
                <!-- <span class="arrow">
                  <span v-if="ratio.payRateRatio===0">-</span>
                  <span v-if="ratio.payRateRatio!==0">
                    <span v-if="ratio.payRateRatioRise===false">↓</span>
                    <span v-if="ratio.payRateRatioRise===true">↑</span>
                    <span>{{ratio.payRateRatio + '%'}}</span>
                  </span>
                </span> -->
                <div v-if="ratio" :class="['lift-rate', ratio.payRateRatioRise===false ? 'down' : 'rise']">
                  <img v-if="ratio.payRateRatioRise===false" src="~@/assets/img/downArrow@2x.png" class="arrows">
                  <img v-else src="~@/assets/img/upArrow@2x.png" class="arrows">
                  <span class="percentage">{{ Math.abs(ratio.payRateRatio) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   
    <!-- 数据展示 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      systemTypeName: [
        { name: this.$i18n.t('date.a'), id: 0, userNum: 0, select: true },
        { name: 'PC', id: 1, userNum: 0, select: false },
        { name: 'H5', id: 2, userNum: 0, select: false },
        { name: this.$i18n.t('sysManagement.miniPrograms'), id: 3, userNum: 0, select: false },
        { name: this.$i18n.t('dataAnalysis.android'), id: 4, userNum: 0, select: false },
        { name: 'IOS', id: 5, userNum: 0, select: false }
      ],
      dataArray: {
        userNums: 0,
        newUser: 0,
        visitNums: 0,
        averageStopTime: 0,
        averageVisitNums: 0,
        lossUserRate: '0.00%',
        payUser: 0,
        payRate: '0.00%'
      },
      ratio: {},
      systemType: 0, // 系统类型
      userNumsArray: [], // 流量总览访客数列表
      timeType: 5,
      startTime: this.$parent.startTime,
      endTime: this.$parent.endTime,
      typeName: this.$i18n.t('dataAnalysis.compareWithThePreviousOneDay')
    }
  },
  mounted () {
    this.getAnalysisData()
  },
  watch: {
    startTime (val) {
      this.getAnalysisData()
    },
    endTime (val) {
      this.getAnalysisData()
    },
    systemType (val) {
      this.systemType = val
      this.getAnalysisData()
    }
  },
  methods: {
    ratioInit () {
      this.ratio = {
        averageStopTimeRatio: 0,
        averageStopTimeRatioRise: true,
        averageVisitNumsRatio: 0,
        averageVisitNumsRatioRise: true,
        lossUserRatio: 0,
        lossUserRatioRise: true,
        newUserRatio: 0,
        newUserRatioRise: true,
        payRateRatio: 0,
        payRateRatioRise: true,
        payUserRatio: 0,
        payUserRatioRise: true,
        userNumsRatio: 0,
        userNumsRatioRise: true,
        visitNumsRatio: 0,
        visitNumsRatioRise: true
      }
    },
    // 通过当前时间类别更新比较日期
    updateTimeName () {
      switch (this.timeType) {
        case 1:
          this.typeName = this.$i18n.t('dataAnalysis.compareWithThePreviousOneDay')
          break
        case 2:
          this.typeName = this.$i18n.t('dataAnalysis.aWeekCompare')
          break
        case 3:
          this.typeName = this.$i18n.t('dataAnalysis.compareWithThePreviousAMonth')
          break
        case 4:
          this.typeName = ''
          break
        case 5:
          this.typeName = this.$i18n.t('dataAnalysis.compareWithThePrevious7Days')
          break
        case 6:
          this.typeName = this.$i18n.t('dataAnalysis.compareWithThePrevious30Days')
          break
        default:
          break
      }
    },
    // 请求接口
    getAnalysisData () {
      // console.log('第一部分发送请求')
      // 请求第一部分数据
      this.ratioInit()
      this.$http({
        url: this.$http.adornUrl('/platform/flowAnalysis/getAnalysisData'),
        method: 'get',
        params: this.$http.adornParams({
          timeType: this.timeType,
          start: !this.startTime ? null : this.startTime,
          end: !this.endTime ? null : this.endTime,
          systemType: this.systemType
        })
      }).then(({ data }) => {
        if (data) {
          this.dataArray = data
          this.ratio = data.ratio
        }
      })

      // 请求第一部分所有系统的访客数
      this.$http({
        url: this.$http.adornUrl('/platform/flowAnalysis/systemTypeNums'),
        method: 'get',
        params: this.$http.adornParams({
          timeType: this.timeType,
          start: !this.startTime ? null : this.startTime,
          end: !this.endTime ? null : this.endTime
        })
      }).then(({ data }) => {
        if (data) {
          for (let i = 0; i < this.systemTypeName.length; i++) {
            if (i === 0) {
              this.systemTypeName[i].userNum = data.all
            } else if (i === 1) {
              this.systemTypeName[i].userNum = data.pc
            } else if (i === 2) {
              this.systemTypeName[i].userNum = data.h5
            } else if (i === 3) {
              this.systemTypeName[i].userNum = data.applets
            } else if (i === 4) {
              this.systemTypeName[i].userNum = data.android
            } else if (i === 5) {
              this.systemTypeName[i].userNum = data.ios
            }
            if (this.systemType === i) {
              this.systemTypeName[i].select = true
            } else {
              this.systemTypeName[i].select = false
            }
          }
        }
      })
    },
    // 流量总览点击切换
    seleFlowOverview (systemType) {
      this.systemType = systemType
      this.$parent.systemType = systemType
      this.getAnalysisData()
      // for (let i = 0; i<ele.length; i++) {
      //   var systemTypeName = this.systemTypeName[i]
      //   if (systemType === i) {
      //     this.$set(this.systemTypeName, '')
      //     this.systemTypeName.select = true
      //   } else {
      //     this.systemTypeName.select = false
      //   }
      // }
    }
  }
}
</script>

<style lang="scss">
.overview {
  /* 轮播 */
  .scroll-con {
    white-space: nowrap;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 25px;
  }

  .scroll-con .item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 92px;
    width: 16%;
    border: 1px solid #dcdee0;
    border-radius: 4px;
    padding: 9px 16px 11px 16px;
    box-sizing: border-box;
    cursor: pointer;
    transition: box-shadow 0.2s ease 0s;
    &:last-child {
      margin-right: 0;
    }
  }

  .scroll-con .item:hover {
    box-shadow: 0 2px 8px rgba(200, 201, 204, 0.5);
  }

  .scroll-con .selected {
    background-color: #edf4ff;
    border-color: #155bd4;
  }

  .item-title {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
  }

  .item-data {
    display: flex;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }

  .item-data .number {
    font-size: 25px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #333333;
  }

  /* 轮播 */
  /* 数据展示 */
  .show-data-wrap {
    margin-top: 30px;
    width: 100%;
    overflow-x: scroll;

    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
  }
  .show-data-wrap::-webkit-scrollbar{
    width: 0 !important;
  }
  .show-data {
    display: flex;
    min-width: 1306px;
  }

  .show-data .data-board {
    display: flex;
    margin-bottom: 4px;
  }
  .data-board-left {
    width:60%;
    margin-right:10px
  }
  .data-board-right {
    width:40%
  }

  .flex-box1{
    flex: 2;
  }
  .flex-box2{
    flex: 4;
    align-items: center;
  }
  .flex-box2 .data-board__content-item {
    padding-left: 0;
    margin-left: -3%;
  }
  .flex-box3{
    flex: 2;
  }

  .data-board__content-item_tittle {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #333333;
  }

  .data-board .data-board__title {
    padding: 0 12px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: center;
    justify-content: center;
    color: #fff;
    text-align: center;
    -ms-flex: none;
    flex: none;
  }

  .data-board .visit-title {
    background-color: #155bd4;
  }

  .data-board .deal-title {
    background-color: #155bd4;
  }

  .data-board .data-board__content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex: 1 1 auto;
    padding: 0 8px;
  }

  .data-board .visit-content {
    background-color: rgb(243, 247, 253);
  }

  .data-board .deal-content {
    background-color: #f3f7fd;
  }

  .data-board__content-item_box {
    display: flex;
    flex-direction: column;
  }
  .data-board__content-item {
    // min-width: 200px;
    // width: 33%;
    padding: 35px;
  }

  .data-board__content-item .num {
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #333333;
      opacity: 1;
      margin-top: 9px;
      margin-bottom: 12px;
  }

  .data-board__content-item .compare {
    color: #969799;
    margin-top: 8px;
    display: flex;
  }

  .data-board__content-item .arrow {
    color: #323233;
    margin-left: 16px;
  }

  /* 数据展示 */
}
// 新增箭头
.quite {
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
  .quite-txt {
    margin-right: 15px;
    color: #999;
  }
}
.lift-rate {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-left: 16px;
  .arrows {
    display: block;
    width: 8px;
    height: 10px;
    margin-right: 3px;
  }
}
.lift-rate.down .percentage {
  color: #FF4141;
  line-height: 1em;
}
.lift-rate.rise .percentage {
  color: #3CC480;
  line-height: 1em;
}
</style>

