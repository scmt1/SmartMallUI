<template>
    <div class="goods-list-container">
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.goodsList.listStyle`)}}</div>
            <div class="bottom-content">
                <div class="goods-list-style">
                    <div 
                      :class="{'style-items': true, 'active': goodsForm.listType === 3 }" 
                      @click="handleClick(3)">
                        <img 
                          v-show="goodsForm.listType != 3" 
                          src="@/assets/img/pc-micro-page/goods_list_three.png" 
                          alt="图片加载失败">
                        <img 
                          v-show="goodsForm.listType === 3" 
                          src="@/assets/img/pc-micro-page/goods_list_three_active.png" 
                          alt="图片加载失败">
                        <i v-show="goodsForm.listType === 3" class="el-icon-check"></i>
                    </div>
                    <div 
                      :class="{'style-items': true, 'active': goodsForm.listType === 4 }" 
                      @click="handleClick(4)">
                        <img 
                          v-show="goodsForm.listType != 4" 
                          src="@/assets/img/pc-micro-page/goods_list_four.png" 
                          alt="图片加载失败">
                        <img 
                          v-show="goodsForm.listType === 4" 
                          src="@/assets/img/pc-micro-page/goods_list_four_active.png" 
                          alt="图片加载失败">
                        <i v-show="goodsForm.listType === 4" class="el-icon-check"></i>
                    </div>
                    <div 
                      :class="{'style-items': true, 'active': goodsForm.listType === 5 }" 
                      @click="handleClick(5)">
                      <img 
                        v-show="goodsForm.listType != 5" 
                        src="@/assets/img/pc-micro-page/goods_list_five.png" 
                        alt="图片加载失败">
                      <img 
                        v-show="goodsForm.listType === 5" 
                        src="@/assets/img/pc-micro-page/goods_list_five_active.png" 
                        alt="图片加载失败">
                        <i v-show="goodsForm.listType === 5" class="el-icon-check"></i>
                    </div>
                </div>
               <el-radio-group v-model="goodsForm.listType" style="display: flex;margin-top: 15px;">
                   <el-radio :label="3" style="width: 33.3%;text-align: center">{{$t(`pcdecorate.goodsList.three`)}}</el-radio>
                   <el-radio :label="4" style="width: 33.3%;text-align: center">{{$t(`pcdecorate.goodsList.four`)}}</el-radio>
                   <el-radio :label="5" style="width: 33.3%;text-align: center">{{$t(`pcdecorate.goodsList.five`)}}</el-radio>
               </el-radio-group>
            </div>
        </div>
        <div class="config-items">
            <div class="title special-title">{{$t(`pcdecorate.goodsList.showContent`)}}</div>
            <div class="bottom-content">
                <el-checkbox-group v-model="goodsForm.showContent" style="display: flex;">
                    <el-checkbox label="0" style="width: 33.3%;text-align: center">{{$t(`pcdecorate.goodsList.goodsName`)}}</el-checkbox>
                    <el-checkbox label="1" style="width: 33.3%;text-align: center">{{$t(`pcdecorate.goodsList.goodsDescription`)}}</el-checkbox>
                    <el-checkbox label="2" style="width: 33.3%;text-align: center">{{$t(`pcdecorate.goodsList.goodsPrice`)}}</el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
        <div class="config-items">
            <div class="title special-title">{{$t(`pcdecorate.goodsList.goods`)}}</div>
            <select-goods-component
                :goodsList="goodsForm.goodsList"
                @handleAddClick="handleAddClick"
                @handleRemove="handleRemove">
            </select-goods-component>
        </div>
        <!-- 商品 | 页面 | 跳转链接弹窗 start -->
        <decorate-dialog-select
            :dialogVisible="dialogVisible"
            :currentSelectType="[1]"
            :isMulilt="true"
            :echoDataList="echoDataList"
            @handleClose="handleDialogClose"
            @handleDialogSubmit="handleDialogSubmit">
        </decorate-dialog-select>
        <!-- 商品 | 页面 | 跳转链接弹窗 end -->
    </div>
</template>
<script>
import selectGoodsComponent from '../../../../commonComponent/selectGoodsComponent/index.vue';
import decorateDialogSelect from '@/components/decorateDialogSelect/index.vue'; // 选择商品
export default {
    components: {
        selectGoodsComponent,
        decorateDialogSelect
    },
    props: {
        currentRef: { // 当前组件的Ref
            type: String,
            default: () => ''
        },
        currentItem: { // 点击当前组件回显信息配置
            type: Object,
            default: () => {}
        },
        editItem: { // 当前组件的配置信息
            type: Object,
            default: () => {}
        }
    },
    data() {
      return {
        goodsForm: {
          listType: 3,
          showContent: ['0', '1', '2'], // 显示内容
          goodsList: [], // 商品列表
        },
        dialogVisible: false, // 商品弹窗显示隐藏
        resourcesUrl: process.env.VUE_APP_RESOURCES_URL, // 服务地址
        echoDataList: [], // 回显商品数据
      }
    },
    methods: {
        // 点击列表样式
        handleClick(val) {
            this.goodsForm.listType = val;
        },
        // 添加商品
        handleAddClick() {
            this.dialogVisible = true;
            this.echoDataList = [];
            this.goodsForm.goodsList.forEach(item => {
              this.echoDataList.push(item);
            })
        },
        // 移除某个商品
        handleRemove(index) {
            this.goodsForm.goodsList.splice(index, 1);
        },
        // 商品弹窗关闭
        handleDialogClose() {
            this.dialogVisible = false;
        },
        // 商品弹窗确定
        handleDialogSubmit({type, value}) {
          if(type === '1') { // 表示当前选择的是商品
            this.goodsForm.goodsList = [];
            value.goodsItem.forEach(item => {
              this.goodsForm.goodsList.push({
                name: item.prodName, // 商品名称
                id: item.prodId, // 商品id
                prodType: item.prodType, // 商品状态类型
                orignPrice: item.oriPrice, // 商品原价
                status: item.status, // 商品状态
                price: item.price, // 商品价格
                imgs: item.pic, // 商品图片
                description: item.brief, // 商品描述
              })
            })
          }
          this.dialogVisible = false;
        },
        // 验证信息
        handleValidate() {
            let status = true;
            let message = '';
            if(JSON.stringify(this.editItem) === '{}') {
                status = false;
                message = this.$i18n.t('pcdecorate.goodsList.warning1');
            } else if(this.editItem.goodsList.length === 0) {
                status = false;
                message = this.$i18n.t('pcdecorate.goodsList.warning2');
            } else {
                status = true;
            }
            return {
                status: status,
                message: message
            };
        },
        // 提交信息
        handleSubmitMessage() {
            return this.goodsForm;
        }
    },
    watch: {
        goodsForm: { // 监听配置信息的改变
            handler(newVal, oldVal) {
                let obj = {
                    type: 'goods_list',
                    ref: this.currentRef,
                    config: newVal
                }
                this.$emit('handleUpdateMessage', obj);
            },
            deep: true
        },
        currentItem: { // 监听组件回显
            handler(newVal, oldVal) {
                if(newVal.currentConfigType === 'goods_list') {
                    if(JSON.stringify(newVal.config) != '{}') {
                        let obj = {...newVal.config};
                        this.goodsForm = obj;
                    } else {
                        this.goodsForm = {
                            listType: 3,
                            showContent: ['0', '1', '2'], // 显示内容
                            goodsList: [], // 商品列表
                        }
                    }
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.goods-list-container {
    .config-items {
        .title {
            color: #666;
            font-size: 14px;
            margin-bottom: 15px;
            font-family: Microsoft YaHei;
            &.special-title {
                margin-top: 20px;
            }
        }
        .bottom-content {
            .goods-list-style {
                display: flex;
                justify-content: space-between;
                .style-items {
                    width: 108px;
                    height: 70px;
                    border: 1px solid #EAEAF2;
                    border-radius: 2px;
                    padding: 6px;
                    cursor: pointer;
                    &.active {
                        border-color: #155BD4;
                        position: relative;
                        &::before {
                            content: '';
                            position: absolute;
                            width: 0px;
                            height: 0px;
                            border-top: 20px solid transparent;
                            border-right: 20px solid #155BD4;
                            bottom: 0;
                            right: 0;
                        }
                        .el-icon-check {
                            position: absolute;
                            color: #fff;
                            right: 0;
                            bottom: -1px;
                            font-size: 12px;
                            transform: scale(0.8);
                        }
                    }
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
}
</style>