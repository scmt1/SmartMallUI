<template>
  <div class="mod-index-img">
    <el-dialog
      :title="!dataForm.imgId ? $t('brand.add') : $t('coupon.edit')"
      :close-on-click-modal="false"
      :visible.sync="visible"
      @close="closeDialogHandle"
    >
      <el-form
        :model="dataForm"
        ref="dataForm"
        :rules="dataRule"
        :label-width="this.$i18n.t('language') === 'language' ? '140px' : '100px'"
      >
        <el-form-item :label="$t('platform.carouselImg')" prop="imgUrl">
          <img-upload v-model="dataForm.imgUrl"></img-upload>
          <span v-if="dataForm.imgType === 0">{{$t('platform.recommImgSize')}}750*400</span>
          <span v-if="dataForm.imgType === 1">{{$t('platform.recommImgSize')}}1920*450</span>
        </el-form-item>
        <el-form-item :label="$t('brand.sequence')" prop="seq">
          <el-input v-model="dataForm.seq" type="number" min="0" size="small" max="2147483640" @change="seqCheck"></el-input>
        </el-form-item>
        <el-form-item :label="$t('brand.status')" prop="status">
          <el-radio-group v-model="dataForm.status">
            <el-radio :label="0">{{$t('publics.disable')}}</el-radio>
            <el-radio :label="1">{{$t('publics.normal')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('platform.platform')" prop="imgType">
          <el-radio-group v-model="dataForm.imgType">
            <el-radio :label="0">{{$t('platform.mobile')}}</el-radio>
            <el-radio :label="1">{{$t('platform.PCTerminal')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('sysManagement.type')" prop="type">
          <el-radio-group v-model="dataForm.type">
            <el-radio :label="-1">{{$t('distribUserWallet.nothing')}}</el-radio>
            <el-radio :label="0">{{$t('home.goods')}}</el-radio>
            <el-radio :label="1">链接</el-radio>
          </el-radio-group>
          <div v-if="dataForm.type ===0 && dataForm.relation!=null">
            <el-card :body-style="{ padding: '0px' }" class="index-image-prod-card" style="height: 160px;width: 120px">
              <prod-pic
                height="104px"
                width="100%"
                :pic="card.pic"
              ></prod-pic>
              <!-- todo: 商品已下架时展示状态 -->
              <div v-if="false" class="card-prod-status-tips">{{$t('publics.hadLowerShelf')}}</div>
              <div class="card-prod-bottom">
                <span style="width: 76px" class="card-prod-name">{{card.name}}</span>
                <div
                  class="card-prod-name-button default-btn text-btn"
                  @click="delPord"
                >{{$t('remindPop.delete')}}</div>
              </div>
            </el-card>
          </div>
          <div v-if="dataForm.relation==null">
            <div
              @click="addProd"
              v-if=" dataForm.type == 0"
              class="default-btn"
            >{{$t('coupon.selectGoods')}}</div>
            <!-- <el-button @click="addShop"
                       v-if=" dataForm.type == 1"
                       size="small">选择店铺</el-button>
            <el-button @click="addActivity"
                       v-if="dataForm.type == 2"
            size="small">选择活动</el-button>-->
          </div>
        </el-form-item>
        <el-form-item v-if="dataForm.type ===1" label="链接" prop="link">
          <el-input v-model="dataForm.link" placeholder="请输入跳转链接"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer">
      <div class="default-btn" @click="visible = false">{{$t("remindPop.cancel")}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t("remindPop.confirm")}}</div>
    </span>
    </el-dialog>

    <!-- 商品选择弹窗-->
    <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelect"
      :isSingle="true"
      @refreshSelectProds="selectIndexProd"
    ></prods-select>
  </div>
</template>

<script>
import ImgUpload from '@/components/img-upload'
import ProdsSelect from '@/components/prods-select'
import ProdPic from '@/components/prod-pic'
export default {
  data () {
    return {
      dataForm: {
        status: 1,
        des: '',
        imgUrl: '',
        seq: 0,
        imgType: 0,
        imgId: 0,
        link:'',
        type: -1,
        relation: null
      },
      // 关联数据
      card: {
        id: 0,
        pic: '',
        name: '',
        realData: {
          prod: [],
          shop: [],
          activity: []
        }
      },
      isSubmit: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataRule: {
        imgUrl: [
          { required: true, message: this.$i18n.t('platform.carouselImgNoNull'), trigger: 'blur' }
        ],
        seq: [
          { required: true, message: this.$i18n.t('platform.seqNONull'), trigger: 'blur' }
        ]
      },
      prodsSelectVisible: false,
      visible: false
    }
  },
  components: {
    ImgUpload,
    ProdsSelect,
    ProdPic
  },
  methods: {
    // 获取分类数据
    init (id) {
      this.visible = true
      this.isSubmit = false
      this.dataForm.imgId = id || 0
      this.$nextTick(() => {
        this.prodsSelectVisible = false
        this.$refs['dataForm'].resetFields()
      })
      if (this.dataForm.imgId) {
        // 获取产品数据
        this.$http({
          url: this.$http.adornUrl(`/platform/indexImg/info/${this.dataForm.imgId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm = data
          if (data.relation) {
            this.card.pic = data.pic.indexOf('http') > -1 ? data.pic : process.env.VUE_APP_RESOURCES_URL + data.pic
            this.card.name = data.prodName
            this.card.id = data.relation
          }
        })
      } else {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.dataForm.imgUrl = ''
          this.relation = null
        })
      }
    },
    // 检验输入顺序值
    seqCheck () {
      var maxNum = Math.round(this.dataForm.seq)
      if (!maxNum) {
        maxNum = 0
      } else if (maxNum < 0) {
        maxNum = 0
      } else if (maxNum > 2147483640) {
        maxNum = 2147483640
      }
      this.dataForm.seq = maxNum
    },
    // 表单提交
    dataFormSubmit () {
      if (this.dataForm.type === 0 && this.dataForm.relation == null) {
        this.$message({
          message: this.$i18n.t('marketing.pleaseSelectAProduct'),
          type: 'error',
          duration: 1500
        })
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (!this.dataForm.imgUrl) {
          return
        }
        let param = this.dataForm
        if (this.isSubmit) {
          return false
        }
        this.isSubmit = true
        this.$http({
          url: this.$http.adornUrl(`/platform/indexImg`),
          method: param.imgId ? 'put' : 'post',
          data: this.$http.adornData(param)
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('remindPop.success'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList', this.page)
            }
          })
        }).catch((e) => {
          this.isSubmit = false
        })
      })
    },
    // 打开选择商品
    addProd () {
      this.prodsSelectVisible = true
      this.$nextTick(() => {
        this.$refs.prodsSelect.init(this.card.realData.prod)
      })
    },    // 打开选择商品
    delPord () {
      this.dataForm.relation = null
    },
    // 添加指定商品
    selectIndexProd (prods) {
      this.card.realData.prods = prods
      if (prods.prodId) {
        this.dataForm.relation = prods.prodId
        this.card.pic = prods.pic.indexOf('http') > -1 ? prods.pic : process.env.VUE_APP_RESOURCES_URL + prods.pic
        this.card.name = prods.prodName
        this.card.id = prods.prodId
      } else {
        this.card = {}
        this.relation = null
      }
    },
    addShop () {
      alert(this.$i18n.t('publics.chooseStore'))
    },
    addActivity () {
      alert(this.$i18n.t('publics.selectActivity'))
    },
    // 关闭对话框回调
    closeDialogHandle () {
      this.prodsSelectVisible = false
      this.$refs['dataForm'].resetFields()
      this.dataForm.relation = null
      this.card = {
        id: 0,
        pic: '',
        name: '',
        realData: {
          prod: [],
          shop: [],
          activity: []
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.mod-index-img {
  .index-image-prod-card {
    position: relative;
    .card-prod-status-tips {
      position: absolute;
      right: 0;
      bottom: 54px;
      color: #fff;
      font-size: 12px;
      line-height: 16px;
      background-color:rgba(0, 0, 0, .3);
      padding: 3px 6px;
      border-top-left-radius: 4px;
    }
  }
}
.whether{
  padding-top: 10px;
  width: 100%;
  display: flex;
  justify-content:flex-end;
  border-top: 1px solid #eeeeee;

}
</style>
