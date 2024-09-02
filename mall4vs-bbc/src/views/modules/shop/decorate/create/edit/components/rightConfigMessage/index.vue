<template>
    <div class="right-config-container">
        <div class="title">{{$t(`pcdecorate.componentTitle.${configMessage.currentConfigTitle}`)}}
          <i class="el-icon-close" @click="closeRightConfigContainer"></i>
        </div>
        <div class="title-border"></div>
        <div class="show-components">
            <div v-for="(item, index) in currentUseComponents" :key="index">
                <!-- 图片轮播配置信息 start -->
                <template v-if="item.type === 'picture_by'">
                  <picture-shuffling-tool
                    v-show="configMessage.Ref === item.Ref+index"
                    :ref="item.Ref+index"
                    :currentRef="configMessage.Ref"
                    :currentItem="configMessage"
                    :editItem="item.rightConfigMessage"
                    @handleUpdateMessage="handleUpdateMessage" />
                </template>
                <!-- 图片轮播配置信息 end -->
                <!-- 辅助间隔配置信息 start -->
                <template v-if="item.type === 'auxiliary_interval'">
                  <interval-component-tool
                    v-show="configMessage.Ref === item.Ref+index"
                    :ref="item.Ref+index"
                    :currentRef="configMessage.Ref"
                    :currentItem="configMessage"
                    :editItem="item.rightConfigMessage"
                    @handleUpdateMessage="handleUpdateMessage" />
                </template>
                <!-- 辅助间隔配置信息 end -->
                <!-- 楼层标题配置信息 start -->
                <template v-if="item.type === 'floor_title'">
                  <floor-title-component-tool 
                    v-show="configMessage.Ref === item.Ref+index"
                    :ref="item.Ref+index"
                    :currentRef="configMessage.Ref"
                    :currentItem="configMessage"
                    :editItem="item.rightConfigMessage"
                    @handleUpdateMessage="handleUpdateMessage" />
                </template>
                <!-- 楼层标题配置信息 end -->
                <!-- 商品列表配置信息 start -->
                <template v-if="item.type === 'goods_list'">
                  <good-list-component-tool
                    v-show="configMessage.Ref === item.Ref+index" 
                    :ref="item.Ref+index"
                    :currentRef="configMessage.Ref"
                    :currentItem="configMessage"
                    :editItem="item.rightConfigMessage"
                    @handleUpdateMessage="handleUpdateMessage" />
                </template>
                <!-- 商品列表配置信息 end -->
                 <!-- 万能热区配置信息 start -->
                <template v-if="item.type === 'universal_hotspot'">
                  <hot-spot-component-tool
                    v-show="configMessage.Ref === item.Ref+index" 
                    :ref="item.Ref+index"
                    :currentRef="configMessage.Ref"
                    :currentItem="configMessage"
                    :editItem="item.rightConfigMessage"
                    @handleUpdateMessage="handleUpdateMessage"  />
                </template>
                <!-- 万能热区配置信息 end -->
                <!-- 店铺列表配置信息 start -->
                <template v-if="item.type === 'store_list'">
                  <store-list-component-tool
                    v-show="configMessage.Ref === item.Ref+index"
                    :ref="item.Ref+index"
                    :currentRef="configMessage.Ref"
                    :currentItem="configMessage"
                    :editItem="item.rightConfigMessage"
                    @handleUpdateMessage="handleUpdateMessage" />
                </template>
                <!-- 店铺列表配置信息 end -->
                <!-- 限时秒杀配置信息 start -->
                <template v-if="item.type === 'limited_skill'">
                  <limited-skill-component-tool 
                    v-show="configMessage.Ref === item.Ref+index"
                    :ref="item.Ref+index"
                    :currentRef="configMessage.Ref"
                    :currentItem="configMessage"
                    :editItem="item.rightConfigMessage"
                    @handleUpdateMessage="handleUpdateMessage" />
                </template>
                <!-- 限时秒杀配置信息 end -->
                <!-- 优惠团购配置信息 start -->
                <template v-if="item.type === 'discount_coupon'">
                  <discount-coupon-component-tool
                    v-show="configMessage.Ref === item.Ref+index"
                    :ref="item.Ref+index"
                    :currentRef="configMessage.Ref"
                    :currentItem="configMessage"
                    :editItem="item.rightConfigMessage"
                    @handleUpdateMessage="handleUpdateMessage"  />
                </template>
                <!-- 优惠团购配置信息 end -->
                <!-- 商品模块1配置信息 start -->
                <template v-if="item.type === 'goods_module1'">
                  <goods-module-component-one-tool
                    v-show="configMessage.Ref === item.Ref+index"
                    :ref="item.Ref+index"
                    :currentRef="configMessage.Ref"
                    :currentItem="configMessage"
                    :editItem="item.rightConfigMessage"
                    @handleUpdateMessage="handleUpdateMessage"  />
                </template>
                <!-- 商品模块1配置信息 end -->
                <!-- 商品模块2配置信息 start -->
                <template v-if="item.type === 'goods_module2'">
                  <goods-module-component-two-tool
                    v-show="configMessage.Ref === item.Ref+index"
                    :ref="item.Ref+index" 
                    :currentRef="configMessage.Ref"
                    :currentItem="configMessage"
                    :editItem="item.rightConfigMessage"
                    @handleUpdateMessage="handleUpdateMessage" />
                </template>
                <!-- 商品模块2配置信息 end -->
                <!-- 商品模块3配置信息 start -->
                <template v-if="item.type === 'goods_module3'">
                  <goods-module-component-three-tool
                    v-show="configMessage.Ref === item.Ref+index"
                    :ref="item.Ref+index" 
                    :currentRef="configMessage.Ref"
                    :currentItem="configMessage"
                    :editItem="item.rightConfigMessage"
                    @handleUpdateMessage="handleUpdateMessage" />
                </template>
                <!-- 商品模块3配置信息 end -->
                <!-- 商品模块4配置信息 start -->
                <template v-if="item.type === 'goods_module4'">
                  <goods-module-component-four-tool
                    v-show="configMessage.Ref === item.Ref+index" 
                    :ref="item.Ref+index" 
                    :currentRef="configMessage.Ref"
                    :currentItem="configMessage"
                    :editItem="item.rightConfigMessage"
                    @handleUpdateMessage="handleUpdateMessage" />
                </template>
                <!-- 商品模块4配置信息 end -->
                <!-- 商品模块5配置信息 start -->
                <template v-if="item.type === 'goods_module5'">
                  <goods-module-component-five-tool
                    v-show="configMessage.Ref === item.Ref+index"
                    :ref="item.Ref+index" 
                    :currentRef="configMessage.Ref"
                    :currentItem="configMessage"
                    :editItem="item.rightConfigMessage"
                    @handleUpdateMessage="handleUpdateMessage" />
                </template>
                <!-- 商品模块5配置信息 end -->
            </div>
        </div>
    </div>
</template>
<script>
// 基础组件配置信息
import storeSignateTool from '../basicComponent/storeSignate/rightTool.vue'; // 商家招牌配置信息组件
import pictureShufflingTool from '../basicComponent/pictureShuffling/rightTool.vue'; // 图片轮播配置信息组件
import intervalComponentTool from  '../basicComponent/intervalComponent/rightTool.vue'; // 辅助间隔配置组件
import floorTitleComponentTool from  '../basicComponent/floorTitleComponent/rightTool.vue'; // 楼层标题配置组件
import goodListComponentTool from '../basicComponent/goodListComponent/rightTool.vue'; // 商品列表配置组件
import hotSpotComponentTool from '../basicComponent/hotSpotComponent/rightTool.vue'; // 万能热区配置组件
import storeListComponentTool from '../basicComponent/storeListComponent/rightTool.vue'; // 店铺列表配置组件
// 营销活动配置信息
import limitedSkillComponentTool from '../marketingActivities/limitedSkillComponent/rightTool.vue'; // 限时秒杀配置组件
import discountCouponComponentTool from '../marketingActivities/discountCouponComponent/rightTool.vue'; // 优惠团购配置组件
// 扩展组件配置信息
import goodsModuleComponentOneTool from '../extendComponent/goodsModuleComponentOne/rightTool.vue'; // 商品模块1配置组件
import goodsModuleComponentTwoTool from '../extendComponent/goodsModuleComponentTwo/rightTool.vue'; // 商品模块2配置组件
import goodsModuleComponentThreeTool from '../extendComponent/goodsModuleComponentThree/rightTool.vue'; // 商品模块3配置组件
import goodsModuleComponentFourTool from '../extendComponent/goodsModuleComponentFour/rightTool.vue'; // 商品模块4配置组件
import goodsModuleComponentFiveTool from '../extendComponent/goodsModuleComponentFive/rightTool.vue'; // 商品模块5配置组件
export default {
    props: {
        configMessage: { // 配置信息
            type: Object,
            default: () => {}
        },
        currentUseComponents: { // 当前页面编辑的所有组件
            type: Array,
            default: () => []
        },
        operationType: { // 当前的操作类型
            type: String,
            default: () => ""
        }
    },
    components: {
        storeSignateTool,
        pictureShufflingTool,
        intervalComponentTool,
        floorTitleComponentTool,
        goodListComponentTool,
        hotSpotComponentTool,
        storeListComponentTool,
        limitedSkillComponentTool,
        discountCouponComponentTool,
        goodsModuleComponentOneTool,
        goodsModuleComponentTwoTool,
        goodsModuleComponentThreeTool,
        goodsModuleComponentFourTool,
        goodsModuleComponentFiveTool,
    },
    data() {
      return {}
    },
    methods: {
      // 关闭工具配置栏
      closeRightConfigContainer() {
        this.$emit('closeRightConfigContainer')
      },
      // 验证各个组件
      handleChangeValidate() {
        // 根据配置的组件，对每个组件进行验证
        let arr = [];
        this.currentUseComponents.forEach((item,index) => {
          if(this.$refs[item.Ref+index]) {
            arr.push(this.$refs[item.Ref+index][0].handleValidate())
          }
        })
        return arr;
      },
      // 同步有边编辑的数据
      handleUpdateMessage(obj) {
        this.$emit('handleUpdateMessage', obj)
      }
    },
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>