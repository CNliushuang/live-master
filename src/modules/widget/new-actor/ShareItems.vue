<template>
	<div class="items stage">
        <div class="name">第{{index+1}}阶梯</div>
        <div class="content">
            <span class="part"><el-input v-model="items.shareRatio" type="number" placeholder=""></el-input>%分成比例</span>
            低于<el-input v-model="items.maxLimit" type="number" placeholder=""></el-input>元
            <span @click="goAddItems" class="el-icon el-icon-circle-plus"></span>
            <span v-if="length > 1" @click="goDeleteItems" class="el-icon el-icon-remove"></span>
        </div>
    </div>
</template>
<script>
	export default{
		props:["items","index","optItems","length"],
		methods:{
			goAddItems(){
				this.$emit('optItems',this.items,this.index,'add');
			},
			goDeleteItems(){
				this.$emit('optItems',this.items,this.index,'delete');
			}
		}
	}
</script>


