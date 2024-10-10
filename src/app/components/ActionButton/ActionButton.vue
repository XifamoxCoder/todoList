<script setup lang="ts">
	import { computed } from "vue"
	import styles from "./styles/ActionButton.module.scss"
	import { ButtonType, ButtonTypes } from "./types/ActionButton"

	const props = defineProps({
		type: {
			type: String as () => ButtonType,
			required: true,
			validator: (value: string) =>
				["edit", "delete", "save", "cancel"].includes(value),
		},
	})

	const emit = defineEmits(["edit", "delete", "save", "cancel"])

	const buttonConfig = computed(
		() =>
			({
				edit: {
					class: styles.editButton,
					icon: "edit.svg",
					event: ButtonTypes.EDIT,
					alt: "Edit Button",
				},
				delete: {
					class: styles.deleteButton,
					icon: "delete.svg",
					event: ButtonTypes.DELETE,
					alt: "Delete Button",
				},
				save: {
					class: styles.saveButton,
					icon: "save.svg",
					event: ButtonTypes.SAVE,
					alt: "Save Button",
				},
				cancel: {
					class: styles.cancelButton,
					icon: "cancel.svg",
					event: ButtonTypes.CANCEL,
					alt: "Cancel Button",
				},
			}[props.type])
	)

	const emitAction = () => {
		emit(buttonConfig.value.event)
	}
</script>

<template>
	<button :class="buttonConfig.class" @click="emitAction">
		<img :src="buttonConfig.icon" :alt="buttonConfig.alt" />
	</button>
</template>

<style module lang="scss">
	@import "./styles/ActionButton.module.scss";
</style>
