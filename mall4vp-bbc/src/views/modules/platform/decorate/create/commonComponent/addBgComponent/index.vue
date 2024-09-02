<template>
    <div class="add-bg-components">
        <template v-if="imgUrl != ''">
            <div class="bg-img">
                <el-image :src="imgUrl" fit="cover"></el-image>
                <i class="el-icon-delete" @click="handleRemmoveImage"></i>
            </div>
        </template>
        <div class="btns" v-show="imgUrl === ''" @click="handleAddImage">
            <span>+</span>
            <span>{{$t(`pcdecorate.goodsModule5.addImage`)}}</span>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        imgUrl: {
            type: String,
            default: () => ''
        }
    },
    data() {
        return {}
    },
    methods: {
        // 添加图片
        handleAddImage() {
            this.$emit('handleAddImage')
        },
        // 移除图片
        handleRemmoveImage() {
            this.$emit('handleRemmoveImage')
        }
    }
}
</script>
<style lang="scss" scoped>
.add-bg-components {
    .bg-img {
        width: 100%;
        height: 100px;
        overflow: hidden;
        position: relative;
        .el-image {
            width: 100%;
            height: 100%;
        }
        .el-icon-delete {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background:  radial-gradient(ellipse farthest-corner at 50% 50%, rgba(0, 0, 0, 0.4) 50%, #10100e);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            color: #fff;
            opacity: 0;
        }
        &:hover {
            .el-icon-delete {
                opacity: 1;
            }
        }
    }
    .btns {
        width: 100%;
        height: 42px;
        background: rgba(243, 245, 247, 1);
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        cursor: pointer;
        span {
            font-size: 14px;
            font-family: Microsoft YaHei;
            color: #155BD4;
            &:nth-child(1) {
                font-size: 25px;
                margin-right: 5px;
            }
            &:nth-child(2) {
                padding-top: 2px;
            }
        }
    }
}
</style>