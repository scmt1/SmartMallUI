<template>
  <div class="module-two-component">
    <!-- 默认显示 start -->
    <template v-if="currentForm">
      <div class="module-left">
        <div class="module-left-header">
          <div class="header-top">
            <div class="main-title">{{$t('shopFeature.goodsModule.mainTitCon')}}</div>
            <div class="sub-title" :style="{color: 'rgba(243, 52, 51, 1)'}">{{$t('shopFeature.goodsModule.conTwo1')}}</div>
          </div>
          <div class="header-bottom">
              <span>{{$t('shopFeature.goodsModule.snappedUpImmediately')}}</span>
              <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="module-left-content">
          <el-image src="" fit="fill">
            <div slot="error" class="image-slot">
              <img style="width: 27px;height: 21px" src="@/assets/img/micro-page/def.png" alt="">
            </div>
          </el-image>
        </div>
      </div>
      <div class="module-right">
        <div class="module-right-top">
          <div class="right-top-left">
            <div class="header-title">
              <div class="main-title">{{$t('shopFeature.goodsModule.mainTitCon')}}</div>
              <div class="sub-title" :style="{color: 'rgba(97, 200, 180, 1)', 'font-size': '11px'}">{{$t('shopFeature.goodsModule.conTwo2')}}</div>
            </div>
            <div class="show-redirect">
              <span>{{$t('shopFeature.goodsModule.snappedUpImmediately')}}</span>
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="right-top-right">
            <el-image src="" fit="fill">
              <div slot="error" class="image-slot">
                <img style="width: 15px;" src="@/assets/img/micro-page/def.png" alt="">
              </div>
            </el-image>
          </div>
        </div>
        <div class="module-right-bottom">
          <div class="right-top-left">
            <div class="header-title">
              <div class="main-title">{{$t('shopFeature.goodsModule.mainTitCon')}}</div>
              <div class="sub-title" :style="{color: 'rgba(255, 110, 0, 1)'}">{{$t('shopFeature.goodsModule.conTwo3')}}</div>
            </div>
            <div class="show-redirect">
              <span>{{$t('shopFeature.goodsModule.snappedUpImmediately')}}</span>
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="right-top-right">
            <el-image src="" fit="fill">
              <div slot="error" class="image-slot">
                <img style="width: 15px;" src="@/assets/img/micro-page/def.png" alt="">
              </div>
            </el-image>
          </div>
        </div>
      </div>
    </template>
    <!-- 默认显示 end -->
    <!-- 有数据的时候显示 start -->
    <template v-else>
      <div class="module-left">
        <div class="module-left-header">
          <div class="header-top">
            <div class="main-title"
              :style="{
                'color': moduleForm.leftConfig.mainTitleColor,
                'font-size': moduleForm.leftConfig.mainTitleSize + 'px'
              }">{{moduleForm.leftConfig.mainTitle}}</div>
            <div class="sub-title"
              :style="{
                'color': moduleForm.leftConfig.subTitleColor,
                'font-size': moduleForm.leftConfig.subTitleSize + 'px'
              }">{{moduleForm.leftConfig.subTitle}}</div>
          </div>
          <div class="header-bottom">
            <span>{{$t('shopFeature.goodsModule.snappedUpImmediately')}}</span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
        <div class="module-left-content">
          <el-image :src="moduleForm.leftConfig.imgMessage.img" fit="fill">
            <div slot="error" class="image-slot">
              <img style="width: 27px;height: 21px" src="@/assets/img/micro-page/def.png" alt="">
            </div>
          </el-image>
        </div>
      </div>
      <div class="module-right">
        <div class="module-right-top">
          <div class="right-top-left">
            <div class="header-title">
              <div class="main-title"
                :style="{
                  'color': moduleForm.topConfig.mainTitleColor,
                  'font-size': moduleForm.topConfig.mainTitleSize + 'px'
                }">{{moduleForm.topConfig.mainTitle}}</div>
              <div class="sub-title"
                :style="{
                  'color': moduleForm.topConfig.subTitleColor,
                  'font-size': moduleForm.topConfig.subTitleSize + 'px'
                }">{{moduleForm.topConfig.subTitle}}</div>
            </div>
            <div class="show-redirect">
              <span>{{$t('shopFeature.goodsModule.snappedUpImmediately')}}</span>
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="right-top-right">
            <el-image :src="moduleForm.topConfig.imgMessage.img" fit="fill">
              <div slot="error" class="image-slot">
                <img style="width: 15px;" src="@/assets/img/micro-page/def.png" alt="">
              </div>
            </el-image>
          </div>
        </div>
        <div class="module-right-bottom">
          <div class="right-top-left">
            <div class="header-title">
              <div class="main-title"
                :style="{
                  'color': moduleForm.bottomConfig.mainTitleColor,
                  'font-size': moduleForm.bottomConfig.mainTitleSize + 'px'
              }">{{moduleForm.bottomConfig.mainTitle}}</div>
              <div class="sub-title"
                :style="{
                    'color': moduleForm.bottomConfig.subTitleColor,
                    'font-size': moduleForm.bottomConfig.subTitleSize + 'px'
                }">{{moduleForm.bottomConfig.subTitle}}</div>
            </div>
            <div class="show-redirect">
              <span>{{$t('shopFeature.goodsModule.snappedUpImmediately')}}</span>
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="right-top-right">
            <el-image :src="moduleForm.bottomConfig.imgMessage.img" fit="fill">
              <div slot="error" class="image-slot">
                <img style="width: 15px;" src="@/assets/img/micro-page/def.png" alt="">
              </div>
            </el-image>
          </div>
        </div>
      </div>
    </template>
    <!-- 有数据的时候显示 end -->
  </div>
</template>
<script>
export default {
  props: {
    config: { // 配置信息
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      moduleForm: {}
    }
  },
  computed: {
    // 得到价格显示
    getPrice () {
      return (price, type) => {
        if (!price) return
        let point = price.toString().indexOf('.') // 如果为-1则表示没找到
        let leftPrice = ''
        let rightPrice = ''
        if (point === -1) { // 当前是整数
          leftPrice = price
          rightPrice = '00'
        } else {
          leftPrice = price.toString().slice(0, point)
          rightPrice = price.toString().slice(point + 1)
        }
        switch (type) {
          case 'left':
            return leftPrice
          case 'right':
            return rightPrice
          default:
            break
        }
      }
    },
    // 判断当前是否有数据
    currentForm () {
      return JSON.stringify(this.moduleForm) === '{}'
    },
    getTopImg () {
      let url = this.moduleForm.topConfig.imgMessage.img
      return url
    }
  },
  watch: {
    config: {
      handler (newVal, oldVal) {
        this.$nextTick(() => {
          this.moduleForm = {
            ...newVal
          }
        })
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.module-two-component {
    width: 100%;
    display: flex;
    background: #fff;
    border-radius: 5px;
    .module-left {
        width: 50%;
        height: 100%;
        .module-left-header {
            overflow: hidden;
            margin: 12px 0 8.5px 12px;
            .header-top {
                display: flex;
                align-items: center;
                line-height: 1;
                .main-title {
                    font-family: PingFang SC;
                    font-weight: bold;
                    font-size: 15px;
                    white-space: nowrap;
                    max-width: calc(50% - 5px);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-break: break-all;
                }
                .sub-title {
                    font-size: 12px;
                    margin-left: 8px;
                    white-space: nowrap;
                    max-width: calc(50% - 5px);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-break: break-all;
                }
            }
            .header-bottom {
                margin-top: 6px;
                span {
                    color: #999;
                    font-size: 11px;
                    font-family: PingFang SC;
                }
                i {
                    font-size: 12px;
                    color: #999;
                }
            }
        }
        .module-left-content {
            margin: 17px 0 13.5px 24px;
            .el-image {
                width: 128px;
                height: 110px;
                background: rgba(243, 245, 247, 0.39);
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
    .module-right {
        width: 50%;
        border-left: 1px solid #F9F9FB;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        .module-right-top {
            width: 100%;
            overflow: hidden;
            border-bottom: 1px solid #F9F9FB;
            display: flex;
            .right-top-left {
                width: 50%;
                padding-left: 7px;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .header-title {
                  margin: 12px 0 0px 0px;

                    .main-title {
                        font-family: PingFang SC;
                        font-weight: bold;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                    .sub-title {
                        margin-top: 6px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                }
                .show-redirect {
                  margin-top: 18px;
                  margin-bottom: 13.5px;
                    span {
                        font-size: 12px;
                        color: #999;
                    }
                    i {
                        font-size: 12px;
                        color: #999;
                    }
                }
            }
            .right-top-right {
                width: 50%;
                margin: 12px 0 0 2px;
                .el-image {
                    width: 64px;
                    height: 64px;
                    background: rgba(243, 245, 247, 0.39);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
        .module-right-bottom {
            width: 100%;
            display: flex;
            .right-top-left {
                width: 50%;
                padding-left: 7px;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .header-title {
                    margin-top: 12px;
                    .main-title {
                        font-size: 15px;
                        font-family: PingFang SC;
                        font-weight: bold;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                    .sub-title {
                        font-size: 11px;
                        margin-top: 6px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                }
                .show-redirect {
                  margin-top: 18px;
                    margin-bottom: 13.5px;
                    span {
                        font-size: 12px;
                        color: #999;
                    }
                    i {
                        font-size: 12px;
                        color: #999;
                    }
                }
            }
            .right-top-right {
                width: 50%;
                padding: 13px 0 0 3.5px;
                .el-image {
                    width: 64px;
                    height: 64px;
                    background: rgba(243, 245, 247, 0.39);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
    }
}
</style>