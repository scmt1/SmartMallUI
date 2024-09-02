<template>
    <el-dialog
        class="activityEdit" :title="!dataForm.cardId ? '新增' : '修改'" :close-on-click-modal="false"
        :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
            <el-form-item label="卡前缀" prop="cardPrefix">
                <el-input v-model="dataForm.cardPrefix" @blur="cardPrefixBlur" size="small" placeholder="请输入卡前缀"></el-input>
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
                <el-input v-model="dataForm.balance" :disabled="dataForm.status > 1" placeholder="请输入卡余额" type="number" @change="balanceChange" min="0">
                    <template slot="append">{{ $t('coupon.yuan') }}</template>
                </el-input>
            </el-form-item>
            <el-form-item label="类型" prop="cardType">
                <el-select style="width: 100%;" v-model="dataForm.cardType" placeholder="请选择类型">
                    <el-option v-for="(item,index) in cardTypeList" :key="index" :label="item.title" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status" v-if="dataForm.cardId">
                <el-select style="width: 100%;" v-model="dataForm.status" placeholder="请选择状态">
                    <el-option label="未制卡(券)" value="0"></el-option>
                    <el-option label="未出售" value="1"></el-option>
                    <el-option label="已出售" value="2"></el-option>
                    <el-option label="已绑定" value="3"></el-option>
                    <el-option label="已冻结" value="4"></el-option>
                </el-select>
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
        </el-form>
        <span slot="footer" class="dialog-footer">
            <div class="default-btn" @click="(visible = false)">
                取消
            </div>
            <div class="default-btn primary-btn" @click="dataFormSubmit()">
                保存
            </div>
        </span>
    </el-dialog>
</template>

<script>
import TinyMce from '@/components/tiny-mce'
import imgUpload from '@/components/img-upload'
import ProdPic from '@/components/prod-pic'
export default {
    components: {TinyMce, imgUpload, ProdPic},
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
                cardShops: [],
                cardNum: 1,
                cardType: null,
                cardPrefix: null,
                userStartTime: null,
                userEndTime: null
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
                url: this.$http.adornUrl(
                    '/admin/card/getCardPrefix'
                ),
                method: 'get',
                params: this.$http.adornParams({cardPrefix:this.dataForm.cardPrefix}),
            }).then(({data}) => {
                this.prefixFlag = false;
            })
        },
        init (id) {
            this.dataForm.cardId = id || 0
            this.isSubmit = false
            this.visible = true
            this.getTypeData();
        },
        // 获取类型
        getTypeData () {
            let type = 'card_type'
            this.$http({
                url: this.$http.adornUrl(`/multishop/sys/dictData/getByType/${type}`),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                this.cardTypeList = data
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    if (this.dataForm.cardId) {
                        this.$http({
                            url: this.$http.adornUrl(
                                `/admin/card/info/${this.dataForm.cardId}`
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
                    if(!this.prefixFlag){
                        this.$http({
                          url: this.$http.adornUrl(`/admin/card`),
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
                    }else{
                      this.$message.warning("卡前缀已存在请更换");
                      this.isSubmit = false
                  }
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
    },
}
</script>
<style lang="scss">
</style>
