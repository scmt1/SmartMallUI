<template>
    <div class="select-decorate-page" :style="{background: pageBackground}">
        <div class="select-decorate-content">
            <div v-for="(item, index) in configArr" :key="index">
                <component
                    :is="item.components"
                    :itemComponent="item">
                </component>
            </div>
        </div>
    </div>
</template>
<script>
import { configComponentList } from '../edit/components/configComponent'
// 基础组件
import storeSignate from '../edit/components/basicComponent/storeSignate/index.vue' // 商家招牌组件
import pictureShuffling from '../edit/components/basicComponent/pictureShuffling/index.vue' // 图片轮播组件
import intervalComponent from '../edit/components/basicComponent/intervalComponent/index.vue' // 辅助间隔组件
import floorTitleComponent from '../edit/components/basicComponent/floorTitleComponent/index.vue' // 楼层标题组件
import goodListComponent from '../edit/components/basicComponent/goodListComponent/index.vue' // 商品列表组件
import hotSpotComponent from '../edit/components/basicComponent/hotSpotComponent/index.vue' // 万能热区组件
import storeListComponent from '../edit/components/basicComponent/storeListComponent/index.vue' // 店铺列表配置信息
// 营销活动
import limitedSkillComponent from '../edit/components/marketingActivities/limitedSkillComponent/index.vue' // 限时秒杀组件
import discountCouponComponent from '../edit/components/marketingActivities/discountCouponComponent/index.vue' // 优惠团购组件
// 扩展组件
import goodsModuleComponentOne from '../edit/components/extendComponent/goodsModuleComponentOne/index.vue' // 商品模块1组件
import goodsModuleComponentTwo from '../edit/components/extendComponent/goodsModuleComponentTwo/index.vue' // 商品模块2组件
import goodsModuleComponentThree from '../edit/components/extendComponent/goodsModuleComponentThree/index.vue' // 商品模块3组件
import goodsModuleComponentFour from '../edit/components/extendComponent/goodsModuleComponentFour/index.vue' // 商品模块4组件
import goodsModuleComponentFive from '../edit/components/extendComponent/goodsModuleComponentFive/index.vue' // 商品模块5组件间
// 组件管理
export default {
  components: {
    storeSignate,
    pictureShuffling,
    intervalComponent,
    floorTitleComponent,
    goodListComponent,
    hotSpotComponent,
    storeListComponent,
    limitedSkillComponent,
    discountCouponComponent,
    goodsModuleComponentOne,
    goodsModuleComponentTwo,
    goodsModuleComponentThree,
    goodsModuleComponentFour,
    goodsModuleComponentFive
  },
  data () {
    return {
      configArr: [],
      pageBackground: '' // 页面背景颜色
    }
  },
  mounted () {
    let { renovationId } = this.$route.query
    if (renovationId) {
      this.getDetail(renovationId)
    } else if (localStorage.getItem('viewContent')) {
      this.viewContent(JSON.parse(localStorage.getItem('viewContent')))
      localStorage.removeItem('viewContent')
    }
  },
  methods: {
      // 预览
    async viewContent (data) {
      const that = this
      document.title = data.name
      console.log(data)
      let useArr = []
      let contentArr = JSON.parse(data.content)
          // 匹配商品
      contentArr = await this.matchproducts(contentArr)
      contentArr.forEach(ele => {
        if (ele.type === 'page_background') {
          this.pageBackground = ele.dataField.background
        }
        configComponentList.forEach(item => {
          if (ele.type === item.type) {
            useArr.push({
              ...item,
              rightConfigMessage: ele.dataField
            })
          }
        })
      })
      that.configArr = useArr
    },
      // 获取详情
    getDetail (id) {
      let that = this
      this.$http({
        url: this.$http.adornUrl(`/shop/shopRenovation/info/${id}`),
        method: 'get'
      }).then(async({data}) => {
        document.title = data.name
        let useArr = []
        let contentArr = JSON.parse(data.content)
          // 匹配商品
        contentArr = await this.matchproducts(contentArr)
        contentArr.forEach(ele => {
          if (ele.type === 'page_background') {
            this.pageBackground = ele.dataField.background
          }
          configComponentList.forEach(item => {
            if (ele.type === item.type) {
              useArr.push({
                ...item,
                rightConfigMessage: ele.dataField
              })
            }
          })
        })
        that.configArr = useArr
      })
    },
      // 匹配商品
    async matchproducts (arr) {
      let res = await this.searchGoodsMessage(arr) // 根据现有的id查询所有的商品信息
      arr.forEach(item => {
        if (item.type === 'goods_list') { // 商品列表
          item.dataField.goodsList = this.handleScreenGoods(item.dataField.goodsList, res, 'id')
        } else if (item.type === 'discount_coupon') {
          let discountParams = {
            name: 'prodName', // 商品名称
            status: 'status',
            price: 'activityPrice',
            imgs: 'pic',
            description: 'brief'  // 商品描述
          }
          item.dataField.goodsList = this.handleScreenGoods(item.dataField.goodsList, res, 'id', discountParams)
        } else if (item.type === 'limited_skill') { // 秒杀商品
          let limitedParams = {
            name: 'prodName', // 商品名称
            status: 'status',
            price: 'activityPrice',
            imgs: 'pic',
            description: 'brief'  // 商品描述
          }
          item.dataField.goodsList = this.handleScreenGoods(item.dataField.goodsList, res, 'prodId', limitedParams)
        } else if (item.type === 'goods_module1') { // 商品模块1
          item.dataField.leftConfig.goodsList = this.handleScreenGoods(item.dataField.leftConfig.goodsList, res, 'id')
          item.dataField.centerConfig.goodsList = this.handleScreenGoods(item.dataField.centerConfig.goodsList, res, 'id')
          item.dataField.rightConfig.goodsList = this.handleScreenGoods(item.dataField.rightConfig.goodsList, res, 'id')
        } else if (item.type === 'goods_module2') { // 商品模块2
          item.dataField.maingoodsList = this.handleScreenGoods(item.dataField.maingoodsList, res, 'id')
          item.dataField.othergoodsList = this.handleScreenGoods(item.dataField.othergoodsList, res, 'id')
        } else if (item.type === 'goods_module3') { // 商品模块3
          item.dataField.leftConfig.goodsList = this.handleScreenGoods(item.dataField.leftConfig.goodsList, res, 'id')
          item.dataField.rightConfig.goodsList = this.handleScreenGoods(item.dataField.rightConfig.goodsList, res, 'id')
        } else if (item.type === 'goods_module4' || item.type === 'goods_module5') { // 商品模块4
          item.dataField.goodsList = this.handleScreenGoods(item.dataField.goodsList, res, 'id')
        }
      })
      return arr
    },
      // 查询商品信息
    searchGoodsMessage (arr) {
      let goodsArr = []
      arr.forEach(item => {
        if (item.type === 'limited_skill') { // 秒杀商品
          item.dataField.goodsList.forEach(v => {
            goodsArr.push(v.prodId)
          })
        } else if (item.type === 'discount_coupon') { // 优惠团购
          item.dataField.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
        } else if (item.type === 'goods_list') { // 商品信息
          item.dataField.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
        } else if (item.type === 'goods_module1') { // 商品模块1
          item.dataField.leftConfig && item.dataField.leftConfig.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
          item.dataField.centerConfig && item.dataField.centerConfig.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
          item.dataField.rightConfig && item.dataField.rightConfig.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
        } else if (item.type === 'goods_module2') { // 商品模块2
          item.dataField.maingoodsList && item.dataField.maingoodsList.forEach(v => {
            goodsArr.push(v.id)
          })
          item.dataField.othergoodsList && item.dataField.othergoodsList.forEach(v => {
            goodsArr.push(v.id)
          })
        } else if (item.type === 'goods_module3') { // 商品模块3
          item.dataField.leftConfig && item.dataField.leftConfig.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
          item.dataField.rightConfig && item.dataField.rightConfig.goodsList.forEach(v => {
            goodsArr.push(v.id)
          })
        } else if (item.type === 'goods_module4') { // 商品模块4
          item.dataField.goodsList && item.dataField.goodsList.forEach(v => {
              goodsArr.push(v.id)
            })
        } else if (item.type === 'goods_module5') { // 商品模块5
            item.dataField.goodsList && item.dataField.goodsList.forEach(v => {
              goodsArr.push(v.id)
            })
          }
      })
      goodsArr = Array.from(new Set(goodsArr))
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/admin/search/prod/renovationPage'),
          method: 'get',
          params: this.$http.adornParams({
            prodIds: goodsArr,
            current: 1,
            size: goodsArr.length,
            getDelete: true
          })
        }).then(({data}) => {
          resolve(data.records)
        })
      })
    },
      // 筛选商品回显 currentArr: 表示当前装修的商品，backReturnArr: 表示根据现有id查询后端返回的商品
    handleScreenGoods (currentArr, backReturnArr, type, otherParams) {
      let params = {}
      if (otherParams) {
        params = {
          ...otherParams
        }
      } else {
        params = {
          name: 'prodName', // 商品名称
          status: 'status', // 商品状态
          price: 'price', // 商品价格
          imgs: 'pic', // 商品图片
          description: 'brief'  // 商品描述
        }
      }
      let arr = []
      for (let i = 0; i < currentArr.length; i++) {
        for (let j = 0; j < backReturnArr.length; j++) {
          if (currentArr[i][type] == backReturnArr[j].prodId) {
            for (let key in params) {
              currentArr[i][key] = backReturnArr[j][params[key]]
            }
            currentArr[i].price == null ? currentArr[i].price = backReturnArr[j].price : ''
            currentArr[i].orignPrice ? currentArr[i].orignPrice = backReturnArr[j].oriPrice : ''
            currentArr[i].prodType ? currentArr[i].prodType = backReturnArr[j].prodType : ''
            arr.push(currentArr[i])
          }
        }
      }
      return arr
    }
  }
}
</script>
<style lang="scss">
.select-decorate-page {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: #f4f4f4;
    left: 0;
    top: 0;
    z-index: 1030;
    bottom: 0;
    right: 0;
    overflow-y: auto;
    // 头部样式
    .store-signate-page-container .store-top.style1 {
        width: 1200px!important;
    }
    .store-signate-page-container .store-top.style2 {
        .store-top-content {
            width: 1200px!important;
        }
    }
    .store-signate-page-container .store-bottom .bottom-content {
        width: 1200px!important;
        .navs-list {
            padding: 0 5px;
            li {
                margin-right: 50px;
            }
        }
    }
    // 轮播样式
    .picture-shutting-com.two {
        width: 1200px!important;
    }
    // 标题样式
    .common_floor_titles {
        width: 1200px!important;
    }
    // 商品列表样式
    .goods_list_component {
        width: 1200px!important;
        .goods-list-items.five {
            .el-image {
                height: 224px!important;
            }
            .imgs_shelves {
                height: 224px!important;
            }
        }
    }
    // 店铺列表
    .store-list-container .store-list-pages {
        width: 1200px!important;
    }
    // 热区样式
    .hot-spot-container .hot-spot-content.two {
        width: 1200px!important;
    }
    // 秒杀专区
    .limited-skill-pages {
        width: 1200px!important;
        .goods-list-items.four {
            .el-image {
                height: 285px!important;
            }
            .imgs_shelves {
                height: 285px!important;
            }
        }
    }
    .goods-module-one-component {
        width: 1200px!important;
    }
    .goods-module-two-component {
        width: 1200px!important;
        .actual {
            span {
                &:nth-child(2) {
                    font-size: 16px!important;
                }
            }
        }
    }
    // 商品模块3的样式
    .goods-module-three {
        width: 1200px!important;
        .goods-three-items {
            height: 336px!important;
            .bottom-items {
                width: calc((100% - 40px) / 3)!important;
                margin-right: 20px!important;
                .el-image {
                    width: 170px!important;
                    height: 170px!important;
                }
                .imgs_shelves {
                    width: 170px!important;
                    height: 170px!important;
                    img {
                        width: 140px!important;
                    }
                }
            }
        }
    }
    .goods-module-component {
        width: 1200px!important;
        .bottom-items {
            .el-image {
                height: 275px!important;
            }
            .imgs_shelves {
                height: 275px!important;
                img {
                    width: 180px!important;
                }
            }
        }
        .goods-module5 {
            .left-bg {
                width: 232px!important;
                height: 320px!important;
            }
            .right-goods {
                width: calc(100% - 232px)!important;
                height: 320px!important;
                .goods-items {
                    height: 320px!important;
                    .el-image {
                        height: 203.19px!important;
                    }
                    .imgs_shelves {
                        height: 203.19px!important;
                        img {
                            width: 140px!important;
                        }
                    }
                }
            }
        }
    }
}
</style>