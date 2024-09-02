<template>
    <el-dialog :visible.sync="show" title="数据导入" :mask-closable="false" :draggable="false"
           width="600px">
        <el-upload
                class="upload-demo"
                drag
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.ms-excel.sheet.macroEnabled.12"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :headers="upHeaders"
                :before-upload="handleUpload"
                :data="data"
                :action="api"
                ref="upload"
                >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text"><em>点击上传</em></div>
        </el-upload>
        <div style="color: red;font-weight: bold;margin-top: 10px;">
            <p>提示：</p>
            <p>1.请按模板填写数据，模板格式禁止调整</p>
            <p>2.上传文件类型只能为"xls", "xlsx", "xlsm"</p>
        </div>

        <div slot="footer">
            <el-button type="primary" @click="handleCreateA">模板下载</el-button>
            <el-button type="default" @click="show=false">关闭</el-button>
        </div>
    </el-dialog>
</template>
<script>
import Vue from 'vue'

export default {
    name: "ExcelUpload",
    props: {
        value: {
            type: Boolean,
            default: false
        },
        modalTitle: {
            type: String
        },
        uploadUrl: {
            type: String
        },
        downTempUrl: {
            type: String
        }
    },
    data() {
        return {
            contentStr: [],
            fileTypeArr: ["xls", "xlsx", "xlsm"],//文件类型
            show: this.value,//是否显示
            editTitle: this.modalTitle,//标题
            loading: true,
            api: this.getApi(),
            upHeaders: {
                "User-Type": 'Gov_User',
                "Authorization": Vue.cookie.get('Authorization_vp')
            },
            data: {},
        }
    },
    methods: {
        getApi() {
            return this.uploadUrl;
        },
        //创建a标签
        handleCreateA() {
            let oA = document.createElement("a");
            oA.href = this.downTempUrl;
            oA.click();
            window.URL.revokeObjectURL(oA.href);
        },
        closeModal(val) {
            this.$emit('input', val);
        },
        handleUpload(file) {
            return true;
        },
        uploadSuccess(response, file, fileList) {
            if (response.success) {
                this.$message.success(response.data);
                this.closeAllModal();
            } else {
                this.$message.error(response.msg);
            }
        },
        uploadError(err, file, fileList) {
            this.$message.error("上传失败" + err);
        },
        closeAllModal() {//关闭
            this.closeModal(false);
            this.$emit('handSearch');//上传完毕后再重新渲染表格
        },
    },
    watch: {
        value(val) {
            this.show = val;
        },
        show(val) {
            this.loading = false;
            this.editTitle = this.modalTitle;
            this.api = this.getApi();
            if (!val) {
                this.closeModal(val);
                this.$refs.upload.clearFiles();//清空已上传的文件列表
            }
        }
    }
}
</script>
<style>
    .el-upload-dragger{
        width: 560px;
    }
</style>
