<template>
    <div 
        :class="{'redirect-nav-container': true, 'active': selectedLink != ''}" 
        :style="{height: navHeight}">
        <div class="left">
            <div 
                class="name" 
                v-if="selectedLink != ''"
                :style="{'line-height': navHeight}">{{selectedLink}}</div>
            <div 
                class="none-data"
                v-else
                @click="handleNavSelect"
                :style="{'line-height': navHeight}">{{placeholder}}</div>
        </div>
        <div class="right" >
            <img
                v-show="selectedLink === ''"
                class="link-imgs" 
                :style="{width: imgObj.width, height: imgObj.height}" 
                src="@/assets/img/pc-micro-page/selected_link.png" 
                alt=""
                @click="handleNavSelect">
            <i v-show="selectedLink != ''" class="el-icon-close" @click="handleRemoveSelected"></i>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        navHeight: {
            type: String,
            default: () => '28px'
        },
        imgObj: {
            type: Object,
            default: () => {
                return {
                    width: '18.39px',
                    height: '18.39px'
                }
            }
        },
        selectedLink: {
            type: String,
            default: () => ''
        },
        placeholder: {
            type: String,
            default: () => ''
        }
    },
    data() {
        return {}
    },
    methods: {
        // 选择链接
        handleNavSelect() {
            this.$emit('handleNavSelect')
        },
        // 删除链接
        handleRemoveSelected() {
            this.$emit('handleRemoveSelected')
        }
    }
}
</script>
<style lang="scss" scoped>
.redirect-nav-container {
    width: 100%;
    background: rgba(255, 255, 255, 0.39);
    border: 1px solid #DCDFE6;
    border-radius: 3px;
    position: relative;
    &.active {
        border-color: #155BD4;
        background: rgba(21, 91, 212, 0.04);
    }
    .name {
        padding: 0px 0 0 4px;
        font-size: 12px;
        width: 80%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .none-data {
        color: #9FA4B1;
        font-size: 12px;
        padding: 0px 0 0 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
    }
    .link-imgs {
        position: absolute;
        top: 4px;
        right: 0;
        cursor: pointer;
    }
    .el-icon-close {
        position: absolute;
        right: 3px;
        top: 7px;
        font-size: 13px;
        cursor: pointer;
        color: #9FA4B1;
    }
}
</style>