<template>
	<div class="bars_wrapper">
		<div class="bars_sidebar">
			<ul class="bars_list">
				<li
					v-for="(poem, index) in poems"
					:key="index"
					class="d-flex"
					@click="setActivePoem(poem)"
					:class="{['active_sidebar_item']:poem.id === activePoem.id}"
				>
					<p
						class="d-block title"
						contenteditable
						v-html="poem.title"
						:ref="poem.id"
						spellcheck="false"
					>
					</p>
					<div>
						<b-button
							size="sm"
							@click.stop="saveTitle"
							variant="success"
						>
							<b-spinner
								small
								v-if="savingTitle && poem.id === activePoem.id"
								type="grow"
							></b-spinner>
							<span
								v-else
								class="material-icons"
							>done</span>
						</b-button>
						<b-button
							size="sm"
							variant="warning"
							@click.stop="removePoem(poem.id)"
						>
							<span class="material-icons">
								delete
							</span>
						</b-button>

					</div>
				</li>
			</ul>
			<div class="sidebar_bottom">
				<b-button
					@click="addPoem"
					variant="success"
					size="sm"
					class="cursor-pointer"
				>
					<span class="material-icons">
						add
					</span>
				</b-button>
			</div>
		</div>
		<div class="bars_content">
			<div class="bars_content_top">
				<b-button
					@click="savePoem"
					variant="success"
					size="sm"
				>
					<b-spinner
						small
						v-if="savingPoem"
						type="grow"
					></b-spinner>
					<span class="material-icons">
						check
					</span>
				</b-button>
				<b-form-input
					v-model="searchText"
					placeholder="Search in all ..."
				></b-form-input>
				<b-button
					variant="success"
					size="sm"
					@click="searchInAll"
				>
					<span class="material-icons cl-c3">
						arrow_forward
					</span>
				</b-button>
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
			savingTitle: null,
			searchText: null
		}
	},
	methods: {
		searchInAll () {
			this.poems.forEach(poem => {
				if (poem.bars.indexOf(this.searchText) > 0) {
					console.log(poem.title);
				}
			})
		},
		savePoem () {
			if (this.$refs.PoemContent.textContent !== this.activePoem.bars) {
				this.savingPoem = true
				const poem = this.$fire.firestore.collection("poems").doc(this.activePoem.id)
				poem.set({
					bars: this.$refs.PoemContent.textContent
				}, { merge: true })
					.then(() => {
						this.savingPoem = false
					});
				// TODO: update local poem
			}
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
[contenteditable] {
	outline: 0px solid transparent;
}
.bars_content_top {
	box-shadow: 0px 0px 8px lightgray;
	padding: 8px;
	display: flex;
}
.bars_content_div {
	column-count: 3;
	padding: 8px;
	white-space: pre-wrap;
	overflow: auto;
	line-height: 1.2;
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
		padding: 4px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		border-radius: 4px;
		&:hover {
			background-color: lightgreen;
		}
	}
}
.bars_sidebar {
	padding: 8px;
	width: 25%;
	height: 100vh;
	box-shadow: 0px 0px 8px lightgray;
	position: relative;
}
.sidebar_bottom {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0px 0px 8px lightgray;
}
</style>
