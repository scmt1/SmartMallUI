<template>
  <div class="page-modal-content">
    <div class="page-contents">
      <div
        :class="{'page-items': true, 'active': currentIndex === index}"
        v-for="(item, index) in currentPageList"
        :key="index"
        @click="handleSelectPage(item, index)">
        <img :src="item.img">
        <span>{{item.title}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    activeName: { // 动态切换tab
      type: String,
      default: () => ''
    },
    deviceType: { // 弹窗类型 pc端： pc , 移动:mobile
      type: String,
      default: () => 'pc'
    },
    customLinkArr: { // 自定义链接回显数据
      type: Object,
      default: () => {}
    }
  },
    data() {
      return {
        pageList: [
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_index.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.index'),
            link: '/',
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_cart.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.cart'),
            link: '/cart',
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_order.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.order'),
            link: '/user-center/uc-order'
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_profile.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.profile'),
            link: '/user-center'
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_collection.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.collection'),
            link: '/user-center/uc-collection'
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_new.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.recommand'),
            link: '/list?st=1'
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_preferential.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.limitTime'),
            link: '/special-discount'
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_bulk.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.discount'),
            link: '/group-buy'
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_skill.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.skill'),
            link: '/flash-sale'
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_securities.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.coupon'),
            link: '/coupons'
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_integral.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.IntegralMall'),
            link: '/member-center/integral-mall'
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_members.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.memberCenter'),
            link: '/member-center/member-center'
          },
          // {
          //     img: require('@/assets/img/pc-micro-page/pc_modal_distribution.png'),
          //     title: '分销中心'
          // },
          // {
          //     img: require('@/assets/img/pc-micro-page/pc_modal_live.png'),
          //     title: '小程序直播'
          // }
        ],
        currentIndex: '', // 当前点击选中的哪个
        mobileList: [ // 移动端页面内容
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_index.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.index'),
            link: '/',
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_cart.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.cart'),
            link: '/pages/basket/basket',
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_order.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.order'),
            link: '/pages/order-list/order-list'
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_profile.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.profile'),
            link: '/pages/user/user'
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_collection.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.collection'),
            link: '/pages/prod-classify/prod-classify?sts=5'
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_new.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.recommand'),
            link: '/pages/prod-classify/prod-classify?sts=1'
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_preferential.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.limitTime'),
            link: '/package-activities/pages/special-discount/special-discount'
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_bulk.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.discount'),
            link: '/package-activities/pages/a-bulk-list/a-bulk-list'
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_skill.png'),
            title: this.$i18n.t('pcdecorate.commonModal.pageComponent.skill'),
            link: '/package-activities/pages/snap-up-list/snap-up-list'
          },
          {
              img: require('@/assets/img/pc-micro-page/pc_modal_securities.png'),
              title: this.$i18n.t('pcdecorate.commonModal.pageComponent.coupon'),
              link: '/package-activities/pages/coupon-center/coupon-center'
          },
          {
              img: require('@/assets/img/pc-micro-page/pc_modal_integral.png'),
              title: this.$i18n.t('pcdecorate.commonModal.pageComponent.IntegralMall'),
              link: '/package-member-integral/pages/integral-index/integral-index'
          },
          {
              img: require('@/assets/img/pc-micro-page/pc_modal_members.png'),
              title: this.$i18n.t('pcdecorate.commonModal.pageComponent.memberCenter'),
              link: '/package-member-integral/pages/member-index/member-index'
          },
          {
              img: require('@/assets/img/pc-micro-page/pc_modal_distribution.png'),
              title: '分销中心',
              link: '/package-distribution/pages/dis-center/dis-center'
          },
          {
              img: require('@/assets/img/pc-micro-page/pc_modal_live.png'),
              title: '小程序直播',
              link: '/pages/live-broadcast/live-broadcast'
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_index.png'),
            title: '会员卡',
            link: '/package-user/pages/my-wallet/my-wallet'
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_index.png'),
            title: '停车服务',
            link: '/package-parking/pages/parking-home/parking-home'
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_index.png'),
            title: '积分抽奖',
            link: '/package-prize/pages/prize-draw/prize-draw'
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_index.png'),
            title: '自助积分',
            link: '/package-score/pages/score/score'
          },
          {
            img: require('@/assets/img/pc-micro-page/pc_modal_index.png'),
            title: '楼层导航',
            link: 'https://publish.fengmap.com/preRich?a=1649009581538275330&p=1&t=1686798594347'
          }
        ],
        currentPageList: [], // 当前的页面
      }
    },
    methods: {
      // 选中哪个页面
      handleSelectPage(item, index) {
        this.currentIndex = index;
        this.$emit('handleGoodsSelect', { type: 'pageItem', value: item});
      },
      // 重置组件的信息
      resetComponent() {
        this.currentIndex = '';
      },
      // 设置页面内容
      setPageContent() {
        if(this.deviceType === 'pc') { // 如果是pc端选择进来
          this.currentPageList = this.pageList;
        } else if(this.deviceType === 'mobile') { // 否则就是移动端选择进来
          this.currentPageList = this.mobileList;
        }
        // 回显
        if(this.customLinkArr && this.customLinkArr.type != '' && this.customLinkArr.type === '4') { // 如果在操作热区
          this.currentPageList.forEach((item,index) => {
            if(item.link === this.customLinkArr.link) {
              this.currentIndex = index;
              this.$emit('handleGoodsSelect', { type: 'pageItem', value: item});
            }
          })
        }
      }
    },
    watch: {
      activeName(newVal) { // 激活tabbar
        if(newVal === '4') {
          this.resetComponent();
          this.setPageContent();
        }
      }
    }
}
</script>
<style lang="scss" scoped>
.page-modal-content {
    min-height: 450px;
    max-height: 450px;
    height: 450px;
    overflow-y: auto;
    .page-contents {
        width: calc(100% - 40px);
        max-height: 400px;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        flex-wrap: wrap;
        margin: 20px;
        .page-items {
            width: 20%;
            height: 88px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;
            cursor: pointer;
            &:hover {
                border: 1px solid #155BD4;
                border-radius: 6px;
            }
            &.active {
                border: 1px solid #155BD4;
                border-radius: 6px;
            }
            img {
                width: 40px;
                height: 40px;
            }
            span {
                margin-top: 6px;
                font-size: 14px;
                font-family: Microsoft YaHei;
                color: #333;
            }
        }
    }
}
</style>
