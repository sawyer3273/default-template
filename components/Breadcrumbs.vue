<script setup>
import { mdiHomeAccount } from '@mdi/js';
import { useMainStore } from '@/stores/main'
const mainStore = useMainStore()

defineProps({
  mainLink: {
    type: String,
    default: '/'
  }
})

</script>

<template>
<div class="crumbs pt-6 pl-6 -mb-4" v-if='mainStore.breadCrumbs.length'>
  <ul>
	<li><NuxtLink :to='mainLink'><BaseIcon :path='mdiHomeAccount' /></NuxtLink></li>
	<li v-for='link in mainStore.breadCrumbs'><NuxtLink :to='link.to'>{{link.name}}</NuxtLink></li>
	</ul>
</div>


</template>

<style scoped lang='scss'> 


.crumbs {
	h1{
  padding:5px 30px; 
  text-transform:uppercase;
  font-size:.9rem;
  font-weight:600;
  letter-spacing:.01rem;
  color: #8093A7;
}
ul {
		list-style: none;
		display: inline-table;
		li {
			display: inline;
			a {
			display: block;
			float: left;
			height: 40px !important;
			background: #d3d3d387;
        
			text-align: center;
			padding: 5px 10px 0 30px;
			position: relative;
			margin: 0 10px 5px 0 !important;
			
			font-size: 20px;
			text-decoration: none;
			color: #8093A7;
        
			&:after {
				content: "";  
				border-top: 20px solid transparent;
	 			border-bottom: 20px solid transparent;
	  			border-left: 20px solid #d3d3d387;
				position: absolute; 
        right: -20px;
        top: 0;
				z-index: 1;
			}
			&:before {
				content: "";  
				border-top: 20px solid transparent;
	  			border-bottom: 20px solid transparent;
	  			border-left: 20px solid #fff;
				position: absolute; 
        left: 0; 
        top: 0;
			}
		}
		}
    li:first-child {
      padding: 5px 10px 0 10px;
    }
	}
}

.crumbs ul li:first-child a {
  border-top-left-radius: 10px; border-bottom-left-radius: 10px;
}
.crumbs ul li:first-child a:before {
  display: none; 
}

.crumbs ul li:last-child a {
  padding-right: 40px;
  border-top-right-radius: 10px; border-bottom-right-radius: 10px;
}
.crumbs ul li:last-child a:after {
  display: none; 
}

.crumbs ul li a:hover {
    background-image: linear-gradient(to right, #1F1470, #06014B);
color:#fff;
}
.crumbs ul li a:hover:after {
  border-left-color:  #06014B;
    color:#fff;
}
		
		

</style>