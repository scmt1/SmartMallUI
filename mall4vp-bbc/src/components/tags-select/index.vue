<template>
  <div>
    <el-dialog
      :title="$t('platform.selectTag')"
      :visible.sync="visible"
      width="40%"
      class="el-upload-list el-upload-list--picture-card"
    >
      <el-form :inline="true" :model="searchForm" class="demo-form-inline form">
        <el-form-item>
          <el-input v-model="tagName" size="medium" :placeholder="$t('user.tagTip1')" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <div
            class="default-btn primary-btn"
            @click="searchChange"
          >{{$t("pictureManager.query")}}</div>
        </el-form-item>
      </el-form>
      <el-main>
        <div class="main">
          <div v-for="(item, index) in tagList" :key="index">
            <span
              :class="active.includes(item)?'active':'Classification'"
              @click="oncheck(item)"
            >{{item.tagName}}</span>
          </div>
        </div>
        <div v-if="tagList.length < 1">{{$t('order.noData')}}</div>
      </el-main>

      <!-- 分页 -->
      <el-pagination
        v-if="tagList.length"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
      <!-- /分页 -->
      <div class="default-btn" @click="visible = false">{{$t('remindPop.cancel')}}</div>
      <div class="default-btn primary-btn" @click="confirm">{{$t('remindPop.confirm')}}</div>
    </el-dialog>
  </div>
</template>


<script>
export default {

  data () {
    return {
      visible: false,
      dataForm: {
        tagList: [], // 标签
        userIds: []
      },
      tagList: [], // 标签
      selectedTags: [],
      dataRule: {
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataListLoading: false,
      active: [], // 选中的标签
      searchForm: {
        tagType: null, // 标签类型0手动1条件2系统
        tagName: null
      },
      tagName: null,
      allList: []
    }
  },
  components: {
  },
  props: {
    value: {
      default: '',
      type: String
    },
    // 最大上传数量
    limit: {
      default: 9,
      type: Number
    }
  },
  mounted () {
  },
  activated () {
    this.getTagList()
  },
  methods: {
    init (data) {
      this.active = []
      this.allList = []
      this.searchForm.tagName = ''
      this.tagName = ''
      this.visible = true
      this.tagName = ''
      this.searchForm.tagName = ''
      if(data.length > 0) {
        this.allList = data
      }
      this.getTagList()
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getTagList(this.page)
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.currentPage = val
      this.getTagList(this.page)
    },
    // 分页获取标签
    getTagList (page) {
      this.active = []
      let allList = this.allList.map(x => x.userTagId)
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/user/userTag/byTagType'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            this.searchForm
          )
        )
      }).then(({ data }) => {
        this.tagList = data.records
        if(allList.length > 0) {
          this.tagList.forEach(x => {
            if(allList.indexOf(x.userTagId) > -1) {
              this.active.push(x)
            }
          })
        }
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 搜索
    searchChange () {
      this.searchForm.tagName = this.tagName
      this.getTagList(this.page)
    },
    // 多选
    oncheck (item) {
      if (this.active.includes(item)) {
        this.allList = this.allList.filter(x => {
          return x.userTagId !== item.userTagId
        })
        this.active = this.active.filter(x => {
          return x.userTagId !== item.userTagId
        })
      } else {
        this.active.push(item)
        this.allList.push(item)
      }
    },
    confirm () {
      if (!this.allList.length) {
        this.visible = false
        return
      }
      this.dataForm.tagList = []
      let arr = []
      this.allList.forEach(item => {
        arr.push({ 'userTagId': item.userTagId, 'tagName': item.tagName })
        this.dataForm.tagList.push(item.userTagId)
      })
      this.$emit('refreshTagsArr', arr, this.allList)
      arr = []
      this.active = []
      this.allList = []
      this.dataForm.tagList = []
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.active {
  float: left;
  margin-left: 10px;
  padding: 10px;
  background: #e6a23c;
  margin-bottom: 10px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}
.Classification {
  float: left;
  margin-left: 10px;
  padding: 10px;
  background: #f7f7f7;
  margin-bottom: 10px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}
</style>
