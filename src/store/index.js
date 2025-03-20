import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {
            top: { 52: {name: 'hallow'} }, new: { }, best: { }, show: { }, ask: { }, job: { },
        };
    },
    mutations: {
       setTop(state, { id, payload }) {
            state.top[id] = payload;
       },
       setNew(state, { id, payload }) {
            state.new[id] = payload;
       },
       setBest(state, { id, payload }) {
            state.best[id] = payload;
       },
       setShow(state, { id, payload }) {
            state.show[id] = payload;
       },
       setAsk(state, { id, payload }) {
            state.ask[id] = payload;
       },
       setJob(state, { id, payload }) {
            state.job[id] = payload;
       },
       
    },
    actions: {
    
    },
    getters: {
        getTop: (state) => (id) => {
            return state.top[id];
        },
        getNew: (state) => (id) => {
            return state.new[id];
        },
        getBest: (state) => (id) => {
            return state.best[id];
        },
        getShow: (state) => (id) => {
            return state.show[id];
        },
        getAsk: (state) => (id) => {
            return state.ask[id];
        },
        getJob: (state) => (id) => {
            return state.job[id];
        },
    },
});

export default store;
