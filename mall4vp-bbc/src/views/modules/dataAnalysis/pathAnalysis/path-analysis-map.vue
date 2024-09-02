<template>
  <div class="mod-indexT base-section">
    <div class="route-map">
      <div class="base-section__header route-map__header">
        <h3 class="base-section__header-title">
          {{ $t("dataAnalysis.customPath") }}
        </h3>
      </div>
      <div class="route-map__desc">
        <p>{{ $t("dataAnalysis.pathText") }}</p>
        <p>{{ $t("dataAnalysis.pathText2") }}</p>
      </div>
      <div class="plat">
        <el-radio-group
          v-model="radio"
          size="small"
          @change="clickSystemType()"
        >
          <el-radio-button class="plat-item" label="0">{{ $t("date.a") }}</el-radio-button>
          <el-radio-button class="plat-item" label="1">pc</el-radio-button>
          <el-radio-button class="plat-item" label="2">H5</el-radio-button>
          <el-radio-button class="plat-item" label="3">{{
            $t("sysManagement.miniPrograms")
          }}</el-radio-button>
          <el-radio-button class="plat-item" label="4">{{
            $t("dataAnalysis.android")
          }}</el-radio-button>
          <el-radio-button class="plat-item" label="5">ios</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="d-customers over">
      <!-- <div class="arrow-box">
        <div id="prev" class="arrow prev disable"></div>
        <div id="next" class="arrow next"></div>
      </div>-->

      <div class="customers-box">
        <div class="box-container" v-if="showPages">
          <div class="box-title">
            <span> {{ $t("dataAnalysis.step1") }}</span>
            <span> {{ $t("dataAnalysis.step2") }}</span>
            <span> {{ $t("dataAnalysis.step3") }}</span>
            <span> {{ $t("dataAnalysis.step4") }}</span>
            <span> {{ $t("dataAnalysis.step5") }}</span>
            <span> {{ $t("dataAnalysis.step6") }}</span>
            <span> {{ $t("dataAnalysis.step7") }}</span>
            <span> {{ $t("dataAnalysis.step8") }}</span>
            <span> {{ $t("dataAnalysis.step9") }}</span>
            <span> {{ $t("dataAnalysis.step10") }}</span>
          </div>
          <svg class="mainSvg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient
                id="myLinearGradient1"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
                spreadMethod="pad"
              >
                <stop offset="0%" stop-color="#85b1fb" stop-opacity="1" />
                <stop offset="100%" stop-color="#afc9f5" stop-opacity="1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="box-container empty-log" v-if="!showPages">
          {{ $t("dataAnalysis.noRecord") }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { loadGraph0 } from './load.js'
import { render0 } from './render.js'
import sankey from './layout.js'
// import load from './dynamicLoadScript'

// const resourceCdn1 = 'https://unpkg.com/d3@5.16.0/dist/d3.min.js'
// const resourceCdn2 = 'https://npm.elemecdn.com/d3@5.16.0/dist/d3.min.js'
// const resourceCdn3 = 'https://fastly.jsdelivr.net/npm/d3@5.16.0/dist/d3.min.js'

export default {
  data () {
    return {
      graphData: {},
      radio: 0,
      timeType: 1,
      systemType: 0,
      start: '',
      showPages: false
    }
  },
  watch: {
    timeType (val) {
      this.timeType = val
    },
    start (val) {
      this.start = val
      this.getDate()
    }
  },
  created () {
    // this.init()
  },
  methods: {
    init () {
      // dynamic load tinymce from cdn
      // load(resourceCdn1, (err) => {
      //   if (!err) {
      //     this.getDate()
      //     return
      //   }
      //   load(resourceCdn2, (err2) => {
      //     if (!err2) {
      //       this.getDate()
      //       return
      //     }
      //     load(resourceCdn3, (err3) => {
      //       if (!err3) {
      //         this.getDate()
      //         return
      //       }
      //       this.$message.error(err.message)
      //     })
      //   })
      // })
    },
    getDate () {
      this.$http({
        url: this.$http.adornUrl(`/platform/flowRouteAnalysis/getRoutData`),
        method: 'get',
        params: this.$http.adornParams({
          timeType: this.timeType,
          start: this.start,
          systemType: this.systemType
        })
      }).then(({ data }) => {
        this.graphData = data.sankeyDto
        if (data.sankeyDto.node) {
          this.showPages = true
          this.$nextTick(() => {
            this.sankey()
          })
        } else {
          this.showPages = false
        }
      })
    },
    sankey () {
      const info = loadGraph0(this.graphData)
      const layout = sankey().nodes(info.nodes).edges(info.edges)
      const data = layout()
      render0(data, '.mainSvg')
    },
    clickSystemType () {
      this.systemType = this.radio
      this.getDate()
    }
  }
}
</script>

<style lang="scss">
.mod-indexT {
  .route-map__header {
    margin-bottom: 8px;
  }
  .base-section__header-title {
    display: -ms-flexbox;
    display: flex;
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
  }
  .route-map__desc {
    font-size: 14px;
    color: #323233;
    line-height: 20px;
  }
  .route-map__desc p {
    line-height: 24px;
  }
  .route-map .shop-type-wrapper {
    margin: 24px 0;
  }

  .over {
    padding: 0 10px;
  }
  .mainSvg {
    width: 100%;
    height: 200%;
    padding: 10px 0;
  }
  .title {
    font-family: Arial;
    font-size: 14px;
    display: block;
    padding-top: 20px;
    white-space: nowrap;
    margin-bottom: 20px;
    // color: #c42020;
  }
  svg,
  rect {
    box-sizing: border-box;
  }
  .page {
    width: 140px;
    // color: #999;
    // background-color: #58aaee;
  }

  .d-customers {
    position: relative;
    width: 100%;
    white-space: nowrap;
    // overflow: hidden;

    // 两个左右切换的按钮
    .arrow-box {
      position: absolute;
      top: 8%;
      -webkit-transform: translateY(-50%);
      -moz-transform: translateY(-50%);
      transform: translateY(-50%);
      left: 0;
      width: 100%;
      // display: none;
    }

    .over .arrow-box {
      display: block;
    }

    .arrow-box .arrow {
      width: 22px;
      height: 22px;
      background: #eee;
      position: absolute;
      z-index: 2;
      border-radius: 50%;
      cursor: pointer;
    }

    .arrow-box .arrow.disable {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .arrow-box .arrow.prev {
      left: 0;
      transform: rotate(180deg);
    }

    .arrow-box .arrow.next {
      right: 0;
    }

    .arrow-box .arrow::before,
    .arrow-box .arrow::after {
      position: absolute;
      top: 6px;
      display: block;
      width: 0;
      height: 0;
      content: " ";
      font-size: 0;
      border: 5px solid transparent;
    }

    .arrow-box .arrow::before {
      left: 10px;
      border-left: 5px solid #999;
    }
    .arrow-box .arrow::after {
      left: 8px;
      border-left: 5px solid #eee;
    }

    // 展示框
    .customers-box {
      // display: inline-block;
      // display: flex;
      margin: 20px 0;
      overflow: hidden;
      width: 100%;
      overflow-x: auto;
      white-space: nowrap;
      // background: #dddcdc;
    }
    .box-title {
      height: 80px;
    }
    .box-title span {
      font-size: 26px;
      line-height: 60px;
      // color: #2c2c2c;
      display: inline-block;
      margin: 20px;
      margin-right: 156px;
      text-align: center;
    }
    .box-container {
      width: 2550px;
      // background: #474747;
      height: 600px;
      // padding-bottom: 20px;
      overflow: auto;
      overflow-x: hidden;
    }
    .empty-log {
      width: auto;
      margin: 20px 0;
      height: 200px;
    }
  }
  .plat {
    margin-top: 20px;
    .plat-item.el-radio-button {
      .el-radio-button__inner {
        border-radius: 0;
        background: #FFF;
      }
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      color: #155bd4;
    }
    .plat-item.is-active {
      .el-radio-button__inner {
        color: #155bd4;
        background-color: rgba(21,91,212, .1);
      }
    }
  }
}
</style>
