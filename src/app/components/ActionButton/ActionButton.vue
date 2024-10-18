<script setup lang="ts">
	import { computed } from "vue"
	import styles from "./styles/ActionButton.module.scss"

	const props = defineProps({
		type: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			default: null,
		},
		label: {
			type: String,
			default: null,
		},
	})

	const emit = defineEmits(["click"])

	const buttonClass = computed(() => [
		styles.button,
		styles[`${props.type}Button`],
	])

	const handleClick = (event: Event) => {
		emit("click", event)
	}
</script>

<template>
	<button :class="buttonClass" @click="handleClick">
		<img v-if="props.icon" :src="props.icon" alt="button icon" />

		<span v-if="props.label" :class="$style.tooltip">{{ props.label }}</span>
	</button>
</template>

<style module lang="scss">
	@import "./styles/ActionButton.module.scss";
</style>
