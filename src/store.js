import { configureStore } from '@reduxjs/toolkit'
import tokenReducer from './Redux/TokenSlice'


export const store = configureStore({
  reducer: {
    token: tokenReducer,
  },
})