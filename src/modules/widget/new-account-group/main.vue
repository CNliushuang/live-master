<template>
    <modal :title="'添加账号组'" @destroy="destroy" @submit="submit">
        <div class="account_group">
            <div class="items">
                <div class="name">名称</div>
                <div class="content">
                    <el-input v-model="authorityGroup.name" :clearable="true" :minlength="1" :maxlength="20" placeholder="名称" value="平台管理员"></el-input>
                </div>
            </div>
            <div class="items">
                <div class="name">数据级别</div>
                <div class="content">
                    <el-select :disabled="authorityGroup.uuid?true:false" v-model="authorityGroup.orgType" placeholder="请选择">
                        <el-option
                          v-for="item in orgTypeList"
                          :key="item.uuid"
                          :label="item.name"
                          :value="item.uuid">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="items">
                <div class="name">状态</div>
                <div class="content">
                    <el-select v-model="authorityGroup.status" placeholder="请选择">
                        <el-option
                          v-for="item in statusList"
                          :key="item.uuid"
                          :label="item.name"
                          :value="item.uuid">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="items">
                <div class="name">创建日期</div>
                <div class="content">
                    <el-input :readonly="true" placeholder="创建日期" :value="authorityGroup.createDate | timesToDate('yyyy-MM-dd')"></el-input>
                </div>
            </div>
            <div class="items">
                <div class="name">设置权限</div>
                <div class="content" @click="goSetLimit">
                    <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                     placeholder="设置权限" :value="filterLimit" :readonly="true"></el-input>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
    import * as api from './api';
    import Modal from '@/modules/widget/common/Modal.vue';
    import SetLimit from '@/modules/widget/set-limit';
    export default{
        components:{
            Modal
        },
        data(){
            return {
                orgTypeList:[{
                    uuid:"SYSTEM",
                    name:"系统"
                },{
                    uuid:"PLAT",
                    name:"平台"
                },{
                    uuid:"UNION",
                    name:"公会"
                }],
                status:"",
                statusList:[{
                    uuid:1,
                    name:"已停用"
                },{
                    uuid:0,
                    name:"已启用"
                }],
                authorityGroup:{
                    name:"",
                    orgType:"PLAT",
                    status:0,
                    createDate:new Date().getTime(),
                    authorities:[]
                },
                locked:false
            }
        },
        computed:{
            filterLimit(){
                var result = [];
                if(this.authorityGroup && this.authorityGroup.authorities){
                    for(var items of this.authorityGroup.authorities){
                        if(items.readStatus || items.writeStatus){
                            result.push(items.summary);
                        }
                    }
                }
                return result.join('，');
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
                if(!this.authorityGroup.name.trim()){
                    this.$message({
                      message: '请输入账号组名称',
                      type: 'error'
                    });
                    return false;
                }
                if(!this.locked){
                    this.locked = true;
                    setTimeout(() => {
                        this.locked = false;
                    },5000)
                    console.log(this.authorityGroup)
                    if(this.authorityGroup.uuid){//修改
                        api.modifyAuthorityGroup(this.authorityGroup,() => {
                            this.locked = false;
                            this.callback && this.callback();
                            close && close();
                        })
                    }else{//新建
                        api.createAuthorityGroup(this.authorityGroup,() => {
                            this.locked = false;
                            this.callback && this.callback();
                            close && close();
                        })
                    }
                }

                


                
            },
            goSetLimit(){
                SetLimit({
                    authoritiesList:JSON.parse(JSON.stringify(this.authorities)),
                    authorities:this.authorityGroup.authorities,
                    callback:(list) => {
                        console.log("######")
                        console.log(list);
                        this.authorityGroup.authorities = list;
                    }
                })
            }
   

        },
        mounted(){
        }
    }
</script>
<style rel="stylesheet/less" lang="less" scoped>
    @import "~@/config/config.less";
    .account_group{
        width: 650px;
        overflow: auto;
        .items{
            margin-bottom: 20px;
            .name{
                width: 80px;
                height: 30px;
                line-height: 30px;
                float: left;
            }
            .content{
                margin-left: 80px;
                /deep/ .el-select{
                    width: 100%;
                }
            }
        }


    }
</style>
