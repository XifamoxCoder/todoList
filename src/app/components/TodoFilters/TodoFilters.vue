<script setup lang="ts">
	import { defineProps, defineEmits } from "vue"

	const { totalTodosCount, inWorkTodosCount, completedTodosCount } =
		defineProps<{
			totalTodosCount: number
			inWorkTodosCount: number
			completedTodosCount: number
		}>()

	const emit = defineEmits<{
		(e: "filter-change", status: "all" | "inWork" | "completed"): void
	}>()

	const handleFilterChange = (status: "all" | "inWork" | "completed") => {
		emit("filter-change", status)
	}
</script>

<template>
	<div :class="$style.todoList__nav">
		<a @click="handleFilterChange('all')">Все ({{ totalTodosCount }})</a>
		<a @click="handleFilterChange('inWork')"
			>в работе ({{ inWorkTodosCount }})</a
		>
		<a @click="handleFilterChange('completed')"
			>сделано ({{ completedTodosCount }})</a
		>
	</div>
</template>

<style module lang="scss">
	@import "./styles/TodoFilters.module.scss";
</style>
