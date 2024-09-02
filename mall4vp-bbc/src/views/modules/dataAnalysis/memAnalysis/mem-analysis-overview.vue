<template>
  <div class="customer-overview">
    <div class="statis-item" v-on:click="clickStatis()" checked>
      <h4 class="statis-item__title">{{$t('dataAnalysis.cumulativeNumberOfMembers')}}</h4>
      <p class="statis-item__data">0</p>
      <span class="change-trend change-trend--decline">
        <span class="change-trend__title">{{$t('dataAnalysis.compareWithThePreviousOneDay')}}</span>
        <span class="change-trend__data">
          <i class="zenticon zenticon-arrow-down"></i>-
        </span>
      </span>
    </div>
    <div class="statis-item" v-on:click="clickStatis()">
      <h4 class="statis-item__title">{{$t('dataAnalysis.numberOfNewMembers')}}</h4>
      <p class="statis-item__data">0</p>
      <span class="change-trend change-trend--decline">
        <span class="change-trend__title">{{$t('dataAnalysis.compareWithThePreviousOneDay')}}</span>
        <span class="change-trend__data">
          <i class="zenticon zenticon-arrow-down"></i>-
        </span>
      </span>
    </div>
    <div class="statis-item" v-on:click="clickStatis()">
      <h4 class="statis-item__title">{{$t('dataAnalysis.numberOfPaidMembers')}}</h4>
      <p class="statis-item__data">0</p>
      <span class="change-trend change-trend--decline">
        <span class="change-trend__title">{{$t('dataAnalysis.compareWithThePreviousOneDay')}}</span>
        <span class="change-trend__data">
          <i class="zenticon zenticon-arrow-down"></i>-
        </span>
      </span>
    </div>
    <div class="statis-item" v-on:click="clickStatis()">
      <h4 class="statis-item__title">{{$t('dataAnalysis.numberOfStoredValueMembers')}}</h4>
      <p class="statis-item__data">0</p>
      <span class="change-trend change-trend--decline">
        <span class="change-trend__title">{{$t('dataAnalysis.compareWithThePreviousOneDay')}}</span>
        <span class="change-trend__data">
          <i class="zenticon zenticon-arrow-down"></i>-
        </span>
      </span>
    </div>
    <div class="statis-item" v-on:click="clickStatis()">
      <h4 class="statis-item__title">{{$t('dataAnalysis.numberOfCouponMembers')}}</h4>
      <p class="statis-item__data">0</p>
      <span class="change-trend change-trend--decline">
        <span class="change-trend__title">{{$t('dataAnalysis.compareWithThePreviousOneDay')}}</span>
        <span class="change-trend__data">
          <i class="zenticon zenticon-arrow-down"></i>-
        </span>
      </span>
    </div>
    <div class="statis-item" v-on:click="clickStatis()">
      <h4 class="statis-item__title">{{$t('dataAnalysis.memberPaidAmount')}}</h4>
      <p class="statis-item__data">0</p>
      <span class="change-trend change-trend--decline">
        <span class="change-trend__title">{{$t('dataAnalysis.compareWithThePreviousOneDay')}}</span>
        <span class="change-trend__data">
          <i class="zenticon zenticon-arrow-down"></i>-
        </span>
      </span>
    </div>
    <div class="statis-item" v-on:click="clickStatis()">
      <h4 class="statis-item__title">{{$t('dataAnalysis.numberOfMemberPaidOrders')}}</h4>
      <p class="statis-item__data">0</p>
      <span class="change-trend change-trend--decline">
        <span class="change-trend__title">{{$t('dataAnalysis.compareWithThePreviousOneDay')}}</span>
        <span class="change-trend__data">
          <i class="zenticon zenticon-arrow-down"></i>-
        </span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    clickStatis: function () {
      alert('1111')
    }
  }
}
</script>

<style lang="scss">
.customer-overview {
  display: flex;
  margin: 20px 0;

  .statis-item {
    display: inline-block;
    background: #f7f8fa;
    padding: 16px 0 16px 40px;
    position: relative;
    // -webkit-box-sizing: border-box;
    box-sizing: border-box;
    // -ms-flex: 1;
    -webkit-box-flex: 1;
    flex: 1;
    border: solid 1px #b9b9b9;
    margin: 4px;
    border-radius: 10px;
  }
  .statis-item__title {
    font-size: 14px;
    line-height: 20px;
    display: inline-block;
    margin-bottom: 8px;
  }
  .statis-item:hover {
    border: #87c3f5 solid 1px;
    cursor: pointer;
  }
}
</style>

