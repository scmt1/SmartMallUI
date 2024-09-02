<template>
    <div class="micro-goodsOne-box">
        <!-- 预览控制区 start -->
        <div class="design-preview-controller">
            <div class="left-items">
                <module-component :config="formData.leftConfig"></module-component>
            </div>
            <div class="right-items">
                <module-component :config="formData.rightConfig"></module-component>
            </div>
        </div>
        <!-- 预览控制区 end -->
        <!-- 编辑工作区 start -->
        <div v-if="isShowEdit" class="design-editor-item design-hide-class">
            <div class="design-config-editor">
                <div class="design-editor-component-title">{{$t('pcdecorate.componentTitle.goodsModule1')}}</div>
                <div class="config-item">
                    <div class="title">{{$t('shopFeature.goodsModule.subTitTwo')}}</div>
                    <div class="bottom-edit">
                        <template v-for="(item, index) in selectArr">
                            <div 
                                :class="{'edit-item': true, 'active': item.value === currentActive}" 
                                :key="index"
                                @click="handleSelect(index)">
                            </div>
                        </template>
                    </div>
                </div>
                <div v-show="currentActive === 0">
                    <div class="config-item">
                        <div class="title">{{$t('pcdecorate.floorTitle.mainTitleLabel')}}</div>
                        <div class="bottom-config">
                            <el-input v-model.trim="formData.leftConfig.mainTitle"></el-input>
                        </div>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('pcdecorate.floorTitle.subTitleLabel')}}</div>
                        <div class="bottom-config">
                            <el-input v-model.trim="formData.leftConfig.subTitle"></el-input>
                        </div>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('pcdecorate.storeList.mainTileColor')}}</div>
                        <div class="bottom-config">
                            <pick-color-component
                                :defineColor="formData.leftConfig.mainTitleColor" 
                                @handleChangeColor="handleleftTitleColor">
                            </pick-color-component>
                        </div>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('pcdecorate.storeList.subTitleColor')}}</div>
                        <div class="bottom-config">
                            <pick-color-component
                                :defineColor="formData.leftConfig.subTitleColor" 
                                @handleChangeColor="handleleftSubTitleColor">
                            </pick-color-component>
                        </div>
                    </div>
                    <div class="config-item special-item">
                        <div class="title">{{$t('pcdecorate.storeList.titleSize')}}</div>
                        <el-slider 
                            :min="12" 
                            :max="40" 
                            v-model="formData.leftConfig.mainTitleSize" 
                            show-input></el-slider>
                    </div>
                    <div class="config-item special-item">
                        <div class="title">{{$t('pcdecorate.storeList.subTitleSize')}}</div>
                        <el-slider 
                            :min="12" 
                            :max="40" 
                            v-model="formData.leftConfig.subTitleSize" 
                            show-input></el-slider>
                    </div>
                    <div class="config-item">
                        <div class="title">添加商品(最多添加2个)</div>
                        <div class="bottom-config">
                            <select-goods-component
                                :goodsList="formData.leftConfig.goodsList"
                                :addLength="addLength"
                                @handleAddClick="handleLeftAddClick"
                                @handleRemove="handleLeftRemove">
                            </select-goods-component>
                        </div>
                    </div>
                </div>
                <div v-show="currentActive === 1">
                    <div class="config-item">
                        <div class="title">{{$t('pcdecorate.floorTitle.mainTitleLabel')}}</div>
                        <div class="bottom-config">
                            <el-input v-model.trim="formData.rightConfig.mainTitle"></el-input>
                        </div>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('pcdecorate.floorTitle.subTitleLabel')}}</div>
                        <div class="bottom-config">
                            <el-input v-model.trim="formData.rightConfig.subTitle"></el-input>
                        </div>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('pcdecorate.floorTitle.mainTitleLabel')}}</div>
                        <div class="bottom-config">
                            <pick-color-component
                                :defineColor="formData.rightConfig.mainTitleColor" 
                                @handleChangeColor="handleRightTitleColor">
                            </pick-color-component>
                        </div>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('pcdecorate.floorTitle.subTitleLabel')}}</div>
                        <div class="bottom-config">
                            <pick-color-component
                                :defineColor="formData.rightConfig.subTitleColor" 
                                @handleChangeColor="handleRightSubTitleColor">
                            </pick-color-component>
                        </div>
                    </div>
                    <div class="config-item special-item">
                        <div class="title">{{$t('pcdecorate.storeList.titleSize')}}</div>
                        <el-slider 
                            :min="12" 
                            :max="40" 
                            v-model="formData.rightConfig.mainTitleSize" 
                            show-input></el-slider>
                    </div>
                    <div class="config-item special-item">
                        <div class="title">{{$t('pcdecorate.storeList.subTitleSize')}}</div>
                        <el-slider 
                            :min="12" 
                            :max="40" 
                            v-model="formData.rightConfig.subTitleSize" 
                            show-input></el-slider>
                    </div>
                    <div class="config-item">
                        <div class="title">{{$t('pcdecorate.goodsList.addgoods')}}({{$t('shopFeature.goodsModule.maxAdd')}}2{{$t('shopProcess.piece')}})</div>
                        <div class="bottom-config">
                            <select-goods-component
                                :goodsList="formData.rightConfig.goodsList"
                                :addLength="addLength"
                                @handleAddClick="handleRightAddClick"
                                @handleRemove="handleRightRemove">
                            </select-goods-component>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 编辑工作区 end -->
        <!-- 商品 | 页面 | 跳转链接弹窗 start -->
        <decorate-dialog-select
          :dialogVisible="dialogVisible"
          :deviceType="'mobile'"
          :isMulilt="true"
          :goodsNumber="goodsNumber"
          :currentSelectType="[1]"
          :echoDataList="echoDataList"
          @handleClose="handleDialogClose"
          @handleDialogSubmit="handleDialogSubmit">
        </decorate-dialog-select>
        <!-- 商品 | 页面 | 跳转链接弹窗 end -->
    </div>
</template>
<script>
import { microCreateMinis } from '../../minis'
import pickColorComponent from '../../../../../decorate/create/commonComponent/pickColor/index.vue'
import selectGoodsComponent from '../../../../../decorate/create/commonComponent/selectGoodsComponent/index.vue'
import moduleComponent from './module.vue'
import decorateDialogSelect from '@/components/decorateDialogSelect/index.vue'
export default {
  components: {
    pickColorComponent,
    selectGoodsComponent,
    moduleComponent,
    decorateDialogSelect
  },
  mixins: [microCreateMinis],
  watch: {
    'formData.leftConfig': {
      deep: true,
      handler: function (nv) {
        let lheight = nv.mainTitleSize + nv.subTitleSize
        let rheight = this.formData.rightConfig.mainTitleSize + this.formData.rightConfig.subTitleSize
        this.formData.rightConfig.titleHeight = Math.max(lheight, rheight)
        this.formData.leftConfig.titleHeight = Math.max(lheight, rheight)
      }
    },
    'formData.rightConfig': {
      deep: true,
      handler: function (nv) {
        let lheight = this.formData.leftConfig.mainTitleSize + this.formData.leftConfig.subTitleSize
        let rheight = nv.mainTitleSize + nv.subTitleSize
        this.formData.rightConfig.titleHeight = Math.max(lheight, rheight)
        this.formData.leftConfig.titleHeight = Math.max(lheight, rheight)
      }
    }
  },
  data () {
    return {
      commonCheckFieldRules: 'checkData', // 当前组件默认的规则判断函数
      currentActive: 0, // 当前激活的是哪个
      selectArr: [
                { value: 0},
                { value: 1}
      ],
      addLength: 2,
      formData: {
        leftConfig: {
          mainTitle: this.$t('shopFeature.goodsModule.conOne1'), // 主标题文字
          subTitle: this.$t('shopFeature.goodsModule.conOne2'), // 副标题文字
          mainTitleColor: 'rgba(51, 51, 51, 1)', // 主标题颜色
          subTitleColor: 'rgba(230, 67, 45, 1)', // 副标题颜色
          mainTitleSize: 15, // 主标题字号
          subTitleSize: 12, // 副标题字号
          titleHeight: 27, // 标题高度
          goodsList: [] // 商品
        },
        rightConfig: {
          mainTitle: this.$t('shopFeature.goodsModule.conOne3'), // 主标题文字
          subTitle: this.$t('shopFeature.goodsModule.conOne4'), // 副标题文字
          mainTitleColor: 'rgba(51, 51, 51, 1)', // 主标题颜色
          subTitleColor: 'rgba(255, 177, 68, 1)', // 副标题颜色
          mainTitleSize: 15, // 主标题字号
          subTitleSize: 12, // 副标题字号
          titleHeight: 27, // 标题高度
          goodsList: [] // 商品
        }
      },
      dialogVisible: false, // 弹窗是否显示
      goodsNumber: 2, // 限制选择商品的个数
      echoDataList: [] // 回显商品数据

    }
  },
  methods: {
        // 选中哪个
    handleSelect (index) {
      this.currentActive = index
    },
        // 关闭商品弹窗
    handleDialogClose () {
      this.dialogVisible = false
    },
        // 商品确定
    handleDialogSubmit ({type, value}) {
      if (type === '1') {
        if (this.currentActive === 0) { // 左边配置商品
          this.formData.leftConfig.goodsList = []
          value.goodsItem.forEach(item => {
            this.formData.leftConfig.goodsList.push({
              id: item.prodId, // 商品id
              name: item.prodName, // 商品名称
              prodType: item.prodType, // 商品类型
              price: item.price, // 商品价格
              status: item.status, // 商品状态
              imgs: item.pic, // 商品图片
              orignPrice: item.oriPrice // 原价
            })
          })
        } else if (this.currentActive === 1) { // 右边配置商品
          this.formData.rightConfig.goodsList = []
          value.goodsItem.forEach(item => {
            this.formData.rightConfig.goodsList.push({
              id: item.prodId, // 商品id
              name: item.prodName, // 商品名称
              prodType: item.prodType, // 商品类型
              price: item.price, // 商品价格
              status: item.status, // 商品状态
              imgs: item.pic, // 商品图片
              orignPrice: item.oriPrice // 原价
            })
          })
        }
      }
      this.dialogVisible = false
    },
        // 左边的配置信息
        // 选中主标题文字的颜色
    handleleftTitleColor (color) {
      this.formData.leftConfig.mainTitleColor = color
    },
        // 选中副标题文字颜色
    handleleftSubTitleColor (color) {
      this.formData.leftConfig.subTitleColor = color
    },
        // 选择商品
    handleLeftAddClick () {
      this.dialogVisible = true
      this.goodsNumber = 2 // 限制选择两个
      this.echoDataList = []
      this.formData.leftConfig.goodsList.forEach(item => {
        this.echoDataList.push(item)
      })
    },
        // 删除商品
    handleLeftRemove (index) {
      this.formData.leftConfig.goodsList.splice(index, 1)
    },
        // 右边配置信息
        // 标题文字颜色
    handleRightTitleColor (color) {
      this.formData.rightConfig.mainTitleColor = color
    },
        // 副标题文字颜色
    handleRightSubTitleColor (color) {
      this.formData.rightConfig.subTitleColor = color
    },
        // 选择商品
    handleRightAddClick () {
      this.dialogVisible = true
      this.echoDataList = []
      this.formData.rightConfig.goodsList.forEach(item => {
        this.echoDataList.push(item)
      })
    },
        // 删除商品
    handleRightRemove (index) {
      this.formData.rightConfig.goodsList.splice(index, 1)
    },
        // 校检
    checkData () {
      let isPass = true
      let err_message = ''
      if (this.formData.leftConfig.mainTitle === '') {
        isPass = false
        err_message = this.$t('pcdecorate.componentTitle.goodsModule1') + this.$t('shopFeature.goodsModule.goodsModuleTip7')
      } else if (this.formData.leftConfig.subTitle === '') {
        isPass = false
        err_message = this.$t('pcdecorate.componentTitle.goodsModule1') + this.$t('shopFeature.goodsModule.goodsModuleTip8')
      } else if (this.formData.leftConfig.goodsList.length === 0) {
        isPass = false
        err_message = this.$t('pcdecorate.componentTitle.goodsModule1') + this.$t('shopFeature.goodsModule.goodsModuleTip6')
      } else if (this.formData.rightConfig.mainTitle === '') {
        isPass = false
        err_message = this.$t('pcdecorate.componentTitle.goodsModule1') + this.$t('shopFeature.goodsModule.goodsModuleTip7')
      } else if (this.formData.rightConfig.subTitle === '') {
        isPass = false
        err_message = this.$t('pcdecorate.componentTitle.goodsModule1') + this.$t('shopFeature.goodsModule.goodsModuleTip8')
      } else if (this.formData.rightConfig.goodsList.length === 0) {
        isPass = false
        err_message = this.$t('pcdecorate.componentTitle.goodsModule1') + this.$t('shopFeature.goodsModule.goodsModuleTip6')
      } else {
        isPass = true
        err_message = ''
      }
      if (isPass) {
        this.myCheckResult(isPass)
      } else {
        this.$newMessage.error(err_message)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
<style lang="scss">
.config-item {
  .bottom-config .el-input__inner {
        height: 28px;
    }
}
</style>