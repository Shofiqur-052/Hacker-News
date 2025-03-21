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
        setIDs(state, { section, payload }) {
            state[`${section}IDs`] = payload;
        },
        setComment(state, { id, payload }) {
            state.comments[id]= payload;
        },
        setUnixTime(state, { section, id }) {
            state[section][id].time = calculateTime(state[section][id].time);
        },
        setCommentUnixTime(state, id) {
            state.comments[id].time = calculateTime(state.comments[id].time);
            state.comments[id].flag = false;
        },
    },
    actions: {
        async fetchStories({commit}, section) {
            const res = await axios.get(`https://hacker-news.firebaseio.com/v0/${section}.json`);
            commit('setIDs', { section: section, payload: res.data });
        },
        async fetchStory({commit}, { section, id }) {
            const res = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            commit('setStory', { section: section, id: id, payload: res.data });
            commit('setUnixTime', { section: section, id: id });
        },
        async fetchComment({commit}, id) {
            const res = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            commit('setComment', { id: id, payload: res.data });
            commit('setCommentUnixTime', id);
        },
    },
    getters: {
        getStoryIDs: (state) => (section) => {
            return state[`${section}IDs`] || [];
        },
        getStory: (state) => (id, section) => {
            return state[section][id] || [];
        },
        getComment: (state) => (id) => {
            return state.comments[id];
        },
    },
});

export default store;
