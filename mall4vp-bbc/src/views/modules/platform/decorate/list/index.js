import templateSelect from '../template/templateSelect.vue'

export default {
  name: 'pcDecorateList',
  data () {
    return {
      miniPageList: [], // 列表页
      perProps: {
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示多少条
        total: 0 // 总数
      },
      isShowtemplateSelect: false
    }
  },
  mounted () {
    // 获取微页面列表
    this.getMiniPageList()
  },
  components: {
    templateSelect
  },
  methods: {
    // 获取微页面列表
    getMiniPageList () {
      let { pageNum, pageSize } = this.perProps
      this.$http({
        url: this.$http.adornUrl('/platform/shopRenovation/pagePC'),
        methods: 'get',
        params: this.$http.adornParams({
          current: pageNum, // 当前页
          size: pageSize, // 每页显示多少条
          renovationType: 1 // 1表示pc端，2表示移动端
        })
      }).then(({ data }) => {
        this.miniPageList = data.records
        this.perProps.total = data.total
      }).catch((error) => {
        // console.log('err', error)
      })
    },
    // 新建微页面
    goCreatePage (id) {
      // 跳转到装修页面
      let obj = {
        type: 'add',
        template: '0'
      }
      if (id > -1) {
        obj['templateId'] = id
      }
      let newPage = this.$router.resolve({
        path: '/platform-decorate/create/edit/index',
        query: obj
      })
      window.open(newPage.href, '_blank', 'noopener,noreferrer')
    },
    newPageSelect () {
      this.isShowtemplateSelect = true
      this.$nextTick(() => {
        this.$refs.templateSelect.init()
      })
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
    handleEdit (row) {
      let newPage = this.$router.resolve({
        path: '/platform-decorate/create/edit/index',
        query: {
          renovationId: row.renovationId,
          type: 'edit',
          template: '0'
        }
      })
      window.open(newPage.href, '_blank', 'noopener,noreferrer')
    },
    // 删除
    handleDelete (item) {
      this.$confirm(this.$i18n.t('shopFeature.list.deleteTips'), this.$i18n.t('shopFeature.list.tips'), {
        confirmButtonText: this.$i18n.t('shopFeature.edit.confirm'),
        cancelButtonText: this.$i18n.t('shopFeature.edit.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/platform/shopRenovation/operate/deletePC/' + item.renovationId),
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
    },
    // 设置为主页
    handleSetHomePage (renovationId) {
      const that = this
      this.$http({
        url: this.$http.adornUrl('/platform/shopRenovation/operate/updateHomePagePC/' + renovationId),
        method: 'put'
      }).then(({ data }) => {
        that.$newMessage.success(this.$i18n.t('shopFeature.list.operSuccess'))
        that.getMiniPageList()
      }).catch((error) => {
        // console.log('err', error)
      })
    },
    // 查看
    handleSelect (item) {
      let newPage = this.$router.resolve({
        path: '/platform-decorate/create/select-decorate/index',
        query: {
          renovationId: item.renovationId,
          type: 'detail'
        }
      })
      window.open(newPage.href, '_blank', 'noopener,noreferrer')
    }
  }
}
