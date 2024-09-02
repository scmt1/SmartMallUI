<template>
  <!-- 支付方式 -->
  <div class="payWay">
    <div class="pay-type">
      <div
        :class="payMethod == 0 ? 'type-item-active' : 'type-item'"
        @click.stop="payTypeChange(0)"
      >
        <div class="icon-img">
          <img src="../../../assets/img/cashier/icon-scan-zs.png" />
        </div>
        <div class="name">店铺收款码</div>
        <div v-if="payMethod == 0">
          <div class="xuanzhong"></div>
          <img
            class="xz-img"
            src="../../../assets/img/cashier/icon-select.png"
          />
        </div>
      </div>
      <div
        :class="payMethod == 1 ? 'type-item-active' : 'type-item'"
        @click.stop="payTypeChange(1)"
      >
        <div class="icon-img">
          <img src="../../../assets/img/cashier/icon-scan-bs.png" />
        </div>
        <div class="name">扫码支付</div>
        <div v-if="payMethod == 1">
          <div class="xuanzhong"></div>
          <img
            class="xz-img"
            src="../../../assets/img/cashier/icon-select.png"
          />
        </div>
      </div>
      <div
        :class="payMethod == 2 ? 'type-item-active' : 'type-item'"
        @click.stop="payTypeChange(2)"
      >
        <div class="icon-img">
          <img src="../../../assets/img/cashier/icon-cashPay.png" />
        </div>
        <div class="name">现金支付</div>
        <div v-if="payMethod == 2">
          <div class="xuanzhong"></div>
          <img
            class="xz-img"
            src="../../../assets/img/cashier/icon-select.png"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      payType: 0,
      payMethod:0,
      wayCode:''
    };
  },
  methods: {
     // 支付方式改变
     payTypeChange(num) {
      this.payMethod = num;
      if (num === 0) {
        this.payType = "店铺收款码";
      } else if (num === 1) {
        this.payType = "扫码支付";
      } else if (num === 2) {
        this.payType = "现金支付";
      }
      // 返回上一个组件付款方式
      this.$emit("getPayType", this.payType);
    },
    

  },
};
</script>

<style lang="scss">
.payWay {
  .pay-type {
    display: flex;
    justify-content: space-around;

    .type-item,
    .type-item-active {
      width: 190px;
      height: 60px;
      border: 1px solid #e7e7e7;
      padding: 15px 10px;
      display: flex;
      align-items: center;
      position: relative;
      cursor: pointer;

      //选中的样式
      .xuanzhong {
        position: absolute;
        display: block;
        right: -3px;
        bottom: -13px;
        width: 0;
        height: 0;
        border-top: 20px solid transparent;
        border-bottom: 20px solid transparent;
        border-left: 20px solid #8558fa;
        transform: rotate(45deg);
      }

      .xz-img {
        width: 18px;
        height: 18px;
        position: absolute;
        right: -11px;
        bottom: 0px;
      }

      img {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }

      .pay-icon {
        color: #fff;
        background: #f0f0f0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        border-radius: 5px;
      }

      .name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .iconfont[data-v-3a35420a] {
        color: #8558fa;
        font-size: 30px;
        margin-right: 1px;
      }

      
    }

    .type-item-active {
      border-color: #8558fa;
    }
  }
}
</style>
