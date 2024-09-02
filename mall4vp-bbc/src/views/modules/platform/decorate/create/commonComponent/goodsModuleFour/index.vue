<template>
    <div class="goods-module4">
        <div class="goods-module-top">
            <el-image :src="config.bgImg" fit="fill">
                <div slot="error" class="image-slot">
                    <img style="width: 24px" src="@/assets/img/pc-micro-page/show-default.png">
                </div>
            </el-image>
        </div>
        <div class="bottom-content">
            <template v-if="config.goodsList && config.goodsList.length > 0">
                <template v-for="(item, index) in config.goodsList">
                    <div class="bottom-items" :key="index">
                        <div class="bottom-items-imgs">
                            <el-image :src="item.imgs" fit="fill">
                                <div slot="error" class="image-slot">
                                    <img style="width: 24px" src="@/assets/img/pc-micro-page/show-default.png">
                                </div>
                            </el-image>
                            <!-- 下架商品蒙版 start  -->
                            <div class="imgs_shelves" v-if="item.status != 1">
                                <img class="been_imgs" src="@/assets/img/pc-micro-page/been_shelves.png" >
                            </div>
                            <!-- 下架商品蒙版 end -->
                        </div>
                        <div class="text-content">
                            <div class="name">{{item.name}}{{item.description}}</div>
                            <div class="price">
                                <span>￥</span>
                                <span>{{getPrice(item.price, 'left')}}.</span>
                                <span>{{getPrice(item.price, 'right')}}</span>
                            </div>
                        </div>
                    </div>
                </template>
            </template>
            <template v-else>
                <template v-for="(item, index) in defaultArr">
                    <div class="bottom-items" :key="index">
                        <el-image src="" fit="fill">
                            <div slot="error" class="image-slot">
                                <img style="width: 24px" src="@/assets/img/pc-micro-page/show-default.png">
                            </div>
                        </el-image>
                        <div class="text-content">
                            <div class="name">{{$t(`pcdecorate.goodsList.goodsName`)}}{{$t(`pcdecorate.goodsList.goodsDescription`)}}</div>
                            <div class="price">
                                <span>￥</span>
                                <span>{{$t(`pcdecorate.goodsList.price`)}}</span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </template>
            </template>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        config: { // 配置信息
            type: Object,
            default: () => {}
        }
    },
    computed: {
        // 得到价格显示
        getPrice() {
            return (price, type) => {
                if(!price) return
                let point = price.toString().indexOf('.'); // 如果为-1则表示没找到
                let leftPrice = '';
                let rightPrice = '';
                if(point === -1) { // 当前是整数
                    leftPrice = price;
                    rightPrice = '00';
                } else {
                    leftPrice = price.toString().slice(0, point);
                    rightPrice = price.toString().slice(point + 1);
                }
                switch (type) {
                    case 'left':
                        return leftPrice;
                    case 'right':
                        return rightPrice
                    default:
                        break;
                }
            }
        },
    },
    data() {
        return {
            defaultArr: new Array(4),
        }
    }
}
</script>
<style lang="scss" scoped>
$currentContentWidth: 1200px; // 当前页面内容宽度
.goods-module4 {
    width: 100%;
    overflow: hidden;
    .goods-module-top {
        width: 100%;
        height: 300px;
        .el-image {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            background: rgba(243, 245, 247, 0.39);
            color: #dbdfe6;
        }
    }
    .bottom-content {
        width: 100%;
        padding: 12px 12px 0 12px;
        display: flex;
        overflow: hidden;
        background: #fff;
        .bottom-items {
            width: 25%;
            width: calc((100% - (25px * 3)) / 4);
            margin-right: 25px;
            &:last-child {
                margin-right: 0;
            }
            .bottom-items-imgs {
                position: relative;
                .imgs_shelves {
                    width: 100%;
                    position: absolute;
                    height: 275px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(153, 153, 153, 0.6);
                    left: 0;
                    top: 0;
                    img {
                        width: 180px;
                    }
                }
            }
            .el-image {
                width: 100%;
                height: 275px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                color: #dbdfe6;
                background: rgba(243, 245, 247, 0.39);
            }
            .text-content {
                padding-bottom: 20px;
                .name {
                    width: 100%;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                    font-size: 14px;
                    color: #000;
                    font-family: Microsoft YaHei;
                    text-align: center;
                    margin: 15px 0;
                }
                .price {
                  padding: 0 15px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  word-break: break-all;
                  text-align: center;
                    span {
                        font-size: 12px;
                        color: #E1251B;
                        font-family: Microsoft YaHei;
                        &:nth-child(2) {
                            font-size: 16px;
                        }
                    }
                }
            }
        }
    }
}
</style>