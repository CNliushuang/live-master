<template>
    <modal :title="'修改配置信息'" @destroy="destroy">
        <div class="change_password" :style="{height:height+'px'}">
            <div class="group">
                <div class="title">客服信息</div>
                <div class="items clearfix">
                    <div class="name">客服QQ</div>
                    <div class="content">
                        <el-input placeholder="客服QQ" type="text" v-model="kf.qq"></el-input>
                    </div>
                </div>
                <div class="items clearfix">
                    <div class="name">客服电话</div>
                    <div class="content">
                        <el-input placeholder="客服电话" type="text" v-model="kf.mobile"></el-input>
                    </div>
                </div>
                <div class="items clearfix">
                    <div class="name">客服微信</div>
                    <div class="content">
                        <el-input placeholder="客服微信" type="text" v-model="kf.wechat"></el-input>
                    </div>
                </div>
                <el-button @click="submit" size="mini" type="primary">保存客服信息</el-button>
            </div>

            <div class="group">
                <div class="title">banner背景图</div>
                <div class="items">
                    <img v-if="banner" :src="banner" />
                    <el-button @click="goUpload" size="mini">上传图片</el-button>
                </div>
                <div style="margin-top: 10px;">
                    <el-button @click="submitBanner" size="mini" type="primary">保存banner</el-button>
                </div>
            </div>
            <div class="group">
                <div class="title">左侧导航栏色值</div>
                <div class="items">
                    <div class="color_items">
                        <span class="demonstration">背景色值：</span>
                        <el-color-picker v-model="color.background"></el-color-picker>
                    </div>
                    <div class="color_items">
                        <span class="demonstration">文字色值：</span>
                        <el-color-picker v-model="color.font"></el-color-picker>
                    </div>
                    <div class="color_items">
                        <span class="demonstration">tab焦点背景色值：</span>
                        <el-color-picker v-model="color.active_background"></el-color-picker>
                    </div>
                    <div class="color_items">
                        <span class="demonstration">tab焦点文字色值：</span>
                        <el-color-picker v-model="color.active_font"></el-color-picker>
                    </div>
                </div>
                <div style="margin-top: 10px;">
                    <el-button @click="submitColor" size="mini" type="primary">保存色值</el-button>
                </div>
            </div>

        </div>
    </modal>
</template>

<script>
    import * as api from './api';
    import Modal from '@/modules/widget/common/Modal.vue';
    import Upload from '@/modules/widget/upload'
    export default{
        components:{
            Modal
        },
        data(){
            return {
                height:200,
                kf:{
                    qq:"",
                    mobile:"",
                    wechat:""
                },
                banner:"",
                color:{
                    background:"#f4f4f4",
                    font:"#333333",
                    active_background:"#ffffff",
                    active_font:"#333333"
                }
            }
        },
        computed:{
            
        },
        methods:{
            destroy(){
                this.$el &&
                this.$el.parentNode &&
                this.$el.parentNode.removeChild(this.$el);
                this.$destroy();
            },
            submit(){
                if(!this.kf.qq){
                    this.$message.error('请填写客服QQ');
                    return false;
                }
                if(!this.kf.mobile){
                    this.$message.error('请填写客服电话');
                    return false;
                }
                if(!this.kf.wechat){
                    this.$message.error('请填写客服微信');
                    return false;
                }
       


                api.changeKfInfo({key:"kf",value:JSON.stringify(this.kf)},() => {
                    this.$message({
                      message: '保存成功',
                      type: 'success'
                    });
                    this.destroy();
                })

                
            },
            submitBanner(){
                if(this.banner){
                    api.changeKfInfo({key:"banner",value:this.banner},() => {
                        this.$message({
                          message: '保存成功',
                          type: 'success'
                        });
                        this.destroy();
                    })
                }
            },
            submitColor(){
                if(this.color){
                    api.changeKfInfo({key:"color",value:JSON.stringify(this.color)},() => {
                        this.$message({
                          message: '保存成功',
                          type: 'success'
                        });
                        this.destroy();
                    })
                }
            },
            getKfInfo(){
                api.getKfInfo({key:'kf'},(resp) => {
                    if(resp.value){
                        this.kf = JSON.parse(resp.value);
                    }
                })
            },
            getBannerInfo(){
                api.getKfInfo({key:'banner'},(resp) => {
                    console.log(resp.value)
                    if(resp.value){
                        this.banner = resp.value;
                    }
                })
            },
            getColorInfo(){
                api.getKfInfo({key:'color'},(resp) => {
                    console.log(resp.value)
                    if(resp.value){
                        this.color = JSON.parse(resp.value);
                    }
                })
            },
            setHeight(){
                var pageHeight = document.body.clientHeight;
                var height = pageHeight - 150 - 40;
                this.height = height;
            },
            goUpload(){
                Upload({
                    callback:(list) => {
                        console.log(list);
                        if(list && list.length > 0){
                            this.banner = list[0].url
                        }
                    }
                })
            }

        },
        mounted(){
            this.setHeight();
            this.getBannerInfo();
            this.getKfInfo();
            this.getColorInfo();
            
        }
    }
</script>
<style rel="stylesheet/less" lang="less" scoped>
    @import "~@/config/config.less";
    .change_password{
        width: 450px;
        overflow: auto;
        .group{
            .title{
                font-size: 16px;
                background: #f4f4f4;
                padding: 4px 0 4px 10px;
                margin-top: 6px;

            }
        }
        .items{
            margin: 10px 60px 20px 0;
            padding-left: 20px;
            .color_items{
                height: 40px;
                line-height: 40px;
                >span{
                    float: left;
                }
            }
            .name{
                width: 80px;
                height: 30px;
                line-height: 30px;
                float: left;
            }
            img{
                height: 48px;
                width: 100%;
            }
            .content{
                margin-left: 80px;
                .info{
                    margin-top: 2px;
                    font-size: 12px;
                    color: @FONT_COLOR_FOUR;
                }
            }
        }

    }
</style>
