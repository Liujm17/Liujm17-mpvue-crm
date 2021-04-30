<template>
  <div class="bg">
  
    <div class="bt">
      <van-button plain type="info" size="small" @click="quxiao">取消</van-button>
      <van-button plain type="primary" size="small" @click="queding">确定</van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
  },
  data() {
    return {
    };
  },
  methods: {
    quxiao(){
        this.$emit('quxiao')
    },
     queding(){
        this.$emit('queding')
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
