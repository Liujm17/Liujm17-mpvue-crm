<template>
  <div>
    <van-field
    v-model="username"
    name="用户名"
    label="用户名"
    placeholder="用户名"
    @click="test"
    :rules="[{ required: true, message: '请填写用户名' }]"
  />
 <van-action-sheet   v-model="show"></van-action-sheet>
  </div>
</template>
<script>
export default {
  data() {
    return {
    username:'',
    show:false
    };
  },
  components: {},
  mounted() {},
  methods: {
   test(){
     this.show=true
     console.log('test')
   }
  },
};
</script>
<style lang="scss" scoped>

</style>
