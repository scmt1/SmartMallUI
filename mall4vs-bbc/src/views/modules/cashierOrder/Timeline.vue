<template>
  <div class="m-timeline-area" :style="`width: ${width}px`">
    <div class="m-timeline">
      <div
        :class="[
          'm-timeline-item',
          { last: index === timelineDesc.length - 1 },
        ]"
        v-for="(time, index) in timelineDesc"
        :key="index"
      >
        <div class="u-tail"></div>
        <div class="u-dot">
          <div class="u-dot2"></div>
        </div>
        <div class="u-tail2"></div>
        <div class="u-content">买家【{{nickName}}】{{ timeText[index] }}</div>
        <div class="u-content2">{{ time }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Timeline",
  props: {
    width: {
      // 时间轴区域总宽度
      type: Number,
      default: 360,
    },
    timelineDesc: {
      type: Array,
      default: [],
    },
    nickName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      //时间提示
      timeText: ["下单了", "取消了订单", "支付了订单", "完成了订单"],
    };
  },
  mounted() {
  },
  methods: {
  },
};
</script>
<style lang="scss" scoped>
.m-timeline-area {
  margin: 0 auto;

  .m-timeline {
    .m-timeline-item {
      position: relative;
      padding-bottom: 30px;

      .u-tail {
        position: absolute;
        top: 15px;
        left: 8px;
        height: calc(100% - 13px);
        border-left: 2px solid #c0adfa; // 实线
        // border-left: 2px dotted #e8e8e8; // 点线
        // border-left: 2px dashed #e8e8e8; // 虚线
      }

      .u-tail2 {
        position: absolute;
        top: 17px;
        left: 8px;
        height: 50px;
        border-left: 2px solid #c0adfa; // 实线
        // border-left: 2px dotted #e8e8e8; // 点线
        // border-left: 2px dashed #e8e8e8; // 虚线
      }

      .u-dot {
        position: absolute;
        width: 18px;
        height: 18px;
        border: 2px solid #835cf6;
        border-radius: 50%;
        background-color: #835cf6;
        display: flex;
        justify-content: center;
        align-items: center;

        .u-dot2 {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #fff;
        }
      }

      .u-content {
        position: relative;
        top: -3px;
        margin-left: 35px;
        word-break: break-all;
        word-wrap: break-word;
        line-height: 24px;
        font-size: 16px;
      }

      .u-content2 {
        position: relative;
        bottom: 26px;
        right: 190px;
        margin-left: 25px;
        word-break: break-all;
        word-wrap: break-word;
        line-height: 24px;
        font-size: 16px;
      }
    }

    .last {
      .u-tail {
        display: none;
      }
    }
  }
}
</style>
