<template>
  <div>
    <div>
      <van-field
        v-for="(item, index) in data.applyCash.vanFormData.formData"
        :key="index"
        v-model="formData[item.name]"
        :name="item.value"
        :label="item.value"
        :placeholder="item.value"
        input-align="right"
        :rules="[{ required: true, message: '请填写' + item.value }]"
        @input="formData[item.name] = $event.mp.detail"
        :readonly='true'
      />
    </div>
  </div>
</template>
<script>
import data from '../../api/mockData'
import {getSpareMoney} from '../../api/api'
export default {
  data() {
    return {
        data:data,
      formData: {},
    };
  },
  components: {},
  mounted() {
       this.getData()
       this.formData=data.applyCash.formData
  },
  methods: {
    getData(){
      let params={
        id:this.$route.query.id
      }
      getSpareMoney(params).then((res)=>{
       this.formData=res.data.data
      })
    }
  },
};
</script>
