<script setup lang="ts">
	import { nextTick, ref, watch } from "vue"
	import ActionButton from "../ActionButton/ActionButton.vue"
	import { ButtonTypes } from "../ActionButton/types/ActionButton"

	interface TodoProps {
		id: number
		title: string
		isCompleted: boolean
	}

	const props = defineProps<TodoProps>()

	const emit = defineEmits<{
		(e: "toggle-status", id: number, status: boolean): void
		(e: "remove-todo", id: number): void
		(e: "update-todo", id: number, title: string): void
	}>()

	const isEditing = ref(false)
	const currentTitle = ref(props.title)
	const completed = ref(props.isCompleted)
	const isError = ref(false)

	const originalTitle = ref(props.title)
	const input = ref<HTMLInputElement>()

	const validateAndSaveEdit = () => {
		if (currentTitle.value.trim() === "") {
			isError.value = true
			return
		}

		isError.value = false
		isEditing.value = false

		if (currentTitle.value !== originalTitle.value) {
			emit("update-todo", props.id, currentTitle.value)
		}
	}

	const startEditing = async () => {
		isEditing.value = true
		originalTitle.value = currentTitle.value
		await nextTick(() => input.value?.focus())
	}

	const cancelEdit = () => {
		isEditing.value = false
		currentTitle.value = originalTitle.value
		isError.value = false
	}

	const handleKeyUp = (event: KeyboardEvent) => {
		if (event.key === "Enter") {
			validateAndSaveEdit()
		}
	}

	watch(completed, newVal => {
		emit("toggle-status", props.id, newVal)
	})
</script>

<template>
	<div :class="$style.todoItem">
		<div :class="$style.todoItem__checkboxLabel">
			<input
				type="checkbox"
				v-model="completed"
				:disabled="isEditing"
				:class="$style.todoItem__checkbox"
			/>
			<template v-if="isEditing">
				<input
					ref="input"
					v-model="currentTitle"
					@keyup="handleKeyUp"
					:class="[isError ? $style.errorInput : '', $style.todoItem__input]"
				/>
			</template>
			<template v-else>
				<span
					:title="currentTitle"
					:class="[$style.todoItem__title, { [$style.completed]: completed }]"
					>{{ currentTitle }}</span
				>
			</template>
		</div>
		<div :class="$style.todoItem__action">
			<template v-if="isEditing">
				<ActionButton :type="ButtonTypes.SAVE" @save="validateAndSaveEdit" />
				<ActionButton :type="ButtonTypes.CANCEL" @cancel="cancelEdit" />
			</template>
			<template v-else>
				<ActionButton :type="ButtonTypes.EDIT" @edit="startEditing" />
				<ActionButton
					:type="ButtonTypes.DELETE"
					@delete="emit('remove-todo', props.id)"
				/>
			</template>
		</div>
	</div>
</template>

<style module lang="scss">
	@import "./styles/TodoItem.module.scss";
</style>
