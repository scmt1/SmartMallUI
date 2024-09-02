export default {
  name: 'templateList',
  data () {
    return {
      templateList: [], // 列表页
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      perProps: {
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示多少条
        total: 0 // 总数
      }
    }
  },
  mounted () {
    // 获取微页面列表
    this.getMiniPageList()
  },
  methods: {
    // 获取微页面列表
    getMiniPageList () {
      let { pageNum, pageSize } = this.perProps
      this.$http({
        url: this.$http.adornUrl('/shop/shopTemplate/pageMove'),
        methods: 'get',
        params: this.$http.adornParams({
          current: pageNum, // 当前页
          size: pageSize, // 每页显示多少条
          type: 2 // 1表示pc端，2表示移动端
        })
      }).then(({ data }) => {
        data.records.forEach(item => {
          if (!item.image) {
            item.image = ''
          } else if (item.image.indexOf('http') < 0) {
            item.image = this.resourcesUrl + item.image
          }
        })
        this.templateList = data.records
        this.perProps.total = data.total
      }).catch((error) => {
        // console.log('err', error)
      })
    },
    // 复制模板
    copyTemplatePage (templateId) {
      this.$http({
        url: this.$http.adornUrl(`/shop/shopTemplate/copyMove/${templateId}`),
        method: 'POST'
      }).then(({ data }) => {
        this.$newMessage.success(this.$i18n.t('shopFeature.template.copySuccess'))
        this.getMiniPageList()
      }).catch((error) => {
        // console.log('err', error)
      })
    },
    // 新建微页面
    goCreatePage () {
      let newPage = this.$router.resolve({
        path: '/shop-feature/create/edit/index',
        query: {
          type: 'add',
          template: '1'
        }
      })
      window.open(newPage.href, '_blank', 'noopener,noreferrer')
    },
    // 每页数
    sizeChangeHandle (val) {
      this.perProps.pageSize = val
      this.getMiniPageList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.perProps.pageNum = val
      this.getMiniPageList()
    },
    // 编辑
    handleEdit (templateId) {
      let newPage = this.$router.resolve({
        path: '/shop-feature/create/edit/index',
        query: {
          templateId: templateId,
          type: 'edit',
          template: '1'
        }
      })
      window.open(newPage.href, '_blank', 'noopener,noreferrer')
    },
    // 删除
    handleDelete (renovationId) {
      this.$confirm(this.$i18n.t('shopFeature.list.deleteTips'), this.$i18n.t('shopFeature.list.tips'), {
        confirmButtonText: this.$i18n.t('shopFeature.edit.confirm'),
        cancelButtonText: this.$i18n.t('shopFeature.edit.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/shop/shopTemplate/deleteMove/' + renovationId),
          method: 'delete'
        }).then(({ data }) => {
          let totalPage = Math.ceil((this.perProps.total - 1) / this.perProps.pageSize)
          let currentPage = this.perProps.pageNum > totalPage ? totalPage : this.perProps.pageNum
          this.perProps.pageNum = currentPage < 1 ? 1 : currentPage
          this.$newMessage.success(this.$i18n.t('shopFeature.list.deleteSuccess'))
          this.getMiniPageList()
        }).catch((error) => {
          // console.log('err', error)
        })
      }).catch(() => {

      })
    }
  }
}
