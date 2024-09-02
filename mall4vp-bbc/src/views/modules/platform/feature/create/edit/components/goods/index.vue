<template>
  <div class="micro-goods-box">
    <div class="design-preview-controller">
      <div class="goods-list">
        <template v-if="formData.goods.length">
          <div
            class="goods-li"
            v-for="(item, index) in formData.goods"
            :key="index"
            :class="{isGoodCell3:formData.size === 3, isGoodCell1:formData.size === 1}">
            <div class="goods-li-box" :class="{'no-goods-price':!formData.showContent.find(x=>x===3)&&formData.showContent.find(x=>x===4)}">
              <div class="goods-item" :class="{goodsItem1:formData.size === 1}">
                <!--图片-->
                <el-image class="goods-img-one" :class="{goodsImgOne1:formData.size === 1, 'goods-empty': !formData.goods[0].prodId}"
                :src="item.pic" fit="fill">
                    <div slot="error" class="image-slot">
                        <img src="@/assets/img/pc-micro-page/show-default.png" fit="fill">
                    </div>
                </el-image>
                <!-- 下架商品蒙版 start -->
                <div class="imgs_shelves" v-if="item.status != 1">
                    <img class="been_imgs" src="@/assets/img/pc-micro-page/been_shelves.png" >
                </div>
                <!-- 下架商品蒙版 end -->
                <!-- <div class="goods-img-one"
                    :class="{goodsImgOne1:formData.size === 1, 'goods-empty': !formData.goods[0].prodId}"
                    :style="{backgroundImage:'url('+(item.pic || defImg)+')'}"></div>
                <div class="imgs_shelves" v-if="item.status != 1" >
                    <img class="been_imgs" src="@/assets/img/pc-micro-page/been_shelves.png"></img>
                </div> -->
                <!--end 图片-->

                <div class="goods-box-info" :class="{goodsBoxInfo1:formData.size === 1}">
                  <div v-if="formData.showContent.find(x=>x===1)" class="goods-info-title">{{ item.prodName }}</div>
                  <div v-if="formData.showContent.find(x=>x===2)" class="goods-info-desc">{{ item.brief }}</div>
                  <div
                    v-if="formData.showContent.find(x=>x===3)||formData.showContent.find(x=>x===4)"
                    class="goods-info-price "
                    :class="{'goods-cell-3':formData.showContent.find(x=>x===4)}">
                    <div v-if="formData.showContent.find(x=>x===3)" class="price-info"><span>¥</span>{{ item.price }}</div>
                  <!--
                    v-if="formData.showContent.find(x=>x===4)"
                    :class="['goods-info-buy-btn','btn-type-'+formData.buy_btn_type]"
                  >
                    <i v-if="formData.buy_btn_type===1" :class="['btn-type-'+formData.buy_btn_type]"></i>
                    <i v-if="formData.buy_btn_type===2" class="el-icon-circle-plus-outline"></i>
                    <i v-if="formData.buy_btn_type===3" class="el-icon-goods"></i>
                    <i v-if="formData.buy_btn_type===4" class="el-icon-s-goods"></i>
                    <el-button
                      v-if="formData.buy_btn_type>=5"
                      :round="formData.buy_btn_type>=7"
                      size="mini"
                      :type="formData.buy_btn_type | buy_btn_type"
                    >{{ formData.button_text || '马上抢' }}
                    </el-button>
                  </div> -->
                  </div>
                </div>
              </div>
            </div>

          </div>
        </template>
        <template v-else>
          <div v-for="(item,index) in goodsList" :key="index" class="goods-li"
             :class="{isGoodCell3:formData.size === 3, isGoodCell1:formData.size === 1}">
            <div class="goods-li-box" :class="{'no-goods-price':!formData.showContent.find(x=>x===3)&&formData.showContent.find(x=>x===4)}">
                <div class="goods-item" :class="{goodsItem1:formData.size === 1}">
                <!--图片-->
                <div class="goods-img-one"
                    :class="{goodsImgOne1:formData.size === 1, 'goods-empty': !goodsList[0].prodId}"
                    :style="{backgroundImage:'url('+(item.pic || defImg)+')'}"></div>
                <!--end 图片-->
                <div class="goods-box-info"
                    :class="{goodsBoxInfo1:formData.size === 1}">
                  <div v-if="formData.showContent.find(x=>x===1)"
                      class="goods-info-title">{{ item.prodName }}
                  </div>
                  <div v-if="formData.showContent.find(x=>x===2)&&item.brief"
                      class="goods-info-desc">
                    {{ item.brief }}
                  </div>
                  <div v-if="formData.showContent.find(x=>x===3)||formData.showContent.find(x=>x===4)"
                      class="goods-info-price "
                      :class="{'goods-cell-3':formData.showContent.find(x=>x===4)}">
                    <div v-if="formData.showContent.find(x=>x===3)"
                        class="price-info"><span>¥</span>{{ item.price }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="empty-tips"
             v-if="goodsList.length==0">
          {{$t('shopFeature.goods.pleaseAddProd')}}
        </div>
      </div>
    </div>

    <div v-if="isShowEdit"
         class="design-editor-item design-hide-class">
      <div class="design-config-editor">
        <div class="design-editor-component-title">{{$t('shopFeature.allCanUse.goodsList')}}</div>
        <!--选择商品-->
        <div class="design-editor-component-container">
          <el-form ref="formData" :model="formData" label-position="left" class="goods-select-form">
            <el-form-item :label="$i18n.t('shopFeature.goods.prod')" class="goods-select-con">
              <div class="goods-select-list">
                <div v-for="(item,index) in formData.goods"
                    :key="index"
                    class="goods-select-item">
                  <!-- <div class="goods-select-item-img"
                      :class="{'goods-empty': !formData.goods[0].prodId}"
                      :style="{backgroundImage:'url('+(item.pic || defImg)+')'}"></div> -->
                  <el-image class="goods-select-item-img" :class="{'goods-empty': !formData.goods[0].prodId}"
                  :src="item.pic" fit="fill">
                      <div slot="error" class="image-slot">
                          <img src="@/assets/img/pc-micro-page/show-default.png" fit="fill">
                      </div>
                  </el-image>
                  <span class="close-item"
                        @click="formData.goods.splice(index,1)">x</span>
                </div>
                <div class="goods-select-item">
                  <div class="goods-select-item-img add-btn"
                      @click="selectProdHandle">
                      <i class="el-icon-plus"></i>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item :label="$i18n.t('shopFeature.goods.listStyle')">
              <el-radio-group v-model="formData.size">
                <el-radio v-for="(count, index) in lineSize" :label="count.value" :key="index">{{count.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$i18n.t('shopFeature.goods.showContent')" class="goods-show-container">
              <div class="goods-show-content">
                <el-checkbox-group v-model="formData.showContent">
                <el-checkbox v-for="(showItem, index) in goodsShowContent" :key="index" :label="showItem.value">{{showItem.label}}</el-checkbox>
              </el-checkbox-group>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <prods-select
      v-if="dialogChooseGoods"
      ref="ProdsSelect"
      @refreshSelectProds="chooseGoodsFun">
    </prods-select>
     <!-- 商品 | 页面 | 跳转链接弹窗 start -->
     <decorate-dialog-select
      :dialogVisible="dialogVisible"
      :deviceType="'mobile'"
      :isMulilt="true"
      :echoDataList="echoDataList"
      :currentSelectType="[1]"
      @handleClose="handleDialogClose"
      @handleDialogSubmit="handleDialogSubmit">
    </decorate-dialog-select>
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
  </div>
</template>
<script>
/**
 * 创建新组件之后，在all-can-use-components中添加
 * 必须应用 microCreateMinis
 * 数据必须以formData包含
 * */
import { microCreateMinis } from '../../minis'
import ProdsSelect from '@/components/prods-select'
import decorateDialogSelect from '@/components/decorateDialogSelect/index.vue'; // 选择商品
/** 商品组件 */
export default {
  name: 'micro-goods-box',
  mixins: [microCreateMinis],
  data () {
    return {
      commonCheckFieldRules: 'checkData', // 当前组件默认的规则判断函数
      dialogChooseGoods: false,
      isGetChooseData: false, // 是否该是获取选择的数据
      formData: {
        size: 2, // 一行多少个
        showContent: [1, 2, 3],
        goods: []
        // buy_btn_type: 1, // 购买按钮的样式
        // button_text: '马上抢'// 购买按钮的文本
      },
      // 商品显示内容
      goodsShowContent: [
        {
          value: 1,
          label: this.$i18n.t('shopFeature.goods.prodName')
        },
        {
          value: 2,
          label: this.$i18n.t('shopFeature.goods.prodDesc')
        },
        {
          value: 3,
          label: this.$i18n.t('shopFeature.goods.prodPrice')
        }],
      // 一行几个
      lineSize: [
        {
          value: 1,
          label: this.$i18n.t('shopFeature.goods.oneLineItem1')
        },
        {
          value: 2,
          label: this.$i18n.t('shopFeature.goods.oneLineItem2')
        },
        {
          value: 3,
          label: this.$i18n.t('shopFeature.goods.oneLineItem3')
        }
      ],
      // 获取的接口数据
      goodsList: [],
      // 默认数据
      demoGoods: [],
      dialogVisible: false, // 商品弹窗
      echoDataList: [], // 回显商品数据
    }
  },
  props: {
    current: {
      type: Number
    }
  },
  watch: {
    goodsList: {
      deep: true,
      handler (val) {
        if (val.length) {
          if (!this.goodsList.find(x => x.myGoodsType === 1)) {
            this.formData.goods = []
            val.map(res => {
              this.formData.goods.push(res.prodId)
            })
            this.goodsList.concat(val)
          } else {

          }
        } else {
          this.goodsList = this.demoGoods
        }
      }
    }
  },
  filters: {
    buy_btn_type (val) { // 标题
      let str = ''
      switch (val) {
        case 6:
          str = 'danger'
          break
        case 8:
          str = 'danger'
          break
      }
      return str
    }
  },
  components: {
    ProdsSelect,
    decorateDialogSelect
  },
  computed: {
    theme () {
      return this.$store.getters.theme
    }
  },
  mounted () {
    this.goodsList = [];
    for(let i = 0;i < 4;i++) {
      this.goodsList.push({
        prodId: '', // 商品id
        prodName: this.$i18n.t('shopFeature.goods.prodName'),
        price: '90', // 商品价格
        oriPrice: '90', //市场价
        pic: require('@/assets/img/micro-page/def.png'),
        brief: this.$i18n.t('shopFeature.goods.prodDesc'),
        myGoodsType: 1,
      })
    }
  },
  methods: {
    // 选择商品操作
    selectProdHandle () {
      this.dialogVisible = true;
      this.echoDataList = []; // 商品数据回显
      this.formData.goods.forEach(item => {
        this.echoDataList.push(item)
      })
    },
    // 选择商品回调
    chooseGoodsFun ($event) {
      if ($event) {
        if (this.goodsList.find(x => x.myGoodsType === 1)) {
          this.goodsList = []
        }
        $event.map(newGoodItem => {
          if (this.formData.goods.indexOf(newGoodItem.prodId) === -1) {
            this.goodsList.push(newGoodItem)
          }
        })
      }
      this.dialogChooseGoods = false
    },
    /** 批量获取商品详情 */
    getGoodsInfo (prodIds, prodType) {
      this.$http({
        url: this.$http.adornUrl('/search/renovationPage'),
        method: 'get',
        params: this.$http.adornParams({
          prodIds,
          prodType
        })
      }).then(({ data }) => {
        this.goodsList = this.sortList(data)
        this.goodsList.forEach(item => {
          if (!item.pic.includes('http')) {
            item.pic = process.env.VUE_APP_RESOURCES_URL + item.pic
          }
        })
      })
    },
    /**
     * 按照添加的顺序排序
     */
    sortList (goodsList) {
      let showArr = this.dataField.goods
      goodsList.forEach(item => {
        item.sortId = showArr.indexOf(item.prodId)
      })
      return goodsList.sort((a, b) => { return a.sortId - b.sortId })
    },
    // 关闭弹窗
    handleDialogClose() {
      this.dialogVisible = false;
    },
    // 商品确定
    handleDialogSubmit({ type, value }) {
      if(type === '1') {
        this.formData.goods = [];
        value.goodsItem.forEach(item => {
          this.formData.goods.push({
            prodId: item.prodId, // 商品id
            prodType: item.prodType, // 商品类型
            prodName: item.prodName, // 商品名称
            status: item.status, // 商品状态
            price: item.price, // 商品价格
            oriPrice: item.oriPrice, //商品市场价
            pic: item.pic, // 商品图片
            brief: item.brief, // 商品描述
          })
        })
      }
      this.dialogVisible = false;
    },
    /* 校验 */
    checkData () {
      if (this.formData.goods.length > 0) {
        this.myCheckResult(true)
      } else {
        this.$newMessage.error(this.$i18n.t('shopFeature.allCanUse.goodsList') + this.current + this.$i18n.t('shopFeature.goods.pleaseAddProd'))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
