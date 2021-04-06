<template>
	<div class="bars_wrapper">

		<div class="bars_sidebar">
			<h1 class="text-center">Poems</h1>
			<ul class="bars_list">
				<li
					v-for="(poem, index) in poems"
					:key="index"
					class="d-flex flex-column"
					:class="{['active_sidebar_item']:poem.id === activePoem.id}"
				>

					<h5
						class="d-block"
						contenteditable
						@click="setActivePoem(poem)"
						v-html="poem.title"
						:ref="poem.id"
						spellcheck="false"
					>

					</h5>
					<div>

						<b-button @click="saveTitle">
							<b-spinner
								small
								v-if="savingTitle && poem.id === activePoem.id"
								type="grow"
							></b-spinner>
							Save title
						</b-button>
						<b-button @click="removePoem(poem.id)">X</b-button>

					</div>
				</li>
			</ul>
			<b-button @click="addPoem">Add poem</b-button>
		</div>
		<div class="bars_content">
			<div class="bars_content_top">

			</div>
			<div
				contenteditable
				class="bars_content_div"
				spellcheck="false"
				@keydown.ctrl.83.prevent="savePoem()"
				ref="PoemContent"
				v-html="activePoem.bars"
			>
			</div>
			<div class="bars_poem_actions">
				<b-button @click="savePoem">
					<b-spinner
						small
						v-if="savingPoem"
						type="grow"
					></b-spinner>
					Save poem
				</b-button>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
	layout: "default",
	data () {
		return {
			poems: [],
			newPoem: {
				title: "Title",
				bars: "bars"
			},
			activePoem: "",
			savingPoem: null,
			savingTitle: null
		}
	},
	methods: {
		savePoem () {
			this.savingPoem = true
			const poem = this.$fire.firestore.collection("poems").doc(this.activePoem.id)
			var setWithMerge = poem.set({
				bars: this.$refs.PoemContent.textContent
			}, { merge: true })
				.then(response => {
					this.savingPoem = false
				});
		},
		saveTitle () {
			if (this.activePoem) {
				const poem = this.$fire.firestore.collection("poems").doc(this.activePoem.id)
				const newTitle = this.$refs[this.activePoem.id][0].textContent
				if (newTitle && newTitle !== this.activePoem.title) {
					this.savingTitle = true
					var setWithMerge = poem.set({
						title: newTitle
					}, { merge: true })
						.then(response => {
							this.savingTitle = false
						});
				}
			}
		},
		removePoem (id) {
			this.$fire.firestore.collection("poems").doc(id).delete()
				.then(() => {
					console.log("Document successfully deleted!");
				})
				.catch((error) => {
					console.error("Error removing document: ", error);
				})
				.finally(() => {
					this.getPoems()
				});
		},
		setActivePoem (poem) {
			this.activePoem = poem
		},
		addPoem () {
			this.$fire.firestore.collection("poems").add(this.newPoem)
				.then((docRef) => {
					console.log("Document written with ID: ", docRef.id);
				})
				.catch((error) => {
					console.error("Error adding document: ", error);
				})
				.finally(() => {
					this.getPoems()
				})
		},
		getPoems () {
			this.$fire.firestore.collection("poems").get().then((querySnapshot) => {
				const poems = []
				querySnapshot.forEach((doc) => {
					poems.push({
						id: doc.id,
						...doc.data()
					})
				});
				this.poems = poems
				this.activePoem = poems[0]
			});
		}
	},
	mounted () {
		this.getPoems()
	}
});
</script>

<style lang="scss">
.bars_content_div {
	column-count: 3;
	padding: 8px;
	white-space: pre-wrap;
	overflow: auto;
	height: 100%;
}
.bars_content {
	display: flex;
	flex-direction: column;
	width: 75%;
	height: 100vh;
	justify-content: space-between;
}
.bars_poem_textarea {
	width: 100%;
	height: 100% !important;
}
.bars_poem_actions {
	width: 100%;
	display: block;
	padding: 8px;
	background-color: silver;
}
.bars_wrapper {
	display: flex;
}
.bars_list {
	.active_sidebar_item {
		background-color: lightgreen;
	}
	list-style-type: none;
	li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;

		cursor: pointer;
		transition: all 0.2s ease-in-out;
		border-radius: 4px;
		h5 {
			width: 100%;
			padding: 4px;
		}
		&:hover {
			background-color: lightgreen;
		}
	}
}
.bars_sidebar {
	padding: 8px;
	width: 25%;
	height: 100vh;
	background-color: gray;
}
</style>
