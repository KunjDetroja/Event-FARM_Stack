import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./AuthSlice"

const store = configureStore({
    reducer:authReducer
});

export default store