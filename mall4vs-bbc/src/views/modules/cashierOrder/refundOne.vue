<template>
  <div class="container">
    <div class="title">退款</div>
    <div class="refundOne" v-if="!refundTwoStatus">
      <el-table :data="prodInfo" style="width: 100%">
        <el-table-column width="60">
          <template slot-scope="scope">
            <el-radio v-model="currentFactor" :label="scope.row">{{
              ""
            }}</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="商品信息" minWidth="250">
          <template slot-scope="scope">
            <prod-pic
              height="60"
              width="60"
              :pic="scope.row.pic"
              style="display: inline-block"
            />
            <span style="margin-left: 10px">{{ scope.row.prodName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格 (元)"
          minWidth="100"
          :formatter="rounding"
        >
        </el-table-column>
        <el-table-column prop="prodCount" label="退款数量" align="center" minWidth="120">
          <template slot-scope="scope">
            <el-input-number
              size="mini"
              @change="handleChange"
              :min="1"
              :max="scope.row.prodCount"
              v-model="scope.row.refundNum"
            ></el-input-number>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部按钮 -->
      <div class="btnBox">
        <span @click="cancel">取消</span>
        <span class="closeOrder" @click="refundNext(1)">整单退款</span>
        <span class="closeOrder" @click="refundNext(2)">下一步</span>
      </div>
    </div>

    <!-- 下一个页面 -->
    <RefundTwo
      v-else
      @refundStatus="receiveStatus"
      @refundTwoStatus="refundTwoStatusFn"
      @clearList="clearListFn"
      :refundList="refundList"
      :otherData="otherData"
    />
  </div>
</template>

<script>
import ProdPic from "@/components/prod-pic";
import RefundTwo from "./refundTwo.vue";
export default {
  props: ["tableData", "otherData"],
  components: {
    ProdPic,
    RefundTwo,
  },
  data() {
    return {
      // 所有退款商品的主要信息
      prodInfo: "",
      // 当前选择单个退货的商品信息
      currentFactor: "",
      // 将要传递的退款清单
      refundList: "",
      // 退款详情页状态管理
      refundTwoStatus: false,
    };
  },
  created() {
    console.log(this.tableData, "tableData");
    this.prodInfo = this.tableData.map((item) => ({
      prodName: item.prodName,
      prodId: item.prodId,
      pic: item.pic,
      price: item.price,
      prodCount: item.prodCount,
      refundNum: 1,
      orderItemId: item.orderItemId
    }));
  },
  methods: {
    // 更改数量
    handleChange(val) {
      console.log(val);
    },
    // 格式化金额
    rounding(row, column) {
      return parseFloat(row[column.property]).toFixed(2);
    },
    cancel() {
      this.$emit("refundStatus", false);
    },
    receiveStatus(val) {
      this.cancel();
    },
    // 关闭refundTwo
    refundTwoStatusFn(val) {
      this.refundTwoStatus = val;
    },
    // 判断是整单退款还是单个商品退款
    refundNext(type) {
      // 整单退款
      if (type === 1) {
        this.currentFactor = ''
        this.otherData.refundType = 1;
        this.prodInfo = this.tableData.map((item) => ({
          prodName: item.prodName,
          prodId: item.prodId,
          pic: item.pic,
          price: item.price,
          prodCount: item.prodCount,
          refundNum: item.prodCount,
        }));
        this.refundList = this.prodInfo;
      }
      // 单件退款
      else if (type === 2) {
        this.otherData.refundType = 2;
        if (this.currentFactor === "") {
          this.$message({
            message: "请选择要退货商品!",
            type: "error",
            duration: 2000,
          });
          return;
        }
        this.refundList = [this.currentFactor];
      }

      this.refundTwoStatus = true;
    },
    clearListFn() {},
  },
};
</script>

<style lang="scss" scoped>
.container {
  .title {
    display: flex;
    height: 60px;
    padding-left: 20px;
    line-height: 60px;
    font-size: 18px;
    border: 1px solid #efefef;
    border-left: none;
  }

  .el-radio__input .el-radio__inner {
    width: 18px;
    height: 18px;
  }

  .el-radio__input.is-checked .el-radio__inner {
    background-color: #835cf6;
    border-color: #835cf6;
    width: 18px;
    height: 18px;
  }

  .btnBox {
    height: 100px;
    position: absolute;
    bottom: -20px;
    right: 40px;
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
      transition: border-color 200ms 0ms ease;
      transition: color 200ms 0ms ease;
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
      transition: background-color 320ms 0ms ease;
    }
  }
}
</style>
