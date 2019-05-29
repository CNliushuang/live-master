<template>
    <modal :title="'导入流水'" @destroy="destroy" :is-footer="false">
        <div class="import_task_wrapper">
            <div class="import-task-group clearfix">
                选择导入平台：
                <el-select :disabled="user.platId?true:false" :clearable="true" v-model="orgName" @change="changePlat" placeholder="请选择导入平台">
                        <el-option
                            v-for="item in platList"
                            :key="item.uuid"
                            :label="item.name"
                            :value="item.uuid"
                            >
                        </el-option>
                    </el-select>
            </div>
            <div class="import-task-group clearfix">
                <div class="content">
                    <!-- <p>上传本地已从微软project中导出的成功文件；</p> -->
                    <p><a class="import-btn">
                        <span class="box">
                            <template v-if="!uploading && !importing">上传本地文件</template>
                            <template v-if="uploading">上传 {{ progress }}</template>
                            <template v-if="importing">导入中...</template>
                        </span>
                        <input type="file" id="importFileUpload" name="file" class="import-file">
                    </a></p>
                </div>
            </div>
            <div class="import-task-group clearfix">
                <div class="content">
                    <p>数据导入成功并反馈导入信息；</p>
                    <p v-if="result.total > 0">
                    <span class="num-item total" @click="showResultList('total')">总数：{{ result.total }}条</span>
                    <span class="num-item success" @click="showResultList('success')">成功：{{ result.success }}条</span>
                    <span class="num-item fail" @click="showResultList('fail')">失败：{{ result.fail }}条</span></p>
                    <template v-if="result.fail != 0">
                        <span style="margin-top:6px;">
                            <el-button type="warning" plain @click="exportFailData">导出失败数据</el-button>
                        </span>
                    </template>
                    
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
    import * as api from './api';
    import { dateToTimes,timesToDate } from '@/config/utils'
    import Modal from '@/modules/widget/common/Modal.vue';
    import Toast from '@/modules/widget/toast';
    import config_server from '@/config/config'

  export default{
    components:{
        Modal
    },
    data(){
        return {
            rule:false,
            groupId: null,
            progress: 0,
            uploading: false,
            importing: false,
            platList:[],
            result: {
                success: 0,
                fail: 0,
                done: 0,
                total: 0,
                list: [],
                showList: []
            },
            orgName:""
        }
    },
    methods:{
        destroy(){/*销毁组件*/
            this.$el &&
            this.$el.parentNode &&
            this.$el.parentNode.removeChild(this.$el);
            this.$destroy();
        },
        ruleShow(){
            this.rule = !this.rule;
        },
        getPlatList(){
            $API.platform.getPlatFormList({orgId:this.orgId,start:0,limit:50},resp => {
                this.platList = resp.list;
            })
        },
        changePlat(uuid){
            this.orgId = uuid;
            this.initUpload();
        },
        exportFailData(){
            var url = config_server.server_api + '/plat/flow/import/result/fail/excel.json?opt_id='+this.groupId;
            window.open(url);
        },
        importProgress(){
            api.projectImportStatus({groupId:this.groupId}, data => {
                //console.log(data);
                this.result.total = data.count;
                this.result.success = data.successCount;
                this.result.fail = data.failCount;
                this.result.done = data.done;
                if(data.done == data.count){
                    Toast({
                        content:"导入成功",
                        type:"success"
                    })
                    this.importing = false;
                }else{
                    setTimeout(() => {
                        this.importProgress();
                    }, 1000);
                }
                
            });

        },
        showResultList(status){
            if(status == 'total'){
                this.result.showList = this.result.list;
            }else if(status == 'success'){
                this.result.showList = this.result.list.filter(item => {
                    return item.status == 1;
                });
            }else if(status == 'fail'){
                this.result.showList = this.result.list.filter(item => {
                    return item.status == 2 || item.status == 3;
                });
            }
        },
        initUpload(){
            const _this = this;
            const importUrl = '/api/plat/flow/import.json?token=' + this.token + '&plat='+this.plat+'&orgId='+this.orgId;
            console.log("init upload")
            console.log(importUrl)
            const u = $('#importFileUpload').fileupload({
                url: importUrl,
                autoUpload: true,
                add(e, data){
                    console.log("add files")
                    console.log(_this.uploading)
                    console.log(_this.importing)
                    if(!_this.uploading && !_this.importing){
                        const f = data.originalFiles[0].name;
                        if(!/\.(xls|xlsx|XLS|XLSX|csv|CSV)$/.test(f)){
                            Toast({
                                content: '格式不正确',
                                type: "error",
                            });
                            return false;
                        };
                        _this.uploading = true;
                        _this.result.total = 0;
                        _this.result.success = 0;
                        _this.result.fail = 0;
                        _this.result.done = 0;
                        _this.result.list = [];
                        data.submit();
                    }else{
                        Toast({
                            content: '正在进行导入...',
                            type: "error",
                        });
                    }
                    
                },
                progressall(e, data){
                    _this.progress = data.loaded/data.total*100 + '%';
                },
                success(data){
                    _this.uploading = false;
                    
                    if(data.result != 0){
                        Toast({
                            content: data.msg,
                            type:"error"
                        });
                        return false;
                        // _this.$nextTick(() => {
                        //     _this.initUpload();
                        // })
                    }else{
                        _this.groupId = data.optId;
                        _this.importing = true;
                        _this.importProgress();
                    }                    
                }
            });
        },
    },
    mounted(){
        setTimeout(() => {
            this.initUpload();
            this.getPlatList();
        },500)
    },
    created(){
        if(this.user){
            if(this.user.platId){
                this.orgId = this.user.platId;
                this.orgName = this.user.platName;
            }
        }
    }
  }
</script>
<style rel="stylesheet/less" lang="less" scoped>
    @import "~@/config/config.less";
    .import_task_wrapper{
        width: @MODAL_WIDTH;
        max-height: 400px;
        overflow: auto;
        .import-task-group{
            margin-bottom: 20px;
            .title-num{
                width: 24px;
                height: 24px;
                line-height: 24px;
                text-align: center;
                color: #fff;
                font-size: 14px;
                background-color: #6fd1ff;
                border-radius: 12px;
                float: left;
            }
            .content{
                font-size: 13px;
                line-height: 25px;
                color: #666;
                .download-link{
                    color: #009cff;
                    cursor: pointer;
                    .toggle{
                        display: inline-block;
                        width: 14px;
                        height: 8px;
                        background: url(./images/look.png) no-repeat;
                        margin-left: 10px;
                        &.up{
                            background: url(./images/look_toggle.png) no-repeat;
                        }
                    }
                }
                .import-btn{
                    font-size:13px;
                    padding: 0 36px;
                    width: 90px;
                    height: 28px;
                    line-height: 28px;
                    border-radius: 2px;
                    display: inline-block;
                    cursor: pointer;
                    position: relative;
                    text-align: center;
                    margin-top: 10px;

                    color: #fff;
                    background-color: #409EFF;
                    border-color: #409EFF;

                    &:hover{
                      //background-color:#2889ea;
                      //color: #fff;
                      //border: 1px solid #2889ea;
                        background: #66b1ff;
                        border-color: #66b1ff;
                        color: #fff;
                    }
                    .import-file{
                        display: block;
                        height: 30px;
                        width: 100%;
                        position: absolute;
                        left: 0;
                        top: 0px;
                        opacity: 0;
                        z-index: 222;
                        cursor:pointer;
                    }
                }
                .num-item{
                    margin-right: 30px;
                    cursor: pointer;
                    &.total{
                        color: #666;
                    }
                    &.success{
                        color: #71ac6a;
                    }
                    &.fail{
                        color: #ff5656;
                    }
                }
            }
            .result-list{
                max-height: 150px;
                overflow-y: auto;
                .item{
                    height: 35px;
                    line-height: 35px;
                    padding: 0 10px;
                    color: #666;
                    &:nth-child(odd) {
                        background-color: #f7f8fa;
                    }
                    .order-num{
                        float: left;
                    }
                    .name{
                        float: left;
                        margin-left: 10px;
                        width: 400px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    .status{
                        float: left;
                        margin-left: 10px;
                        &.success{
                            color: #71ac6a;
                        }
                        &.fail{
                            color: #ff5656;
                        }
                    }
                }
            }
        }
    }
</style>
