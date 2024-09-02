<template>
    <!-- 这种楼层标题的公共组件 -->
    <div class="floor-title-container" :style="{'background': configMessage.background}">
        <div class="floor_titles_content" :style="setMarginStyle()">
            <div class="common_floor_titles">
                <div class="left-content">
                    <div class="main-title" :style="setMainStyle()">{{configMessage.mainContent.title}}</div>
                    <div 
                        class="other-title" 
                        v-show="configMessage.showSubTitle === 0" 
                        :style="setSubStyle()">{{configMessage.subContent.title}}</div>
                </div>
                <div class="right-content">
                    <div class="see-more" v-show="configMessage.showMore === 0">
                        <span :style="{color: configMessage.moreTextColor}">{{$t(`pcdecorate.floorTitle.more`)}}</span>
                        <i :style="{color: configMessage.moreTextColor}" class="el-icon-arrow-right"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        config: {  // 配置信息
            type: Object,
            default: () =>  {}
        }
    },
    data() {
        return {
            configMessage: {
                mainContent: { // 主标题配置内容
                    title: this.$i18n.t('pcdecorate.floorTitle.mainTitle'),
                    fontSize: '16px',
                    color: 'rgba(51, 51, 51, 1)',
                },
                background: 'rgba(244, 244, 244, 1)', // 背景颜色
                marginTop: 18, // 上边距
                marginBottom: 18, // 下边距
                showMore: 0, // 查看更多是否展示
                path: {
                    link: '',
                    name: '',
                    type: ''
                }, // 查看更多的链接
                moreTextColor: 'rgba(153, 153, 153, 1)', // 查看更多的文字颜色
                showSubTitle: 0, // 是否展示副标题
                subContent: { // 副标题配置内容
                    title: this.$i18n.t('pcdecorate.floorTitle.subTitle'),
                    fontSize: '12px',
                    color: 'rgba(153, 153, 153, 1)',
                },
            }
        }
    },
    methods: {
        // 主标题的样式
        setMainStyle() {
            let { fontSize, color } = this.configMessage.mainContent;
            return {
                'font-size': fontSize,
                'color': color
            }
        },
        // 副标题的样式
        setSubStyle() {
            let { fontSize, color } = this.configMessage.subContent;
            return {
                'font-size': fontSize,
                'color': color
            }
        },
        // 上下边距的样式
        setMarginStyle() {
            let { marginTop, marginBottom } = this.configMessage;
            return {
                'margin-top': marginTop,
                'margin-bottom': marginBottom,
            }
        }
    },
    watch: {
        config: { // 监听配置信息的改变
            handler(newVal, oldVal) {
                if(JSON.stringify(newVal) != '{}') {
                    this.configMessage = newVal;
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>
<style lang="scss" scoped>
$currentContentWidth:1200px; // 当前版心宽度
.floor-title-container {
    width: 100%;
    overflow: hidden;
}
.floor_titles_content {
    width: 100%;
}
.common_floor_titles {
    width: $currentContentWidth;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;
    .left-content {
        display: flex;
        width: 80%;
        white-space: nowrap;
        overflow: hidden;
        .main-title {
            font-family: Microsoft YaHei;
        }
        .other-title {
            margin-left: 12px;
            font-family: Microsoft YaHei;
            display: flex;
            align-items: flex-end;
            line-height: 1;
            padding-bottom: 3px;
        }
    }
    .right-content {
      .see-more {
        display: flex;
        align-items: center;
        span {
          font-size: 12px;
          color: #999;
          font-family: Microsoft YaHei;
        }
        .el-icon-arrow-right {
          color: #999;
          font-size: 12px;
        }
      }
    }
}
</style>