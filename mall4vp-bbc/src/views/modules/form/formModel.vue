<template>
  <div class="mod-order-order">
    <div class="main-container">
      <div class="card-item" v-for="form in formList" :key="form.id">
        <el-card shadow="never" class="card-item-card">
          <div slot="header" class="clearfix title">
            <el-tooltip v-if="form.formName.length > 12" effect="light" placement="top">
              <span slot="content">
                {{form.formName.substring(0,25)}}
                <br v-if="form.formName.length>25" />
                {{form.formName.substring(25,50)}}
                <br v-if="form.formName.length>50" />
                {{form.formName.substring(50,75)}}
                <br v-if="form.formName.length>75" />
                {{form.formName.substring(75,1000)}}
              </span>
              <div class="hid">{{form.formName}}</div>
            </el-tooltip>
            <span v-else>{{form.formName}}</span>
          </div>
          <div class="title-text">
            <el-tooltip effect="light" placement="top">
              <div slot="content">
                {{form.content.substring(0,25)}}
                <br v-if="form.content.length>25"/>
                {{form.content.substring(25,50)}}
                <br v-if="form.content.length>50"/>
                {{form.content.substring(50,75)}}
                <br v-if="form.content.length>75"/>
                {{form.content.substring(75,1000)}}
              </div>
              <span>{{form.content}}</span>
            </el-tooltip>
            <!-- <el-tooltip placement="top">
                  <div slot="content">
                    {{form.content.length}}
                    <br />第二行信息
                  </div>
                  <span>{{form.content}}</span>
            </el-tooltip>-->
          </div>
          <div class="content-container">
            <div class="content">
              <span>{{$t("formData.timePeriod")}}：</span>
              <span class="content-item">{{$t("formData.natural")}} + {{form.timeType === 1?$t("formData.day"):form.timeType === 2?$t("formData.week"):$t('formData.month')}}</span>
            </div>
            <div class="content">
              <span>{{$t("formData.timeLimit")}}：</span>
              <span
                class="content-item"
              >{{$t('formData.near')}}{{form.timeRamge}}{{form.timeType === 1?$t('formData.day'):form.timeType === 2?$t('formData.week'):$t('formData.month')}}</span>
            </div>
            <div class="content">
              <span>{{$t('formData.numberOfIndicators')}}：</span>
              <span class="content-item">{{form.formItemList.length}}个</span>
            </div>
            <div class="content-last">
              <span class="content-title">{{$t('formData.reportIndicators')}}：</span>
              <span class="content-last-item">
                <el-tooltip effect="light" placement="top">
                  <div slot="content">
                    {{form.formItems.substring(0,25)}}
                    <br v-if="form.formItems.length>25"/>
                    {{form.formItems.substring(25,50)}}
                    <br v-if="form.formItems.length>50"/>
                    {{form.formItems.substring(50,75)}}
                    <br v-if="form.formItems.length>75"/>
                    {{form.formItems.substring(75,1000)}}
                  </div>
                  <span>{{form.formItems}}</span>
                </el-tooltip>
              </span>
            </div>
          </div>
          <div style="text-align:center;">
            <div class="default-btn primary-btn" @click="addHandle(form.formId)">{{$t("formData.addPlatformReport")}}</div>
          </div>
        </el-card>
      </div>
      <div v-if="formList.length === 0" class="noData">{{$t("formData.noData")}}</div>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './form-add-or-update'
export default {
  data () {
    return {
      dataForm: {},
      dateRange: [],
      formList: [],
      status: null,
      addVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataListLoading: false
    }
  },
  components: {
    AddOrUpdate
  },
  mounted () {
    // 携带参数查询
    var query = this.$route.query
    if (Object.keys(query).length > 0) {
      this.getDataList(this.page, query)
    } else {
      this.getDataList()
    }
    // 监听页面滚动
    window.addEventListener('scroll', this.scrollToTop)
  },
  watch: {

  },
  methods: {
    /**
     * 页面滚动事件
     */
    scrollToTop () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.showHeadScroll = scrollTop > 400
    },
    /**
     * 获取数据列表
     */
    getDataList (page, params) {
      page = (page === undefined ? this.page : page)
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/platform/form/getRecommendFormList'),
        method: 'get'
      }).then(({ data }) => {
        this.formList = data
        this.formList.forEach(form => {
          var items = ''
          form.formItemList.forEach(item => {
            items = items + item.value + '、'
          })
          items = items.substring(0, items.length - 1)
          form.formItems = items
        })
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addHandle (id) {
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, true)
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    }
  },
  destroyed () {
    // 页面销毁时移除监听
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
<style lang="scss" scoped>
.mod-order-order {
  .main-container {
    .card-item {
      float: left;
      width: 298px;
      background: #FFFFFF;
      margin: 5px 10px 15px 10px;
      .card-item-card {
        border-radius: 0;
      }
      &:hover {
        .card-item-card {
          border: 1px solid #155BD4;
        }
      }
      &::v-deep .el-card__body {
        padding: 15px;
      }
    }
    .card-item:last-child {
      margin-bottom: 25px;
    }
    .title-text {
      width: 100%;
      height: 65px;
      color: #989898;
      font-size: 14px;
      line-height: 22px;
      word-break: break-word;
      word-wrap:break-word;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
    .content-container {
      border: 1px solid #eee;
      border-left: none;
      border-right: none;
      padding: 15px 0;
      margin: 15px 0;
    }
  }
}
.car {
  width: 240px;
  float: left;
  margin: 0px 10px 20px 10px;
}
.title {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
.title .hid {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5em;
}
.title-text {
  width: 100%;
  height: 65px;
  color: #989898;
  font-size: 14px;
  line-height: 22px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.content {
  color: #989898;
  font-size: 14px;
  line-height: 30px;
}
.content-title {
  float: left;
  width: 72px;
}
.content-item {
  color: #303030;
}
.content-last {
  height: 65px;
  color: #989898;
  font-size: 14px;
  line-height: 30px;
}
.content-last-item {
  float: left;
  line-height: 20px;
  width: 184px;
  color: #303030;
  padding-top: 5px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.noData {
  color: #8f9092;
  text-align: center;
  margin-top: 13%;
}
</style>
