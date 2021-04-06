<template>
	<div class="sidebar">
		<h1 class="text-center">Poems</h1>
		<ul>
			<li
				v-for="(poem, index) in poems"
				:key="index"
				@click="setActivePoem(poem.id)"
			>
				{{poem.title}}
			</li>
		</ul>
		<b-button @click="addPoem">Add poem</b-button>
	</div>
</template>
<script>
export default {
	name: "Sidebar",
	data () {
		return {
			poems: [],
			newPoem: {
				title: "Title",
				content: "Content"
			}
		}
	},
	methods: {
		setActivePoem (id) {
			console.log(id);
		},
		addPoem () {
			this.$fire.firestore.collection("poems").add(this.newPoem)
				.then((docRef) => {
					console.log("Document written with ID: ", docRef.id);
				})
				.catch((error) => {
					console.error("Error adding document: ", error);
				});
		}
	},
	mounted () {
		this.$fire.firestore.collection("poems").get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				this.poems.push({
					id: doc.id,
					...doc.data()
				})
			});
		});
	}
}
</script>
<style lang="scss">
.bars_sidebar {
	width: 25%;
	height: 100vh;
	background-color: gray;
}
</style>