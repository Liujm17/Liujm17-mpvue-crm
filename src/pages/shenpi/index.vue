<template>
  <div>
    <van-search v-model="value" placeholder="请输入搜索关键词" />
<van-tabs :active="active">
  <van-tab title="已提交">
   <Card
   :cardList='cardList'
   ></Card>
  </van-tab>
  <van-tab title="已审批">2

  </van-tab>
  <van-tab title="待审批">
  </van-tab>
</van-tabs>
  </div>
</template>
<script>
import Card from '../../components/card'
import {getHistory} from '../../api/api'
export default {
  data() {
    return {
         value: '',
         cardList:[],
         active:0
    };
  },
  components: {Card},
  mounted() {
    this.getData()
  },
  onPullDownRefresh () {
    //doing something
      console.log('下拉刷新')
      //stop doing
      wx.stopPullDownRefresh();
    },
  methods: {
     getData(){
       let params={
         pageNum:1,
         pageSize:999,
         applyUserId:1,
         month:'',
         formId:1
       }
       getHistory(params).then((res)=>{
         this.cardList=res.data.data.list.map((item)=>{
           return{
             title:'备用金申请',
             money:"申请金额为:"+item.money,
             remark:"备注:"+item.remark,
              status:item.approveStatus == -1?'未提交':(item.approveStatus == 0?'审批中':(item.approveStatus == 1?'已结束':'起始状态'))
           }
         })
       })
     }
  },
};
</script>
<style lang="scss" scoped>

</style>
