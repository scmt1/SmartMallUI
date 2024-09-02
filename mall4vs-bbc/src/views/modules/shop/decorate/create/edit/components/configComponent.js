import Vue from 'vue';
export const configComponentList = [
    {
        type: 'shop_signs', // 当前组件类型(唯一)
        currentType: 'basic', // 当前组件属于哪个栏目(大类)
        title: 'businessSigns', // 组件的标题文字
        pic: require('@/assets/img/pc-micro-page/pc_shop_signs.png'), // 组件的默认图片
        picActive: require('@/assets/img/pc-micro-page/pc_shop_signs_active.png'), // 组件的激活图片
        components: 'storeSignate', // 组件所对应的组件名
        rightConfigTitle: 'businessSigns', // 组件所对应的配置信息标题
        Ref: 'shopSignsTools', // 这个组件每个对应ref
        rightConfigMessage: {},
    },
    {
        type: 'picture_by',
        currentType: 'basic',
        title: 'pictureBy',
        pic: require('@/assets/img/pc-micro-page/pc_picture_by.png'),
        picActive: require('@/assets/img/pc-micro-page/pc_picture_by_active.png'),
        components: 'pictureShuffling', 
        rightConfigTitle: 'pictureBy',
        Ref: 'pictureByTools', // 这个组件每个对应ref
        rightConfigMessage: {}, 
    },
    {
        type: 'auxiliary_interval',
        currentType: 'basic',
        title: 'AuxiliaryInterval',
        pic: require('@/assets/img/pc-micro-page/pc_auxiliary_interval.png'),
        picActive: require('@/assets/img/pc-micro-page/pc_auxiliary_interval_active.png'),
        components: 'intervalComponent',
        rightConfigTitle: 'AuxiliaryInterval',
        Ref: 'auxiliaryIntervalTools', // 这个组件每个对应ref
        rightConfigMessage: {}, 
    },
    {
        type: 'floor_title',
        currentType: 'basic',
        title: 'floorTitle',
        pic: require('@/assets/img/pc-micro-page/pc_floor_title.png'),
        picActive: require('@/assets/img/pc-micro-page/pc_floor_title_active.png'),
        components: 'floorTitleComponent',
        rightConfigTitle: 'floorTitle',
        Ref: 'floorTitleTools', // 这个组件每个对应ref
        rightConfigMessage: {}, // 右边配置信息
    },
    {
        type: 'goods_list',
        currentType: 'basic',
        title: 'goodsList',
        pic: require('@/assets/img/pc-micro-page/pc_store_list.png'),
        picActive: require('@/assets/img/pc-micro-page/pc_store_list_active.png'),
        components: 'goodListComponent',
        rightConfigTitle: 'goodsList',
        Ref: 'goodsListTools', // 这个组件每个对应ref
        rightConfigMessage: {}, // 右边配置信息
    },
    {
        type: 'universal_hotspot',
        currentType: 'basic',
        title: 'UniversalHotspot',
        pic: require('@/assets/img/pc-micro-page/pc_universal_hotspot.png'),
        picActive: require('@/assets/img/pc-micro-page/pc_universal_hotspot_active.png'),
        components: 'hotSpotComponent',
        rightConfigTitle: 'UniversalHotspot',
        Ref: 'universalHotspotTools',
        rightConfigMessage: {}, // 右边配置信息
    },
    // {
    //     type: 'store_list',
    //     currentType: 'basic',
    //     title: 'storeList',
    //     pic: require('@/assets/img/pc-micro-page/pc_store_list.png'),
    //     picActive: require('@/assets/img/pc-micro-page/pc_store_list_active.png'),
    //     components: 'storeListComponent',
    //     rightConfigTitle: 'storeList',
    //     Ref: 'storeListTools',
    //     rightConfigMessage: {}, // 右边配置信息
    // },
    {
        type: 'limited_skill',
        currentType: 'mark_activity',
        title: 'limitedKill',
        pic: require('@/assets/img/pc-micro-page/pc_limited_skill.png'),
        picActive: require('@/assets/img/pc-micro-page/pc_limited_skill_active.png'),
        components: 'limitedSkillComponent',
        rightConfigTitle: 'limitedKill',
        Ref: 'limitedSkillTools',
        rightConfigMessage: {}, // 右边配置信息
    },
    {
        type: 'discount_coupon',
        currentType: 'mark_activity',
        title: 'discountCoupon',
        pic: require('@/assets/img/pc-micro-page/pc_discount_coupon.png'),
        picActive: require('@/assets/img/pc-micro-page/pc_discount_coupon_active.png'),
        components: 'discountCouponComponent',
        rightConfigTitle: 'discountCoupon',
        Ref: 'discountCouponTools',
        rightConfigMessage: {}, // 右边配置信息
    },
    {
        type: 'goods_module1',
        currentType: 'extend_component',
        title: 'goodsModule1',
        pic: require('@/assets/img/pc-micro-page/pc_goods_module.png'),
        picActive: require('@/assets/img/pc-micro-page/pc_goods_module_active.png'),
        components: 'goodsModuleComponentOne',
        rightConfigTitle: 'goodsModule1',
        Ref: 'goodsModule1Tools',
        rightConfigMessage: {}, // 右边配置信息
    },
    {
        type: 'goods_module2',
        currentType: 'extend_component',
        title: 'goodsModule2',
        pic: require('@/assets/img/pc-micro-page/pc_goods_module.png'),
        picActive: require('@/assets/img/pc-micro-page/pc_goods_module_active.png'),
        components: 'goodsModuleComponentTwo',
        rightConfigTitle: 'goodsModule2',
        Ref: 'goodsModule2Tools',
        rightConfigMessage: {}, // 右边配置信息
    },
    {
        type: 'goods_module3',
        currentType: 'extend_component',
        title: 'goodsModule3',
        pic: require('@/assets/img/pc-micro-page/pc_goods_module.png'),
        picActive: require('@/assets/img/pc-micro-page/pc_goods_module_active.png'),
        components: 'goodsModuleComponentThree',
        rightConfigTitle: 'goodsModule3',
        Ref: 'goodsModule3Tools',
        rightConfigMessage: {}, // 右边配置信息
    },
    {
        type: 'goods_module4',
        currentType: 'extend_component',
        title: 'goodsModule4',
        pic: require('@/assets/img/pc-micro-page/pc_goods_module.png'),
        picActive: require('@/assets/img/pc-micro-page/pc_goods_module_active.png'),
        components: 'goodsModuleComponentFour',
        rightConfigTitle: 'goodsModule4',
        Ref: 'goodsModule4Tools',
        rightConfigMessage: {}, // 右边配置信息
    },
    {
        type: 'goods_module5',
        currentType: 'extend_component',
        title: 'goodsModule5',
        pic: require('@/assets/img/pc-micro-page/pc_goods_module.png'),
        picActive: require('@/assets/img/pc-micro-page/pc_goods_module_active.png'),
        components: 'goodsModuleComponentFive',
        rightConfigTitle: 'goodsModule5',
        Ref: 'goodsModule5Tools',
        rightConfigMessage: {}, // 右边配置信息
    }
]