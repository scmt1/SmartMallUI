<template>
    <el-dialog title="等待支付" :close-on-click-modal="false" :visible.sync="visible" @close="handleDialogClose" width="400px">
        <div style="width:100%;margin-bottom:20px;text-align:center">
            <img :src="payData" alt="">
        </div>
        <p class="describe">
            <img src="@/assets/payTestImg/wx_app.svg" alt=""><!-- 微信图标 -->
            <img src="@/assets/payTestImg/ali_app.svg" alt=""><!-- 支付宝图标 -->
            <span>支持微信、支付宝扫码</span>
        </p>
    </el-dialog>
</template>

<script>
export default {
    name: 'payModal',
    data () {
        return {
            visible: false,
            payData: undefined
        }
    },
    methods: {
        init (data) {
            this.visible = true
            this.payData = data
        },
        handleDialogClose () {
            this.visible = false
            this.payData = undefined
            this.$emit('payModalColseBtn')
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
