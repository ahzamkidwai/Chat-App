import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username: string;
  email: string;
  phoneNumber: string;
  token?: string | undefined;
  userId?: string;
  reloadKey?: boolean;
}

const initialState: UserState = {
  username: "",
  email: "",
  phoneNumber: "",
  token: undefined,
  userId: "",
  reloadKey: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<UserState>) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.phoneNumber = action.payload.phoneNumber;
      state.userId = action.payload.userId;
    },
    setToken: (state, action: PayloadAction<string | undefined>) => {
      state.token = action.payload;
    },
    setReload: (state) => {
      state.reloadKey = !state.reloadKey;
    },
    clearUserDetails: (state) => {
      state.username = "";
      state.email = "";
      state.phoneNumber = "";
      state.token = undefined;
    },
  },
});

export const { setUserDetails, clearUserDetails, setToken, setReload } =
  userSlice.actions;
export default userSlice.reducer;
