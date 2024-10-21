<script setup lang="ts">
	import { ref, onMounted } from "vue"
	import {
		createTodo,
		deleteTodo,
		getTodos,
		updateTodo,
		updateTodoStatus,
	} from "@/services/todoService"
	import { Todo, TodoInfo, TodoStatus } from "@/types/todo"
	import AddTodoForm from "@/app/components/AddTodoForm/AddTodoForm.vue"
	import TodoFilters from "@/app/components/TodoFilters/TodoFilters.vue"
	import TodoList from "@/app/components/TodoList/TodoList.vue"

	const todos = ref<Todo[]>([])
	const todoInfo = ref<TodoInfo | null>(null)
	const isLoading = ref(false)
	const error = ref<string | null>(null)

	const currentFilter = ref<TodoStatus>("all")

	const fetchTodos = async (status: TodoStatus = "all"): Promise<void> => {
		isLoading.value = true
		error.value = null
		try {
			const response = await getTodos(status)
			if (response) {
				todos.value = response.data || []
				todoInfo.value = response.info || null
			} else {
				throw new Error("Failed to load todos")
			}
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Unknown error"
		} finally {
			isLoading.value = false
		}
	}

	const handleAddTodo = async (title: string): Promise<void> => {
		isLoading.value = true
		try {
			await createTodo({ title, isDone: false })
			await fetchTodos(currentFilter.value)
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to create todo"
		} finally {
			isLoading.value = false
		}
	}

	const handleToggleTodoStatus = async (
		id: number,
		newStatus: boolean
	): Promise<void> => {
		isLoading.value = true
		try {
			const updatedTodo = await updateTodoStatus(id, newStatus)
			if (updatedTodo) {
				await fetchTodos(currentFilter.value)
			}
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to update todo"
		} finally {
			isLoading.value = false
		}
	}

	const handleDeleteTodo = async (id: number): Promise<void> => {
		isLoading.value = true
		try {
			const success = await deleteTodo(id)
			if (success) {
				todos.value = todos.value.filter(todo => todo.id !== id)
				await fetchTodos(currentFilter.value)
			}
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to delete todo"
		} finally {
			isLoading.value = false
		}
	}

	const handleUpdateTodoTitle = async (
		id: number,
		newTitle: string
	): Promise<void> => {
		try {
			const updatedTodo = await updateTodo(id, { title: newTitle })
			if (updatedTodo) {
				const index = todos.value.findIndex(todo => todo.id === id)
				if (index !== -1) {
					todos.value[index] = {
						...todos.value[index],
						title: updatedTodo.title,
					}
				}
			}
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to update todo"
		}
	}

	const handleFilterChange = async (status: TodoStatus): Promise<void> => {
		currentFilter.value = status
		await fetchTodos(status)
	}

	onMounted(() => {
		fetchTodos(currentFilter.value)
	})
</script>

<template>
	<h1 :class="$style.title">Todo List</h1>

	<AddTodoForm @add-todo="handleAddTodo" />

	<TodoFilters
		:totalTodosCount="todoInfo?.all || 0"
		:inWorkTodosCount="todoInfo?.inWork || 0"
		:completedTodosCount="todoInfo?.completed || 0"
		@filter-change="handleFilterChange"
	/>

	<p v-if="isLoading" :class="$style.loading">Загрузка...</p>

	<TodoList
		v-else
		:todos="todos"
		@toggle-status="handleToggleTodoStatus"
		@remove-todo="handleDeleteTodo"
		@update-todo="handleUpdateTodoTitle"
	/>

	<p v-if="error">{{ error }}</p>
</template>

<style module lang="scss">
	@import "./styles/HomePage.module.scss";
</style>
