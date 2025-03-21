import { createStore } from 'vuex';
import axios from 'axios';
import { calculateTime } from '@/utils/unixTime';

const store = createStore({
    state() {
        return {
            topstories: { }, newstories: { }, beststories: { }, showstories: { }, askstories: { }, jobstories: { },
            topstoriesIDs: [], newstoriesIDs: [], beststoriesIDs: [], showstoriesIDs: [], askstoriesIDs: [], jobstoriesIDs: [],
            comments: { },
        };
    },
    mutations: {        

        setStory(state, { section, id, payload }) {
            state[section][id] = payload;
        },

        setTopstoriesIDs(state, payload) {
            state.topstoriesIDs = payload;
        },
        setNewstoriesIDs(state, payload) {
            state.newstoriesIDs = payload;
        },
        setBeststoriesIDs(state, payload) {
            state.beststoriesIDs = payload;
        },
        setShowstoriesIDs(state, payload) {
            state.showstoriesIDs = payload;
        },
        setAskstoriesIDs(state, payload) {
            state.askstoriesIDs = payload;
        },
        setJobstoriesIDs(state, payload) {
            state.jobstoriesIDs = payload;
        },

        setComment(state, { id, payload }) {
            state.comments[id]= payload;
        },

        setUnixTime(state, { section, id }) {
            state[section][id].time = calculateTime(state[section][id].time);
        },

    },
    actions: {
        async fetchStories({commit}, section) {
            const res = await axios.get(`https://hacker-news.firebaseio.com/v0/${section}.json`);
            commit(`set${section.charAt(0).toUpperCase() + section.slice(1)}IDs`, res.data);
        },
        async fetchComment({commit}, id) {
            const res = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            commit('setComment', { id: id, payload: res.data });
        },
        async fetchStory({commit}, { section, id }) {
            const res = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            commit('setStory', { section: section, id: id, payload: res.data });
            commit('setUnixTime', { section: section, id: id });
        },
    },
    getters: {
        getStory: (state) => (id, section) => {
            return state[section][id] || [];
        },
        getStoryIDs: (state) => (section) => {
            return state[`${section}IDs`] || [];
        },
    },
});

export default store;
