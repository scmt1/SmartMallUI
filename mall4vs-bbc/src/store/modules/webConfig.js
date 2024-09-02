export default {
  namespaced: true,
  state: localStorage.getItem('webConfigData') ? JSON.parse(localStorage.getItem('webConfigData')) : {
    bsLoginLogoImg: null,
    bsLoginBgImg: null,
    bsCopyrightCn: null,
    bsCopyrightEn: null,
    bsTitleContentCn: null,
    bsTitleContentEn: null,
    bsTitleImg: null,
    bsMenuTitleOpenCn: null,
    bsMenuTitleOpenEn: null,
    bsMenuTitleCloseCn: null,
    bsMenuTitleCloseEn: null
  },
  mutations: {
    addData (state, webConfigDataForm) {
      localStorage.setItem('webConfigData', JSON.stringify(webConfigDataForm || '{}'))
      let lang = localStorage.getItem('lang')
      if (lang !== 'en') {
        document.title = webConfigDataForm.bsTitleContentCn || ''
      } else {
        document.title = webConfigDataForm.bsTitleContentEn || ''
      }

      let facicon = document.querySelector('link[rel="icon"]')
      if (facicon !== null) {
        facicon.href = webConfigDataForm.bsTitleImg
      } else {
        facicon = document.createElement('link')
        facicon.rel = 'icon'
        facicon.href = webConfigDataForm.bsTitleImg
        document.head.appendChild(facicon)
      }
    }
  }
}
