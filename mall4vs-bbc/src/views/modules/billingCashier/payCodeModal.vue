<template>
    <el-dialog title="条码支付" :close-on-click-modal="false" :visible.sync="visible" @close="handleDialogClose" width="400px">
        <div>
            <p>请输入用户条形码:</p>
            <div style="display:flex;flex-direction:row;margin-bottom:14px;">
                <el-input ref="input" v-model="barCodeValue" placeholder="请输入支付条码" @keyup.enter="handleOk"></el-input>
                <el-button type="primary" style="margin-left:10px;" :loading="loading" @click="handleOk">确认支付</el-button>
            </div>
            <p>或者使用(扫码枪/扫码盒)扫码:</p>
            <div style="text-align:center">
                <img src="@/assets/payTestImg/scan.svg" alt="">
            </div>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'payModal',
    data () {
        return {
            visible: false,
            loading: false,
            barCodeValue: undefined
        }
    },
    methods: {
        init () {
            this.loading = false
            this.visible = true
            this.barCodeValue = "";
            this.$nextTick(() =>{
                this.$refs.input.focus()
            })
        },
        handleDialogClose () {
            this.visible = false
            this.$emit('payModalColseBtn')
        },
        handleOk() {
            if(!this.barCodeValue) {
                return
            }
            this.$emit('confirmEvent', this.barCodeValue)
            this.loading = true
        }
    }
}
</script>

<style lang="scss" scoped>
.describe {
    img {
        width: 30px;
        height: 25px;
    }
}
</style>
