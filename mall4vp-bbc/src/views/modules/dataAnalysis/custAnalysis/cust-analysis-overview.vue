<template>
  <div class="customer-overview">
    <div class="statis-item" v-for="index of 4" :key="index" @click="showSinChart(index)" @mouseenter="enter(index)"
         @mouseleave="leave()">
      <h4 class="statis-item__title">{{overviewData.title[index-1]}}</h4>
      <p class="statis-item__data">{{overviewData.num[index-1]}}</p>
      <span v-if="overviewData.rate[index-1] !== 0" class="change-trend change-trend--decline"  :class="[overviewData.rate[index-1]*100 > 0 ? 'pointerUpT' : 'pointerBuT' ]">
        <span class="change-trend__title" v-if="overviewData.type==1"></span>
        <span class="change-trend__title" v-if="overviewData.type==2">{{$t('dataAnalysis.compareWithThePrevious7Days')}}</span>
        <span class="change-trend__title" v-if="overviewData.type==3">{{$t('dataAnalysis.compareWithThePrevious30Days')}}</span>
        <span class="change-trend__title" v-if="overviewData.type==4">{{$t('dataAnalysis.compareWithThePreviousOneDay')}}</span>
        <span class="change-trend__title" v-if="overviewData.type==5">{{$t('dataAnalysis.compareWithThePreviousAMonth')}}</span>

        <!--        <span class="change-trend__title change-trend__title-gray" v-if="overviewData.type==0">占比-%</span>-->
        <span class="change-trend__title change-trend__title-gray"
              v-if="overviewData.type==0 && overviewData.rate[index-1]==0">{{$t('home.Percentage')}}-%</span>
        <span class="change-trend__data" v-if="overviewData.type!=1">
          <!-- <i class="arrow"></i> -->
          <span v-if="overviewData.type!=0"></span>
          <!-- <span class="pointerUpT el-icon-top" v-if="overviewData.rate[index-1] > 0 && overviewData.type != 0"></span> -->
          <img src="~@/assets/img/downArrow.png"v-if="overviewData.rate[index-1] < 0 && overviewData.type != 0" style="margin-bottom: 4px" width="8px" height="10px" alt="">
          <img src="~@/assets/img/upArrow.png" v-if="overviewData.rate[index-1] > 0 && overviewData.type != 0" style="margin-bottom: 4px" width="8px" height="10px" alt="">
          <!-- <span class="pointerBuT el-icon-bottom"
                v-if="overviewData.rate[index-1] < 0 && overviewData.type != 0"></span> -->

          <span :class="[overviewData.rate[index-1]*100 > 0 ? 'pointerUpT' : 'pointerBuT' ]" v-if="overviewData.rate[index-1]!=0">{{(overviewData.rate[index-1]*100).toFixed(2) | ratio}}</span>
        </span>

      </span>
      <div v-if="hover && index==curIndex" class="cover"></div>
    </div>

  </div>
</template>

<script>
  export default {
    filters: {
      ratio (value) {
        if (value < 0) {
          return value * -1 + '%'
        }
        return value + '%'
      }
    },
    props: {
      hover: {
        type: Boolean,
        default: null
      },
      overviewData: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        isShow: false,     // 是否显示，一开始没数据不显示
        curIndex: 0
      }
    },
    watch: {
      // 监听数据是否为空
      // overviewData () {
      //   if (this.overviewData != null) {
      //     this.isShow = true
      //     this.info = this.overviewData
      //   }
      // }

      overviewData: {
        handler (newValue, oldValue) {
        },
        deep: true
      }
    },
    mounted () {
    },
    methods: {
      /**
       * 移入
       */
      enter (index) {
        this.curIndex = index
      },
      /**
       * 移出
       */
      leave () {
        this.curIndex = 0
      },
      /**
       * 单个类型的表
       */
      showSinChart (index) {
        if (this.hover) {
          // 表示需要展示的是哪个表
          this.$emit('index', index)
        }
      }
    }
  }
</script>

<style lang="scss">
  /* 数量统计 */
  .customer-overview {
    display: flex;

    .statis-item {
      display: inline-block;
      background: #f7f8fa;
      padding: 16px 0 16px 0px;
      position: relative;
      box-sizing: border-box;
      -ms-flex: 1;
      flex: 1;
      text-align: center;
    }

    .statis-item__title {
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
      display: inline-block;
      margin-bottom: 8px;
    }

    .statis-item__data {
      font-size: 20px;
      font-weight: bold;
      line-height: 26px;
      color: #333333;
      margin-bottom: 8px;
    }

    .change-trend--decline {
      color: #3CC480;
    }

    .change-trend__title-gray {
      color: #969799;
    }

    .change-trend {
      font-size: 12px;
      line-height: 18px;
    }

    .change-trend__data {
      position: relative;
      padding-left: 10px;
    }

    .change-trend__data .arrow {
      font-size: 12px;
      margin-right: 4px;
    }

    /* 上升下降箭头 */
    .pointerUpT {
      color: #3CC480;
    }

    .pointerBuT {
      color: #FF4141;
    }

    /* 覆盖层 */
    .cover {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
      opacity: 0.65;
    }
  }

  /* /数量统计 */
</style>

