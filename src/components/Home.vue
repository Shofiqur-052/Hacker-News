<script setup>
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router";
import axios from "axios"

const route = useRoute();
const router = useRouter();

const news = ref([]);
const param = ref("");

let storiesID = [];
let page = 0;

const activeStory = {
    top: true, new: false, best: false, show: false, ask: false, job: false,
};


// Fetch Storie's IDs once
onMounted(async () => {
    param.value = route.params.stories;

    const storieIDs = await axios.get(`https://hacker-news.firebaseio.com/v0/${param.value}.json`);
    storiesID = splitArray(storieIDs.data);
    fetchStories();
})

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
    news.value = [];
    storiesID[page].forEach(async (id) => {
        news.value.push(await fetchStory(id));
    })
}
// Fetch inique story form ID
async function fetchStory(id) {
    const res = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    return res.data;
}

// Backward page
function backPage() {
    if (storiesID[page - 1] == undefined) return;
    page--;
    fetchStories();
}

// Forward page
function nextPage() {
    if (storiesID[page + 1] == undefined) return;
    page++;
    fetchStories();
}

// Reset Active story and Page number
function resetStories() {
    for (let key in page) page[key] = 0;
    for (let key in activeStory) activeStory[key] = false;
}

// Fetch Top stories
function fetchTopStories() {
    resetStories();
    activeStory.top = true;

    router.push({ path: '/topstories' });
    fetchStories();
}

// Fetch New stories
function fetchNewStories() {
    resetStories();
    activeStory.new = true;

    router.push({ path: '/newstories' });
    fetchStories();
}

// Fetch Best stories
function fetchBestStories() {
    resetStories();
    activeStory.best = true;

    router.push({ path: '/beststories' });
    fetchStories();
}

// Fetch Show stories
function fetchShowStories() {
    resetStories();
    activeStory.show = true;

    router.push({ path: '/showstories' });
    fetchStories();
}

// Fetch Ask stories
function fetchAskStories() {
    resetStories();
    activeStory.ask = true;

    router.push({ path: '/askstories' });
    fetchStories();
}

// Fetch Job stories
function fetchJobStories() {
    resetStories();
    activeStory.job = true;

    router.push({ path: '/jobstories' });
    fetchStories();
}


</script>

<template>
    <div class="header">
        <div class="topNews">
            <p class="leftHeader" @click="fetchTopStories">Hacker News</p>
        </div>
        <div class="subNews">
            <p @click="fetchNewStories" :class="{ underline: activeStory.new }">New</p>
            <p @click="fetchBestStories" :class="{ underline: activeStory.best }">Best</p>
            <p @click="fetchShowStories" :class="{ underline: activeStory.show }">Show</p>
            <p @click="fetchAskStories" :class="{ underline: activeStory.ask }">Ask</p>
            <p @click="fetchJobStories" :class="{ underline: activeStory.job }">Jobs</p>
        </div>
    </div>
    <div class="middle">
        <div class="list" v-for="item in news" :key="item.id">
            <div class="listItems">
                <a class="title" :href="item.url" target="_blank">{{ item.title }}</a>
                <div class="bottomSection">
                    <p>{{ item.score }} voets | </p>
                    <p>by {{ item.by }} | </p>
                    <p v-if="item.descendants != 0">{{ item.descendants }} comments | </p>
                    <p>{{ item.time }} times ago</p>
                </div>
            </div>
        </div>
        <div class="footer">
            <button @click="backPage">back</button>
            <button @click="nextPage">next</button>
        </div>
    </div>

</template>

<style scoped>
.underline {
    /* text-decoration: underline; */
    background-color: rgb(214, 147, 60);
    border-radius: 3px;
}

.footer button {
    margin: 5px;
}

.listItems {
    display: flex;
    flex-direction: column;
    white-space: pre;
}

.bottomSection {
    font-size: 70%;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;

    display: flex;
    align-items: center;
    flex-direction: row;
}

.title {
    font-size: small;
    font-weight: bold;
}

.middle {
    display: flex;
    align-items: center;
    flex-direction: column;
}

.list {
    width: 60%;
    height: 50px;
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
</style>
