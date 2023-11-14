import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "incidentObjectSlice",
    initialState: {
        value: ""
    },

    reducers: {
        SHOW_INCIDENT_ID_SLICE: (state) => {
            state.value = state.value
        },
        
    },
});

export const { SHOW_INCIDENT_ID_SLICE } = slice.actions;
export default slice.reducer;
