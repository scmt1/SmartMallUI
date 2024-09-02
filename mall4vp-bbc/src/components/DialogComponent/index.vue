<template>
    <div class="dialog-container">
        <el-dialog
            :title="headerTitle"
            :visible.sync="dialogVisible"
            :width="dialogWidth"
            :close-on-click-modal="closeOnClickModal"
            :append-to-body="appendToBody"
            :before-close="handleClose"
            class="dialog-container"
            >
            <div slot="title">
                <slot name="title"></slot>
            </div>
            <div class="contents-body">
                <slot name="contents"></slot>
            </div>
            <div class="dialog-footers">
                <slot name="footers"></slot>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props: {
        headerTitle: { // 头部标题
            type: String,
            default: () => ''
        },
        dialogVisible: { // 弹窗是否显示
            type: Boolean,
            default: () => false
        },
        dialogWidth: { // 弹窗的宽度
            type: String,
            default: () => '50%'
        },
        closeOnClickModal: { // 是否点击遮罩层关闭
            type: Boolean,
            default: () => false
        },
        appendToBody: {
            type: Boolean,
            default: () => true
        }
    },
    data() {
        return {
            activeName: 'second'
        }
    },
    methods: {
        // 关闭弹窗
        handleClose() {
            this.$emit('handleClose')
        },
        handleClick() {}
    }
}
</script>
<style lang="scss">
.el-dialog__wrapper {
    width: 100%;
    height: 100%;
    &.dialog-container {
        .el-dialog {
            top: 50%!important;
            margin-top: 0!important;
            transform: translate(0, -50%)!important;
            .el-dialog__header {
                padding: 0;
            }
            .el-dialog__body {
                padding: 0;
            }
            .el-dialog__headerbtn {
                top: 18px;
                right: 21px;
            }
            .dialog-footers {
                display: flex;
                width: 100%;
                height: 56px;
                justify-content: center;
                align-items: center;
                .el-button {
                    padding: 9px 20px;
                }
            }
        }
    }
}
</style>