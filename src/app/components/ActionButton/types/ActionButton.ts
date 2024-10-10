export enum ButtonTypes {
	EDIT = "edit",
	DELETE = "delete",
	SAVE = "save",
	CANCEL = "cancel",
}

export type ButtonType = Extract<ButtonTypes, ButtonTypes>
