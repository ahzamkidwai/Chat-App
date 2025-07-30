import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username: string;
  email: string;
  phoneNumber: string;
  token?: string | undefined;
}

const initialState: UserState = {
  username: "",
  email: "",
  phoneNumber: "",
  token: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<UserState>) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.phoneNumber = action.payload.phoneNumber;
      state.token = action.payload.token;
    },
    setToken: (state, action: PayloadAction<string | undefined>) => {
      state.token = action.payload;
    },
    clearUserDetails: (state) => {
      state.username = "";
      state.email = "";
      state.phoneNumber = "";
      state.token = undefined;
    },
  },
});

export const { setUserDetails, clearUserDetails, setToken } = userSlice.actions;
export default userSlice.reducer;
