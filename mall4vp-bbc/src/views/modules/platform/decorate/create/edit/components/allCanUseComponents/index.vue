<template>
  <div class="showAllComponents">
    <div id="allComponents" class="all-grouped all-can-use-components">
      <div class="add-component-grouped">
        <div class="add-component-grouped-item">
          <!-- 基础组件 start -->
          <div class="add-grouped-item-title">{{$t('pcdecorate.baseComponent.base')}}</div>
          <div class="add-grouped-item-list">
            <draggable
              :list="componentLists"
              :group="{ name: 'people', pull: 'clone', put: false}"
              :clone="cloneDog"
              ghost-class="ghost"
              :disabled="!isDrag">
              <div
                v-for="(item, index) in baseList"
                :key="index" 
                class="add-grouped-item-list-btn">
                <div class="add-grouped-item-list-con" @click="addComponent(item, index)">
                  <div 
                    class="add-grouped-item-list-btn-title"
                    :class="{'active': item.type === currentActiveIndex}">
                    <div class="item-pic-container">
                      <img v-if="item.type === currentActiveIndex " :src="item.picActive" alt="">
                      <img v-else :src="item.pic" alt="">
                    </div>
                    <div>{{$t(`pcdecorate.baseComponent.${item.title}`)}}</div>
                  </div>
                </div>
              </div>
            </draggable>
          </div>
          <!-- 基础组件 end -->
          <!-- 活动组件 start -->
          <div class="add-grouped-item-title">{{$t('pcdecorate.marketingActive.marketing')}}</div>
          <div class="add-grouped-item-list">
            <draggable
              :list="componentLists"
              :group="{ name: 'people', pull: 'clone', put: false }"
              :clone="cloneDog"
              ghost-class="ghost"
              :disabled="!isDrag">
              <div 
                v-for="(item, index) in shopDisList"
                :key="index"
                class="add-grouped-item-list-btn">
                <div @click="addComponent(item, index)">
                  <div 
                    class="add-grouped-item-list-btn-title"
                    :class="{'active': item.type === currentActiveIndex}">
                    <div class="item-pic-container">
                      <img v-if="item.type === currentActiveIndex " :src="item.picActive" alt="">
                      <img v-else :src="item.pic" alt="">
                    </div>
                    <div>{{$t(`pcdecorate.marketingActive.${item.title}`)}}</div>
                  </div>
                </div>
              </div>
            </draggable>
          </div>
          <!-- 活动组件 end -->
          <!-- 扩展组件 start -->
          <div class="add-grouped-item-title">{{$t('pcdecorate.extendComponent.extend')}}</div>
          <div class="add-grouped-item-list">
            <draggable
              :list="componentLists"
              :group="{ name: 'people', pull: 'clone', put: false }"
              :clone="cloneDog"
              ghost-class="ghost"
              :disabled="!isDrag">
              <div 
                v-for="(item, index) in extendComponentList"
                :key="index"
                class="add-grouped-item-list-btn">
                <div @click="addComponent(item, index)">
                  <div 
                    class="add-grouped-item-list-btn-title"
                    :class="{'active': item.type === currentActiveIndex}">
                    <div class="item-pic-container">
                      <img v-if="item.type === currentActiveIndex " :src="item.picActive" alt="">
                      <img v-else :src="item.pic" alt="">
                    </div>
                    <div>{{$t(`pcdecorate.extendComponent.${item.title}`)}}</div>
                  </div>
                </div>
              </div>
            </draggable>
          </div>
          <!-- 扩展组件 end -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { configComponentList } from '../configComponent';
import draggable from 'vuedraggable';
export default {
  components: {
    draggable
  },
  data() {
    return {
      componentLists: configComponentList, //[ // 所有可用的组件
      isDrag: true,
      currentActiveIndex: '', // 当前选中的组件
      baseList: [], // 基础组件
      shopDisList: [], // 营销活动
      extendComponentList: [], // 扩展组件
    }
  },
  created() {
    this.groupcomponent(); // 进行组件的分组
  },
  mounted() {
    
  },
  methods: {
    // 组件分组
    groupcomponent() {
      let baseList = [];
      let shopDisList = [];
      let extendComponentList = [];
      for(let i = 0;i < this.componentLists.length;i++) {
        const item = this.componentLists[i];
        if(item.currentType === 'basic') {
          baseList.push(item);
        } else if(item.currentType === 'mark_activity') {
          shopDisList.push(item)
        } else if(item.currentType === 'extend_component') {
          extendComponentList.push(item)
        }
      }
      this.baseList = baseList;
      this.shopDisList = shopDisList;
      this.extendComponentList = extendComponentList;
    },
    cloneDog ({ type }) {
      return this.componentLists.find(x => x.type === type)
    },
    // 点击左边组件进行添加
    addComponent(item, index) {
      this.currentActiveIndex = item.type;
      this.$emit('addComponent', item);
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>