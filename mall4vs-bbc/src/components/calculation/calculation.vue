<template>
    <el-dialog
        title="减免金额"
        center
        :close-on-click-modal="false"
        :visible.sync="visible"
        @close="handleDialogClose"
        width="440px"
    >
        <div class="money-wrap">
            <div class="content-wrap">
                <div class="unit">￥</div>
                <div class="money">{{money}}</div>
            </div>
            <div class="keyboard-wrap">
                <div class="num-wrap" @click.stop='_handleKeyPress'>
                    <div class="key-item" data-num='1'>1</div>
                    <div class="key-item" data-num='2'>2</div>
                    <div class="key-item" data-num='3'>3</div>
                    <div class="key-item" data-num='4'>4</div>
                    <div class="key-item" data-num='5'>5</div>
                    <div class="key-item" data-num='6'>6</div>
                    <div class="key-item" data-num='7'>7</div>
                    <div class="key-item" data-num='8'>8</div>
                    <div class="key-item" data-num='9'>9</div>
                    <div class="key-item" data-num='00'>00</div>
                    <div class="key-item" data-num='0'>0</div>
                    <div class="key-item" data-num='.'>.</div>
                </div>
                <div class="operation-wrap" @click.stop='_handleKeyPress'>
                    <div class="delete" data-num='D'>删除</div>
                    <div class="delete" data-num='C'>清空</div>
                    <div class="confirm" data-num='S'>确认</div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
  export default {
    props: {
      actualAmount: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        money: '',
        visible: false
      }
    },
    methods: {
      init () {
        this.visible = true
      },
      handleDialogClose () {
        this.money = ''
      },
      // 处理按键
      _handleKeyPress (e) {
        let num = e.target.dataset.num

        // 不同按键处理逻辑
        // -1 代表无效按键，直接返回
        if (num === -1) return false

        switch (String(num)) {
          // 小数点
          case '.':
            this._handleDecimalPoint()
            break
          // 删除键
          case 'D':
            this._handleDeleteKey()
            break
          // 清空键
          case 'C':
            this._handleClearKey()
            break
          // 确认键
          case 'S':
            this._handleConfirmKey()
            break
          default:
            this._handleNumberKey(num)
            break
        }
      },
      // 处理小数点函数
      _handleDecimalPoint () {
        // 如果包含小数点，直接返回
        if (this.money.indexOf('.') > -1) return false
        // 如果小数点是第一位，补0
        if (!this.money.length) {
          this.money = '0.'
        } else {
          this.money = this.money + '.'
        }
      },
      // 处理删除键
      _handleDeleteKey () {
        let S = this.money
        // 如果没有输入，直接返回
        if (!S.length) return false
        // 否则删除最后一个
        this.money = S.substring(0, S.length - 1)
      },
      // 处理清空键
      _handleClearKey () {
        this.money = ''
      },
      // 处理数字
      _handleNumberKey (num) {
        let S = this.money

        // 如果有小数点且小数点位数不小于2
        if (S.indexOf('.') > -1 && S.substring(S.indexOf('.') + 1).length < 2) {
          this.money = S + num
          if (this.money > this.actualAmount) {
            this.money = ''
            this.$message.warning('输入金额不能大于实际支付金额')
          }
        }

        // 没有小数点
        if (!(S.indexOf('.') > -1)) {
          // 如果第一位是0，只能输入小数点
          if (num === 0 && S.length === 0) {
            this.money = '0.'
          } else {
            if (S.length && Number(S.charAt(0)) === 0) return
            this.money = S + num
            if (this.money > this.actualAmount) {
              this.money = ''
              this.$message.warning('输入金额不能大于实际支付金额')
            }
          }
        }
      },
      // 提交
      _handleConfirmKey () {
        let S = this.money
        // 未输入
        if (!S.length) {
          this.$message.warning('您目前未输入!')
          return false
        }

        // 将 8. 这种转换成 8.00
        if (S.indexOf('.') > -1 && S.indexOf('.') === (S.length - 1)) {
          S = Number(S.substring(0, S.length - 1)).toFixed(2)
        }
        // 保留两位
        S = Number(S).toFixed(2)
        this.$emit('confirmEvent', S)
        this.visible = false
      }
    }
  }
</script>

<style lang="scss" scoped>
    .money-wrap {
        background: #fff;
        border-radius: 5px;
        .content-wrap {
            display: flex;
            border: 1px solid #e6e6e6;
            height: 60px;
            align-items: center;
            margin: 0 20px;
            padding: 0 15px;
            .unit {
                font-size: 25px;
            }
            .money {
                margin-left: 5px;
                font-size: 20px;
            }
        }
        .keyboard-wrap {
            width: 400px;
            padding: 0 30px 30px 20px;
            margin-top: 10px;
            display: flex;
            .num-wrap {
                flex: 1;
                width: 0;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                .key-item {
                    margin: 10px 10px 0 0;
                    background: #f5f5f5;
                    min-width: calc((100% - 30px) / 3);
                    text-align: center;
                    padding: 15px 0;
                    border-radius: 5px;
                    font-size: 16px;
                    font-weight: 700;
                    transtion: all .3s;
                    cursor: pointer;
                }
                .key-item:hover {
                    background: #d5d2d2;
                }
            }
            .operation-wrap {
                display: flex;
                flex-direction: column;
                width: 100px;
                .delete, .confirm {
                    background: #f5f5f5;
                    min-width: calc((100% - 30px) / 3);
                    text-align: center;
                    padding: 15px 0;
                    margin-top: 10px;
                    border-radius: 5px;
                    font-size: 16px;
                    cursor: pointer;
                    transtion: all .3s;
                }
                .delete:hover {
                    background: #d5d2d2;
                }
                .confirm {
                    flex: 1;
                    background: #8558fa;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #fff;
                }
                .confirm:hover {
                    background: #926ef2;
                }
            }
        }
    }
</style>
