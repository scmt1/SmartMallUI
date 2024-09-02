<template>
  <div 
    :class="{'picture-shutting-com': true, 'two': config.width ==='1200px'}" 
    :style="{width: config.width ==='1200px' ? '1200px' : '100%', 'margin': '0 auto'}">
    <div 
      class="picture-shutting-container" 
      :style="getContainerStyle">
      <template v-if="config.imgList && config.imgList.length > 0">
        <template v-for="(item, index) in config.imgList">
          <div 
            class="picture-items" 
            :key="index" 
            :style="{'width': config.width, 'height': config.height}">
            <el-image :src="item.img" fit="fill">
              <div slot="error" class="image-slot">
                <img src="@/assets/img/pc-micro-page/show-default.png">
              </div>
            </el-image>
          </div>
        </template>
      </template>
      <template v-else>
        <div 
          class="picture-items" 
          :style="{'width': config.width, 'height': config.height, 'background': config.background}">
          <el-image src="" fit="fill">
            <div slot="error" class="image-slot" >
              <img src="@/assets/img/pc-micro-page/show-default.png">
              <div class="advise">{{$t('pcdecorate.pictureBy.suggest')}}</div>
            </div>
          </el-image>
        </div>
      </template>
    </div>
    <div class="page-container" v-show="config.pageation === 0">
      <template v-for="(item, index) in config.imgList">
        <div 
          :class="{'page-items': true,'active': index === 0 }" 
          :key="index">
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
    props: {
      itemComponent: { // 当前组件对应的信息
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        config: {}
      }
    },
    computed: {
      // 设置主图样式
      getContainerStyle() {
        let numberWidth = this.config.width.split('p')[0];
        return {
          height: this.config.height
        }
      }
    },
    watch: {
        itemComponent: {
            handler(newVal, oldVal) {
                if(JSON.stringify(newVal.rightConfigMessage) != '{}') {
                    let contentWidth = '100%';
                    if(newVal.rightConfigMessage.size === 1200) {
                        contentWidth = '1200px';
                    } else {
                        contentWidth = '100%'
                    }
                    this.config = {
                        width: contentWidth,
                        height: newVal.rightConfigMessage.height + 'px',
                        pageation: newVal.rightConfigMessage.pageation,
                        background: '#fff',
                        imgList: newVal.rightConfigMessage.picList
                    }
                } else {
                    this.config = {
                        width: '100%',
                        height: '500px',
                        pageation: 0,
                        background: '#fff',
                        imgList: [],
                    }
                }
            },
            deep: true,
            immediate: true
        }
    }
}
</script>
<style lang="scss" scoped>
.picture-shutting-com {
    width: 100%;
    overflow: hidden;
    position: relative;
    .picture-shutting-container {
        width: 100%;
        overflow: hidden;
        position: relative;
        display: flex;
        .picture-items {
            max-width: 1920px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            margin: 0 auto;
            position: absolute;
            left: 50%;
            transform: translate(-50%);
            .el-image {
                width: 100%;
                height: 100%;
            }
        }
    }
    .page-container {
        position: absolute;
        left: 50%;
        transform: translate(-50%);
        bottom: 10px;
        width: 100%;
        height: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        .page-items {
            width: 31px;
            height: 2px;
            background: #fff;
            margin-right: 10px;
            &.active {
                background: #fff;
            }
            &:last-child {
                margin-right: 0;
            }
        }
    }
}

</style>
<style lang="scss">
.picture-shutting-container {
    .image-slot {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        i {
            color: rgba(220, 223, 230, 0.39);
        }
        .advise {
            font-size: 13px;
            color: #9FA4B1;
            margin-top: 23px;
        }
    }
}
</style>