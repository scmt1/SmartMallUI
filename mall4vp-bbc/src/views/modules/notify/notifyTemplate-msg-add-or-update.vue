<template>
    <el-dialog
        :title="!dataForm.templateId ? $t('brand.add') : $t('sysManagement.modify')"
        :close-on-click-modal="false"
        :visible.sync="visible"
    >
        <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            @keyup.enter.native="dataFormSubmit()"
            size="small"
            :label-width="this.$i18n.t('language') === 'language' ? '220px' : '130px'"
        >
            <!-- <el-alert :title="$t('platform.smsTip1')" type="warning" show-icon></el-alert> -->
            <el-form-item label="主题" prop="title">
                <el-input v-model="dataForm.title"></el-input>
            </el-form-item>
            <el-form-item :label="$t('platform.msgType') + '：'" prop="sendType">
                <span>{{ $t('platform.customisedMsg') }}</span>
            </el-form-item>
            <el-form-item :label="$t('platform.notifyConten') + '：'" prop="message">
                <el-input v-model="dataForm.message" maxlength="255" type="textarea" :rows="5" show-word-limit></el-input>
                <span style="color:red;">注：短信计费规则为64字符一条，超过64字符按照67字符一条</span>
            </el-form-item>
            <el-form-item
                :label="$t('platform.selectTag') + '：'"
                prop="selTagIds"
            >
                <el-select
                    v-model="dataForm.selTagIds"
                    size="small"
                    multiple
                    filterable
                    :placeholder="$t('user.pleaseSelect')"
                >
                    <el-option
                        v-for="item in tagList"
                        :key="item.value"
                        :label="item.tagName"
                        :value="item.userTagId"
                    ></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发送方式：" prop="templateSendType">
                <el-radio-group v-model="dataForm.templateSendType">
                    <el-radio :label="1">手动发送</el-radio>
                    <el-radio :label="2">定时发送</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="发送时间：" prop="sendTime" v-if="dataForm.templateSendType == 2">
                <el-date-picker v-model="dataForm.sendTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择定时发送的时间">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{
              $t('remindPop.cancel')
          }}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{
              $t('remindPop.confirm')
          }}</div>
    </span>
    </el-dialog>
</template>

<script>
export default {
    data () {
        return {
            visible: false,
            isCheck: false,
            isConfirm: false,
            dataForm: {
                title: null,
                sendTime: null,
                templateSendType: 1,
                templateId: null,
                sendType: null,
                templateTypeList: [],
                message: null,
                templateCode: null,
                mpCode: null,
                createTime: null,
                selTagIds: []
            },
            selTagIds: [],
            tagList: [],
            dataRule: {
                title: [
                    {required: true, message: '短信主题不能为空', trigger: 'blur'}
                ],
                message: [
                    {required: true, message: this.$i18n.t('platform.notifyContenNoNull'), trigger: 'blur'}
                ],
                selTagIds: [
                    {required: true, message: this.$i18n.t('platform.selTagError'), trigger: 'blur'}
                ],
                templateSendType: [
                  { required: true, message: '发送方式不能为空', trigger: 'blur' }
                ]
            },
            value: [],
            options: [{
                value: 1,
                label: this.$i18n.t('platform.orderPay')
            }, {
                value: 2,
                label: this.$i18n.t('platform.paySuccNotify')
            }, {
                value: 3,
                label: this.$i18n.t('platform.merAgreeRefund')
            }, {
                value: 4,
                label: this.$i18n.t('order.refusedRefund')
            }, {
                value: 5,
                label: this.$i18n.t('platform.wriOffRem')
            }, {
                value: 6,
                label: this.$i18n.t('platform.shipRem')
            }, {
                value: 7,
                label: this.$i18n.t('platform.groupFailRem')
            }, {
                value: 8,
                label: this.$i18n.t('platform.groupSuccRem')
            }, {
                value: 9,
                label: this.$i18n.t('platform.startGroupRem')
            }, {
                value: 10,
                label: this.$i18n.t('platform.memUpRem')
            }, {
                value: 11,
                label: this.$i18n.t('platform.timeoutRem')
            }, {
                value: 102,
                label: this.$i18n.t('platform.confirmReceRem')
            }, {
                value: 103,
                label: this.$i18n.t('platform.buyerRefundRem')
            }, {
                value: 104,
                label: this.$i18n.t('platform.buyerReturnRem')
            }]
        }
    },
    methods: {
        init (templateId) {
            this.isConfirm = false
            this.isCheck = false
            this.dataForm.templateTypeList = []
            this.dataForm.selTagIds = []
            this.dataForm.templateId = templateId || 0
            this.visible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
                if (this.dataForm.templateId) {
                    this.$http({
                        url: this.$http.adornUrl('/platform/sendTagNotify/info/' + this.dataForm.templateId),
                        method: 'get',
                        params: this.$http.adornParams()
                    }).then(({data}) => {
                        this.dataForm = data
                        this.getTagList()
                    })
                } else {
                    this.getTagList()
                }
            })
        },
        getTagList () {
            this.$http({
                url: this.$http.adornUrl('/user/userTag/getTagList'),
                method: 'get',
                params: this.$http.adornParams()
            }).then(({data}) => {
                this.tagList = data
                if (this.dataForm.templateId && this.dataForm && this.dataForm.tagParams) {
                    let tagIds = []
                    this.dataForm.tagParams.forEach(item => {
                        let index = this.tagList.find(e => {
                            return e.userTagId === item.tagId
                        })
                        if (index) {
                            tagIds.push(item.tagId)
                        }
                    })
                    this.dataForm.selTagIds = tagIds
                }
            })
        },
        msg (text) {
            this.$message({
                message: text,
                type: 'error',
                duration: 1500
            })
            this.isCheck = true
        },
        // 表单提交
        dataFormSubmit () {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.isCheck = false
                    if (this.isCheck || this.isConfirm) {
                        return
                    }
                    let checkData = this.dataForm.selTagIds === null || this.dataForm.selTagIds === undefined || this.dataForm.selTagIds.length <= 0
                    if (checkData) {
                        this.msg(this.$i18n.t('platform.selTagError'))
                        return
                    }
                    this.isConfirm = true

                    this.dataForm.sendType = 99;
                    this.dataForm.templateTypes = 1;

                    this.$http({
                        url: this.$http.adornUrl('/platform/sendTagNotify'),
                        method: this.dataForm.templateId ? 'put' : 'post',
                        data: this.$http.adornData(this.dataForm)
                    }).then(({data}) => {
                        this.$message({
                            message: this.$i18n.t('remindPop.success'),
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.visible = false
                                this.$emit('refreshDataList')
                            }
                        })
                    }).catch(() => {
                        this.isConfirm = false
                    })
                }
            })
        }
    }
}
</script>
