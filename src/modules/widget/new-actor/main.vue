<template>
    <modal :title="'编辑艺人信息'" @destroy="destroy" :is-footer="false">
        <div class="modify_actor" :style="{height:height+'px'}">
            <div class="group">
                <div class="title">
                    <span class="icon"></span>账号信息
                </div>
                <div class="warpper clearfix">
                    <div class="items">
                        <div class="name">ID</div>
                        <div class="content">
                            <el-input v-model="actor.id" :disabled="true" placeholder="请输入ID"></el-input>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">入驻时间</div>
                        <div class="content">
                            <el-input :value="actor.createDate | timesToDate('yyyy-MM-dd')" :disabled="true" placeholder="请输入入驻时间"></el-input>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">平台</div>
                        <div class="content">
                            <el-select :disabled="user.platId?true:false" v-model="actor.platName" @change="changePlat" placeholder="请选择平台">
                                <el-option
                                  v-for="item in platList"
                                  :key="item.uuid"
                                  :label="item.name"
                                  :value="item.uuid">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">平台ID</div>
                        <div class="content">
                            <el-input :disabled="true" :value="actor.platId" placeholder=""></el-input>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">公会</div>
                      <div class="content" @click="goSelectUnion" style="cursor: pointer">
                            <!--<el-select v-model="actor.unionName" @change="changeUnion" placeholder="请选择公会" filterable :filter-method="filterUnion">-->
                                <!--<el-option-->
                                  <!--v-for="item in unionList"-->
                                  <!--:key="item.uuid"-->
                                  <!--:label="item.name"-->
                                  <!--:value="item.uuid">-->
                                <!--</el-option>-->
                            <!--</el-select>-->

                        <el-input :value="actor.unionName" readonly="" placeholder="请选择公会" ></el-input>
                        <i v-if="actor.unionName" class="el-icon-error" @click.stop="clearSelectUnion"></i>

                        </div>
                    </div>
                    <div class="items">
                        <div class="name">昵称</div>
                        <div class="content">
                            <el-input :minlength="1" :maxlength="20" v-model="actor.nickname" placeholder="请输入昵称"></el-input>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">经纪人</div>
                        <div class="content">
                            <el-select v-model="actor.brokerName" :clearable="true" @change="changeBroker" placeholder="请选择经纪人">
                                <el-option
                                  v-for="item in agentList"
                                  :key="item.uuid"
                                  :label="item.nickname"
                                  :value="item.uuid">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">代发工资</div>
                        <div class="content">
                            <el-input :disabled="true" :value="actor.autoPay | filterAutoPay" placeholder="代发工资"></el-input>
                        </div>
                    </div>
                </div>

                <div class="btns">
                    <el-button @click="goModify(1)" size="mini" type="primary">保存</el-button>
                </div>
            </div>
            <div class="group">
                <div class="title">
                    <span class="icon"></span>身份信息
                </div>
                <div class="warpper clearfix">
                    <div class="items">
                        <div class="name">姓名</div>
                        <div class="content">
                            <el-input :minlength="1" :maxlength="20" v-model="actor.identityName" placeholder="请输入姓名"></el-input>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">身份证</div>
                        <div class="content">
                            <el-input :minlength="15" :maxlength="18" @change="changeIdentityCard" v-model="actor.identityCardId" placeholder="请输入身份证"></el-input>
                        </div>
                    </div>
                </div>
                <div class="btns">
                    <el-button @click="goModify(2)" size="mini" type="primary">保存</el-button>
                </div>
            </div>

            <div class="group">
                <div class="title">
                    <span class="icon"></span>提现账户
                </div>
                <template v-if="bankAccount">
                    <div class="t_title">银行卡账号</div>
                    <div class="warpper clearfix">
                        <!--银行卡账户-->
                            <div class="items">
                                <div class="name">开户银行</div>
                                <div class="content">
                                    <el-input :minlength="1" :maxlength="20" v-model="bankAccount.bcName" placeholder="请输入开户银行"></el-input>
                                </div>
                            </div>
                            <div class="items">
                                <div class="name">所在城市</div>
                                <div class="content">
                                    <el-input :minlength="1" :maxlength="20" v-model="bankAccount.bcCity" placeholder="请输入开户银行"></el-input>
                                </div>
                            </div>
                            <div class="items">
                                <div class="name">开户支行</div>
                                <div class="content">
                                    <el-input :minlength="1" :maxlength="20" v-model="bankAccount.bcBranch" placeholder="请输入开户银行"></el-input>
                                </div>
                            </div>
                            <div class="items">
                                <div class="name">银行卡号</div>
                                <div class="content">
                                    <el-input :minlength="1" :maxlength="20" v-model="bankAccount.accountNum" placeholder="请输入开户银行"></el-input>
                                </div>
                            </div>
                    </div>
                    <div class="btns">
                        <el-button @click="modifyCashAccount(2)" size="mini" type="primary">保存</el-button>
                    </div>
                </template>

            </div>





            <div class="group">
                <div class="title">
                    <span class="icon"></span>联系方式
                </div>
                <div class="warpper clearfix">
                    <div class="items">
                        <div class="name">电话</div>
                        <div class="content">
                            <el-input :minlength="1" :maxlength="11"  type="number" v-model="actor.mobile" placeholder="请输入电话"></el-input>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">QQ号</div>
                        <div class="content">
                            <el-input :minlength="5" :maxlength="11"  type="number" v-model="actor.qqId" placeholder="请输入QQ号"></el-input>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">微信号</div>
                        <div class="content">
                            <el-input v-model="actor.wechatId" placeholder="请输入微信号"></el-input>
                        </div>
                    </div>
                </div>
                <div class="btns">
                    <el-button @click="goModify(3)" size="mini" type="primary">保存</el-button>
                </div>
            </div>
            <div class="group">
                <div class="title">
                    <span class="icon"></span>分成计算
                </div>
                <div class="warpper clearfix">
                    <div class="items">
                        <div class="name">计算方法</div>
                        <div class="content">
                            <el-select v-model="actor.shareType" placeholder="请选择">
                                <el-option
                                  v-for="item in shareTypeList"
                                  :key="item.uuid"
                                  :label="item.name"
                                  :value="item.uuid">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">个税</div>
                        <div class="content">
                            <el-input v-model="actor.taxRatio" type="number" placeholder="请输入个税"></el-input>%
                            <div class="info">个税范围为3~8</div>
                        </div>
                    </div>
                    <template v-if="actor.shareType == 0">
                        <div class="items">
                            <div class="name">分成比例</div>
                            <div class="content">
                                <el-input v-model="actor.shareRatio"  type="number" placeholder="请输入分成比例"></el-input>%
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <template v-for="(items,index) in actor.shareProperties">
                            <share-items :items="items" :length="filterListLength" :index="index" @optItems="optItems"></share-items>
                        </template>
                    </template>

                </div>
                <div class="btns">
                    <el-button @click="goModify(4)" size="mini" type="primary">保存</el-button>
                </div>
            </div>
            <div class="group payFloor">
                <div class="title">
                    <span class="icon"></span>保底政策
                </div>
                <div class="warpper clearfix">
                    <div class="items">
                        <div class="name">保底薪资</div>
                        <div class="content">
                            <el-input v-model="actor.payFloor" @change="changePayFloor" type="number" placeholder="请输入保底薪资"></el-input>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">日有效小时</div>
                        <div class="content">
                            <el-input v-model="actor.validDayHour"  type="number" placeholder="请输入日有效小时"></el-input>小时
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">月有效天数</div>
                        <div class="content">
                            <el-input v-model="actor.validDay"  type="number" placeholder="请输入月有效天数"></el-input>
                            <div v-if="actor.validDay" class="info">当日直播时长超过{{actor.validDayHour}}小时记为有效天</div>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">月有效总时长</div>
                        <div class="content">
                            <el-input v-model="actor.validHour"  type="number" placeholder="请输入有效时长"></el-input>小时
                        </div>
                    </div>
                </div>
                <div class="btns">
                    <el-button @click="goModify(5)" size="mini" type="primary">保存</el-button>
                </div>
            </div>

            <div class="group">
                <div class="title">
                    <span class="icon"></span>状态
                </div>
                <div class="btns" style="margin-top:10px;">
                    <el-button v-if="actor.status != 0" @click="changeStatus(0)" size="mini" type="primary">启用</el-button>
                    <el-button v-if="actor.status != 1" @click="changeStatus(1)" size="mini" type="danger">停用</el-button>
                </div>
            </div>


        </div>
    </modal>
</template>

<script>
    import * as api from './api';
    import Modal from '@/modules/widget/common/Modal.vue';
    import ShareItems from './ShareItems'
    import selectUnion from '@/modules/widget/select-union-v2'

    export default{
        components:{
            Modal,
            ShareItems
        },
        data(){
            return {
                agent:"",
                agentList:[],
                platList:[],
                unionList:[],
                height:300,
                calculation:"",
                shareTypeList:[{
                    uuid:0,
                    name:"固定比例"
                },{
                    uuid:1,
                    name:"阶梯比例"
                }],
                deleteShareList:[],
                actor:{
                    "id": 1010,
                    "nickname": "艺人aa",
                    "avatarUrl": "",
                    "sex": "WOMAN",
                    "userType": "ACTOR",
                    "loginName": "actor1",
                    "mobile": "15011519169",
                    "email": "",
                    "wechatId": "0",
                    "qqId": "0",
                    "status": 0,
                    "py": "yraa",
                    "pinyin": "yirenaa",
                    "password": "d306f206b97f896142fa0957f388a817",
                    "orgId": "XEwbjsBfcPU8MM4DALctwu",
                    "createDate": 1521283411000,
                    "lastUpDate": 1521283411000,
                    "platId": null,
                    "platName": null,
                    "unionId": "XEwbjsBfcPU8MM4DALctwu",
                    "unionName": "22111",
                    "thirdId": null,
                    "thirdNickname": null,
                    "identified": 0,
                    "identityName": "aaa",
                    "identityCardId": "12229929292",
                    "brokerId": "",
                    "broker": null,
                    "autoPay": 0,
                    "shareType": 1,
                    "shareProperties": null,
                    "shareRatio": 20.0,
                    "taxRatio": 10.0,
                    "payFloor": 100.0,
                    "validDay": 1.0,
                    "validDayHour": 2.0,
                    "validHour": 3.0
                },
                autoAccount:null,//小额提现账户
                handleAccount:null,//大额支付宝提现账户
                bankAccount:null,//大额银行卡提现账户
              parentId:""

            }
        },
        computed:{
            filterListLength(){
                var list = this.actor.shareProperties;
                var len = 0;
                for(var items of list){
                    if(items.delete == 0){
                        len++;
                    }
                }
                return len
            }
        },
        methods:{
            destroy(){
                this.$el &&
                this.$el.parentNode &&
                this.$el.parentNode.removeChild(this.$el);
                this.$destroy();
            },
            submit(){

            },
            changeBroker(uuid){
                console.log(uuid);
                if(uuid){
                    for(var items of this.agentList){
                        if(items.uuid == uuid){
                            this.actor.brokerId = items.uuid;
                            this.actor.brokerName = items.nickname;
                            this.actor.broker = items;
                        }
                    }
                }else{
                    this.actor.brokerId = '';
                    this.actor.brokerName = '';
                    this.actor.broker = null;
                }

            },
            getAgentList(filter){
                $API.agent.getAgentList({start:0,limit:50,filter},resp => {
                    this.agentList = resp.list;
                })
            },
            changePlat(uuid){
                if(uuid){
                    this.actor.platId = uuid;
                }else{
                    this.actor.platId = "";
                }
                this.actor.unionId = "";
                this.actor.unionName = "";
                // this.getUnionList(uuid);
              this.parentId = uuid;

                if(this.actor.broker){
                    if(this.actor.broker.platId != uuid){
                        this.actor.brokerId = '';
                        this.actor.brokerName = '';
                        this.actor.broker = null;
                    }
                }

                let filter = {
                    platId:uuid
                }
                this.getAgentList(filter);


            },
            changeUnion(uuid){
                if(uuid){
                    this.actor.unionId = uuid;
                }
                var union = null;
                for(var items of this.unionList){
                    if(items.uuid == uuid){
                        union = items;
                    }
                }
                if(union){
                    this.actor.unionName = union.name;
                    this.actor.autoPay = union.autoPay;
                }

                if(this.actor.broker){
                    if(this.actor.broker.union != uuid){
                        this.actor.brokerId = '';
                        this.actor.brokerName = '';
                        this.actor.broker = null;
                    }
                }

                let filter = {
                    unionId:uuid
                }
                this.getAgentList(filter);

            },
            getPlatList(){
                const orgId = this.user.orgId;
                $API.platform.getPlatFormList({orgId,currentPage:1,limit:50},(resp) => {
                    this.platList = resp.list;
                })
            },
            filterUnion(key){
              this.actor.unionId = '';
              let orgId = this.user.orgId;
              let parentId = this.user.orgId;
              $API.group.getGroupList({orgId,parentId,currentPage:1,limit:50,searchKey:key},(resp) => {
                this.unionList = resp.list;
              })
            },
            getUnionList(parentId){
                let orgId = this.user.orgId;
                $API.group.getGroupList({orgId,parentId,currentPage:1,limit:50},(resp) => {
                    this.unionList = resp.list;
                })
            },
          goSelectUnion(){
            selectUnion({
              user:this.user,
              orgId:this.user.orgId,
              parentId:this.parentId ||  this.user.orgId,
              callback:(list) => {
                if(list.length){
                  this.actor.unionId = list[0].uuid;
                  this.actor.unionName = list[0].name;
                  if(this.actor.broker){
                    if(this.actor.broker.union != list[0].uuid){
                      this.actor.brokerId = '';
                      this.actor.brokerName = '';
                      this.actor.broker = null;
                    }
                  }

                  let filter = {
                    unionId:list[0].uuid
                  }
                  this.getAgentList(filter);


                }else{
                  this.actor.unionId = '';
                  this.actor.unionName = '';

                  if(this.actor.broker){
                    this.actor.brokerId = '';
                    this.actor.brokerName = '';
                    this.actor.broker = null;
                  }

                  let filter = {
                    unionId:''
                  }
                  this.getAgentList(filter);

                }
              }
            })
          },
          clearSelectUnion(){
            this.actor.unionId = '';
            this.actor.unionName = '';
            if(this.actor.broker){
              this.actor.brokerId = '';
              this.actor.brokerName = '';
              this.actor.broker = null;
            }

            let filter = {
              unionId:''
            }
            this.getAgentList(filter);
          },
            setHeight(){
                var pageHeight = document.body.clientHeight;
                var height = pageHeight - 150;
                this.height = height;
            },
            optItems(items,index,opt){
                var temp = {
                    shareRatio:"",
                    maxLimit:"",
                    delete:0
                }
                if(opt == 'add'){
                    this.actor.shareProperties.splice(index+1,0,temp);
                }else{
                    if(!items.uuid){
                        this.actor.shareProperties.splice(index,1)
                    }else{
                        this.actor.shareProperties.splice(index,1)
                        this.deleteShareList.push(items);
                    }
                }

            },
            changeIdentityCard(key){//身份证号
                // console.log(key);
                if(key){
                    if(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(key)){
                        this.actor.identityCardId = key;
                    }else{
                        this.actor.identityCardId = '';
                    }
                }
            },
            changePayFloor(key){
                if(key){
                    if(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(key)){
                        if(key.substr(key.length-1,key.length) == '.'){
                            key = key.substr(0,key.length-1)
                        }
                        this.actor.payFloor = key;
                    }else{
                        console.log("false")
                        this.actor.payFloor = '';
                    }
                }
            },
            changeStatus(status){
                var actor = {
                    status:status,
                    uuid:this.actor.uuid
                }
                api.modifyActor(actor,(resp) => {
                    this.callback && this.callback();
                    this.destroy();
                })
            },
            goModify(part){
                console.log(this.actor)
                switch(part){
                    case 1:
                        var actor = {
                            orgId:this.actor.unionId || '',
                            brokerId:this.actor.brokerId,
                            nickname:this.actor.nickname
                        }
                        break;
                    case 2:
                        var actor = {
                            identityName:this.actor.identityName,
                            identityCardId:this.actor.identityCardId
                        }
                        break;
                    case 3:
                        var actor = {
                            mobile:this.actor.mobile,
                            qqId:this.actor.qqId,
                            wechatId:this.actor.wechatId
                        }
                        break;
                    case 4:
                        if(this.actor.shareType == 0){
                            var actor = {
                                shareRatio:this.actor.shareRatio,
                                shareType:this.actor.shareType,
                                taxRatio:this.actor.taxRatio
                            }
                        }else{
                            var actor = {
                                shareType:this.actor.shareType,
                                taxRatio:this.actor.taxRatio,
                            }
                            var shareProperties = [];
                            for(var i=0;i<this.actor.shareProperties.length;i++){
                                var items = this.actor.shareProperties[i];
                                var temp = {
                                    shareRatio:items.shareRatio,
                                    maxLimit:items.maxLimit,
                                    orderNum:i,
                                }
                                if(items.uuid){
                                    temp.optType = 'update';
                                    temp.uuid = items.uuid;
                                }else{
                                    temp.optType = 'add';
                                }
                                shareProperties.push(temp);
                            }

                            if(this.deleteShareList.length > 0){
                                for(var items of this.deleteShareList){
                                    var temp = {
                                        shareRatio:items.shareRatio,
                                        maxLimit:items.maxLimit,
                                        orderNum:i,
                                        uuid:items.uuid,
                                        optType:'del'
                                    }
                                    shareProperties.push(temp);
                                }
                            }
                            actor.shareProperties = shareProperties
                        }
                        break;
                    case 5:
                        var actor = {
                            payFloor:this.actor.payFloor,
                            validDay:this.actor.validDay,
                            validDayHour:this.actor.validDayHour,
                            validHour:this.actor.validHour
                        }
                        break;

                }
                actor.uuid = this.actor.uuid;
                api.modifyActor(actor,(resp) => {
                    this.callback && this.callback();
                    // this.destroy();
                })
            },

            modifyCashAccount(type){
                if(type == 2){//银行卡账号
                    let account = this.bankAccount;
                    api.modifyCashAccount({uuid:account.uuid,account},() => {
                        
                    })
                }
            }





        },
        mounted(){
            this.deleteShareList = [];
            let filter = {}
            if(this.actor.platId){
                filter.platId = this.actor.platId;
            }
            if(this.actor.unionId){
                filter.unionId = this.actor.unionId;
            }
            this.getAgentList(filter);
            this.getPlatList();
            const parentId = this.actor.platId || "";
            this.getUnionList(parentId);
            this.setHeight();


            var temp = {
                shareRatio:"",
                maxLimit:"",
                delete:0
            }
            if(this.actor.shareProperties && this.actor.shareProperties.length == 0){
                this.actor.shareProperties.push(temp);
            }


            if(this.actor.cashAccounts && this.actor.cashAccounts.length > 0){
                 for(var items of this.actor.cashAccounts){
                    if (items.accountType == 0 && items.deleted == 0) {
                        this.autoAccount = items;
                    }
                    if (items.accountType == 1 && items.deleted == 0) {
                        this.handleAccount = items;
                    }
                    if (items.accountType == 2 && items.deleted == 0) {
                        this.bankAccount = items;
                    }
                }
            }








        }
    }
</script>
<style rel="stylesheet/less" lang="less" scoped>
    @import "~@/config/config.less";
    .modify_actor{
        width: 650px;   
        overflow: auto;
        padding-bottom: 20px;
        box-sizing: border-box;
        .btns{
            margin-left: 20px;
        }
        .group{
            margin-bottom: 10px;
            .title{
                font-size: 14px;
                height: 20px;
                line-height: 20px;
                .icon{
                    float: left;
                    width: 3px;
                    height: 15px;
                    background: #67a7f6;
                    margin-right: 8px;
                    display: inline-block;
                    margin-top: 2px;
                }
            }
            .t_title{
                margin-top: 10px;
                padding-left: 20px;
            }
            .warpper{
                padding-left: 30px;

                .items{
                    margin: 10px 60px 10px 0;
                    float: left;
                    &.stage{
                        float: none;
                        /deep/ .el-input{
                            width: 80px;
                            margin:0 4px;
                        }
                        .part{
                            margin-right: 30px;
                        }

                        .el-icon{
                            font-size: 18px;
                            cursor: pointer;
                            margin-right: 6px;
                            display: none;
                            &:hover{
                                color: @COMMON_BLUE;
                            }
                        }
                        &:hover{
                            .el-icon{
                                display: inline-block;
                            }
                        }
                    }
                    /deep/ .el-select{
                        width: 190px;
                    }
                    /deep/ .el-input{
                        width: 190px;
                    }

                    &:nth-child(2n){
                        margin-right: 0;
                    }
                    .name{
                        width: 70px;
                        height: 30px;
                        line-height: 30px;
                        float: left;
                    }
                    .content{
                        margin-left: 70px;
                      position: relative;
                      .el-icon-error{
                        position: absolute;
                        right: 11px;
                        top: 10px;
                        font-size: 12px;
                        color: #c0c4cb;
                        display: none;
                      }
                      &:hover{
                        .el-icon-error{
                          display: block !important;
                        }
                      }
                        .info{
                            margin-top: 2px;
                            font-size: 12px;
                            color: @FONT_COLOR_FOUR;
                        }
                    }
                }
            }
            &.payFloor{
                .warpper{
                    .items{
                        margin: 10px 5px 10px 0 !important;
                    }
                }
                .name{
                    width: 90px !important;
                    height: 30px;
                    line-height: 30px;
                    float: left;
                }
                .content{
                    margin-left: 90px !important;

                    .info{
                        margin-top: 2px;
                        font-size: 12px;
                        color: @FONT_COLOR_FOUR;
                    }
                }
            }

        }




    }
</style>
