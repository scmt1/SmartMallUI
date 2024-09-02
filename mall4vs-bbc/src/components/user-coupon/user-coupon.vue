<template>
    <el-dialog
            title="选择优惠券"
            center
            :close-on-click-modal="false"
            :visible.sync="visible"
            @close="handleDialogClose"
            width="800px"
    >
        <div class="coupon-warp">
            <div class="list">
                <div class="item" :class="{'active':couponId === item.couponId,'disabled':item.cashCondition > actualAmount}" @click="couponClick(item)"
                     v-for="(item,index) in couponList" :key="index">
                    <div class="money" style="display: none;">0.00
                        <div class="unit">折</div>
                    </div>
                    <div class="money">
                        <div class="unit">￥</div>
                        {{item.reduceAmount}}
                    </div>
                    <div class="info">
                        <div class="title">{{item.couponName}}({{item.suitableProdType == 0 ?
                            '全部商品可用':item.suitableProdType == 1?'指定商品可用':item.suitableProdType == 2?'指定商品不可用':'指定店铺可用'}})
                        </div>
                        <div class="limit">满{{item.cashCondition}}可用
                        </div>
                        <div class="time">{{item.startTime}}~{{item.endTime}}</div>
                    </div>
                    <div v-if="item.cashCondition > actualAmount">
                        
                    </div>
                    <div v-if="couponId === item.couponId">
                        <div class="xuanzhong"></div>
                        <img class="xz-img" src="../../assets/img/cashier/icon-select.png">
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
  export default {
    props: {
      couponId: {
        default: 0,
        type: Number
      },
      actualAmount: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        visible: false,
        couponList: [],
        selectCouponId: 0
      }
    },
    methods: {
      init (userId) {
        this.visible = true
        this.getUserCouponList(userId)
      },
      handleDialogClose () {

      },
      // 优惠券点击
      couponClick (couponInfo) {
        if (this.selectCouponId === couponInfo.couponId) {
          this.selectCouponId = 0
          this.$emit('couponConfirmEvent', {})
        } else {
          this.selectCouponId = couponInfo.couponId
          this.$emit('couponConfirmEvent', couponInfo)
          this.visible = false
        }
      },
      // 获取用户优惠券信息
      getUserCouponList (userId) {
        this.$http({
          url: this.$http.adornUrl('/admin/coupon/getCouponList'),
          method: 'GET',
          params: this.$http.adornParams({
            status: 1,
            current: 1,
            size: 2000,
            userId: userId
          })
        }).then(({data}) => {
          this.couponList = data.records
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
    .coupon-warp {
        .list {
            display: flex;
            padding: 10px 15px;
            flex-wrap: wrap;

            .item {
                margin: 0 10px 10px 0;
                padding: 10px 0;
                border: 1px solid #e6e6e6;
                width: calc((100% - 30px) / 2);
                cursor: pointer;
                display: flex;
                position: relative;

                .money {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 60px;
                    min-width: 100px;
                    font-size: 20px;
                    line-height: 1;

                    .unit {
                        font-size: 16px;
                        margin-top: 5px;
                        font-weight: 700;
                    }
                }

                .info {
                    padding: 0 10px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;

                    .title {
                        font-weight: 700;
                        word-break: break-all;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }

                    .limit {
                        font-size: 12px;
                        color: #999;
                        line-height: 1;
                        margin-top: 5px;
                    }

                    .time {
                        font-size: 12px;
                        color: #999;
                        line-height: 1;
                        margin-top: 5px;
                    }
                }
            }

            .active {
                border-color: #8558fa;
            }
        }

        .xuanzhong {
            position: absolute;
            display: block;
            right: -3px;
            bottom: -13px;
            width: 0;
            height: 0;
            border-top: 20px solid transparent;
            border-bottom: 20px solid transparent;
            border-left: 20px solid #8558fa;
            transform: rotate(45deg);
        }

        .xz-img {
            width: 18px;
            position: absolute;
            bottom: 0;
            right: 0;
        }
        .disabled {
            pointer-events: none;
            cursor: default;
            opacity: 0.6;
        }
    }
</style>
