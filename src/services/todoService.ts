import appConfig from "../app/config/app.config"
import {
	MetaResponse,
	Todo,
	TodoInfo,
	TodoRequest,
	TodoStatus,
} from "../types/todo"

const BASE_URL = appConfig.apiBaseUrl

export const getTodos = async (
	status: TodoStatus = "all"
): Promise<MetaResponse<Todo, TodoInfo> | null> => {
	try {
		const response = await fetch(`${BASE_URL}?filter=${status}`)

		if (!response.ok) {
			throw new Error(`Failed to fetch todos: ${response.statusText}`)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error(error)
		return null
	}
}

export const createTodo = async (
	newTodo: TodoRequest
): Promise<Todo | null> => {
	try {
		const response = await fetch(BASE_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newTodo),
		})

		if (!response.ok) {
			throw new Error(`Failed to create todo: ${response.statusText}`)
		}

		const data: Todo = await response.json()
		return data
	} catch (error) {
		console.error(error)
		return null
	}
}

export const updateTodoStatus = async (
	id: number,
	isDone: boolean
): Promise<Todo | null> => {
	try {
		const response = await fetch(`${BASE_URL}/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ isDone }),
		})

		if (!response.ok) {
			throw new Error(`Failed to update todo: ${response.statusText}`)
		}

		const data: Todo = await response.json()
		return data
	} catch (error) {
		console.error(error)
		return null
	}
}

export const deleteTodo = async (id: number): Promise<boolean> => {
	try {
		const response = await fetch(`${BASE_URL}/${id}`, {
			method: "DELETE",
		})

		if (!response.ok) {
			throw new Error(`Failed to delete todo: ${response.statusText}`)
		}

		return true
	} catch (error) {
		console.error("Error deleting todo:", error)
		return false
	}
}
export const updateTodo = async (
	id: number,
	updatedData: TodoRequest
): Promise<Todo | null> => {
	try {
		const response = await fetch(`${BASE_URL}/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedData),
		})

		if (!response.ok) {
			throw new Error(`Failed to update todo: ${response.statusText}`)
		}

		const updatedTodo: Todo = await response.json()
		return updatedTodo
	} catch (error) {
		console.error(error)
		return null
	}
}
