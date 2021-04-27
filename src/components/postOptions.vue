<template>
  <div>
    <van-search
      v-model="value"
      placeholder="请输入搜索关键词"
      @search="onSearch"
    />
    <van-tabs :active="active">
    
      <van-tab title="部门">
        <van-radio-group v-model="radio" @change="radioChange">
          <van-radio
            class="select"
            :name="item.id"
            v-for="(item, index) in PostList"
            :key="index"
          >
            <div class="name">{{ item.name }}</div>
          </van-radio>
        </van-radio-group>
      </van-tab>
    </van-tabs>
      <van-goods-action>
  <van-goods-action-button color="#be99ff" type="warning" text="取消"  @click="cancel"/>
  <van-goods-action-button color="#7232dd" type="info" text="确定"  @click="submit"/>
</van-goods-action>
  </div>
</template>
<script>
import {  getPostOptions } from "../api/api";
export default {
  data() {
    return {
      active: 0,
      value: "",
      radio: "1",
      radio2: "59",
      PostList: [],
    };
  },
  components: {},
  mounted() {
    this.getData();
     this.radio=this.$route.query.userId
  },
  methods: {
    //获取数据
    getData() {
     
      let params2 = {
        name: this.value,
      };
      getPostOptions(params2).then((res) => {
        this.PostList = res.data.data.map((item) => {
          return {
            id: item.id + "",
            name: item.name,
          };
        });
      });
    },
    //键盘上的搜索按钮事件
    onSearch(val) {
      this.value = val.mp.detail;
      this.getData();
    },
    //mpvue的更改选择
    radioChange(val) {
      this.radio = val.mp.detail;
    },
    cancel(){
      console.log('取消')
    },
    submit(){
     this.$router.push({
        path: this.$route.query.fromPath,
        query: {
          userId: this.radio,
          userName:this.PostList.filter((item)=>item.id==this.radio)[0].name,
          type:this.$route.query.type
        },
      });
    },
  },
};
</script>
<style lang="scss">
.select {
  font-size: 0.3rem;
  .name {
  }
  .post {
    color: #777;
  }
}
.van-radio {
  margin-top: 0.2rem !important;
  margin-left: 0.3rem !important;
  margin-bottom: 0.3rem !important;
}
</style>
