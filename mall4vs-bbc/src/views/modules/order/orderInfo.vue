<template>
  <div class="detail-dialog">
    <!-- <el-dialog
      :title="
        !dataForm.orderNumber
          ? this.$i18n.t('crud.addTitle')
          : this.$i18n.t('order.orderDetail')
      "
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="80%"
    > -->
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{
          !dataForm.orderNumber
          ? this.$i18n.t('crud.addTitle')
          : this.$i18n.t('order.orderDetail')
        }}
      </div>
    </div>
      <el-form
        :model="dataForm"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        label-width="auto"
      >
        <div class="mod-order-orderInfo">
          <div class="content">
            <div class="order-number">
              <div class="number">
                <span class="text">{{ $t("order.number") }}:</span>
                {{ dataForm.orderNumber }}
              </div>
              <div class="time">
                <span class="text">{{ $t("order.createTime") }}:</span>
                {{ dataForm.createTime }}
              </div>
              <div class="type">
                {{
                  [
                    $t("order.normalOrder"),
                    $t("order.groupPurchaseOrder"),
                    $t("order.spikeOrder"),
                  ][dataForm.orderType]
                }}
              </div>
            </div>
            <div class="order-state">
              <div class="state-box">
                <div class="state">
                  {{
                    [
                      $t("order.waitingFosPayment"),
                      $t("order.waitiooShip"),
                      $t("order.waitingFeGoods"),
                      $t("order.waitingtion"),
                      $t("order.commoditful"),
                      $t("order.commodityFailed"),
                      $t("order.commodited"),
                    ][dataForm.status - 1]
                  }}
                </div>
                <div class="state-des">
                  <div v-if="dataForm.status === 1">
                    {{ $t("order.buyerDidNTime") }}
                  </div>
                  <div v-if="dataForm.status === 2">
                    {{ $t("order.buyPleF") }}
                  </div>
                  <div v-if="dataForm.status === 3 && dataForm.dvyType !== 2">
                    {{ $t("order.shelF") }}
                  </div>
                  <div v-if="dataForm.status === 3 && dataForm.dvyType === 2">
                    {{ $t("order.buyA") }}
                  </div>
                  <!-- <div v-if="dataForm.status === 4">订单已完成，等待买家发表评价。</div> -->
                  <div v-if="dataForm.status === 5">{{ $t("order.buyB") }}</div>
                  <div v-if="dataForm.status === 6">
                    {{ $t("order.orderCanc") }}
                  </div>
                  <div v-if="dataForm.status === 7">
                    {{ $t("order.outTimeCanOrd") }}
                  </div>
                </div>
                <div class="actions">
                  <div
                    class="item-btn default-btn"
                    v-if="dataForm.status <= 2 && dataForm.dvyType !== 2 && dataForm.orderMold !== 1"
                    @click="changeUserAddrOrder(dataForm.userAddrOrder)"
                  >{{$t("components.modifyUseAddress")}}</div>
                </div>
                <!-- <div class="actions">
                  <div class="item" v-if="dataForm.status === 1">
                    <div class="el-button--text">{{$t("temp.modify")}}价格</div>
                  </div>
                  <div class="item" v-if="dataForm.status === 2">
                    <div class="el-button--text">立即发货</div>
                    <div
                      class="item-btn"
                      @click="changeUserAddrOrder(dataForm.userAddrOrder)"
                    >{{$t("temp.modify")}}收货地址</div>
                  </div>
                 <div class="item" v-if="dataForm.status === 3">
                    <div class="el-button--text">延长收货</div>
                  </div>
                </div>-->
              </div>
              <div class="state-steps">
                <el-form-item>
                  <el-steps
                    :active="stepsStatus"
                    align-center
                    :process-status="dataForm.status == 6 ? 'error' : 'wait'"
                  >
                    <el-step
                      :title="this.$i18n.t('order.submitOrders')"
                      :description="dataForm.createTime"
                    ></el-step>
                    <el-step
                      :title="this.$i18n.t('order.theBuyerHasPaid')"
                      :description="dataForm.payTime"
                    ></el-step>
                    <el-step
                      :title="
                        dataForm.dvyType === 2
                          ? this.$i18n.t('order.buyerHasMentioned')
                          : this.$i18n.t('order.shippedBySeller')
                      "
                      :description="dataForm.dvyTime"
                    ></el-step>
                    <el-step
                      :title="this.$i18n.t('order.buyerHasReceived')"
                      :description="dataForm.finallyTime"
                    ></el-step>
                  </el-steps>
                </el-form-item>
              </div>
            </div>
            <div
              class="packages"
              v-if="
                dataForm.deliveryExpresses && dataForm.deliveryExpresses.length
              "
            >
              <div class="p-tab" v-if="dataForm.deliveryExpresses.length > 1">
                <div
                  :class="indexs === index ? 'item active' : 'item'"
                  @click="onClickListDelivery(deliveryExpresse, index)"
                  v-for="(
                    deliveryExpresse, index
                  ) in dataForm.deliveryExpresses"
                  :key="index"
                >
                  {{ $t("order.package") }}{{ index + 1 }}
                </div>
              </div>
              <div class="p-con" v-if="deliveryExpresse">
                <div class="deliver-msg">
                  <div class="d-item">
                    <div class="text" :style="$t('language') === 'English' ? 'width:210px;' : 'width:80px;'">{{ $t("order.delType") }}：</div>
                    <div class="res">
                      {{
                        [
                          this.$i18n.t("order.distribution"),
                          this.$i18n.t("order.selfMention"),
                          this.$i18n.t("order.noNeedRequired"),
                          this.$i18n.t("order.sameCityDelivery")
                        ][deliveryExpresse.deliveryType - 1] || [
                          this.$i18n.t("order.distribution"),
                          this.$i18n.t("order.selfMention"),
                          this.$i18n.t("order.noNeedRequired"),
                          this.$i18n.t("order.sameCityDelivery")
                        ][dataForm.dvyType - 1]
                      }}
                    </div>
                  </div>
                  <div class="d-item">
                    <div class="text" :style="$t('language') === 'English' ? 'width:210px;' : 'width:80px;'">{{ $t("order.deliveryTime") }}：</div>
                    <div class="res">{{ deliveryExpresse.createTime }}</div>
                  </div>
                  <div class="d-item" v-if="deliveryExpresse.deliveryType !== 3&&deliveryExpresse.deliveryType !== 4">
                    <div class="text" :style="$t('language') === 'English' ? 'width:210px;' : 'width:80px;'">{{ $t("order.courierCompany") }}：</div>
                    <div class="res">
                      {{ deliveryExpresse.deliveryDto.companyName }}
                    </div>
                  </div>
                  <div class="d-item" v-if="deliveryExpresse.deliveryType !== 3&&deliveryExpresse.deliveryType !== 4">
                    <div class="text" :style="$t('language') === 'English' ? 'width:210px;' : 'width:80px;'">{{ $t("order.waybillNumber") }}：</div>
                    <div class="res">
                      {{ deliveryExpresse.deliveryDto.dvyFlowId }}
                    </div>
                  </div>

                  <!-- <div class="d-goods over">
                    <div class="arrow-box">
                      <div class="arrow prev disable"></div>
                      <div class="arrow next"></div>
                    </div>
                    <div class="goods-box">
                      <div
                        class="item"
                        v-for="(orderItem,index) in deliveryExpresse.orderItems"
                        :key="index"
                      >
                        <div class="img">
                          <img :src="orderItem.pic" alt />
                        </div>
                        <div class="name">{{orderItem.prodName}}</div>
                        <div class="number">数量：{{orderItem.prodCount}}</div>
                      </div>
                    </div>
                  </div>-->

                  <div
                    class="d-goods"
                    :class="{ over: deliveryExpresse.orderItems.length > 5 }"
                  >
                    <div
                      class="arrow prev"
                      @click="prevItem"
                      :class="{
                        disable:
                          deliveryExpresse.orderItems.length - 5 <= 0 ||
                          this.offsetCount < 1,
                      }"
                    ></div>
                    <div
                      class="arrow next"
                      @click="nextItem"
                      :class="{
                        disable:
                          deliveryExpresse.orderItems.length - 5 <= 0 ||
                          this.offsetCount >=
                            deliveryExpresse.orderItems.length - 5,
                      }"
                    ></div>
                    <div class="item-goods">
                      <div class="goods-box" ref="carouser">
                        <div
                          class="item"
                          v-for="(
                            orderItem, index
                          ) in deliveryExpresse.orderItems"
                          :key="index"
                        >
                          <div class="img">
                            <!-- <img :src="orderItem.pic" alt /> -->
                            <prod-pic
                              :pic="orderItem.pic"
                            ></prod-pic>
                            <div class="number">×{{ orderItem.prodCount }}</div>
                          </div>
                          <div class="name">{{ orderItem.prodName }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="logistics">
                  <div
                    class="l-tit"
                    v-if="deliveryExpresse && deliveryExpresse.deliveryDto"
                  >
                    <span class="text"
                      >{{ $t("order.logisticsStatus") }}：</span
                    >
                    <span
                      class="l-state"
                      v-if="deliveryExpresse.deliveryDto.state === 0"
                      >{{ $t("order.noRecord") }}</span
                    >
                    <span
                      class="l-state"
                      v-if="deliveryExpresse.deliveryDto.state === 1"
                      >{{ $t("order.collected") }}</span
                    >
                    <span
                      class="l-state"
                      v-if="deliveryExpresse.deliveryDto.state === 2"
                      >{{ $t("order.delivering") }}</span
                    >
                    <span
                      class="l-state"
                      v-if="deliveryExpresse.deliveryDto.state === 3"
                      >{{ $t("order.haveBeenReceived") }}</span
                    >
                    <span
                      class="l-state"
                      v-if="deliveryExpresse.deliveryDto.state === 201"
                      >{{ $t("order.reachTheDestinationCity") }}</span
                    >
                    <span
                      class="l-state"
                      v-if="deliveryExpresse.deliveryDto.state === 4"
                      >{{ $t("order.problemPiece") }}</span
                    >
                  </div>
                  <div
                    class="logistics-box"
                    v-if="deliveryExpresse && deliveryExpresse.deliveryDto"
                  >
                    <div
                      class="item"
                      v-if="
                        deliveryExpresse.deliveryDto.state === 0 &&
                        dataForm.status == 5 &&
                        dataForm.finallyTime !== null
                      "
                    >
                      <div class="time">{{ dataForm.finallyTime }}</div>
                      <div class="text">
                        {{ $t("order.receivedGoods") }}
                      </div>
                    </div>
                    <div
                      class="item"
                      v-for="(trace, index) in deliveryExpresse.deliveryDto
                        .traces"
                      :key="index"
                    >
                      <div class="time">{{ trace.acceptTime }}</div>
                      <div class="text">{{ trace.acceptStation }}</div>
                    </div>
                    <div
                      class="item"
                      v-if="
                        deliveryExpresse.deliveryDto.traces &&
                        deliveryExpresse.deliveryDto.traces.length < 1
                      "
                    >
                      {{ $t("order.noLogisticsInformation") }}
                    </div>
                    <div
                      class="item"
                      v-if="dataForm.status >= 3 && dataForm.dvyTime !== null"
                    >
                      <div class="time">{{ dataForm.dvyTime }}</div>
                      <div class="text">
                        {{ $t("order.merchantHasShippedWa") }}
                      </div>
                    </div>
                    <div
                      class="item"
                      v-if="dataForm.status >= 2 && dataForm.payTime !== null"
                    >
                      <div class="time">{{ dataForm.payTime }}</div>
                      <div class="text">{{ $t("order.buyerHasPaidWa") }}</div>
                    </div>
                    <div :class="['item', dataForm.status >= 1?'left-line':'']" v-if="dataForm.status >= 1">
                      <div class="time">{{ dataForm.createTime }}</div>
                      <div class="text">
                        {{ $t("order.buyerSubmittedAnOrder") }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div :class="['order-info',$t('language') === 'English'?'flex-wrap':'']">
              <div :class="['info-item',$t('language') === 'English'?'small-width':'']" v-if="dataForm.userAddrOrder && dataForm.userAddrOrder !== null">
                <div class="item-tit">
                  {{ $t("order.recipientInformation") }}
                </div>
                <div class="item">
                  <div class="text">
                    {{
                      dataForm.dvyType === 2
                        ? $t("order.deliveryPerson")
                        : $t("publics.addressee")
                    }}：
                  </div>
                  <div class="res">{{ dataForm.userAddrOrder.receiver }}</div>
                </div>
                <div class="item">
                  <div class="text">{{ $t("shop.contactTel") }}：</div>
                  <div class="res">{{ dataForm.userAddrOrder.mobile }}</div>
                </div>
                <div class="item" v-if="dataForm.dvyType !== 2">
                  <div class="text">{{ $t("publics.deliveryAddr") }}：</div>
                  <div class="res">
                    {{ dataForm.userAddrOrder.province
                    }}{{ dataForm.userAddrOrder.city
                    }}{{ dataForm.userAddrOrder.area
                    }}{{ dataForm.userAddrOrder.addr }}
                  </div>
                  <!-- <div class="res">北京市 北京市 朝阳区 元大都城垣遗址公园6号 辣婆婆(东元大都店)</div> -->
                </div>
              </div>
              <div :class="['info-item',$t('language') === 'English'?'small-width':'']">
                <div class="item-tit">
                  {{ $t("order.shippingInformation") }}
                </div>
                <div class="item">
                  <div class="text">{{ $t("order.delType") }}：</div>
                  <div class="res">
                    {{
                      [
                        $t("order.distribution"),
                        $t("order.buyerMention"),
                        $t("order.noNeedRequired"),
                        $t("order.sameCityDelivery"),
                      ][dataForm.dvyType - 1]
                    }}
                  </div>
                  <div class="res" v-if="dataForm.dvyType === null">
                    {{ $t("order.no") }}
                  </div>
                  <!-- <div class="res" v-if="dataForm.dvyType == 1">快递</div>
                  <div class="res" v-if="dataForm.dvyType == 2">自提</div>
                  <div class="res" v-if="dataForm.dvyType == 3">无需快递</div>-->
                </div>
                <div class="item">
                  <div class="text">{{ $t("order.deliveryTime") }}：</div>
                  <div class="res">{{ dataForm.dvyTime }}</div>
                  <div class="res" v-if="dataForm.dvyTime === null">
                    {{ $t("order.no") }}
                  </div>
                </div>
                <div class="item" v-if="dataForm.dvyType === 2">
                  <div class="text">{{$t("station.stationNames")}}：</div>
                  <div class="res">{{ dataForm.stationName }}</div>
                </div>
              </div>
              <div :class="['info-item',$t('language') === 'English'?'small-width':'']" v-if="dataForm.orderMold === 1">
                <div class="item-tit">
                  {{ $t("order.virtualInfo") }}
                </div>
                <div class="item">
                  <div class="text">{{ $t("order.virtualMsg") }}：</div>
                  <div class="res">
                  <div
                      v-for="(virtualRemark,index) in virtualRemarkList"
                      :key="index" >
                    {{
                      virtualRemark.name
                    }}：{{
                      virtualRemark.value
                    }}
                  </div>
                  </div>
                </div>
              </div>
              <div :class="['info-item',$t('language') === 'English'?'small-width':'']">
                <div class="item-tit">{{ $t("order.paymentInformation") }}</div>
                <div class="item">
                  <div class="text">{{ $t("order.actualAmount") }}：</div>
                  <!-- <div class="res">{{dataForm.actualTotal}}元</div> -->
                  {{
                    dataForm.actualTotal +
                    $t("admin.dollar") +
                    " + " +
                    dataForm.score +
                    $t("order.integral")
                  }}
                </div>
                <div class="item">
                  <div class="text">{{ $t("order.paymentMethod") }}：</div>
                  <span v-if="dataForm.payType === null || dataForm.status === 1">{{
                      $t("order.unpaid")
                    }}</span>
                  <div
                    class="res"
                    v-else
                  >
                    {{
                      [
                        this.$i18n.t("order.pointsPayment"),
                        this.$i18n.t("order.wecProPay"),
                        this.$i18n.t("order.alipayPCPayment"),
                        this.$i18n.t("order.wechatScanCodePayment"),
                        this.$i18n.t("order.wechatH5Payment"),
                        this.$i18n.t("order.weclAccountPay"),
                        this.$i18n.t("order.alipayH5Payment"),
                        this.$i18n.t("order.alipayAPPPayment"),
                        this.$i18n.t("order.wechatAPPPayment"),
                        $t("order.balancePayment"),
                        $t("order.payPalPayment"),
                        '计全支付',
                        '现金支付',
                        '计全微信小程序支付',
                        '红云余额支付',
                        '提货卡支付',
                        '组合支付',
                      ][dataForm.payType]
                    }}
                  </div>
                </div>
                <div class="item">
                  <div class="text">{{ $t("order.paymentTime") }}：</div>
                  <div class="res">{{ dataForm.payTime }}</div>
                  <div class="res" v-if="dataForm.payTime === null">
                    {{ $t("order.no") }}
                  </div>
                </div>
              </div>
              <div :class="['info-item',$t('language') === 'English'?'small-width':'']">
                <div class="item-tit">{{ $t("order.buyerInformation") }}</div>
                <div class="item">
                  <div class="text">{{ $t("order.buyerSNickname") }}：</div>
                  <div class="res">{{ dataForm.nickName }}</div>
                  <div class="res" v-if="dataForm.nickName === null">
                    {{ $t("order.no") }}
                  </div>
                </div>
                <!--                用户没有设置手机号，所以暂时注释掉-->
                <!--                <div class="item">-->
                <!--                  <div class="text">{{$t('order.buyerPhone')}}：</div>-->
                <!--                  <div-->
                <!--                    class="res"-->
                <!--                    v-if="!dataForm.userMobile || dataForm.userMobile === ''"-->
                <!--                  >{{$t('order.no')}}</div>-->
                <!--                  <div class="res" v-else>{{dataForm.userMobile}}</div>-->
                <!--                </div>-->
                <div class="item">
                  <div class="text">{{ $t("order.orderRemarks") }}：</div>
                  <div class="res">{{ dataForm.remarks }}</div>
                  <div
                    class="res"
                    v-if="dataForm.remarks === null || dataForm.remarks === ''"
                  >
                    {{ $t("order.no") }}
                  </div>
                </div>
              </div>
            </div>
            <div class="goods-list">
              <el-table
                :data="prodList"
                header-cell-class-name="table-header"
                row-class-name="table-row"
               >
                <el-table-column prop="" :label="this.$i18n.t('home.product')">
                  <template slot-scope="scope">
                    <!-- 商品信息 -->
                    <div class="df">
                      <!-- <img
                        class="prod-img"
                        :src="resourcesUrl + scope.row.pic"
                      /> -->
                      <prod-pic
                        width="60"
                        :pic="scope.row.pic"
                        class="prod-pic"
                      ></prod-pic>
                      <div class="name">
                        <div>
                          <span v-if="scope.row.giveawayOrderItemId" class="gift-icon">{{ $t("order.giveawayPord") }}</span>
                          <span>{{ scope.row.prodName }}</span>
                          <span class="sku">{{ scope.row.skuName }}</span>
                        </div>
                        <div
                          class="order-status"
                          v-if="
                            scope.row.returnMoneySts &&
                            scope.row.returnMoneySts < 5 &&
                            scope.row.returnMoneySts > 0
                          "
                        >
                          {{
                              $t("order.refunding")
                          }}
                        </div>
                        <div
                          class="order-status"
                          v-if="
                            scope.row.returnMoneySts &&
                            scope.row.returnMoneySts === 5
                          "
                        >
                          {{
                              $t("order.refundsuccessfully")
                          }}
                        </div>
                      </div>
                    </div>
                    <!-- / 商品信息 -->
                    <!-- 赠品 -->
                    <div v-if="dataForm.orderItems.length > 1" class="gift-prod">
                      <div v-for="item in scope.row.giveawayList" class="item">
                        <span class="name">{{'【' + $t("order.giveawayPord") + '】'}}{{item.prodName}}</span>
                        <span class="num">×{{item.prodCount}}</span>
                      </div>
                    </div>
                    <!-- / 赠品 -->
                  </template>
                </el-table-column>
                <el-table-column
                  prop="price"
                  :label="this.$i18n.t('order.unitPrice')"
                  width="180"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.giveawayOrderItemId ? '-' : scope.row.price }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="count"
                  :label="this.$i18n.t('order.quantity')"
                  width="180"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.prodCount }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="count"
                  :label="this.$i18n.t('marketing.discountedPrice')"
                  width="180"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.giveawayOrderItemId ? '-' : scope.row.shareReduce }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="totalPrice"
                  :label="this.$i18n.t('order.totalPrice')"
                  width="180"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.giveawayOrderItemId ? '-' : scope.row.productTotalAmount }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="goods-total">
                <div class="text-box">
                  <div class="item">
                    <div class="text">{{ $t("order.prodTotalPrice") }}:</div>
                    <div class="number">￥{{ dataForm.total }}</div>
                  </div>
                  <div class="item" v-if="dataForm.reduceAmount">
                    <div class="text">{{ $t("marketing.discountedPrice") }}:</div>
                    <div class="number">￥{{ dataForm.reduceAmount }}</div>
                  </div>
                  <div class="item" v-if="dataForm.freightAmount">
                    <div class="text">{{ $t("order.shippingFees") }}:</div>
                    <div class="number">￥{{ dataForm.freightAmount }}</div>
                  </div>
                  <div class="item act-price">
                    <div class="text">{{ $t("order.actualAmount") }}:</div>
                    <div class="number">￥{{ dataForm.actualTotal }}{{ dataForm.score?" + "+ dataForm.score +$t("order.integral"):''}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="order-log">
              <div class="log-title">{{ $t("order.logs") }}</div>
              <div class="log-cont" v-if="dataForm.createTime">
                {{ dataForm.createTime }} {{ dataForm.nickName }}
                {{ $t("order.createOrder") }}
              </div>
              <div class="log-cont" v-if="dataForm.payTime">
                {{ dataForm.payTime }} {{ dataForm.nickName }}
                {{ $t("order.payment") }}
              </div>
              <div class="log-cont" v-if="dataForm.dvyTime">
                {{ dataForm.dvyTime }}
                <!--  -->
                {{
                  dataForm.dvyType === 2
                    ? dataForm.nickName + $t("order.orderPickup")
                    : $t("order.deliverys")
                }}
              </div>
              <div class="log-cont" v-if="dataForm.finallyTime">
                {{ dataForm.finallyTime }} {{ dataForm.nickName
                }}{{ $t("order.completed") }}
              </div>
              <div class="log-cont" v-if="dataForm.cancelTime">
                {{ dataForm.cancelTime }} {{ dataForm.nickName }}
                {{ $t("order.cancelOrder") }}
              </div>
              <div class="log-cont" v-if="dataForm.updateTime">
                {{ dataForm.updateTime }} {{ dataForm.nickName }}
                {{ $t("order.orderUpdate") }}
              </div>
            </div>
            <!-- ___ -->
          </div>
        </div>
      </el-form>
      <!-- 弹窗, 新增 / 修改 -->
      <order-addr-update
        v-if="orderAddrUpdateVisible"
        ref="orderAddrUpdate"
        @refreshUserAddrOrder="getDataList"
      ></order-addr-update>
      <order-remark-update
        v-if="orderRemarkUpdateVisible"
        ref="orderRemarkUpdate"
        @refreshUserRemarkOrder="getDataList"
      ></order-remark-update>
    <!-- </el-dialog> -->
  </div>
</template>

<script>
import OrderAddrUpdate from '@/components/order-addr-update'
import OrderRemarkUpdate from '@/components/order-remark-update'
import ProdPic from '@/components/prod-pic'

export default {
  data () {
    return {
      visible: false,
      virtualRemarkList: [],
      dataForm: {
        orderId: 0,
        virtualRemark: '',
        orderNumber: '',
        remarks: '',
        shopRemarks: '',
        total: 0,
        deliveryExpresses: [],
        actualTotal: 0,
        dvyType: '',
        status: 1,
        addrOrderId: 0,
        nickName: '',
        orderItems: [],
        orderTime: '',
        updateTime: '',
        payTime: '',
        dvyTime: '',
        finallyTime: '',
        cancelTime: '',
        orderType: '',
        userAddrOrder: {}
      },
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      deliveryExpresse: {
        deliveryDto: {}
      },
      indexs: 0,
      orderRemarkUpdateVisible: false,
      orderAddrUpdateVisible: false,
      offsetCount: 0,  // 偏移量
      // 商品列表
      prodList: []
    }
  },
  components: {
    OrderAddrUpdate,
    OrderRemarkUpdate,
    ProdPic
  },
  watch: {
    visible: function () {
      if (!this.visible) {
        this.orderRemarkUpdateVisible = false
        this.orderAddrUpdateVisible = false
      }
    },
    deliveryExpresse: function (newVal, oldVal) {
      this.$nextTick(() => {
        this.offsetCount = 0  // 初始化变量
        if (this.deliveryExpresse) {
          this.$refs.carouser.style.left = '0px'
        }
      })
    }
  },
  computed: {
    stepsStatus: function () {
      if (this.dataForm.finallyTime) {
        return 4
      }
      if (this.dataForm.dvyTime) {
        return 3
      }
      if (this.dataForm.payTime) {
        return 2
      }
      if (this.dataForm.createTime) {
        return 1
      }
    }
  },
  created () {
    this.dataForm.orderNumber = this.$route.query.orderNumber || 0
    this.init()
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      if (this.dataForm.orderNumber) {
        this.indexs = 0
        // 修改
        this.$http({
          url: this.$http.adornUrl(`/order/delivery/orderInfo/${this.dataForm.orderNumber}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          // console.log('deliveryDto', this.deliveryExpresse)
          data.deliveryExpresses.forEach(item => {
            if (item.deliveryDto) {
              item.deliveryDto.traces = item.deliveryDto.traces ? item.deliveryDto.traces.reverse() : item.deliveryDto.traces
            }
          })
          this.dataForm = data
          this.deliveryExpresse = this.dataForm.deliveryExpresses[0]
          // console.log('init-this.deliveryExpresse', this.deliveryExpresse)
          this.virtualRemarkList = JSON.parse(this.dataForm.virtualRemark)

          // 处理商品列表
          this.prodList = data.orderItems
          if (data.orderItems.length === 1 &&
              data.orderItems[0].giveawayList &&
              data.orderItems[0].giveawayList.length) {
            // 单个商品且有赠品时，将主商品和赠品放在同一级列表中展示
            this.prodList = [...data.orderItems, ...data.orderItems[0].giveawayList]
          }
        })
      }
    },
    getDataList () {
      this.$http({
        url: this.$http.adornUrl(`/order/delivery/orderInfo/${this.dataForm.orderNumber}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataForm = data
        this.deliveryExpresse = this.dataForm.deliveryExpresses[0]
        // console.log('getDataList-this.deliveryExpresse', this.deliveryExpresse)
      })
    },
    /**
     * 物流事件
     */
    onClickListDelivery (delivery, index) {
      this.$http({
        url: this.$http.adornUrl(`/order/delivery/deliveryOrder/${delivery.orderDeliveryId}`),
        method: 'get'
      }).then(({ data }) => {
        if (data.deliveryDto) {
          data.deliveryDto.traces = data.deliveryDto.traces ? data.deliveryDto.traces.reverse() : data.deliveryDto.traces
        }
        this.deliveryExpresse = data
        // console.log('onClickListDelivery-data', data)
      })
      this.indexs = index
    },
    // 商品切换
    prevItem () {
      var len = this.deliveryExpresse.orderItems.length
      if (len - 5 > 0) {
        if (this.offsetCount > 0) {
          this.offsetCount--
          this.$refs.carouser.style.left = '-' + (70 * this.offsetCount) + 'px'
        } else {
          return false
        }
      } else if (len - 5 <= 0) {
        return false
      } else {
        return false
      }
    },

    nextItem () {
      var len = this.deliveryExpresse.orderItems.length
      if (len - 5 > 0) {
        if (this.offsetCount < len - 5) {
          this.offsetCount++
          this.$refs.carouser.style.left = '-' + (70 * this.offsetCount) + 'px'
        } else if (len - 5 <= 0) {
          return false
        } else {
          return false
        }
      } else {
        return false
      }
    },
    // 表单提交
    dataFormSubmit () {
    },
    // 修改地址
    changeUserAddrOrder (userAddrOrder) {
      this.orderAddrUpdateVisible = true
      this.$nextTick(() => {
        const From = JSON.parse(JSON.stringify(this.dataForm))
        this.$refs.orderAddrUpdate.init(From)
      })
    },
    // 修改备注
    changeRemarks () {
      this.orderRemarkUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.orderRemarkUpdate.init(this.dataForm)
      })
    }
  }
}
</script>


<style>
.detail-dialog .el-dialog {
  min-width: 950px;
  margin-top: 10vh !important;
}

.detail-dialog .goods-list .has-gutter th.is-leaf {
  background: #f7f8fa;
  color: #333;
  border-bottom: 1px solid #ebeef5;
  font-weight: 400;
  border-right: 0;
}

.detail-dialog .goods-list .el-table td {
  border-right: 0;
}
.left-line {
  /* padding-left: 30px;
  padding-bottom: 10px;
  padding-top: 15px;
  margin-left: -30px;
  margin-top: -10px !important;
  background-color: #fff; */
  border-left: 1px solid #fff !important;
}
</style>

<style lang="scss" scoped>
.mod-order-orderInfo {
  height: 100%;
  width: 100%;
  font: 14px Arial, "PingFang SC", "Hiragino Sans GB", STHeiti,
    "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  color: #333;

  .order-number {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-left: 20px;
  }

  .order-number .text {
    color: #999;
  }

  .order-number .number,
  .order-number .time {
    display: flex;
    align-items: center;
  }

  .order-number .time {
    margin: 0 15px;
  }

  .order-state {
    position: relative;
    margin-top: 15px;
    border: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .order-state .state-box {
    padding: 20px 15px;
    width: 40%;
    border-right: 1px solid #eee;
  }

  .order-state .state-box .state {
    font-size: 20px;
    font-weight: 700;
    line-height: 28px;
  }

  .order-state .state-box .state-des {
    margin-top: 10px;
    color: #999;
  }

  .order-state .state-box .actions {
    margin-top: 15px;
  }

  .order-state .state-box .actions .item {
    display: flex;
    align-items: center;
  }

  .order-state .state-box .actions .item .el-button--text {
    cursor: pointer;
  }

  .order-state .state-box .actions .item .item-btn {
    padding: 3px 10px;
    border: 1px solid #eee;
    border-radius: 2px;
  }

  .order-state .state-steps {
    flex: 1;
    // margin-left: -80px;
    padding-bottom: 10px;
  }

  .order-state .state-steps .el-form-item {
    margin-bottom: 0;
  }

  .packages {
    margin-top: 15px;
  }

  .packages .p-tab {
    display: flex;
    align-items: center;
    width: 100%;
    background: #F7F8FA;
    border: 1px solid #E8E9EC;
    border-bottom: none;
    height: 44px;
  }

  .packages .p-tab .item {
    background: #F7F8FA;
    // border: 1px solid #EAEAEA;
    margin-right: -1px;
    margin-bottom: -1px;
    position: relative;
    text-align: center;
    line-height: 44px;
    width: 90px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    height: 44px;
    // border-right: 1px solid #EAEAEA;
  }

  .packages .p-tab .item:first-child {
    // border-radius: 3px 0 0 0;
    border-left: none;
  }

  .packages .p-tab .item:last-child {
    // border-radius: 0 3px 0 0;
    border-left: none;
  }

  .packages .p-tab .item.active {
    background: #fff;
    // border: 1px solid #E8E9EC;
  }

  .packages .p-con {
    border: 1px solid #eee;
    padding: 20px;
    display: flex;
  }

  .packages .p-con .deliver-msg {
    width: 40%;
    min-width: 430px;
  }

  .packages .p-con .deliver-msg .d-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .packages .p-con .deliver-msg .d-item .text {
    width: 80px;
  }

  .packages .p-con .deliver-msg .d-goods {
    position: relative;
    width: 340px;
    margin: 30px 0 0;
  }

  .packages .p-con .deliver-msg .d-goods.over {
    margin: 30px 32px 0;
  }

  .packages .p-con .deliver-msg .d-goods .arrow {
    position: absolute;
    top: 28px;
    width: 22px;
    height: 22px;
    background: #eee;
    border-radius: 50%;
    cursor: pointer;
    display: none;
  }

  .packages .p-con .deliver-msg .d-goods .arrow.disable {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .packages .p-con .deliver-msg .d-goods.over .arrow {
    display: block;
  }

  .packages .p-con .deliver-msg .d-goods .arrow.prev {
    left: -32px;
  }

  .packages .p-con .deliver-msg .d-goods .arrow.next {
    right: -32px;
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    transform: rotate(180deg);
  }

  .packages .p-con .deliver-msg .d-goods .arrow::before {
    position: absolute;
    left: 9px;
    top: 8px;
    display: block;
    width: 5px;
    height: 5px;
    content: " ";
    font-size: 0;
    border: 1px solid #666;
    border-width: 1px 1px 0 0;
    -webkit-transform: rotate(225deg);
    -moz-transform: rotate(225deg);
    transform: rotate(225deg);
  }

  .packages .p-con .deliver-msg .d-goods .item-goods {
    position: relative;
    width: 340px;
    height: 80px;
    overflow: hidden;
  }

  .packages .p-con .deliver-msg .d-goods .goods-box {
    position: absolute;
    left: 0;
    display: flex;
    margin-top: 0;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    transition: all 0.3s;
  }

  .packages .p-con .deliver-msg .d-goods .goods-box .item {
    margin-right: 10px;
    font-size: 12px;
    cursor: pointer;
  }

  .packages .p-con .deliver-msg .d-goods .goods-box .item:last-child {
    margin: 0;
  }

  .packages .p-con .deliver-msg .d-goods .goods-box .item .img {
    width: 60px;
    height: 60px;
    font-size: 0;
    margin-bottom: 4px;
    position: relative;
  }

  .packages .p-con .deliver-msg .d-goods .goods-box .item .img img {
    width: 100%;
    height: 100%;
  }

  .packages .p-con .deliver-msg .d-goods .goods-box .item .img .number {
    position: absolute;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    border-radius: 6px 0 6px 0;
    font-size: 12px;
    height: 16px;
    line-height: 16px;
    padding: 0 5px;
  }

  .packages .p-con .deliver-msg .d-goods .goods-box .item .name {
    width: 60px;
    height: 16px;
    line-height: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #999;
  }

  .packages .p-con .logistics {
    flex: 1;
  }

  .packages .p-con .logistics .l-tit {
    display: flex;
  }

  .packages .p-con .logistics .l-tit .l-state {
    color: #155BD4;
  }

  .packages .p-con .logistics .logistics-box {
    height: 175px;
    overflow-y: scroll;
    position: relative;
    margin-top: 15px;
  }

  .packages .p-con .logistics .logistics-box::before {
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    width: 10px;
    height: 10px;
    content: " ";
    font-size: 0;
    background: #fff;
    z-index: 1;
  }

  .packages .p-con .logistics .logistics-box::after {
    position: absolute;
    left: 6px;
    top: 0;
    display: block;
    // width: 1px;
    height: 100%;
    content: " ";
    font-size: 0;
    background: #eee;
    z-index: 0;
  }

  .packages .p-con .logistics .logistics-box .item {
    padding: 0px 0 40px 25px;
    position: relative;
    margin-left: 6px;
    border-left: 1px solid #eee;
  }

  .packages .p-con .logistics .logistics-box .item::before {
    position: absolute;
    left: -10px;
    top: 0px;
    display: block;
    width: 19px;
    height: 19px;
    border-radius: 50%;
    content: " ";
    font-size: 0;
    background: #ccc;
    border: 5px solid #fff;
    z-index: 2;
  }

  .packages .p-con .logistics .logistics-box .item:first-child:before {
    background: #c00;
  }

  .packages .p-con .logistics .logistics-box .item .time {
    color: #999;
  }

  .packages .p-con .logistics .logistics-box .item .text {
    margin-top: 5px;
    width: 400px;
  }

  .order-info {
    background: #f7f8fa;
    margin-top: 15px;
    display: flex;
    padding: 20px;
  }

  .order-info .info-item {
    width: 25%;
    padding-right: 30px;
  }

  .order-info .info-item .item-tit {
    font-weight: 600;
  }

  .order-info .info-item .item {
    margin-top: 10px;
    display: flex;
    line-height: 20px;
  }
  .order-info .info-item .item .res{
    word-break: break-word;
  }

  .order-info .info-item .item .text {
    // width: 75px;
    white-space: nowrap;
  }

  .goods-list {
    margin-top: 15px;
  }

  .goods-list .df {
    display: flex;
    align-items: center;
  }

  .goods-list .df .prod-img {
    display: block;
    width: 60px !important;
    height: 60px !important;
    margin-right: 5px;
  }

  .goods-list .df .prod-pic {
    max-width: 60px;
    margin-right: 6px;
    flex: 1;
  }

  .goods-list .df .name {
    line-height: 20px;
    flex: 1;
  }

  .goods-list .df .name .sku {
    margin-left: 5px;
    color: #999;
  }

  .goods-list .df .gift-icon {
    display: inline-block;
    min-width: 34px;
    max-height: 21px;
    text-align: center;
    padding: 4px;
    border-radius: 4px;
    background: #e43130;
    color: #fff;
    font-size: 13px;
    line-height: 1em;
    margin-right: 5px;
  }

  .goods-list .goods-total {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }

  .goods-list .goods-total .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #999;
    margin-top: 5px;
  }

  .goods-list .goods-total .item .text {
    max-width: 220px;
    text-align: right;
  }

  .goods-list .goods-total .item .number {
    width: 150px;
    text-align: center;
  }

  .goods-list .goods-total .item.act-price {
    margin-top: 20px;
    color: #333;
    font-weight: 600;
  }

  .goods-list .goods-total .item.act-price .number {
    color: #c00;
  }

  .order-log {
    margin-top: 20px;
    border-top: 1px dashed #e9eaec;
    padding: 20px 10px;
  }

  .order-log .log-title {
    height: 30px;
    width: 100%;
    line-height: 30px;
    font-weight: bold;
  }

  .order-log .log-cont {
    color: #666666;
    margin-top: 10px;
    // 英文换行(以字母为依据)
    word-break: break-all;
  }
  .order-status {
    display: inline-block;
    width: auto;
    text-align: center;
    margin-top: 5px;
    padding: 0px 4px;
    border: 1px solid #e43130;
    border-radius: 2px;
    color: #e43130;
    font-size: 12px;
  }
}
// .el-step.is-horizontal .el-step__line {
//   top: 19px !important;
// }
div ::v-deep .el-step.is-center .el-step__head {
  display: flex;
  justify-content: center;
  align-items: center;
}

// 赠品
.gift-prod .item {
  margin-top: 5px;
  line-height: 1em;
  .name {
    display: inline-block;
    margin-right: 15px;
    line-height: 20px;
    // max-width: 400px;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
  }
}

// 小屏样式适配
.flex-wrap {
  flex-wrap: wrap;
}
.small-width {
  width: 50% !important;
  margin-bottom: 10px;
}
</style>



