<template>
    <div class="billingCashier" id="billingCashier">
        <div style="flex: 1 1 0%;">
            <div class="left">
                <div class="header-box">
                    <div class="header">
                        <div class="header-img">
                            <img v-if="memberInfo.pic" :src="memberInfo.pic">
                            <img v-else src="../../../assets/img/cashier/head04.png">
                        </div>
                        <div class="head-info">
                            <div class="head-info-top">
                                <div class="name" v-if="memberInfo.memberType == 1">
                                    <div class="text">{{
                                            memberInfo.realName ? memberInfo.realName :
                                                memberInfo.nickName
                                        }}
                                    </div>
                                </div>
                                <div class="name" v-else>
                                    <div class="text">{{
                                            memberInfo.realName ? memberInfo.realName :
                                                memberInfo.nickName
                                        }}
                                    </div>
                                    <div class="level" v-if="memberInfo.levelName">{{ memberInfo.levelName }}</div>
                                </div>
                                <div class="mobile" v-if="memberInfo.memberType != 1">{{
                                        memberInfo.userMobile ? memberInfo.userMobile :
                                            memberInfo.userMobile
                                    }}
                                </div>
                            </div>
                            <div class="head-info-bottom">
                                <div class="txt">积分：{{ memberInfo.score }}</div>
                                <div class="txt">余额：{{ memberInfo.sumBalance }}</div>
                            </div>
                        </div>
                        <div v-if="memberInfo.score">
                            <el-button style="margin-left: 10px;" type="primary" size="mini" @click="memberChange()">
                                更换会员
                            </el-button>
                        </div>
                        <div v-else>
                            <el-button style="margin-left: 10px;" type="primary" size="mini" @click="memberChange()">
                                查询会员
                            </el-button>
                        </div>
                        <!--                        <el-button style="margin-left: 10px" @click.stop="defaMember()" type="primary" size="mini">散客</el-button>-->
                    </div>
                </div>
                <div class="content">
                    <div class="title">
                        <div style="display: flex;">结算清单（
                            <div>{{ prodNum }}</div>
                            ）
                        </div>
                        <div class="clear" @click.stop="clearProd()">
                            <i class="el-icon-delete"></i>
                            <div>清空</div>
                        </div>
                    </div>
                    <div class="content-list common-scrollbar" v-loading="prodCartLoading">
                        <div v-if="selectProdList.length > 0">
                            <div class="content-item" v-for="(item,index) in selectProdList">
                                <div class="item-img">
                                    <img :src="(item.pic.indexOf('http') > -1 ||  item.pic.indexOf('https') > -1) ? item.pic : resourcesUrl + item.pic">
                                </div>
                                <div class="item-info">
                                    <div class="item-name">{{ item.prodName }}</div>
                                    <div class="item-del" @click.stop="delProd(item.prodId)">删除</div>
                                    <div class="item-price">
                                        <div class="unit">￥</div>
                                        {{ item.price }}
                                    </div>
                                </div>
                                <div class="item-num">
                                    <div class="num-dec" @click.stop="changeProdNum(item,-1)">-</div>
                                    <div class="num" v-if="update">{{ item.prodCount }}</div>
                                    <div class="num-inc" @click.stop="changeProdNum(item,1)">+</div>
                                </div>
                            </div>
                        </div>
                        <div class="empty" v-else>
                            <img src="../../../assets/img/cashier/cart_empty.png">
                            <div class="tips">点击右侧商品，选择商品进行结账</div>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="bottom-info">
                        <div class="bottom-left">共
                            <div>{{ prodNum }}</div>
                            件
                        </div>
                        <div class="bottom-right"></div>
                    </div>
                    <div class="bottom-btn">
                        <!--                        <el-button>现金收款</el-button>-->
                        <el-button :loading="confirmLoading" @click.stop="buyNow()" style="width: 300px;" type="primary">确认订单￥{{ actualTotal }}
                        </el-button>
                    </div>
                </div>
                <div v-if="payShow" class="pay-shade"></div>
            </div>
        </div>
        <div v-if="!payShow" style="flex: 3 1 0%;display: flex;">
            <div class="middle">
                <div class="comp-wrap">
                    <el-button @click.stop="compClick(0)" size="small" class="comp-btn" :type="compType == 0?'primary':''">商品
                    </el-button>
                    <el-button :disabled="memberInfo.memberType == 1" size="small" @click.stop="compClick(1)" class="comp-btn" :type="compType == 1?'primary':''">会员
                    </el-button>
                    <!--                    <el-button @click.stop="compClick(2)" size="small" class="comp-btn" :type="compType == 2?'primary':''">会员卡项-->
                    <!--                    </el-button>-->
                    <el-button @click.stop="wholeOrderCancel()" size="small" class="comp-btn" :type="compType == 3?'primary':''">整单取消
                    </el-button>
                    <!--                    <el-button @click.stop="compClick(4)" size="small" class="comp-btn" :type="compType == 4?'primary':''">挂/取单-->
                    <!--                    </el-button>-->
                </div>
            </div>
            <div class="right">
                <div class="list-wrap" style="flex: 1 1 0%;">
                    <div v-loading="prodListLoading" class="content" v-if="compType == 0">
                        <div class="container goods-container">
                            <div style="text-align: right;margin-top: 15px">
                                <el-button
                                    type="primary"
                                    class="change"
                                    size="small"
                                    @click="fullScreenChange"
                                    v-if="!fullScreenShow"
                                >全屏
                                </el-button
                                >
                                <el-button
                                    type="primary"
                                    class="change"
                                    size="small"
                                    @click="closefullScreen"
                                    v-if="fullScreenShow"
                                >关闭全屏
                                </el-button
                                >
                                <!-- 切换按钮 -->
                                <el-button
                                    type="primary"
                                    class="change"
                                    size="small"
                                    @click="gotSockInquire"
                                >库存
                                </el-button
                                >
                                <el-button
                                    type="primary"
                                    class="change"
                                    size="small"
                                    @click="goCashierOrder"
                                >订单
                                </el-button
                                >
                                <el-button type="primary" size="small" class="change" @click="lockScreen"
                                >锁屏
                                </el-button
                                >
                            </div>
                            <div class="header-operation">
                                <div class="header-operation-right">
                                    <el-input v-model="page.prodName" style="width: 200px;" clearable placeholder="请输入商品名称"></el-input>
                                    <el-input v-model="page.partyCode" clearable style="width: 240px;margin-left: 10px;" placeholder="请输入商品编码"></el-input>
                                    <el-button @click.stop="prodSearch()" style="margin-left: 15px;"
                                               icon="el-icon-search" type="primary">搜索
                                    </el-button>
                                </div>
                            </div>
                            <div class="content">
                                <div class="type-switch">
                                    <div style="overflow: hidden auto;">
                                        <div class="item-content">
                                            <div class="switch-item" :class="shopCategoryId == '' ? 'active':''"
                                                 @click="categoryClick('')">所有分类
                                            </div>
                                            <div class="switch-item"
                                                 :class="shopCategoryId == item.categoryId ? 'active':''"
                                                 @click="categoryClick(item.categoryId)"
                                                 v-for="(item,index) in categoryList">{{ item.categoryName }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="list-wrap">
                                    <div style="overflow: hidden auto;">
                                        <div class="prod-content">
                                            <div class="table-list" v-if="prodList.length > 0">
                                                <div class="table-item item-mum-2" @click.stop="prodClick(item)"
                                                     :class="{'active':selectProdIds.includes(item.prodId),'disabled':prodCartLoading}"
                                                     v-for="(item,index) in prodList">
                                                    <div class="item-name multi-hidden">{{ item.prodName }}
                                                    </div>
                                                    <div class="item-info">
                                                        <div class="item-img">
                                                            <img :src="resourcesUrl + item.pic">
                                                        </div>
                                                        <div class="item-other">
                                                            <div class="item-money"
                                                                 :class="selectProdIds.includes(item.prodId) ? 'item-money-active':''">
                                                                <div class="util">￥</div>
                                                                {{ item.price }}
                                                            </div>
                                                            <div class="item-stock">总库存：{{ item.totalStocks }}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="empty" style="text-align: center;" v-else>
                                                <img src="../../../assets/img/cashier/goods_empty.png"
                                                     draggable="false">
                                                <div class="tips">暂无商品</div>
                                            </div>
                                        </div>
                                    </div>
                                    <el-pagination
                                        v-if="prodList.length"
                                        @current-change="currentChangeHandle"
                                        :current-page="page.currentPage"
                                        :total="page.total"
                                        layout="total, prev, pager, next, jumper"
                                    ></el-pagination>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-loading="memberLoading" class="content" v-if="compType == 1">
                        <div class="member-detail-wrap">
                            <div class="member-head" style="display: flex;justify-content: space-between;">
                                会员详情
                                <div>
                                    <el-button
                                        type="primary"
                                        class="change"
                                        size="small"
                                        @click="fullScreenChange"
                                        v-if="!fullScreenShow"
                                    >全屏
                                    </el-button
                                    >
                                    <el-button
                                        type="primary"
                                        class="change"
                                        size="small"
                                        @click="closefullScreen"
                                        v-if="fullScreenShow"
                                    >关闭全屏
                                    </el-button
                                    >
                                    <!-- 切换按钮 -->
                                    <el-button
                                        type="primary"
                                        class="change"
                                        size="small"
                                        @click="gotSockInquire"
                                    >库存
                                    </el-button
                                    >
                                    <el-button
                                        type="primary"
                                        class="change"
                                        size="small"
                                        @click="goCashierOrder"
                                    >订单
                                    </el-button
                                    >
                                    <el-button type="primary" size="small" class="change" @click="lockScreen"
                                    >锁屏
                                    </el-button
                                    >
                                </div>
                            </div>
                            <div class="member-content">
                                <div class="content-block">
                                    <div class="item-img">
                                        <img v-if="memberInfo.pic" :src="memberInfo.pic">
                                        <img v-else src="../../../assets/img/cashier/head04.png">
                                    </div>
                                    <div class="item-content">
                                        <div class="item-title">
                                            <div class="item-title-text">{{
                                                    memberInfo.realName ? memberInfo.realName :
                                                        memberInfo.nickName
                                                }}
                                            </div>
                                            <div class="item-label">{{ memberInfo.levelName }}</div>
                                        </div>
                                        <div class="info-list">
                                            <div class="info-item">手机：{{ memberInfo.userMobile }}</div>
                                            <div class="info-item">性别：{{ memberInfo.sex == 0 ? '男' : '女' }}</div>
                                            <div class="info-item">生日：{{ memberInfo.birthDate }}</div>
                                            <div class="info-item">成为会员：{{ memberInfo.userRegtime }}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="content-block account">
                                    <div class="content-data-item">
                                        <div class="data-item-title">积分</div>
                                        <div class="data-item-value">{{ memberInfo.score }}</div>
                                        <div class="data-item-action" @click="scoreClick()">查看</div>
                                    </div>
                                    <div class="content-data-item">
                                        <div class="data-item-title">余额(元)</div>
                                        <div class="data-item-value">{{ memberInfo.sumBalance }}</div>
                                    </div>
                                    <div class="content-data-item">
                                        <div class="data-item-title">成长值</div>
                                        <div class="data-item-value">{{ memberInfo.growth }}</div>
                                        <div class="data-item-action" @click="growthClick()">查看</div>
                                    </div>
                                    <div class="content-data-item">
                                        <div class="data-item-title">优惠券可用(张)</div>
                                        <div class="data-item-value">{{ couponNum }}</div>
                                        <div class="data-item-action" @click="couponListClick()">查看</div>
                                    </div>
                                </div>
                                <div class="content-block action">
                                    <div class="content-data-item">
                                        <div class="data-item-icon">
                                            <img src="../../../assets/img/cashier/icon-member-info.png">
                                        </div>
                                        <div class="data-item-value">会员信息</div>
                                    </div>
                                    <div class="content-data-item">
                                        <div class="data-item-icon">
                                            <img src="../../../assets/img/cashier/icon-member-point.png">
                                        </div>
                                        <div class="data-item-value">积分调整</div>
                                    </div>
                                    <div class="content-data-item">
                                        <div class="data-item-icon">
                                            <img src="../../../assets/img/cashier/icon-member-balance.png">
                                        </div>
                                        <div class="data-item-value">余额充值</div>
                                    </div>
                                    <div class="content-data-item">
                                        <div class="data-item-icon">
                                            <img src="../../../assets/img/cashier/icon-member-coupon.png">
                                        </div>
                                        <div class="data-item-value">送优惠券</div>
                                    </div>
                                    <div class="content-data-item">
                                        <div class="data-item-icon">
                                            <img src="../../../assets/img/cashier/icon-member-growth.png">
                                        </div>
                                        <div class="data-item-value">成长值调整</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else style="flex: 3 1 0%;display: flex;">
            <div class="payment-wrap">
                <div class="header" style="display: flex;justify-content: space-between">
                    结算
                    <div style="text-align: right;">
                        <el-button
                            type="primary"
                            class="change"
                            size="small"
                            @click="fullScreenChange"
                            v-if="!fullScreenShow"
                        >全屏
                        </el-button
                        >
                        <el-button
                            type="primary"
                            class="change"
                            size="small"
                            @click="closefullScreen"
                            v-if="fullScreenShow"
                        >关闭全屏
                        </el-button
                        >
                        <!-- 切换按钮 -->
                        <el-button
                            type="primary"
                            class="change"
                            size="small"
                            @click="gotSockInquire"
                        >库存
                        </el-button
                        >
                        <el-button
                            type="primary"
                            class="change"
                            size="small"
                            @click="goCashierOrder"
                        >订单
                        </el-button
                        >
                        <el-button type="primary" size="small" class="change" @click="lockScreen"
                        >锁屏
                        </el-button
                        >
                    </div>
                </div>
                <div class="body">
                    <div class="info-wrap">
                        <div class="info">
                            <div style="overflow: hidden auto;">
                                <div class="pay-content">
                                    <div class="payment-money">费用总额：￥{{ actualTotal }}</div>
                                    <div class="title">营销优惠</div>
                                    <div class="item-flex">
                                        <div class="type-item" :class="{'active':couponReduceAmount > 0,'disabled':orderFlag}"
                                             @click.stop="couponClick()">
                                            <div class="icon-img">
                                                <img src="../../../assets/img/cashier/icon-coupon.png">
                                            </div>
                                            <div class="name" v-if="couponReduceAmount > 0">优惠券抵扣
                                                <div class="text">{{ couponReduceAmount }}元</div>
                                            </div>
                                            <div class="name" v-else>优惠券
                                                <div class="text" v-if="couponNum > 0">（拥有{{ couponNum }}张）</div>
                                            </div>
                                            <div v-if="couponReduceAmount > 0">
                                                <div class="xuanzhong"></div>
                                                <img class="xz-img" src="../../../assets/img/cashier/icon-select.png">
                                            </div>
                                        </div>
                                        <div class="type-item" :class="{'active':rdeductionAmount > 0,'disabled':orderFlag}"
                                             @click.stop="rdeductionAmountClick()">
                                            <div class="icon-img">
                                                <img src="../../../assets/img/cashier/icon-jmje.png">
                                            </div>
                                            <div class="name" v-if="rdeductionAmount == 0">减免金额</div>
                                            <div class="name" v-else>减免
                                                <div class="text">{{ rdeductionAmount }}元</div>
                                            </div>
                                            <div v-if="rdeductionAmount > 0">
                                                <div class="xuanzhong"></div>
                                                <img class="xz-img" src="../../../assets/img/cashier/icon-select.png">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="title">支付方式</div>
                                    <div class="item-flex pay-type">
                                        <div class="type-item" @click.stop="payTypeChange(1)"
                                             :class="payMethod == 1 ? 'active':''">
                                            <div class="icon-img">
                                                <img src="../../../assets/img/cashier/icon-scan-zs.png">
                                            </div>
                                            <div class="name">店铺收款码</div>
                                            <div v-if="payMethod == 1">
                                                <div class="xuanzhong"></div>
                                                <img class="xz-img" src="../../../assets/img/cashier/icon-select.png">
                                            </div>
                                        </div>
                                        <div class="type-item" @click.stop="payTypeChange(2)"
                                             :class="payMethod == 2 ? 'active':''">
                                            <div class="icon-img">
                                                <img src="../../../assets/img/cashier/icon-scan-bs.png">
                                            </div>
                                            <div class="name">扫码支付</div>
                                            <div v-if="payMethod == 2">
                                                <div class="xuanzhong"></div>
                                                <img class="xz-img" src="../../../assets/img/cashier/icon-select.png">
                                            </div>
                                        </div>
                                        <div class="type-item" @click.stop="payTypeChange(3)"
                                             :class="{'active':payMethod == 3,'disabled':orderFlag}">
                                            <div class="icon-img">
                                                <img src="../../../assets/img/cashier/icon-cashPay.png">
                                            </div>
                                            <div class="name">现金支付</div>
                                            <div v-if="payMethod == 3">
                                                <div class="xuanzhong"></div>
                                                <img class="xz-img" src="../../../assets/img/cashier/icon-select.png">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="button-wrap">
                            <div class="print-ticket">
                                <el-checkbox>打印小票</el-checkbox>
                            </div>
                            <el-button @click.stop="remarkClick()">备注</el-button>
                            <el-button v-if="!payBtnShow" :disabled="submitLoading" @click.stop="cancel()" type="warning" plain>取消</el-button>
                            <el-button v-if="payBtnShow" @click.stop="delOrder()" type="warning" plain>删除订单</el-button>
                            <el-button type="primary" :loading="submitLoading" v-if="(wayCode == 'QR_CASHIER' || wayCode == 'AUTO_BAR')" @click.stop="submitOrder()">
                                发起收款
                            </el-button>
                            <el-button type="primary" :loading="cashLoading" v-if="wayCode == 'CASH'" @click.stop="cashPay()">确认收款</el-button>
                            <!--                            <el-button type="primary" :loading="payLoading" v-if="payBtnShow && orderFlag" @click.stop="toPay()">支付</el-button>-->
                        </div>
                    </div>
                    <div class="bill-wrap">
                        <div style="overflow: hidden auto;">
                            <div class="uni-scroll-view-content">
                                <div class="title">支付明细</div>
                                <div class="body">
                                    <div class="bill-info">
                                        <div>费用总额</div>
                                        <div>￥{{ actualTotal }}</div>
                                    </div>
                                    <div class="block-title">
                                        <div>营销优惠</div>
                                    </div>
                                    <div class="bill-info">
                                        <div>减免金额</div>
                                        <div class="text">-￥{{ rdeductionAmount }}</div>
                                    </div>
                                    <div class="bill-info">
                                        <div>优惠券</div>
                                        <div class="text">-￥{{ couponReduceAmount }}</div>
                                    </div>
                                    <div class="block-title">
                                        <div>支付方式</div>
                                    </div>
                                    <div class="bill-info">
                                        <div>付款码支付</div>
                                        <div>￥{{ actualAmount }}</div>
                                    </div>
                                    <div class="block-title"></div>
                                    <div class="bill-info">
                                        <div>需支付</div>
                                        <div>￥{{ actualAmount }}</div>
                                    </div>
                                    <div class="bill-info">
                                        <div>实付</div>
                                        <div>￥{{ actualAmount }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--    会员    -->
        <member-list v-if="memberVisible" ref="memberList" @memberSelectChange="memberSelectChange"></member-list>
        <!--    备注    -->
        <el-dialog
            title="备注"
            :close-on-click-modal="false"
            :visible.sync="remarkShow"
            @close="remarkDialogClose"
            width="600px"
        >
            <el-input
                type="textarea"
                :rows="6"
                placeholder="请输入备注"
                v-model="orderShopParam.remarks">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="remarkBtn()">确定</el-button>
            </span>
        </el-dialog>
        <!--    减免金额    -->
        <calculation v-if="calculationShow" :actualAmount="actualAmount" ref="calculation" @confirmEvent="confirmEvent"></calculation>
        <!--    用户优惠券    -->
        <user-coupon v-if="userCouponShow" :actualAmount="actualAmount" :couponId="couponInfo.couponId" ref="userCoupon"
                     @couponConfirmEvent="couponConfirmEvent"></user-coupon>
        <!--    用户积分    -->
        <score-detail v-if="scoreShow" ref="scoreDetail"/>
        <!--    用户优惠券列表    -->
        <coupon-detail v-if="couponShow" ref="couponDetail"/>
        <!--    用户成长值    -->
        <growth-detail v-if="growthShow" ref="growthDetail"/>

        <!--二维码支付框-->
        <payModal @payModalColseBtn="payModalColseBtn" v-if="payModalShow" ref="payModal"></payModal>

        <!--条码录入框-->
        <payCodeModal @payModalColseBtn="payModalColseBtn" v-if="payCodeModalShow" ref="payCodeModal" @confirmEvent="confirmSendPay"></payCodeModal>
        <!--    商品规格选择    -->
        <prod-sku-select v-if="prodSkuShow" @prodAddToCart="prodAddToCart" ref="prodSkuSelect"></prod-sku-select>
    </div>
</template>

<script>
import {formatTime} from '../../../utils/util'
import memberList from './member-list'
import calculation from '../../../components/calculation/calculation'
import userCoupon from '../../../components/user-coupon/user-coupon'
import ScoreDetail from './score-detail.vue'
import CouponDetail from './coupon-detail.vue'
import GrowthDetail from './growth-detail.vue'
import payModal from '@/views/modules/billingCashier/payModal'
import payCodeModal from '@/views/modules/billingCashier/payCodeModal'
import prodSkuSelect from '../../../components/prod-sku-select/index'

export default {
    name: 'billingCashier',
    components: {
        memberList,
        calculation,
        userCoupon,
        ScoreDetail,
        CouponDetail,
        GrowthDetail,
        payModal,
        payCodeModal,
        prodSkuSelect
    },
    data () {
        return {
            scoreShow: false,
            couponShow: false,
            growthShow: false,
            calculationShow: false,
            memberVisible: false,
            userCouponShow: false,
            payBtnShow: false,
            payShow: false,
            dateValue: '',
            memberInfo: {}, // 会员信息
            compType: 0,
            couponNum: 0, // 用户拥有优惠券数量
            prodNum: 0, // 下单商品数量
            actualTotal: 0, // 总价
            actualAmount: 0, // 实际支付金额
            rdeductionAmount: 0, // 减免金额
            couponReduceAmount: 0, // 优惠券减免金额
            shopCategoryId: '', // 店铺分类id
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 12, // 每页显示多少条
                prodName: '',
                partyCode: ''
            },
            prodListLoading: false,
            memberLoading: false,
            submitLoading: false,
            confirmLoading: false,
            prodList: [], // 商品
            categoryList: [], // 分类
            selectProdList: [], // 选中的商品
            selectProdIds: [], // 选中的商品id
            update: true,
            isScorePay: 0, // 是否积分支付
            userUseScore: 0, // 用户使用的积分
            userChangeCoupon: 0, // 用户使用优惠券数量
            couponIds: [], // 优惠券id
            couponUserIds: [], // 用户优惠券id
            remarkShow: false,
            couponInfo: {}, // 选中的优惠券
            payMethod: -1,
            payType: '',
            wayCode: '', // QR_CASHIER聚合扫码(用户扫商家) AUTO_BAR聚合条码(商家扫用户) CASH现金
            shopId: 0,
            orderSelfStationDto: {
                stationTime: '',
                stationUserMobile: '',
                stationUserName: ''
            },
            orderShopParam: {
                remarks: '',
                shopId: ''
            },
            prodCartLoading: false,
            wholeOrderFlag: false,
            orderNumbers: '',
            orderFlag: false, // 订单提交状态

            payModalShow: false,
            payCodeModalShow: false,
            payLoading: false,
            cashLoading: false,
            fullScreenShow: false,
            resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
            prodSkuShow: false,
            skuListLen: 0
        }
    },
    mounted () {
        this.init()
        // this.getDefMemberInfo()
    },
    methods: {
        // 屏幕全屏切换
        fullScreenChange () {
            let main = document.getElementById('billingCashier')
            main.requestFullscreen()
            this.fullScreenShow = true
        },
        // 关闭全屏
        closefullScreen () {
            this.fullScreenShow = false
            document.exitFullscreen()
        },
        // 获取用户购物车商品信息
        getShopCartInfo () {
            this.$http({
                url: this.$http.adornUrl('/multishop/shopCart/info'),
                method: 'POST',
                data: this.$http.adornData({
                    userId: this.memberInfo.userId
                })
            }).then(({data}) => {
                if(data.length > 0) {
                    this.selectProdList = data[0].shopCartItemDiscounts[0].shopCartItems
                    this.selectProdIds = this.selectProdList.map(item => item.prodId)
                    // 下单商品数量和下单金额计算
                    this.getProdNumAndMoney()
                }
            }).finally(() => {
            })
        },
        gotSockInquire () {
            this.clearCart()
            this.$router.push('/stock-inquire')
        },
        goCashierOrder () {
            this.clearCart()
            this.$router.push('/cashierOrder-index')
        },
        //锁屏
        lockScreen () {
            this.clearCart()
            this.$router.push('/login')
        },
        // 散客
        defaMember () {
            this.getDefMemberInfo()
        },
        // 获取默认会员信息
        getDefMemberInfo () {
            this.$http({
                url: this.$http.adornUrl('/admin/user/getDefMemberInfo'),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                this.memberInfo = data
            })
        },
        // 整单取消
        wholeOrderCancel () {
            this.wholeOrderFlag = true
            if (this.selectProdIds.length > 0) {
                this.delProdShopCart(this.selectProdIds, 1)
            } else {
                this.memberInfo = {}
                // this.getDefMemberInfo()
            }
            this.payLoading = false
            this.compType = 0
            this.page.currentPage = 1
            this.page.pageSize = 12
            this.getProdList(this.page)
        },
        // 积分查看
        scoreClick () {
            this.scoreShow = true
            this.$nextTick(() => {
                this.$refs.scoreDetail.init(this.memberInfo.userId)
            })
        },
        // 成长值查看
        growthClick () {
            this.growthShow = true
            this.$nextTick(() => {
                this.$refs.growthDetail.init(this.memberInfo.userId)
            })
        },
        // 优惠券列表查看
        couponListClick () {
            this.couponShow = true
            this.$nextTick(() => {
                this.$refs.couponDetail.init(this.memberInfo.userId)
            })
        },
        // 支付方式改变
        payTypeChange (payMethod) {
            this.payMethod = payMethod
            if (payMethod === 1) {
                this.wayCode = 'QR_CASHIER'
                this.payType = 11
            } else if (payMethod === 2) {
                this.wayCode = 'AUTO_BAR'
                this.payType = 11
            } else if (payMethod === 3) {
                this.wayCode = 'CASH'
                this.payType = 12
            }
        },
        // 优惠券弹框
        couponClick () {
            if (this.couponNum > 0) {
                this.userCouponShow = true
                this.$nextTick(() => {
                    this.$refs.userCoupon.init(this.memberInfo.userId)
                })
            }
        },
        // 优惠券选择回调
        couponConfirmEvent (couponInfo) {
            this.couponIds = []
            this.couponUserIds = []
            if (JSON.stringify(couponInfo) !== '{}') {
                this.couponInfo = couponInfo
                this.couponReduceAmount = this.couponInfo.reduceAmount
                this.couponIds.push(couponInfo.couponId)
                this.couponUserIds.push(couponInfo.couponUserId)
                this.confirmOrder()
                this.getPayMoney()
            } else {
                this.couponInfo = couponInfo
                this.couponReduceAmount = 0
                this.confirmOrder()
                this.getPayMoney()
            }
        },
        // 支付金额计算
        getPayMoney () {
            if (this.couponReduceAmount > 0 && this.rdeductionAmount > 0) { // 优惠券与减免金额不为0计算支付金额
                this.actualAmount = (this.actualTotal - this.couponReduceAmount - this.rdeductionAmount).toFixed(2)
            } else if (this.couponReduceAmount > 0 && this.rdeductionAmount <= 0) { // 优惠券不为0减免金额为0计算支付金额
                this.actualAmount = (this.actualTotal - this.couponReduceAmount).toFixed(2)
            } else if (this.couponReduceAmount <= 0 && this.rdeductionAmount > 0) { // 优惠券为0减免金额不为0计算支付金额
                this.actualAmount = (this.actualTotal - this.rdeductionAmount).toFixed(2)
            } else { // 优惠券减免金额都为0计算支付金额
                this.actualAmount = this.actualTotal.toFixed(2)
            }
        },
        // 减免金额确认回调
        confirmEvent (res) {
            this.rdeductionAmount = res
            this.getPayMoney()
        },
        // 减免金额弹框
        rdeductionAmountClick () {
            if (this.rdeductionAmount > 0) {
                this.rdeductionAmount = 0
                this.getPayMoney()
            } else {
                this.calculationShow = true
                this.$nextTick(() => {
                    this.$refs.calculation.init()
                })
            }
        },
        init () {
            this.getProdList(this.page)
            this.getCategory()
        },
        // 确认订单
        buyNow () {
            if (this.selectProdIds.length > 0) {
                this.confirmOrder()
            } else {
                this.$message({
                    message: '请选择商品',
                    type: 'warning',
                    offset: 150
                })
            }
        },
        // 订单确认
        confirmOrder () {
            this.confirmLoading = true
            this.$http({
                url: this.$http.adornUrl('/multishop/order/confirm'),
                method: 'POST',
                data: this.$http.adornData({
                    addrId: 0,
                    couponIds: this.couponIds,
                    couponUserIds: this.couponUserIds,
                    dvyType: 3, // 配送类型 1:快递 2:自提 3：无需快递 4:同城配送
                    isScorePay: this.isScorePay,
                    userChangeCoupon: this.userChangeCoupon,
                    userUseScore: this.isScorePay ? this.userUseScore : 0,
                    userId: this.memberInfo.userId,
                    isMall: 1
                })
            }).then(({data}) => {
                console.log('confirm', data)
                this.confirmLoading = false
                this.payShow = true
            }).finally(() => {
                this.confirmLoading = false
            })
        },
        // 订单提交
        submitOrder () {
            if (this.payType > 0) {
                if (this.orderNumbers) {
                    if (this.wayCode == 'AUTO_BAR') {
                        this.payCodeModalShow = true
                        this.$nextTick(() => {
                            this.$refs.payCodeModal.init()
                        })
                    } else if (this.wayCode == 'QR_CASHIER') {
                        this.sendPay()
                    }
                } else {
                    this.submitLoading = true
                    let obj = {
                        isScorePay: this.isScorePay,
                        orderSelfStationDto: this.orderSelfStationDto,
                        orderInvoiceList: null,
                        virtualRemarkList: [],
                        orderShopParams: [this.orderShopParam],
                        userId: this.memberInfo.userId
                    }
                    this.$http({
                        url: this.$http.adornUrl('/multishop/order/submit'),
                        method: 'POST',
                        data: this.$http.adornData(obj)
                    }).then(({data}) => {
                        this.orderNumbers = data.orderNumbers
                        this.orderFlag = true
                        this.submitLoading = false
                        this.payBtnShow = true
                        this.toPay()
                    }).finally(() => {
                        this.submitLoading = false
                    })
                }
            } else {
                this.$message({
                    message: '请选择支付方式！',
                    type: 'warning',
                    offset: 150
                })
            }
        },
        // 现金支付确认
        cashPay () {
            this.upDataOrderInfo()
        },
        // 支付
        toPay () {
            if (this.payType > 0) {
                if (this.wayCode == 'AUTO_BAR') {
                    this.payCodeModalShow = true
                    this.$nextTick(() => {
                        this.$refs.payCodeModal.init()
                    })
                } else if (this.wayCode == 'QR_CASHIER') {
                    this.sendPay()
                }
            } else {
                this.$message({
                    message: '请选择支付方式！',
                    type: 'warning',
                    offset: 150
                })
            }
        },
        confirmSendPay (code) {
            console.log('code', code)
            this.sendPay(code)
        },
        sendPay (code = '') {
            this.payLoading = true
            this.$http({
                url: this.$http.adornUrl('/multishop/order/pay'),
                method: 'POST',
                data: this.$http.adornData({
                    payType: this.payType,
                    orderNumbers: this.orderNumbers,
                    wayCode: this.wayCode,
                    returnUrl: '',
                    userId: this.memberInfo.userId,
                    authCode: code
                })
            }).then(({data}) => {
                if (this.wayCode == 'QR_CASHIER') { //如果是主扫 展示二维码
                    this.payLoading = true
                    this.payModalShow = true
                    this.$nextTick(() => {
                        this.$refs.payModal.init(data.payData)
                    })
                }
                // 开始循环调用接口进行查询订单状态
                this.queryOrderPayStatus()
            }).finally(() => {
                this.payLoading = true
            })
        },
        // 支付按钮取消
        payModalColseBtn () {
            this.payLoading = false
        },
        // 商品搜索
        prodSearch () {
            this.getProdList(this.page)
        },
        // 分类点击
        categoryClick (categoryId) {
            this.shopCategoryId = categoryId
            this.page.currentPage = 1
            this.getProdList(this.page)
        },
        // 商品点击
        prodClick (prodInfo) {
            this.skuListLen = prodInfo.skuList.length
            if (prodInfo.skuList.length > 1) {
                if (JSON.stringify(this.memberInfo) !== '{}') {
                    this.prodSkuShow = true
                    this.$nextTick(() => {
                        this.$refs.prodSkuSelect.init(prodInfo.prodId)
                    })
                } else {
                    this.$message({
                        message: '请选择会员',
                        type: 'warning',
                        duration: 1000,
                        offset: 150
                    })
                }
            } else {
                if (prodInfo.totalStocks === 0) {
                    this.$message({
                        message: '库存不足',
                        type: 'warning',
                        offset: 150
                    })
                } else {
                    if (JSON.stringify(this.memberInfo) !== '{}') {
                        // 商品加入购物车
                        this.prodAddShopCart(prodInfo, 1)
                    } else {
                        this.$message({
                            message: '请选择会员',
                            type: 'warning',
                            duration: 1000,
                            offset: 150
                        })
                    }
                }
            }
        },
        prodAddToCart (prodInfo, prodNum) {
            console.log(prodInfo)
            this.prodCartLoading = true
            this.$http({
                url: this.$http.adornUrl('/multishop/shopCart/changeItem'),
                method: 'POST',
                data: this.$http.adornData({
                    basketId: 0,
                    count: prodNum,
                    prodId: prodInfo.prodId,
                    skuId: prodInfo.skuId,
                    shopId: this.shopId,
                    userId: this.memberInfo.userId,
                    isMall: 1
                })
            }).then(({data}) => {
                let flag = true
                let prodIndex = 0
                for (let i = 0; i < this.selectProdList.length; i++) {
                    if (prodInfo.prodId === this.selectProdList[i].prodId && prodInfo.skuId === this.selectProdList[i].skuId) {
                        flag = false
                        prodIndex = i
                    }
                }
                if (flag) {
                    this.selectProdIds.push(prodInfo.prodId)
                    prodInfo.prodCount = prodNum
                    this.selectProdList.push(prodInfo)
                } else {
                    this.selectProdList[prodIndex].prodCount += prodNum
                }
                this.prodCartLoading = false
                // 下单商品数量和下单金额计算
                this.getProdNumAndMoney()
            }).finally(() => {
                this.prodCartLoading = false
            })
        },
        // 商品加入购物车 prodNum为商品增加减少数量
        prodAddShopCart (prodInfo, prodNum) {
            this.prodCartLoading = true
            let param = {
                basketId: 0,
                count: prodNum,
                prodId: prodInfo.prodId,
                skuId: prodInfo.skuId,
                shopId: this.shopId,
                userId: this.memberInfo.userId,
                isMall: 1
            }
            if (this.skuListLen == 1) {
                param.skuId = prodInfo.skuList[0].skuId
                prodInfo.skuId = prodInfo.skuList[0].skuId
            }
            this.$http({
                url: this.$http.adornUrl('/multishop/shopCart/changeItem'),
                method: 'POST',
                data: this.$http.adornData(param)
            }).then(({data}) => {
                let flag = true
                let prodIndex = 0
                for (let i = 0; i < this.selectProdList.length; i++) {
                    if (prodInfo.prodId === this.selectProdList[i].prodId && prodInfo.skuId === this.selectProdList[i].skuId) {
                        flag = false
                        prodIndex = i
                    }
                }
                if (flag) {
                    this.selectProdIds.push(prodInfo.prodId)
                    prodInfo.prodCount = 1
                    this.selectProdList.push(prodInfo)
                } else {
                    this.selectProdList[prodIndex].prodCount += prodNum
                }
                this.prodCartLoading = false
                // 下单商品数量和下单金额计算
                this.getProdNumAndMoney()
            }).finally(() => {
                this.prodCartLoading = false
            })
        },
        // 删除购物车商品
        delProdShopCart (prodIds, type) {
            this.prodCartLoading = true
            this.$http({
                url: this.$http.adornUrl('/multishop/shopCart/deleteItem'),
                method: 'POST',
                data: this.$http.adornData({
                    prodIds: prodIds,
                    userId: this.memberInfo.userId
                })
            }).then(({data}) => {
                // 单商品删除
                if (type === 0) {
                    let prodIdIndex = this.selectProdIds.findIndex(item => item === prodIds[0])
                    this.selectProdIds.splice(prodIdIndex, 1)
                    let prodListIndex = this.selectProdList.findIndex(item => item.prodId === prodIds[0])
                    this.selectProdList.splice(prodListIndex, 1)
                } else { // 所有商品删除
                    this.selectProdIds = []
                    this.selectProdList = []
                    this.prodNum = 0
                    this.actualTotal = 0.00
                }
                // 整单取消清空会员信息
                if (this.wholeOrderFlag) {
                    this.memberInfo = {}
                    this.payLoading = false
                    // this.getDefMemberInfo()
                }
                this.prodCartLoading = false
                // 下单商品数量和下单金额计算
                this.getProdNumAndMoney()
            }).finally(() => {
                this.prodCartLoading = false
            })
        },
        // 清理购物车
        clearCart () {
            if (this.memberInfo.userId) {
                this.$http({
                    url: this.$http.adornUrl('/multishop/shopCart/deleteItemByUserId'),
                    method: 'POST',
                    data: this.$http.adornData({
                        userId: this.memberInfo.userId
                    })
                }).then(({data}) => {

                })
            }
        },
        // 商品下单数量改变
        changeProdNum (prodInfo, count) {
            // 商品数量为1 且点击 -1
            if (count === -1 && prodInfo.prodCount === 1) {
                return
            } else {
                this.update = false
                for (let i = 0; i < this.selectProdList.length; i++) {
                    if (prodInfo.prodId === this.selectProdList[i].prodId && prodInfo.skuId === this.selectProdList[i].skuId) {
                        this.$nextTick(() => {
                            this.update = true
                            // this.selectProdList[i].prodCount += count
                            // 商品加入购物车
                            this.prodAddShopCart(this.selectProdList[i], count)
                            // 下单商品数量和下单金额计算
                            this.getProdNumAndMoney()
                        })
                    }
                }
            }
        },
        // 下单商品数量和下单金额计算
        getProdNumAndMoney () {
            // 下单商品数量
            let allProdCount = 0
            allProdCount = this.selectProdList.reduce((allProdCount, item) => {
                return allProdCount + item.prodCount
            }, 0)
            this.prodNum = allProdCount
            // 下单总金额
            let money = 0
            money = this.selectProdList.reduce((money, item) => {
                return ((money + (item.price * item.prodCount)) * 100).toFixed(2) / 100
            }, 0)
            this.actualTotal = money
            this.actualAmount = money
        },
        // 删除下单商品
        delProd (prodId) {
            let prodIds = [prodId]
            this.delProdShopCart(prodIds, 0)
        },
        // 清空
        clearProd () {
            this.delProdShopCart(this.selectProdIds, 1)
        },
        // 取消
        cancel () {
            this.payShow = false
        },
        // 删除订单
        delOrder () {
            this.wholeOrderCancel()
            this.payShow = false
        },
        // 备注弹框
        remarkClick () {
            this.remarkShow = true
        },
        // 备注弹框关闭
        remarkDialogClose () {
            this.remarkShow = false
            this.orderShopParam.remarks = ''
        },
        // 备注确定
        remarkBtn () {
            this.remarkShow = false
        },
        // 获取分类
        getCategory (current = 1) {
            this.$http({
                url: this.$http.adornUrl('/prod/category/pageCategory'),
                method: 'get',
                params: this.$http.adornParams({
                    current,
                    size: 1000
                })
            }).then(({data}) => {
                this.categoryList = data.records
                this.shopId = this.categoryList[0].shopId
                this.orderShopParam.shopId = this.categoryList[0].shopId
            })
        },
        // 现金支付更新订单信息
        upDataOrderInfo () {
            this.cashLoading = true
            let obj = {
                isScorePay: this.isScorePay,
                orderSelfStationDto: this.orderSelfStationDto,
                orderInvoiceList: null,
                virtualRemarkList: [],
                orderShopParams: [this.orderShopParam],
                userId: this.memberInfo.userId
            }
            this.$http({
                url: this.$http.adornUrl('/multishop/order/submit'),
                method: 'POST',
                data: this.$http.adornData(obj)
            }).then(({data}) => {
                this.orderNumbers = data.orderNumbers
                this.$http({
                    url: this.$http.adornUrl('/order/order/upDataOrderInfoByorderNumber'),
                    method: 'get',
                    params: this.$http.adornParams({
                        orderNumber: this.orderNumbers
                    })
                }).then(({data}) => {
                    this.cashLoading = false
                    this.$message({
                        message: '提交成功！',
                        type: 'success',
                        offset: 150
                    })
                    this.wholeOrderCancel()
                }).finally(() => {
                    this.cashLoading = false
                })
            }).finally(() => {
                this.cashLoading = false
            })
        },
        // 会员改变
        memberChange () {
            this.memberVisible = true
            this.$nextTick(() => {
                this.$refs.memberList.init()
            })
        },
        // 会员选择回调
        memberSelectChange (member) {
            this.memberInfo = member
            this.getUserCoupon(member.userId)
            this.getShopCartInfo()
            this.selectProdIds = []
            this.selectProdList = []
            this.prodNum = 0
            this.actualTotal = 0.00
            // 下单商品数量和下单金额计算
            this.getProdNumAndMoney()
            this.compType = 0
            this.page.currentPage = 1
            this.page.pageSize = 12
            this.getProdList(this.page)
        },
        // 当前页
        currentChangeHandle (val) {
            this.page.currentPage = val
            this.getProdList(this.page)
        },
        compClick (v) {
            if (v === 1 && this.memberInfo.score === undefined) {
                this.memberVisible = true
                this.$nextTick(() => {
                    this.$refs.memberList.init()
                })
            } else {
                this.compType = v
            }
        },
        // 获取会员拥有优惠券
        getUserCoupon (userId) {
            this.$http({
                url: this.$http.adornUrl('/admin/user/couponUserInfo'),
                method: 'get',
                params: this.$http.adornParams({
                    userId: userId
                })
            }).then(({data}) => {
                this.couponNum = data.couponNum
            })
        },
        // 获取店铺下的商品列表
        getProdList (page, params, newData = false) {
            page = (page === undefined ? this.page : page)
            this.prodListLoading = true
            if (newData || !this.theData) {
                this.theData = {
                    current: page == null ? this.page.currentPage : page.currentPage,
                    size: page == null ? this.page.pageSize : page.pageSize
                }
            } else {
                this.theData.current = page == null ? this.page.currentPage : page.currentPage
                this.theData.size = page == null ? this.page.pageSize : page.pageSize
                this.theData.partyCode = this.page.partyCode
                this.theData.prodName = this.page.prodName
            }
            this.theData.status = 1
            this.theData.prodType = 0
            this.theData.shopCategoryId = this.shopCategoryId
            this.$http({
                // url: this.$http.adornUrl('/admin/search/prod/page'),
                url: this.$http.adornUrl('/prod/prod/prodSkuPage'),
                method: 'get',
                params: this.$http.adornParams(
                    Object.assign(this.theData, params
                    ), false
                )
            }).then(({data}) => {
                this.prodList = data.records
                for (let i = 0; i < this.prodList.length; i++) {
                    let prodNum = 0
                    prodNum = this.prodList[i].skuList.reduce((prodNum, item) => {
                        return (prodNum + item.stocks)
                    }, 0)
                    this.prodList[i].totalStocks = prodNum
                }
                this.page.total = data.total
                this.prodListLoading = false
            })
        },
        queryOrderPayStatus () { //查询订单支付状态
            this.checkIsPay = setInterval(() => {
                if (this.payCodeModalShow || this.payModalShow) {
                    this.$http({
                        url: this.$http.adornUrl('/multishop/order/isPay/0/' + this.orderNumbers + '/' + this.memberInfo.userId),
                        method: 'GET'
                    }).then(({data}) => {
                        if (data == true) {
                            //把支付条码二维码的弹框关闭
                            this.payModalShow = false
                            this.payCodeModalShow = false
                            //支付成功
                            clearInterval(this.checkIsPay)
                            this.$confirm('用户支付成功！', '提示', {
                                confirmButtonText: '确定',
                                type: 'success',
                                center: true
                            }).then(() => {
                                location.reload()
                            })
                        }
                    })
                }
            }, 3000)
        }
    },
    destroyed () {
        if (this.checkIsPay) { //如果定时器在运行则关闭
            clearInterval(this.checkIsPay)
        }
    }
}
</script>

<style lang="scss" scoped>
.billingCashier {
    display: flex;
    font-size: 15px;
    height: 78vh;
    background: #fff;
    padding: 0 10px;
    overflow-x: scroll;

    .left {
        min-width: 320px;
        flex: 1 1 0%;
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;

        .header-box {
            padding: 0 15px 15px 0;
            border-bottom: 1px solid #e6e6e6;

            .order-time {
                display: flex;
                align-items: center;

                .feeTime {
                    width: 80px;
                    text-align: center;
                    padding: 7px;
                    border: 1px solid #e5e5e5;
                    border-radius: 2px;
                    margin-right: 15px;
                }
            }

            .header {
                background-image: url(../../../assets/img/cashier/member-bg.png);
                background-repeat: no-repeat;
                height: 80px;
                display: flex;
                align-items: center;
                padding: 0 15px;
                background-size: 100% 100%;
                border-radius: 5px;

                .header-img img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                }

                .head-info {
                    flex: 1;
                    margin-left: 10px;

                    .name {
                        font-size: 14px;
                        color: #fff;
                        display: flex;
                        align-items: center;

                        .text {
                            max-width: 60px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }

                        .level {
                            background: #fff;
                            border: 1px solid #8558fa;
                            border-radius: 5px;
                            font-size: 12px;
                            color: #8558fa;
                            margin-left: 5px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            height: 20px;
                            line-height: 20px;
                            width: 60px;
                            text-align: center;
                        }
                    }

                    .mobile {
                        font-size: 13px;
                        color: #fff;
                        margin-top: 5px;
                    }

                    .head-info-bottom {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;
                        margin-top: 5px;

                        .txt {
                            color: #fff;
                            font-size: 12px;
                        }
                    }
                }
            }
        }

        .content {
            padding: 15px 15px 15px 0;
            color: #303133;
            flex: 1;
            height: 0;
            display: flex;
            flex-direction: column;

            .title {
                font-size: 14px;
                display: flex;
                justify-content: space-between;

                .clear {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                }
            }

            .content-list {
                margin-top: 10px;
                flex: 1;
                height: 0;
                overflow-y: scroll;

                .content-item {
                    position: relative;
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    border-bottom: 1px solid #e6e6e6;
                    padding: 10px 0;

                    .item-img {
                        width: 50px;
                        height: 50px;
                        display: flex;
                        align-items: center;
                    }

                    .item-info {
                        flex: 1;
                        margin-left: 10px;
                        width: 0;
                        min-width: 0;

                        .item-name {
                            font-size: 14px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            width: 200px;
                        }

                        .item-del {
                            position: absolute;
                            right: 0;
                            color: #8558fa;
                            cursor: pointer;
                            margin-top: -20px;
                            font-size: 14px;
                        }

                        .item-price {
                            font-size: 15px;
                            margin-top: 5px;
                            margin-left: -3px;
                            display: flex;
                            align-items: baseline;

                            .unit {
                                font-size: .12rem;
                            }
                        }
                    }

                    .item-num {
                        display: flex;
                        align-items: center;
                        margin-left: 10px;
                        margin-top: 30px;

                        .num-dec {
                            width: 25px;
                            height: 25px;
                            background: #e6e6e6;
                            border: 1px solid #e6e6e6;
                            border-radius: 30%;
                            text-align: center;
                            line-height: 20px;
                            font-size: 25px;
                            margin-right: 10px;
                            cursor: pointer;
                            transition: .3s;
                        }

                        .num {
                            font-size: 14px;
                        }

                        .num-inc {
                            width: 25px;
                            height: 25px;
                            background: #8558fa;
                            border: 1px solid #e6e6e6;
                            border-radius: 30%;
                            text-align: center;
                            line-height: 23px;
                            font-size: 25px;
                            margin-left: 10px;
                            cursor: pointer;
                            transition: .3s;
                            color: #fff;
                        }
                    }
                }
            }

            .empty {
                text-align: center;
            }
        }

        .bottom {
            width: 100%;
            padding: 15px 15px 15px 0;
            box-sizing: border-box;
            background-color: #fff;
            border-top: 1px solid #e6e6e6;

            .bottom-info {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .bottom-left {
                    display: flex;
                }
            }

            .bottom-btn {
                display: flex;
                align-items: center;
                margin-top: 10px;
                justify-content: center;
            }
        }

        .pay-shade {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-color: hsla(0, 0%, 100%, .6);
            z-index: 10;
        }
    }

    .middle {
        height: 100%;

        .comp-wrap {
            max-width: 135px;
            border: 1px solid #e6e6e6;
            border-radius: 2px;
            padding: 20px 17px;
            height: 100%;

            .comp-btn {
                overflow: initial;
                margin-bottom: 20px;
                margin-left: 0 !important;
                width: 100px;
            }
        }
    }

    .right {
        width: 100%;

        .list-wrap {
            padding: 0 20px;
            border: 1px solid #e6e6e6;
            border-radius: 2px;
            height: 100%;
            border-left: 0;
            box-sizing: border-box;

            .content {
                /*height: 100%;*/

                .container {
                    height: 100%;
                }

                .goods-container {
                    .header-operation {
                        padding: 20px 0;
                        border-bottom: 1px solid #e6e6e6;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;

                        .header-operation-right {
                            display: flex;
                            align-items: center;
                        }
                    }
                }

                .content {
                    position: relative;
                    box-sizing: border-box;
                    padding: 15px 0;
                    height: calc(100% - 78px);
                    -webkit-transform: rotate(0);
                    transform: rotate(0);
                    display: flex;
                    flex-direction: row-reverse;

                    .type-switch {
                        width: 100px;
                        margin-left: 10px;
                        font-size: 14px;
                        margin-bottom: 15px;
                        white-space: nowrap;
                        border-left: 1px solid #e6e6e6;
                        padding-left: 10px;
                        height: 100%;

                        .item-content {
                            display: flex;
                            flex-direction: column;
                        }

                        .switch-item {
                            padding: 10px 20px;
                            color: #303133;
                            font-size: 14px;
                            cursor: pointer;
                            display: inline-block;
                        }

                        .active {
                            background-color: rgba(133, 88, 250, .1);
                            color: #8558fa;
                        }
                    }

                    .list-wrap {
                        position: relative;
                        flex: 1;
                        padding-bottom: 40px;
                        border: 0;

                        .prod-content {
                            width: 100%;
                            height: 100%;

                            .table-list {
                                display: flex;
                                align-items: center;
                                flex-wrap: wrap;
                                overflow-y: scroll;
                                /*height: 67vh;*/
                                align-content: flex-start;

                                .table-item {
                                    border: 1px solid #e6e6e6;
                                    display: flex;
                                    flex-direction: column;
                                    width: 180px;
                                    height: 110px;
                                    padding: 10px;
                                    box-sizing: border-box;
                                    margin-right: 10px;
                                    margin-bottom: 10px;
                                    cursor: pointer;
                                    transition: all .3s;
                                    position: relative;

                                    .item-name {
                                        height: 40px;
                                        margin-bottom: 5px;
                                        word-break: break-all;
                                        text-overflow: ellipsis;
                                        overflow: hidden;
                                        display: -webkit-box;
                                        -webkit-line-clamp: 2;
                                        -webkit-box-orient: vertical;
                                    }

                                    .item-info {
                                        cursor: pointer;
                                        flex: 1;
                                        display: flex;

                                        .item-img {
                                            width: 50px;
                                            height: 50px;
                                            display: flex;
                                            align-items: center;
                                            overflow: hidden;
                                        }

                                        .item-other {
                                            display: flex;
                                            flex-direction: column;
                                            justify-content: space-around;
                                            margin-left: 10px;

                                            .item-money {
                                                font-size: 15px;
                                                color: #fe2278;
                                                line-height: 1;
                                                display: flex;
                                                align-items: baseline;

                                                .util {
                                                    font-size: 12px;
                                                }
                                            }

                                            .item-money-active {
                                                color: #fff;
                                            }
                                        }
                                    }
                                }

                                .active {
                                    border-color: #8558fa;
                                    background-color: #8558fa;
                                    color: #fff;
                                }
                            }
                        }
                    }
                }

                .member-detail-wrap {
                    width: 100%;
                    border-left: 0;

                    .member-head {
                        height: 66px;
                        line-height: 66px;
                        box-sizing: border-box;
                        border-bottom: 1px solid #e6e6e6;
                        font-size: 14px;
                    }

                    .member-content {
                        padding: 15px;
                        width: 100%;
                        box-sizing: border-box;

                        .content-block {
                            width: 100%;
                            box-sizing: border-box;
                            display: flex;
                            align-items: center;

                            .item-img {
                                width: 70px;
                                height: 70px;
                                border-radius: 50%;
                                box-sizing: border-box;

                                img {
                                    width: 100%;
                                    height: 100%;
                                    border-radius: 50%;
                                }
                            }

                            .item-content {
                                padding-left: 15px;
                                width: calc(100% - 70px);
                                box-sizing: border-box;

                                .item-title {
                                    width: 100%;
                                    font-size: 16px;
                                    align-items: center;
                                    display: flex;

                                    .item-title-text {
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        white-space: nowrap;
                                        max-width: 50%;
                                        font-size: 16px;
                                    }

                                    .item-label {
                                        border: 1px solid #8558fa;
                                        color: #8558fa;
                                        background-color: #fff;
                                        border-radius: 2px;
                                        width: fit-content;
                                        padding: 1px 5px;
                                        margin-left: 15px;
                                    }
                                }

                                .info-list {
                                    margin-top: 15px;
                                    display: flex;
                                    justify-content: space-between;

                                    .info-item {
                                        font-size: 14px;
                                        margin-right: 5px;
                                    }
                                }
                            }
                        }

                        .account {
                            border: 1px solid #e6e6e6;
                            background-color: #fff;
                            padding: 25px 0;
                            display: flex;
                            justify-content: space-around;
                            margin-top: 20px;
                            border-radius: 3px;
                            align-items: baseline;

                            .content-data-item {
                                .data-item-value {
                                    font-size: 26px;
                                    margin-top: 10px;
                                }

                                .data-item-action {
                                    margin-top: 10px;
                                    color: #8558fa;
                                    cursor: pointer;
                                    float: left;
                                }
                            }
                        }

                        .action {
                            display: flex;
                            justify-content: flex-start;
                            margin-top: 20px;

                            .content-data-item {
                                border: 1px solid #e6e6e6;
                                width: calc(100% / 6);
                                background-color: #fff;
                                display: flex;
                                padding: 15px 0;
                                border-radius: 3px;
                                align-items: center;
                                text-align: center;
                                flex-direction: column;
                                margin-right: 15px;
                                cursor: pointer;

                                .data-item-icon {
                                    width: 55px;
                                    height: 55px;
                                }

                                .data-item-value {
                                    margin-top: 10px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .payment-wrap {
        width: 100%;

        .header {
            height: 66px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #e6e6e6;
        }

        .body {
            flex: 1;
            height: 92%;
            padding: 15px 0;
            box-sizing: border-box;
            display: flex;

            .info-wrap {
                flex: 1;
                width: 0;
                margin-right: 15px;
                display: flex;
                flex-direction: column;
                min-width: 400px;

                .info {
                    flex: 1;
                    background-color: #f7f8fa;
                    padding-bottom: 15px;
                    box-sizing: border-box;

                    .pay-content {
                        margin: 0 15px;
                        width: calc(100% - 30px);
                        box-sizing: border-box;

                        .payment-money {
                            text-align: right;
                            font-size: 20px;
                            border-bottom: 1px solid #e6e6e6;
                            line-height: 60px;
                        }
                    }

                    .title {
                        line-height: 60px;
                        font-size: 16px;
                    }

                    .item-flex {
                        display: flex;
                        flex-wrap: wrap;
                    }

                    .type-item {
                        padding: 25px 10px;
                        background: #fff;
                        border: 1px solid #e6e6e6;
                        display: flex;
                        align-items: center;
                        font-size: 16px;
                        margin: 0 10px 10px 0;
                        width: calc((100% - 30px) / 3);
                        line-height: 1;
                        cursor: pointer;
                        position: relative;
                        border-radius: 2px;

                        .icon-img {
                            width: 30px;
                            height: 30px;
                            margin-right: 10px;
                        }

                        .name {
                            flex: 1;
                            width: 0;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            display: flex;

                            .text {
                                color: #fe2278;
                                margin-left: 5px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                        }
                    }

                    .active {
                        border-color: #8558fa;
                    }

                    .pay-type {
                        .type-item {
                            padding: 15px 10px;

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
                                width: 0;
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

                        .active {
                            border-color: #8558fa;
                        }
                    }
                }

                .button-wrap {
                    padding-top: 15px;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;

                    .print-ticket {
                        flex: 1;
                        width: 0;
                        display: flex;
                        align-items: center;
                    }
                }
            }
        }

        .bill-wrap {
            width: 300px;
            border: 1px solid #e6e6e6;

            .title {
                text-align: center;
                font-size: 20px;
                border-bottom: 1px solid #e6e6e6;
                line-height: 60px;
            }

            .body {
                padding: 0;
                margin: 0 15px;
                display: block;
                height: auto;

                .bill-info {
                    display: flex;
                    justify-content: space-between;
                    line-height: 1;
                    align-items: center;
                    margin-top: 20px;

                    .text {
                        color: #fe2278;
                    }
                }

                .block-title {
                    position: relative;
                    text-align: center;
                    width: 100%;
                    height: 35px;
                    margin-top: 20px;
                }

                .block-title::before {
                    content: "";
                    position: absolute;
                    width: 100%;
                    top: 50%;
                    left: 0;
                    border-top: 1px dashed #e6e6e6;
                }
            }
        }
    }

    .el-button--mini {
        padding: 7px 7px;
    }

    .el-button--primary {
        background-color: #8558fa;
        border-color: #8558fa;
    }

    ::-webkit-scrollbar {
        width: 0 !important;
    }

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
        position: absolute;
        bottom: 0;
        right: 0;
    }

    .disabled {
        pointer-events: none;
        cursor: default;
        opacity: 0.6;
    }

    .el-message {
        z-index: 10000 !important;
    }
}
</style>
