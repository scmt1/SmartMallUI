<template>
    <goodsListComponent :config="config"></goodsListComponent>
</template>
<script>
import goodsListComponent from '../../../../commonComponent/goodsListComponent/index.vue';
export default {
    components: {
        goodsListComponent
    },
    props: {
        itemComponent: { // 组件信息展示
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            config: {
                datalist: []
            }
        }
    },
    watch: {
        itemComponent: { // 监听配置文件传递过来的信息
            handler(newVal, oldVal) {
                if(JSON.stringify(newVal.rightConfigMessage) != '{}') {
                    this.config = {
                      showMany: newVal.rightConfigMessage.listType,
                      showName: newVal.rightConfigMessage.showContent.find(item => Number(item) === 0) ? 0 : 1,
                      showDescription: newVal.rightConfigMessage.showContent.find(item => Number(item) === 1) ? 0 : 1,
                      showPrice: newVal.rightConfigMessage.showContent.find(item => Number(item) === 2) ? 0 : 1,
                      listTypeList: new Array(newVal.rightConfigMessage.listType),
                      dataList: newVal.rightConfigMessage.goodsList
                    }
                } else {
                    this.config = {
                        showMany: 3, // 一行展示多少个商品
                        showName: 0, // 是否展示商品名称
                        showDescription: 0, // 是否展示商品描述
                        showPrice: 0, // 是否展示商品价格
                        listTypeList: new Array(3),
                        dataList: []
                    }
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>