<template>
  <div class="container">
    <div class="line">
      <div class="line-left">
        <span class="label">买家:</span>
        <span class="info">{{ orderItem.nickName }}</span>
      </div>
      <div class="line-right">
        <span class="label">卖家备注:</span>
        <span class="info">无</span>
      </div>
    </div>
    <div class="line">
      <div class="line-left">
        <span class="label">订单类型:</span>
        <span class="info">收银订单</span>
      </div>
      <div class="line-right">
        <span class="label">订单编号:</span>
        <span class="info">{{ orderItem.orderNumber }}</span>
      </div>
    </div>
    <div class="line">
      <div class="line-left">
        <span class="label">订单交易号:</span>
        <span class="info">{{ orderItem.orderId }}</span>
      </div>
      <div class="line-right">
        <span class="label">创建日期:</span>
        <span class="info">{{ orderItem.createTime }}</span>
      </div>
    </div>
    <div class="line">
      <div class="line-left">
        <span class="label">消费日期:</span>
        <span class="info">{{ orderItem.createTime }}</span>
      </div>
      <div class="line-right">
        <span class="label">支付状态:</span>
        <span class="info">{{ payStatus[orderItem.isPayed] }}</span>
      </div>
    </div>
    <div class="line">
      <div class="line-left">
        <span class="label">订单状态:</span>
        <span class="info">{{ orderStatus[orderItem.status - 1] }}</span>
      </div>
      <div class="line-right">
        <span class="label">付款方式:</span>
        <span class="info">{{
          orderItem.payType === null
            ? "商城支付"
            : payType[orderItem.payType - 1]
        }}</span>
      </div>
    </div>

    <div class="line">
      <div class="line-left">
        <span class="label">付款时间:</span>
        <span class="info">{{
          orderItem.payTime === null ? "--" : orderItem.payTime
        }}</span>
      </div>
      <div class="line-right">
        <span class="label">收银员:</span>
        <span class="info">无</span>
      </div>
    </div>

    <div class="line">
      <div class="line-left">
        <span class="label">商品总价:</span>
        <span class="info"
          >￥{{ orderItem.total == null ? "--" : orderItem.total.toFixed(2) }}
        </span>
      </div>
      <div class="line-right">
        <span class="label">店铺优惠:</span>
        <span class="info">{{
          orderItem.shopCouponAmount == null
            ? "--"
            : "-￥" + orderItem.shopCouponAmount.toFixed(2)
        }}</span>
      </div>
    </div>

    <div class="line">
      <div class="line-left">
        <span class="label">订单减免:</span>
        <span class="info">--</span>
      </div>
      <div class="line-right">
        <span class="label">优惠券:</span>
        <span class="info">{{
          orderItem.reduceAmount == null
            ? "--"
            : "-￥" + orderItem.reduceAmount.toFixed(2)
        }}</span>
      </div>
    </div>

    <div class="line">
      <div class="line-left">
        <span class="label">积分抵扣:</span>
        <span class="info">{{
          orderItem.scoreAmount == null
            ? "--"
            : "-￥" + orderItem.scoreAmount.toFixed(2)
        }}</span>
      </div>
      <div class="line-right">
        <span class="label">实付金额:</span>
        <span class="info"
          >￥{{
            orderItem.actualTotal == null
              ? "--"
              : orderItem.actualTotal.toFixed(2)
          }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "basicInfo",
  props: ["orderItem"],
  data() {
    return {
      //订单状态
      orderStatus: [
        "待付款",
        "待发货",
        "待收货",
        "待评价",
        "成功",
        "失败",
        "待成团",
      ],
      //支付状态
      payStatus: ["未支付", "已支付"],
      //支付方式
      payType: [
        "微信小程序支付",
        "支付宝支付",
        "微信扫码支付",
        "微信h5支付",
        "微信公众号支付",
        "支付宝H5支付",
        "支付宝APP支付",
        "微信APP支付",
        "余额支付",
        "",
        "聚合扫描支付",
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin: 40px 0 0 20px;
  display: inline-block;
  width: 100%;

  .line {
    display: flex;
    padding: 10px;

    .line-left,
    .line-right {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .label {
        display: inline-block;
        text-align: right;
        width: 120px;
      }

      .info {
        width: 150px;
        margin-left: 15px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
