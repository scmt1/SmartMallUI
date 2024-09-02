<template>
    <div class="goods-module-component">
        <goods-module-four :config="config"></goods-module-four>
    </div>
</template>
<script>
import goodsModuleFour from '../../../../commonComponent/goodsModuleFour/index.vue';
export default {
    components: {
        goodsModuleFour
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
        itemComponent: {
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
$currentContentWidth: 1200px ; // 当前页面内容宽度
.goods-module-component {
  width: $currentContentWidth;
  background: #fff;
  margin: 0 auto;
}
</style>