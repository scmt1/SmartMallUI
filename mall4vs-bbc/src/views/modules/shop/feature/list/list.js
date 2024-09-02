import './list.scss'
import templateSelect from '../template/templateSelect.vue'

export default {
  name: 'FeatureList',
  components: {
    templateSelect
  },
  data () {
    return {
      miniPageList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      isShowtemplateSelect: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      }
    }
  },
  computed: {},
  mounted () {
    // 获取微页面列表
    this.getMiniPagesList()
  },
  // activated () {
  //   // 获取微页面列表
  //   this.getMiniPagesList()
  // },
  methods: {
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getMiniPagesList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getMiniPagesList()
    },
    /**
     * 获取微页面列表
     */
    getMiniPagesList () {
      if (this.pageIndex) {
        let size = Math.ceil(this.totalPage / this.pageSize)
        this.pageIndex = (this.pageIndex > size ? size : this.pageIndex) || 1
      }
      this.$http({
        url: this.$http.adornUrl('/shop/shopRenovation/pageMove'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: this.pageIndex,
              size: this.pageSize,
              renovationType: 2 // 1表示pc端，2表示移动端
            }
          )
        )
      }).then(({ data }) => {
        this.miniPageList = data.records
        this.totalPage = data.total
      }).catch((error) => {
        console.log('err', error)
      })
    },
    // 选择模板
    newPageSelect () {
      this.isShowtemplateSelect = true
      this.$nextTick(() => {
        this.$refs.templateSelect.init()
      })
    },
    /** 跳转编辑页面 */
    goCreatePage (id) {
      // this.$router.push({
      //   path: '/shop-feature/create/edit/index'
      // })
      let obj = {
        type: 'add',
        template: '0'
      }
      if (id > -1) {
        obj['templateId'] = id
      }
      let newPage = this.$router.resolve({
        path: '/shop-feature/create/edit/index',
        query: obj
      })
      window.open(newPage.href, '_blank', 'noopener,noreferrer')
    },
    /** 点击编辑 */
    handleEdit (item) {
      // this.$router.push({
      //   path: '/shop-feature/create/edit/index',
      //   query: {
      //     renovationId: item.renovationId,
      //     type: 'edit'
      //   }
      // })
      let newPage = this.$router.resolve({
        path: '/shop-feature/create/edit/index',
        query: {
          renovationId: item.renovationId,
          type: 'edit',
          template: '0'
        }
      })
      window.open(newPage.href, '_blank', 'noopener,noreferrer')
    },
    /** 点击删除 */
    handleDelete (item) {
      let ids = item ? [item] : this.dataListSelections.map(item => {
        return item.renovationId
      })
      this.$confirm(this.$i18n.t('shopFeature.list.deleteTips'), this.$i18n.t('shopFeature.list.tips'), {
        confirmButtonText: this.$i18n.t('shopFeature.edit.confirm'),
        cancelButtonText: this.$i18n.t('shopFeature.edit.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/shop/shopRenovation/deleteMove/' + item.renovationId),
          method: 'delete'
        }).then(({ data }) => {
          this.totalPage = this.totalPage - ids.length
          let totalPage = Math.ceil((this.totalPage - 1) / this.pageSize)
          let currentPage = this.pageIndex > totalPage ? totalPage : this.pageIndex
          this.pageIndex = currentPage < 1 ? 1 : currentPage
          this.$newMessage.success(this.$i18n.t('shopFeature.list.deleteSuccess'))
          this.getMiniPagesList()
        }).catch((error) => {
          console.log('err', error)
        })
      }).catch(() => {

      })
    },

    /**
     * 设置主页
     */
    handleSetHomePage (renovationId) {
      this.$http({
        url: this.$http.adornUrl('/shop/shopRenovation/updateHomePageMove/' + renovationId),
        method: 'put'
      }).then(({ data }) => {
        console.warn(data)
        this.$newMessage.success(this.$i18n.t('shopFeature.list.operSuccess'))
        this.getMiniPagesList()
      }).catch((error) => {
        console.log('err', error)
      })
    },
    // 查看
    handleSelect (item) {
      let newPage = this.$router.resolve({
        path: '/shop-feature/create/edit/index',
        query: {
          renovationId: item.renovationId,
          type: 'detail'
        }
      })
      window.open(newPage.href, '_blank', 'noopener,noreferrer')
    }
  }
}
