<template>
  <div class="goods-module-three">
    <!-- 默认显示 start -->
    <template v-if="currentForm">
      <div class="goods-three-title">{{$t('shopFeature.goodsModule.mainTitCon')}}</div>
        <div class="goods-three-items">
          <el-image src="" fit="fill">
            <div slot="error" class="image-slot">
              <img style="width: 27px" src="@/assets/img/micro-page/def.png" alt="">
            </div>
          </el-image>
          <div class="right-content">
            <div class="description">商品名称商品名称商品名称商品名称商品名称商品名称商品名称</div>
            <div class="right-actions">
              <div class="left-price">
                <div class="real-price">
                  <span>￥</span>
                  <span>59.</span>
                  <span>90</span>
                </div>
                <div class="del-price">￥100.00</div>
              </div>
              <div class="right-go">
                <div>{{$t('shopFeature.goodsModule.toPay')}}</div>
              </div>
            </div>
          </div>
        </div>
    </template>
    <!-- 默认显示 end -->
    <!-- 有配置信息 start -->
    <template v-else>
      <div class="goods-three-title">{{moduleForm.mainTitle}}</div>
      <!-- 有商品数据的时候 start -->
      <template v-if="moduleForm.goodsList.length > 0">
        <template v-for="(item, index) in moduleForm.goodsList">
          <div class="goods-three-items" :key="index">
            <div class="goods-three-items-imgs">
              <el-image :src="item.imgs" fit="fill">
                <div slot="error" class="image-slot">
                  <img style="width: 27px" src="@/assets/img/micro-page/def.png" alt="">
                </div>
              </el-image>
              <!-- 下架商品蒙版 start -->
              <div class="imgs_shelves" v-if="item.status != 1">
                <img class="been_imgs" src="@/assets/img/pc-micro-page/been_shelves.png" />
              </div>
              <!-- 下架商品蒙版 end -->
            </div>
            <div class="right-content">
              <div class="description">{{item.name}}</div>
              <div class="right-actions">
                <div class="left-price">
                  <div class="real-price">
                    <span>￥</span>
                    <span>{{getPrice(item.price, 'left')}}.</span>
                    <span>{{getPrice(item.price, 'right')}}</span>
                  </div>
                  <div class="del-price">￥{{item.orignPrice}}</div>
                </div>
                <div class="right-go">
                  <div>{{$t('shopFeature.goodsModule.toPay')}}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <!-- 有商品数据的时候 end -->
      <!-- 没有商品数据 start -->
      <template v-else>
        <template v-for="(item, index) in goodsArr">
          <div class="goods-three-items" :key="index">
            <el-image fit="fill">
              <div slot="error" class="image-slot">
                <img style="width: 27px" src="@/assets/img/micro-page/def.png" alt="">
              </div>
            </el-image>
            <div class="right-content">
              <div class="description">商品名称商品名称商品名称商品名称商品名称商品名称商品名称</div>
              <div class="right-actions">
                <div class="left-price">
                  <div class="real-price">
                    <span>￥</span>
                    <span>59.</span>
                    <span>90</span>
                  </div>
                  <div class="del-price">￥100.00</div>
                </div>
                <div class="right-go">
                  <div>{{$t('shopFeature.goodsModule.toPay')}}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <!-- 没有商品数据 end -->
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
  data () {
    return {
      moduleForm: {},
      goodsArr: new Array(1)
    }
  },
  computed: {
      // 得到价格显示
    getPrice () {
      return (price, type) => {
        if (!price) return
        let point = price.toString().indexOf('.') // 如果为-1则表示没找到
        let leftPrice = ''
        let rightPrice = ''
        if (point === -1) { // 当前是整数
          leftPrice = price
          rightPrice = '00'
        } else {
          leftPrice = price.toString().slice(0, point)
          rightPrice = price.toString().slice(point + 1)
        }
        switch (type) {
          case 'left':
            return leftPrice
          case 'right':
            return rightPrice
          default:
            break
        }
      }
    },
    currentForm () {
      return JSON.stringify(this.moduleForm) === '{}'
    }
  },
  watch: {
    config: {
      handler (newVal, oldVal) {
        this.moduleForm = {
          ...newVal
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.goods-module-three {
    width: 100%;
    padding: 0 12px;
    background: #fff;
    border-radius: 6px;
    overflow: hidden;
    .goods-three-title {
        font-size: 15px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #333;
        margin: 8px 0;
    }
    .goods-three-items {
        display: flex;
        margin-bottom: 12px;
        .goods-three-items-imgs {
            position: relative;
            .imgs_shelves {
                width: 102px;
                height: 102px;
                background: rgba(0, 0, 0, 0.6);
                position: absolute;
                left: 0;
                top: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    width: 80px;
                }
            }
        }
        .el-image {
            width: 102px;
            height: 102px;
            background: rgba(243, 245, 247, 0.39);
            border-radius: 6px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .right-content {
            width: calc(100% - 102px);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding-left: 10px;
            .description {
                font-size: 13px;
                color: #333;
                font-family: PingFang SC;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
            }
            .right-actions {
                display: flex;
                justify-content: space-between;
                .left-price {
                    .real-price {
                        span {
                            font-size: 11px;
                            font-weight: bold;
                            color: #E13E2D;
                            font-family: PingFang SC;
                            &:nth-child(2) {
                                font-size: 13px;
                            }
                        }
                    }
                    .del-price {
                        font-size: 12px;
                        font-family: PingFang SC;
                        font-weight: bold;
                        color: #AAAAAA;
                        text-decoration: line-through;
                        margin-bottom: 3px;
                        margin-top: 2px;
                    }
                }
                .right-go {
                    div {
                        width: 70px;
                        height: 28px;
                        background: linear-gradient(270deg, #FF6A37 0%, #FF302A 100%);
                        opacity: 1;
                        border-radius: 4px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #fff;
                        font-family: PingFang SC;
                        font-size: 12px;
                    }
                }
            }
        }
    }
}
</style>