<template>
    <div class="goods-module-items">
        <div class="top-header">
            <div class="main-title">
                <span>{{config.mainTitle}}</span>
                <img src="@/assets/img/pc-micro-page/goods_recommand.png">
            </div>
            <div class="sub-title">{{config.subTitle}}</div>
        </div>
        <div class="bottom-content">
            <template v-if="config.goodsList && config.goodsList.length > 0">
                <div v-for="(item, index) in config.goodsList" :key="index" class="content-items">
                    <div class="left-img">
                        <el-image :src="item.imgs" fit="fill">
                            <div slot="error" class="image-slot">
                              <img style="width: 24px" src="@/assets/img/pc-micro-page/show-default.png">
                            </div>
                        </el-image>
                        <!-- 下架商品蒙版 start -->
                        <div class="imgs_shelves" v-if="item.status != 1">
                            <img class="been_imgs" src="@/assets/img/pc-micro-page/been_shelves.png" />
                        </div>
                        <!-- 下架商品蒙版 end -->
                    </div>
                    <div class="right-text">
                        <div class="name">{{item.name}}{{item.description}}</div>
                        <div class="totals">
                            <div class="actual" :style="setPriceLength(item, 'style')">
                                <span>￥</span>
                                <span>{{getPrice(item.price, 'left')}}.</span>
                                <span>{{getPrice(item.price, 'right')}}</span>
                            </div>
                            <div 
                              class="del-price"
                              v-show="setPriceLength(item, 'boolean')"
                              >￥{{getPrice(item.orignPrice, 'left')}}.{{getPrice(item.orignPrice, 'right')}}</div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div v-for="(item, index) in defaultArr" :key="index" class="content-items">
                    <div class="left-img">
                        <el-image src="" fit="fill">
                            <div slot="error" class="image-slot">
                                <img style="width: 24px" src="@/assets/img/pc-micro-page/show-default.png">
                            </div>
                        </el-image>
                    </div>
                    <div class="right-text">
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
    </div>
</template>
<script>
export default {
    props: {
        config: { // 配置数据
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
        setPriceLength() {
          return (val, type) => {
            let status = true;
            let style = {};
            if(val && val.price.toString().length >= 8) {
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
        defaultArr: new Array(3), // 默认数组
      }
    }
}
</script>
<style lang="scss" scoped>
.goods-module-items {
    width: 100%;
    height: 442px;
    box-sizing: border-box;
    background: #fff;
    overflow: hidden;
    padding: 20px;
    .top-header {
        width: 100%;
        display: flex;
        flex-direction: column;
        .main-title {
            display: flex;
            align-items: center;
            span {
                font-size: 24px;
                color: #000;
                font-family: Microsoft YaHei;
                margin-right: 8px;
            }
            img {
                width: 16px;
                height: 16px;
            }
        }
        .sub-title {
            color: #999;
            font-size: 14px;
            margin-top: 8px;
        }
    }
    .bottom-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-top: 20px;
        .content-items {
            display: flex;
            margin-bottom: 14px;
            .left-img {
                position: relative;
                 .el-image {
                    width: 100px;
                    height:100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #dbdfe6;
                    font-size: 19px;
                    background: rgba(243, 245, 247, 0.39);
                    border: 1px solid rgba(153, 153, 153, 0.1);
                }
                .imgs_shelves {
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(153, 153, 153, 0.6);
                    top: 0;
                    left: 0;
                    img {
                        width: 80px;
                    }
                }
            }
            .right-text {
                width: calc(100% - 100px);
                padding-left: 10px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .name {
                    font-size: 14px;
                    color: #000;
                    font-family: Microsoft YaHei;
                    display:-webkit-box;
                    -webkit-box-orient:vertical; 
                    -webkit-line-clamp:2;
                    word-break: break-all;        
                    overflow:hidden;             
                    text-overflow:ellipsis;
                    padding-top: 2px;
                }
                .totals {
                    display: flex;
                    align-items: center;
                    padding-bottom: 4px;
                    .actual {
                        span {
                            color: rgba(225, 37, 27, 1);
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
                        margin-left: 12px;
                        color: #999;
                        font-family: Microsoft YaHei;
                        font-size: 12px;
                        text-decoration: line-through;
                        padding-top: 1px;
                        max-width: calc(50% - 6px);
                        text-overflow: ellipsis;
                        overflow: hidden;
                        word-break: break-all;
                        white-space: nowrap;
                    }
                }
            }
        }
    }
}
</style>