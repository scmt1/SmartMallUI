<template>
    <div class="store-config-content">
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.storeList.showSubTitle`)}}</div>
            <div class="right-select">
                <el-radio-group v-model="storeConfigForm.showSubTitle">
                    <el-radio :label="0">{{$t(`pcdecorate.storeList.show`)}}</el-radio>
                    <el-radio :label="1">{{$t(`pcdecorate.storeList.hide`)}}</el-radio>
                </el-radio-group>
            </div>
            <el-input class="subtitle-input" v-model="storeConfigForm.subTitle"></el-input>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.storeList.mainTileColor`)}}</div>
            <pick-color-component
                :defineColor="storeConfigForm.mainTextColor" 
                @handleChangeColor="handleMainTitleColor"></pick-color-component>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.storeList.subTitleColor`)}}</div>
            <pick-color-component
                :defineColor="storeConfigForm.subTextColor" 
                @handleChangeColor="handleSubTitleColor"></pick-color-component>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.storeList.titleBgColor`)}}</div>
            <pick-color-component
                :defineColor="storeConfigForm.bgColor"
                @handleChangeColor="handleBgColor"></pick-color-component>
        </div>
        <div class="config-items">
            <div class="items-content slider-content">
                <div class="title">{{$t(`pcdecorate.storeList.titleSize`)}}</div>
                <div class="right-content">
                    <el-slider :min="0" :max="100" v-model="storeConfigForm.mainFontSize" show-input></el-slider>
                </div>
            </div>
        </div>
        <div class="config-items">
            <div class="items-content slider-content">
                <div class="title">{{$t(`pcdecorate.storeList.subTitleSize`)}}</div>
                <div class="right-content">
                    <el-slider :min="0" :max="100" v-model="storeConfigForm.subFontSize" show-input></el-slider>
                </div>
            </div>
        </div>
        <div class="config-items">
            <div class="items-content slider-content">
                <div class="title">{{$t(`pcdecorate.storeList.marginTop`)}}</div>
                <div class="right-content">
                    <el-slider :min="0" :max="100" v-model="storeConfigForm.marginTop" show-input></el-slider>
                </div>
            </div>
        </div>
        <div class="config-items">
            <div class="items-content slider-content">
                <div class="title">{{$t(`pcdecorate.storeList.marginBottom`)}}</div>
                <div class="right-content">
                    <el-slider :min="0" :max="100" v-model="storeConfigForm.marginBottom" show-input></el-slider>
                </div>
            </div>
        </div>
        <div class="config-items">
            <div class="title">{{$t(`pcdecorate.storeList.addStore`)}}</div>
            <!-- 选择店铺 start -->
            <select-goods-component
                :goodsList="storeConfigForm.storeList"
                @handleAddClick="handleAddClick"
                @handleRemove="handleRemove">
            </select-goods-component>
            <!-- 选择店铺 end -->
        </div>
        <!-- 商品 | 页面 | 店铺 | 跳转链接弹窗 start -->
        <!-- <dialog-message
            :dialogVisible="dialogVisible"
            :currentSelectType="[3]"
            @handleClose="handleDialogClose"
            @handleDialogSubmit="handleDialogSubmit"></dialog-message> -->
        <!-- 商品 | 页面 | 店铺 | 跳转链接弹窗 end -->
    </div>
</template>
<script>
import selectGoodsComponent from '../../../../commonComponent/selectGoodsComponent/index.vue'; // 选择商品组件
import pickColorComponent from '../../../../commonComponent/pickColor/index.vue'; // 颜色选择器
import { bigNumberTransform } from '@/utils/index.js';
export default {
    components: {
        selectGoodsComponent,
        pickColorComponent,
    },
    props: {
        currentRef: { // 当前组件的ref
            type: String,
            default: () => ''
        },
        currentItem: { // 点击当前组件的显示配置信息
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
            storeConfigForm: {
                showSubTitle: 0, // 是否显示副标题
                subTitle: '', // 副标题文字
                mainTextColor: 'rgba(51, 51, 51, 1)', // 主标题文字颜色
                subTextColor: 'rgba(153, 153, 153, 1)', // 副标题文字颜色
                bgColor: '', // 标题的背景颜色
                mainFontSize: 16, // 主标题文字大小
                subFontSize: 12, // 副标题文字大小
                marginTop: 0, // 上边距
                marginBottom: 0, // 下边距
                storeList: [], // 店铺信息
            },
            dialogVisible: false, // 弹窗是否显示
        }
    },
    methods: {
        // 标题的文字颜色
        handleMainTitleColor(color) {
            this.storeConfigForm.mainTextColor = color;
        },
        // 副标题文字颜色
        handleSubTitleColor(color) {
            this.storeConfigForm.subTextColor = color;
        },
        // 标题背景色
        handleBgColor(color) {
            this.storeConfigForm.bgColor = color;
        },
        // 添加店铺
        handleAddClick() {
            this.dialogVisible = true;
        },
        // 删除店铺
        handleRemove(index) {
            this.storeConfigForm.storeList.splice(index, 1);
        },
        // 弹窗关闭
        handleDialogClose() {
            this.dialogVisible = false;
        },
        // 弹窗确定
        handleDialogSubmit({type, value}) {
            if(type === '3') { // 当前选择的是店铺
                this.storeConfigForm.storeList.push({
                    shopId: value.storeItem.shopId, // 店铺id
                    shoplogo: value.storeItem.shopLogo, // 店铺logo
                    imgs: value.storeItem.shopLogo, // 店铺logo
                    shopName: value.storeItem.shopName, // 店铺名称
                    shopFocusNumber: value.storeItem.fansCount === null ? 0 : bigNumberTransform(value.storeItem.fansCount), // 店铺关注人数
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
                message = this.$i18n.t('pcdecorate.storeList.warning1');
            } else if(this.editItem.showSubTitle == 0 && this.editItem.subTitle === '') {
                status = false;
                message = this.$i18n.t('pcdecorate.storeList.warning2');
            } else if(this.editItem.storeList.length === 0) {
                status = false;
                message = this.$i18n.t('pcdecorate.storeList.warning3');
            } else {
                status = true;
            }
            // if(this.storeConfigForm.showSubTitle === 0 && this.storeConfigForm.subTitle === '') {
            //     status = false;
            //     message = '店铺列表副标题不能为空！';
            // } else if(this.storeConfigForm.storeList.length === 0) {
            //     status =  false;
            //     message = '店铺列表店铺不能为空！';
            // } else {
            //     status =  true;
            // }
            return {
                status: status,
                message: message
            };
        },
        // 提交信息
        handleSubmitMessage() {
            return this.storeConfigForm;
        }
    },
    watch: {
        storeConfigForm: { // 监听
            handler(newVal, oldVal) {
                let obj = {
                    type: 'store_list',
                    ref: this.currentRef,
                    config: newVal
                }
                this.$emit('handleUpdateMessage', obj);
            },
            deep: true
        },
        currentItem: { // 监听组件回显
            handler(newVal, oldVal) {
                if(newVal.currentConfigType === 'store_list') {
                    console.log('店铺列表', newVal)
                    if(JSON.stringify(newVal.config) != '{}') {
                        let obj = {...newVal.config};
                        this.storeConfigForm = obj;
                    }
                }
                
            },
            deep: true
        }
    }
}
</script>
<style lang="scss" scoped>
.store-config-content {
    .config-items {
        width: 100%;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
        .title {
            display: flex;
            margin-bottom: 20px;
            align-items: center;
            position: relative;
        }
        .right-select {
            margin: 0 0 20px 0;
            width: 100%;
        }
        .items-content {
            display: flex;
            align-items: center;
            overflow: hidden;
            .title {
                width: 90px;
                height: 100%;
                display: flex;
                align-items: center;
                padding-top: 15px;
            }
            .right-content {
                width: 100%;
                padding-bottom: 3px;
            }
        }
    }
}
</style>
<style lang="scss">
.store-config-content {
    .subtitle-input {
        .el-input__inner {
            height: 28px;
        }
    }
}
</style>