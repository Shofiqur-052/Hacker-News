<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Comment from "./Comment.vue";

const route = useRoute();
const router = useRouter();

const news = ref([]);
const param = ref("");
const isComment = ref(false);

let storiesID = [];
let page = 0;
let commentsID = ref(0);

const activeStory = {
    top: true,
    new: false,
    best: false,
    show: false,
    ask: false,
    job: false,
};

// Fetch Storie's IDs once
async function fetchData() {
    param.value = route.params.stories;
    // Conditional check for fetch stories
    if (param.value === "comments") return;
    const storieIDs = await axios.get(
        `https://hacker-news.firebaseio.com/v0/${param.value}.json`
    );
    storiesID = splitArray(storieIDs.data);
    isComment.value = false;
    fetchStories();
}
watch(
    () => route.fullPath,
    () => {
        fetchData();
    },
    { immediate: true }
);

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
    });
}
// Fetch inique story form ID
async function fetchStory(id) {
    const res = await axios.get(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
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

// Fetch Top stories
function fetchTopStories() {
    router.push({ path: "/topstories" });
}

// Fetch New stories
function fetchNewStories() {
    router.push({ path: "/newstories" });
}

// Fetch Best stories
function fetchBestStories() {
    router.push({ path: "/beststories" });
}

// Fetch Show stories
function fetchShowStories() {
    router.push({ path: "/showstories" });
}

// Fetch Ask stories
function fetchAskStories() {
    router.push({ path: "/askstories" });
}

// Fetch Job stories
function fetchJobStories() {
    router.push({ path: "/jobstories" });
}

// Show Comments
function showComments(item) {
    router.push({ path: "/comments" });

    news.value = [];
    news.value.push(item);
    isComment.value = true;

    commentsID.value = news.value[0].id;

    console.log(news.value[0].id);
}
</script>

<template>
    <div class="header">
        <div class="topNews">
            <p class="leftHeader" @click="fetchTopStories">Hacker News</p>
        </div>
        <div class="subNews">
            <p @click="fetchNewStories" :class="{ underline: param === 'newstories' }">
                New
            </p>
            <p @click="fetchBestStories" :class="{ underline: param === 'beststories' }">
                Best
            </p>
            <p @click="fetchShowStories" :class="{ underline: param === 'showstories' }">
                Show
            </p>
            <p @click="fetchAskStories" :class="{ underline: param === 'askstories' }">
                Ask
            </p>
            <p @click="fetchJobStories" :class="{ underline: param === 'jobstories' }">
                Jobs
            </p>
        </div>
    </div>
    <div class="middle">
        <div class="list" v-for="item in news" :key="item.id">
            <div class="listItems">
                <a class="title" :href="item.url" target="_blank">{{ item.title }}</a>
                <div class="bottomSection">
                    <p>{{ item.score }} voets |</p>
                    <p>by {{ item.by }} |</p>
                    <p v-if="item.descendants != undefined && item.descendants != 0" @click="showComments(item)">
                        {{ item.descendants }} comments |
                    </p>
                    <p>{{ item.time }} times ago</p>
                </div>
            </div>
        </div>
    </div>

    <div class="middle">
        <Comment v-if="isComment" :id="commentsID" />
    </div>

    <div class="footer" v-if="!isComment">
        <button @click="backPage">back</button>
        <button @click="nextPage">next</button>
    </div>
</template>

<style scoped>
.underline {
    /* text-decoration: underline; */
    background-color: rgb(214, 147, 60);
    border-radius: 3px;
}

.footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
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
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;

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

.middle2 {
    width: 60%;
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
