<template>
    <div 
        class="interval-component" 
        :style="{'height': config.height, 'background': config.bgColor}">
    </div>
</template>
<script>
export default {
    props: {
        itemComponent: { // 组件信息
            type: Object,
            default: () => {}
        },
    },
    data() {
        return {
            config: {}
        }
    },
    watch: {
        itemComponent: { // 监听组件配置信息
            handler(newVal, oldVal) {
                if(JSON.stringify(newVal.rightConfigMessage) != '{}') {
                    this.config = {
                        height: newVal.rightConfigMessage.height + 'px',
                        bgColor: newVal.rightConfigMessage.bgColor
                    }
                } else {
                    this.config = {
                        height: '20px',
                        bgColor: 'rgba(244, 244, 244, 1)'
                    }
                }
            },
            deep: true,
            immediate: true
        }
    }
}
</script>
<style lang="scss" scoped>
.interval-component {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9FA4B1;
}
</style>