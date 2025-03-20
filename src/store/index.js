import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
    state() {
        return {
            top: { }, new: { }, best: { }, show: { }, ask: { }, job: { },
            topstoriesIDs: [], newstoriesIDs: [], beststoriesIDs: [], showstoriesIDs: [], askstoriesIDs: [], jobstoriesIDs: [],
            comments: { },
        };
    },
    mutations: {        
        setTop(state, { id, payload }) {
            state.top[id] = paylsoad;
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

        setTopIDs(state, payload) {
            state.topstoriesIDs = payload;
        },
        setNewIDs(state, payload) {
            state.newstoriesIDs = payload;
        },
        setBestIDs(state, payload) {
            state.beststoriesIDs = payload;
        },
        setShowIDs(state, payload) {
            state.showstoriesIDs = payload;
        },
        setAskIDs(state, payload) {
            state.askstoriesIDs = payload;
        },
        setJobIDs(state, payload) {
            state.jobstoriesIDs = payload;
        },
    },
    actions: {
        async fetchStory({commit}, section) {
            const ids = await axios.get(`https://hacker-news.firebaseio.com/v0/${section}.json`);
            if(section === 'topstories') commit('setTopIDs', ids.data);
            if(section === 'newstories') commit('setNewIDs', ids.data);
            if(section === 'beststories') commit('setBestIDs', ids.data);
            if(section === 'showstories') commit('setShowIDs', ids.data);
            if(section === 'askstories') commit('setAskIDs', ids.data);
            if(section === 'jobstories') commit('setJobIDs', ids.data);

            console.log(section + " -> " + ids.data.length);

            // const mutation = `set${section.charAt(0).toUpperCase() + section.slice(1)}IDs`;
            // commit(mutation, ids.data);
        },
        async fetchComment({commit}, section) {
            const ids = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${section}.json`);
            if(section === 'top') commit('setTopIDs', ids.data);
            if(section === 'new') commit('setNewIDs', ids.data);
            if(section === 'best') commit('setBestIDs', ids.data);
            if(section === 'show') commit('setShowIDs', ids.data);
            if(section === 'ask') commit('setAskIDs', ids.data);
            if(section === 'job') commit('setJobIDs', ids.data);
        }
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

        // getTopIDs: (state) => {
        //     return state.topIDs;
        // },
        // getNewIDs: (state) => {
        //     return state.newIDs;
        // },
        // getBestIDs: (state) => {
        //     return state.bestIDs;
        // },
        // getShowIDs: (state) => {
        //     return state.showIDs;
        // },
        // getAskIDs: (state) => {
        //     return state.askIDs;
        // },
        // getJobIDs: (state) => {
        //     return state.jobIDs;
        // },

        getStoryIDs: (state) => (section) => {
            return state[`${section}IDs`] || [];
        },

    },
});

export default store;
