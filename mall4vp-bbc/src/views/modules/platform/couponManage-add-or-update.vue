<template>
    <el-dialog
        class="mod-coupon-add-or-update"
        :title="dataForm.couponId ? $t('coupon.modifyCoupon') : $t('coupon.newCoupon')"
        :close-on-click-modal="false"
        :before-close="beforeClose"
        :visible.sync="visible"
    >
        <el-form
            size="small"
            v-if="show"
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            :label-width="this.$i18n.t('language') === 'language' ? '180px' : '110px'"
        >
            <el-form-item :label="$t('coupon.couponName')" prop="couponName">
                <el-input
                    v-model.trim="dataForm.couponName"
                    :placeholder="$t('coupon.couponName')"
                    maxlength="20"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <!-- <el-form-item :label="$t('coupon.couponSubtitle')" prop="subTitle">
              <el-input
                v-model.trim="dataForm.subTitle"
                :placeholder="$t('coupon.couponSubtitle')"
                maxlength="32"
                show-word-limit
                :disabled="dataForm.couponId !== 0"
              ></el-input>
            </el-form-item> -->
            <el-form-item :label="$t('coupon.deliveryStatus')" size="mini" prop="putonStatus">
                <el-radio-group v-model="dataForm.putonStatus" :disabled="dataForm.putonStatus < 0">
                    <el-radio :label="0">{{ $t('coupon.waitAutoLaunch') }}
                        <el-tooltip class="item" effect="light" placement="top">
                            <div slot="content">{{ $t('coupon.launchTip') }}</div>
                            <span>
             <i class="el-icon-question"></i>
            </span>
                        </el-tooltip>
                    </el-radio>
                    <el-radio :label="1">{{ $t('coupon.launched') }}</el-radio>
                    <el-radio :label="4">{{ $t('coupon.waitLaunch') }}</el-radio>
                    <el-radio :disabled="true" :label="-1">{{ $t('coupon.cancelLaunch') }}
                        <el-tooltip class="item" effect="light" placement="top">
                            <div slot="content">{{ $t('coupon.launchTip1') }}</div>
                            <span>
             <i class="el-icon-question"></i>
            </span>
                        </el-tooltip>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 投放时间 -->
            <el-form-item
                :label="this.$i18n.t('coupon.timeToMarket')"
                prop="launchTime"
                v-if="dataForm.putonStatus === 0"
            >
                <el-date-picker
                    v-model="dataForm.launchTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    :placeholder="this.$i18n.t('coupon.chooseLaunchTime')"
                ></el-date-picker>
            </el-form-item>
            <!-- 投放结束时间 -->
            <el-form-item
                    :label="this.$i18n.t('coupon.endTimeToMarket')"
                    prop="launchEndTime"
                    v-if="dataForm.putonStatus === 0"
            >
                <el-date-picker
                        v-model="dataForm.launchEndTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        :placeholder="this.$i18n.t('coupon.chooseLaunchEndTime')"
                ></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('coupon.getWay')" size="mini" prop="getWay">
                <el-radio-group v-model="dataForm.getWay" :disabled="dataForm.isGroup === 1" @change="handleGetWay">
                    <el-radio :label="0">{{ $t('coupon.receiveDirectly') }}</el-radio>
                    <el-radio :label="1">{{ $t('coupon.exchangeOrSystemIssue') }}</el-radio>
                    <!-- <el-radio :label="3">兑换券</el-radio> -->
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否团购" prop="isGroup">
                <el-radio-group v-model="dataForm.isGroup" @change="handleIsGroup">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item
                    label="团购金额"
                    prop="groupAmount"
                    v-if="dataForm.isGroup === 1"
            >
                <el-input
                        v-model="dataForm.groupAmount"
                        size="small"
                        type="number"
                        @change="groupAmountChange"
                        placeholder="团购金额"
                        min="0"
                >
                    <template slot="append">{{ $t('coupon.yuan') }}</template>
                </el-input>
            </el-form-item>

            <el-form-item label="投放来源" size="mini" prop="putSource">
                <el-radio-group v-model="dataForm.putSource">
                    <el-radio :label="1">平台</el-radio>
                    <el-radio :label="2">工会</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否需要付费会员领取" size="mini" prop="isPayMember">
              <el-radio-group v-model="dataForm.isPayMember">
                <el-radio :label="1">否</el-radio>
                <el-radio :label="2">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="类型" size="mini" prop="type">
                <el-radio-group v-model="dataForm.type">
                    <el-radio :label="1">线上券</el-radio>
                    <el-radio :label="2">线下券</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('coupon.couponType')" size="mini" prop="couponType">
                <el-radio-group v-model="dataForm.couponType" @change="couponTypeChange()">
                    <el-radio :label="1">{{ $t('coupon.cashCoupon') }}</el-radio>
                    <el-radio :label="2">{{ $t('coupon.discountVoucher') }}</el-radio>
                    <el-radio :label="4">提货卡/券</el-radio>
                    <el-radio :label="5">消费券</el-radio>
                    <!-- <el-radio :label="3">兑换券</el-radio> -->
                </el-radio-group>
            </el-form-item>
            <el-form-item label="提货卡/券名称" prop="cardName" v-if="dataForm.couponType === 4">
                <el-input
                    v-model.trim="dataForm.cardName"
                    placeholder="请输入提货卡/券名称"
                    maxlength="20"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item label="赠送券" prop="giveCouponId" v-if="dataForm.couponType === 4">
                <el-select v-model="dataForm.giveCouponId" placeholder="选择赠送券" filterable style="width: 100%">
                    <el-option v-for="(item,index) in couponList" :key="index" :label="item.couponName" :value="item.couponId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('coupon.conditionsOfUse')" prop="cashCondition">
                {{ $t('coupon.spendMoreThan') }}
                <el-input
                    v-model="dataForm.cashCondition"
                    :placeholder="$t('coupon.conditionsOfUse')"
                    type="number"
                    @change="cashConditionChange"
                    min="0"
                >
                    <template slot="append">{{ $t('coupon.yuan') }}</template>
                </el-input>
            </el-form-item>
            <el-form-item
                :label="$t('coupon.reductionAmount')"
                prop="reduceAmount"
                v-if="dataForm.couponType === 1 || dataForm.couponType === 5"
            >
                <el-input
                    v-model="dataForm.reduceAmount"
                    :placeholder="$t('coupon.reductionAmount')"
                    type="number"
                    @change="checkNumber(1)"
                    :min="0.01"
                    :max="9999999999999"
                >
                    <template slot="append">{{ $t('coupon.yuan') }}</template>
                </el-input>
            </el-form-item>
            <el-form-item
                :label="$t('coupon.discountAmount')"
                prop="couponDiscount"
                v-if="dataForm.couponType === 2"
            >
                <el-input
                    v-model="dataForm.couponDiscount"
                    :placeholder="$t('coupon.discountAmount')"
                    type="number"
                    @change="checkNumber(2)"
                    min="0"
                >
                    <template slot="append">{{ $t('coupon.off') }}</template>
                </el-input>
            </el-form-item>
            <el-form-item
                label="提货卡/券金额"
                prop="reduceAmount"
                v-if="dataForm.couponType === 4"
            >
                <el-input
                    v-model="dataForm.reduceAmount"
                    placeholder="提货卡/券金额"
                    type="number"
                    @change="checkNumber(2)"
                    min="0"
                >
                    <template slot="append">{{ $t('coupon.yuan') }}</template>
                </el-input>
            </el-form-item>
            <!-- 生效时间 -->
            <el-form-item :label="$t('coupon.effectiveType')" np size="mini" prop="validTimeType">
                <el-radio-group v-model="dataForm.validTimeType">
                    <el-radio :label="1">{{ $t('coupon.fixedTime') }}</el-radio>
                    <el-radio :label="2">{{ $t('coupon.effectiveAfterReceiving') }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                :label="$t('coupon.startTime')"
                prop="startTime"
                v-if="dataForm.validTimeType === 1"
            >
                <el-date-picker
                    v-model="dataForm.startTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    :placeholder="$t('coupon.startTime')"
                ></el-date-picker>
            </el-form-item>
            <el-form-item
                :label="$t('coupon.endTime')"
                prop="endTime"
                v-if="dataForm.validTimeType === 1"
            >
                <el-date-picker
                    v-model="dataForm.endTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    :placeholder="$t('coupon.endTime')"
                ></el-date-picker>
            </el-form-item>
            <el-form-item
                :label="$t('coupon.AfterReceipt')"
                prop="afterReceiveDays"
                v-if="dataForm.validTimeType === 2"
            >
                <el-input
                    v-model="dataForm.afterReceiveDays"
                    type="number"
                    style="width: 300px"
                    oninput="if(value>3652)value=1"
                    :max="3652"
                >
                    <template slot="append">{{ $t('marketing.effectiveDays') }}</template>
                </el-input>
                <el-tooltip class="item" effect="dark" :content="$t('marketing.maxTimeTip')" placement="top">
                    <i class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="时间类型" size="mini" prop="timeType" v-if="dataForm.validTimeType === 2">
                <el-radio-group v-model="dataForm.timeType">
                    <el-radio :label="1">按天</el-radio>
                    <el-radio :label="2">按小时</el-radio>
                    <el-radio :label="3">按分钟</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                :label="dataForm.timeType === 1 ? $t('coupon.validDate') : dataForm.timeType === 2 ? '有效小时数' : '有效分钟数'"
                prop="validDays"
                v-if="dataForm.validTimeType === 2"
            >
                <el-input
                    v-model.number="dataForm.validDays"
                    type="number"
                    style="width: 300px"
                    oninput="if(value>3652)value=1"
                    :max="3652">
                    <template slot="append">{{ dataForm.timeType === 1 ? $t('coupon.day') : dataForm.timeType === 2 ? '小时' : '分钟' }}</template>
                </el-input>
                <el-tooltip class="item" effect="dark" :content="$t('marketing.maxTimeTip')" placement="top">
                    <i class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item :label="$t('coupon.restrictionsPerPerson')" prop="limitNum">
                <el-input v-model="dataForm.limitNum" :disabled="dataForm.putonStatus < 0 || (dataForm.getWay === 0 && dataForm.isGroup === 0)" type="number" min="1" max="1000000000" @change="limitNumCheck">
                    <template slot="append">{{ $t('coupon.sheet')}}</template>
                </el-input>
            </el-form-item>
            <el-form-item :label="$t('coupon.stock')" prop="stocks">
                <el-input v-model="dataForm.stocks" type="number" min="1" max="1000000000" @change="stocksCheck">
                    <template slot="append">{{ $t('coupon.sheet') }}</template>
                </el-input>
            </el-form-item>
            <el-form-item :label="$t('coupon.couponImg')">
                <img-upload v-model="dataForm.couponImg"></img-upload>
            </el-form-item>
            <el-form-item :label="dataForm.isGroup === 0 ? $t('coupon.couponClaimRules') : '团券规则'" prop="claimRules">
                <el-input v-model="dataForm.claimRules" type="textarea" :rows="3"></el-input>
            </el-form-item>
            <el-form-item :label="$t('coupon.couponUseRules')" prop="useRules">
                <el-input v-model="dataForm.useRules" type="textarea" :rows="3"></el-input>
            </el-form-item>
            <el-form-item :label="$t('coupon.applicableGoods')" size="mini" prop="suitableProdType">
                <el-radio-group v-model="dataForm.suitableProdType">
                    <el-radio :label="0">{{ $t('coupon.allProductsParticipate') }}</el-radio>
                    <el-radio :label="1">{{ $t('coupon.participateInDesignatedProd') }}</el-radio>
                    <el-radio :label="2">{{ $t('coupon.specifiedProductsDoNotParticipate') }}</el-radio>
                    <el-radio :label="3">指定店铺参与</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="门店优惠" prop="storePreferential" v-if="dataForm.suitableProdType == 3">
                <tiny-mce
                    v-model="dataForm.storePreferential"
                    ref="content"
                    style="width: 95%"
                ></tiny-mce>
            </el-form-item>
            <el-form-item>
                <div
                    class="default-btn"
                    v-if="dataForm.suitableProdType === 1 || dataForm.suitableProdType === 2"
                    @click="prodsSelectHandle()"
                >{{ $t('coupon.selectGoods') }}
                </div>
                <div class="default-btn" v-if="dataForm.suitableProdType === 3" @click="shopsSelectHandle()">店铺选择</div>
            </el-form-item>
            <!-- 商品 -->
            <el-form-item style="width:100%" v-if="dataForm.suitableProdType === 1 || dataForm.suitableProdType === 2">
                <el-row>
                    <div></div>
                    <el-col v-for="(couponProd, index) in dataForm.couponProds" :key="index">
                        <el-card :body-style="{ padding: '0px' }" style="height: 160px;width: 120px">
                            <prod-pic
                                height="104px"
                                width="100%"
                                :pic="couponProd.pic"
                            ></prod-pic>
                            <div class="card-prod-bottom prod-line-height">
                                <span class="card-prod-name">{{ couponProd.prodName }}</span>
                                <div
                                    class="default-btn text-btn prod-text-left"
                                    @click="deleteProd(index)"
                                >{{ $t('coupon.delete') }}
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-form-item>

            <el-form-item style="width:100%" v-if="dataForm.suitableProdType === 3">
                <el-row>
                    <div></div>
                    <el-col v-for="(couponShop, index) in dataForm.couponShops" :key="index">
                        <el-card :body-style="{ padding: '0px' }" style="height: 160px;width: 120px">
                            <prod-pic height="104px" width="100%" :pic="couponShop.shopLogo"></prod-pic>
                            <div class="card-prod-bottom prod-line-height">
                                <span class="card-prod-name">{{ couponShop.shopName }}</span>
                                <div class="default-btn text-btn prod-text-left" @click="deleteShop(index)">{{ $t('coupon.delete') }}
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="show = false;visible = false">{{ $t('coupon.cancel') }}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{ $t('coupon.confirm') }}</div>
    </span>
        <!-- 商品选择弹窗-->
        <prods-select
            v-if="prodsSelectVisible"
            ref="prodsSelect"
            @refreshSelectProds="selectCouponProds"
        ></prods-select>

        <shop-select v-if="shopsSelectVisible" ref="shopsSelect" @refreshSelectShops="selectCouponShops"></shop-select>
    </el-dialog>
</template>

<script>
import ProdsSelect from '@/components/prods-reserve-selection'
import ShopSelect from '@/components/shop-selection'
import ProdPic from '@/components/prod-pic'
import ImgUpload from '@/components/img-upload'
import TinyMce from '@/components/tiny-mce'

export default {
    data () {
        var validate = (rule, value, callback) => {
            // if (!/^[1-9]\d*$/.test(value) && !this.dataForm.putonStatus) {
            if (!/^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/.test(Number(value))) {
                callback(new Error(this.$i18n.t('coupon.pleaseThan0')))
            } else {
                callback()
            }
        }
        var stockValidate = (rule, value, callback) => {
            // if (!/^[1-9]\d*$/.test(value) && !this.dataForm.putonStatus) {
            if (!/^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/.test(value) && this.dataForm.couponId === 0) {
                callback(new Error(this.$i18n.t('coupon.pleaseThan0')))
            } else {
                callback()
            }
        }
        var discountValidate = (rule, value, callback) => {
            if (!/^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/.test(Number(value))) {
                callback(new Error(this.$i18n.t('coupon.discountValidate')))
            } else if (parseInt(value) >= 10 || parseInt(value) < 0) {
                callback(new Error(this.$i18n.t('coupon.discountValidate')))
            } else {
                callback()
            }
        }
        var validateTime = (rule, value, callback) => {
            if (Date.parse(this.dataForm.startTime) >= Date.parse(this.dataForm.endTime)) {
                callback(new Error(this.$i18n.t('coupon.validateTime')))
            }
            if (rule.field === 'endTime' && new Date() > Date.parse(value)) {
                callback(new Error(this.$i18n.t('coupon.endTimeLimit')))
            } else {
                callback()
            }
        }
        return {
            show: true,
            visible: false,
            dataForm: {
                couponId: 0,
                couponName: '',
                subTitle: '',
                couponType: 1,
                type: 2,
                putSource: 1,
                reduceAmount: 0,
                couponDiscount: 0,
                cashCondition: 0,
                validTimeType: 1,
                getWay: 0,
                launchTime: null,
                startTime: null,
                endTime: null,
                afterReceiveDays: 0,
                timeType: 1,
                validDays: 0,
                stocks: 1,
                suitableProdType: 0,
                limitNum: 1,
                putonStatus: 0,
                couponProds: [],
                couponShops: [],
                couponImg:'',
                claimRules:'',
                useRules:'',
                storePreferential:'',
                launchEndTime:null,
                isGroup:0,
                groupAmount:0,
                cardName:'',
                giveCouponId:null,
                isPayMember:1
            },
            isSubmit: false,
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 10 // 每页显示多少条
            },
            putonStatus: 0,
            errorTip: false,
            dataListSelections: [],
            prodsSelectVisible: false,
            shopsSelectVisible: false,
            resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
            dataRule: {
                couponName: [
                    {required: true, message: this.$i18n.t('coupon.couponNameCannotBeEmpty'), trigger: 'blur'}
                ],
                launchTime: [
                    {required: true, message: this.$i18n.t('coupon.launchTimeTip1'), trigger: 'blur'}
                ],
                couponType: [
                    {required: true, message: this.$i18n.t('coupon.couponTypeNotEmpty'), trigger: 'blur'}
                ],
                putSource: [
                    {required: true, message: "请选择投放来源", trigger: 'blur'}
                ],
                type: [
                    {required: true, message: "请选择类型", trigger: 'blur'}
                ],
                reduceAmount: [
                    {required: true, message: this.$i18n.t('coupon.theDedEmpty'), trigger: 'blur'},
                    {validator: validate, trigger: 'blur'}
                ],
                couponDiscount: [
                    {required: true, message: this.$i18n.t('coupon.theDiscouBeEmpty'), trigger: 'blur'},
                    {validator: discountValidate, trigger: 'blur'}
                ],
                startTime: [
                    {required: true, message: this.$i18n.t('coupon.startTimeCannotBeEmpty'), trigger: 'blur'},
                    {validator: validateTime, trigger: 'blur'}
                ],
                endTime: [
                    {required: true, message: this.$i18n.t('coupon.endTimeCannotBeEmpty'), trigger: 'blur'},
                    {validator: validateTime, trigger: 'blur'}
                ],
                afterReceiveDays: [
                    {required: true, message: this.$i18n.t('coupon.timeCannotBeEmpty'), trigger: 'blur'}
                ],
                validDays: [
                    {required: true, message: this.$i18n.t('coupon.timeCannotBeEmpty'), trigger: 'blur'},
                    {type: 'number', min: 1, message: this.$i18n.t('coupon.validDaysAlert'), trigger: 'blur'}
                ],
                cashCondition: [
                    {required: true, message: this.$i18n.t('coupon.conditionBeEmpty'), trigger: 'blur'},
                    {validator: validate, trigger: 'blur'}
                ],
                validTimeType: [
                    {required: true, message: this.$i18n.t('coupon.effectiveotBeEmpty'), trigger: 'blur'}
                ],
                stocks: [
                    {required: true, message: this.$i18n.t('coupon.invenEmpty'), trigger: 'blur'},
                    {validator: stockValidate, trigger: 'blur'}
                ],
                suitableProdType: [
                    {required: true, message: this.$i18n.t('coupon.applicabltBeEmpty'), trigger: 'blur'}
                ],
                couponImg: [
                    {required: true, message: this.$i18n.t('coupon.couponImgCannotBeEmpty'), trigger: 'blur'}
                ],
                claimRules: [
                    {required: true, message: this.$i18n.t('coupon.couponClaimRulesCannotBeEmpty'), trigger: 'blur'}
                ],
                useRules: [
                    {required: true, message: this.$i18n.t('coupon.couponUseRulesCannotBeEmpty'), trigger: 'blur'}
                ],
                launchEndTime: [
                    {required: true, message: this.$i18n.t('coupon.launchEndTimeTip1'), trigger: 'blur'}
                ],
                groupAmount: [
                    {required: true, message: "团购金额不能为空", trigger: 'blur'},
                    {validator: validate, trigger: 'blur'}
                ],
                cardName: [
                    {required: true, message: "请输入提货卡/券名称", trigger: 'blur'}
                ],
                timeType: [
                    {required: true, message: "请选择时间类型", trigger: 'blur'}
                ]
            },
            couponList:[] // 优惠券列表
        }
    },
    components: {
        ProdsSelect,
        ProdPic,
        ShopSelect,
        ImgUpload,
        TinyMce
    },
    watch: {
        visible: function () {
            if (this.visible === false) {
                this.prodsSelectVisible = false
                this.shopsSelectVisible = false
            }
        }
    },
    methods: {
        // 获取优惠券列表
        getCouponList(){
            this.$http({
                url: this.$http.adornUrl("/platform/coupon/getAllCouponList"),
                method: "get",
                params: this.$http.adornParams({
                    putonStatus:1,
                    isGroup:0
                }),
            }).then(({ data }) => {
                this.couponList = data;
            });
        },
        // 获取方式改变
        handleGetWay(){
            if (this.dataForm.getWay === 0) {
                this.dataForm.limitNum = 1
            }
        },
        // 是否团购改变
        handleIsGroup(){
            if (this.dataForm.isGroup === 0) {
                this.dataForm.groupAmount = null
            }else{
                this.dataForm.groupAmount = 0
            }
        },
        // 获取数据列表
        init (couponId) {
            this.show = true
            this.dataForm.couponId = couponId || 0
            this.putonStatus = 0
            this.visible = true
            this.isSubmit = false
            if (!couponId) { // 每次新增时  初始化表单数据
                this.initDataForm()
            }
            if (this.dataForm.couponId) {
                this.getDataList()
            }
            this.getCouponList()
        },
        // 初始化表单数据
        initDataForm () {
            this.dataForm = {
                couponId: 0,
                couponName: '',
                subTitle: '',
                couponType: 1,
                type: 2,
                putSource: 1,
                reduceAmount: 0,
                couponDiscount: 0,
                cashCondition: 0,
                validTimeType: 1,
                getWay: 0,
                launchTime: null,
                startTime: null,
                endTime: null,
                afterReceiveDays: 0,
                timeType: 1,
                validDays: 0,
                stocks: 1,
                suitableProdType: 0,
                limitNum: 1,
                putonStatus: 0,
                couponProds: [],
                couponShops: [],
                couponImg:'',
                claimRules:'',
                useRules:'',
                storePreferential:'',
                launchEndTime:null,
                isGroup:0,
                groupAmount:0,
                cardName:'',
                giveCouponId:null,
                isPayMember:1
            }
        },

      getDataList () {
            this.$http({
                url: this.$http.adornUrl(`/platform/coupon/info/${this.dataForm.couponId}`),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                this.dataForm = data
                this.putonStatus = this.dataForm.putonStatus
            })
        },
        handleClose () {
            this.dataForm = {}
        },
        // 检验库存输入
        stocksCheck () {
            var maxNum = Math.round(this.dataForm.stocks)
            if (!maxNum) {
                maxNum = 1
            } else if (maxNum < 1) {
                maxNum = 1
            } else if (maxNum > 1000000000) {
                maxNum = 1000000000
            }
            this.dataForm.stocks = maxNum
        },
        // 检验限领张数输入
        limitNumCheck () {
            var maxNum = Math.round(this.dataForm.limitNum)
            if (!maxNum) {
                maxNum = 1
            } else if (maxNum < 1) {
                maxNum = 1
            } else if (maxNum > 1000000000) {
                maxNum = 1000000000
            }
            this.dataForm.limitNum = maxNum
        },
        // 选择点击事件
        selectChangeHandle (selection) {
            this.dataList.forEach((tableItem) => {
                let selectedProdIndex = selection.findIndex((selectedProd) => {
                    if (!selectedProd) {
                        return false
                    }
                    return selectedProd.prodId === tableItem.prodId
                })
                let dataSelectedProdIndex = this.dataListSelections.findIndex((dataSelectedProd) => dataSelectedProd.prodId === tableItem.prodId)
                if (selectedProdIndex > -1 && dataSelectedProdIndex === -1) {
                    this.dataListSelections.push(tableItem)
                } else if (selectedProdIndex === -1 && dataSelectedProdIndex > -1) {
                    this.dataListSelections.splice(dataSelectedProdIndex, 1)
                }
            })
        },
        // 显示添加指定商品弹框
        prodsSelectHandle () {
            this.prodsSelectVisible = true
            this.$nextTick(() => {
                this.$refs.prodsSelect.init(this.dataForm.couponProds)
            })
        },
        // 显示添加指定商品弹框
        shopsSelectHandle () {
            this.shopsSelectVisible= true
            this.$nextTick(() => {
                this.$refs.shopsSelect.init(this.dataForm.couponShops)
            })
        },
        // 删除指定商品
        deleteProd (index) {
            this.dataForm.couponProds.splice(index, 1)
        },
        deleteShop (index) {
            this.dataForm.couponShops.splice(index, 1)
            this.$forceUpdate();
        },
        // 添加指定商品
        selectCouponProds (prods) {
            if (prods) {
                this.dataForm.couponProds = prods
            }
        },     // 添加指定店铺
        selectCouponShops (shops) {
            if (shops) {
                this.dataForm.couponShops = shops
                this.$forceUpdate();
            }
        },
        /**
         * 输入框的数据改变时，对值进行校验
         */
        checkNumber (type) {
            // if(discountItem == null || discountItem.needAmount == null){

            // }
            // item.needAmount <= item.discount
            if (type === 1) {
                let reduceAmount = this.dataForm.reduceAmount
                if (reduceAmount <= 0) {
                    this.dataForm.reduceAmount = 0.01
                } else {
                    this.dataForm.reduceAmount = reduceAmount > 9999999999999 ? 9999999999999 : reduceAmount
                }
            }
            if (type === 2) {
                var coupDiscount = this.dataForm.couponDiscount
                // 如果小于零
                if (coupDiscount <= 0) {
                    this.dataForm.couponDiscount = 0.1
                }
                if (coupDiscount >= 10) {
                    // 如果折扣大于10
                    this.dataForm.couponDiscount = 9.9
                }
            }
        },
        /**
         * 消费金额最低要求检验
         */
        cashConditionChange () {
            let caCondition = this.dataForm.cashCondition
            this.dataForm.cashCondition = caCondition <= 0 ? 0.01 : caCondition
            this.dataForm.cashCondition = caCondition > 9999999999999 ? 9999999999999 : caCondition
        },
        /**
         * 减免金额检验
         */
        reductionAmountChange () {
            let reduceAmount = this.dataForm.reduceAmount
            this.dataForm.reduceAmount = reduceAmount <= 0 ? 0.01 : reduceAmount
            this.dataForm.reduceAmount = reduceAmount > 9999999999999 ? 9999999999999 : reduceAmount
        },
        /**
        * 减免金额检验
        */
        groupAmountChange () {
            let groupAmount = this.dataForm.groupAmount
            this.dataForm.groupAmount = groupAmount <= 0 ? 0.01 : groupAmount
            this.dataForm.groupAmount = groupAmount > 9999999999999 ? 9999999999999 : groupAmount
        },
        // 表单提交
        dataFormSubmit () {
            if (this.errorTip) {
                this.$message({
                    message: this.$i18n.t('coupon.quantitssThan0'),
                    type: 'error',
                    duration: 1500
                })
                return
            }
            if (this.dataForm.putonStatus === 0) {
                if (Date.parse(this.dataForm.launchTime) <= Date.now()) {
                    this.$message({
                        message: this.$i18n.t('coupon.launchTimeTip'),
                        type: 'error',
                        duration: 1500
                    })
                    return
                } else if (this.dataForm.launchTime === null) {
                    this.$message({
                        message: this.$i18n.t('coupon.launchTimeTip1'),
                        type: 'error',
                        duration: 1500
                    })
                    return
                }

                if (Date.parse(this.dataForm.launchEndTime) <= Date.parse(this.dataForm.launchTime)) {
                    this.$message({
                        message: this.$i18n.t('coupon.launchEndTimeTip'),
                        type: 'error',
                        duration: 1500
                    })
                    return
                } else if (this.dataForm.launchEndTime === null) {
                    this.$message({
                        message: this.$i18n.t('coupon.launchEndTimeTip1'),
                        type: 'error',
                        duration: 1500
                    })
                    return
                }
            }
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    if (this.dataForm.couponType === 1 && (parseFloat(this.dataForm.cashCondition) <= parseFloat(this.dataForm.reduceAmount))) {
                        this.$message.error(this.$i18n.t('coupon.amounnCannotBe'))
                        return false
                    }
                    if (this.isSubmit) {
                        return false
                    }
                    this.isSubmit = true
                    this.$http({
                        url: this.$http.adornUrl(`/platform/coupon`),
                        method: this.dataForm.couponId ? 'put' : 'post',
                        data: this.$http.adornData({
                            'couponId': this.dataForm.couponId || undefined,
                            'couponName': this.dataForm.couponName,
                            'subTitle': this.dataForm.subTitle,
                            'couponType': this.dataForm.couponType,
                            'type': this.dataForm.type,
                            'putSource': this.dataForm.putSource,
                            'reduceAmount': parseFloat(this.dataForm.reduceAmount),
                            'couponDiscount': parseFloat(this.dataForm.couponDiscount),
                            'cashCondition': parseFloat(this.dataForm.cashCondition),
                            'validTimeType': this.dataForm.validTimeType,
                            'getWay': this.dataForm.getWay,
                            'launchTime': this.dataForm.putonStatus === 0 ? this.dataForm.launchTime : null,
                            'startTime': this.dataForm.startTime,
                            'endTime': this.dataForm.endTime,
                            'afterReceiveDays': this.dataForm.afterReceiveDays,
                            'timeType': this.dataForm.timeType,
                            'validDays': this.dataForm.validDays,
                            'stocks': this.dataForm.stocks,
                            'suitableProdType': this.dataForm.suitableProdType,
                            'limitNum': this.dataForm.limitNum,
                            'putonStatus': this.dataForm.putonStatus,
                            'couponProds': this.dataForm.couponProds,
                            'couponShops': this.dataForm.couponShops,
                            'couponImg': this.dataForm.couponImg,
                            'claimRules': this.dataForm.claimRules,
                            'useRules': this.dataForm.useRules,
                            'storePreferential': this.dataForm.storePreferential,
                            'launchEndTime': this.dataForm.putonStatus === 0 ? this.dataForm.launchEndTime : null,
                            'isGroup': this.dataForm.isGroup,
                            'groupAmount': this.dataForm.groupAmount,
                            'cardName': this.dataForm.cardName,
                            'giveCouponId': this.dataForm.giveCouponId,
                            'isPayMember': this.dataForm.isPayMember,
                        })
                    }).then(({data}) => {
                        this.$message({
                            message: this.$i18n.t('publics.operation'),
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.dataForm.couponProds = []
                                this.dataForm.couponShops = []
                                this.$emit('refreshDataList', this.page)
                                this.visible = false
                            }
                        })
                    }).catch((e) => {
                        this.isSubmit = false
                    })
                }
            })
        },
        beforeClose (done) {
            this.show = false
            done()
        }
    }
}
</script>
<style lang="scss">
.mod-coupon-add-or-update {
    .el-col {
        width: 130px;
    }
}

.prod-line-height {
    line-height: 18px;
}

.prod-text-left {
    margin-left: 10px;
}
</style>
