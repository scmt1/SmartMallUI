<template>
    <el-dialog class="roomsEdit" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false"
               :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
            <el-form-item label="桌位名称" prop="roomsName">
                <el-input v-model="dataForm.roomsName" size="small" placeholder="请输入桌位名称"></el-input>
            </el-form-item>
            <el-form-item label="可坐人数" prop="personCount">
                <el-input type="number" v-model="dataForm.personCount" size="small" placeholder="请输入可坐人数"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="dataForm.remark" :autosize="{ minRows: 2, maxRows: 4}" size="small" placeholder="请输入remark"></el-input>
            </el-form-item>
            <el-form-item label="餐桌二维码" v-if="dataForm.qrCode">
                <img :src="dataForm.qrCode">
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button v-if="dataForm.roomsId" type="danger" size="small" @click="deleteItem" style="margin-right: 15px;">删除</el-button>
            <div class="default-btn" @click="visible = false">取消</div>
            <div class="default-btn primary-btn" @click="dataFormSubmit()">确定</div>
        </span>
    </el-dialog>
</template>

<script>

export default {
    components: {},
    data () {
        return {
            visible: false,
            isSubmit: false,
            dataForm: {
                roomsName: '',
                personCount: '',
                remark: ''
            },
            dataRule: {
                roomsName: [
                    {required: true, message: '桌位名称不能为空', trigger: 'blur'}
                ],
                personCount: [
                    {required: true, message: '桌位可坐人数不能为空', trigger: 'blur'}
                ],
            },
        }
    },
    methods: {
        init (id) {
            this.dataForm = {
                roomsName: '',
                personCount: '',
                remark: '',
                qrCode: ''
            }
            this.dataForm.roomsId = id || 0
            this.isSubmit = false
            this.visible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
                if (this.dataForm.roomsId) {
                    this.$http({
                        url: this.$http.adornUrl(`/multishop/rooms/info/${this.dataForm.roomsId}`),
                        method: 'get',
                        params: this.$http.adornParams()
                    }).then(({data}) => {
                        this.dataForm = data
                    })
                }
            })
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
                        url: this.$http.adornUrl(`/multishop/rooms`),
                        method: this.dataForm.roomsId ? 'put' : 'post',
                        data: this.$http.adornData(this.dataForm)
                    }).then(({data}) => {
                        this.$message({
                            message: this.$i18n.t('publics.operation'),
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.visible = false
                                this.$emit('refreshDataList')
                            }
                        })
                    }).catch((e) => {
                        this.isSubmit = false
                    })
                }
            })
        },
        deleteItem() {
            this.$confirm("确定进行[删除]操作吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: 'warning'
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/multishop/rooms'),
                    method: 'delete',
                    data: this.$http.adornData([this.dataForm.roomsId], false)
                }).then(({data}) => {
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
            }).catch(() => {
            })
        }
    }
}
</script>
<style lang="scss">
.roomsEdit {

}
</style>
