<template>
  <div class="mod-text base-section">
    <!-- 标题 -->
    <div class="text-header">
      <h3>{{$t('dataAnalysis.interpretationOfPathMap')}}</h3>
    </div>

    <!-- 主要内容 -->
    <!-- 一 -->
    <div class="main">
      <div class="main-one">
        <div class="one-icon">
          <span>
            <i class="el-icon-search"></i>
          </span>
        </div>
        <div class="one-text">
          <div>{{$t('dataAnalysis.enhancePageAccess')}}</div>
          <div class="color-grey">{{$t('dataAnalysis.catchFlow')}}</div>
        </div>
      </div>
    </div>

    <!-- 二 -->
    <div class="main">
      <div class="main-one">
        <div class="one-icon">
          <span>
            <i class="el-icon-time"></i>
          </span>
        </div>
        <div class="one-text">
          <div>{{$t('dataAnalysis.addStayTime')}}</div>
          <div class="color-grey">{{$t('dataAnalysis.stayTimeText')}}</div>
        </div>
      </div>
    </div>

    <!-- 三 -->
    <div class="main">
      <div class="main-one">
        <div class="one-icon">
          <span>
            <i class="el-icon-data-line"></i>
          </span>
        </div>
        <div class="one-text">
          <div>{{$t('dataAnalysis.reduceLoss')}}</div>
          <div class="color-grey">{{$t('dataAnalysis.addPageChange')}}</div>
        </div>
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
.mod-text {
  .text-header h3 {
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    padding-bottom: 10px;
  }
  .main {
    margin-top: 20px;
  }
  .main .main-one {
    display: flex;
  }
  .main .main-one .one-icon {
    height: 60px;
    width: 60px;
    text-align: center;
  }
  .main .main-one .one-icon span {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    display: block;
    border: 1px #0c72b6 solid;
  }
  .main .main-one .one-icon span i {
    font-size: 22px;
    color: #0c72b6;
    padding-top: 8px;
  }
  .main .main-one .one-text div {
    // height: 26px;
    line-height: 26px;
  }
  .main .main-one .one-text .color-grey {
    color: #a7a6a6;
  }
  .main .main-one .one-text div a {
    color: #0b5cc5;
    text-decoration: none;
  }
}
</style>

