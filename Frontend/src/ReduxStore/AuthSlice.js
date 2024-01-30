import { createSlice} from "@reduxjs/toolkit";

const initialState = {
    userstatus: false,
    orgstatus: false,
    adminstatus: false,
    data :null
}

const AuthSlice = createSlice({
    name :"auth",
    initialState,
    reducers:{
        adminlogin:(state,action) =>{
            state.adminstatus = true;
            state.data= action.payload.data
        },
        adminlogout:(state) =>{
            state.adminstatus = false;
            state.data= null
        },
        orglogin:(state,action) =>{
            state.orgstatus = true;
            state.data= action.payload.data
        },
        orglogout:(state) =>{
            state.orgstatus = false;
            state.data= null
        },
        userlogin:(state,action) =>{
            state.userstatus = true;
            state.data= action.payload.data
        },
        userlogout:(state) =>{
            state.userstatus = false;
            state.data= null
        }
    }
})

export const {adminlogin,adminlogout,orglogin,orglogout,userlogin,userlogout} = AuthSlice.actions

export default AuthSlice.reducer