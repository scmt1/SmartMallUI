<template>
  <!-- 会员概览卡片 -->
  <div class="membership-overview membership-overview-card">
    <div class="card-swiper-box">
      <!-- 左滑 -->
      <div ref="prev" class="slide-left-arrow disable" @click="prevPart">
        <img src="@/assets/icon/slide-left-arrow@2x.png" alt="">
      </div>
      <!-- 右滑 -->
      <div ref="next" class="slide-right-arrow enable" @click="nextPart">
        <img src="@/assets/icon/slide-right-arrow@2x.png" alt="">
      </div>
      <!-- 列表 -->
      <div ref="box" class="card-box">
        <div ref="content" class="card-list">
          <!-- <div :class="['card-item', curSelected === index ? 'active' : '']" @click="switchCards(index)"> -->
          <div
            id="totalMember"
            :class="['card-item', curSelected === 0 ? 'active' : '']"
            @click="switchCards(0,$event)"
          >
            <p class="week-txt">{{$t('dataAnalysis.totalMembership')}}</p>
            <p class="strong-num">{{ this.$parent.totalMember }}</p>
            <div :class="['rise-fall-rate', indexSwitch === 0 ? 'rise' : 'down' ]">
              <!-- <span>{{ this.$parent.compareDate }}</span> -->
              <img v-if="rateRatio.totalMemberRate < 0" src="@/assets/icon/downArrow@2x.png" class="arrows">
              <img v-if="rateRatio.totalMemberRate > 0" src="@/assets/icon/upArrow@2x.png" class="arrows">
              <!-- <span v-if="rateRatio.totalMemberRate !== 0"> {{ Math.abs(rateRatio.totalMemberRate) + '%' }}</span> -->
              <span v-if="rateRatio.totalMemberRate > 0" style="color:hsl(150deg 53% 58%)"> {{ Math.abs(rateRatio.totalMemberRate) + '%' }}</span>
              <span v-if="rateRatio.totalMemberRate < 0" style="color:hsl(0deg 100% 70%)"> {{ Math.abs(rateRatio.totalMemberRate) + '%' }}</span>
              <span v-if="rateRatio.totalMemberRate === 0"> - </span>
            </div>
          </div>
          <div
            id="newMember"
            :class="['card-item', curSelected === 1 ? 'active' : '']"
            @click="switchCards(1,$event)"
          >
            <p class="week-txt">{{$t('dataAnalysis.numberOfNewMembers')}}</p>
            <p class="strong-num">{{ this.$parent.newMember }}</p>
            <div :class="['rise-fall-rate', indexSwitch === 1 ? 'rise' : 'down' ]">
              <!-- <span>{{ this.$parent.compareDate }}</span> -->
              <img v-if="rateRatio.newMemberRate < 0" src="@/assets/icon/downArrow@2x.png" class="arrows">
              <img v-if="rateRatio.newMemberRate > 0" src="@/assets/icon/upArrow@2x.png" class="arrows">
              <!-- <span v-if="rateRatio.newMemberRate !== 0"> {{ Math.abs(rateRatio.newMemberRate) + '%' }}</span> -->
              <span v-if="rateRatio.newMemberRate > 0" style="color:hsl(150deg 53% 58%)"> {{ Math.abs(rateRatio.newMemberRate) + '%' }}</span>
              <span v-if="rateRatio.newMemberRate < 0" style="color:hsl(0deg 100% 70%)"> {{ Math.abs(rateRatio.newMemberRate) + '%' }}</span>
              <span v-if="rateRatio.newMemberRate === 0"> - </span>
            </div>
          </div>

          <div
            id="payMember"
            :class="['card-item', curSelected === 2 ? 'active' : '']"
            @click="switchCards(2,$event)"
          >
            <p class="week-txt">{{$t('dataAnalysis.numberOfPaidMembers')}}</p>
            <p class="strong-num">{{ this.$parent.payMember }}</p>
            <div :class="['rise-fall-rate', indexSwitch === 2 ? 'rise' : 'down' ]">
              <!-- <span>{{ this.$parent.compareDate }}</span> -->
              <img v-if="rateRatio.payMemberRate < 0" src="@/assets/icon/downArrow@2x.png" class="arrows">
              <img v-if="rateRatio.payMemberRate > 0" src="@/assets/icon/upArrow@2x.png" class="arrows">
              <!-- <span v-if="rateRatio.payMemberRate !== 0"> {{ Math.abs(rateRatio.payMemberRate) + '%' }}</span> -->
              <span v-if="rateRatio.payMemberRate > 0" style="color:hsl(150deg 53% 58%)"> {{ Math.abs(rateRatio.payMemberRate) + '%' }}</span>
              <span v-if="rateRatio.payMemberRate < 0" style="color:hsl(0deg 100% 70%)"> {{ Math.abs(rateRatio.payMemberRate) + '%' }}</span>
              <span v-if="rateRatio.payMemberRate === 0"> - </span>
            </div>
          </div>

          <div
            id="couponMember"
            :class="['card-item', curSelected === 3 ? 'active' : '']"
            @click="switchCards(3,$event)"
          >
            <p class="week-txt">{{$t('dataAnalysis.numberOfCouponMembers')}}</p>
            <p class="strong-num">{{ this.$parent.couponMember }}</p>
            <div :class="['rise-fall-rate', indexSwitch === 3 ? 'rise' : 'down' ]">
              <!-- <span>{{ this.$parent.compareDate }}</span> -->
              <img v-if="rateRatio.couponMemberRate < 0" src="@/assets/icon/downArrow@2x.png" class="arrows">
              <img v-if="rateRatio.couponMemberRate > 0" src="@/assets/icon/upArrow@2x.png" class="arrows">
              <!-- <span v-if="rateRatio.couponMemberRate !== 0"> {{ Math.abs(rateRatio.couponMemberRate) + '%' }}</span> -->
              <span v-if="rateRatio.couponMemberRate > 0" style="color:hsl(150deg 53% 58%)"> {{ Math.abs(rateRatio.couponMemberRate) + '%' }}</span>
              <span v-if="rateRatio.couponMemberRate < 0" style="color:hsl(0deg 100% 70%)"> {{ Math.abs(rateRatio.couponMemberRate) + '%' }}</span>
              <span v-if="rateRatio.couponMemberRate === 0"> - </span>
            </div>
          </div>

          <div
            id="memberPayAmount"
            :class="['card-item', curSelected === 4 ? 'active' : '']"
            @click="switchCards(4,$event)"
          >
            <p class="week-txt">{{$t('dataAnalysis.memberPaidAmount')}}</p>
            <p class="strong-num">{{ this.$parent.memberPayAmount }}</p>
            <div :class="['rise-fall-rate', indexSwitch === 4 ? 'rise' : 'down' ]">
              <!-- <span>{{ this.$parent.compareDate }}</span> -->
              <img v-if="rateRatio.memberPayAmountRate < 0" src="@/assets/icon/downArrow@2x.png" class="arrows">
              <img v-if="rateRatio.memberPayAmountRate > 0" src="@/assets/icon/upArrow@2x.png" class="arrows">
              <!-- <span v-if="rateRatio.memberPayAmountRate !== 0"> {{ Math.abs(rateRatio.memberPayAmountRate) + '%' }}</span> -->
              <span v-if="rateRatio.memberPayAmountRate > 0" style="color:hsl(150deg 53% 58%)"> {{ Math.abs(rateRatio.memberPayAmountRate) + '%' }}</span>
              <span v-if="rateRatio.memberPayAmountRate < 0" style="color:hsl(0deg 100% 70%)"> {{ Math.abs(rateRatio.memberPayAmountRate) + '%' }}</span>
              <span v-if="rateRatio.memberPayAmountRate === 0"> - </span>
            </div>
          </div>

          <div
            id="memberPayOrder"
            :class="['card-item', curSelected === 5 ? 'active' : '']"
            @click="switchCards(5,$event)"
          >
            <p class="week-txt">{{$t('dataAnalysis.numberOfMemberPaidOrders')}}</p>
            <p class="strong-num">{{ this.$parent.memberPayOrder }}</p>
            <div :class="['rise-fall-rate', indexSwitch === 5 ? 'rise' : 'down' ]">
              <!-- <span>{{ this.$parent.compareDate }}</span> -->
              <img v-if="rateRatio.memberPayOrderRate < 0" src="@/assets/icon/downArrow@2x.png" class="arrows">
              <img v-if="rateRatio.memberPayOrderRate > 0" src="@/assets/icon/upArrow@2x.png" class="arrows">
              <!-- <span v-if="rateRatio.memberPayOrderRate !== 0"> {{ Math.abs(rateRatio.memberPayOrderRate) + '%' }}</span> -->
              <span v-if="rateRatio.memberPayOrderRate > 0" style="color:hsl(150deg 53% 58%)"> {{ Math.abs(rateRatio.memberPayOrderRate) + '%' }}</span>
              <span v-if="rateRatio.memberPayOrderRate < 0" style="color:hsl(0deg 100% 70%)"> {{ Math.abs(rateRatio.memberPayOrderRate) + '%' }}</span>
              <span v-if="rateRatio.memberPayOrderRate === 0"> - </span>
            </div>
          </div>

          <div
            id="memberSingleAmount"
            :class="['card-item', curSelected === 6 ? 'active' : '']"
            @click="switchCards(6,$event)"
          >
            <p class="week-txt">{{$t('dataAnalysis.memberCustomerUnitPrice')}}</p>
            <p class="strong-num">{{ this.$parent.memberSingleAmount }}</p>
            <div :class="['rise-fall-rate', indexSwitch === 6 ? 'rise' : 'down' ]">
              <!-- <span>{{ this.$parent.compareDate }}</span> -->
              <img v-if="rateRatio.memberSingleAmountRate < 0" src="@/assets/icon/downArrow@2x.png" class="arrows">
              <img v-if="rateRatio.memberSingleAmountRate > 0" src="@/assets/icon/upArrow@2x.png" class="arrows">
              <!-- <span v-if="rateRatio.memberSingleAmountRate !== 0"> {{ Math.abs(rateRatio.memberSingleAmountRate) + '%' }}</span> -->
              <span v-if="rateRatio.memberSingleAmountRate > 0" style="color:hsl(150deg 53% 58%)"> {{ Math.abs(rateRatio.memberSingleAmountRate) + '%' }}</span>
              <span v-if="rateRatio.memberSingleAmountRate < 0" style="color:hsl(0deg 100% 70%)"> {{ Math.abs(rateRatio.memberSingleAmountRate) + '%' }}</span>
              <span v-if="rateRatio.memberSingleAmountRate === 0"> - </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cardInfo: [{
        txt: this.$t('dataAnalysis.totalMembership'),
        num: 2085,
        riseOfFallRate: '13.8%',
        isRise: true // 是否上升
      }],
      rateRatio: {
        couponMemberRate: 0,
        memberPayAmountRate: 0.00,
        memberPayOrderRate: 0.00,
        memberSingleAmountRate: 0,
        newMemberRate: 0,
        payMemberRate: 0,
        totalMemberRate: 0
      },
      curSelected: 0,
      indexSwitch: 0,
      isMove: false, // 当内容宽度大于盒子宽度，isMove为true，反之为false

      screenWidth: '' // 屏幕宽度
    }
  },
  watch: {
    // 内容里的数据改变，重新判断内容和盒子大小比较
    rateRatio () {
      this.judgeSize()
    },
    // 窗口变化，重新判断内容和盒子大小比较
    screenWidth () {
      this.judgeSize()
    }
  },

  mounted () {
    this.curSelected = 0
    // console.log(333)
    // console.log(this.rateRatio)
    var ele = document.getElementsByClassName('week-txt')
    for (var j = 0, len = ele.length; j < len; j++) {
      this.$parent.oneEchartAllName.push(ele[j].innerText)
    }
    // 监听游览器窗口变化
    const that = this
    window.addEventListener('resize', function () {
      that.screenWidth = document.body.offsetWidth
    })
    this.judgeSize()
  },

  methods: {
    /**
     * 选择卡片
     */
    switchCards: function (index, e) {
      this.curSelected = index
      this.indexSwitch = index
      this.$parent.oneEchartCurrentName = e.currentTarget.getElementsByClassName('week-txt')[0].innerText
      this.$parent.updateOneEchart(this.$parent.dataList, index)
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
    },

    // 左箭头
    prevPart () {
      if (this.isMove === true) {
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
      if (this.isMove === true) {
        if (this.$refs.content.style.right !== '0px') {
          this.$refs.content.style.right = '0px'
          this.$refs.content.style.left = ''
          this.$refs.prev.style.cursor = 'pointer'
          this.$refs.next.style.cursor = 'not-allowed'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.membership-overview.membership-overview-card {
  .card-swiper-box {
    position: relative;
    display: block;
    width: 100%;
    padding: 0 40px;
    font-size: 14px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    p {
      margin: 0;
    }

    // 左右滑动操作箭头
    .slide-left-arrow,
    .slide-right-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      display: block;
      width: 25px;
      height: 25px;
    }
    .slide-left-arrow img,
    .slide-right-arrow img {
      display: block;
      width: 100%;
      height: 100%;
    }
    .slide-left-arrow {
      left: 0;
    }
    .slide-right-arrow {
      right: 0;
    }
    .slide-left-arrow.enable,
    .slide-right-arrow.enable {
      cursor: pointer;
    }
    .slide-left-arrow.disable,
    .slide-right-arrow.disable {
      cursor: not-allowed;
    }
    .slide-left-arrow:hover,
    .slide-right-arrow:hover {
      opacity: 0.8;
    }

    // 列表
    .card-box {
      position: relative;
      height: 125px;
      margin: 20px 0;
      overflow: hidden;
      .card-list {
        position: absolute;
        .card-item {
          display: inline-block;
          margin-right: 20px;
          width: 200px;
          border: 1px solid #EAF0F4;
          border-radius: 4px;
          padding: 20px;
          box-sizing: border-box;
          cursor: pointer;
          .week-txt {
            color: #666;
            padding-bottom: 10px;
          }
          .strong-num {
            font-size: 20px;
            font-weight: bold;
            padding-bottom: 10px;
          }
          .rise-fall-rate {
            span {
              font-size: 12px;
            }
            .arrows {
              display: inline-block;
              width: 8px;
              height: 10px;
              margin: 0 4px 0 12px;
            }
          }
          .rise-fall-rate.rise {
            span {
              color: #3CC480;
            }
          }
          .rise-fall-rate.down {
            span {
              color: #FF4141;
            }
          }
        }
        .card-item.active {
          border-color: #02A1E9;
          background: #f5faff;
        }
      }
    }

  }
}
</style>
