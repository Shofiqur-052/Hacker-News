<script setup>
import { onMounted, ref } from 'vue';
import axios from "axios"


const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});

const title = ref("Loading...");

onMounted(async () => {
    const res = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${props.id}.json`);
    title.value = res.data.text;
});


</script>

<template>
    <div class="commentList">
        <div class="listItems">
            <div class="bottomSection">
                <p>by richard | </p>
                <p>45 comments | </p>
                <p>created 5 times ago</p>
            </div><br>

            <p>{{ title }}</p>

            <br>
            <div class="bottomSection">
                <p>show comment</p>
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

.commentList {
    width: 60%;
    background-color: rgb(184, 165, 137);
    margin-bottom: 2px;
    border-radius: 2px;

    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.commentList p,
a {
    color: black;
    margin-left: 16px;
}
</style>