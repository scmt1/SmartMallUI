<template>
  <div class="micro-promotional-activities-box">
    <div class="design-preview-controller">
      <!-- 预览区域 -->
      <div class="active-goods-show">
        <div class="activet-tit-con">
          <span class="activet-tit">{{formData.activityType==1? $t('shopFeature.promotionalActivities.groupPurchase'):$t('shopFeature.promotionalActivities.spike')}}</span>
          <span class="view-more">{{$t('shopFeature.promotionalActivities.more')}}<i class="el-icon-arrow-right"
               v-if="formData.linkStyle!==1"></i></span>
        </div>
        
        <template v-if="formData.prodIds.length">
          <div class="active-goods-box" v-for="(item, index) in formData.prodIds" :key="index">
            <div class="img-box" :class="{empty: !formData.prodIds[0].prodName}">
              <!-- <img :src="item.pic" /> -->
              <el-image :src="item.pic">
                <img slot="error" src="~@/assets/img/def.png">
              </el-image>
              <!-- 下架商品蒙版 start -->
              <!-- 限时秒活动 -->
              <div class="imgs_shelves" v-if="setImgs(item, 'show')">
                <img class="been_imgs" :src="setImgs(item, 'src')" />
              </div>
              <!-- 下架商品蒙版 end -->
            </div>
            <div class="active-price-con">
              <span class="active-price">{{item.price}}</span>
              <span class="origin-price">{{item.oriPrice}}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="active-goods-box" v-for="(item, index) in goodsList" :key="index">
            <div class="img-box" :class="{empty: !goodsList[0].prodName}">
              <img :src="item.pic" />
            </div>
            <div class="active-price-con">
              <span class="active-price">{{item.price}}</span>
              <span class="origin-price">{{item.oriPrice}}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- 右侧编辑内容 -->
    <div class="design-editor-item design-hide-class"
         v-if="isShowEdit">
      <div class="design-config-editor">
        <div class="design-editor-component-title">{{$t('shopFeature.promotionalActivities.promotionalActivity')}}</div>
        <el-form ref="formData"
                 :model="formData"
                 label-position="left"
                 label-width="100px">
          <el-form-item :label="$i18n.t('shopFeature.promotionalActivities.activityType')">
            <el-radio-group v-model="formData.activityType" @change="handRadioChange">
              <el-radio :label="1">{{$t('shopFeature.promotionalActivities.groupPurchase')}}</el-radio>
              <el-radio :label="2">{{$t('shopFeature.promotionalActivities.spike')}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <!-- 已添加的商品列表 -->
      <div class="goods-list" v-if="formData.prodIds.length && !formData.prodIds[0].listType">
        <div class="goods-item" v-for="(item, index) in formData.prodIds"
            :key="index">
          <div class="goods-delete-btn" @click="formData.prodIds.splice(index,1)"><i class="el-icon-close"></i></div>
          <div class="img-box">
            <!-- <img class="goods-pic" :src="item.pic" alt=""> -->
            <el-image class="goods-pic" :src="item.pic">
              <img slot="error" src="~@/assets/img/def.png">
            </el-image>
            <div class="imgs_shelves" v-if="setImgs(item, 'show')">
              <img class="been_imgs" :src="setImgs(item, 'src')" />
            </div>
          </div>
          <div class="goods-info">
            <div class="goods-name">{{item.prodName}}</div>
            <div class="goods-decs">
              <span>{{$t('shopFeature.promotionalActivities.promotionPrice')}} <i style="font-weight:blod;color:red;font-style:normal">{{item.price}}</i> </span>
              <span style="text-decoration: line-through; color:#888;padding-left:10px;">{{item.oriPrice}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="p-add-btn" v-if="formData.prodIds.length<3" @click="addActivityProds">
        <i class="el-icon-plus" />
        {{$t('shopFeature.promotionalActivities.addActivityProds')}}
      </div>
      <div class="ad-edit-item-title">
        <span class="tips">{{$t('shopFeature.promotionalActivities.addActivityProdsTip')}}</span>
      </div>
    </div>
    <!-- 商品选择弹窗  -->
    <prods-select
      v-if="dialogChooseGoods"
      ref="ProdsSelect"
      :isSingle="false"
      :dataUrl="'/prod/prod/activityPage'"
      :prodType="formData.activityType"
      @refreshSelectProds="chooseGoodsFun"></prods-select>
    <!-- 活动商品失效提示 -->
    <el-dialog
      :title="$i18n.t('shopFeature.list.tips')"
      :visible.sync="showTipsDialog"
      width="30%">
      <span>{{$t('shopFeature.promotionalActivities.tipsContent')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showTipsDialog = false">{{$t('shopFeature.edit.cancel')}}</el-button>
        <el-button size="mini" type="primary" @click="tipsDialogConfirm">{{$t('shopFeature.edit.confirm')}}</el-button>
      </span>
    </el-dialog>
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialogVisible="dialogVisible"
      :deviceType="'mobile'"
      :isMulilt="true"
      :currentSelectType="[1]"
      :goodsNumber="3"
      :echoDataList="echoDataList"
      :dataUrl="'/admin/search/prod/renovationPage'"
      :prodType="formData.activityType"
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
import decorateDialogSelect from '@/components/decorateDialogSelect/index.vue'
/** 商品组件 */
export default {
  name: 'micro-promotional-activities-box',
  mixins: [microCreateMinis],
  data () {
    return {
      formData: {
        activityType: 1,  // 活动类型: 1团购  2秒杀
        prodIds: [] // 活动商品id
      },
      dialogChooseGoods: false, // 选择商品弹窗显隐
      // 获取的接口数据
      goodsList: [],
      // 默认数据
      demoGoods: [],
      commonCheckFieldRules: 'checkData', // 当前组件默认的规则判断函数
      showTipsDialog: false,
      // 有效的商品id数组
      validProdIds: [],
      dialogVisible: false, // 商品弹窗
      echoDataList: [] // 回显商品数据
    }
  },
  components: {
    ProdsSelect,
    decorateDialogSelect
  },
  props: {
    current: {
      type: Number
    }
  },
  computed: {
    // 活动商品下架或者结束
    setImgs () {
      return (item, val) => {
        let params = {
          status: false,
          imgs: require('@/assets/img/pc-micro-page/been_shelves.png')
        }
        if (this.formData.activityType === 2) { // 秒杀
          if (item.status != 1) { // 当前就显示下架图标
            params.imgs = require('@/assets/img/pc-micro-page/been_shelves.png')
            params.status = true
          } else if (item.status === 1 && item.prodType != 2) { // 显示结束图标
            params.imgs = require('@/assets/img/pc-micro-page/has_end.png')
            params.status = true
          } else {
            params.status = false
          }
        } else if (this.formData.activityType === 1) { // 拼团
          if (item.status != 1) { // 当前就显示下架图标
            params.imgs = require('@/assets/img/pc-micro-page/been_shelves.png')
            params.status = true
          } else if (item.status === 1 && item.prodType != 1) { // 显示结束图标
            params.imgs = require('@/assets/img/pc-micro-page/has_end.png')
            params.status = true
          } else {
            params.status = false
          }
        }

        if (val === 'show') {
          return params.status
        } else if (val === 'src') {
          return params.imgs
        }
      }
    }
  },
  mounted () {
    for (let i = 0; i < 3; i++) {
      this.demoGoods.push(
        {
          listType: 'demo',
          pic: require('@/assets/img/micro-page/def.png'),
          oriPrice: '999',
          price: '90'
        }
      )
    }
    if (!this.goodsList.length) {
      this.goodsList = this.demoGoods
    }
    if (Object.keys(this.dataField).length !== 0) {
      this.activityType = this.dataField.activityType
    }
    if (this.formData.prodIds.length) {
      // this.getGoodsInfo(this.formData.prodIds, this.activityType)
    }
    console.log(this.formData.prodIds)
  },
  watch: {
    'formData.activityType': {
      deep: true,
      handler: function (nv, ov) {
        if (nv !== ov) {
          this.goodsList = this.demoGoods
          // this.formData.prodIds = []
        }
      }
    },
    goodsList (nv) {
      if (!nv.length) {
        this.goodsList = this.demoGoods
        return
      }
      for (let i = 0; i < nv.length; i++) {
        const el = nv[i]
        if (el.listType) {
          break
        } else {
          if (this.formData.prodIds.indexOf(el.prodId) === -1) {
            this.formData.prodIds.push(el.prodId)
          }
        }
      }
    }
  },
  methods: {
    /**
     * 添加活动商品按钮
     */
    addActivityProds () {
      // activityType 活动类型: 1团购 2秒杀
      this.dialogVisible = true
      this.echoDataList = []
      this.formData.prodIds.forEach(item => {
        this.echoDataList.push(item)
      })
    },
    /**
     * 选择商品回调
     */
    chooseGoodsFun (selectedGoodsList) {
      if (selectedGoodsList) {
        if (this.goodsList[0].listType === 'demo') {
          this.goodsList = []
        }

        // 重置选择数据
        this.goodsList = []
        this.formData.prodIds = []
        selectedGoodsList.forEach(goodItem => {
          goodItem.pic = goodItem.pic.includes('https') ? goodItem.pic : process.env.VUE_APP_RESOURCES_URL + goodItem.pic
          if (this.formData.prodIds.indexOf(goodItem.prodId) === -1 && this.formData.prodIds.length < 5) {
            this.goodsList.push(goodItem)
            this.formData.prodIds.push(goodItem.prodId)
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
        let validProdIds = []
        data.forEach(el => {
          validProdIds.push(el.prodId)
          if (!el.pic.includes('http')) {
            el.pic = process.env.VUE_APP_RESOURCES_URL + el.pic
          }
        })
        this.goodsList = data

        if (prodIds.length > validProdIds.length) {
          this.validProdIds = validProdIds
          // this.showTipsDialog = true
          // 清除失效的活动商品
          this.formData.prodIds = this.validProdIds
          this.dontshowMessage = true
          this.handleActivityProdInvalid()
        }
      })
    },

    /**
     * 提示弹窗确定按钮: 刷新活动商品数据
     */
    tipsDialogConfirm () {
      this.formData.prodIds = this.validProdIds
      this.handleActivityProdInvalid()
      this.showTipsDialog = false
    },
    // 关闭弹窗
    handleDialogClose () {
      this.dialogVisible = false
    },
    // 弹窗确定
    handleDialogSubmit ({ type, value }) {
      if (type === '1') {
        let selectList = value.goodsItem.slice(0, 3)
        this.formData.prodIds = selectList
        // selectList.forEach(item => {
        //   this.formData.prodIds.push({
        //     prodId: item.prodId, // 商品id
        //     prodName: item.prodName, // 商品名称
        //     prodType: item.prodType, // 活动类型
        //     price: item.price, // 商品价格
        //     status: item.status, // 商品状态
        //     oriPrice: item.oriPrice == null ? '' : item.oriPrice, // 活动价格
        //     pic: item.pic, // 商品图片
        //     brief: item.brief // 商品描述
        //   })
        // })
      }
      this.dialogVisible = false
    },
    /**
     * 开始验证
     */
    checkData () {
      if (this.formData.prodIds.length > 0) {
        this.myCheckResult(true)
      } else {
        this.$newMessage.error(this.$i18n.t('shopFeature.allCanUse.activities') + this.current + this.$i18n.t('shopFeature.promotionalActivities.addProd'))
      }
    },
    handRadioChange () {
      this.formData.prodIds = []
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
