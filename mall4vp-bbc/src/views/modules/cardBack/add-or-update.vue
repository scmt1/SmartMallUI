<template>
    <el-dialog
        class="activityEdit" :title="!dataForm.id ? this.$i18n.t('sysManagement.add') : this.$i18n.t('sysManagement.modify')" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
            <el-form-item label="会员卡名称" prop="cardTitle">
                <el-input v-model="dataForm.cardTitle" size="small" placeholder="请输入会员卡名称"></el-input>
            </el-form-item>

            <el-row>
                <el-col :span="12">
                    <el-form-item label="会员卡背景" prop="cardImg">
                        <div class="license-content">
                            <img-upload v-model="dataForm.cardImg" @input="imgChange(dataForm.cardImg, 'cardImg', 'dataForm')"/>
                        </div>
                        <div class="upload-tips">
                            仅限jpg、png、大小不超过2M，仅限上传1张
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="会员卡logo" prop="cardLogo">
                        <div class="license-content">
                            <img-upload v-model="dataForm.cardLogo" @input="imgChange(dataForm.cardLogo, 'cardLogo', 'dataForm')"/>
                        </div>
                        <div class="upload-tips">
                            仅限jpg、png、大小不超过2M，仅限上传1张
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="使用介绍" prop="useInfo">
                <el-input v-model="dataForm.useInfo" size="small" placeholder="请输入使用介绍" type="textarea" :rows="3" :autosize="{ minRows: 2, maxRows: 5}"></el-input>
            </el-form-item>
            <el-form-item label="特权介绍" prop="privilege">
                <el-input v-model="dataForm.privilege" size="small" placeholder="请输入特权介绍" type="textarea" :rows="3" :autosize="{ minRows: 2, maxRows: 5}"></el-input>
            </el-form-item>
            <el-form-item label="客服电话" prop="mobile">
                <el-input v-model="dataForm.mobile" size="small" placeholder="请输入客服电话"></el-input>
            </el-form-item>

            <el-form-item label="会员折扣" prop="discount">
                <el-input-number v-model="dataForm.discount" :precision="2" :step="0.1" :max="10"></el-input-number> <span>折</span>
            </el-form-item>
            <el-form-item label="消费" prop="integralRatio">
                <el-input v-model="dataForm.integralRatio" @change="setShopGetScore">
                    <template slot="append">{{$t('coupon.yuan')}}获取1积分</template>
                </el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <div class="default-btn" @click="(visible = false)">
                {{ $t("coupon.cancel") }}
            </div>
            <div class="default-btn primary-btn" @click="dataFormSubmit()">
                {{ $t("coupon.confirm") }}
            </div>
        </span>
    </el-dialog>
</template>

<script>
import TinyMce from "@/components/tiny-mce";
import imgUpload from "@/components/img-upload";

export default {
    components: { TinyMce, imgUpload },
    data() {
        return {
            visible: false,
            isSubmit: false,
            dataForm: {
                cardTitle: "",
                useInfo: "",
                privilege: "",
                mobile: "",
                discount: null,
                integralRatio: null,
                cardImg: null,
                cardLogo: null,
            },
            dataRule: {
                cardTitle: [{required: true, message: "会员卡名称不能为空", trigger: "blur"},],
                cardImg: [{required: true, message: "会员卡背景不能为空", trigger: "change",},],
                useInfo: [{required: true, message: "使用介绍不能为空", trigger: "blur",},],
                privilege: [{required: true, message: "特权介绍不能为空", trigger: "blur",},],
                mobile: [{required: true, message: "客服电话不能为空", trigger: "blur",},],
                discount: [{required: true, message: "会员折扣不能为空", trigger: "blur",},],
                integralRatio: [{required: true, message: "积分比例不能为空", trigger: "blur",},],
            },
        };
    },
    methods: {
        init(id) {
            this.dataForm.id = id || 0;
            this.isSubmit = false;
            this.visible = true;
            this.$nextTick(() => {
                this.$refs["dataForm"].resetFields();
                if (this.dataForm.id) {
                    this.$http({
                        url: this.$http.adornUrl(
                            `/platform/card/info/${this.dataForm.id}`
                        ),
                        method: "get",
                        params: this.$http.adornParams(),
                    }).then(({ data }) => {
                        this.dataForm = data;
                    });
                }
            });
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs["dataForm"].validate((valid) => {
                if (valid) {
                    if (this.isSubmit) {
                        return false;
                    }
                    this.isSubmit = true;
                    this.$http({
                        url: this.$http.adornUrl(`/platform/card`),
                        method: this.dataForm.cardId ? "put" : "post",
                        data: this.$http.adornData(this.dataForm),
                    })
                        .then(({ data }) => {
                            this.$message({
                                message: this.$i18n.t("publics.operation"),
                                type: "success",
                                duration: 1500,
                                onClose: () => {
                                    this.visible = false;
                                    this.$emit("refreshDataList");
                                },
                            });
                        })
                        .catch((e) => {
                            this.isSubmit = false;
                        });
                }
            });
        },
        imgChange(value, prop, formName) {
            if (value) {
                this.$refs[formName].validateField(prop);
            }
            this.$nextTick(() => {
                this.$forceUpdate();
            });
        },
        setShopGetScore () {
            let num = Math.round(this.dataForm.integralRatio)
            this.dataForm.integralRatio = num < 1 ? 1 : num
            if (num >= 100000000) {
                this.dataForm.integralRatio = 100000000
            }
        },
    },
};
</script>
<style lang="scss">
</style>
