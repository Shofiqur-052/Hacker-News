<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Comment from "./Comment.vue";
import { useStore } from "vuex";
import { calculateTime } from "@/utils/unixTime"

const route = useRoute();
const router = useRouter();
const store = useStore();

const news = ref([]);
const param = ref("");
const paramID = ref(0);
const isComment = ref(false);
const areAllFetched = ref(false);

let storiesID = [];
let page = 0;
let commentsID = ref([]);

// Fetch ALL ids from api call
onMounted(async () => {
    try {
        await Promise.all([
            store.dispatch('fetchStory', "topstories"),
            store.dispatch('fetchStory', "newstories"),
            store.dispatch('fetchStory', "beststories"),
            store.dispatch('fetchStory', "showstories"),
            store.dispatch('fetchStory', "askstories"),
            store.dispatch('fetchStory', "jobstories")
        ]);
        areAllFetched.value = true;
        fetchData();
    } catch (error) {
        console.error('Error while fetching stories:', error);
    }
});

// Fetch Storie's IDs once
async function fetchData() {
    param.value = route.params.stories;
    paramID.value = route.params.id;
    page = 0;

    if (paramID.value === undefined && param.value === undefined) { return; }
    if (paramID.value != undefined) {
        const item = await fetchStory(paramID.value);
        if (item !== null) showComments(item);
        return;
    }
    if (!checkCorrectStory()) {
        router.push({ name: 'Error', params: { catchAll: param.value } });
        return;
    }
    // let storyIDs = await axios.get(`https://hacker-news.firebaseio.com/v0/${param.value}.json`);
    const storyIDs = store.getters.getStoryIDs(param.value);

    storiesID = splitArray(storyIDs);
    isComment.value = false;
    setLoading();
    fetchStories();
}
watch(
    () => route.fullPath, () => {
        if (areAllFetched.value) fetchData();
    }, { immediate: true }
);

// Set Default Loading values
function setLoading() {
    news.value = [];
    for (let index = 0; index < storiesID[page].length; index++) {
        news.value.push({
            id: index,
            title: "Loading...",
            score: "Loading...",
            by: "Loading...",
            time: "Loading...",
        });
    }
}

// Check correct story param
function checkCorrectStory() {
    const item = ['top', 'new', 'best', 'show', 'ask', 'job'];
    const ans = item.some((name) => {
        return param.value === `${name}stories`;
    });
    return ans;
}

// Split IDs into pages of 20 stories per page
function splitArray(arr) {
    const result = [];
    for (let i = 0; i < arr.length; i += 20) {
        result.push(arr.slice(i, i + 20));
    }
    return result;
}

// Fetch Stories
async function fetchStories() {
    storiesID[page].forEach(async (id, index) => {
        news.value.splice(index, 1, await fetchStory(id));
    });
}
// Fetch inique story form ID
async function fetchStory(id) {
    try {
        const res = await axios.get(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        res.data.time = calculateTime(res.data.time);
        return res.data;
    } catch (error) {
        router.push({ name: 'Error', params: { catchAll: param.value } });
        return null;
    }
}

// Forward or Backward page
function switchPage(amount) {
    if (storiesID[page + amount] == undefined) return;
    page += amount;
    setLoading();
    fetchStories();
}

// Fetch stories
function navigateStories(name) {
    router.push({ path: `/${name}stories` });
}

// Show Comments
function showComments(item) {
    router.push({ path: `/comments/${item.id}` });
    news.value = [];
    news.value.push(item);

    isComment.value = true;
    commentsID.value = news.value[0].kids;
}

</script>
<template>
    <div class="header">
        <div class="topNews">
            <p class="leftHeader" @click="navigateStories('top')">Hacker News</p>
        </div>
        <div class="subNews">
            <p @click="navigateStories('new')" :class="{ underline: param === 'newstories' }">New</p>
            <p @click="navigateStories('best')" :class="{ underline: param === 'beststories' }">Best</p>
            <p @click="navigateStories('show')" :class="{ underline: param === 'showstories' }">Show</p>
            <p @click="navigateStories('ask')" :class="{ underline: param === 'askstories' }">Ask</p>
            <p @click="navigateStories('job')" :class="{ underline: param === 'jobstories' }">Jobs</p>
        </div>
    </div>
    <div class="middle">
        <div class="list" v-for="item in news" :key="item.id">
            <div class="listItems">
                <a class="title" :href="item.url" target="_blank">{{ item.title }}</a>
                <div class="bottomSection">
                    <p>{{ item.score }} votes &nbsp;&nbsp; |</p>
                    <p>by {{ item.by }} &nbsp;&nbsp; |</p>
                    <p v-if="item.descendants != undefined && item.descendants != 0" @click="showComments(item)"
                        class="commentsTitle">
                        {{ item.descendants }} comments &nbsp;&nbsp; |
                    </p>
                    <p>Created {{ item.time }} ago</p>
                </div>
            </div>
        </div>
    </div>

    <div class="middle">
        <Comment v-if="isComment" :ids="commentsID" :count="0" />
    </div>

    <div class="footer" v-if="!isComment">
        <button @click="switchPage(-1)">&laquo;</button>
        <p>{{ page + 1 }} / {{ storiesID.length }}</p>
        <button @click="switchPage(+1)">&raquo;</button>
    </div>
</template>

<style scoped>
.commentsTitle:hover {
    text-decoration: underline;
}

.underline {
    background-color: rgb(232, 156, 101);
    border-radius: 3px;
}

.footer {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    font-size: small;
    width: 100%;
    background-color: burlywood;
}

.footer button {
    margin: 5px;
    background-color: rgb(232, 156, 101);
    border-radius: 4px;
    width: 35px;
}

.footer p {
    color: black;
}

.listItems {
    display: flex;
    flex-direction: column;
    white-space: pre;
}

.bottomSection {
    font-size: 70%;
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;

    display: flex;
    align-items: center;
    flex-direction: row;
}

.title {
    font-size: small;
    font-weight: bold;
    text-decoration: none;
}

.title:hover {
    text-decoration: underline;
}

.middle {
    display: flex;
    align-items: center;
    flex-direction: column;
}

.middle2 {
    width: 60%;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.list {
    width: 60%;
    height: 55px;
    background-color: rgb(184, 165, 137);
    margin-bottom: 2px;
    border-radius: 2px;

    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.list p,
a {
    color: black;
    margin-left: 16px;
}

.header {
    display: flex;
    flex-direction: row;
    height: 50px;
}

.topNews {
    height: 50px;
    background-color: burlywood;
    width: 50%;

    display: flex;
    align-items: center;
    justify-content: center;
}

.subNews {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 50px;
    background-color: burlywood;
    width: 50%;
    font-size: small;
    color: black;
    cursor: pointer;
}

.subNews p {
    padding: 1px 12px;
}

.leftHeader {
    color: black;
    font-weight: bold;
    cursor: pointer;
}

.leftHeader:hover {
    text-decoration: underline;
}
</style>
