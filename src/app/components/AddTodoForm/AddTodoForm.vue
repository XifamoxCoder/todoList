<script setup lang="ts">
	import { ref, defineEmits } from "vue"

	const newTaskTitle = ref<string>("")
	const isError = ref<boolean>(false)

	const emit = defineEmits<{
		(e: "add-todo", title: string): void
	}>()

	const handleAddTodo = () => {
		if (newTaskTitle.value.trim()) {
			emit("add-todo", newTaskTitle.value)
			newTaskTitle.value = ""
			isError.value = false
		} else {
			isError.value = true
		}
	}
</script>

<template>
	<form :class="$style.addTodo" @submit.prevent="handleAddTodo">
		<input
			v-model="newTaskTitle"
			type="text"
			:class="[isError ? $style.errorInput : '', $style.addTodo__input]"
			placeholder="Task To Be Done..."
		/>
		<button type="submit" :class="$style.addTodo__btn">Add</button>
	</form>
</template>

<style module lang="scss">
	@import "./styles/AddTodoForm.module.scss";
</style>
