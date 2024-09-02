<template>
    <el-dialog
        :title="title"
        width="60%"
        @close="onCloseClr()"
        class="el-dialog-box"
        :visible.sync="dialogVisible">
        <div class="edit-label-content">
            <div class="label-name-line currency-line">
                <div class="title"><span class="must-term">*</span>{{ $t('user.labelName') }}</div>
                <div>
                    <el-input
                        type="text"
                        v-model="labelName"
                        maxlength="10"
                        show-word-limit
                        @blur="labelName = handleInputSpaces(labelName)"
                    ></el-input>
                </div>
            </div>
            <div class="label-type-line currency-line">
                <div class="title"><span class="must-term">*</span>{{ $t('user.labelType') }}</div>
                <el-radio v-model="labelType" label="1" :disabled="isDisaCondiLabel">{{ $t('user.conditionLabel') }}</el-radio>
                <el-radio v-model="labelType" label="0" :disabled="isDisaCustLabel">{{ $t('user.manualLabel') }}</el-radio>
            </div>
            <div v-if="labelType==1">
                <div class="label-condition-title-line">
                    {{ $t('user.conditionSetting') }}<span class="tips">{{ $t('user.conditionSettingTips') }}</span>
                </div>
                <div class="basic-condition-line currency-line">
                    <div class="title">{{ $t('user.basicCondition') }}</div>
                    <div class="basic-set-content module-content">
                        <div class="option-line">
                            <el-checkbox v-model="isBeCustTimeChecked">{{ $t('user.becomeCustomerTime') }}</el-checkbox>
                            <el-select v-model="beCustTimeValue" :disabled="!isBeCustTimeChecked" :placeholder="$t('user.pleaseSelect')">
                                <el-option
                                    v-for="item in beCustTimeOpts"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <div v-if="isBeCustTimeChecked" class="block">
                                <el-date-picker
                                    v-model="beCustTimeRange"
                                    type="daterange"
                                    range-separator="-"
                                    :start-placeholder="$t('user.startDate')"
                                    :end-placeholder="$t('user.endDate')"
                                    @change="chagCustTimeRange(0)">
                                </el-date-picker>
                            </div>
                        </div>
                        <!--						<div class="option-line">-->
                        <!--							<el-checkbox v-model="isfollowTimeChecked">{{ $t('user.followTime') }}</el-checkbox>-->
                        <!--							<el-select v-model="followTimeValue" :disabled="!isfollowTimeChecked" :placeholder="$t('user.pleaseSelect')">-->
                        <!--								<el-option-->
                        <!--									v-for="item in followTimeOpts"-->
                        <!--									:key="item.value"-->
                        <!--									:label="item.label"-->
                        <!--									:value="item.value">-->
                        <!--								</el-option>-->
                        <!--							</el-select>-->
                        <!--							<div v-if="isfollowTimeChecked" class="block">-->
                        <!--								<el-date-picker-->
                        <!--									v-model="followTimeRange"-->
                        <!--									type="daterange"-->
                        <!--									range-separator="-"-->
                        <!--									:start-placeholder="$t('user.startDate')"-->
                        <!--									:end-placeholder="$t('user.endDate')"-->
                        <!--									@change="chagCustTimeRange(1)">-->
                        <!--								</el-date-picker>-->
                        <!--							</div>-->
                        <!--						</div>-->
                        <div class="option-line">
                            <el-checkbox v-model="isBeMemTimeChecked">{{ $t('user.becomeMemberTime') }}</el-checkbox>
                            <el-select v-model="beMemTimeValue" :disabled="!isBeMemTimeChecked" :placeholder="$t('user.pleaseSelect')">
                                <el-option
                                    v-for="item in beMemTimeOpts"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <div v-if="isBeMemTimeChecked" class="block">
                                <el-date-picker
                                    v-model="beMemTimeRange"
                                    type="daterange"
                                    range-separator="-"
                                    :start-placeholder="$t('user.startDate')"
                                    :end-placeholder="$t('user.endDate')"
                                    @change="chagCustTimeRange(2)">
                                </el-date-picker>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="transaction-condition-line currency-line">
                    <div class="title">{{ $t('user.tradingConditions') }}</div>
                    <div class="deal-condition-content module-content">
                        <div class="option-line">
                            <el-checkbox v-model="isNearConTime">{{ $t('user.nearConsuTime') }}</el-checkbox>
                            <el-select v-model="nearConTimeValue" :disabled="!isNearConTime" :placeholder="$t('user.pleaseSelect')">
                                <el-option
                                    v-for="item in nearConTimeOpts"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="option-line">
                            <el-checkbox v-model="isConNum">{{ $t('user.consuNum') }}</el-checkbox>
                            <el-select v-model="conNumValue" :disabled="!isConNum" :placeholder="$t('user.pleaseSelect')">
                                <el-option
                                    v-for="item in conNumOpts"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <div class="unit-wrapper first-iterm">
                                <el-input
                                    v-model="conNumBegInp"
                                    type="number"
                                    min="0"
                                    @blur="checkNumber (1)"
                                    :disabled="!isConNum"
                                    class="cur-inp">
                                </el-input>
                                <span class="unit">{{ $t('user.bout') }}</span>
                            </div>
                            <span class="interval-line">-</span>
                            <div class="unit-wrapper">
                                <el-input
                                    v-model="conNumEndInp"
                                    type="number"
                                    min="0"
                                    @blur="checkNumber (2)"
                                    :disabled="!isConNum"
                                    class="cur-inp">
                                </el-input>
                                <span class="unit">{{ $t('user.bout') }}</span>
                            </div>
                        </div>
                        <div class="option-line">
                            <el-checkbox v-model="isConAmount">{{ $t('user.consuAmount') }}</el-checkbox>
                            <el-select v-model="conAmountValue" :disabled="!isConAmount" :placeholder="$t('user.pleaseSelect')">
                                <el-option
                                    v-for="item in conAmountOpts"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <div class="unit-wrapper first-iterm">
                                <el-input
                                    type="number"
                                    min="0"
                                    @blur="checkNumber (3)"
                                    v-model="conAmountBegInp"
                                    :disabled="!isConAmount"
                                    class="cur-inp">
                                </el-input>
                                <span class="unit">{{ $t('user.yuan') }}</span>
                            </div>
                            <span class="interval-line">-</span>
                            <div class="unit-wrapper">
                                <el-input
                                    type="number"
                                    min="0"
                                    @blur="checkNumber (4)"
                                    v-model="conAmountEndInp"
                                    :disabled="!isConAmount"
                                    class="cur-inp">
                                </el-input>
                                <span class="unit">{{ $t('user.yuan') }}</span>
                            </div>
                        </div>
                        <div class="option-line">
                            <el-checkbox v-model="isOrderAverPrice">{{ $t('user.averPri') }}</el-checkbox>
                            <el-select v-model="orderAverPriceValue" :disabled="!isOrderAverPrice" :placeholder="$t('user.pleaseSelect')">
                                <el-option
                                    v-for="item in orderAverPriceOpts"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <div class="unit-wrapper first-iterm">
                                <el-input
                                    type="number"
                                    min="0"
                                    @blur="checkNumber (5)"
                                    v-model="orderAverPriceBegInp"
                                    :disabled="!isOrderAverPrice"
                                    class="cur-inp">
                                </el-input>
                                <span class="unit">{{ $t('user.yuan') }}</span>
                            </div>
                            <span class="interval-line">-</span>
                            <div class="unit-wrapper">
                                <el-input
                                    type="number"
                                    min="0"
                                    @blur="checkNumber (6)"
                                    v-model="orderAverPriceEndInp"
                                    :disabled="!isOrderAverPrice"
                                    class="cur-inp">
                                </el-input>
                                <span class="unit">{{ $t('user.yuan') }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="transaction-condition-line currency-line">
                    <div class="title">{{ $t('user.rechargeConditions') }}</div>
                    <div class="deal-condition-content module-content">
                        <!--						<div class="option-line">-->
                        <!--							<el-checkbox v-model="isRecharAmount">{{ $t('user.rechargeAmount') }}</el-checkbox>-->
                        <!--							<el-select v-model="recharAmountVlaue" :disabled="!isRecharAmount" :placeholder="$t('user.pleaseSelect')">-->
                        <!--								<el-option-->
                        <!--									v-for="item in recharAmountOpts"-->
                        <!--									:key="item.value"-->
                        <!--									:label="item.label"-->
                        <!--									:value="item.value">-->
                        <!--								</el-option>-->
                        <!--							</el-select>-->
                        <!--							<div class="unit-wrapper first-iterm">-->
                        <!--								<el-input-->
                        <!--                  type="number"-->
                        <!--                  min="0"-->
                        <!--                  @change="checkNumber (7)"-->
                        <!--									v-model="recharAmountBegInp"-->
                        <!--									:disabled="!isRecharAmount"-->
                        <!--									class="cur-inp">-->
                        <!--								</el-input>-->
                        <!--								<span class="unit">{{ $t('user.yuan') }}</span>-->
                        <!--							</div>-->
                        <!--							<span class="interval-line">-</span>-->
                        <!--							<div class="unit-wrapper">-->
                        <!--								<el-input-->
                        <!--                  type="number"-->
                        <!--                  min="0"-->
                        <!--                  @change="checkNumber (8)"-->
                        <!--									v-model="recharAmountEndInp"-->
                        <!--									:disabled="!isRecharAmount"-->
                        <!--									class="cur-inp">-->
                        <!--								</el-input>-->
                        <!--								<span class="unit">{{ $t('user.yuan') }}</span>-->
                        <!--							</div>-->
                        <!--						</div>-->
                        <div class="option-line">
                            <el-checkbox v-model="isRecharNum">{{ $t('user.rechargeNumber') }}</el-checkbox>
                            <el-select v-model="recharNumValue" :disabled="!isRecharNum" :placeholder="$t('user.pleaseSelect')">
                                <el-option
                                    v-for="item in recharNumOpts"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <div class="unit-wrapper first-iterm">
                                <el-input
                                    type="number"
                                    min="0"
                                    @blur="checkNumber (9)"
                                    v-model="recharNumBegInp"
                                    :disabled="!isRecharNum"
                                    class="cur-inp">
                                </el-input>
                                <span class="unit">{{ $t('user.bout') }}</span>
                            </div>
                            <span class="interval-line">-</span>
                            <div class="unit-wrapper">
                                <el-input
                                    type="number"
                                    min="0"
                                    @blur="checkNumber (10)"
                                    v-model="recharNumEndInp"
                                    :disabled="!isRecharNum"
                                    class="cur-inp">
                                </el-input>
                                <span class="unit">{{ $t('user.bout') }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="transaction-condition-line currency-line">
                    <div class="title">注册来源</div>
                    <div class="deal-condition-content module-content">
                        <div class="option-line">
                            <el-checkbox-group v-model="registSource">
                                <el-checkbox label="1" name="type">小程序</el-checkbox>
                                <el-checkbox label="2" name="type">公众号</el-checkbox>
                                <el-checkbox label="3" name="type">江安红云</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 按键 -->
        <span slot="footer" class="dialog-footer">
			<div class="default-btn" @click="dialogVisible = false">{{ $t('user.calcel') }}</div>
			<div class="default-btn primary-btn" @click="preserveLabel">{{ $t('user.preservation') }}</div>
		</span>
    </el-dialog>
</template>

<script>
import moment from 'moment'

export default {
    data () {
        return {
            registSource: [],
            title: this.$i18n.t('user.addLabel'),
            dialogVisible: false,
            isDisaCondiLabel: false,
            isDisaCustLabel: false,
            labelName: '',
            labelType: '1',
            // 基础条件
            basicConOpts: [{
                value: 0,
                label: this.$i18n.t('user.today')
            }, {
                value: 1,
                label: this.$i18n.t('user.yesterday')
            }, {
                value: 2,
                label: this.$i18n.t('user.lastSevenDay')
            }, {
                value: 3,
                label: this.$i18n.t('user.lastThirtyDay')
            }, {
                value: 4,
                label: this.$i18n.t('user.thisMonth')
            }, {
                value: 5,
                label: this.$i18n.t('user.lastMonth')
            }, {
                value: 6,
                label: this.$i18n.t('user.customRange')
            }],
            // 成为客户时间
            isBeCustTimeChecked: false,
            beCustTimeValue: 0,
            beCustTimeOpts: [],
            beCustTimeRange: '',
            // // 关注时间
            // isfollowTimeChecked: false,
            // followTimeValue: 0,
            // followTimeOpts: [],
            // followTimeRange: '',
            // 成为会员时间
            isBeMemTimeChecked: false,
            beMemTimeValue: 0,
            beMemTimeOpts: [],
            beMemTimeRange: '',
            // 交易条件
            dealConditionOpts: [{
                value: 1,
                label: this.$i18n.t('user.today')
            }, {
                value: 2,
                label: this.$i18n.t('user.lastSevenDay')
            }, {
                value: 3,
                label: this.$i18n.t('user.lastFifteenDay')
            }, {
                value: 4,
                label: this.$i18n.t('user.lastThirtyDay')
            }, {
                value: 5,
                label: this.$i18n.t('user.lastFortyFiveDay')
            }, {
                value: 6,
                label: this.$i18n.t('user.lastSixtyDay')
            }, {
                value: 7,
                label: this.$i18n.t('user.lastNinetyDay')
            }, {
                value: 8,
                label: this.$i18n.t('user.lastOneHundredEightyDay')
            }, {
                value: 0,
                label: this.$i18n.t('user.unlimited')
            }],
            // 最近消费时间
            isNearConTime: false,
            nearConTimeOpts: [],
            nearConTimeValue: 1,
            // 消费次数
            isConNum: false,
            conNumOpts: [],
            conNumValue: 1,
            conNumBegInp: '',
            conNumEndInp: '',
            // 消费金额
            isConAmount: false,
            conAmountOpts: [],
            conAmountValue: 1,
            conAmountBegInp: '',
            conAmountEndInp: '',
            // 订单均价
            isOrderAverPrice: false,
            orderAverPriceOpts: [],
            orderAverPriceValue: 1,
            orderAverPriceBegInp: '',
            orderAverPriceEndInp: '',
            // // 充值金额
            // isRecharAmount: false,
            // recharAmountOpts: [],
            // recharAmountVlaue: 1,
            // recharAmountBegInp: '',
            // recharAmountEndInp: '',
            // 充值次数
            isRecharNum: false,
            recharNumOpts: [],
            recharNumValue: 1,
            recharNumBegInp: '',
            recharNumEndInp: ''
        }
    },
    watch: {
        // 成为客户时间
        beCustTimeValue () {
            this.changeTimeRan(0)
        },
        followTimeValue () {
            this.changeTimeRan(1)
        },
        beMemTimeValue () {
            this.changeTimeRan(2)
        }
    },
    mounted () {
        this.initPullSelOpts()
        this.changeTimeRan(0)
        this.changeTimeRan(1)
        this.changeTimeRan(2)
    },
    methods: {
        // 弹出弹框
        init (userTagId, tagType) {
            this.dialogVisible = true
            this.userTagId = userTagId
            if (tagType === 0) {
                this.isDisaCondiLabel = true
                this.labelType = '0'
                if (userTagId !== '') {
                    this.title = this.$i18n.t('user.editLabel')
                    this.userTagId = userTagId
                    this.getEditLabelDetail()
                }
            } else if (tagType === 1) {
                this.isDisaCustLabel = true
                this.labelType = '1'
                if (userTagId !== '') {
                    this.title = this.$i18n.t('user.editLabel')
                    this.userTagId = userTagId
                    this.getEditLabelDetail()
                }
            }
        },
        /**
         * 输入框纯空格处理
         */
        handleInputSpaces (value) {
            console.log(value)
            if (!value) {
                return ''
            }
            if (!value.trim()) {
                return value.trim()
            } else {
                return value
            }
        },
        /**
         * 输入框的数据改变时，对值进行校验
         */
        checkNumber (type) {
            // 消费次数
            if (type === 1) {
                var BegNum = Math.round(parseInt(this.conNumBegInp))
                if (!BegNum) {
                    BegNum = 0
                } else if (BegNum < 0) {
                    BegNum = 0
                } else if (BegNum > 100000) {
                    BegNum = 100000
                }
                this.conNumBegInp = BegNum
            }
            if (type === 2) {
                var endNum = Math.round(parseInt(this.conNumEndInp))
                if (!endNum) {
                    endNum = 0
                } else if (endNum < 0) {
                    endNum = 0
                } else if (endNum > 100000) {
                    endNum = 100000
                }
                this.conNumEndInp = endNum
            }
            // 消费金额
            if (type === 3) {
                var conBegAmountNum = Math.round(parseFloat(this.conAmountBegInp).toFixed(2))
                if (!conBegAmountNum) {
                    conBegAmountNum = 0
                } else if (conBegAmountNum < 0) {
                    conBegAmountNum = 0
                } else if (conBegAmountNum >= 100000000) {
                    conBegAmountNum = 100000000
                }
                this.conAmountBegInp = conBegAmountNum
            }
            if (type === 4) {
                var conEndAmountNum = Math.round(parseFloat(this.conAmountEndInp).toFixed(2))
                if (!conEndAmountNum) {
                    conEndAmountNum = 0
                } else if (conEndAmountNum < 0) {
                    conEndAmountNum = 0
                } else if (conEndAmountNum >= 100000000) {
                    conEndAmountNum = 100000000
                }
                this.conAmountEndInp = conEndAmountNum
            }
            // 订单均价
            if (type === 5) {
                var ordAverPriceBegNum = Math.round(parseFloat(this.orderAverPriceBegInp).toFixed(2))
                if (!ordAverPriceBegNum) {
                    ordAverPriceBegNum = 0
                } else if (ordAverPriceBegNum < 0) {
                    ordAverPriceBegNum = 0
                } else if (ordAverPriceBegNum >= 100000000) {
                    ordAverPriceBegNum = 100000000
                }
                this.orderAverPriceBegInp = ordAverPriceBegNum
            }
            if (type === 6) {
                var ordAverPriceEndNum = Math.round(parseFloat(this.orderAverPriceEndInp).toFixed(2))
                if (!ordAverPriceEndNum) {
                    ordAverPriceEndNum = 0
                } else if (ordAverPriceEndNum < 0) {
                    ordAverPriceEndNum = 0
                } else if (ordAverPriceEndNum >= 100000000) {
                    ordAverPriceEndNum = 100000000
                }
                this.orderAverPriceEndInp = ordAverPriceEndNum
            }
            // 充值金额
            if (type === 7) {
                var reAmountBegNum = Math.round(parseFloat(this.recharAmountBegInp).toFixed(2))
                if (!reAmountBegNum) {
                    reAmountBegNum = 0
                } else if (reAmountBegNum < 0) {
                    reAmountBegNum = 0
                } else if (reAmountBegNum >= 100000000) {
                    reAmountBegNum = 100000000
                }
                this.recharAmountBegInp = reAmountBegNum
            }
            if (type === 8) {
                var reAmountEndNum = Math.round(parseFloat(this.recharAmountEndInp).toFixed(2))
                if (!reAmountEndNum) {
                    reAmountEndNum = 0
                } else if (reAmountEndNum < 0) {
                    reAmountEndNum = 0
                } else if (reAmountEndNum >= 100000000) {
                    reAmountEndNum = 100000000
                }
                this.recharAmountEndInp = reAmountEndNum
            }
            // 充值次数
            if (type === 9) {
                var recharBegNum = Math.round(parseInt(this.recharNumBegInp))
                if (!recharBegNum) {
                    recharBegNum = 0
                } else if (recharBegNum < 0) {
                    recharBegNum = 0
                } else if (recharBegNum > 100000) {
                    recharBegNum = 100000
                }
                this.recharNumBegInp = recharBegNum
            }
            if (type === 10) {
                var recharEndNum = Math.round(parseInt(this.recharNumEndInp))
                if (!recharEndNum) {
                    recharEndNum = 0
                } else if (recharEndNum < 0) {
                    recharEndNum = 0
                } else if (recharEndNum > 100000) {
                    recharEndNum = 100000
                }
                this.recharNumEndInp = recharEndNum
            }
        },
        initPullSelOpts () {
            // 基础条件
            this.beCustTimeOpts = this.basicConOpts
            this.followTimeOpts = this.basicConOpts
            this.beMemTimeOpts = this.basicConOpts
            // 交易条件
            this.nearConTimeOpts = this.dealConditionOpts
            this.conNumOpts = this.dealConditionOpts
            this.conAmountOpts = this.dealConditionOpts
            this.orderAverPriceOpts = this.dealConditionOpts
            this.recharAmountOpts = this.dealConditionOpts
            this.recharNumOpts = this.dealConditionOpts
        },
        // 获取单个标签的详情
        getEditLabelDetail () {
            this.$http({
                url: this.$http.adornUrl('/user/userTag/info/' + this.userTagId),
                method: 'GET',
                data: this.$http.adornData({})
            }).then(({data}) => {
                if (this.labelType === '0') {
                    this.labelName = data.tagName
                } else if (this.labelType === '1') {
                    this.labelName = data.tagName
                    // 成为客户时间
                    if (data.registerMinTime !== null && data.registerMaxTime !== null) {
                        let beCustTimeRange = []
                        this.isBeCustTimeChecked = true
                        this.beCustTimeValue = 6
                        beCustTimeRange.push(data.registerMinTime)
                        beCustTimeRange.push(data.registerMaxTime)
                        this.beCustTimeRange = beCustTimeRange
                    }
                    // 关注时间
                    if (data.subscribeMinTime !== null && data.subscribeMaxTime !== null) {
                        let followTimeRange = []
                        this.isfollowTimeChecked = true
                        this.followTimeValue = 6
                        followTimeRange.push(data.subscribeMinTime)
                        followTimeRange.push(data.subscribeMaxTime)
                        this.followTimeRange = followTimeRange
                    }
                    // 成为会员时间
                    if (data.toBeMemberMinTime !== null && data.toBeMemberMaxTime !== null) {
                        let beMemTimeRange = []
                        this.isBeMemTimeChecked = true
                        this.beMemTimeValue = 6
                        beMemTimeRange.push(data.toBeMemberMinTime)
                        beMemTimeRange.push(data.toBeMemberMaxTime)
                        this.beMemTimeRange = beMemTimeRange
                    }
                    // 最近消费时间
                    if (data.recentPurchaseTime !== null) {
                        this.isNearConTime = true
                        this.nearConTimeValue = data.recentPurchaseTime
                    }
                    // 消费次数
                    if (data.purchaseNumTime !== null && data.purchaseNumMinNum !== null && data.purchaseNumMaxNum !== null) {
                        this.isConNum = true
                        this.conNumValue = data.purchaseNumTime
                        this.conNumBegInp = data.purchaseNumMinNum
                        this.conNumEndInp = data.purchaseNumMaxNum
                    }
                    // 消费金额
                    if (data.purchaseAmountTime !== null && data.purchaseAmountMinAmount !== null && data.purchaseAmountMaxAmount !== null) {
                        this.isConAmount = true
                        this.conAmountValue = data.purchaseAmountTime
                        this.conAmountBegInp = data.purchaseAmountMinAmount
                        this.conAmountEndInp = data.purchaseAmountMaxAmount
                    }
                    // 订单均价
                    if (data.orderAveragePriceTime !== null && data.orderAveragePriceMinAmount !== null && data.orderAveragePriceMaxAmount !== null) {
                        this.isOrderAverPrice = true
                        this.orderAverPriceValue = data.orderAveragePriceTime
                        this.orderAverPriceBegInp = data.orderAveragePriceMinAmount
                        this.orderAverPriceEndInp = data.orderAveragePriceMaxAmount
                    }
                    // 充值金额
                    if (data.rechargeAmountTime !== null && data.rechargeAmountMinAmount !== null && data.rechargeAmountMaxAmount !== null) {
                        this.isRecharAmount = true
                        this.recharAmountVlaue = data.rechargeAmountTime
                        this.recharAmountBegInp = data.rechargeAmountMinAmount
                        this.recharAmountEndInp = data.rechargeAmountMaxAmount
                    }
                    // 充值次数
                    if (data.rechargeNumTime !== null && data.rechargeNumMinNum !== null && data.rechargeNumMaxNum !== null) {
                        this.isRecharNum = true
                        this.recharNumValue = data.rechargeNumTime
                        this.recharNumBegInp = data.rechargeNumMinNum
                        this.recharNumEndInp = data.rechargeNumMaxNum
                    }

                    if(data.registSource) {
                        this.registSource = data.registSource.split(",")
                    }
                }
            })
        },
        // 修改为自定义范围
        chagCustTimeRange (val) {
            // val：0-成为客户时间 1-关注时间 2-成为会员时间
            if (val === 0) {
                this.beCustTimeValue = 6
            } else if (val === 1) {
                this.followTimeValue = 6
            } else if (val === 2) {
                this.beMemTimeValue = 6
            }
        },
        // 改变时间范围
        changeTimeRan (value) {
            // value: 0-成为客户时间 1-关注时间 2-成为会员时间
            let seleItem = ''
            let timeRange = []
            let time = new Date()
            let beginTime = ''
            let endTime = ''
            if (value === 0) {
                seleItem = this.beCustTimeValue
            } else if (value === 1) {
                seleItem = this.followTimeValue
            } else if (value === 2) {
                seleItem = this.beMemTimeValue
            }

            if (seleItem === 0) {
                beginTime = moment(time).format('LL')
                endTime = beginTime
            } else if (seleItem === 1) {
                beginTime = moment(time).add(-1, 'days').format('L')
                endTime = beginTime
            } else if (seleItem === 2) {
                beginTime = moment(time).add(-7, 'days').format('L')
                endTime = moment(time).add(-1, 'days').format('L')
            } else if (seleItem === 3) {
                beginTime = moment(time).add(-30, 'days').format('L')
                endTime = moment(time).add(-1, 'days').format('L')
            } else if (seleItem === 4) {
                // 本月的开始结束时间
                beginTime = moment(time).startOf('month').format('L')
                endTime = moment(time).endOf('month').format('L')
            } else if (seleItem === 5) {
                // 上个月的开始结束时间
                beginTime = moment(time).add(-1, 'month').startOf('month').format('L')
                endTime = moment(time).add(-1, 'month').endOf('month').format('L')
            }
            if (seleItem !== 6) {
                timeRange.push(beginTime)
                timeRange.push(endTime)
                if (value === 0) {
                    this.beCustTimeRange = timeRange
                } else if (value === 1) {
                    this.followTimeRange = timeRange
                } else if (value === 2) {
                    this.beMemTimeRange = timeRange
                }
            }
        },
        // 增加/编辑标签
        preserveLabel () {
            // 判断是否为整数/零的正则
            let posIntReg = /^([0]|[1-9][0-9]*)$/
            let tagType = this.labelType
            let tagName = this.labelName
            let userTagId = this.userTagId
            let addOrEditMeth = ''
            if (!tagName || !tagName.trim()) {
                return this.$message.warning(this.$i18n.t('user.labelName') + this.$i18n.t('webInfoConfig.canNotBeEmpty'))
            }
            // 新增条件标签
            if (tagType === '0') {
                // 判断是新增/编辑
                if (userTagId !== '') {
                    addOrEditMeth = 'PUT'
                } else {
                    addOrEditMeth = 'POST'
                }
                let params = {
                    userTagId,
                    tagType,
                    tagName
                }
                this.$http({
                    url: this.$http.adornUrl('/user/userTag'),
                    method: addOrEditMeth,
                    data: this.$http.adornData(params)
                }).then(({data}) => {
                    this.dialogVisible = false
                    this.$emit('refreshLabelList', true)
                })
            } else if (tagType === '1') {
                // 清空条件的参数标记
                let clearRegisterTime = false
                let clearSubscribeTime = false
                let clearToBeMemberTime = false
                let clearRecentPurchaseTime = false
                let clearPurchaseNum = false
                let clearPurchaseAmount = false
                let clearOrderAveragePrice = false
                let clearRechargeAmount = false
                let clearRechargeNum = false
                // 判断是新增/编辑
                if (userTagId !== '') {
                    addOrEditMeth = 'PUT'
                } else {
                    addOrEditMeth = 'POST'
                }
                // 判断是否选中某个条件，选中就就不能为空
                // 成为客户时间
                let registerMinTime = ''
                let registerMaxTime = ''
                if (this.isBeCustTimeChecked === true && this.beCustTimeRange !== null && this.beCustTimeRange[0] !== '' && this.beCustTimeRange[1] !== '') {
                    registerMinTime = moment(this.beCustTimeRange[0]).startOf('days').format('LL')
                    registerMaxTime = moment(this.beCustTimeRange[1]).endOf('days').format('LL')
                }
                if (this.isBeCustTimeChecked === false) {
                    clearRegisterTime = true
                }
                // 关注时间
                let subscribeMinTime = ''
                let subscribeMaxTime = ''
                if (this.isfollowTimeChecked === true && this.followTimeRange !== null && this.followTimeRange[0] !== '' && this.followTimeRange[1] !== '') {
                    subscribeMinTime = moment(this.followTimeRange[0]).startOf('days').format('LL')
                    subscribeMaxTime = moment(this.followTimeRange[1]).endOf('days').format('LL')
                }
                if (this.isfollowTimeChecked === false) {
                    clearSubscribeTime = true
                }
                // 成为会员时间
                let toBeMemberMinTime = ''
                let toBeMemberMaxTime = ''
                if (this.isBeMemTimeChecked === true && this.beMemTimeRange !== null && this.beMemTimeRange[0] !== '' && this.beMemTimeRange[1] !== '') {
                    toBeMemberMinTime = moment(this.beMemTimeRange[0]).startOf('days').format('LL')
                    toBeMemberMaxTime = moment(this.beMemTimeRange[1]).endOf('days').format('LL')
                }
                if (this.isBeMemTimeChecked === false) {
                    clearToBeMemberTime = true
                }
                // 最近消费时间
                let recentPurchaseTime = ''
                if (this.isNearConTime === true) {
                    recentPurchaseTime = this.nearConTimeValue
                } else {
                    clearRecentPurchaseTime = true
                }
                // 消费次数
                let purchaseNumTime = ''
                let purchaseNumMinNum = ''
                let purchaseNumMaxNum = ''
                if (this.isConNum === true) {
                    purchaseNumTime = this.conNumValue
                    if (posIntReg.test(this.conNumBegInp) && posIntReg.test(this.conNumEndInp)) {
                        purchaseNumMinNum = this.conNumBegInp
                        purchaseNumMaxNum = this.conNumEndInp
                    }
                } else {
                    clearPurchaseNum = true
                }
                // 消费金额
                let purchaseAmountTime = ''
                let purchaseAmountMinAmount = ''
                let purchaseAmountMaxAmount = ''
                if (this.isConAmount === true) {
                    purchaseAmountTime = this.conAmountValue
                    if (posIntReg.test(this.conAmountBegInp) && posIntReg.test(this.conAmountEndInp)) {
                        purchaseAmountMinAmount = this.conAmountBegInp
                        purchaseAmountMaxAmount = this.conAmountEndInp
                    }
                } else {
                    clearPurchaseAmount = true
                }
                // 订单均价
                let orderAveragePriceTime = ''
                let orderAveragePriceMinAmount = ''
                let orderAveragePriceMaxAmount = ''
                if (this.isOrderAverPrice === true) {
                    orderAveragePriceTime = this.orderAverPriceValue
                    if (posIntReg.test(this.orderAverPriceBegInp) && posIntReg.test(this.orderAverPriceEndInp)) {
                        orderAveragePriceMinAmount = this.orderAverPriceBegInp
                        orderAveragePriceMaxAmount = this.orderAverPriceEndInp
                    }
                } else {
                    clearOrderAveragePrice = true
                }
                // 充值金额
                let rechargeAmountTime = ''
                let rechargeAmountMinAmount = ''
                let rechargeAmountMaxAmount = ''
                if (this.isRecharAmount === true) {
                    rechargeAmountTime = this.recharAmountVlaue
                    if (posIntReg.test(this.recharAmountBegInp) && posIntReg.test(this.recharAmountEndInp)) {
                        rechargeAmountMinAmount = this.recharAmountBegInp
                        rechargeAmountMaxAmount = this.recharAmountEndInp
                    }
                } else {
                    clearRechargeAmount = true
                }
                // 充值次数
                let rechargeNumTime = ''
                let rechargeNumMinNum = ''
                let rechargeNumMaxNum = ''
                if (this.isRecharNum === true) {
                    rechargeNumTime = this.recharNumValue
                    if (posIntReg.test(this.recharNumBegInp) && posIntReg.test(this.recharNumEndInp)) {
                        rechargeNumMinNum = this.recharNumBegInp
                        rechargeNumMaxNum = this.recharNumEndInp
                    }
                } else {
                    clearRechargeNum = true
                }

                let registSource = this.registSource.join(",");

                if (tagName.trim() === '') {
                    this.$message.warning(this.$i18n.t('user.labelNameNullTips'))
                } else if (this.isBeCustTimeChecked === false && this.isBeMemTimeChecked === false &&
                    this.isConNum === false && this.isConAmount === false && this.isOrderAverPrice === false &&
                    this.isRecharNum === false && this.isNearConTime === false && this.registSource.length < 1) {
                    this.$message.warning(this.$i18n.t('user.requireOne'))
                } else if (this.isBeCustTimeChecked === true && (this.beCustTimeRange === null || this.beCustTimeRange[0] === '' || this.beCustTimeRange[1] === '')) {
                    this.$message.warning(this.$i18n.t('user.becomeCustomerTimeNullTips'))
                } else if (this.isfollowTimeChecked === true && (this.followTimeRange === null || this.followTimeRange[0] === '' || this.followTimeRange[1] === '')) {
                    this.$message.warning(this.$i18n.t('user.followTimeNullTips'))
                } else if (this.isBeMemTimeChecked === true && (this.beMemTimeRange === null || this.beMemTimeRange[0] === '' || this.beMemTimeRange[1] === '')) {
                    this.$message.warning(this.$i18n.t('user.becomeMemberTimeNullTips'))
                } else if (this.isConNum === true && (purchaseNumMinNum === '' || purchaseNumMaxNum === '')) {
                    this.$message.warning(this.$i18n.t('user.consuNumNullTips'))
                } else if (this.isConAmount === true && (purchaseAmountMinAmount === '' || purchaseAmountMaxAmount === '')) {
                    this.$message.warning(this.$i18n.t('user.consuAmountNullTips'))
                } else if (this.isOrderAverPrice === true && (orderAveragePriceMinAmount === '' || orderAveragePriceMaxAmount === '')) {
                    this.$message.warning(this.$i18n.t('user.averPriNullTips'))
                } else if (this.isRecharAmount === true && (rechargeAmountMinAmount === '' || rechargeAmountMaxAmount === '')) {
                    this.$message.warning(this.$i18n.t('user.rechargeAmountNullTips'))
                } else if (this.isRecharNum === true && (rechargeNumMinNum === '' || rechargeNumMaxNum === '')) {
                    this.$message.warning(this.$i18n.t('user.rechargeNumberNullTips'))
                } else {
                    let params = {
                        userTagId,
                        tagType,
                        tagName,
                        registerMinTime,
                        registerMaxTime,
                        subscribeMinTime,
                        subscribeMaxTime,
                        toBeMemberMinTime,
                        toBeMemberMaxTime,
                        recentPurchaseTime,
                        purchaseNumTime,
                        purchaseNumMinNum,
                        purchaseNumMaxNum,
                        purchaseAmountTime,
                        purchaseAmountMinAmount,
                        purchaseAmountMaxAmount,
                        orderAveragePriceTime,
                        orderAveragePriceMinAmount,
                        orderAveragePriceMaxAmount,
                        rechargeAmountTime,
                        rechargeAmountMinAmount,
                        rechargeAmountMaxAmount,
                        rechargeNumTime,
                        rechargeNumMinNum,
                        rechargeNumMaxNum,
                        clearRegisterTime,
                        clearSubscribeTime,
                        clearToBeMemberTime,
                        clearRecentPurchaseTime,
                        clearPurchaseNum,
                        clearPurchaseAmount,
                        clearOrderAveragePrice,
                        clearRechargeAmount,
                        clearRechargeNum,
                        registSource
                    }
                    this.$http({
                        url: this.$http.adornUrl('/user/userTag'),
                        method: addOrEditMeth,
                        data: this.$http.adornData(params)
                    }).then(({data}) => {
                        this.dialogVisible = false
                        this.$emit('refreshLabelList', true)
                    })
                }
            }
        },
        onCloseClr () {
            this.$emit('refreshLabelList', false)
        }
    }
}
</script>

<style lang="scss">
.edit-label-content {
    font-size: 12px;
    overflow: auto;
    /* 行内通用 */
    .currency-line {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .currency-line .title {
        min-width: 130px;
        font-size: 12px;
        font-weight: normal;
        text-align: right;
        padding: 0 15px 0 0;
        margin: 0;
    }

    .currency-line .must-term {
        color: #F56C6C;
        margin-right: 4px;
    }

    .currency-line .el-checkbox {
        width: 180px;
        margin-right: 10px;
    }

    .currency-line .el-radio__label, .currency-line .el-checkbox__label, .currency-line .el-input, .currency-line .el-range-input {
        font-size: 12px;
    }

    .currency-line .module-content {
        padding: 0 15px;
    }

    .currency-line .module-content .option-line {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
    }

    .currency-line .module-content .option-line .unit-wrapper {
        display: flex;
        align-items: center;
    }

    .currency-line .module-content .option-line .first-iterm {
        margin-left: 25px;
    }

    .currency-line .module-content .option-line .interval-line {
        padding: 0 10px;
    }

    .currency-line .module-content .option-line .unit {
        display: inline-block;
        width: 50px;
        height: 40px;
        line-height: 40px;
        background: #efefef;
        border: 1px solid #dcdfe6;
        border-left: none;
        text-align: center;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
    }

    .currency-line .module-content .el-select {
        max-width: 185px;
        height: 38px;
        margin-right: 15px;
    }

    .currency-line .module-content .cur-inp {
        width: 100%;
    }

    .currency-line .module-content .cur-inp .el-input__inner {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    /* /行内通用 */
    .label-condition-title-line {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        margin-left: 10px;
        margin-bottom: 10px;
    }

    .label-condition-title-line .tips {
        font-size: 12px;
        font-weight: normal;
        color: #595961;
        padding-left: 20px;
    }

    .label-name-line input {
        width: 300px;
        height: 30px;
        border: 1px solid #e0e0e0;
        border-radius: 3px;
    }
}

@media (max-width: 1880px) {
    .el-dialog-box .el-dialog {
        width: 60%;
    }
}

@media (max-width: 1650px) {
    .el-dialog-box .el-dialog {
        width: 70%;
    }
}

@media (max-width: 1380px) {
    .el-dialog-box .el-dialog {
        width: 80%;
    }
}
</style>
