<template>
    <div class="goods-three-items">
        <div class="top-header">
            <span>{{config.title}}</span>
            <img src="@/assets/img/pc-micro-page/goods_recommand.png">
        </div>
        <div class="bottom-content">
            <template v-if="config.goodsList && config.goodsList.length > 0">
                <template v-for="(item, index) in config.goodsList">
                    <div class="bottom-items" :key="index">
                        <div class="bottom-items-imgs">
                            <el-image :src="item.imgs" fit="cover">
                                <div slot="error" class="image-slot">
                                    <img style="width: 24px" src="@/assets/img/pc-micro-page/show-default.png">
                                </div>
                            </el-image>
                            <!-- 下架商品蒙版 start -->
                            <div class="imgs_shelves" v-if="item.status != 1">
                                <img class="been_imgs" src="@/assets/img/pc-micro-page/been_shelves.png" >
                            </div>
                            <!-- 下架商品蒙版 end -->
                        </div>
                        <div class="bottom-text">
                            <span class="goods-name">{{item.name}}{{item.description}}</span>
                            <div class="price-content">
                                <div class="price-text">
                                    <span>￥</span>
                                    <span>{{getPrice(item.price, 'left')}}.</span>
                                    <span>{{getPrice(item.price, 'right')}}</span>
                                </div>
                                <!-- <div class="del-price">{{getPrice(item.orignPrice, 'left')}}.{{getPrice(item.orignPrice, 'right')}}</div> -->
                            </div>
                        </div>
                    </div>
                </template>
            </template>
            <template v-else>
                <template v-for="(item, index) in defaultArr">
                    <div class="bottom-items" :key="index">
                        <el-image src="" fit="cover">
                            <div slot="error" class="image-slot">
                                <img style="width: 24px" src="@/assets/img/pc-micro-page/show-default.png">
                            </div>
                        </el-image>
                        <div class="bottom-text">
                            <span class="goods-name">{{$t(`pcdecorate.goodsList.goodsName`)}}{{$t(`pcdecorate.goodsList.goodsDescription`)}}</span>
                            <div class="price-content">
                                <div class="price-text">
                                    <span>￥</span>
                                    <span>{{$t(`pcdecorate.goodsList.price`)}}</span>
                                    <span></span>
                                </div>
                                <!-- <div class="del-price">00</div> -->
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
            defaultArr: new Array(3)
        }
    }
}
</script>
<style lang="scss" scoped>
$currentContentWidth: 1200px; // 当前页面内容宽度
.goods-three-items {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 20px;
    background: #fff;
    overflow: hidden;
    .top-header {
        display: flex;
        align-items: center;
        span {
            font-size: 24px;
            font-family: Microsoft YaHei;
            color: #000;
        }
        img {
            width: 16px;
            height: 16px;
            margin-left: 12px;
        }
    }
    .bottom-content {
        display: flex;
        margin-top: 20px;
        .bottom-items {
            width: calc((100% - 40px) / 3);
            display: flex;
            flex-direction: column;
            margin-right: 20px;
            &:last-child {
                margin-right: 0;
            }
            .bottom-items-imgs {
                position: relative;
                .imgs_shelves {
                    width: 170px;
                    height: 170px;
                    background: rgba(153, 153, 153, 0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    top: 0;
                    left: 0;
                    img {
                        width: 80px;
                    }
                }
            }
            .el-image {
                width: 170px;
                height: 170px;
                display: flex;
                background: rgba(248, 248, 249, 0.39);
                align-items: center;
                justify-content: center;
                color: #dbdfe6;
                font-size: 19px;
            }
            .bottom-text {
                font-size: 14px;
                padding: 0 4px;
                margin-top: 15px;
                .goods-name {
                    width: 100%;
                    margin: 0 auto;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    word-break: break-all;
                    overflow: hidden;
                    text-align: center;
                    display: inline-block;
                    color: #000;
                }
                .price-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 12px;
                    .price-text {
                        padding: 0 15px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        word-break: break-all;
                        span {
                            color: #E1251B;
                            font-family: Microsoft YaHei;
                            &:nth-child(1) {
                                font-size: 12px;
                            }
                            &:nth-child(2) {
                                font-size: 16px;
                            }
                            &:nth-child(3) {
                                font-size: 12px;
                            }
                        }
                    }
                    .del-price {
                        text-decoration: line-through;
                        padding-top: 2px;
                        margin-left: 12px;
                        color: #999;
                    }
                }
            }
        }
    }
}
</style>