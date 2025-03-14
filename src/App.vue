<script setup>
import { onMounted, ref } from "vue"
import axios from "axios"

const news = ref([]);

const page = {
  top: 0, new: 0, best: 0, show: 0, ask: 0, jobs: 0,
};
const storiesID = {
  top: [], new: [], best: [], show: [], ask: [], jobs: [],
};


// Fetch Storie's IDs once
onMounted(async () => {
  let topStorieIDs = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json");
  storiesID.top = splitArray(topStorieIDs.data);
  fetchTopStories();

  let newStorieIDs = await axios.get("https://hacker-news.firebaseio.com/v0/newstories.json");
  storiesID.top = splitArray(newStorieIDs.data);

  let bestStorieIDs = await axios.get("https://hacker-news.firebaseio.com/v0/beststories.json");
  storiesID.top = splitArray(bestStorieIDs.data);

  let showStorieIDs = await axios.get("https://hacker-news.firebaseio.com/v0/showstories.json");
  storiesID.top = splitArray(showStorieIDs.data);

  let askStorieIDs = await axios.get("https://hacker-news.firebaseio.com/v0/askstories.json");
  storiesID.top = splitArray(askStorieIDs.data);

  let jobStorieIDs = await axios.get("https://hacker-news.firebaseio.com/v0/jobstories.json");
  storiesID.top = splitArray(jobStorieIDs.data);

})

// Split IDs into pages of 20 stories per page
function splitArray(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i += 20) {
    result.push(arr.slice(i, i + 20));
  }
  return result;
}

// Fetch top stories
async function fetchTopStories() {
  storiesID.top[page.top].forEach(async (id) => {
    news.value.push(await fetchStory(id));
  })
}

// Fetch inique story form ID
async function fetchStory(id) {
  const res = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
  return res.data;
}


</script>

<template>
  <div class="header">
    <div class="topNews">
      <p class="leftHeader">Hacker News</p>
    </div>
    <div class="subNews">
      <p>New</p>
      <p>Best</p>
      <p>Show</p>
      <p>Ask</p>
      <p>Jobs</p>
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
  </div>

</template>

<style scoped>
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
}

.subNews p {
  margin: 8px;
}

.leftHeader {
  color: black;
  font-weight: bold;
}
</style>
