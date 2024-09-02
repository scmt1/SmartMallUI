<template>
    <div class="goods-module-component">
        <goods-module-five :config="config"></goods-module-five>
    </div>
</template>
<script>
import goodsModuleFive from '../../../../commonComponent/goodsModuleFive/index.vue';
export default {
    components: {
        goodsModuleFive
    },
    props: {
        itemComponent: { // 组件的信息
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            config: {}
        }
    },
    watch: {
        itemComponent: { // 监听组件的信息
            handler(newVal, oldVal) {
                if(JSON.stringify(newVal.rightConfigMessage) != '{}') {
                    this.config = {
                        bgImg: newVal.rightConfigMessage.bgImg,
                        goodsList: newVal.rightConfigMessage.goodsList
                    }
                } else {
                    this.config = {
                        bgImg: '',
                        goodsList: []
                    }
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>
<style lang="scss" scoped>
$currentContentWidth: 1200px; // 当前页面内容宽度
.goods-module-component {
  width: $currentContentWidth;
  margin: 0 auto;
}
</style>