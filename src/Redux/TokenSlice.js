import { createSlice } from '@reduxjs/toolkit';
// import { useNavigate } from 'react-router-dom';



const initialState = {
  value: "tokengvuyftyfguiouggiuf",
}


export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    getToken: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      const token = localStorage.getItem("office_token");

      if(token){
        state.value = token
      }
    },
    
    setToken: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { getToken, setToken } = tokenSlice.actions

export default tokenSlice.reducer