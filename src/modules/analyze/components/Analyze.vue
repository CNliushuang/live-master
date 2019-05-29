<template>
	<div ref="container" class="actor_assign">
		<div ref="filter" class="filter clearfix">
			<div class="filter_items">
				<div class="name">
					平台名称：
				</div>
				<div class="content">
					<el-select :disabled="user.platId?true:false" :clearable="true" v-model="filter.platId" @change="changePlat" placeholder="请选择平台">
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
			<div class="filter_items">
				<div class="name">
					公会名称：
				</div>
        <div class="content" @click="goSelectUnion" style="cursor: pointer">
					<!--<el-select :clearable="true" v-model="filter.unionId" @change="changeUnion" placeholder="请选择公会" filterable :filter-method="filterUnion">-->
					    <!--<el-option-->
							<!--v-for="item in unionList"-->
							<!--:key="item.uuid"-->
							<!--:label="item.name"-->
							<!--:value="item.uuid"-->
							<!--&gt;-->
					    <!--</el-option>-->
					<!--</el-select>-->
          <el-input :value="filter.unionName" readonly="" placeholder="请选择公会" ></el-input>
          <i v-if="filter.unionName" class="el-icon-error" @click.stop="clearSelectUnion"></i>
				</div>
			</div>
			<div class="filter_items">
				<div class="name">
					日期：
				</div>
				<div class="content">
					<el-date-picker
				      v-model="filter.date"
				      type="daterange"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期">
				    </el-date-picker>
				</div>
			</div>

			<div class="opt_btn">
				<el-button @click="goFilter" type="primary">查询</el-button>
				<el-button @click="resetFilter">重置</el-button>
			</div>
		</div>
		<div class="charts" ref="charts">
			<div id="analyze_charts"></div>
		</div>

		<div class="filter_list">
			<el-table
			    ref="multipleTable"
			    :data="analyzeList"
			    :height="tableHeight"
			    stripe
			    tooltip-effect="dark"
			    style="width: 100%"
			    @selection-change="handleSelectionChange">
			    <el-table-column
			      label="日期"
			      width="122">
			      <template slot-scope="scope">{{ scope.row.day | timesToDate('yyyy-MM-dd') }}</template>
			    </el-table-column>
			    <el-table-column
			      prop="thirdFlow"
			      label="流水金额（元）"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="income"
			      label="入账金额（元）"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="cashMoney"
			      label="提现金额（元）"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="showUserNum"
			      label="开播人数"
			      show-overflow-tooltip>
			    </el-table-column>
			    <el-table-column
			      prop="showHourAvg"
			      label="平均直播时长"
			      show-overflow-tooltip>
			    </el-table-column>
			</el-table>
		</div>
		<div ref="page" class="page">
			<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="currentPage"
		      :page-sizes="[10,20, 30, 40, 50]"
		      :page-size="limit"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="total">
		    </el-pagination>
		</div>
	
	</div>
</template>
<script>
	import {mapGetters,mapActions} from 'vuex';
	import AssignActor from '@/modules/widget/assign-actor'
	import {timesToDate} from '@/config/utils'
  import selectUnion from '@/modules/widget/select-union-v2'

	export default{
		data(){
			return {
				statusList:[{
					name:"已启用",
					uuid:0
				},{
					name:"已停用",
					uuid:1
				}],
				multipleSelection:[],
				tableHeight:250,

				agentList:[],
				platList:[],
				unionList:[],
				analyzeList:[],
				total:0,
				currentPage:1,
				limit:10,
				filter:{
					orgId:"",
					platId:"",
					unionId:"",
          unionName:"",
					date:"",
				},
        parentId:"",
			}
		},
		computed: {
			...mapGetters({
				user: 'userStore/user/user',
			})
	    },

	    methods:{
		    resetFilter(){
		    	this.filter = {
					orgId:"",
					platId:"",
					unionId:"",
            unionName:"",
					date:"",
				}
				this.setDefaultOrg();
				this.getAnalyzeList(1);
		    },
	    	goFilter(){
	    		// console.log(this.filter)
	    		this.getAnalyzeList();
	    	},
	    	handleSelectionChange(val) {
		        this.multipleSelection = val;
		    },
		    setHeight(){
		    	var container = this.$refs.container.offsetHeight;
		    	var filter = this.$refs.filter.offsetHeight;
		    	var charts = this.$refs.charts && this.$refs.charts.offsetHeight || 0;
		    	var page = this.$refs.page.offsetHeight;
		    	var tableHeight = container - filter - charts -page -24;
		    	console.log(tableHeight);
		    	if(tableHeight < 200){
		    		tableHeight = 200;
		    	}
		    	this.tableHeight = tableHeight;
		    },
		    handleSizeChange(limit){
				this.limit = limit;
				this.getAnalyzeList(1,limit);
			},
			handleCurrentChange(page){
				this.getAnalyzeList(page);
			},
		    getAnalyzeList(currentPage,limit){
		    	currentPage = currentPage || this.currentPage;
		    	limit = limit || this.limit;
		    	let filter = this.filter;
		    	this.$store.dispatch('analyzeStore/analyze/getAnalyzeList',{currentPage,limit,filter}).then((resp) => {
		    		this.currentPage = currentPage;
					this.limit = limit;
				    this.analyzeList = resp.list;
				    this.total = resp.count;
				    this.showCharts(resp.list);
		    	})
		    },
		    showCharts(list){
		    	var myChart = echarts.init(document.getElementById('analyze_charts'));
		    	var types = [],date=[],data=[],maps={};
		    	var t_types = [{
		    		name:"流水金额",
		    		key:"thirdFlow"
		    	},{
		    		name:"入账金额",
		    		key:"income"
		    	},{
		    		name:"提现金额",
		    		key:"cashMoney"
		    	},{
		    		name:"开播人数",
		    		key:"showUserNum"
		    	},{
		    		name:"平均直播时长",
		    		key:"showHourAvg"
		    	}]
		    	for(var type of t_types){
	    			types.push(type.name);

	    			var t_data = {
		    			name:type.name,
			            type:'line',
			            stack: '总量',
			            data:[]
		    		}
		    		maps[type.key] = t_data;
		    		data.push(t_data)
	    		}

		    	for(var items of list){
		    		var t_day = timesToDate(items.day,'yyyy-MM-dd');
		    		date.push(t_day);
		    		maps['thirdFlow'].data.push(items.thirdFlow)
		    		maps['income'].data.push(items.income)
		    		maps['cashMoney'].data.push(items.cashMoney)
		    		maps['showUserNum'].data.push(items.showUserNum)
		    		maps['showHourAvg'].data.push(items.showHourAvg)
		    	}

		    	var option = option = {
				    title: {
				        text: ''
				    },
				    tooltip: {
				        trigger: 'axis'
				    },
				    legend: {
				        data:types
				    },
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    toolbox: {
				        feature: {
				            saveAsImage: {}
				        }
				    },
				    xAxis: {
				        type: 'category',
				        boundaryGap: false,
				        data: date
				    },
				    yAxis: {
				        type: 'value'
				    },
				    series: data
				};
		        myChart.setOption(option);
		    },
		    changePlat(uuid){
		    	if(uuid){
		    		this.filter.orgId = uuid;
		    	}else{
		    		this.filter.orgId = "";
		    	}
		    	this.filter.unionId = "";
		    	// this.getUnionList(uuid);
          this.parentId = uuid;
		    },
		    changeUnion(uuid){
		    	if(uuid){
		    		this.filter.orgId = uuid;
		    	}else{
		    		if(this.filter.platId){
		    			this.filter.orgId = this.filter.platId;
		    		}
		    	}
		    },
		    getPlatList(){
		    	const orgId = this.user.orgId;
		    	this.$store.dispatch('platStore/platform/getPlatFormList',{orgId,currentPage:1,limit:50}).then((resp) => {
		    		this.platList = resp.list;
				})
		    },
		    filterUnion(key){
		    	this.filter.unionId = '';
		    	this.filter.orgId = '';
		    	let orgId = this.user.orgId;
		    	let parentId = this.user.orgId;
			    this.$store.dispatch('groupStore/group/getGroupList',{orgId,parentId,currentPage:1,limit:50,searchKey:key}).then((resp) => {
			    		this.unionList = resp.list;
					})
		    },
		    getUnionList(parentId){
		    	let orgId = this.user.orgId;
		    	parentId = parentId ||  this.user.orgId;
		    	
		    	this.$store.dispatch('groupStore/group/getGroupList',{orgId,parentId,currentPage:1,limit:50}).then((resp) => {
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
                this.filter.unionId = list[0].uuid;
                this.filter.unionName = list[0].name;
              }else{
                this.filter.unionId = '';
                this.filter.unionName = '';
              }
            }
          })
        },
        clearSelectUnion(){
          this.filter.unionId = '';
          this.filter.unionName = '';
        },
	    	setDefaultOrg(){
		    	if(this.user){
		    		this.filter.platId = this.user.platId;
		    		this.filter.unionId = this.user.unionId;
		    		if(!this.user.unionId && this.user.managerOrgs && this.user.managerOrgs.length > 0){
		    			this.filter.unionId = this.user.managerOrgs[0].uuid;
		    		}
		    	}
		    }
	    },
	    watch:{
	    	user(){
	    		this.setDefaultOrg();
	    	}
	    },
	    mounted(){
	    	setTimeout(() => {
	    		this.setHeight();
	    		this.setDefaultOrg();
	    		this.getAnalyzeList();
	    	})
	    },
	    created(){
	    	this.getPlatList();
	    	this.getUnionList();
	    },
	}
</script>
<style rel="stylesheet/less" lang="less" scoped>
  	@import "~@/config/config.less";
  	.actor_assign{
  		padding-left: 20px;
  		position: absolute;
  		left: 0;
  		top: 0;
  		right: 0;
  		bottom: 0;
  		overflow: auto;
  		.filter{
  			.filter_items{
  				float: left;
  				margin-right: 20px;
  				margin-bottom: 10px;
  				.name{
  					min-width: 60px;
  					height: 30px;
  					line-height: 30px;
  					float: left;
  				}
  				.content{
  					float: left;
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
  					/deep/ .el-select{
			  			width: 150px;
			  		}
			  		/deep/ .el-input{
			  			width: 150px;
			  		}
  				}
  			}
  			.opt_btn{
  				float: left;
  			}
  		}
  		.operate{
  			padding: 10px 0;
  			/deep/ .el-button{
  				float: left;
  				margin-right: 10px;
  			}
  		}

  		.charts{
  			width:100%;
  			height:300px;
  			#analyze_charts{
  				width:100%;
  				height:300px;
  			}
  		}

  		.page{
  			padding: 10px 0;
  		}

  		.img_box{
  			img{
  				width:20px;
  				height:20px;
  				cursor:pointer;
  				margin-right:6px;
  				margin-top:10px;
  			}
  		}

  	}
</style>
