<template>
    <div class="pick-color-component">
        <el-color-picker 
            v-model="pickForm.color"
            color-format="rgba"
            :show-alpha="true"
            @change="handleChangeColor">
        </el-color-picker>
        <span @click="handleReset">{{$t(`pcdecorate.axinterval.reset`)}}</span>
        <span>{{this.pickForm.color}}</span>
    </div>
</template>
<script>
export default {
    props: {
        defineColor: { // 选择的颜色
            type: String,
            default: () => ''
        },
        resetColor: { // 重置的颜色
            type: String,
            default: () => ''
        }
    },
    data() {
        return {
            pickForm: {
                color: 'rgba(51, 51, 51, 1)'
            }
        }
    },
    methods: {
        // 当颜色改变
        handleChangeColor() {
            this.$emit('handleChangeColor', this.pickForm.color)
        },
        handleReset() {
            if(this.resetColor === '') {
                this.pickForm.color = 'rgba(51, 51, 51, 1)';
            } else {
                this.pickForm.color = this.resetColor;
            }
            this.handleChangeColor();
        }
    },
    watch: {
        defineColor: {
            handler(newVal, oldVal) {
                if(newVal) {
                    this.pickForm.color = newVal;
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>
<style lang="scss" scoped>
.pick-color-component {
    display: flex;
    align-items: center;
    span {
        font-size: 14px;
        font-family: Microsoft YaHei;
        color: #333333;
        &:nth-child(2) {
            color: #155BD4;
            cursor: pointer;
            width: 15%;
            text-align: center;
            display: block;
            margin: 0 5px;
            white-space: nowrap;
        }
        &:nth-child(3) {
            width: calc(100% - 15% - 160px);
            justify-content: center;
            white-space: nowrap;
            font-size: 13px;
            display: flex;
            align-items: center;
        }
    }
}
</style>
<style lang="scss">
.pick-color-component  {
    .el-color-picker {
        .el-color-picker__trigger {
            width: 160px!important;
        }
    }
}
</style>