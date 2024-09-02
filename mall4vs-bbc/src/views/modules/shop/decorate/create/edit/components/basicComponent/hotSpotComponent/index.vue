<template>
    <div class="hot-spot-container">
        <div 
            :class="{'hot-spot-content': true, 'two': config.width == '100%' ? false : true }" 
            :style="{width: config.width ? config.width : '100%'}">
            <template v-if="config.imgList && config.imgList.length > 0">
                <template v-for="(item, index) in config.imgList">
                    <el-image 
                        class="hotimg-items" 
                        :key="index" 
                        :src="item.url" 
                        fit="fill">
                        <div slot="error" class="image-slot" >
                            <img src="@/assets/img/pc-micro-page/show-default.png">
                        </div>
                    </el-image>
                </template>
            </template>
            <template v-else>
                <div class="hot-spot-default">
                    <el-image src="" fit="fill">
                        <div slot="error" class="image-slot" >
                            <img src="@/assets/img/pc-micro-page/show-default.png">
                        </div>
                    </el-image>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        itemComponent: { // 组件信息
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
        itemComponent: { // 监听组件配置信息
            handler(newVal, oldVal) {
                if(JSON.stringify(newVal.rightConfigMessage) != '{}') {
                    let contentWidth = '100%';
                    if(newVal.rightConfigMessage.size === 1200) {
                        contentWidth = '1200px';
                    } else {
                        contentWidth = '100%';
                    }
                    this.config = {
                        width: contentWidth,
                        imgList: newVal.rightConfigMessage.imgList
                    }
                } else {
                    let contentWidth = '100%';
                    if(newVal.rightConfigMessage.size === 1200) {
                        contentWidth = '1200px';
                    } else {
                        contentWidth = '100%';
                    }
                    this.config = {
                        width: contentWidth,
                        imgList: []
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
.hot-spot-container {
    margin: 0 auto;
    width: 100%;
    .hot-spot-content {
        margin: 0 auto;
    }
    .el-image {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .hot-spot-default {
        width: 100%;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

</style>
<style lang="scss">
.hot-spot-container {
  .image-slot {
    font-size: 60px;
    color: rgba(220, 223, 230, 0.39);
  }
}
</style>