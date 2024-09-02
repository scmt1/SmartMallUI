<template>
    <div class="mod-coupon-add-or-update">
        <div class="new-page-title">
            <div class="line"/>
            <div class="text">
                {{
                    dataForm.couponId
                        ? this.$i18n.t('marketing.modifyCoupon')
                        : this.$i18n.t('marketing.newCoupon')
                }}
            </div>
        </div>
        <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            class="form-box"
            label-width="auto"
        >
            <el-form-item
                :label="this.$i18n.t('marketing.couponName')"
                prop="couponName"
            >
                <el-input
                    v-model="dataForm.couponName"
                    maxlength="20"
                    show-word-limit
                    size="small"
                    class="coupon-input"
                    :placeholder="this.$i18n.t('marketing.couponName')"
                ></el-input>
            </el-form-item>
            <!-- <el-form-item
              :label="this.$i18n.t('marketing.couponSubtitle')"
              prop="subTitle"
            >
              <el-input
                v-model="dataForm.subTitle"
                size="small"
                class="coupon-input"
                :placeholder="this.$i18n.t('marketing.couponSubtitle')"
                :disabled="dataForm.couponId !== 0"
                maxlength="32"
                show-word-limit
              ></el-input>
            </el-form-item> -->
            <el-form-item
                :label="this.$i18n.t('coupon.launchStatus')"
                size="mini"
                prop="putonStatus"
            >
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
                    <el-radio :label="-1" :disabled="true">{{ $t('coupon.cancelLaunch') }}
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
                    size="small"
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
                        size="small"
                        :placeholder="this.$i18n.t('coupon.chooseLaunchEndTime')"
                ></el-date-picker>
            </el-form-item>

            <el-form-item :label="$t('coupon.getWay')" prop="getWay">
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
                        class="coupon-input1"
                        @blur="toFloat('groupAmount')"
                        placeholder="团购金额"
                        type="text"
                >
                    <template slot="append">{{ $t('admin.dollar') }}</template>
                </el-input>
            </el-form-item>

            <el-form-item label="类型" size="mini" prop="type">
                <el-radio-group v-model="dataForm.type">
                    <el-radio :label="1">线上券</el-radio>
                    <el-radio :label="2">线下券</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                :label="this.$i18n.t('coupon.couponType')"
                size="mini"
                prop="couponType"
            >
                <el-radio-group
                    v-model="dataForm.couponType"
                >
                    <el-radio :label="1">{{ $t('coupon.voucher') }}</el-radio>
                    <el-radio :label="2">{{ $t('coupon.discountCoupon') }}</el-radio>
                    <el-radio :label="4">提货卡/券</el-radio>
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
                    <el-option v-for="(item,index) in couponList" :label="item.couponName" :key="index" :value="item.couponId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                :label="this.$i18n.t('marketing.conditionsOfUse')"
                prop="cashCondition"
            >
                <el-input
                    size="small"
                    class="coupon-input1"
                    type="text"
                    v-model="dataForm.cashCondition"
                    :placeholder="this.$i18n.t('marketing.conditionsOfUse')"
                    @blur="toFloat('cashCondition')"
                >
                    <template slot="prepend">{{ $t('marketing.full') }}</template>
                    <template slot="append">{{ $t('admin.dollar') }}</template>
                </el-input>
            </el-form-item>
            <el-form-item
                :label="this.$i18n.t('marketing.reductionAmount')"
                prop="reduceAmount"
                v-if="dataForm.couponType === 1"
            >
                <el-input
                    v-model="dataForm.reduceAmount"
                    size="small"
                    class="coupon-input1"
                    @blur="toFloat('reduceAmount')"
                    :placeholder="this.$i18n.t('marketing.reductionAmount')"
                    type="text"
                >
                    <template slot="append">{{ $t('admin.dollar') }}</template>
                </el-input>
            </el-form-item>
            <el-form-item
                :label="this.$i18n.t('marketing.discountAmount')"
                prop="couponDiscount"
                v-if="dataForm.couponType === 2"
            >
                <el-input
                    v-model="dataForm.couponDiscount"
                    :placeholder="this.$i18n.t('marketing.pleaseEnterDiscount')"
                    type="text"
                    @blur="toFloat('couponDiscount')"
                    size="small"
                    class="coupon-input1"
                >
                    <template slot="append">{{ $t('marketing.fold') }}</template>
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
            <el-form-item
                :label="this.$i18n.t('coupon.effectiveType')"
                np
                size="mini"
                prop="validTimeType"
            >
                <el-radio-group
                    v-model="dataForm.validTimeType"
                >
                    <el-radio :label="1">{{ $t('marketing.fixedTime') }}</el-radio>
                    <el-radio :label="2">{{
                            $t('marketing.effectiveAfterReceipt')
                        }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 固定时间数据 START -->
            <div v-if="dataForm.validTimeType === 1">
                <el-form-item
                    :label="this.$i18n.t('coupon.startTime')"
                    prop="startTime"
                    v-if="dataForm.validTimeType === 1"
                >
                    <el-date-picker
                        :disabled="dataForm.couponId < 0"
                        v-model="dataForm.startTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        size="small"
                        :placeholder="this.$i18n.t('marketing.chooseStartTime')"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                    :label="this.$i18n.t('coupon.endTime')"
                    prop="endTime"
                    v-if="dataForm.validTimeType === 1"
                >
                    <el-date-picker
                        size="small"
                        v-model="dataForm.endTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        :placeholder="this.$i18n.t('marketing.chooseEndTime')"
                        :disabled="dataForm.putonStatus < 0"
                    ></el-date-picker>
                </el-form-item>
            </div>
            <!-- 固定时间数据 END -->
            <!-- 领取后生效数据 START -->
            <el-form-item
                :label="this.$i18n.t('marketing.afterReceivingTheCoupon')"
                prop="afterReceiveDays"
                v-if="dataForm.validTimeType === 2">
                <el-input
                    v-model="dataForm.afterReceiveDays"
                    type="number"
                    size="small"
                    class="coupon-input1"
                    oninput="if(value>3652)value=1"
                    :max="3652">
                    <template slot="append">{{ $t('marketing.effectiveDays') }}</template>
                </el-input>
                <el-tooltip class="item" effect="dark" :content="$t('marketing.maxTimeTip')" placement="top">
                    <i class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item
                :label="this.$i18n.t('marketing.validDate')"
                prop="validDays"
                v-if="dataForm.validTimeType === 2">
                <el-input
                    v-model="dataForm.validDays"
                    type="number"
                    size="small"
                    class="coupon-input1"
                    oninput="if(value>3652)value=1"
                    :max="3652">
                    <template slot="append">{{ $t('form.day') }}</template>
                </el-input>
                <el-tooltip class="item" effect="dark" :content="$t('marketing.maxTimeTip')" placement="top">
                    <i class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>
            <!-- 领取后生效数据 END -->
            <!-- 每人限领 -->
            <el-form-item
                :label="this.$i18n.t('marketing.perPerson')"
                prop="limitNum"
            >
<!--                :disabled="dataForm.putonStatus < 0"-->
                <el-input v-model="dataForm.limitNum" :disabled="dataForm.putonStatus < 0 || (dataForm.getWay === 0 && dataForm.isGroup === 0)" size="small" @blur="toFloat('limitNum')"
                          class="coupon-input1" type="number" >
                    <template slot="append">{{ $t('marketing.piece') }}</template>
                </el-input>
            </el-form-item>
            <!-- 库存 -->
            <el-form-item :label="this.$i18n.t('marketing.inventory')" prop="stocks">
                <el-input
                    v-model="dataForm.stocks"
                    type="number"
                    size="small"
                    class="coupon-input1"
                    @blur="toFloat('stocks')"
                >
                    <template slot="append">{{ $t('marketing.piece') }}</template>
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
            <!-- 适用商品 -->
            <el-form-item
                :label="this.$i18n.t('marketing.applicableGoods')"
                size="mini"
                prop="suitableProdType"
            >
                <el-radio-group v-model="dataForm.suitableProdType" :disabled="dataForm.putonStatus < 0">
                    <el-radio :label="0">{{ $t('marketing.allProdsPar') }}</el-radio>
                    <el-radio :label="1">{{ $t('marketing.participateInD') }}</el-radio>
                    <el-radio :label="2">{{ $t('marketing.specifiedProduct') }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <div
                    plain
                    v-if="
            dataForm.suitableProdType === 1 || dataForm.suitableProdType === 2
          "
                    @click="prodsSelectHandle()"
                    class="default-btn"
                >{{ $t('product.select') }}
                </div
                >
            </el-form-item>
            <!-- 商品 -->
            <el-form-item style="width: 100%" v-if="dataForm.suitableProdType !== 0">
                <el-row>
                    <el-col
                        v-for="(couponProd, index) in dataForm.couponProds"
                        :key="index"
                    >
                        <el-card
                            :body-style="{ padding: '0px' }"
                            style="height: 160px; width: 120px"
                        >
                            <!-- <img :src="couponProd.pic" style="height: 104px; width: 100%" /> -->
                            <prod-pic
                                height="104px"
                                width="100%"
                                :pic="couponProd.pic"
                            ></prod-pic>
                            <div class="card-prod-bottom">
                                <span class="card-prod-name">{{ couponProd.prodName }}</span>
                                <el-button
                                    type="text"
                                    class="card-prod-name-button"
                                    @click="deleteProd(index)"
                                >{{ $t('text.delBtn') }}
                                </el-button
                                >
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item>
                <div class="default-btn" @click="back()">{{
                        $t('crud.filter.cancelBtn')
                    }}
                </div>
                <div class="default-btn primary-btn" @click="dataFormSubmit()" v-if="dataForm.putonStatus > -1">{{
                        $t('crud.filter.submitBtn')
                    }}
                </div>
            </el-form-item>
        </el-form>
        <!-- 商品选择弹窗-->
        <prods-select
            v-if="prodsSelectVisible"
            ref="prodsSelect"
            @refreshSelectProds="selectCouponProds"
        ></prods-select>
    </div>
</template>

<script>
import ProdsSelect from '@/components/prods-select'
import {Debounce} from '@/utils/debounce'
import ProdPic from '@/components/prod-pic'
import ImgUpload from '@/components/img-upload'

export default {
    data () {
        var validate = (rule, value, callback) => {
            if (!/^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/.test(value)) {
                callback(new Error(this.$i18n.t('live.pleaseEnteThan0')))
            } else if (value >= 10000000000000) {
                callback(new Error(this.$i18n.t('live.numberLimit')))
            } else {
                callback()
            }
        }
        var validCouponName = (rule, value, callback) => {
            if (!value.trim()) {
                callback(new Error(this.$i18n.t('marketing.couponNameCannotBeEmpty')))
            } else {
                callback()
            }
        }
        var validTittle = (rule, value, callback) => {
            if (!value.trim()) {
                callback(new Error(this.$i18n.t('shop.titCanNoBlank')))
            } else {
                callback()
            }
        }
        var validateNumber = (rule, value, callback) => {
            if (!/^[1-9]\d*$/.test(value)) {
                callback(new Error(this.$i18n.t('formData.pleaseThan0')))
            } else if (value >= 2147483600) {
                callback(new Error(this.$i18n.t('formData.stockLimit')))
            } else {
                callback()
            }
        }
        var validateStocks = (rule, value, callback) => {
            if (value === 0 && this.dataForm.couponId) {
                callback()
            } else if (!/^[1-9]\d*$/.test(value)) {
                callback(new Error(this.$i18n.t('formData.pleaseThan0')))
            } else if (value >= 2147483600) {
                callback(new Error(this.$i18n.t('formData.stockLimit')))
            } else {
                callback()
            }
        }
        var validateeDays = (rule, value, callback) => {
            if (!/^[0-9]\d*$/.test(value)) {
                callback(new Error(this.$i18n.t('marketing.pleaseaTo0')))
            } else {
                callback()
            }
        }
        var validateeOneDays = (rule, value, callback) => {
            if (!/^[1-9]\d*$/.test(value)) {
                callback(new Error(this.$i18n.t('marketing.pleaseaTo1')))
            } else {
                callback()
            }
        }
        var discountValidate = (rule, value, callback) => {
            if (!/^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/.test(value)) {
                callback(new Error(this.$i18n.t('marketing.pleaseTo10')))
            } else if (parseInt(value) >= 10 || parseInt(value) < 0) {
                callback(new Error(this.$i18n.t('marketing.pleaseTo10')))
            } else {
                callback()
            }
        }
        var validateTime = (rule, value, callback) => {
            if (Date.parse(this.dataForm.startTime) >= Date.parse(this.dataForm.endTime)) {
                callback(new Error(this.$i18n.t('marketing.timeCanThanOrEqualTo')))
            }
            // if (this.dataForm.couponId === 0 && rule.field === 'startTime' && new Date() > Date.parse(value)) {
            //   callback(new Error(this.$i18n.t('groups.activityTimeTime')))
            // }
            if (this.dataForm.couponId === 0 && rule.field === 'endTime' && new Date() > Date.parse(value)) {
                callback(new Error(this.$i18n.t('groups.endTime')))
            } else {
                callback()
            }
        }
        return {
            dataForm: {
                couponId: 0,
                couponName: '',
                subTitle: '',
                couponType: 1,
                type: 2,
                reduceAmount: 0,
                couponDiscount: 0,
                cashCondition: 0,
                validTimeType: 1,
                launchTime: null,
                startTime: null,
                endTime: null,
                afterReceiveDays: 0,
                validDays: 1,
                stocks: 1,
                suitableProdType: 0,
                limitNum: 1,
                putonStatus: 0,
                couponProds: [],
                getWay: 0,
                couponImg:'',
                claimRules:'',
                useRules:'',
                launchEndTime:null,
                isGroup:0,
                groupAmount:0,
                cardName:'',
                giveCouponId:null
            },
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 10 // 每页显示多少条
            },
            putonStatus: 0,
            errorTip: false,
            dataListSelections: [],
            prodsSelectVisible: false,
            resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
            dataRule: {
                couponName: [
                    {required: true, message: this.$i18n.t('marketing.couponNameCannotBeEmpty'), trigger: 'blur'},
                    {validator: validCouponName, trigger: 'blur'}
                ],
                launchTime: [
                    {required: true, message: this.$i18n.t('coupon.launchTimeTip1'), trigger: 'blur'}
                ],
                subTitle: [
                    {required: true, message: this.$i18n.t('shop.titCanNoBlank'), trigger: 'blur'},
                    {validator: validTittle}
                ],
                couponType: [
                    {required: true, message: this.$i18n.t('marketing.couponTypeCannotBeEmpty'), trigger: 'blur'}
                ],
                type: [
                    {required: true, message: "请选择类型", trigger: 'blur'}
                ],
                reduceAmount: [
                    {required: true, message: this.$i18n.t('marketing.theDedEmpty'), trigger: 'blur'},
                    {validator: validate, trigger: 'blur'}
                ],
                limitNum: [
                    {required: true, message: this.$i18n.t('marketing.theLimitetBeEmpty'), trigger: 'blur'},
                    {validator: validateNumber, trigger: 'blur'}
                ],
                afterReceiveDays: [
                    {required: true, message: this.$i18n.t('marketing.collectioeEmpty'), trigger: 'blur'},
                    {validator: validateeDays, trigger: 'blur'}
                ],
                validDays: [
                    {required: true, message: this.$i18n.t('marketing.effectiveEmpty'), trigger: 'blur'},
                    {validator: validateeOneDays, trigger: 'blur'}
                ],
                couponDiscount: [
                    {required: true, message: this.$i18n.t('marketing.theDiscouBeEmpty'), trigger: 'blur'},
                    {validator: discountValidate, trigger: 'blur'}
                ],
                startTime: [
                    {required: true, message: this.$i18n.t('formData.startTimeCannotBeEmpty'), trigger: 'blur'},
                    {validator: validateTime, trigger: 'blur'}
                ],
                endTime: [
                    {required: true, message: this.$i18n.t('formData.endTimeCannotBeEmpty'), trigger: 'blur'},
                    {validator: validateTime, trigger: 'blur'}
                ],
                cashCondition: [
                    {required: true, message: this.$i18n.t('marketing.conditionBeEmpty'), trigger: 'blur'},
                    {validator: validate, trigger: 'blur'}
                ],
                validTimeType: [
                    {required: true, message: this.$i18n.t('marketing.effectiveotBeEmpty'), trigger: 'blur'}
                ],
                stocks: [
                    {required: true, message: this.$i18n.t('marketing.invenEmpty'), trigger: 'blur'},
                    {validator: validateStocks, trigger: 'blur'}
                ],
                suitableProdType: [
                    {required: true, message: this.$i18n.t('marketing.applicabltBeEmpty'), trigger: 'blur'}
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
                ]
            },
            couponList: [] // 优惠券列表
        }
    },
    components: {
        ProdsSelect,
        ProdPic,
        ImgUpload
    },
    mounted () {
        const couponId = this.$route.query.couponId
        this.init(couponId)
        let title = couponId ? this.$i18n.t('marketing.modifyCoupon') : this.$i18n.t('marketing.newCoupon')
        this.$store.commit('common/replaceSelectMenu', title)
    },
    methods: {
        // 获取优惠券列表
        getCouponList(){
            this.$http({
                url: this.$http.adornUrl("/admin/coupon/getShopAllCouponList"),
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
            this.dataForm.couponId = couponId || 0
            this.putonStatus = 0
            this.$nextTick(() => {
                this.$refs.dataForm.resetFields()
            })
            if (this.dataForm.couponId) {
                this.getDataList()
            }
            this.getCouponList()
        },
        getDataList () {
            this.$http({
                url: this.$http.adornUrl(`/admin/coupon/info/${this.dataForm.couponId}`),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                this.dataForm = data
                this.putonStatus = this.dataForm.putonStatus
            })
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
        toFloat (type) {
            let val = parseFloat(this.dataForm[type])
            if (val) {
                this.dataForm[type] = val
            }
        },
        // 显示添加指定商品弹框
        prodsSelectHandle () {
            this.prodsSelectVisible = true
            this.$nextTick(() => {
                this.$refs.prodsSelect.init(this.dataForm.couponProds)
            })
        },
        // 删除指定商品
        deleteProd (index) {
            this.dataForm.couponProds.splice(index, 1)
        },
        // 添加指定商品
        selectCouponProds (prods) {
            this.prodsSelectVisible = false
            if (prods) {
                this.dataForm.couponProds = prods
            }
        },
        // 表单提交
        dataFormSubmit: Debounce(function () {
            if (this.errorTip) {
                this.$message({
                    message: this.$i18n.t('marketing.quantitssThan0'),
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
                        this.$message.error(this.$i18n.t('marketing.amounnCannotBe'))
                        return false
                    }
                    if (this.dataForm.suitableProdType !== 0 && this.dataForm.couponProds.length === 0) {
                        this.$message.error(this.$i18n.t('marketing.pleaseSelectAProduct'))
                        return false
                    }
                    this.$http({
                        url: this.$http.adornUrl(`/admin/coupon`),
                        method: this.dataForm.couponId ? 'put' : 'post',
                        data: this.$http.adornData({
                            'couponId': this.dataForm.couponId || undefined,
                            'couponName': this.dataForm.couponName,
                            'subTitle': this.dataForm.subTitle,
                            'couponType': this.dataForm.couponType,
                            'type': this.dataForm.type,
                            'reduceAmount': this.dataForm.reduceAmount,
                            'couponDiscount': this.dataForm.couponDiscount,
                            'cashCondition': this.dataForm.cashCondition,
                            'validTimeType': this.dataForm.validTimeType,
                            'launchTime': this.dataForm.putonStatus === 0 ? this.dataForm.launchTime : null,
                            'startTime': this.dataForm.startTime,
                            'endTime': this.dataForm.endTime,
                            'afterReceiveDays': this.dataForm.afterReceiveDays,
                            'validDays': this.dataForm.validDays,
                            'stocks': this.dataForm.stocks,
                            'suitableProdType': this.dataForm.suitableProdType,
                            'limitNum': this.dataForm.limitNum,
                            'putonStatus': this.dataForm.putonStatus,
                            'couponProds': this.dataForm.couponProds,
                            'getWay': this.dataForm.getWay,
                            'couponImg': this.dataForm.couponImg,
                            'claimRules': this.dataForm.claimRules,
                            'useRules': this.dataForm.useRules,
                            'launchEndTime': this.dataForm.putonStatus === 0 ? this.dataForm.launchEndTime : null,
                            'isGroup': this.dataForm.isGroup,
                            'groupAmount': this.dataForm.groupAmount,
                            'cardName': this.dataForm.cardName,
                            'giveCouponId': this.dataForm.giveCouponId
                        })
                    }).then(({data}) => {
                        this.$message({
                            message: this.$i18n.t('publics.operation'),
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.dataForm.couponProds = []
                                this.$emit('refreshDataList', this.page)
                                this.back()
                            }
                        })
                    })
                }
            })
        }, 1500),
        back () {
            this.$router.push('/marketing-coupon')
        }
    }
}
</script>
<style lang="scss" scoped>
.mod-coupon-add-or-update {
    .el-col {
        width: 130px;
    }

    .coupon-input {
        width: 520px;
    }

    .coupon-input1 {
        width: 220px;
    }

    .form-box {
        margin-left: 40px;
    }
}
</style>
