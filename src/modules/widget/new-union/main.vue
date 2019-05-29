<template>
    <modal :title="filterTitle" @destroy="destroy" @submit="submit">
        <div class="modify_actor" :style="{height:height+'px'}">
            <div class="group">
                <div class="warpper clearfix">
                    <div class="items">
                        <div class="name">公会名称</div>
                        <div class="content">
                            <el-input  :clearable="true" :minlength="1" :maxlength="20" v-model="union.name" placeholder="请输入公会名称"></el-input>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">状态</div>
                        <div class="content">
                            <el-select v-model="union.status" placeholder="请选择状态">
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
                        <div class="name">平台</div>
                        <div class="content">
                            <el-select :disabled="user.platId?true:false" v-model="union.parentId" @change="changePlat" placeholder="请选择平台">
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
                        <div class="name">分成比例</div>
                        <div class="content">
                            <el-input  :clearable="true" type="number" v-model="union.shareRatio" placeholder="请输入分成比例"></el-input>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">承担税点</div>
                        <div class="content">
                            <el-input  :clearable="true" type="number" v-model="union.taxRatio" placeholder="请输入承担税点"></el-input>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">管理员</div>
                        <div class="content">
                            <el-select :disabled="disabledAdmins" v-model="union.adminName" @change="changeAdmin" placeholder="请选择管理员">
                                <el-option
                                    v-for="item in accountList"
                                    :key="item.uuid"
                                    :label="item.loginName"
                                    :value="item.uuid"
                                    >
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="items">
                        <div class="name">代发工资</div>
                        <div class="content">
                            <el-select v-model="union.autoPay" placeholder="请选择状态">
                                <el-option
                                    v-for="item in autoPayList"
                                    :key="item.uuid"
                                    :label="item.name"
                                    :value="item.uuid"
                                    >
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div v-if="union.autoPay == 1 && union.uuid" class="items">
                        <div class="name">自动日期</div>
                        <div class="content">
                            {{union.autoPayDate | timesToDate('yyyy-MM-dd HH:mm:ss')}}
                        </div>
                    </div>
                    <div v-if="union.uuid" class="items">
                        <div class="name">即将生效</div>
                        <div class="content">
                            {{union.preSetAutoPay == 0?'代发工资':'自动代发工资'}}
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
    export default{
        components:{
            Modal
        },
        data(){
            return {
                height:200,
                authorityGroup:[],
                autoPayList:[{
                    uuid:0,
                    name:"手动",
                },{
                    uuid:1,
                    name:"系统",
                }],
                statusList:[{
                    uuid:1,
                    name:"已停用",
                },{
                    uuid:0,
                    name:"已启用",
                }],
                platList:[],
                accountList:[],
                disabledPlat:false,
                union:{
                    name:"",
                    status:0,
                    parentId:"",
                    shareRatio:"",
                    taxRatio:"",
                    autoPay:0,
                    orgType:"UNION",
                    autoPayDate:"",
                    admin:"",
                    adminName:""

                },
                locked:false
            }
        },
        computed:{
            filterTitle(){
                var title = "新增公会";
                if(this.union.uuid){
                    title = "修改公会";
                }
                return title;
            },
            disabledAdmins(){
                var result = false;
                if(this.union.uuid){
                    // if(!this.union.majorAdmin){
                    //     result = false;
                    // }else{
                    //     result = true;
                    // }
                    result = true;
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
            changeAdmin(uuid){
                this.union.admin = uuid;
            },
            submit(close){
                console.log(this.union)
                if(!this.union.name){
                    this.$message({
                      message: '请输入公会名称',
                      type: 'error'
                    });
                    return false;
                }

                if(!this.union.parentId){
                    this.$message({
                      message: '请选择平台',
                      type: 'error'
                    });
                    return false;
                }
                if(!this.union.shareRatio){
                    this.$message({
                      message: '请输入分成比例',
                      type: 'error'
                    });
                    return false;
                }
                if(!this.union.taxRatio){
                    this.$message({
                      message: '请输入承担税点',
                      type: 'error'
                    });
                    return false;
                }
                if(!this.union.admin){
                    this.$message({
                      message: '请选择管理员',
                      type: 'error'
                    });
                    return false;
                }
                if(!this.locked){
                    this.locked = true;
                    setTimeout(() => {
                        this.locked = false;
                    },5000)
                    if(this.union.uuid){
                        api.modifyUnion(this.union,() => {
                            this.locked = false;
                            this.callback && this.callback();
                            close && close();
                        })
                    }else{
                        api.createUnion(this.union,() => {
                            this.locked = false;
                            this.callback && this.callback();
                            close && close();
                        })
                    }
                }

                


            },
            getPlatList(){
                const orgId = this.user.orgId;
                $API.platform.getPlatFormList({orgId,start:0,limit:50},resp => {
                    this.platList = resp.list;
                })
            },
            changePlat(){
                setTimeout(() => {
                    this.getAccountList();
                },500)
            },
            getAccountList(){
                let orgType = 'UNION';
                let orgId = '';
                if(this.user.platId){
                    orgId = this.user.platId;
                }
                if(this.union.parentId){
                    orgId = this.union.parentId;
                }
                if(this.union.uuid){
                    orgId = this.union.uuid;
                }
                if(orgId){
                    $API.limit.getAdminsList({orgType,orgId},resp => {
                        this.accountList = resp.list;
                    })
                }
                
            },
            setHeight(){
                var pageHeight = document.body.clientHeight;
                var height = pageHeight - 150 - 40;
                this.height = height;
            }

        },
        mounted(){
            // if(!this.union.autoPayDate){
            //     this.union.autoPayDate = ''
            // }else{
            //     this.union.autoPayDate = new Date(this.union.autoPayDate);
            // }

            if(this.union.majorAdmin){
                this.union.adminName = this.union.majorAdmin.loginName;
                this.union.admin = this.union.majorAdmin.uuid;
            }



            this.setHeight();
            this.getAccountList();
            this.getPlatList();
            if(this.user.platId){
                this.union.parentId = this.user.platId;
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
                        height: 30px;
                        line-height: 30px;
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
