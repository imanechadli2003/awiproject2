import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface InitialStateTypes{
    isSidebarCollapsed:boolean;
    isDarkMode:boolean;
}
const initialState:InitialStateTypes={
    isSidebarCollapsed:false,
    isDarkMode:false,
}
export const globalSlice=createSlice({
    name:'global',
    initialState,
    reducers:{
        setIsSidebarCollapsed:(state,action:PayloadAction<boolean>)=>{
            state.isSidebarCollapsed=action.payload;
        },
        setIsDarkMode:(state,action:PayloadAction<boolean>)=>{
            state.isDarkMode=action.payload;
        
    },
},
});
export const {setIsSidebarCollapsed,setIsDarkMode}=globalSlice.actions;
export default globalSlice.reducer;

/*Ce code définit un slice de Redux pour
 gérer l'état d'une application, 
 en particulier pour savoir si la barre latérale est réduite
  et si le mode sombre est activé. 
  Il utilise les fonctionnalités de Redux Toolkit 
  pour simplifier la gestion de l'état 
et rendre le code plus propre et plus maintenable.*/