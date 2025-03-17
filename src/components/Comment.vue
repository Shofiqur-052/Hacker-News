<script setup>

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

</template>

<style scoped>
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