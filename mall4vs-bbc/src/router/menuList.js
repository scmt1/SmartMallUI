import i18n from '../i18n/i18n'
const menuList = [
  {
    'name': i18n.t('notice.noticeList'),
    'url': 'shop/notice-list',
    'icon': 'order'
  },
  {
    'name': i18n.t('menuList.prodManage'),
    'url': '',
    'icon': 'admin',
    'list': [
      {
        'name': i18n.t('menuList.releaseGoods'),
        'url': 'prod/selectCategory',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.prodManage'),
        'url': 'prod/prodList',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.itemManagement'),
        'url': 'prod/retailProd',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.classificationManage'),
        'url': 'prod/category',
        'icon': ''
      },
      // {
      //   'name': i18n.t('menuList.groupManage'),
      //   'url': 'prod/prodTag',
      //   'icon': ''
      // },
      {
        'name': i18n.t('menuList.commentManage'),
        'url': 'prod/prodComm',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.specManage'),
        'url': 'prod/spec',
        'icon': ''
      }
      // {
      //   'name': i18n.t('menuList.brandManage'),
      //   'url': 'prod/brand',
      //   'icon': ''
      // }
    ]
  },
  {
    'name': i18n.t('menuList.storeManage'),
    'url': '',
    'icon': 'store',
    'list': [
      {
        'name': i18n.t('menuList.shopFeature'),
        'url': 'shop/feature/list/index',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.shopPcFeature'),
        'url': 'shop/decorate/list/index',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.announcementManage'),
        'url': 'shop/notice',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.storeAddressManage'),
        'url': 'shop/refundAddr',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.carouselManage'),
        'url': 'admin/indexImg',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.hotSearchManage'),
        'url': 'shop/hotSearch',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.storeManagement'),
        'url': 'shop/shopInfo',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.storeBalance'),
        'url': 'shop/shopWalletLog',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.supplierManage'),
        'url': 'shop/supplier',
        'icon': ''
      }
    ]
  },
  {
    'name': i18n.t('menuList.groupManagement'),
    'url': '',
    'icon': 'order',
    'list': [
      {
        'name': i18n.t('menuList.groupActivities'),
        'url': 'group/groupActivity',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.groupOrder'),
        'url': 'group/groupTeam',
        'icon': ''
      }
    ]
  },
  {
    'name': i18n.t('menuList.marketingManage'),
    'url': '',
    'icon': 'tubiao',
    'list': [
      {
        'name': i18n.t('menuList.spikeManage'),
        'url': 'seckill/seckill',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.fullDiscount'),
        'url': 'marketing/discount',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.couponManage'),
        'url': 'marketing/coupon',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.distrProManage'),
        'url': 'marketing/distribution-prod',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.distrReco'),
        'url': 'marketing/distribution-prod-log',
        'icon': ''
      }
    ]
  },
  {
    'name': i18n.t('menuList.orderManage'),
    'url': '',
    'icon': 'order',
    'list': [
      {
        'name': i18n.t('menuList.orderManage'),
        'url': 'order/order',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.refundManage'),
        'url': 'order/orderRefund',
        'icon': ''
      }
    ]
  },
  {
    'name': i18n.t('menuList.dataReport'),
    'url': '',
    'icon': 'order',
    'list': [
      {
        'name': i18n.t('menuList.myReport'),
        'url': 'form/form',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.recommendedReport'),
        'url': 'form/formModel',
        'icon': ''
      }
    ]
  },
  {
    'name': i18n.t('menuList.dataAnalysis'),
    'url': '',
    'icon': 'tubiao',
    'list': [
      {
        'name': i18n.t('menuList.commodityOverview'),
        'url': 'dataAnalysis/prodAnalysis/prod-analysis',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.commodityInsight'),
        'url': 'dataAnalysis/prodAnalysis/prod-insight',
        'icon': ''
      }
    ]
  },
  {
    'name': i18n.t('menuList.distributionManage'),
    'url': '',
    'icon': 'tubiao',
    'list': [
      {
        'name': i18n.t('menuList.pickupPointManage'),
        'url': 'admin/station',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.cityDistributionManage'),
        'url': 'shop/sameCity',
        'icon': ''
      }, {
        'name': i18n.t('menuList.freTempl'),
        'url': 'shop/transport',
        'icon': ''
      }
    ]
  },
  {
    'name': i18n.t('menuList.liveBroadManage'),
    'url': '',
    'icon': 'order',
    'list': [
      {
        'name': i18n.t('menuList.liveRoomMerchand'),
        'url': 'live/prod/live-prod-store',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.liveRoomManage'),
        'url': 'live/room/liveRoom',
        'icon': ''
      },
      {
        'name': i18n.t('menuList.liveUser'),
        'url': 'live/room/liveUser',
        'icon': ''
      }
    ]
  }
]

export default menuList
