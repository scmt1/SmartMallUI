<template>
    <el-dialog
            title="商品规格选择"
            center
            :close-on-click-modal="false"
            :visible.sync="visible"
            @close="handleDialogClose"
            width="500px"
    >
        <div class="prodSku">
            <!-- 规格弹窗 -->
            <div class="pup-sku">
                <div class="pup-sku-main">
                    <div class="pup-sku-header">
                        <div class="pup-sku-img">
                            <img v-if="setPicURL(defaultSku.pic) && !isPicError" :src="setPicURL(defaultSku.pic)" mode="aspectFit" @error="handlePicError"/>
                            <img v-else src="~@/assets/img/def.png" mode="aspectFit" />
                        </div>
                        <div class="pup-sku-prod">
                            <!-- 商品价格 -->
                            <div class="pup-sku-price">
                                <div v-if="defaultSku.price" class="pup-sku-price-int">￥{{ defaultSku.price }}</div>
                            </div>
                            <div style="display: flex;margin-top: 10px">
                                <div style="color: #999;">已选</div>
                                <div style="display: flex;">
                                    <div style="color: #999;" v-if="defaultSku.skuName">{{ '&nbsp;' + defaultSku.skuName }}</div>
                                    <div v-else style="color: #999;">
                                        {{ '&nbsp;' + selectedPropShowList.join('，') }}
                                    </div>
                                    <div>{{ '&nbsp;' + prodNum }}件</div>
                                </div>
                            </div>
                            <div v-if="findSku" style="display: flex;margin-top: 5px">
                                <div style="color: #999;">库存</div>
                                <div>{{ '&nbsp;'+ (defaultSku.stocks) }}</div>
                            </div>
                            <div v-if="!findSku" class="pup-sku-price">无货</div>
                        </div>
                    </div>
                    <div class="pup-sku-body">
                        <!-- 规格 -->
                        <div class="pup-sku-area">
                            <div v-if="skuList.length > 1" class="sku-box">
                                <div v-for="(skuGroupItem, skuGroupItemIndex) in skuGroupList" :key="skuGroupItemIndex">
                                    <div v-for="(skuLine, key) in skuGroupItem" :key="key" class="items sku-div">
                                        <div class="sku-kind">{{ key }}</div>
                                        <div class="con">
                                            <div
                                                    v-for="skuLineItem in skuLine"
                                                    :key="skuLineItem"
                                                    class="sku-choose-item"
                                                    :class="['item-item',selectedPropList.indexOf(key + ':' + skuLineItem) !== -1?'active':'',
                                   isSkuLineItemNotOptional(allProperties,selectedPropObj,key,skuLineItem,propKeys)? 'dashed' : '']"
                                                    @click="toChooseItem(skuGroupItemIndex, skuLineItem, key)"
                                            >{{ skuLineItem }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 数量 -->
                        <div class="item-num">
                            <div>数量</div>
                            <div style="display: flex;margin-left: 25px;align-items: center;">
                                <div class="num-dec" @click.stop="onCountMinus()">-</div>
                                <div class="num">{{ prodNum }}
<!--                                    <el-input v-model="prodNum" @input="changeNum"></el-input>-->
                                </div>
                                <div class="num-inc" @click.stop="onCountPlus()">+</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" style="background-color: #8558fa;border-color: #8558fa;" size="small" @click="handleAddToCart()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
  export default {
    name: 'prodSkuSelect',
    data () {
      return {
        visible: false,
        prodInfo:{},
        findSku: false,
        defaultSku: {},
        skuGroupList: [],
        propKeys: [],
        skuGroup: {},
        skuList: [],
        allProperties: [],
        selectedPropList: [],
        selectedPropShowList: [],
        selectedProperties: '',
        selectedPropObj: {},
        prodNum: 1,
        resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
        isPicError: false
      }
    },
    methods: {
      init (prodId) {
        this.visible = true
        this.getProdInfo(prodId)
      },
      handleDialogClose () {

      },
      /**
       * 图片加载失败时显示默认图片
       */
      handlePicError() {
        this.isPicError = true
      },
      // 减数量
      onCountMinus () {
        var prodNum = this.prodNum
        if (prodNum > 1) {
          prodNum = prodNum - 1
        }
        this.prodNum = prodNum
      },
      // 数量输入
      changeNum () {
        let num = Number(this.prodNum.replace(/[^\d]/g, ''))
        const max = this.defaultSku.stocks
        if (num > max) {
          num = max
        } else if (num < 1) {
          num = 1
        }
        this.prodNum = num
      },
      /**
       * 加数量
       */
      onCountPlus: function() {
        // 商品数量
        let prodNum = this.prodNum
        // 默认库存数量
        const defaultSkuStock = parseInt(this.defaultSku.stocks)
          if (prodNum >= defaultSkuStock) {
            this.$message({
              message: '库存不足！',
              type: 'error',
              offset: 150
            })
            prodNum = defaultSkuStock || 1
          } else {
            prodNum += 1
          }
        this.prodNum = prodNum
      },
      parsePrice (val) {
        if (!val) {
          val = 0
        }
        return val.toFixed(2).split('.')
      },
      /**
       * 加购
       */
      handleAddToCart() {
        if (!this.findSku || this.prodNumBiggerThanStock()) {
          return
        }
        if (this.findSku) {
          this.$emit('prodAddToCart', this.defaultSku,this.prodNum)
        }
        this.visible = false
      },
      /**
       * 库存校验
       * @return {Boolean} 购买数量大于库存
       */
      prodNumBiggerThanStock () {
        const defaultSkuStock = this.defaultSku.stocks
        return this.prodNum > defaultSkuStock
      },
      getProdInfo (prodId) {
        this.$http({
          url: this.$http.adornUrl(`/prod/prod/info/${prodId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.prodInfo = data
          this.skuList = this.prodInfo.skuList
          let skuList = this.prodInfo.skuList
          if (skuList.length == 1 && !skuList[0].properties) {
            this.selectedPropShowList = []
            this.defaultSku = skuList[0]
            this.defaultSku.pic = this.prodInfo.pic
            this.findSku = true
            return
          }
          let allProperties = []
          let skuGroupList = []
          let skuGroup = {}
          let propKeys = []
          let selectedPropObj = {}
          let selectedPropObjList = []
          let defaultSku = null
          let arr = JSON.parse(JSON.stringify(skuList))
          arr.sort((a, b) => {
            a.seckillPrice - b.seckillPrice
          })
          for (var i = 0; i < this.skuList.length; i++) {
            var isDefault = false
            if ((!defaultSku && skuList[i].skuId == this.skuId)) {
              defaultSku = skuList[i]
              isDefault = true
            }
            if (defaultSku === null && (i === skuList.length - 1)) {
              defaultSku = arr[0]
              isDefault = true
            }
            var properties = skuList[i].properties // 版本:公开版;颜色:金色;内存:64GB
            allProperties.push(properties)
            var propList = properties.split(';') // ["版本:公开版","颜色:金色","内存:64GB"]

            for (var j = 0; j < propList.length; j++) {
              var propval = propList[j].split(':') // ["版本","公开版"]
              var props = skuGroup[propval[0]] // 先取出 版本对应的值数组
              // 如果当前是默认选中的sku，把对应的属性值 组装到selectedProp
              if (isDefault) {
                propKeys.push(propval[0])
                selectedPropObj[propval[0]] = propval[1]
                const selectedPropObjItem = {}
                selectedPropObjItem[propval[0]] = propval[1]
                selectedPropObjList.push(selectedPropObjItem)
              }
              if (props == undefined) {
                props = [] // 假设还没有版本，新建个新的空数组
                props.push(propval[1]) // 把 "公开版" 放进空数组
              } else {
                if (props.indexOf(propval[1]) === -1) { // 如果数组里面没有"公开版"
                  props.push(propval[1]) // 把 "公开版" 放进数组
                }
              }
              skuGroup[propval[0]] = props // 最后把数据 放回版本对应的值
              const propListItem = {}
              propListItem[propval[0]] = props
              skuGroupList.push(propListItem)
            }
          }
          this.defaultSku = defaultSku || {}
          this.propKeys = propKeys
          this.selectedPropObj = selectedPropObj
          this.skuGroup = skuGroup
          this.selectedPropObjList = selectedPropObjList
          this.skuGroupList = this.unique(skuGroupList)
          this.allProperties = allProperties
          this.parseSelectedObjToVals(skuList)
          this.prodNum = 1
        })
      },
      /**
       * 将已选的 {key:val,key2:val2}转换成 [val,val2]
       */
      parseSelectedObjToVals (skuList) {
        const selectedPropObjList = this.selectedPropObjList
        let selectedProperties = ''
        const selectedPropList = []
        const selectedPropShowList = []
        for (let i = 0; i < selectedPropObjList.length; i++) {
          const selectedPropObjItem = selectedPropObjList[i]
          for (const key in selectedPropObjItem) {
            if (Object.hasOwnProperty.call(selectedPropObjItem, key)) {
              selectedPropList.push(key + ':' + selectedPropObjItem[key])
              selectedPropShowList.push(selectedPropObjItem[key])
              selectedProperties += key + ':' + selectedPropObjItem[key] + ';'
            }
          }
        }
        selectedProperties = selectedProperties.substring(0, selectedProperties.length - 1)
        this.selectedPropList = selectedPropList
        this.selectedPropShowList = selectedPropShowList
        this.selectedProperties = selectedProperties
        this.selectedPropObjList = selectedPropObjList
        var findSku = false
        for (var i = 0; i < skuList.length; i++) {
          if (skuList[i].properties == selectedProperties) {
            findSku = true
            this.defaultSku = skuList[i]
            break
          }
        }
        this.findSku = findSku
      },
      /**
       * 判断当前的规格值 是否可以选
       */
      isSkuLineItemNotOptional(allProperties, propObj, key, item, propKeys) {
        var selectedPropObj = Object.assign({}, propObj)
        var properties = ''
        selectedPropObj[key] = item
        for (let j = 0; j < propKeys.length; j++) {
          properties += propKeys[j] + ':' + selectedPropObj[propKeys[j]] + ';'
        }
        properties = properties.substring(0, properties.length - 1)
        for (let i = 0; i < allProperties.length; i++) {
          if (properties == allProperties[i]) {
            return false
          }
        }
        for (let i = 0; i < allProperties.length; i++) {
          if (allProperties[i].indexOf(item) >= 0) {
            return true
          }
        }
        return false
      },

      /**
       * 规格点击事件
       */
      toChooseItem(skuGroupItemIndex, skuLineItem, key) {
        this.prodNum = 1
        this.selectedPropObjList[skuGroupItemIndex] = this.selectedPropObjList[skuGroupItemIndex] || {}
        this.selectedPropObjList[skuGroupItemIndex][key] = skuLineItem
        this.selectedPropObj[key] = skuLineItem
        const skuList = this.skuList
        this.parseSelectedObjToVals(skuList)
      },
      /**
       * 去重
       */
      unique(arr) {
        const map = {}
        arr.forEach(item => {
          const obj = {}
          Object.keys(item).sort().map(key => {
            obj[key] = item[key]
          })
          map[JSON.stringify(obj)] = item
        })
        return Object.keys(map).map(key => JSON.parse(key))
      },
      /**
       * 图片路径处理
       */
      setPicURL(pic) {
        const url = pic
        if (url) {
          return url.indexOf('http') === -1 ? this.resourcesUrl + url : url
        }
        return false
      }
    }
  }
</script>

<style lang="scss" scoped>
.prodSku {
    .pup-sku-main {
        background-color: #fff;
        border-radius: 10px 10px 0 0;
        .pup-sku-header {
            position: relative;
            font-size: 14px;
            color: #333;
            padding: 10px 10px;
            background-color: #fff;
            border-bottom: 1px solid #f2f2f2;
            padding-top: 15px;
            border-radius: 10px 10px 0 0;
            .pup-sku-img {
                display: inline-block;
                height: 90px;
                vertical-align: middle;
                border-radius: 5px;
            }
            .pup-sku-img img {
                display: block;
                width: 90px;
                height: 100%;
            }
        }
        .pup-sku-prod {
            display: inline-block;
            width: 70%;
            vertical-align: middle;
            padding-left: 5px;
            .pup-sku-price {
                display: inline-block;
                height: 1.5em;
                line-height: 1.5em;
                color: #e43130;
                font-size: 13px;
            }
            .pup-sku-price-int {
                font-size: 17px;
            }
        }
        .pup-sku-body {
            .pup-sku-area {
                max-height: 245px;
                overflow-y: scroll;
                .sku-box{
                    max-height: 245px;
                    overflow-y: scroll;
                }
                .sku-kind {
                    font-size: 12px;
                    color: #999;
                    margin: 0 10px;
                    height: 40px;
                    line-height: 40px;
                }
                .con {
                    padding-right: 10px;
                    .sku-choose-item {
                        display: inline-block;
                        min-width: 50px;
                        max-width: 270px;
                        padding: 0 5px;
                        overflow: hidden;
                        height: 25px;
                        line-height: 25px;
                        text-align: center;
                        margin-left: 10px;
                        margin-bottom: 10px;
                        border-radius: 15px;
                        color: #333;
                        background-color: #f7f7f7;
                        font-size: 14px;
                        border: 1px solid #aaa;
                    }
                    .sku-choose-item.active {
                        background-color: #8558fa;
                        color: #fff;
                        border: 1px solid #8558fa !important;
                    }
                    .sku-choose-item.gray {
                        background-color: #f9f9f9;
                        color: #ddd;
                    }
                    .sku-choose-item.dashed {
                        border: 1px dashed #ccc;
                    }
                }
            }
            .item-num {
                display: flex;
                align-items: center;
                margin-left: 10px;
                margin-top: 10px;
                height: 40px;
                line-height: 40px;

                .num-dec {
                    width: 25px;
                    height: 25px;
                    background: #e6e6e6;
                    border: 1px solid #e6e6e6;
                    border-radius: 30%;
                    text-align: center;
                    line-height: 20px;
                    font-size: 25px;
                    margin-right: 10px;
                    cursor: pointer;
                    transition: .3s;
                }

                .num {
                    font-size: 14px;
                }

                .num-inc {
                    width: 25px;
                    height: 25px;
                    background: #8558fa;
                    border: 1px solid #e6e6e6;
                    border-radius: 30%;
                    text-align: center;
                    line-height: 23px;
                    font-size: 25px;
                    margin-left: 10px;
                    cursor: pointer;
                    transition: .3s;
                    color: #fff;
                }
            }
        }
    }
}
</style>
