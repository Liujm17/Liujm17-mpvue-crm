<template>
  <div>
   <div class="card-bg">
    <div class="card" v-for="(item, index) in paymentList" :key="index">
      <div>采购明细{{index+1}}</div>
      <div style="width:100%" class="card-header">
        <div>
          采购单编号:{{item.id}}      
        </div>
        <div>
          总金额:{{item.totalPrice}}
        </div>
      </div>
      <div class="table">
          <div class="table-header">
            <div
              v-for="(titem, tindex) in paymenttitle"
              :key="tindex"
              class="header-title"
            >
              {{ titem }}
            </div>
          </div>
          <div
            class="table-content"
            v-for="(item2, index2) in item.purchaseDetailVoList"
            :key="index2"
          >
            <div class="content-title">{{ item2.productName }}</div>
            <div class="content-title">{{ item2.specs }}</div>
            <div class="content-title">{{ item2.purchaseQuantity }}</div>
            <div class="content-title">{{ item2.unitPrice }}</div>
          </div>
        </div>
      <div style="width:100%" class="card-header">
        <div>
          未付金额:{{item.unpaidPrice}}      
        </div>
        <div>
          在途金额:{{item.approvalPrice}}
        </div>
      </div>

       <div class="card-bottom" v-if="addPage">
         <span>请填写付款金额:</span>
          <van-stepper
            v-model="item.paymentPrice"
            @change="item.paymentPrice = $event.mp.detail"
             min="0"
          />
       </div>
        <div class="card-bottom" v-else>
         <span >付款金额:</span>
          <div>{{item.paymentPrice}}</div>
       </div>

    </div>
   </div>
  </div>
</template>

<script>
export default {
    props:{
        paymentList:[],
        addPage:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return{
            paymenttitle: ["产品名称", "规格型号", "数量","单价"],
        }
    }
}
</script>

<style scoped lang="scss">
.add-button {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  color: #1989fa;
  padding: 10px 10px;
  /* height: 40px;
      line-height: 40px; */
}
.card-bg {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .card {
    width: 95%;
    line-height: 40px;
    border: 1px solid #aaa;
    margin: 3px 0;
    box-sizing: border-box;
    padding: 3px;
    font-size: 0.3rem;
    // float: left;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    .text{
      width: 50%;
      text-align: center;
    }
    .card-header{
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
    }
    .card-bottom{
      display: flex;
       padding: 0 10px;
       font-size: 20px;
    }
  }
}
</style>
<style>
@import "../../style/list.scss";
</style>