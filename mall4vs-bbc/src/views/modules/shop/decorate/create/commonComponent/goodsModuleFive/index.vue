<template>
    <div class="goods-module5">
        <div class="left-bg">
            <el-image :src="config.bgImg" fit="fill">
                <div slot="error" class="image-slot">
                    <img style="width: 24px" src="@/assets/img/pc-micro-page/show-default.png">
                </div>
            </el-image>
        </div>
        <div class="right-goods">
            <template v-if="config.goodsList && config.goodsList.length > 0">
                <template v-for="(item, index) in config.goodsList">
                    <div class="goods-items" :key="index">
                        <div class="goods-items-imgs">
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
                    <div class="goods-items" :key="index">
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
        config: {
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
.goods-module5 {
    width: 100%;
    overflow: hidden;
    display: flex;
    .left-bg {
      width: 232px;
      height: 320px;
      margin-right: 20px;
      background: #fff;
        .el-image {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: #dbdfe6;
        }
    }
    .right-goods {
        width: calc(100% - 252px);
        height: 320px;
        display: flex;
        .goods-items {
          width: calc((100% - 60px) / 4);
          height: 100%;
          background: #fff;
          margin-right: 20px;
          &:last-child {
            margin-right: 0;
          }
          padding: 12px;
            .goods-items-imgs {
                position: relative;
                .imgs_shelves {
                    width: 100%;
                    height: 203.19px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    left: 0;
                    top: 0;
                    background: rgba(153, 153, 153, 0.6);
                    img {
                        width: 140px;
                    }
                }
            }
            .el-image {
                width: 100%;
                height: 203.19px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                background: rgba(243, 245, 247, 0.39);
                color: #dbdfe6;
            }
            .name {
                width: 100%;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                font-size: 14px;
                font-family: Microsoft YaHei;
                color: #000;
                margin: 15px 0;
            }
            .price {
              padding: 0 15px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              word-break: break-all;
              text-align: center;
              color: #E1251B;
              font-family: Microsoft YaHei;
              span {
                font-size: 12px;
                &:nth-child(2) {
                    font-size: 16px;
                }
                &:nth-child(3) {
                    font-size: 12px;
                }
              }
            }
        }
    }
}
</style>