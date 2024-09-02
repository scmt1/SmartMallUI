<template>
  <div class="goods-module-four">
    <!-- 默认显示 start -->
    <template v-if="currentForm">
      <div class="top-image">
        <el-image src="" fit="fill">
          <div slot="error" class="image-slot">
            <img style="width: 27px" src="@/assets/img/micro-page/def.png">
          </div>
        </el-image>
      </div>
      <div class="bottom-content">
        <div class="bottom-items">
          <el-image src="" fit="fill">
            <div slot="error" class="image-slot">
              <img style="width: 27px" src="@/assets/img/micro-page/def.png" alt="">
            </div>
          </el-image>
          <div class="goods-description">商品名称商品名称商品名称</div>
          <div class="bottom-actions">
            <div class="real-price">
              <span>￥</span>
              <span>25.</span>
              <span>90</span>
            </div>
            <div class="add-carts">+</div>
          </div>
        </div>
        <div class="bottom-items">
          <el-image src="" fit="fill">
            <div slot="error" class="image-slot">
              <img style="width: 27px" src="@/assets/img/micro-page/def.png" alt="">
            </div>
          </el-image>
          <div class="goods-description">商品名称商品名称商品名称</div>
          <div class="bottom-actions">
            <div class="real-price">
              <span>￥</span>
              <span>25.</span>
              <span>90</span>
            </div>
            <div class="add-carts">+</div>
          </div>
        </div>
        <div class="bottom-items">
          <el-image src="" fit="fill">
            <div slot="error" class="image-slot">
              <img style="width: 27px" src="@/assets/img/micro-page/def.png" alt="">
            </div>
          </el-image>
          <div class="goods-description">商品名称商品名称商品名称</div>
          <div class="bottom-actions">
            <div class="real-price">
              <span>￥</span>
              <span>25.</span>
              <span>90</span>
            </div>
            <div class="add-carts">+</div>
          </div>
        </div>
      </div>
    </template>
    <!-- 默认显示 end -->
    <!-- 有配置信息 start -->
    <template v-else>
      <div class="top-image">
        <el-image :src="config.topImg" fit="fill">
          <div slot="error" class="image-slot">
            <img style="width: 27px" src="@/assets/img/micro-page/def.png" alt="">
          </div>
        </el-image>
      </div>
      <div class="bottom-content">
        <!-- 有商品数据 start -->
        <template v-if="config.goodsList.length > 0">
          <template v-for="(item, index) in config.goodsList">
            <div class="bottom-items" :key="index">
              <div class="bottom-items-img">
                <el-image :src="item.imgs" fit="fill">
                  <div slot="error" class="image-slot">
                    <img style="width: 27px" src="@/assets/img/micro-page/def.png" alt="">
                  </div>
                </el-image>
                <!-- 下架商品蒙版 start -->
                <div class="imgs_shelves" v-if="item.status != 1">
                  <img class="been_imgs" src="@/assets/img/pc-micro-page/been_shelves.png"></img>
                </div>
                <!-- 下架商品蒙版 end -->
              </div>
              <div class="goods-description">{{item.name}}</div>
                <div class="bottom-actions">
                  <div class="real-price">
                    <span>￥</span>
                    <span>{{getPrice(item.price, 'left')}}.</span>
                    <span>{{getPrice(item.price, 'right')}}</span>
                  </div>
                  <div class="add-carts">+</div>
                </div>
            </div>
          </template>
        </template>
        <!-- 有商品数据 end -->
        <!-- 没有商品数据 start -->
        <template v-else>
          <template v-for="(item, index) in goodsArr">
            <div class="bottom-items" :key="index">
              <el-image  fit="fill">
                <div slot="error" class="image-slot">
                  <img style="width: 27px" src="@/assets/img/micro-page/def.png" alt="">
                </div>
              </el-image>
              <div class="goods-description">商品名称商品名称商品名称</div>
              <div class="bottom-actions">
                <div class="real-price">
                  <span>￥</span>
                  <span>25.</span>
                  <span>90</span>
                </div>
                <div class="add-carts">+</div>
              </div>
            </div>
          </template>
        </template>
        <!-- 没有商品数据 end -->
      </div>
    </template>
    <!-- 有配置信息 end -->
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
    data() {
        return {
            moduleForm: {},
            goodsArr: new Array(3)
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
        currentForm() {
            return JSON.stringify(this.moduleForm) === '{}'
        }
    },
    watch: {
        config: {
            handler(newVal, oldVal) {
                this.$nextTick(() => {
                    this.moduleForm = {
                        ...newVal
                    }
                })
            },
            deep: true
        }
    }
}
</script>
<style lang="scss" scoped>
.goods-module-four {
    width: 100%;
    height: 100%;
    min-height: 286px;
    position: relative;
    overflow: hidden;
    .top-image {
        width: 100%;
        height: 98px;
        border-radius: 6px 6px 0 0;
        overflow: hidden;
        .el-image {
            width: 100%;
            height: 100%;
            background: rgba(235, 237, 240, 0.39);
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .bottom-content {
        width: 100%;
        min-height: 198px;
        background: #fff;
        display: flex;
        flex-wrap: wrap;
        border-radius: 10px;
        padding: 10px 8px;
        position: relative;
        margin-top: -10px;
        .bottom-items {
            width: calc((100% - 14px) / 3);
            margin-right: 7px;
            margin-bottom: 7px;
            &:nth-child(3n) {
                margin-right: 0;
            }
            .bottom-items-img {
                position: relative;
                .imgs_shelves {
                    position: absolute;
                    width: 107px;
                    height: 100px;
                    background: rgba(0, 0, 0, 0.6);
                    top: 0;
                    left: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    img {
                        width: 80px;
                    }
                }
            }
            .el-image {
                width: 107px;
                height: 100px;
                background: rgba(243, 245, 247, 0.39);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .goods-description {
                font-size: 12px;
                height: 34px;
                line-height: 17px;
                padding: 0 8px;
                text-align: center;
                color: #333333;
                font-family: PingFang SC;
                margin: 10px 0 4px 0;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
            }
            .bottom-actions {
                display: flex;
                justify-content: space-between;
                padding: 0 8px;
                align-items: center;
                .real-price {
                    color: #E43130;
                    width: calc(100% - 18px);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    span {
                        font-size: 10px;
                        font-weight: bold;
                        font-family: PingFang SC;
                        &:nth-child(2) {
                            font-size: 13px;
                        }
                    }
                }
                .add-carts {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-size: 18px;
                    padding-top: 1px;
                    background: linear-gradient(180deg, #FF6A37 0%, #FF302A 100%);
                }
            }
        }
    }
}
</style>