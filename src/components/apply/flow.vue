<template>
    <van-panel title="流程选择" :status="flowStatus">
      <van-radio-group :value="flowId" @change="radioChange">
        <van-radio
          :name="item.id"
          v-for="(item, index) in flowList"
          :key="index"
          >{{ item.name }}</van-radio
        >
      </van-radio-group>
      <div class="liuchengtu">
        <div class="line" v-for="(item, index) in fitNodeList" :key="index">
         <div   v-if="item.assigneeType == 'optional'">
           <p>{{item.type == 'start'?'开始':(item.type == 'approver'?'审批':'抄送')}}</p>
            <van-tag
            type="warning"
            @click="showPopup2(item.nodeId)"
            >{{ item.userName ? item.userName : "自选" }}</van-tag
          >
         </div>
         <div v-else>
              <p>{{item.type == 'start'?'开始':(item.type == 'approver'?'审批':'抄送')}}</p>
          <van-tag round :type="item.type == 'start'?'success':(item.type == 'approver'?'success':'primary')" plain size="large">{{
            item.content
          }}</van-tag>
         </div>
        </div>
      </div>
    </van-panel>
</template>

<script>
export default {
    props:{
        flowStatus:{
            type:String,
            default:'流程数:0'
        },
        flowId:{
            type:String,
            default:''
        },
        flowList:{
            type:Array,
            default:[]
        },
        fitNodeList:{
            type:Array,
            default:[]
        },
    },
    methods:{
        showPopup2(val){
            this.$emit('showPopup2',val)
        }
    }
}
</script>

<style lang="scss" scoped>
.liuchengtu {
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
  .line {
    height: 1.2rem;
    margin-left: 0.5rem;
  }
  .line:nth-last-child(n+2){
    border-left: 2px black solid;
  }
   .line:nth-last-child(1){
    margin-top: -0.3rem;
  }
   .line:nth-last-child(2){
     height: 1.5rem;
  }
}
</style>