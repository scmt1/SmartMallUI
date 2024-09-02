<template>
  <div class="store-signate-page-container" >
    <div 
      class="store-top-container" 
      v-if="config.storeStyle === 0" 
      :style="config.bgUrl != '' ? setBackground : 'baclground: #fff'">
      <div class="store-top style1" >
        <img class="logo-img" :src="shopInfo.shopLogo" alt="">
        <span class="store-name">{{shopInfo.shopName}}</span>
        <span class="custom-store">{{getStoreType(shopInfo.type)}}</span>
        <p>
          <img src="@/assets/img/pc-micro-page/connect_customer.png" alt="">
          <span>{{$t(`pcdecorate.storeSignate.customerService`)}}</span>
        </p>
        <p>
          <img src="@/assets/img/pc-micro-page/collection_store.png" alt="">
          <span>{{$t(`pcdecorate.storeSignate.collectionShops`)}}</span>
        </p>
      </div>
    </div>
    <div class="store-top style2" v-if="config.storeStyle === 1">
      <div class="store-top-content">
        <span class="custom-store">{{getStoreType(shopInfo.type)}}</span>
        <span class="store-name">{{shopInfo.shopName}}</span>
        <p>
          <img src="@/assets/img/pc-micro-page/connect_customer.png" alt="">
          <span>{{$t(`pcdecorate.storeSignate.customerService`)}}</span>
        </p>
        <p>
          <img src="@/assets/img/pc-micro-page/collection_store.png" alt="">
          <span>{{$t(`pcdecorate.storeSignate.collectionShops`)}}</span>
        </p>
      </div>
      <div v-if="config.bgUrl != ''" class="store-top-bottom" :style="config.bgUrl != '' ? setBackground : 'baclground: #fff'"></div>
    </div>
    <div v-if="config.showNavs === 0" class="store-bottom" :style="{background: config.navsBg}">
      <div class="bottom-content">
        <div class="navs-list">
          <li v-show="config.showCategory === 0">
            <span style="margin-right: 3px;">{{$t('pcdecorate.storeSignate.goodsCategory')}}</span>
            <i class="el-icon-caret-bottom"></i>
          </li>
          <li v-show="config.announcement === 0">{{$t('shopFeature.allCanUse.notice')}}</li>
          <template v-if="config.showNavs === 0">
            <template v-for="(item, index) in config.navList">
              <li :key="index">{{item.name}}</li>
            </template>
          </template>
        </div>
        <div class="search-content" v-show="config.search == 0">
          <img src="@/assets/img/pc-micro-page/search-content.png">
          <div class="search-btn">{{$t('shopFeature.searchBar.search')}}</div>
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
      shopInfo: {} // 店铺信息
    }
  },
  mounted () {
    this.getHeader()
  },
  methods: {
    // 请求头部
    getHeader () {
      this.$http({
        url: this.$http.adornUrl('/shop/shopDetail/getShopInfo'),
        method: 'get'
      }).then(res => {
        this.shopInfo = res.data
      })
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
    getStoreType () { // 店铺类型
      return (type) => {
        if (type === 0) {
          return '普通店铺'
        } else if (type === 1) {
          return '优选好店'
        } else {
          return ''
        }
      }
    }
  },
  watch: {
    itemComponent: {
      handler (newVal, oldVal) {
        if (JSON.stringify(newVal.rightConfigMessage) != '{}') {
          this.config = {...newVal.rightConfigMessage}
        } else {
          this.config = {
            storeStyle: 0,   // 店铺信息样式类型
            showCategory: 0, // 全部分类是否显示
            showNavs: 0, // 导航栏是否显示
            navsBg: 'rgba(17, 17, 19, 1)', // 导航栏背景
            search: 0, // 搜索
            announcement: 0, // 公告
            navList: [], // 导航栏个数
            bgUrl: '' // 图片背景
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
$currentContentWidth: 1200px; // 当前页面内容宽度
.store-signate-page-container {
  width: 100%;
  height: 100%;
  background: #fff;
  .store-top-container {
    margin: 0 auto;
    display: flex;
    width: 100%;
    height: 61px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .store-top {
    width: 100%;
    margin: 0 auto;
    &.style1 {
      width: $currentContentWidth;
      max-width: 1200px;
      margin: 0 auto;
      height: 61px;
      display: flex;
      align-items: center;
      .logo-img {
        width: 98px;
        height: 55px;
        margin-right: 15px;
      }
      .store-name {
        font-size: 18px;
        font-weight: bold;
        color: #333;
        font-family: Microsoft YaHei;
        margin-right: 15px;
      }
      .custom-store {
        display: block;
        background: #e1251b;
        color: #fff;
        border-radius: 2px;
        padding: 3px 3px;
        font-size: 12px;
        margin-right: 10px;
      }
      p {
        display: flex;
        align-items: center;
        margin-right: 10px;
        img {
          width: 22px;
          height: 20px;
        }
        span {
          color: #333;
          font-size: 12px;
          line-height: 1;
          margin-left: 4px;
        }
      }
    }
    &.style2 {
      .store-top-content {
        width: $currentContentWidth;
        max-width: 1200px;
        margin: 0 auto;
        height: 39px;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .custom-store {
          display: block;
          background: #e1251b;
          color: #fff;
          border-radius: 2px;
          font-size: 12px;
          padding: 2px 3px;
          margin-right: 10px;
        }
        .store-name {
          font-size: 12px;
          color: #333;
          margin-right: 10px;
        }
        p {
          display: flex;
          align-items: center;
          margin-right: 10px;
          img {
            width: 22px;
            height: 20px;
          }
          span {
            color: #333;
            font-size: 12px;
            line-height: 1;
            margin-left: 4px;
          }
        }
      }
      .store-top-bottom {
        height: 100px;
        width: 100%;
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .store-bottom {
    width: 100%;
    height: 30px;
    .bottom-content {
      width: $currentContentWidth;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      .navs-list {
        overflow: hidden;
        width: calc(100% - 148px);
        display: flex;
        white-space: nowrap;
        li {
          float: left;
          text-decoration: none;
          line-height: 30px;
          list-style: none;
          color: #fff;
          margin-right: 29px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          cursor: pointer;
        }
      }
      .search-content {
        width: 148px;
        height: 20px;
        background: #fff;
        display: flex;
        position: relative;
        img{
          position: absolute;
          width: 9px;
          height: 9px;
          left: 11px;
          top: 6px;
        }
        .search-btn {
          position: absolute;
          width: 43px;
          height: 20px;
          line-height: 20px;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(225, 37, 27, 1);
          font-size: 12px;
          color: #fff;
        }
      }
    }
  }
}

</style>