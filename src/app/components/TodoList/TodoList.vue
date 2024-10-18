<script setup lang="ts">
	import TodoItem from "../../components/TodoItem/TodoItem.vue"
	import { defineProps, defineEmits } from "vue"
	import { Todo } from "@/types/todo"

	const { todos } = defineProps<{
		todos: Todo[]
	}>()

	const emit = defineEmits<{
		(e: "toggle-status", id: number, newStatus: boolean): void
		(e: "remove-todo", id: number): void
		(e: "update-todo", id: number, newTitle: string): void
	}>()

	const handleToggleStatus = (id: number, newStatus: boolean) => {
		emit("toggle-status", id, newStatus)
	}

	const handleDeleteTodo = (id: number) => {
		emit("remove-todo", id)
	}

	const handleUpdateTodoTitle = (id: number, newTitle: string) => {
		emit("update-todo", id, newTitle)
	}
</script>

<template>
	<div :class="$style.todoList">
		<TodoItem
			v-for="todo in todos"
			:key="todo.id"
			:title="todo.title"
			:is-completed="todo.isDone"
			:id="todo.id"
			@toggle-status="handleToggleStatus"
			@remove-todo="handleDeleteTodo"
			@update-todo="handleUpdateTodoTitle"
		/>
	</div>
</template>

<style module lang="scss">
	@import "./styles/TodoList.module.scss";
</style>
