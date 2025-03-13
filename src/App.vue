<script setup>
import { onMounted, ref } from "vue"
import axios from "axios"

const news = ref([]);


onMounted(() => {
  fetchTopStories();
})

async function fetchTopStories() {
  const response = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json");

  let index = 0;
  while (index < 20) {
    const info = {
      id: "",
      title: "Loading...",
      score: "Loading...",
      author: "Loading...",
      comments: [],
      time: "Loading...",
      url: "",
    };
    const res = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${response.data[index]}.json`);
    info.id = res.data.id;
    info.title = res.data.title;
    info.score = res.data.score;
    info.author = res.data.by;
    info.comments = res.data.kids;
    info.time = res.data.time;
    info.url = res.data.url;

    news.value.push(info);
    index++;
  }
  console.log(news.value.length);
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
          <p>by {{ item.author }} | </p>
          <p>{{ item.comments.length }} comments | </p>
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
