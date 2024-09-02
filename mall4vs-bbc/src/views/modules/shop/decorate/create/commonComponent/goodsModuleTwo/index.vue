<template>
    <div class="goods-two-items">
        <div class="top-header">
            <span>{{config.title}}</span>
            <img src="@/assets/img/pc-micro-page/goods_recommand.png">
        </div>
        <div class="bottom-content">
            <template v-if="config.maingoodsList && config.maingoodsList.length > 0">
                <template v-for="(item, index) in config.maingoodsList">
                    <div class="left-content" :key="index">
                        <div class="left-content-img">
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
                        
                        <div class="title">{{item.name}}{{item.description}}</div>
                        <div class="totals">
                            <span>￥</span>
                            <span>{{getPrice(item.price, 'left')}}.</span>
                            <span>{{getPrice(item.price, 'right')}}</span>
                        </div>
                    </div>
                </template>
            </template>
            <template v-else>
                <div class="left-content">
                    <el-image src="" fit="fill">
                        <div slot="error" class="image-slot">
                            <img style="width: 24px" src="@/assets/img/pc-micro-page/show-default.png">
                        </div>
                    </el-image>
                    <div class="title">{{$t(`pcdecorate.goodsList.goodsName`)}}{{$t(`pcdecorate.goodsList.goodsDescription`)}}</div>
                    <div class="totals">
                        <span>￥</span>
                        <span>{{$t(`pcdecorate.goodsList.price`)}}</span>
                        <span></span>
                    </div>
                </div>
            </template>
            <div class="right-content">
                <template v-if="config.othergoodsList && config.othergoodsList.length > 0">
                    <div class="right-top-content">
                        <template v-for="(item, index) in config.othergoodsList.slice(0, 3)">
                            <div class="right-items" :key="index">
                                <div class="right-content-img">
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
                                <div class="goods-message">
                                    <div class="name">{{item.name}}{{item.description}}</div>
                                    <div class="totals">
                                        <div class="actual" :style="setPriceLength(item, 'style')">
                                            <span>￥</span>
                                            <span>{{getPrice(item.price, 'left')}}.</span>
                                            <span>{{getPrice(item.price, 'right')}}</span>
                                        </div>
                                        <div
                                          v-show="setPriceLength(item, 'boolean')" 
                                          class="del-price">{{getPrice(item.orignPrice, 'left')}}.{{getPrice(item.orignPrice, 'right')}}</div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="right-bottom-content">
                        <template v-for="(item, index) in config.othergoodsList.slice(3)">
                            <div class="right-items" :key="index">
                                <div class="right-content-img">
                                    <el-image :src="item.imgs" fit="fill">
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
                                <div class="goods-message">
                                    <div class="name">{{item.name}}{{item.description}}</div>
                                    <div class="totals">
                                        <div class="actual" :style="setPriceLength(item, 'style')">
                                            <span>￥</span>
                                            <span>{{getPrice(item.price, 'left')}}.</span>
                                            <span>{{getPrice(item.price, 'right')}}</span>
                                        </div>
                                        <div
                                          v-show="setPriceLength(item, 'boolean')" 
                                          class="del-price">{{getPrice(item.orignPrice, 'left')}}.{{getPrice(item.orignPrice, 'right')}}</div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </template>
                <template v-else>
                    <div class="right-top-content">
                        <template v-for="(item, index) in defaultOtherArr.slice(0, 3)">
                            <div class="right-items" :key="index">
                                <el-image src="" fit="fill">
                                    <div slot="error" class="image-slot">
                                        <img style="width: 24px" src="@/assets/img/pc-micro-page/show-default.png">
                                    </div>
                                </el-image>
                                <div class="goods-message">
                                    <div class="name">{{$t(`pcdecorate.goodsList.goodsName`)}}{{$t(`pcdecorate.goodsList.goodsDescription`)}}</div>
                                    <div class="totals">
                                        <div class="actual">
                                            <span>￥</span>
                                            <span>{{$t(`pcdecorate.goodsList.price`)}}</span>
                                            <span></span>
                                        </div>
                                        <div class="del-price">￥0.00</div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="right-bottom-content">
                        <template v-for="(item, index) in defaultOtherArr.slice(3)">
                            <div class="right-items" :key="index">
                                <el-image src="" fit="fill">
                                    <div slot="error" class="image-slot">
                                        <img style="width: 24px" src="@/assets/img/pc-micro-page/show-default.png">
                                    </div>
                                </el-image>
                                <div class="goods-message">
                                    <div class="name">{{$t(`pcdecorate.goodsList.goodsName`)}}{{$t(`pcdecorate.goodsList.goodsDescription`)}}</div>
                                    <div class="totals">
                                        <div class="actual">
                                            <span>￥</span>
                                            <span>{{$t(`pcdecorate.goodsList.price`)}}</span>
                                            <span></span>
                                        </div>
                                        <div class="del-price">￥0.00</div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </template>
            </div>
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
        // 设置价格样式
        setPriceLength() {
          return (val, type) => {
            let status = true;
            let style = {};
            if(val && val.price.toString().length >= 4) {
              status = false;
              style = 'width: calc(100% - 5px);text-overflow: ellipsis;overflow: hidden;word-break: break-all;white-space: nowrap';
            } else {
              status = true;
              style = ''
            }
            if(type === 'style') {
              return style;
            } else if(type === 'boolean') {
              return status;
            }
          }
        },
    },
    data() {
        return {
            defaultOtherArr: new Array(6)
        }
    }
}
</script>
<style lang="scss" scoped>
.goods-two-items {
    width: 100%;
    height: 305px;
    background: #fff;
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    flex-direction: column;
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
        margin-top: 20px;
        display: flex;
        .left-content {
            width: 170px;
            height: 214px;
            background: rgba(255, 255, 255, 1);
            border-radius: 2px;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 20px;
            .left-content-img {
                position: relative;
                .imgs_shelves {
                    width: 116px;
                    height: 116px;
                    position: absolute;
                    left: 17px;
                    top: 27px;
                    border-radius: 50%;
                    background: rgba(153, 153, 153, 0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    img {
                        width: 80px;
                    }
                }
            }
            .el-image {
                width: 116px;
                height: 116px;
                background: rgba(255, 255, 255, 1);
                border-radius: 50%;
                margin: 27px 17px 17px 17px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: #dbdfe6;
            }
            .title {
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                word-break: break-all;
                color: #000;
                font-size: 12px;
                font-family: Microsoft YaHei;
                padding: 0 10px;
                margin-bottom: 10px;
                text-align: center;
            }
            .totals {
                text-align: center;
                width: calc(100% - 24px);
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
        }
        .right-content {
            width: calc(100% - 190px);
            background: #fff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .right-top-content,.right-bottom-content {
                width: 100%;
                height: 100px;
                display: flex;
                .right-items {
                    width: calc((100% - 60px) / 3);
                    height: 100px;
                    margin-right: 20px;
                    display: flex;
                    .right-content-img {
                        position: relative;
                        .imgs_shelves {
                            width: 100px;
                            height: 100px;
                            background: rgba(153, 153, 153, 0.6);
                            position: absolute;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            top: 0;
                            left: 0;
                            img {
                                width: 80px;
                            }
                        }
                    }
                    .el-image {
                        width: 100px;
                        height: 100px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 19px;
                        color: #dbdfe6;
                        background: #fafbfc;
                    }
                    .goods-message {
                        width: calc(100% - 100px);
                        padding-left: 10px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        .name {
                            width: 100%;
                            text-align: justify;
                            word-break: break-all;
                            font-size: 14px;
                            color: #000;
                            font-family: Microsoft YaHei;
                            display:-webkit-box;
                            -webkit-box-orient:vertical; 
                            -webkit-line-clamp:2;        
                            overflow:hidden;             
                            text-overflow:ellipsis;
                            margin-top: 4px;
                        }
                        .totals {
                            display: flex;
                            align-items: center;
                            font-size: 12px;
                            margin-bottom: 4px;
                            .actual {
                              white-space: nowrap;
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
                                font-size: 12px;
                                margin-left: 12px;
                                padding-top: 2px;
                                color: #999;
                                max-width: calc(50% - 5px);
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                word-break: break-all;
                            }
                        }
                    }
                }
            }
       }
    }
}
</style>