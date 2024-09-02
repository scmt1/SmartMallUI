<template>
    <el-dialog :title="!dataForm.id ? this.$i18n.t('sysManagement.add') : this.$i18n.t('sysManagement.modify')" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
            <el-form-item label="标题" prop="guideTitle">
                <el-input v-model="dataForm.guideTitle" size="small" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="guidePic">
                <img-upload v-model="dataForm.guidePic" @input="imgChange(dataForm.guidePic, 'guidePic', 'dataForm')"/>
<!--                <el-upload-->
<!--                    accept="image/*"-->
<!--                    :headers="{Authorization: $cookie.get('Authorization_vp'),locale:lang}"-->
<!--                    class="avatar-uploader"-->
<!--                    :action="$http.adornUrl('/admin/file/upload/img')"-->
<!--                    :show-file-list="false"-->
<!--                    :on-success="handleAvatarSuccess"-->
<!--                    :before-upload="beforeUpload">-->
<!--                    <img v-if="imageUrl" :src="imageUrl" class="avatar">-->
<!--                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
<!--                </el-upload>-->
            </el-form-item>
            <el-form-item label="跳转连接" prop="guideUrl">
                <el-input v-model="dataForm.guideUrl" size="small" placeholder="请输入跳转链接"></el-input>
            </el-form-item>
            <el-form-item :label="$t('product.status')" size="mini" prop="delFlag">
                <el-radio-group v-model="dataForm.delFlag">
                    <el-radio :label="1">{{ $t('publics.disable') }}</el-radio>
                    <el-radio :label="0">{{ $t('publics.normal') }}</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{ $t('coupon.cancel') }}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{ $t('coupon.confirm') }}</div>
    </span>
    </el-dialog>
</template>

<script>
  import imgUpload from '@/components/img-upload'
export default {
  components: {imgUpload},
    data () {
        return {
            resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
            lang: localStorage.getItem('lang') || 'zh_CN',
            hideUploadEdit: false, // 上传图片按钮显隐
            visible: false,
            isSubmit: false,
            roleList: [],
            dataForm: {
                guideTitle: '',
                guidePic: '',
                guideUrl: '',
                type: 1,
                delFlag: 0
            },
            dataRule: {
                guideTitle: [
                    {required: true, message: '标题名称不能为空', trigger: 'blur'},
                    {min: 2, max: 50, message: '标题名称长度在2-50之间', trigger: 'blur'}
                ],
                guidePic: [
                    {required: true, message: "图片不能为空", trigger: 'change'},
                ]
            },
            options: {
                multiple: false, // 是否支持选取多个图片
                limit: 1, // 最多可选择图片数量
                maxSize: 2, // 最大尺寸（M）
                enableUpload: true, // 是否启用图片上传
                callback: null
            },
            fileIds: [],
            imageUrl: ""
        }
    },
    methods: {
      imgChange (value, prop, formName) {
        if (value) {
          this.$refs[formName].validateField(prop)
        }
        this.$nextTick(() => {
          this.$forceUpdate()
        })
      },
        init (id) {
            this.imageUrl = "";
            this.dataForm.id = id || 0
            this.isSubmit = false
            this.visible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
                if (this.dataForm.id) {
                    this.$http({
                        url: this.$http.adornUrl(`/admin/guide/info/${this.dataForm.id}`),
                        method: 'get',
                        params: this.$http.adornParams()
                    }).then(({data}) => {
                        this.dataForm = data
                        this.imageUrl = data.guidePic
                    })
                }
            });
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
                        url: this.$http.adornUrl(`/admin/guide`),
                        method: this.dataForm.id ? 'put' : 'post',
                        data: this.$http.adornData({
                            'id': this.dataForm.id || undefined,
                            'guideTitle': this.dataForm.guideTitle,
                            'guideUrl': this.dataForm.guideUrl,
                            'guidePic': this.dataForm.guidePic,
                            'type': 1,
                        })
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
        /**
         * 上传图片前检查合法性
         * @param file
         * @returns {boolean}
         */
        async beforeUpload (file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isLt2M;
        },
        /**
         * 上传成功处理
         * @param response
         * @param file
         * @param fileList
         * @returns {boolean}
         */
        handleAvatarSuccess(response, file, fileList) {
            console.log(response)
            this.imageUrl = URL.createObjectURL(file.raw);
            this.$http({
                url: this.$http.adornUrl(`/admin/file/get_file_by_id`),
                method: 'get',
                params: this.$http.adornParams({
                    fileId: response.data
                })
            }).then(({ data }) => {
                this.dataForm.guidePic = this.resourcesUrl + data.filePath
            })
        },
    }
}
</script>
<style lang="scss">
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
