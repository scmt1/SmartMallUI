<template>
    <!-- 这个是商品列表 -->
    <div class="goods_list_container">
        <div class="goods_list_component">
            <template v-if="config.dataList && config.dataList.length > 0">
                <template v-for="(item, index) in config.dataList">
                    <div :key="index" :style="setGoodsListStyle" :class="setClassName">
                        <div class="goods-img-content">
                            <el-image :src="item.imgs" fit="fill">
                                <div slot="error" class="image-slot" >
                                    <img src="@/assets/img/pc-micro-page/show-default.png" style="width: 34px">
                                </div>
                            </el-image>
                            <!-- 下架商品蒙版 start -->
                            <!-- 限时秒活动 -->
                            <template v-if="currentType">
                              <div class="imgs_shelves" v-if="setImgs(item, 'show')">
                              <img class="been_imgs" :src="setImgs(item, 'src')" />
                            </div>
                            </template>
                            <!-- 普通商品下架 -->
                            <template v-else>
                              <div class="imgs_shelves" v-if="item.status != 1">
                                <img class="been_imgs" src="@/assets/img/pc-micro-page/been_shelves.png" />
                              </div>
                            </template>
                            <!-- 下架商品蒙版 end -->
                        </div>
                        
                        <div class="goods-text">
                            <div class="top">
                                <span class="name" v-show="config.showName === 0">{{item.name}}</span>
                                <span class="description" v-show="config.showDescription === 0">{{item.description}}</span>
                            </div>
                            <div class="price" v-show="config.showPrice === 0">
                                <div class="count">
                                    <span>￥</span>
                                    <span>{{getPrice(item.price, 'left')}}.</span>
                                    <span>{{getPrice(item.price, 'right')}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </template>
            <template v-else>
                <template v-for="(item, index) in config.listTypeList">
                    <div :key="index" :style="setGoodsListStyle" :class="setClassName">
                        <el-image fit="cover" style="background: rgba(243, 245, 247, 0.39);">
                            <div slot="error" class="image-slot" >
                                <img src="@/assets/img/pc-micro-page/show-default.png" style="width: 34px">
                            </div>
                        </el-image>
                        <div class="goods-text">
                            <div class="top">
                                <span class="name" v-show="config.showName === 0">{{$t(`pcdecorate.goodsList.goodsName`)}}</span>
                                <span class="description" v-show="config.showDescription === 0">{{$t(`pcdecorate.goodsList.goodsDescription`)}}</span>
                            </div>
                            <div class="price" v-show="config.showPrice === 0">
                                <div class="count">
                                    <span>￥{{$t(`pcdecorate.goodsList.price`)}}</span>
                                </div>
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
        config: { // 商品配置信息
            type: Object,
            default: () => {}
        },
        currentType: { // 当是是否是活动
          type: Boolean,
          default: () => false 
        },
        type: { // 当前是什么类型，限时秒杀，还是优惠团购
          type: String,
          default: () => ''
        }
    },
    data() {
        return {

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
        // 设置商品列表样式
        setGoodsListStyle() {
            let width = ''
            // 如果当前每行展示三个，此时每个对应的宽度是
            if(this.config.showMany === 3) {
                width = 'calc(33.3% - (20px - (20px / 3)))';
            } else if(this.config.showMany === 4) {
                width = 'calc(25% - (20px - (20px / 4)))';
            } else if(this.config.showMany === 5) {
               width = 'calc(20% - (20px - (20px / 5)))';
            }
            return {
                width: width,

            }
        },
        // 设置类名
        setClassName() {
            let className = 'goods-list-items';
            if(this.config.showMany === 3) {
                className = 'goods-list-items three';
            } else if(this.config.showMany === 4) {
                className = 'goods-list-items four';
            } else if(this.config.showMany === 5) {
                className = 'goods-list-items five';
            }
            return className;
        },
        // 活动商品下架或者结束
        setImgs() {
          return (item, val) => {
            let params = {
              status: false,
              imgs: require('@/assets/img/pc-micro-page/been_shelves.png')
            }
            if(this.type === 'skill') { // 秒杀
              if(item.status != 1) { // 当前就显示下架图标
                params.imgs = require('@/assets/img/pc-micro-page/been_shelves.png');
                params.status = true;
              } else if(item.status === 1 && item.prodType != 2) { // 显示结束图标
                params.imgs = require('@/assets/img/pc-micro-page/has_end.png');
                params.status = true;
              } else {
                params.status = false;
              }
            } else if(this.type === 'discount') { // 拼团
              if(item.status != 1) { // 当前就显示下架图标
                params.imgs = require('@/assets/img/pc-micro-page/been_shelves.png');
                params.status = true;
              } else if(item.status === 1 && item.prodType != 1) { // 显示结束图标
                params.imgs = require('@/assets/img/pc-micro-page/has_end.png');
                params.status = true;
              } else {
                params.status = false;
              }
            }
            
            if(val === 'show') {
              return params.status;
            } else if(val === 'src'){
              return params.imgs;
            }
          }
        }
    }
}
</script>
<style lang="scss" scoped>
$currentContentWidth: 1200px; // 当前页面内容宽度
.goods_list_container {
    width: 100%;
    overflow: hidden;
}
.goods_list_component {
    width: $currentContentWidth;
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    .goods-list-items {
        margin-right: 20px;
        margin-bottom: 20px;
        overflow: hidden;
        background: #fff;
        .goods-img-content {
            position: relative;
        }
        &.three {
            &:nth-child(3n) {
                margin-right: 0;
            }
            .el-image {
              height: 386.27px;
            }
            .imgs_shelves {
                position: absolute;
                width: 100%;
                height: 386.27px;
                background: rgba(153, 153, 153, 0.6);
                top: 0;
                left: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                .been_imgs {
                    width: 180px;
                }
            }
        }
        &.four {
            &:nth-child(4n) {
                margin-right: 0;
            }
            .el-image {
              height: 285px;
            }
            .imgs_shelves {
                position: absolute;
                width: 100%;
                height: 285px;
                background: rgba(153, 153, 153, 0.6);
                top: 0;
                left: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                .been_imgs {
                    width: 180px;
                }
            }
        }
        &.five {
            &:nth-child(5n) {
                margin-right: 0;
            }
            .el-image {
              height: 224px;
            }
            .imgs_shelves {
                position: absolute;
                width: 100%;
                height: 224px;
                background: rgba(153, 153, 153, 0.6);
                top: 0;
                left: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                .been_imgs {
                    width: 140px;
                }
            }
        }
        
        .el-image {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(243, 245, 247, 0.39);
        }
        .image-slot {
            width: 100%;
            height: 100%;
            background: rgba(243, 245, 247, 0.39);
        }
        .goods-text {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow: hidden;
            margin-top: 15px;
            margin-bottom: 15px;
            .top {
                width: 90%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                text-align: center;
                margin-bottom: 9px;
                word-break: break-all;
                color: #333333;
                font-size: 13px;
                font-family: Microsoft YaHei;
            }
            .price {
                width: 90%;
                .count {
                  text-align: center;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  word-break: break-all;
                  color: #E1251B;
                  span {
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
        }
    }
}
</style>