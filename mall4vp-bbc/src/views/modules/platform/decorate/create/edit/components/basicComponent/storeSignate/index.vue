<template>
  <div 
    :class="{'store-signate-page-container': true, 'defaultHeight': !setTopShow}" 
    :style="config.bgUrl != '' ? setBackground : 'background: #fff'">
    <div class="store-singate-content">
      <div class="store-top" v-if="setTopShow">
        <div class="top-logo">
          <img 
            v-show="config.showLogo === 0" 
            :src="webHeaderConfig.pcLogoImgText" alt="">
        </div>
        <div class="top-search">
          <div class="search-input" v-show="config.showSearch === 0">
            <span>{{$t(`pcdecorate.storeSignate.searchPlaceholder`)}}</span>
            <div class="search-types">
              <div class="types-name">{{$t('pcdecorate.shopMessage.goods')}}</div>
              <img src="@/assets/img/pc-micro-page/togger_icon.png" alt="">
            </div>
            <div class="search-btns">{{$t(`pcdecorate.storeSignate.search`)}}</div>
          </div>
          <div class="top-cart" v-show="config.showSearch === 0">
            <span>{{$t(`pcdecorate.storeSignate.cart`)}}(0)</span>
          </div>
        </div>
      </div>
      <div class="store-bottom" v-if="config.showNavs === 0">
        <div 
          v-if="config.showCategory === 0" 
          class="all-category" 
          :style="{background: config.showCategory === 0 ? 'rgba(225, 37, 27, 1)' : 'none'}">
          <span>{{$t(`pcdecorate.storeSignate.category`)}}</span>
          <img src="@/assets/img/pc-micro-page/pc-category_icon.png">
        </div>
        <div 
          :class="{'menu-content': true, 'isPadding': config.showCategory === 1}" 
          v-show="config.showNavs === 0">
          <template v-for="(item, index) in config.navList">
            <div class="menu-items" :key="index">{{item.name}}</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    itemComponent: { // 组件的信息
      type: Object,
      default: () => {}
    },
    currentIndex: { // 下标
      type: Number | String
    },
    currentRefs: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      config: {},
      webHeaderConfig: {}, // 头部配置信息读取接口
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },
  computed: {
    setBackground () {
      return {
        'background': `url(${this.config.bgUrl})`,
        'background-size': '100% 100%',
        'background-repeat': 'no-repeat'
      }
    },
    setTopShow () {
      let status = true
      let {showLogo, showSearch, bgUrl, showNavs} = this.config
      if (showLogo != 0 && showSearch != 0 && bgUrl == '') {
        status = false
      } else {
        status = true
      }
      return status
    }
  },
  mounted () {
    this.getHeader()
  },
  methods: {
    // 请求头部
    getHeader () {
      this.$http({
        url: this.$http.adornUrl('/sys/webConfig/info/PC_WEBSITE_CONFIG'),
        method: 'get'
      }).then(res => {
        let data = JSON.parse(res.data)
        data.pcLogoImgText = data.pcLogoImgText.indexOf('http') > -1 ? data.pcLogoImgText : this.resourcesUrl + data.pcLogoImgText
        this.webHeaderConfig = data
      })
    }
  },
  watch: {
    itemComponent: {
      handler (newVal, oldVal) {
        if (newVal && JSON.stringify(newVal.rightConfigMessage) != '{}') {
          this.config = {...newVal.rightConfigMessage}
        } else {
          this.config = {
            showLogo: 0,
            showSearch: 0,
            showCategory: 0,
            showNavs: 0,
            navList: [],
            bgUrl: ''
          }
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
$currentContentWidth: 1200px; // 当前版心宽度
.store-signate-page-container {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
  &.defaultHeight {
    height: 40px;
  }
  .store-singate-content {
    width: $currentContentWidth;
    margin: 0 auto;
    display: flex;
    max-width: 1200px;
    flex-direction: column;
    box-sizing: border-box;
    .store-top {
      width: 100%;
      height: 130px;
      display: flex;
      align-items: center;
      max-width: 1200px;
      justify-content: space-between;
      box-sizing: border-box;
      padding-bottom: 26px;
      .top-logo {
        height: 52px;
        overflow: hidden;
        display: flex;
        align-items: center;
        img {
          width: 190px;
          height: 48px;
        }
      }
      .top-search {
        display: flex;
        .search-input {
          width: 600px;
          height: 40px;
          border: 2px solid #E1251B;
          position: relative;
          margin-right: 50px;
          span {
            position: absolute;
            left: 12px;
            top: 11px;
            font-size: 14px;
            color: #999;
          }
          .input-text {
            background: #E1251B;
            height: 28px;
            >>>.el-input__inner {
              width: 100%;
              height: 20px;
              background: none!important;
            }
          }
          .search-types {
            position: absolute;
            top: 10px;
            right: 124px;
            display: flex;
            justify-content: center;
            .types-name {
              display: block;
              font-size: 14px;
              color: #E1251B;
              margin-right: 4px;
            }
          }
          .search-btns {
            position: absolute;
            right: 0;
            width: 109px;
            height: 38px;
            background: #E1251B;
            color: #fff;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-family: Microsoft YaHei;
            letter-spacing: 4px;
            padding-left: 8px;
            z-index: 5;
          }
        }
        .top-cart {
          width: 160px;
          height: 40px;
          background: #E1251B;
          display: flex;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          &:before {
            content: '';
            position: absolute;
            background: url('../../../../../../../../../assets/img/pc-micro-page/icons.88a567a.png') no-repeat -44px -36px;
            width: 19px;
            height: 18px;
            left: 25px;
            top: 11px;
          }
          span {
            margin-left: 8px;
            font-size: 14px;
            font-family: Microsoft YaHei;
          }
        }
      }
    }
    .store-bottom {
      width: 100%;
      height: 40px;
      display: flex;
      max-width: 1200px;
      margin: 0 auto;
      .all-category {
        width: 187px;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 1;
        span {
          white-space: nowrap;
          font-size: 13px;
          color: #fff;
        }
        img {
          margin-left: 22px;
          width: 17px;
          height: 13px;
        }
      }
      .menu-content {
        width: calc(100% - 187px);
        display: flex;
        align-items: center;
        .menu-items {
          padding: 0 30px;
          text-align: center;
          overflow: hidden;
          color: #000;
          overflow: hidden;
          white-space: nowrap;
          font-size:  15px;
          font-family: Microsoft YaHei;
          &:nth-child(1) {
            padding-left: 60px;
          }
        }
        &.isPadding {
          .menu-items {
            &:nth-child(1) {
              padding-left: 0px;
            }
          }
        }
      }
    }
  }
}

</style>