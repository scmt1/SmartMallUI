<template>
    <div class="component-manage-container">
        <div class="title">{{$t('pcdecorate.componentTitle.component')}}
            <i class="el-icon-close" @click="closeComponentManageContainer"></i>
        </div>
        <div class="title-border"></div>
        <div class="config-container">
            <div class="titles">{{$t('pcdecorate.componentTitle.pageName')}}</div>
            <div class="config-items">
              <el-input 
              v-model.trim="smallPageName" 
              maxlength="10" 
              :placeholder="$t('pcdecorate.placeholder.pageName')"></el-input>
            </div>
        </div>
        <div class="config-container">
            <div class="titles">{{$t('pcdecorate.componentTitle.pageBackground')}}</div>
            <div class="config-items">
              <pick-color-component
                :defineColor="pageBackground"
                :resetColor="'rgba(244, 244, 244, 1)'"
                @handleChangeColor="handleBackColor">
              </pick-color-component>
            </div>
        </div>
        <div class="top-header">
            <span>{{$t('pcdecorate.componentTitle.componentSort')}}</span>
            <span @click="handelRemove">{{$t('pcdecorate.componentTitle.clearComponent')}}</span>
        </div>
        <div class="component-list">
          <div class="items-header" v-if="HeaderComponent.length > 0">
            <div class="items-content" v-for="(item, index) in HeaderComponent" :key="index">
              <span>{{$t(`pcdecorate.componentTitle.${item.rightConfigTitle}`)}}</span>
              <i class="el-icon-delete" @click="handleHeaderDel(index)" style="cursor: pointer"></i>
            </div>
          </div>
          <SlickList
            v-model="componentList"
            :use-drag-handle="true"
            axis="y"
            @input="componentSortInput"
            helperClass="drag-class">
            <SlickItem
              v-for="(item, index) in componentList"
              :key="index"
              class="component-list-item"
              :index="index">
              <div class="items-content">
                <div class="item-drag-box" v-handle></div>
                <span>{{$t(`pcdecorate.componentTitle.${item.rightConfigTitle}`)}} {{index}}</span>
                <i class="el-icon-delete" @click="handleDel(index)"></i>
              </div>
            </SlickItem>
          </SlickList>
        </div>

        <div class="empty-template-pc" v-if="currentUseComponents.length === 0">{{$t('shopFeature.edit.emptyTemplate')}}</div>
    </div>
</template>
<script>
import {SlickList, SlickItem, HandleDirective} from 'vue-slicksort' // 拖动组件
import pickColorComponent from '../../../commonComponent/pickColor/index.vue' // 选择颜色
export default {
  components: {
    SlickList,
    SlickItem,
    pickColorComponent
  },
  props: {
    currentUseComponents: { // 当前组件个数
      type: Array,
      default: () => []
    },
    HeaderComponent: { // 头部组件
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      componentList: [], // 组件列表
      smallPageName: '', // 页面名称
      pageBackground: 'rgba(244, 244, 244, 1)' // 页面背景
    }
  },
  directives: {handle: HandleDirective},
  methods: {
      // 组件排序
    componentSortInput (newList) {
      this.$emit('handleSortComponent', newList)
    },
      // 关闭组件管理
    closeComponentManageContainer () {
      this.$emit('closeComponentManageContainer')
    },
      // 删除组件
    handleDel (index) {
      this.$emit('handleSingleRemove', index)
    },
      // 头部组件删除
    handleHeaderDel (index) {
      this.$emit('handleHeaderDel', index)
    },
      // 清空组件
    handelRemove () {
      this.$emit('handleRemoveComponnent')
    },
      // 页面背景
    handleBackColor (color) {
      this.pageBackground = color
      this.$emit('handlePageColor', this.pageBackground)
    }
  },
  watch: {
    currentUseComponents: {
      handler (newVal) {
        this.componentList = []
        newVal.forEach(item => {
          this.componentList.push(item)
        })
      },
      deep: true
    },
    HeaderComponent: {
      handler (newVal) {
        this.HeaderComponent = newVal
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.component-manage-container {
    width: 450px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    // position: fixed;
    top: 50px;
    right: 0;
    z-index: 99;
    padding: 20px;
    background: #fff;
    padding-bottom: 45px;
    .title {
        color: #333;
        font-size: 16px;
        margin-top: 0px;
        position: relative;
        margin-left: 10px;
        &::before {
            content: '';
            position: absolute;
            width: 3px;
            height: 15px;
            left: -10px;
            top: 2px;
            background: rgba(21, 91, 212, 1);
        }
      .el-icon-close {
        color: #8C8C8C;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
      }
    }
    .title-border {
        width: 100%;
        height: 1px;
        background: #EDEDF2;
        margin:  20px 0;
    }
    .config-container {
      .titles {
        color: #666;
        margin-bottom: 15px;
      }
      .config-items {
        margin-bottom: 25px;
      }
      
    }
    .items-header {
      height: 40px;
      border: 1px dashed rgba(21, 91, 212, 1);
      background: #fff;
      z-index: 99;
      display: flex;
      padding: 0 10px;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      .items-content {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
    .el-input__inner {
      height: 28px!important;
    }
    .top-header {
        display: flex;
        justify-content: space-between;
        span {
            color: #333;
            &:nth-child(2) {
                cursor: pointer;
                color: #155bd4;
            }
        }
    }
    .component-list {
        margin-top: 15px;
        .component-list-item {
            width: 100%;
            height: 40px;
            margin-bottom: 10px;
            border: 1px solid #EAEAF2;
            background: #fff;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
            z-index: 99;
            color: #333;
            .item-drag-box {
                position: absolute;
                width: 100%;
                height: 100%;
                z-index: 100;
                top: 0;
                left: 0;
                cursor: all-scroll;
            }
            .el-icon-delete {
                cursor: pointer;
                position: absolute;
                z-index: 999;
                right: 10px;
            }
            .items-content {
                display: flex;
                justify-content: space-between;
                width: 100%;
            }
            &:hover {
                border-color: #155bd4;
                color: #155bd4;
            }
        }
    }

  .empty-template-pc {
    margin-top: 20%;
    text-align: center;
    font-size: 14px;
    color: #c0c4cc;
  }
}
</style>
<style lang="scss">
.drag-class {
    width: 400px;
    height: 40px;
    border: 1px solid #EAEAF2;
    background: #fff;
    z-index: 99;
    display: flex;
    padding: 0 20px;
    align-items: center;
    justify-content: space-between;
    .items-content {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
}
.config-container {
  .el-input {
    .el-input__inner {
      height: 32px!important;
    }
  }
}

</style>