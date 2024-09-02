<template>
  <div class="container">
    <div class="refundThree" v-if="!refundThreeStatus">
      <div class="header">
        <div class="refundItem">
          <div class="left">退款商品</div>
          <div class="right">
            <div class="item" v-for="(item, index) in refundList" :key="index">
              <prod-pic
                height="60"
                width="60"
                :pic="item.pic"
                style="display: inline-block"
              />
              <span
                >{{ item.prodName }}&nbsp;&nbsp;x&nbsp;&nbsp;{{
                  item.refundNum
                }}</span
              >
            </div>
          </div>
        </div>
        <div class="refundPrice">
          <div class="left">退款金额</div>
          <div class="right">
            <a style="font-size: 16px; color: #303133">￥ </a>
            <el-input
              placeholder="请输入金额"
              style="width: 12%"
              v-model="refundPrice"
            ></el-input>
            <span></span>
            <span class="canRefund"
              >可退金额：<a style="color: #f71776; font-weight: bold"
                >￥{{ totalPrice.toFixed(2) }}</a
              ></span
            >
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="left">退款原因</div>
        <div class="right">
          <el-input
            type="textarea"
            placeholder="请输入退款原因"
            :rows="3"
            style="width: 95%"
            maxlength="100"
            resize="none"
            v-model="refundExplain"
          ></el-input>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="btnBox">
        <span @click="cancel">取消</span>
        <span class="closeOrder" @click="refundPrev">上一步</span>
        <span class="closeOrder" @click="refundNext">下一步</span>
      </div>
    </div>

    <!-- 第三个页面 -->
    <RefundThree
      v-else
      @refundStatus="receiveStatus"
      @refundThreeStatus="refundThreeStatusFn"
      :refundInfo="refundInfo"
      :otherData="otherData"
    ></RefundThree>
  </div>
</template>

<script>
import ProdPic from "@/components/prod-pic";
import RefundThree from "./refundThree.vue";
export default {
  props: ["refundList", "refundNum", "otherData"],
  components: {
    ProdPic,
    RefundThree,
  },
  data() {
    return {
      refundThreeStatus: false,
      refundPrice: "",
      refundExplain: "",
      refundInfo: "",
    };
  },
  computed: {
    //退款商品总价
    totalPrice() {
      return this.refundList.reduce((a, b) => a + Number(b.price * b.refundNum), 0);
    },
  },
  mounted() {
    this.refundPrice = this.totalPrice.toFixed(2);
  },
  methods: {
    cancel() {
      this.$emit("refundStatus", false);
    },
    refundPrev() {
      this.$emit("refundTwoStatus", false);
      this.$emit("clearList", []);
    },
    // 打开第三个页面
    refundNext() {
      this.refundThreeStatus = true;
      const obj = {
        refundItems: this.refundList,
        refundNum: this.refundList[0].refundNum,
        refundPrice: this.refundPrice,
        refundExplain: this.refundExplain,
      };
      this.refundInfo = obj;
    },
    receiveStatus(val) {
      this.cancel();
    },
    refundThreeStatusFn(val) {
      this.refundThreeStatus = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
  .refundThree {
    .header {
      display: flex;
      flex-direction: column;
      background-color: #f6f6f6;

      .refundItem,
      .refundPrice {
        flex: 1;
        display: flex;

        .left {
          flex: 2;
          display: flex;
          justify-content: center;
        }

        .right {
          flex: 8;

          .item {
            margin-top: 20px;

            span {
              padding-left: 20px;
            }
          }
        }
      }

      .refundItem {
        .left {
          margin-top: 45px;
        }
      }

      .refundPrice {
        padding: 30px 0 20px 0;

        .left {
          align-items: center;
        }
        .canRefund {
          margin-left: 20px;
          color: gray;
        }
      }
    }

    .footer {
      margin-top: 20px;
      height: 100px;
      background-color: #f6f6f6;
      display: flex;
      align-items: center;

      .left {
        flex: 2;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .right {
        flex: 8;

        .el-input__inner:focus {
          border-color: red;
        }
      }
    }
  }
}
</style>
