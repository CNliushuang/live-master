<template>
    <modal :title="'新增账号'" @destroy="destroy" @submit="submit">
        <div class="modify_actor" :style="{height:height+'px'}">
            <div class="group">
                <div class="warpper clearfix">
                    <div class="items">
                        <div class="name">账号名称</div>
                        <div class="content">
                            <el-input  :clearable="true" :minlength="1" :maxlength="20" v-model="account.loginName" placeholder="请输入账号名称"></el-input>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">密码</div>
                        <div class="content">
                            <el-input  :clearable="true" :minlength="1" :maxlength="16" v-model="account.password" placeholder="请输入密码"></el-input>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">账号组</div>
                        <div class="content">
                            <el-select :clearable="true" @change="changeAuthorityGroup" v-model="account.authorityGroupId" placeholder="请选择账号组">
                                <el-option
                                    v-for="item in authorityGroup"
                                    :key="item.uuid"
                                    :label="item.name"
                                    :value="item.uuid"
                                    >
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">数据级别</div>
                        <div class="content">
                            <el-select :disabled="true" v-model="account.authorityGroupOrgType" placeholder="请选择数据级别">
                                <el-option
                                    v-for="item in orgType"
                                    :key="item.uuid"
                                    :label="item.name"
                                    :value="item.uuid"
                                    >
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">
                            平台名称
                        </div>
                        <div class="content">
                            <el-select :disabled="disabledPlat" :clearable="true" v-model="account.platId" @change="changePlat" placeholder="请选择平台">
                                <el-option
                                    v-for="item in platList"
                                    :key="item.uuid"
                                    :label="item.name"
                                    :value="item.uuid"
                                    >
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">
                            公会名称
                        </div>
                      <div class="content" @click="goSelectUnion" style="cursor: pointer">
                            <!--<el-select :disabled="disabledUnion" :clearable="true" v-model="account.unionId" @change="changeUnion" placeholder="请选择公会"  filterable :filter-method="filterUnion">-->
                                <!--<el-option-->
                                    <!--v-for="item in unionList"-->
                                    <!--:key="item.uuid"-->
                                    <!--:label="item.name"-->
                                    <!--:value="item.uuid"-->
                                    <!--&gt;-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        <el-input :value="account.unionName" readonly="" placeholder="请选择公会" ></el-input>
                        <i v-if="account.unionName" class="el-icon-error" @click.stop="clearSelectUnion"></i>


                        </div>
                    </div>
                    <div class="items">
                        <div class="name">管理员昵称</div>
                        <div class="content">
                            <el-input  :clearable="true" :minlength="1" :maxlength="20" v-model="account.nickname" placeholder="请输入管理员昵称"></el-input>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">联系电话</div>
                        <div class="content">
                            <el-input  :clearable="true"  v-model="account.mobile" placeholder="请输入联系电话"></el-input>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">状态</div>
                        <div class="content">
                            <el-select v-model="account.status" placeholder="请选择状态">
                                <el-option
                                    v-for="item in statusList"
                                    :key="item.uuid"
                                    :label="item.name"
                                    :value="item.uuid"
                                    >
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>

                <div v-if="account.authorityGroupOrgType == 'UNION'" class="clearfix other_group">
                    <div class="items">
                        <div class="name">选择多个公会(仅运维管理员可用)</div>
                        <div class="content" @click="goSelectUnion">
                            <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                             placeholder="选择多个公会" :value="filterGroups" :readonly="true"></el-input>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    </modal>
</template>

<script>
    import * as api from './api';
    import Modal from '@/modules/widget/common/Modal.vue';
    import SelectUnion from '@/modules/widget/select-union'

    import selectUnionV2 from '@/modules/widget/select-union-v2'


    export default{
        components:{
            Modal
        },
        data(){
            return {
                height:200,
                authorityGroup:[],
                orgType:[{
                    uuid:"SYSTEM",
                    name:"系统",
                },{
                    uuid:"PLAT",
                    name:"平台",
                },{
                    uuid:"UNION",
                    name:"公会",
                }],
                statusList:[{
                    uuid:1,
                    name:"已停用",
                },{
                    uuid:0,
                    name:"已启用",
                }],
                platList:[],
                unionList:[],
                disabledPlat:false,
                disabledUnion:false,
                account:{
                    authorityGroupId:"",
                    authorityGroupOrgType:"",
                    nickname:"",
                    mobile:"",
                    loginName:"",
                    password:"",
                    status:0,
                    platId:"",
                  unionId:"",
                  unionName:"",
                    managerOrgs:[]
                },
                locked:false,
                selectUnionList:[],
              parentId:""
            }
        },
        computed:{
            filterGroups(){
                var result = '';
                for(var i=0;i<this.selectUnionList.length;i++){
                    result = result + this.selectUnionList[i].name;
                    if(i < this.selectUnionList.length-1){
                        result = result + '，';
                    }
                }
                return result;
            }
        },
        methods:{
            destroy(){
                this.$el &&
                this.$el.parentNode &&
                this.$el.parentNode.removeChild(this.$el);
                this.$destroy();
            },
            goSelectUnion(){
                SelectUnion({
                    user:this.user,
                    select:this.selectUnionList,
                    callback:(select) => {
                        if(this.account.unionId){
                            var list = [];
                            for(var items of select){
                                if(items.uuid != this.account.unionId){
                                    list.push(items);
                                }
                            }
                            this.selectUnionList = list;
                        }else{
                            this.selectUnionList = select;
                        }
                    }
                })
            },
            changeAuthorityGroup(data){
                var obj = this.authorityGroup.filter(function(item) { 
                    return item.uuid == data; 
                });
                if(obj.length > 0){
                    this.account.authorityGroupOrgType = obj[0].orgType;
                    if(obj[0].orgType == 'SYSTEM'){
                        this.disabledPlat = true;
                        this.disabledUnion = true;
                    }else if(obj[0].orgType == 'PLAT'){
                        this.disabledPlat = false;
                        this.disabledUnion = true;
                    }else if(obj[0].orgType == 'UNION'){
                        if(this.user.platId){
                            this.disabledPlat = true;
                        }else{
                            this.disabledPlat = false;
                        }
                        this.disabledUnion = false;
                    }



                }else{
                    this.account.authorityGroupOrgType = "";
                }
                
            },
            onSame(array1,array2){//比较两个数组变化
              var result = [];
              for(var i = 0; i < array2.length; i++){
                  var uuid2 = array2[i].uuid;
                  var isExist = false;
                  for(var j = 0; j < array1.length; j++){
                      var uuid1 = array1[j].uuid;
                      if(uuid1 == uuid2){
                          isExist = true;
                          break;
                      }
                  }
                  if(!isExist){
                      result.push(uuid2);
                  }
              }
              return result;
            },
            submit(close){
                if(!this.account.loginName){
                    this.$message({
                      message: '请输入登录账号',
                      type: 'error'
                    });
                    return false;
                }

                if(!this.account.authorityGroupId){
                    this.$message({
                      message: '请选择账号组',
                      type: 'error'
                    });
                    return false;
                }

                if(this.account.mobile){
                    if(!/^1[0-9]{10}$/.test(this.account.mobile)){
                        this.$message({
                          message: '联系电话格式不正确',
                          type: 'error'
                        });
                        return false;
                    }
                }

                if(!this.locked){
                    this.locked = true;
                    setTimeout(() => {
                        this.locked = false;
                    },5000)
                    if(this.account.uuid){

                        var oldMembers = this.account.managerOrgs || [];
                        var data = this.selectUnionList;
                        var deleteIds = this.onSame(data,oldMembers);
                        var addIds = this.onSame(oldMembers,data);
                        let managerOrgs = [];

                        // console.log(deleteIds)
                        // console.log(addIds)
                        for(var items of deleteIds){
                            var temp = {
                                uuid:items,
                                optType:"del"
                            }
                            managerOrgs.push(temp);
                        }

                        for(var items of addIds){
                            var temp = {
                                uuid:items,
                                optType:"add"
                            }
                            managerOrgs.push(temp);
                        }



                        api.modifyAccount(this.account,managerOrgs,() => {
                            this.locked = false;
                            this.callback && this.callback();
                            close && close();
                        })
                    }else{

                        let managerOrgs = [];
                        for(var items of this.selectUnionList){
                            var temp = {
                                uuid:items.uuid
                            }
                            managerOrgs.push(temp)
                        }



                        api.createAccount(this.account,managerOrgs,() => {
                            this.locked = false;
                            this.callback && this.callback();
                            close && close();
                        })
                    }
                }


                


            },
            getAccountGroup(){
                $API.limit.getAccountGroup({start:0,limit:50},resp => {
                    /*若是平台级别，是否筛选平台账号组*/
                    let authorityGroup = resp.authorityGroup;
                    let temp_list = [];

                    if(this.user.platId){
                        for(var items of authorityGroup){
                            if(items.orgType == 'UNION'){
                                temp_list.push(items);
                            }
                        }
                    }else{
                        temp_list = authorityGroup;
                    }

                    this.authorityGroup = temp_list;
                })
            },
            changePlat(uuid){
                if(uuid){
                    this.account.platId = uuid;
                }else{
                    this.account.platId = "";
                }
                // this.getUnionList(uuid);
              this.parentId = uuid;
            },

            changeUnion(uuid){
                if(uuid && this.selectUnionList && this.selectUnionList.length > 0){
                    var index = this.selectUnionList.findIndex((items) => {
                        return items.uuid == uuid;
                    })
                    if(index || index == 0){
                        this.selectUnionList.splice(index,1);
                    }
                }
            },


            getPlatList(){
                const orgId = this.user.orgId;
                $API.platform.getPlatFormList({orgId,start:0,limit:50},resp => {
                    this.platList = resp.list;
                })
            },
            filterUnion(key){
              let orgId = this.user.orgId;
              let parentId = this.user.orgId;
              $API.group.getGroupList({orgId,parentId,currentPage:1,limit:50,searchKey:key},(resp) => {
                this.unionList = resp.list;
              })
            },
            getUnionList(parentId){
                const orgId = this.user.orgId;
                parentId = parentId ||  this.user.orgId;
                $API.group.getGroupList({orgId,parentId,start:0,limit:50},resp => {
                    this.unionList = resp.list;
                })
            },
          goSelectUnion(){
            selectUnionV2({
              user:this.user,
              orgId:this.user.orgId,
              parentId:this.parentId ||  this.user.orgId,
              callback:(list) => {
                if(list.length){
                  this.account.unionId = list[0].uuid;
                  this.account.unionName = list[0].name;
                  var uuid = list[0].uuid;
                  if(uuid && this.selectUnionList && this.selectUnionList.length > 0){
                    var index = this.selectUnionList.findIndex((items) => {
                      return items.uuid == uuid;
                    })
                    if(index || index == 0){
                      this.selectUnionList.splice(index,1);
                    }
                  }

                }else{
                  this.account.unionId = '';
                  this.account.unionName = '';
                }
              }
            })
          },
          clearSelectUnion(){
            this.account.unionId = '';
            this.account.unionName = '';
          },
            setHeight(){
                var pageHeight = document.body.clientHeight;
                var height = pageHeight - 150 - 40;
                this.height = height;
            }

        },
        mounted(){
            this.setHeight();
            this.getAccountGroup();

            this.getPlatList();
            this.getUnionList();

            if(this.account){
                this.account.password = '';
                if(this.account.authorityGroup){
                    this.account.authorityGroupOrgType = this.account.authorityGroup.orgType;
                }

                if(this.account.managerOrgs && this.account.managerOrgs.length > 0){
                    this.selectUnionList = JSON.parse(JSON.stringify(this.account.managerOrgs));
                }


            }


            if(this.user && !this.account.uuid){
                if(this.user.platId){
                    this.disabledPlat = true;
                    this.account.platId = this.user.platId;
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
            .other_group{
                padding: 10px;
                border-top: 1px solid #f4f4f4;
                .items{
                    .name{
                        margin-bottom: 10px;
                    }
                }
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
                        width: 80px;
                        height: 30px;
                        line-height: 30px;
                        float: left;
                    }
                    .content{
                        margin-left: 80px;
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


        }




    }
</style>
