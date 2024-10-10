<script setup lang="ts">
	import TodoItem from "../../components/TodoItem/TodoItem.vue"
	import { computed, onMounted, ref } from "vue"
	import { filterTodos } from "./features/HomePage"
	import { useTodos } from "../../../composables/useTodos"

	const {
		todos,
		fetchTodos,
		addTodo,
		toggleTodoStatus,
		removeTodo,
		updateTodoTitle,
		isLoading,
	} = useTodos()

	onMounted(async () => {
		await fetchTodos("all")
	})

	const newTaskTitle = ref<string>("")
	const isError = ref<boolean>(false)

	const currentFilter = ref<"all" | "completed" | "inWork">("all")

	const filteredTodos = computed(() => {
		return filterTodos(todos.value, currentFilter.value)
	})

	const handleAddTodo = async () => {
		if (newTaskTitle.value.length == 0) {
			isError.value = true
		} else {
			if (newTaskTitle.value.trim()) {
				isError.value = false
				await addTodo({ title: newTaskTitle.value, isDone: false })
				newTaskTitle.value = ""
			}
		}
	}

	const allTodos = computed(() => {
		return todos.value.length
	})

	const completedTodos = computed(() => {
		return todos.value.filter(task => task.isDone).length
	})

	const inWorkTodos = computed(() => {
		return todos.value.filter(todo => !todo.isDone).length
	})
	const handleToggleTodoStatus = async (id: number, newStatus: boolean) => {
		await toggleTodoStatus(id, newStatus)
	}
	const handleDeleteTodo = async (id: number) => {
		await removeTodo(id)
	}
	const handleUpdateTodoTitle = async (id: number, newTitle: string) => {
		await updateTodoTitle(id, newTitle)
	}
</script>

<template>
	<h1 :class="$style.title">Todo List</h1>
	<form :class="$style.addTodo" @submit.prevent>
		<input
			v-model="newTaskTitle"
			type="text"
			:class="[isError ? $style.errorInput : '', $style.addTodo__input]"
			placeholder="Task To Be Done..."
		/>
		<button :class="$style.addTodo__btn" @click="handleAddTodo">Add</button>
	</form>

	<div :class="$style.todoList">
		<div :class="$style.todoList__nav">
			<a @click="currentFilter = 'all'">Все ({{ allTodos }})</a>
			<a @click="currentFilter = 'inWork'">в работе ({{ inWorkTodos }})</a>
			<a @click="currentFilter = 'completed'">сделано ({{ completedTodos }})</a>
		</div>
		<template v-if="isLoading">
			<p>Загрузка</p>
		</template>
		<template v-else>
			<TodoItem
				v-for="todo in filteredTodos"
				:key="todo.id"
				:title="todo.title"
				:is-completed="todo.isDone"
				:id="todo.id"
				@toggle-status="handleToggleTodoStatus"
				@remove-todo="handleDeleteTodo"
				@update-todo="handleUpdateTodoTitle"
			/>
		</template>
	</div>
</template>

<style module lang="scss">
	@import "./styles/HomePage.module.scss";
</style>
