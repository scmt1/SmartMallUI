<template>
  <div class="mod-customers">
    <el-main v-loading="swiperLoading" class="el-main">
    <div class="d-customers over">
      <div class="arrow-box">
        <div id="prev" class="arrow prev disable" @click="prevPart()" ref="prev"></div>
        <div id="next" class="arrow next" @click="nextPart()" ref="next"></div>
      </div>
      <div class="customers-box" ref="box">
          <div class="customers-content" ref="content">
            <div
              v-for="index of 7"
              :key="index"
              v-on:click="clickStatis(index - 1,$event)"
              :class="[ indexSwitch === index -1 ? 'is-select statis-item' :'statis-item' ]"
              id="totalMember"
            >
              <h4 class="statis-item__title">{{data.title[index - 1]}}</h4>
              <p class="statis-item__data">{{data.num[index - 1]}}</p>
              <br />
              <span class="change-trend change-trend--decline" :style="{color: data.rate[index-1] == 0 ? 'unset' : data.rate[index-1] > 0 ? '#3CC480' : '#FF4141'}">
                <span class="change-trend__title">{{compareDate}}</span>
                <span class="change-trend__data">
                  <i :class="[data.rate[index - 1] === 0 ? 'el-icon-minus' : data.rate[index - 1] > 0 ? 'el-icon-top': 'el-icon-bottom']" style="font-weight: 900"></i>
                  <span
                    v-if="data.rate[index - 1] !== 0"
                  >{{Math.abs(data.rate[index - 1]) + '%'}}</span>
                </span>
              </span>
            </div>
          </div>
      </div>
    </div>
    </el-main>
  </div>
</template>

<script>
export default {
  data () {
    return {
      indexSwitch: 0,
      isMove: false, // 当内容宽度大于盒子宽度，isMove为true，反之为false
      screenWidth: '', // 屏幕宽度
      loading: false
    }
  },
  props: {
    data: {
      type: Object,
      default: null
    },
    compareDate: {
      type: String,
      default: ''
    },
    swiperLoading: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$parent.oneEchartCurrentName = this.data.title[0]
    })
    var ele = document.getElementsByClassName('statis-item__title')
    for (var j = 0, len = ele.length; j < len; j++) {
      this.$parent.oneEchartAllName.push(ele[j].innerText)
    }
    this.judgeSize()
    // 监听游览器窗口变化
    const that = this
    window.addEventListener('resize', function () {
      that.screenWidth = document.body.offsetWidth
    })
  },
  watch: {
    // 窗口变化，重新判断内容和盒子大小比较
    screenWidth () {
      this.judgeSize()
    }
  },
  methods: {
    clickStatis: function (index, e) {
      this.indexSwitch = index
      this.$parent.oneEchartCurrentName = e.currentTarget.getElementsByClassName('statis-item__title')[0].innerText
      this.$emit('updateData', index)
    },
    // 左箭头
    prevPart () {
      if (this.isMove) {
        if (this.$refs.content.style.left !== '0px') {
          this.$refs.content.style.left = '0'
          this.$refs.content.style.right = ''
          this.$refs.prev.style.cursor = 'not-allowed'
          this.$refs.next.style.cursor = 'pointer'
        }
      }
    },
    // 右箭头
    nextPart () {
      if (this.isMove) {
        if (this.$refs.content.style.right !== '0px') {
          this.$refs.content.style.right = '0'
          this.$refs.content.style.left = ''
          this.$refs.prev.style.cursor = 'pointer'
          this.$refs.next.style.cursor = 'not-allowed'
        }
      }
    },
    // 判断内容和盒子的大小
    judgeSize () {
      this.$nextTick(() => {
        if (this.$refs.content.clientWidth > this.$refs.box.clientWidth) {
          this.isMove = true
          if (this.$refs.content.style.right === '0px') {
            this.$refs.prev.style.cursor = 'pointer'
          } else {
            this.$refs.next.style.cursor = 'pointer'
          }
        } else {
          this.isMove = false
          this.$refs.prev.style.cursor = 'not-allowed'
          this.$refs.next.style.cursor = 'not-allowed'
          this.$refs.content.style.left = ''
          this.$refs.content.style.right = ''
        }
      })
    }
  }
}
</script>

<style lang="scss">
.mod-customers {
  .over {
    padding: 0 32px;
  }

  .d-customers {
    position: relative;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;

    // 两个左右切换的按钮
    .arrow-box {
      position: absolute;
      top: 40%;
      -webkit-transform: translateY(-50%);
      -moz-transform: translateY(-50%);
      transform: translateY(-50%);
      left: 0;
      width: 100%;
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
      position: relative;
      height: 127px;
      margin: 20px 0;
      overflow: hidden;

      .customers-content{
        position: absolute;
      }
      .statis-item {
        box-sizing: border-box;
        width: 200px;
        height: 127px;
        padding: 16px;
        border: 1px solid #dcdee0;
        border-radius: 4px;
        cursor: pointer;
        display: -ms-inline-flexbox;
        display: inline-flex;
        -ms-flex-direction: column;
        flex-direction: column;
        margin-right: 8px;
      }
      .statis-item.is-select {
        background: #f5faff;
        border-color: #02A1E9;
      }
      .statis-item:last-child{
        margin-right: 0;
      }
      .statis-item__title {
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        display: inline-block;
        margin-bottom: 8px;
        color: #666666;
      }
      .statis-item__data {
        font-size: 20px;
        font-weight: bold;
      }
      .statis-item:hover {
        border: #87c3f5 solid 1px;
        cursor: pointer;
      }
    }
    .change-trend__title,
    .change-trend__data {
      font-size: 12px;
    }
  }
}
</style>

<style lang="scss" scoped>
.mod-customers {
  .el-main {
    padding: 0;
  }
}
</style>
