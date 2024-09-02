<template>
    <el-dialog
        class="activityEdit" :title="!dataForm.cardId ? this.$i18n.t('sysManagement.add') : this.$i18n.t('sysManagement.modify')" :close-on-click-modal="false"
        :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="125px">
            <el-form-item label="卡前缀" prop="cardPrefix">
                <el-input v-model="dataForm.cardPrefix" :disabled="dataForm.cardId" @blur="cardPrefixBlur" size="small" placeholder="请输入卡前缀"></el-input>
            </el-form-item>
            <el-form-item label="生成数量" prop="cardNum" v-if="!dataForm.cardId">
                <el-input v-model="dataForm.cardNum" type="number" size="small" placeholder="请输入生成数量"></el-input>
            </el-form-item>

            <el-form-item label="会员卡名称" prop="cardTitle">
                <el-input v-model="dataForm.cardTitle" size="small" placeholder="请输入会员卡名称"></el-input>
            </el-form-item>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="会员卡图片" prop="cardImg">
                        <div class="license-content">
                            <img-upload v-model="dataForm.cardImg" @input="imgChange(dataForm.cardImg, 'cardImg', 'dataForm')"/>
                        </div>
                        <div class="upload-tips">
                            仅限jpg、png、大小不超过2M，仅限上传1张
                        </div>
                    </el-form-item>
                </el-col>
                <!--                <el-col :span="12">-->
                <!--                    <el-form-item label="会员卡logo" prop="cardLogo">-->
                <!--                        <div class="license-content">-->
                <!--                            <img-upload v-model="dataForm.cardLogo" @input="imgChange(dataForm.cardLogo, 'cardLogo', 'dataForm')"/>-->
                <!--                        </div>-->
                <!--                        <div class="upload-tips">-->
                <!--                            仅限jpg、png、大小不超过2M，仅限上传1张-->
                <!--                        </div>-->
                <!--                    </el-form-item>-->
                <!--                </el-col>-->
            </el-row>
            <el-form-item label="使用介绍" prop="useInfo">
                <el-input v-model="dataForm.useInfo" size="small" placeholder="请输入使用介绍" type="textarea" :rows="3" :autosize="{ minRows: 2, maxRows: 5}"></el-input>
            </el-form-item>
            <!--            <el-form-item label="特权介绍" prop="privilege">-->
            <!--                <el-input v-model="dataForm.privilege" size="small" placeholder="请输入特权介绍" type="textarea" :rows="3" :autosize="{ minRows: 2, maxRows: 5}"></el-input>-->
            <!--            </el-form-item>-->
            <el-form-item label="客服电话" prop="mobile">
                <el-input v-model="dataForm.mobile" size="small" placeholder="请输入客服电话"></el-input>
            </el-form-item>

            <el-form-item label="卡余额" prop="balance">
                <el-input v-model="dataForm.balance" :disabled="dataForm.cardId && dataForm.status > 1" placeholder="请输入卡余额" type="number" @change="balanceChange" min="0">
                    <template slot="append">{{ $t('coupon.yuan') }}</template>
                </el-input>
            </el-form-item>
            <el-form-item label="类型" prop="cardType">
                <el-select style="width: 100%;" v-model="dataForm.cardType" :disabled="dataForm.status == 3 || dataForm.status == 5 || dataForm.status == 6" placeholder="请选择类型">
                    <el-option v-for="(item,index) in cardTypeList" :key="index" :label="item.title" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商家是否承担金额" prop="isShopAmount" v-if="dataForm.cardType == 2">
              <el-radio-group v-model="dataForm.isShopAmount">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="状态" prop="status" v-if="dataForm.cardId">
                <el-select style="width: 100%;" v-model="dataForm.status" :disabled="dataForm.status == -1 || dataForm.status == 5 || dataForm.status == 6 || dataForm.status == 7" placeholder="请选择状态">
                    <el-option label="未制卡(券)" value="0"></el-option>
                    <el-option label="未出售" value="1"></el-option>
                    <el-option label="已出售" value="2"></el-option>
                    <el-option label="已绑定" value="3"></el-option>
                    <el-option label="已冻结" value="4"></el-option>
                    <el-option label="已置换" value="5" v-if="dataForm.cardType == 2"></el-option>
                    <el-option label="已核销" value="6" v-if="dataForm.cardType == 2"></el-option>
                    <el-option label="已失效" value="-1"></el-option>
                    <el-option label="已作废" value="7"></el-option>
                </el-select>
            </el-form-item>
          <el-form-item label="作废原因" prop="reason" v-if="dataForm.cardId && dataForm.status == 7">
            <el-input v-model="dataForm.reason" size="small" placeholder="请输入作废原因" type="textarea"></el-input>
          </el-form-item>
            <el-form-item label="开始时间" prop="userStartTime">
                <el-date-picker
                        v-model="dataForm.userStartTime"
                        type="date"
                        placeholder="选择开始时间"
                        style="width: 100%"
                        value-format="yyyy-MM-dd"
                        :disabled="dataForm.status == 3"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="userEndTime">
                <el-date-picker
                        v-model="dataForm.userEndTime"
                        type="date"
                        placeholder="选择结束时间"
                        style="width: 100%"
                        value-format="yyyy-MM-dd"
                        :disabled="dataForm.status == 3"
                >
                </el-date-picker>
            </el-form-item>
            <!--            <el-form-item label="会员折扣" prop="discount">-->
            <!--                <el-input-number v-model="dataForm.discount" :precision="2" :step="0.1" :max="10"></el-input-number> <span>折</span>-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="消费" prop="integralRatio">-->
            <!--                <el-input v-model="dataForm.integralRatio" @change="setShopGetScore">-->
            <!--                    <template slot="append">{{$t('coupon.yuan')}}获取1积分</template>-->
            <!--                </el-input>-->
            <!--            </el-form-item>-->

            <el-form-item label="适用店铺" prop="suitableProdType">
                <el-radio-group v-model="dataForm.suitableProdType">
                    <el-radio :label="1" :disabled="dataForm.status == 3">全部店铺参与</el-radio>
                    <el-radio :label="2" :disabled="dataForm.status == 3">指定店铺参与</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <div class="default-btn" v-if="dataForm.suitableProdType === 2" @click="shopsSelectHandle()">店铺选择</div>
            </el-form-item>
            <el-form-item style="width:100%" v-if="dataForm.suitableProdType === 2">
                <el-row>
                    <div></div>
                    <el-col v-for="(cardShop, index) in dataForm.cardShops" :key="index" :span="4">
                        <el-card :body-style="{ padding: '0px' }" style="height: 160px;width: 120px;margin-bottom: 15px">
                            <prod-pic height="104px" width="100%" :pic="cardShop.shopLogo"></prod-pic>
                            <div class="card-prod-bottom prod-line-height">
                                <span class="card-prod-name">{{ cardShop.shopName }}</span>
                                <div class="default-btn text-btn prod-text-left" @click="deleteShop(index)">{{ $t('coupon.delete') }}
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <div class="default-btn" @click="(visible = false)">
                {{ $t('coupon.cancel') }}
            </div>
            <el-button style="margin-left: 10px;" size="small" type="primary" @click="dataFormSubmit()" :loading="isSubmit">{{ $t('coupon.confirm') }}</el-button>
        </span>
        <shop-select v-if="shopsSelectVisible" ref="shopsSelect" @refreshSelectShops="selectCouponShops"></shop-select>
    </el-dialog>
</template>

<script>
import TinyMce from '@/components/tiny-mce'
import imgUpload from '@/components/img-upload'
import ProdPic from '@/components/prod-pic'
import ShopSelect from '@/components/shop-selection'
export default {
    components: {TinyMce, imgUpload, ProdPic, ShopSelect},
    data () {
        var validateTime = (rule, value, callback) => {
            if (Date.parse(this.dataForm.userStartTime) >= Date.parse(this.dataForm.userEndTime)) {
                callback(new Error("开始时间不能大于或等于结束时间"))
            } else {
                callback()
            }
        }
        return {
            visible: false,
            isSubmit: false,
            shopsSelectVisible: false,
            dataForm: {
                cardTitle: '',
                useInfo: '',
                privilege: '',
                mobile: '',
                discount: null,
                integralRatio: null,
                cardImg: null,
                cardLogo: null,
                balance: 0,
                suitableProdType: null,
                cardShops: [],
                cardNum: 1,
                cardType: null,
                cardPrefix: null,
                userStartTime: null,
                userEndTime: null,
                reason:'',
                isShopAmount:0
            },
            dataRule: {
                cardTitle: [{required: true, message: '会员卡名称不能为空', trigger: 'blur'},],
                cardImg: [{required: true, message: '会员卡图片不能为空', trigger: 'change',},],
                useInfo: [{required: true, message: '使用介绍不能为空', trigger: 'blur',},],
                privilege: [{required: true, message: '特权介绍不能为空', trigger: 'blur',},],
                mobile: [{required: true, message: '客服电话不能为空', trigger: 'blur',},],
                discount: [{required: true, message: '会员折扣不能为空', trigger: 'blur',},],
                integralRatio: [{required: true, message: '积分比例不能为空', trigger: 'blur',},],
                balance: [{required: true, message: '卡余额不能为空', trigger: 'blur',},],
                cardNum: [{required: true, message: '生成数量不能为空', trigger: 'blur',},],
                suitableProdType: [{required: true, message: '适用店铺不能为空', trigger: 'blur'}],
                cardType: [{required: true, message: '类型不能为空', trigger: 'blur'}],
                cardPrefix: [{required: true, message: '卡前缀不能为空', trigger: 'blur'}],
                userStartTime: [
                    { required: true, message: "开始时间不能为空", trigger: 'blur' },
                    { validator: validateTime, trigger: 'blur' }
                ],
                userEndTime: [
                    { required: true, message: "结束时间不能为空", trigger: 'blur' },
                    { validator: validateTime, trigger: 'blur' }
                ],
            },
            cardTypeList: [],
            prefixFlag:true,
        }
    },
    methods: {
        //查询卡前缀是否存在
        cardPrefixBlur(){
            this.$http({
                url: this.$http.adornUrl('/platform/card/getCardPrefix'),
                method: 'get',
                params: this.$http.adornParams({cardPrefix:this.dataForm.cardPrefix}),
            }).then(({data}) => {
                this.prefixFlag = false;
            })
        },
        init (id) {
            this.dataForm.cardId = id || 0;
            this.isSubmit = false
            this.visible = true
            this.getTypeData();

            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
                if (this.dataForm.cardId) {
                    this.$http({
                        url: this.$http.adornUrl(
                            `/platform/card/info/${this.dataForm.cardId}`
                        ),
                        method: 'get',
                        params: this.$http.adornParams(),
                    }).then(({data}) => {
                        data.cardType = data.cardType.toString();
                        this.dataForm = data
                        this.dataForm.status = this.dataForm.status.toString();
                    })
                }
            })
        },
        // 获取类型
        getTypeData () {
            let type = 'card_type'
            this.$http({
                url: this.$http.adornUrl(`/sys/dictData/getByType/${type}`),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                this.cardTypeList = data
            })
        },
        /**
         * 消费金额最低要求检验
         */
        balanceChange () {
            let balance = this.dataForm.balance
            this.dataForm.balance = balance <= 0 ? 0.01 : balance
            this.dataForm.balance = balance > 9999999999999 ? 9999999999999 : balance
        },
        // 表单提交
        dataFormSubmit () {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    if (this.isSubmit) {
                        return false
                    }
                    this.isSubmit = true
                    this.$http({
                        url: this.$http.adornUrl(`/platform/card`),
                        method: this.dataForm.cardId ? 'put' : 'post',
                        data: this.$http.adornData(this.dataForm),
                    })
                    .then(({data}) => {
                      this.$message({
                        message: this.$i18n.t('publics.operation'),
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                          this.visible = false
                          this.$emit('refreshDataList')
                        },
                      })
                    })
                    .catch((e) => {
                      this.isSubmit = false
                    })
                }
            })
        },
        imgChange (value, prop, formName) {
            if (value) {
                this.$refs[formName].validateField(prop)
            }
            this.$nextTick(() => {
                this.$forceUpdate()
            })
        },
        setShopGetScore () {
            let num = Math.round(this.dataForm.integralRatio)
            this.dataForm.integralRatio = num < 1 ? 1 : num
            if (num >= 100000000) {
                this.dataForm.integralRatio = 100000000
            }
        },
        deleteShop (index) {
            this.dataForm.cardShops.splice(index, 1)
            this.$forceUpdate()
        },
        // 显示添加指定商品弹框
        shopsSelectHandle () {
            this.shopsSelectVisible = true
            this.$nextTick(() => {
                this.$refs.shopsSelect.init(this.dataForm.cardShops)
            })
        },
        selectCouponShops (shops) {
            if (shops) {
                this.dataForm.cardShops = shops
                this.$forceUpdate();
            }
        },
    },
}
</script>
<style lang="scss">
</style>
