import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username: string;
  email: string;
  phoneNumber: string;
}

const initialState: UserState = {
  username: "",
  email: "",
  phoneNumber: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<UserState>) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.phoneNumber = action.payload.phoneNumber;
    },
    clearUserDetails: (state) => {
      state.username = "";
      state.email = "";
      state.phoneNumber = "";
    },
  },
});

export const { setUserDetails, clearUserDetails } = userSlice.actions;
export default userSlice.reducer;
