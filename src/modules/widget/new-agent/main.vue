<template>
    <modal :title="filterTitle" @destroy="destroy" @submit="submit">
        <div class="modify_actor" :style="{height:height+'px'}">
            <div class="group">
                <div class="warpper clearfix">
                    <div class="items">
                        <div class="name">经纪人名称</div>
                        <div class="content">
                            <el-input  :clearable="true" :minlength="1" :maxlength="20" v-model="agent.nickname" placeholder="请输入经纪人"></el-input>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">平台</div>
                        <div class="content">
                            <el-select :disabled="user.platId?true:false" v-model="agent.platName" @change="changePlat" placeholder="请选择平台">
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
                        <div class="name">公会</div>
                      <div class="content" @click="goSelectUnion" style="cursor: pointer">
                            <!--<el-select v-model="agent.unionName" @change="changeUnion" placeholder="请选择公会"   filterable :filter-method="filterUnion">-->
                                <!--<el-option-->
                                  <!--v-for="item in unionList"-->
                                  <!--:key="item.uuid"-->
                                  <!--:label="item.name"-->
                                  <!--:value="item.uuid">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        <el-input :value="agent.unionName" readonly="" placeholder="请选择公会" ></el-input>
                        <i v-if="agent.unionName" class="el-icon-error" @click.stop="clearSelectUnion"></i>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">状态</div>
                        <div class="content">
                            <el-select v-model="agent.status" placeholder="请选择状态">
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

                     <div class="items">
                        <div class="name">分成比例</div>
                        <div class="content">
                            <el-input v-model="agent.shareRatio" type="number" placeholder="请输入分成比例"></el-input>
                        </div>
                    </div>
                     <div class="items">
                        <div class="name">个税</div>
                        <div class="content">
                            <el-input v-model="agent.taxRatio" type="number" placeholder="请输入个税"></el-input>
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
    import selectUnion from '@/modules/widget/select-union-v2'

    export default{
        components:{
            Modal
        },
        data(){
            return {
                height:200,
                statusList:[{
                    uuid:1,
                    name:"已停用",
                },{
                    uuid:0,
                    name:"已启用",
                }],
                accountList:[],
                unionList:[],
                platList:[],
                agent:{
                    nickname:"",
                    shareRatio:"",
                    taxRatio:"",
                    status:0,
                    platId:"",
                    platName:"",    
                    unionId:"",
                    unionName:""
                },
                locked:false,
              parentId:""
            }
        },
        computed:{
            filterTitle(){
                var result = '添加经纪人';
                if(this.agent.uuid){
                    result = '修改经纪人';
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
            submit(close){
                if(!this.agent.nickname){
                    this.$message({
                      message: '请输入经纪人名称',
                      type: 'error'
                    });
                    return false;
                }
                if(!this.agent.shareRatio){
                    this.$message({
                      message: '请输入分成比例',
                      type: 'error'
                    });
                    return false;
                }
                if(!this.agent.taxRatio){
                    this.$message({
                      message: '请输入个税',
                      type: 'error'
                    });
                    return false;
                }
                if(!this.agent.unionId){
                    this.$message({
                      message: '请选择工会',
                      type: 'error'
                    });
                    return false;
                }

                if(!this.locked){
                    this.locked = true;
                    setTimeout(() => {
                        this.locked = false;
                    },5000)
                    if(this.agent.uuid){
                        api.modifyAgent(this.agent,() => {
                            this.locked = false;
                            this.callback && this.callback()
                            close && close();
                        })
                    }else{
                        api.createAgent(this.agent,() => {
                            this.locked = false;
                            this.callback && this.callback()
                            close && close();
                        })
                    }
                }
                
                
            },
            changePlat(uuid){
                if(uuid){
                    this.agent.platId = uuid;
                }else{
                    this.agent.platId = "";
                }
                this.agent.unionId = "";
                this.agent.unionName = "";
                // this.getUnionList(uuid);
              this.parentId = uuid;
            },
            changeUnion(uuid){
                if(uuid){
                    this.agent.unionId = uuid;
                }
                var union = null;
                for(var items of this.unionList){
                    if(items.uuid == uuid){
                        union = items;
                    }
                }
                if(union){
                    this.agent.unionName = union.name;
                    this.agent.autoPay = union.autoPay;
                }

            },
            getPlatList(){
                const orgId = this.user.orgId;
                $API.platform.getPlatFormList({orgId,currentPage:1,limit:50},(resp) => {
                    this.platList = resp.list;
                })
            },
            filterUnion(key){
              this.agent.unionId = '';
              let orgId = this.user.orgId;
              let parentId = this.user.orgId;
              $API.group.getGroupList({orgId,parentId,currentPage:1,limit:50,searchKey:key},(resp) => {
                this.unionList = resp.list;
              })
            },
            getUnionList(parentId){
                let orgId = this.user.orgId;
                parentId = parentId || this.user.orgId;
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
                  this.agent.unionId = list[0].uuid;
                  this.agent.unionName = list[0].name;
                  this.agent.autoPay = list[0].autoPay;
                }else{
                  this.agent.unionId = '';
                  this.agent.unionName = '';
                  this.agent.autoPay = 0;
                }
              }
            })
          },
          clearSelectUnion(){
            this.agent.unionId = '';
            this.agent.unionName = '';
            this.agent.autoPay = 0;
          },
            getAccountList(){
                // $API.limit.getAccountList({start:0,limit:50,scope:"OrgIdNull"},resp => {
                //     this.accountList = resp.list;
                // })
            },
            setHeight(){
                var pageHeight = document.body.clientHeight;
                var height = pageHeight - 150 - 40;
                this.height = height;
            }

        },
        mounted(){
            if(this.user && this.user.platId){
                this.agent.platId = this.user.platId;
                this.agent.platName = this.user.platName;
            }
            if(this.user && this.user.unionId){
                this.agent.unionId = this.user.unionId;
                this.agent.unionName = this.user.unionName;
            }
            this.setHeight();
            this.getAccountList();
            this.getPlatList();
            this.getUnionList();
            




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
            .warpper{
                padding-left: 30px;
                .items{
                    margin: 10px 60px 20px 0;
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
                        box-sizing: border-box;
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
