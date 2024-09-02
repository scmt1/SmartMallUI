<template>
  <div class="store-list-components">
    <template v-if="config.storeList && config.storeList.length > 0">
        <div 
          class="store-list-items" 
          v-for="(item, index) in config.storeList" 
          :key="index">
              <div class="images">
                <el-image :src="item.shopLogo" fit="cover">
                  <div slot="error" class="image-slot">
                    <img 
                      style="width: 30px" 
                      src="@/assets/img/pc-micro-page/show-default.png">
                  </div>
                </el-image>
                <!-- 下线蒙版 start-->
                <div class="imgs_shelves" v-if="item.shopStatus != 1">
                  <img class="been_imgs" src="@/assets/img/pc-micro-page/offlined.png" />
                </div>
                <!-- 下线蒙版 end -->
              </div>
              <div class="right-content">
                <span>{{item.shopName}}</span>
                <span>{{item.shopFocusNumber}}{{$t('pcdecorate.storeList.storeAttention')}}</span>
                <span>{{$t('pcdecorate.storeList.storeIn')}}</span>
              </div>
          </div>
        </template>
        <template v-else>
          <template v-for="(item, index) in defaultArr">
              <div class="store-list-items" :key="index">
                <div class="images">
                  <el-image src="" fit="cover">
                    <div slot="error" class="image-slot">
                      <img style="width: 30px" src="@/assets/img/pc-micro-page/show-default.png">
                    </div>
                  </el-image>
                </div>
                <div class="right-content">
                  <span>{{$t('pcdecorate.storeList.storeName')}}</span>
                  <span>0{{$t('pcdecorate.storeList.storeAttention')}}</span>
                  <span>{{$t('pcdecorate.storeList.storeIn')}}</span>
                </div>
              </div>
          </template>
        </template>
    </div>
</template>
<script>
export default {
  props: {
    config: { // 配置店铺
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      defaultArr: new Array(4)
    }
  }
}
</script>
<style lang="scss" scoped>
$currentContentWidth: 1200px; // 当前页面内容宽度
$marginRight: 10px;
$marginLeft: 14px;
.store-list-components {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .store-list-items {
      width: calc((100% - 36px ) / 4);
      height: 100%;
      background: #fff;
      border: 1px solid #F5F5F5;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      margin-right: 12px;
      margin-top: 12px;
      overflow: hidden;
      &:nth-child(1),&:nth-child(2),&:nth-child(3),&:nth-child(4) {
          margin-top: 0;
      }
      &:nth-child(4n) {
          margin-right: 0;
      }
      .images {
        width: 73px;
        height: 73px;
        margin: 10px 14px 10px 10px;
        position: relative;
        .el-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f6f7fa;
        }
        .imgs_shelves {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.6);
        }
      }
        .right-content {
          width: calc(100% - 73px - $marginLeft - $marginRight);
          height: 73px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          span {
            white-space: nowrap;
            overflow: hidden;
            display: block;
            text-overflow: ellipsis;
            word-break: break-all;
            font-size: 12px;
            font-family: Microsoft YaHei;
            color: #999999;
            &:nth-child(3) {
              width: 72px;
              height: 23px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #E1251B;
              border-radius: 12px;
              color: #fff;
              font-size: 12px;
            }
          }
        }
    }
}
</style>