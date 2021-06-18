<template>
   <div>
      <div class="title">审批信息</div>
      <van-panel title="流程选择" :status="flowStatus">
      <van-radio-group :value="flowId" @change="radioChange">
        <van-cell
         v-for="(item, index) in flowList"
          :key="index"
          :title="index+1+':'+item.name"
          value-class="value-class"
          clickable
          :data-name="item.id"
           @click="onClick"
        >
          <van-radio :name="item.id" />
           </van-cell>
      </van-radio-group>
      <div class="liuchengtu">
         
    <!-- 步骤条 -->
    <van-steps
      :steps="steps"
      @change="showUser"
      active-color="#38f"
      direction="vertical"
    />

      </div>
    </van-panel>
   </div>
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
    data(){
      return{
      }
    },
    computed:{
        steps:function(){
           return this.fitNodeList.map((item) => {
      return {
        text:
          item.type == "start"
            ? "开始"
            : item.type == "approver"
            ? "审批"
            : "抄送",
            desc:item.userName?item.userName+'(*自选·点击此处)':(item.content == '发起人自选'?'*自选(点击此处)':item.content),
        // desc: item.content == '发起人自选'?'*自选(点击此处)':item.content,
          inactiveIcon: item.content == '发起人自选'?'star':'like-o',
        activeIcon: 'like-o',
        type:item.content == '发起人自选'?'special':'normal',
        fontColor:item.content == '发起人自选'?'#00BFFF':'',
        nodeId:item.nodeId,
        userId:item.userId?item.userId:''
      };
    });
        }
    },
    methods:{
      showUser(val){
        if(val.mp.detail.type == 'special'){
          this.showPopup2(val.mp.detail)
        }
        return true
      },
        showPopup2(val){
            this.$emit('showPopup2',val)
        },
        radioChange(val){
           this.$emit('radioChange',val)
        },
        onClick(val){

        }
    }
}
</script>

<style lang="scss">
.van-steps {
  margin-bottom: 2rem !important;
}
</style>

<style lang="scss" scoped>
    .title{
         color: gray;
         font-size: 13px;
     }
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
<style>
.value-class {
  flex: none !important;
}
</style>