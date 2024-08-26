import { createStore } from 'vuex';

const store = createStore({
    state: {
        patientId: null,
    },
    mutations: {
        setPatientId(state, id) {
            state.patientId = id;
            // Optionally save to localStorage here
        },
    },
    actions: {
        // Optional actions
    },
    modules: {
        // Optional modules
    },
});

export default store;
