<template>
    <div class="micro-goodsThree-box">
        <!-- 预览控制区 start -->
        <div class="design-preview-controller">
            <module-component :config="formData"></module-component>
        </div>
        <!-- 预览控制区 end -->
        <!-- 编辑工作区 start -->
        <div v-if="isShowEdit" class="design-editor-item design-hide-class">
            <div class="design-config-editor">
                <div class="design-editor-component-title">{{$t('pcdecorate.componentTitle.goodsModule3')}}</div>
                <div class="config-item">
                    <div class="title">{{$t('pcdecorate.goodsModule2.customTitle')}}</div>
                    <div class="bottom-config">
                        <el-input maxlength="8" v-model="formData.mainTitle"></el-input>
                    </div>
                </div>
                <div class="config-item">
                    <div class="title">{{$t('pcdecorate.goodsList.addgoods')}}</div>
                    <div class="bottom-config">
                        <select-goods-component
                            :goodsList="formData.goodsList"
                            @handleAddClick="handleAddClick"
                            @handleRemove="handleRemove">
                        </select-goods-component>
                    </div>
                </div>
            </div>
        </div>
        <!-- 编辑工作区 end -->
        <!-- 商品 | 页面 | 跳转链接弹窗 start -->
        <decorate-dialog-select
          :dialogVisible="dialogVisible"
          :currentSelectType="[1]"
          :isMulilt="true"
          :deviceType="'mobile'"
          :echoDataList="echoDataList"
          @handleClose="handleDialogClose"
          @handleDialogSubmit="handleDialogSubmit">
        </decorate-dialog-select>
        <!-- 商品 | 页面 | 跳转链接弹窗 end -->
    </div>
</template>
<script>
import { microCreateMinis } from '../../minis'
import selectGoodsComponent from '../../../../../decorate/create/commonComponent/selectGoodsComponent/index.vue'
import moduleComponent from './module.vue'
import decorateDialogSelect from '@/components/decorateDialogSelect/index.vue'
export default {
  components: {
    selectGoodsComponent,
    moduleComponent,
    decorateDialogSelect
  },
  mixins: [microCreateMinis],
  data () {
    return {
      formData: {
        mainTitle: this.$t('pcdecorate.goodsModule1.mainTitleCon'), // 自定义文字
        goodsList: []
      },
      dialogVisible: false, // 商品弹窗
      commonCheckFieldRules: 'checkData', // 当前组件默认的规则判断函数
      echoDataList: [] // 回显商品数据
    }
  },
  methods: {
        // 选择商品
    handleAddClick () {
      this.dialogVisible = true
      this.echoDataList = []
      this.formData.goodsList.forEach(item => {
        this.echoDataList.push(item)
      })
    },
        // 删除商品
    handleRemove (index) {
      this.formData.goodsList.splice(index, 1)
    },
        // 弹窗关闭
    handleDialogClose () {
      this.dialogVisible = false
    },
        // 弹窗确定
    handleDialogSubmit ({type, value}) {
      if (type === '1') { // 当前选择的是商品
        this.formData.goodsList = []
        value.goodsItem.forEach(item => {
          this.formData.goodsList.push({
            id: item.prodId, // 商品id
            name: item.prodName, // 商品名称
            prodType: item.prodType, // 商品类型
            price: item.price, // 价格
            status: item.status, // 商品状态
            imgs: item.pic, // 商品图片
            orignPrice: item.oriPrice, // 原始价
            description: item.brief // 商品描述
          })
        })
      }
      this.dialogVisible = false
    },
        // 校检
    checkData () {
      let isPass = true
      let err_message = ''
      if (this.formData.mainTitle === '') {
        isPass = false
        err_message = this.$t('pcdecorate.componentTitle.goodsModule3') + this.$t('shopFeature.goodsModule.goodsModuleTip1')
      } else if (this.formData.goodsList.length === 0) {
        isPass = false
        err_message = this.$t('pcdecorate.componentTitle.goodsModule2') + this.$t('shopFeature.goodsModule.goodsModuleTip6')
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