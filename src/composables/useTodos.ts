import { computed, ref } from "vue"
import {
	createTodo,
	deleteTodo,
	getTodos,
	updateTodo,
	updateTodoStatus,
} from "../services/todoService"
import { Todo, TodoRequest, TodoStatus } from "../types/todo"

export const useTodos = () => {
	const todos = ref<Todo[]>([])
	const isLoading = ref(false)
	const error = ref<string | null>(null)

	const fetchTodos = async (status: TodoStatus = "all") => {
		isLoading.value = true
		error.value = null
		try {
			const response = await getTodos(status)
			if (response) {
				todos.value = response.data || []
			} else {
				throw new Error("Failed to load todos")
			}
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Unknown error"
		} finally {
			isLoading.value = false
		}
	}

	const addTodo = async (newTodo: TodoRequest) => {
		isLoading.value = true
		try {
			const createdTodo = await createTodo(newTodo)
			if (createdTodo) {
				todos.value.push(createdTodo)
			}
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to create todo"
		} finally {
			isLoading.value = false
		}
	}
	const toggleTodoStatus = async (id: number, isDone: boolean) => {
		isLoading.value = true
		try {
			if (!todos.value.length) {
				console.error(
					"The task array is empty, make sure that the data has been uploaded."
				)
				return
			}

			const updatedTodo = await updateTodoStatus(id, isDone)

			if (updatedTodo) {
				const todo = todos.value.find(t => t.id === id)

				if (todo) {
					todo.isDone = isDone
				} else {
					console.error("The task with this ID was not found.")
				}
			} else {
				console.error("Failed to update the task on the server.")
			}
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to update todo"
		} finally {
			isLoading.value = false
		}
	}

	const removeTodo = async (id: number) => {
		isLoading.value = true

		try {
			const success = await deleteTodo(id)
			if (success) {
				todos.value = todos.value.filter(todo => todo.id !== id)
			} else {
				console.error(`The task could not be deleted with ID ${id}.`)
			}
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : "The task could not be deleted"
		} finally {
			isLoading.value = false
		}
	}

	const updateTodoTitle = async (id: number, title: string) => {
		try {
			const updatedTodo = await updateTodo(id, { title })
			if (updatedTodo) {
				const index = todos.value.findIndex(todo => todo.id === id)
				if (index !== -1) {
					todos.value[index] = {
						...todos.value[index],
						title: updatedTodo.title,
					}
				}
			}
		} catch (error) {
			console.error("Failed to update todo", error)
		}
	}

	const sortedTodos = computed(() => {
		return todos.value.sort(
			(a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
		)
	})

	return {
		todos: sortedTodos,
		isLoading,
		removeTodo,
		error,
		fetchTodos,
		addTodo,
		toggleTodoStatus,
		updateTodoTitle,
	}
}
