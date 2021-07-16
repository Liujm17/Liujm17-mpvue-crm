<template>
  <div class="allbg">
    <div class="title">基本信息</div>
    <van-cell-group>
       <van-field
        v-model="formData.collectionDate"
        label="收款日期"
        placeholder="请选择收款日期"
        required
        readonly
        input-align="right"
        @input="formData.collectionDate = $event.mp.detail"
        @click="showDate2"
      />
      <van-field
        v-model="formData.month"
        label="费用所属期"
        placeholder="请选择费用所属期"
        required
        readonly
        input-align="right"
        @input="formData.month = $event.mp.detail"
        @click="showDate"
      />
        <van-field
        v-model="formData.totalPrice"
        label="总金额"
        required
        readonly
         type="digit"
        input-align="right"
        @input="formData.totalPrice = $event.mp.detail"
      />
    </van-cell-group>
   
  
    <div style="width:100%;height:20px"></div>
    <!-- 费用明细列表 -->
     <div style="padding:10px;box-sizing:border-box" v-for="(item,index) in content" :key="index" >
        <div class="title" style="display:flex;align-items:center;justify-content:space-between"><span>结算单明细({{index+1}})</span><span style="color:red;font-size:20px" @click="delList(index)">删除</span></div>
      <van-cell-group>
     
       <van-field
        label="类别"
        required
        input-align="right"
      >
        <div style="display:flex;flex-wrap:nowrap;align-items:center" class="radio-bg" slot="button">
        <van-button :type="item.active == index2?'info':'default'" size="small" v-for="(item2,index2) in radioList2" :key="index2" @click="changeData2(item2,index2,index)">{{item2.text}}</van-button>
        </div>
      </van-field>
       <van-field
        v-model="item.quantity"
        placeholder="请填写数量"
        label="数量"
        type="digit"
        required
        input-align="right"
        @input="item.quantity = $event.mp.detail"
      />
       <van-field
        v-model="item.unitPrice"
        placeholder="请填写单价"
        label="单价"
        type="digit"
        required
        input-align="right"
        @input="item.unitPrice = $event.mp.detail"
      />
       <van-field
        v-model="item.totalPrice"
        label="金额"
        type="digit"
         readonly
        required
        input-align="right"
        @input="item.totalPrice = $event.mp.detail"
      />

    </van-cell-group>
     </div>
  
   <div class="table-add">
      <van-button round plain hairline type="info" @click="addProduct"
        >添加明细</van-button
      >
    </div>

    <!-- 附件 -->
    <Accessroy :photoList="photoList" :onlyOne="false" :deleteList="deleteList"></Accessroy>
    <!-- 空白区域 -->
    <div style="width:100%;height:20px"></div>
    <!-- 流程//流程必有用户弹出层 -->
    <Flow
      :flowStatus="flowStatus"
      :flowId="flowId"
      :flowList="flowList"
      :fitNodeList="fitNodeList"
      @showPopup2="showPopup2"
      @radioChange="radioChange"
    ></Flow>

    <!-- 用户弹出层 -->
    <van-popup
      :show="usershow"
      position="right"
      custom-style="width: 80%; height: 100%;"
      @close="onClose"
    >
      <User @submit="usersubmit" :radio="userradio" @cancel="onClose"></User>
    </van-popup>

    <!-- 日期 -->
    <Picker
      :show="dateShow"
      click="date"
      :formData="formData"
      :clickName="clickName"
      @cancel="onClose"
      @submit="submit2"
      :showDay="showDay"
    ></Picker>

     <!-- 日期2  完整日期-->
    <Picker
      :show="dateShow2"
      click="date"
      :formData="formData"
      :clickName="clickName"
      @cancel="onClose"
      @submit="submit3"
      :showDay="true"
    ></Picker>

    <!-- 底部按钮 -->
    <van-goods-action>
      <van-goods-action-button type="info" text="保存草稿" @click="save(0)" />
      <van-goods-action-button type="primary" text="保存提交" @click="save(1)" />
    </van-goods-action>
  </div>
</template>

<script>
import Accessroy from "../../../components/apply/accessory";
import data from "../../../api/mockData";
import RadioButton from "../../../components/radioButton.vue";
import { getFlowList, getByFlowId,getCostType } from "../../../api/api";
import Flow from "../../../components/apply/flow.vue";
import User from "../../../components/userOptions";
import Picker from "../../../components/utils/picker.vue";
export default {
  components: { Accessroy, Flow, User, Picker, RadioButton },
  data() {
    return {
      data: data,
      uuid: "",
      //问题描述
      formData: {
        month:'',
        collectionDate:'',
        totalPrice:''
      },
      //附件
      photoList: [],
       //编辑中被删除的图片id列表
      deleteList: [],
      //需要上传的列表
      needList: [],
       //附件列表上传索引
      valueIndex: 0,
      //列表
      listData: [],
      //表单
      formData: {},
      //流程
      flowId: "",
      flowList: [],
      fitNodeList: [],
      flowStatus: "流程数:0",
      popUpType: "",
      nodeId: "",
      //流程中的用户弹窗
      usershow: false,
      userradio: "1",
      //日期2
      dateShow2:false,
      //日期
      dateShow: false,
      showDay: false,
      clickName: "",
      //是否付款
      radioList1: [
        { text: "否", value: 0 },
        { text: "是", value: 1 },
      ],
      active1: 0,
      //费用报销类别
      radioList2:[],
      active2:0,
      //费用报销明细
      content:[]
    };
  },
  onLoad() {
    this.deleteList=[]
    this.uuid = data.get_uuid();
  },
  onReady() {
    this.formData.userName = wx.getStorageSync("applyUserName");
    this.formData.userId = wx.getStorageSync("UserId");
    this.getData()
    this.getData2()
    this.getType()
     wx.setNavigationBarTitle({
          title: '结算单-编辑'+'('+wx.getStorageSync("factoryName")+')',
      });
  },
  watch: {
    content: {
      handler(newValue, oldValue) {
       this.formData.totalPrice=newValue.reduce((total,item)=>total+item.unitPrice*item.quantity,0)
       newValue.forEach((item)=>{
         item.totalPrice=item.unitPrice*item.quantity
       })
      },
        //首次监听
      //  immediate: true,
       //深度监听
      deep: true,
    },
       //监听图片列表，看有无新上传的
    photoList: {
      handler(newVal, oldVal) {
        this.needList = data.sliceList(newVal.filter((item) => !item.id));
      },
      deep: true,
    },
    //监听图片列表，看有无把旧的图片删除的
    deleteList: {
      handler(newVal, oldVal) {
        this.needList = data.sliceList(newVal);
      },
      deep: true,
    },
  },
  methods: {
      //获取数据
    getData() {
      let params = {
        formId: this.$store.state.formId,
        id: this.$route.query.id,
      };
      data["settle"].getData(params).then((res) => {
        this.formData = {
          month: res.data.data.month,
          collectionDate: res.data.data.collectionDate,
          totalPrice: res.data.data.totalPrice,
        };
        this.photoList = res.data.data.fileList
          ? res.data.data.fileList.map((item) => {
              return {
                type: item.type == 0 ? "image" : "video",
                img: item.type == 0 ? item.address : "",
                video: item.type == 1 ? item.address : "",
                id: item.id ? item.id : "",
              };
            })
          : [];
        this.content = res.data.data.costStatementDetailVoList.map((item) => {
          return {
            id: item.id ? item.id : "",
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            type:item.type,
            active:item.type-1
          };
        });
      });
    },
    //获取结算单类型
    getType(){
       let params={
         type:2
       }
       getCostType(params).then((res)=>{
         this.radioList2=res.data.data.map((item)=>{
           return {
             value:item.optionValue,
             text:item.optionText
           }
         })
       })
    },
    //添加明细
    addProduct(){
      this.content.push({quantity:'',unitPrice:'',totalPrice:'',type:1,active:0})
    },
    ///删除费用列表对应
    delList(val) {
      this.content.splice(val, 1);
    },
    //是否按钮群点击更换高亮事件
    changeData1(item, index) {
      this.active1 = index;
    },
     //费用报销按钮群点击更换高亮事件
    changeData2(item2, index2,index) {
     this.content[index].active=index2
     this.content[index].type=index2+1
    },
    //获取流程列表
    getData2() {
      let params = {
        formId: this.$store.state.formId,
      };
      getFlowList(params).then((res) => {
        if (res.data.data.length >= 1) {
          this.flowStatus = "流程数:" + res.data.data.length;
          this.flowList = res.data.data.map((item) => {
            return {
              id: item.id,
              name: item.flowName,
            };
          });
          this.flowId = res.data.data[0].id + "";
          this.getByFlowId();
        } else if (res.data.data.length == 0) {
          console.log("bukeyi");
        }
      });
    },
    //根据流程id查询节点
    getByFlowId() {
      let params = {
        flowId: this.flowId,
      };
      //设置流程列表
      getByFlowId(params).then((res) => {
        this.fitNodeList = res.data.data.map((item) => {
          return {
            ...item,
          };
        });
      });
    },
    //流程相关方法
    //流程弹窗
    showPopup2(val) {
      this.show = true;
      (this.popUpType = "流程"), (this.nodeId = val.nodeId);
      this.userradio = val.userId + "";
    },
    //mpvue的更改选择，异步，更改流程列表
    radioChange(val) {
      this.flowId = val.mp.detail;
      this.getByFlowId();
    },
    //流程选用户后的确认事件
    usersubmit(val) {
      this.$set(
        this.fitNodeList.filter((item) => item.nodeId == this.nodeId)[0],
        "userName",
        val.name
      );
      this.$set(
        this.fitNodeList.filter((item) => item.nodeId == this.nodeId)[0],
        "userId",
        val.id
      );
      this.usershow = false;
    },
    //关闭弹窗
    onClose() {
      this.usershow = false;
      this.dateShow = false;
    },

    //日期选择
    //显示日期
    showDate() {
      this.dateShow = true;
    },
     showDate2() {
      this.dateShow2 = true;
    },
    //日期确认
    submit2(val) {
      this.formData.month = val;
      this.dateShow = false;
    },
    submit3(val){
       this.formData.collectionDate=val
       this.dateShow2 = false;
    },
    //保存
    save(val) {
      let params = {
         id: this.$route.query.id,
        ...this.formData,
        batchId: "",
        factoryId: wx.getStorageSync("factoryId"),
        deleteIds: this.deleteList,
        costStatementDetailList:this.content,
        userId: wx.getStorageSync("UserId"),
        startFlowDto: {
          optionalJson: JSON.stringify(this.fitNodeList),
          formId: this.$store.state.formId,
          flowId: Number(this.flowId),
          type: val,
        },
      };
      if (this.needList.length > 0) {
        data.upLoadFile(this.needList, 0, this.uuid).then((res) => {
          //文件code
          let resData = JSON.parse(res.data);
          params.batchId = resData.data.batchId;
          data["settle"].editOrStart(params).then((res) => {
            if (res.data.code == 10000) {
              mpvue.showToast({
                title: res.data.message,
                icon: "none",
                duration: 3000,
                mask: true,
              });
              //重启到某页面，如不是tabar页面会有回主页按钮
              this.$router.back();
            }
          });
        });
      } else {
        data["settle"].editOrStart(params).then((res) => {
          if (res.data.code == 10000) {
            mpvue.showToast({
              title: res.data.message,
              icon: "none",
              duration: 3000,
              mask: true,
            });
            //重启到某页面，如不是tabar页面会有回主页按钮
            this.$router.back();
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.allbg {
  margin-bottom: 150px;
}
.polling-info {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding: 0 15px;
  box-sizing: border-box;
}
.polling-text {
  margin-top: 20px;
}
.polling-info2 {
  margin-top: 20px;
  .polling-title2 {
    font-weight: 500;
  }
}
</style>