export default {
  namespaced: true,
  state: {
    id: 0,
    skuTags: [],
    prodCategory: {},
    platProdCategory: {},
    storeProdCategory: {},
    defalutSku: {
      price: 0.01, // 销售价
      oriPrice: 0.01, // 市场价
      stocks: 0, // 库存
      properties: '', // 销售属性组合字符串
      skuName: '', // sku名称
      prodName: '', // 商品名称
      partyCode: '', // 商品编码
      weight: 0, // 商品重量
      volume: 0, // 商品体积
      status: 1 // 0 禁用 1 启用
    }

  },
  actions: {
    updateSkuTagAsync ({ commit, state }, { skuTag, index }) {
      index = parseInt(index)
      if (skuTag && typeof index === 'number') {
        const oldSkuTags = state.skuTags.slice(0)
        oldSkuTags.splice(index, 1, skuTag)
        commit('updateSkuTags', oldSkuTags)
      }
    }
  },
  mutations: {
    updateSkuTags (state, skuTags) {
      state.skuTags = skuTags
    },
    updateSkuTag (state, { skuTag, index }) {
      index = parseInt(index)
      if (skuTag && typeof index === 'number') {
        state.skuTags.splice(index, 1, skuTag)
      }
    },
    addSkuTag (state, skuTag) {
      state.skuTags.push(skuTag)
    },
    addProdCategory (state, prodCategory) {
      state.prodCategory = prodCategory
    },
    addPlatProdCategory (state, platProdCategory) {
      state.platProdCategory = platProdCategory
    },
    updatePlatProdCategory (state, { platProdCategory, selectUpdate }) {
      if (selectUpdate) {
        // 选择更新
        if (platProdCategory.firstCat) {
          state.platProdCategory.firstCat = platProdCategory.firstCat
        }
        if (platProdCategory.secondCat) {
          state.platProdCategory.secondCat = platProdCategory.secondCat
        }
        if (platProdCategory.threeCat) {
          state.platProdCategory.threeCat = platProdCategory.threeCat
        }
        if (platProdCategory.composeType) {
          state.platProdCategory.composeType = platProdCategory.composeType
        }
      } else {
        // 全部更新
        state.platProdCategory = platProdCategory
      }
    },
    addStoreProdCategory (state, storeProdCategory) {
      state.storeProdCategory = storeProdCategory
    },
    updateStoreProdCategory (state, { storeProdCategory, selectUpdate }) {
      if (selectUpdate) {
        // 选择更新
        if (storeProdCategory.firstCat) {
          state.storeProdCategory.firstCat = storeProdCategory.firstCat
        }
        if (storeProdCategory.composeType) {
          state.storeProdCategory.composeType = storeProdCategory.composeType
        }
      } else {
        state.storeProdCategory = storeProdCategory
      }
    },
    removeSkuTag (state, tagIndex) {
      state.skuTags.splice(tagIndex, 1)
      // if (!tagIndex) {
      //   state.skuTags = []
      // }
    },
    removeSkuTagItem (state, { tagIndex, tagItemIndex }) {
      state.skuTags[tagIndex].tagItems.splice(tagItemIndex, 1)
    },
    addSkuTagItem (state, { tagIndex, tagItem }) {
      state.skuTags[tagIndex].tagItems.push(tagItem)
      // state.skuTags[tagIndex].tagItems.splice(tagItemIndex, 0, tagItem)
    },
    updateSkuTagItem (state, { skuTagItem, tagIndex, tagItemIndex }) {
      if (skuTagItem) {
        state.skuTags[tagIndex].tagItems.splice(tagItemIndex, 1, skuTagItem)
      }
    }
  }
}
