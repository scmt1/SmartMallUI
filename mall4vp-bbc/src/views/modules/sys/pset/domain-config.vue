<template>
    <div class="domain-set gray-box top-redius border-bottom-gray">
        <div class="title">{{ $t('sysManagement.domainConfiguration') }}</div>
        <el-form
            ref="dataForm"
            label-width="180px"
            size="mini"
            class="set-form"
            label-position="left"
            @keyup.enter.native="dataFormSubmit()"
            :rules="dataRule"
            :model="dataForm"
        >
            <el-form-item :label="$t('sysManagement.fileResourceServerDomain')" style="width:640px" prop="resourcesDomainName">
                <el-input
                    v-model="dataForm.resourcesDomainName"
                    :placeholder="$t('sysManagement.canAccessPic')"
                    controls-position="right"
                ></el-input>
            </el-form-item>
            <el-form-item :label="$t('sysManagement.apiDomain')" style="width:640px" prop="apiDomainName">
                <el-input
                    v-model="dataForm.apiDomainName"
                    :placeholder="$t('sysManagement.apiDomainPH')"
                    controls-position="right"
                ></el-input>
            </el-form-item>
            <el-form-item :label="$t('sysManagement.shopSideDomain')" style="width:640px" prop="multishopDomainName">
                <el-input
                    v-model="dataForm.multishopDomainName"
                    :placeholder="$t('sysManagement.shopSideDomainPH')"
                    controls-position="right"
                ></el-input>
            </el-form-item>
            <el-form-item :label="$t('sysManagement.platformSideDomain')" style="width:640px" prop="platformDomainName">
                <el-input
                    v-model="dataForm.platformDomainName"
                    :placeholder="$t('sysManagement.platformSideDomainPH')"
                    controls-position="right"
                ></el-input>
            </el-form-item>
            <el-form-item label="支付地址" style="width:640px" prop="payApiUrl">
                <el-input
                    v-model="dataForm.payApiUrl"
                    placeholder="支付地址和支付查询地址"
                    controls-position="right"
                ></el-input>
            </el-form-item>
<!--            <el-form-item label="支付回调地址" style="width:640px" prop="payCallbackApiUrl">-->
<!--                <el-input-->
<!--                        v-model="dataForm.payCallbackApiUrl"-->
<!--                        placeholder="支付回调地址"-->
<!--                        controls-position="right"-->
<!--                ></el-input>-->
<!--            </el-form-item>-->
        </el-form>

        <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="visible = false">取消</el-button> -->
      <div class="default-btn" @click="dataFormSubmit()">{{ $t('sysManagement.save') }}</div>
    </span>
    </div>
</template>

<script>
export default {
    data () {
        return {
            visible: false,
            dataForm: {
                accessKeyId: null,
                accessKeySecret: null,
                signName: null,
                payApiUrl: null,
                payCallbackApiUrl: null
            },
            searchForm: {},
            dataRule: {
                apiDomainName: [
                    {required: true, message: this.$i18n.t('sysManagement.apiDomainNullTips'), trigger: 'blur'}
                ],
                multishopDomainName: [
                    {required: true, message: this.$i18n.t('sysManagement.shopSideDomainNullTips'), trigger: 'blur'}
                ],
                platformDomainName: [
                    {required: true, message: this.$i18n.t('sysManagement.platformSideDomainNullTips'), trigger: 'blur'}
                ],
                resourcesDomainName: [
                    {required: true, message: this.$i18n.t('sysManagement.fileResourceServerDomainNullTips'), trigger: 'blur'}
                ],
                payApiUrl: [
                    { required: true, message: '支付地址不能为空', trigger: 'blur' }
                ],
                payCallbackApiUrl: [
                    { required: true, message: '支付回调地址不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            // this.$refs['dataForm'].resetFields()
            this.$nextTick(() => {
                this.$http({
                    url: this.$http.adornUrl('/sys/pconfig/info/' + 'DOMAIN_CONFIG'),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({data}) => {
                    if (data) {
                        this.dataForm = JSON.parse(data)
                    }
                })
                this.$refs['dataForm'].resetFields()
            })
        },
        // 表单提交
        dataFormSubmit () {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl('/sys/pconfig/save'),
                        method: 'post',
                        data: this.$http.adornData({
                            'paramKey': 'DOMAIN_CONFIG',
                            'paramValue': JSON.stringify(this.dataForm),
                            'remark': this.$t('sysManagement.domainConfig')
                        })
                    }).then(({data}) => {
                        if (data) {
                            this.init()
                        }
                        this.$message({
                            message: this.$i18n.t('publics.operation'),
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.visible = false
                                this.$emit('refreshDataList')
                            }
                        })
                    })
                }
            })
        }
    }
}
</script>
