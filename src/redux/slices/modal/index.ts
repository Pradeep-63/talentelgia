import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  modalType: "add" | "edit" | "view" | "delete" | "changePassword" | null;
  selectedUser: any;
}

const initialState: ModalState = {
  isOpen: false,
  modalType: null,
  selectedUser: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ type: ModalState["modalType"]; user?: any }>
    ) => {
      state.isOpen = true;
      state.modalType = action.payload.type;
      state.selectedUser = action.payload.user || null;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.modalType = null;
      state.selectedUser = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
