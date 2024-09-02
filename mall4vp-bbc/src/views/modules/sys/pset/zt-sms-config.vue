<template>
    <div class="shortmsg-短信服务平台配置-set gray-box top-redius border-bottom-gray">
        <div class="title">助通云短信服务平台</div>
        <el-form ref="dataForm" label-width="180px" size="mini" class="set-form" label-position="left" @keyup.enter.native="dataFormSubmit()" :rules="dataRule" :model="dataForm">
            <el-form-item label="行业短信账号" style="width:640px" prop="hyAccount">
                <el-input v-model="dataForm.hyAccount" placeholder="请输入行业短信账号" controls-position="right"></el-input>
            </el-form-item>
            <el-form-item label="行业短信密码" style="width:640px" prop="hyPassword">
                <el-input v-model="dataForm.hyPassword" placeholder="请输入行业短信密码" controls-position="right"></el-input>
            </el-form-item>

            <el-form-item label="营销短信账号" style="width:640px" prop="yxAccount">
                <el-input v-model="dataForm.yxAccount" placeholder="请输入营销短信账号" controls-position="right"></el-input>
            </el-form-item>
            <el-form-item label="营销短信密码" style="width:640px" prop="yxPassword">
                <el-input v-model="dataForm.yxPassword" placeholder="请输入营销短信密码" controls-position="right"></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
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
                hyAccount: null,
                hyPassword: null,
                yxAccount: null,
                yxPassword: null,
            },
            searchForm: {},
            dataRule: {
                hyAccount: [
                    {required: true, message: "助通云短信账号不能为空", trigger: 'blur'}
                ],
                hyPassword: [
                    {required: true, message: "助通云短信密码不能为空", trigger: 'blur'}
                ],
                yxAccount: [
                    {required: true, message: "助通云短信账号不能为空", trigger: 'blur'}
                ],
                yxPassword: [
                    {required: true, message: "助通云短信密码不能为空", trigger: 'blur'}
                ],
            }
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            this.$nextTick(() => {
                this.$http({
                    url: this.$http.adornUrl('/sys/pconfig/info/' + 'ZHU_TONG'),
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
                            'paramKey': 'ZHU_TONG',
                            'paramValue': JSON.stringify(this.dataForm),
                            'remark': '助通云短信平台'
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
