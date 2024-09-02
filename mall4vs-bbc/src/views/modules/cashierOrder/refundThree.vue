<template>
  <div class="container">
    <div>
      <div
        :class="refundWayNum == 0 ? 'box-active' : 'box'"
        @click="refundWayChange(0)"
      >
        <p class="way">原路退款</p>
        <p class="des">与客户协商一致，原路退款给客户</p>
      </div>
      <div
        :class="refundWayNum == 1 ? 'box-active' : 'box'"
        @click="refundWayChange(1)"
      >
        <p class="way">线下退款</p>
        <p class="des">与客户协商一致, 在线下以支付宝或微信等形式退款给客户</p>
      </div>
      <div
        :class="refundWayNum == 2 ? 'box-active' : 'box'"
        @click="refundWayChange(2)"
      >
        <p class="way">现金退款</p>
        <p class="des">与客户协商一致, 以现金的形式退款给客户</p>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="btnBox">
      <span @click="cancel">取消</span>
      <span class="closeOrder" @click="refundPrev">上一步</span>
      <span class="closeOrder" @click="confirm">确认退款</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["refundInfo", "otherData"],
  data() {
    return {
      refundWayNum: 0,
      refundWay: ["原路退款", "线下退款", "现金退款"],
    };
  },
  mounted() {},
  methods: {
    refundWayChange(refundWayNum) {
      this.refundWayNum = refundWayNum;
      console.log(this.refundWay[this.refundWayNum]);
    },
    // 先传给父亲组件 再传给爷爷组件 返回到初始页面
    cancel() {
      this.$emit("refundStatus", false);
    },
    // 返回上一个组件
    refundPrev() {
      this.$emit("refundThreeStatus", false);
    },
    // 确认退款
    confirm() {
      let requestData = {
        orderNumber: this.otherData.orderNumber, // 订单编号
        isReceiver: 1, // 货物状态(1:已收到货 :未收到货)
        buyerReason: this.refundInfo.refundExplain, // 退款说明
        goodsNum:
          this.otherData.refundType === 1 ? 0 : this.refundInfo.refundNum, // 退款数量(0或不传值则为全部数量)
        refundAmount: this.refundInfo.refundPrice - 0, // 退款金额
        buyerMobile: this.otherData.userMobile, // 手机号码(默认当前订单手机号码)
        buyerDesc: "", // 备注说明
        photoFiles: "", // 凭证图片列表
        refundWay: this.refundWay[this.refundWayNum],
        applyType: 1, // 退款方式(1:仅退款 2退款退货)
        refundType: this.otherData.refundType, // 退款单类型(1:整单退款,2:单个物品退款)
        orderItemId: this.refundInfo.refundItems[0].orderItemId, //商品id
        userId: this.otherData.userId, //用户id
        giveawayItemIds: [], // 赠品ids
      };
      this.$http({
        url: this.$http.adornUrl("/multishop/orderRefund/apply"),
        method: "POST",
        data: this.$http.adornData(requestData),
      }).then(({ data }) => {
        this.$alert("退款申请已提交，请稍后与客户确认是否退款成功！", "提示", {
          confirmButtonText: "确定",
          callback: (action) => {},
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  .btnBox {
    float: right;
    height: 100px;
    display: flex;
    align-items: center;
    z-index: 999;

    span {
      display: flex;
      width: 90px;
      height: 40px;
      margin-left: 10px;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      border: 1px solid #000;
      cursor: pointer;
      background-color: #fff;
    }

    span:hover {
      color: #835cf6;
      border: 2px solid #000;
      border-color: #835cf6;
      transition: border-color 320ms 0ms ease;
      transition: color 320ms 0ms ease;
    }

    .closeOrder {
      color: #fff;
      background-color: #835cf6;
      border: 1px solid #835cf6;
      transition: background-color 320ms 0ms ease;
    }

    .closeOrder:hover {
      color: #fff;
      background-color: #b6a2f2;
      border-color: #b6a2f2;
      transition: background-color 320ms 0ms ease;
      transition: border-color 320ms 0ms ease;
    }
  }

  .box,
  .box-active {
    width: 95%;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    border-radius: 6px;
    border: 1px solid #e7e7e7;
    margin: 0px auto;
    margin-top: 20px;
    cursor: pointer;

    .way {
      font-weight: bold;
      font-size: 16px;
    }

    .des {
      margin-top: -10px;
      color: #999;
    }
  }

  .box-active {
    border: 1px solid #835cf6;
    background-color: #f2eefe;
  }
}
</style>
