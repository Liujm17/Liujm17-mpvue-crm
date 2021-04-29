<template>
  <div class="bg">
    <van-radio-group
      v-model="radio"
      @change="radioChange"
      v-if="type == 'agree' ? false : true"
    >
      <van-radio name="2">驳回到发起人</van-radio>
      <van-radio name="3">驳回上一步</van-radio>
    </van-radio-group>

    <van-cell-group>
      <van-field
        v-model="message"
        rows="1"
        autosize
        label="意见"
        type="textarea"
        placeholder="请输入意见"
            @input="message = $event.mp.detail"
      />
    </van-cell-group>
    <div class="bt">
      <van-button plain type="info" size="small" @click="quxiao">取消</van-button>
      <van-button plain type="primary" size="small" @click="queding">确定</van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "agree",
    },
  },
  data() {
    return {
      radio: "2",
      message: "",
    };
  },
  methods: {
    //mpvue的更改选择
    radioChange(val) {
      this.radio = val.mp.detail;
    },
    quxiao(){
        this.$emit('quxiao')
    },
     queding(){
         let val={
             suggestion:this.message,
             dealResult:this.radio
         }
        this.$emit('queding',val)
    }
  },
};
</script>

<style lang="scss" scoped>
.bt{
    display: flex;
    justify-content: space-around;
    margin-top: 0.5rem;
}
</style>
