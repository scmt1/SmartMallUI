<template>
  <!-- 路径图解读 -->
  <div class="path-analysis path-analysis-decipher">
    <div class="mod-tit">{{$t('dataAnalysis.interpretationOfPathMap')}}</div>
    <div class="part">
      <div class="item">
        <div class="icon">
          <i class="el-icon-search" />
        </div>
        <p class="tit">{{$t('dataAnalysis.enhancePageAccess')}}</p>
        <p class="sub-tit">{{$t('dataAnalysis.catchFlow')}}</p>
      </div>

      <div class="item">
        <div class="icon">
          <i class="el-icon-time" />
        </div>
        <p class="tit">{{$t('dataAnalysis.addStayTime')}}</p>
        <p class="sub-tit">{{$t('dataAnalysis.stayTimeText')}}</p>
      </div>

      <div class="item">
        <div class="icon">
          <i class="el-icon-data-line" />
        </div>
        <p class="tit">{{$t('dataAnalysis.reduceLoss')}}</p>
        <p class="sub-tit">{{$t('dataAnalysis.addPageChange')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {

  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
// 路径图解读
.path-analysis.path-analysis-decipher {
  margin-top: 50px;
  font-size: 14px;
  color: #333;
  margin-bottom: 50px;
  p {
    margin: 0;
  }
  .mod-tit {
    font-size: 18px;
    font-weight: bold;
    margin: 10px 0;
    margin-bottom: 20px;
  }

  .part {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    color: #333;
    .item {
      display: block;
      min-width: 25%;
      padding: 20px;
      background: #f7f8fa;
      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #155bd4;
        margin: 0 auto;
        margin-bottom: 15px;
        i {
          font-size: 25px;
          color: #fff;
        }
      }
      p.tit {
        margin-bottom: 10px;
        font-weight: bold;
        text-align: center;
      }
      p.sub-tit {
        color: #999;
        text-align: center;
      }
    }
    .item:not(:last-child) {
      margin-right: 20px;
    }
  }
}
</style>

