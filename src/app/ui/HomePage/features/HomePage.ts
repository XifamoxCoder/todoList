import { Todo, TodoStatus } from "@/types/todo"

export const filterTodos = (array: Todo[], status: TodoStatus = "all") => {
	if (!Array.isArray(array)) {
		throw new Error("Expected an array of todos")
	}

	if (status !== "all" && status !== "completed" && status !== "inWork") {
		throw new Error("Invalid status value")
	}

	if (status === "all") {
		return array
	}

	if (status === "completed") {
		return array.filter(item => item.isDone)
	}

	if (status === "inWork") {
		return array.filter(item => !item.isDone)
	}
}
