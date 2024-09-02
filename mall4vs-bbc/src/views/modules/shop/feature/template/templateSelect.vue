<template>
  <el-dialog
    :title="$t('shopFeature.template.selectTemplate')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%"
  >
    <div class="template-list">
      <div class="main-container">
          <div class="card-item-card">
            <div class="card-item card-item-first" @click="selectTemplate(-1)">
              <div>
                <div class="template-item template-item-first">
                  <i class="el-icon-plus"></i>
                </div>
              </div>
              <div class="title title-first">
                {{$t('shopFeature.template.blank')}}
              </div>
            </div>            
          </div>

          <div v-for="(item, index) in templateList" :key="index" class="card-item-card">
            <div class="card-item" @click="selectTemplate(item.templateId)">
              <div class="template-item">
                <img v-if="item.image" :src="item.image" />
                <img v-else src="~@/assets/img/def.png" />
              </div>
              <div class="title">
                {{item.name}}
              </div>
            </div>
          </div>
        <!-- </div> -->
        <!-- <el-empty v-else class="empty-form" :description="$t('shop.noData')"></el-empty> -->
      </div>

      <el-pagination
        v-if="templateList.length"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="perProps.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="perProps.pageSize"
        :total="perProps.total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>  
    </div>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        templateList: [],
        resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
        visible: false,
        perProps: {
          pageNum: 1, // 当前页
          pageSize: 10, // 每页显示多少条
          total: 0 // 总数
        }
      }
    },
    mounted () {
    },
    methods: {
      init () {
        this.getMiniPageList()
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
          this.visible = true
        }).catch((error) => {
          // console.log('err', error)
        })
      },
      selectTemplate (id) {
        this.$emit('selectTemplate', id)
        this.visible = false
      }
    }
  }
</script>

<style lang="scss" scoped>
.template-list {
  .new-page {
    margin-left: 10px;
  }
  .main-container {
    display: flex;
    flex-wrap: wrap;
    .card-item-card {
      margin: 20px 10px 20px 10px;
      cursor: pointer;
      width: 150px;
    }
    .card-item-card:not(:first-child) {
      margin-left: 10px;
    }
    .template-item-first {
      display: flex;
      border: 1px solid #EBEEF5;
      align-items: center;
      justify-content: center;
    }
    .template-item-first:hover {
      border: 1px solid #155BD4;
    }
    .template-item {
      width: 153px;
      height: 204px;
      border-radius: 4px;
    }
    .template-item:hover img {
      border: 1px solid #155BD4;
    }
    .card-item-first {
      width: 150px;
      position: relative;
    }
    .card-item {
      float: left;
      background: #FFFFFF;
      img {
        width: 100%;
        height: 204px;
        border-radius: 4px;
      }
      .title-first {
        text-align: center;
        width: 100%;
      }
      .title {
        color: #000000;
        font-size: 14px;
        margin-top: 16px;
        text-align: center;
        display: -webkit-box;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        max-width: 153px;
      }
    }
  }

}
  .empty-form {
    margin-top: 150px;
  }
</style>
