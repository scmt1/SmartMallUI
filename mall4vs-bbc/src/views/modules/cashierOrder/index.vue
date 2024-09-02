<template>
  <div class="cashier-order" id="cashierOrder">
    <!-- 左侧订单管理 -->
    <div class="order-management">
      <div class="title">
        <span>订单管理</span>
        <span class="dot1"></span>
        <span class="dot2"></span>
        <span class="dot3"></span>
      </div>
      <div class="serach">
        <el-input
          v-model="searchText"
          placeholder="搜索订单号/手机号/买家"
          style="width: 82%"
        >
        </el-input>
        <el-button @click="search" class="myBtn">搜索</el-button>
      </div>
      <div class="type">
        <span
          :class="index == isTypeActive ? 'type-item' : 'type-item-active'"
          v-for="(item, index) in typeButton"
          :key="index"
          @click="chooseType(index)"
        >
          {{ item.title }}
        </span>
      </div>
      <div class="order-list" :style="{ height: boxHeight - 450 + 'px' }">
        <div
          v-for="(item, index) in orderList"
          :key="index"
          @click="chooseOrder(index)"
          :class="
            index == isOrderActive
              ? 'order-list-item-active'
              : 'order-list-item'
          "
        >
          <div class="header">
            <span class="code">订单编号:{{ item.orderNumber }}</span>
            <span class="consume">消费</span>
          </div>
          <div class="footer">
            <span class="pay-status"
              >支付状态：{{ payStatus[item.isPayed] }}</span
            >
            <span class="pay-receiverName">买家：{{ item.receiverName }}</span>
            <span class="pay-total"
              >实付金额：<a>￥{{ item.total.toFixed(2) }}</a></span
            >
          </div>
        </div>
        <div
          class="noData"
          v-if="orderList == ''"
          :style="{ height: boxHeight - 450 + 'px' }"
        >
          暂无数据
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          layout="prev, pager, next,jumper"
          :total="page.total"
          :pager-count="5"
          :current-page="page.currentPage"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 右侧订单详情页面 -->
    <div class="order-details" v-if="!refundStatus">
      <!-- 页面切换按钮 -->
      <div class="title">订单详情</div>
      <div class="tab">
        <el-tabs
          v-model="activeName"
          type="border-card"
          @tab-click="handleClick"
        >
          <el-tab-pane name="first">
            <span slot="label" class="fontClass">基础信息</span>
            <div class="first-content">
              <BasicInfo :orderItem="orderItem"></BasicInfo>
            </div>
          </el-tab-pane>

          <el-tab-pane name="second">
            <span slot="label" class="fontClass">商品信息</span>
            <div class="second-content">
              <el-table :data="tableData" style="width: 99%">
                <el-table-column label="商品信息" maxWidth="300" minWidth="100">
                  <template slot-scope="scope">
                    <prod-pic
                      height="60"
                      width="60"
                      :pic="scope.row.pic"
                      style="display: inline-block"
                    />
                    <span style="margin-left: 10px">{{
                      scope.row.prodName
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="price"
                  label="价格"
                  maxWidth="100"
                  minWidth="50"
                  :formatter="rounding"
                >
                </el-table-column>
                <el-table-column
                  prop="prodCount"
                  label="数量"
                  maxWidth="100"
                  minWidth="50"
                >
                </el-table-column>
                <el-table-column
                  prop="productTotalAmount"
                  label="小计 (元)"
                  align="right"
                  maxWidth="50"
                  minWidth="20"
                  :formatter="rounding"
                >
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>

          <el-tab-pane name="third">
            <span slot="label" class="fontClass">订单日志</span>
            <div class="third-content">
              <Timeline
                :timelineDesc="timelineDesc"
                :nickName="nickName"
                :width="480"
                style="margin: 30px 0 0 200px"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 底部按钮 -->
      <div class="btnBox">
        <span
          class="closeOrder"
          v-if="orderItem.isPayed == 0"
          @click="payDialogVisible = true"
          >付款</span
        >
        <span type="text" @click="remarksDialogVisible = true">备注</span>
        <span v-if="orderItem.isPayed == 1" @click="openRefund">退款</span>
        <span>打印小票</span>
      </div>
    </div>

    <!-- 退款页面 -->
    <RefundOne
      v-else
      class="refund"
      :tableData="tableData"
      :otherData="otherData"
      @refundStatus="receiveStatusFn"
    ></RefundOne>

    <!-- 支付弹出框 -->
    <el-dialog
      title="请选择支付方式"
      :visible.sync="payDialogVisible"
      width="650px"
    >
      <PayWay @getPayType="getPayTypeFn"></PayWay>
      <span slot="footer">
        <el-button @click="payDialogVisible = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="confirmPay" size="small" class="myBtn"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!--条码录入框-->
    <payCodeModal ref="payCodeModal" @confirmEvent="confirmSendPay" />

    <!-- 备注弹出框 -->
    <el-dialog
      title="备注"
      :visible.sync="remarksDialogVisible"
      width="30%"
      style="margin-top: -80px"
    >
      <el-input
        type="textarea"
        placeholder="输入请不多于200字"
        :rows="10"
        maxlength="200"
        resize="none"
        v-model="buyerDesc"
      ></el-input>
      <span slot="footer">
        <el-button @click="remarksDialogVisible = false" size="small"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="saveBuyerDesc"
          size="small"
          class="myBtn"
          >保 存</el-button
        >
      </span>
    </el-dialog>

    <!-- 切换按钮 -->
    <div class="changeBtn">
      <el-button
        type="primary"
        class="change myBtn"
        size="small"
        @click="fullScreenChange"
        v-if="!fullScreenShow"
        >全屏
      </el-button>

      <el-button
        type="primary"
        class="change myBtn"
        size="small"
        @click="closefullScreen"
        v-if="fullScreenShow"
        >关闭全屏
      </el-button>

      <el-button
        type="primary"
        class="change myBtn"
        size="small"
        @click="gotSockInquire"
        >库存
      </el-button>
      <el-button
        type="primary"
        class="change myBtn"
        size="small"
        @click="goBillingCashier"
        >开单
      </el-button>
      <el-button
        type="primary"
        class="change myBtn"
        size="small"
        @click="lockScreen"
        >锁屏
      </el-button>
    </div>
  </div>
</template>

<script>
import ProdPic from "@/components/prod-pic";
import Timeline from "./Timeline.vue";
import BasicInfo from "./basicInfo.vue";
import PayWay from "./payWay.vue";
import RefundOne from "./refundOne.vue";
import payCodeModal from "./payCodeModal.vue";

export default {
  components: {
    ProdPic,
    Timeline,
    BasicInfo,
    PayWay,
    RefundOne,
    payCodeModal,
  },
  data() {
    return {
      // 搜索关键字
      searchText: "",
      // 选中的订单分类项
      isTypeActive: 0,
      // 选中的订单列表项
      isOrderActive: 0,
      // 分页信息
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 5,
      },
      // 节流
      isLoading: false,
      // 订单分类
      typeButton: [
        {
          title: "收银订单",
          value: 5,
        },
        {
          title: "商城订单",
          value: 0,
        },
      ],
      // 所有订单列表
      orderList: [],
      // 选中的订单信息
      orderItem: "",
      // 订单状态
      orderStatus: [
        "待付款",
        "待发货",
        "待收货",
        "待评价",
        "成功",
        "失败",
        "待成团",
      ],
      // 支付状态
      payStatus: ["未支付", "已支付"],
      // 激活的tab栏
      activeName: "first",
      // 弹出框状态管理
      payDialogVisible: false,
      remarksDialogVisible: false,
      //备注
      buyerDesc: "",
      // 商品信息
      tableData: [],
      //其他重要信息
      otherData: "",
      // 退款页面状态管理
      refundStatus: false,
      // 时间轴
      timelineDesc: [],
      nickName: "",
      fullScreenShow: false,
      boxHeight: 0,
      payCodeModalShow: false,
      payType: "",
      // 订单等待
      confirmLoading:""
    };
  },
  mounted() {
    this.getOrderList();
    this.boxHeight = document.body.clientHeight - 270;
  },
  methods: {
    // 选择订单类型
    chooseType(index) {
      this.isTypeActive = index;
      this.page.currentPage = 1;
      this.getOrderList();
    },
    // 选择单个订单
    chooseOrder(index) {
      this.isOrderActive = index;
      this.orderItem = this.orderList[this.isOrderActive];
      this.tableData = this.orderItem.orderItems;
      this.refundStatus = false;
      //获取当前时间轴
      this.getDataList();
    },
    // 选择tab栏
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 获取订单列表
    getOrderList() {
      const theData = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        searchKey: this.searchText,
        shopOrderType: this.typeButton[this.isTypeActive].value,
      };
      this.$http({
        url: this.$http.adornUrl("/order/order/page"),
        method: "get",
        params: theData,
      }).then(({ data }) => {
        this.orderList = data.records;
        if (this.orderList.length == 0) {
          this.orderItem = "";
        } else {
          this.orderItem = this.orderList[0];
          // 获取当前时间轴
          this.getDataList();
        }
        this.tableData = this.orderItem?.orderItems;
        this.isOrderActive = 0;
        console.log(data.total, "0000");
        this.page.total = data.total;
      });
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.getOrderList();
    },
    // 搜索
    search() {
      this.getOrderList();
      this.timelineDesc = "";
    },
    // 格式化金额
    rounding(row, column) {
      return parseFloat(row[column.property]).toFixed(2);
    },
    // 打开退款页面
    openRefund() {
      this.refundStatus = !this.refundStatus;
    },
    // 回传关闭
    receiveStatusFn(val) {
      this.refundStatus = val;
    },
    // 屏幕全屏切换
    fullScreenChange() {
      // 开启全屏并防止报错
      const full = document.getElementById("cashierOrder");
      if (full.RequestFullScreen) {
        full.RequestFullScreen();
        // 兼容Firefox
      } else if (full.mozRequestFullScreen) {
        full.mozRequestFullScreen();
        // 兼容Chrome, Safari and Opera等
      } else if (full.webkitRequestFullScreen) {
        full.webkitRequestFullScreen();
        // 兼容IE/Edge
      } else if (full.msRequestFullscreen) {
        full.msRequestFullscreen();
      }
      this.fullScreenShow = true;
    },
    // 关闭全屏
    closefullScreen() {
      this.fullScreenShow = false;
      document.exitFullscreen();
    },
    gotSockInquire() {
      this.$router.push("/stock-inquire");
    },
    goBillingCashier() {
      this.$router.push("/billingCashier-billingCashier");
    },
    // 锁屏
    lockScreen() {
      this.$router.push("/login");
    },
    // 获取单个订单的数据
    getDataList() {
      this.timelineDesc = [];
      this.$http({
        url: this.$http.adornUrl(
          `/order/delivery/orderInfo/${this.orderItem.orderNumber}`
        ),
        method: "get",
        params: this.$http.adornParams(),
      }).then(({ data }) => {
        const {
          createTime,
          cancelTime,
          finallyTime,
          payTime,
          nickName,
          userId,
          userMobile,
          orderNumber,
        } = data;

        //传给下面组件的订单主要信息
        this.otherData = {
          userId,
          userMobile,
          orderNumber,
          refundType: 0,
        };

        this.nickName = nickName;

        //获取时间轴
        this.timelineDesc.push(createTime);
        if (cancelTime != null) {
          this.timelineDesc.push(cancelTime);
        }
        if (payTime != null) {
          this.timelineDesc.push(payTime);
        }
        if (finallyTime != null) {
          this.timelineDesc.push(finallyTime);
        }
      });
    },
    // 保存备注
    saveBuyerDesc() {
      this.remarksDialogVisible = false;
    },
    // 接受付款类型
    getPayTypeFn(val) {
      this.payType = val;
    },
    // 确认支付方式
    confirmPay() {
      console.log(this.orderItem.orderNumber, "当前订单编号");
      if (this.payType == "店铺扫码支付") {
        // do sth
      } else if (this.payType == "扫码支付") {
        this.$refs.payCodeModal.init();
        this.confirmOrder();
      } else if (this.payType == "现金支付") {
        this.upDataOrderInfo();
      }
    },
    // 订单确认
    confirmOrder() {
      this.confirmLoading = true;
      this.$http({
        url: this.$http.adornUrl("/multishop/order/confirm"),
        method: "POST",
        data: this.$http.adornData({
          addrId: 0,
          couponIds: this.couponIds,
          couponUserIds: this.couponUserIds,
          dvyType: 3, // 配送类型 1:快递 2:自提 3：无需快递 4:同城配送
          isScorePay: this.isScorePay,
          userChangeCoupon: this.userChangeCoupon,
          userUseScore: this.isScorePay ? this.userUseScore : 0,
          userId: this.memberInfo.userId,
          isMall: 1,
        }),
      })
        .then(({ data }) => {
          console.log("confirm", data);
          this.confirmLoading = false;
          this.payShow = true;
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
    // 现金支付更新订单信息
    upDataOrderInfo() {
      let obj = {
        isScorePay: this.isScorePay,
        orderSelfStationDto: this.orderSelfStationDto,
        orderInvoiceList: null,
        virtualRemarkList: [],
        orderShopParams: [this.orderShopParam],
        userId: this.memberInfo.userId,
      };
      this.$http({
        url: this.$http.adornUrl("/multishop/order/submit"),
        method: "POST",
        data: this.$http.adornData(obj),
      })
        .then(({ data }) => {
          this.orderNumbers = data.orderNumbers;
          this.$http({
            url: this.$http.adornUrl(
              "/order/order/upDataOrderInfoByorderNumber"
            ),
            method: "get",
            params: this.$http.adornParams({
              orderNumber: this.orderNumbers,
            }),
          })
            .then(({ data }) => {
              this.cashLoading = false;
              this.$message({
                message: "提交成功！",
                type: "success",
                offset: 150,
              });
              this.wholeOrderCancel();
            })
            .finally(() => {
              this.cashLoading = false;
            });
        })
        .finally(() => {
          this.cashLoading = false;
        });
    },
  },
  // 监听是否是全屏 动态调整请求大小以填充页面
  watch: {
    fullScreenShow(val) {
      if (val === true) {
        this.page.pageSize = 7;
        this.boxHeight = this.boxHeight + 320;
      } else {
        this.page.pageSize = 5;
        this.boxHeight = this.boxHeight - 320;
      }
      this.getOrderList();
    },
  },
};
</script>

<style lang="scss">
.cashier-order {
  display: flex;
  width: 100%;
  position: relative;
  background: #fff;

  .myBtn {
    margin-left: 10px;
    background-color: #8558fa;
    border-color: #8558fa;
    color: #fff;
    transition: background-color 320ms 0ms ease;
  }

  .myBtn:hover {
    background-color: #b6a2f2;
    border-color: #b6a2f2;
    transition: background-color 320ms 0ms ease;
  }

  .changeBtn {
    height: 40px;
    position: absolute;
    top: 15px;
    right: 20px;
    display: flex;
    text-align: right;

    .change {
      height: 32px;
      display: flex;
      justify-content: center;
    }
  }

  a {
    text-decoration: none;
    outline: none;
    color: #000;
  }

  .order-management {
    flex: 3;
    border: 1px solid #efefef;
    position: relative;

    .title {
      display: flex;
      height: 60px;
      padding-left: 20px;
      line-height: 60px;
      font-size: 18px;
      border-bottom: 1px solid #efefef;
      position: relative;

      .dot1,
      .dot2,
      .dot3 {
        display: block;
        width: 6px;
        height: 6px;
        position: absolute;
        top: 26px;
        right: 50px;
        border-radius: 50%;
        background-color: #8558fa;
      }

      .dot2 {
        right: 40px;
      }

      .dot3 {
        right: 30px;
      }
    }

    .serach {
      display: flex;
      align-items: center;
      height: 65px;
      box-sizing: border-box;
      padding: 10px;
      border-bottom: 1px solid #efefef;

      .el-input__inner {
        background-color: #f5f5f5;
        color: #000;

        &::placeholder {
          color: gray;
          font-size: 14px;
        }
      }
    }

    .type {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      height: 55px;

      .type-item {
        display: flex;
        justify-content: center;
        width: 220px;
        height: 30px;
        line-height: 30px;
        border: 1px solid #835cf6;
        color: #835cf6;
        transition: color 300ms 0ms ease;
        transition: border-color 300ms 0ms ease;
        cursor: pointer;
      }

      .type-item-active {
        display: flex;
        justify-content: center;
        width: 220px;
        height: 30px;
        line-height: 30px;
        border: 1px solid #e6e6e6;
        cursor: pointer;
      }
    }

    .order-list {
      overflow: auto;

      .order-list-item,
      .order-list-item-active {
        display: flex;
        flex-direction: column;
        height: 120px;
        box-sizing: border-box;
        padding: 10px 15px;

        .header {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 16px;

          .consume {
            color: #835cf6;
          }
        }

        .footer {
          flex: 1;
          display: flex;
          align-items: center;

          .pay-status {
            width: 30%;
          }

          .pay-receiverName {
            //width: 80px;
            //margin-right: 20px;
            width: 32%;
          }

          .pay-total {
            width: 38%;
            //width: 150px;
            //margin-left: 50px;

            a {
              color: #fe2278;
              font-size: 18px;
            }
          }
        }
      }

      .order-list-item-active {
        background-color: #f3eefe;
      }

      .noData {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        color: #e6e6e6;
        height: 840px;
      }
    }

    .pagination {
      display: flex;
      height: 50px;
      align-items: center;
      justify-content: center;

      .el-pagination {
        text-align: center;
      }
    }
  }

  .order-details {
    flex: 7;
    border: 1px solid #efefef;
    border-left: none;

    .title {
      display: flex;
      height: 60px;
      padding-left: 20px;
      line-height: 60px;
      font-size: 18px;
      border-bottom: 1px solid #efefef;
    }

    .tab {
      .fontClass {
        font-size: 16px;
      }

      .el-tabs__item {
        height: 50px;
        line-height: 50px;
      }

      .el-tabs--border-card {
        border: 1px solid transparent;
        -webkit-box-shadow: none;
        box-shadow: none;
      }

      .first-content,
      .second-content,
      .third-content {
        max-height: 800px;

        .el-table::before {
          background-color: transparent;
        }
      }

      .first-content {
        box-sizing: border-box;

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
              width: 100px;
            }

            .info {
              width: 150px;
              margin-left: 15px;
            }
          }
        }
      }
    }
  }

  .refund {
    flex: 7;
  }

  .btnBox {
    float: right;
    height: 100px;
    display: flex;
    position: absolute;
    bottom: -20px;
    right: 40px;
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

  .el-dialog__wrapper {
    top: 20%;
  }
}
</style>
