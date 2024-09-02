<template>
    <div class="select-goods-component">
        <template v-for="(item, index) in goodsList">
            <div class="goods-items" :key="index">
                <el-image :src="item.imgs" fit="cover">
                    <img slot="error" src="@/assets/img/def.png" alt="" >
                </el-image>
                <div class="close-x" @click="handleRemove(index)">x</div>
            </div>
        </template>
        <div class="add-btn" v-show="addLength > goodsList.length || addLength === -1" @click="handleClick">+</div>
    </div>
</template>
<script>
export default {
    props: {
        addLength: { // 添加限制个数,当为-1的时候，表示可以无限添加
            type: Number,
            default: () => -1
        },
        goodsList: { // 商品列表
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            
        }
    },
    methods: {
        // 添加商品
        handleClick() {
            if(this.addLength === -1) {
                this.$emit('handleAddClick');
            } else {
                if(this.goodsList.length >= this.addLength) {
                    return this.$message.warning('当前添加的商品个数已达到最大个数');
                }
                this.$emit('handleAddClick', this.goodsList.length)
            }
            
        },
        // 移除某个商品
        handleRemove(index) {
            this.$emit('handleRemove', index)
        }
    }
}
</script>
<style lang="scss" scoped>
.select-goods-component {
    width: 100%;
    height: 100%;
    min-height: 76px;
    border: 1px dashed #EAEAF2;
    display: flex;
    align-items: center;
    padding: 10px;
    padding-bottom: 0px;
    flex-wrap: wrap;
    .goods-items {
        width: 50px;
        height: 50px;
        border-radius: 2px;
        margin: 0 10px 10px 0;
        position: relative;
        border: 1px solid rgba(243, 245, 247, 0.39);
        .el-image {
            width: 100%;
            height: 100%;
        }
        .close-x {
            position: absolute;
            top: -6px;
            right: -6px;
            cursor: pointer;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            color: #fff;
            background: #155bd4;
            display: flex;
            align-items: center;
            font-size: 12px;
            justify-content: center;
        }
    }
    .add-btn {
        width: 50px;
        height: 50px;
        background: rgba(255, 255, 255, 0.39);
        border: 1px solid #DCDFE6;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 10px 10px 0;
        color: #9FA4B1;
        cursor: pointer;
    }
}
</style>
<style lang="scss">
.select-goods-component {
    .el-image__error {
        font-size: 12px;
    }
}
</style>