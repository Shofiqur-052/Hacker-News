<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});

const comments = ref([]);
const currentID = ref();

onMounted(async () => {
    console.log(props.id);
    const res = await axios.get(
        `https://hacker-news.firebaseio.com/v0/item/${props.id}.json`
    );
    currentID.value = res.data;

    console.log(currentID.value.parent);

    if (res.data.kids != undefined) {
        res.data.kids.forEach(async (id) => {
            const result = await axios.get(
                `https://hacker-news.firebaseio.com/v0/item/${id}.json`
            );
            result.data.flag = false;
            comments.value.push(result.data);
        });
    }
});

// const flag = ref(false);
</script>

<template>
    <div :class="currentID.parent === undefined ? 'commentListDynamic' : 'commentList'
        " v-for="item in comments" :key="item.id">
        <div class="listItems">
            <div class="bottomSection">
                <p>by {{ item.by }} |</p>
                <p v-if="item.kids != undefined">{{ item.kids.length }} comments |</p>
                <p>created {{ item.time }} times ago</p>
            </div>
            <br />

            <span v-html="item.text"></span><br />

            <div class="bottomSection" @click="item.flag = !item.flag">
                <p>show comment</p>
            </div>
            <br />
            <Comment v-if="item.flag" :id="item.id" />
        </div>
    </div>
</template>

<style scoped>
.listItems {
    display: flex;
    flex-direction: column;
}

.bottomSection {
    font-size: 70%;
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;

    display: flex;
    align-items: center;
    flex-direction: row;
}

.commentListDynamic {
    width: 60%;
    background-color: rgb(184, 165, 137);
    margin-bottom: 2px;
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);

    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.commentList {
    width: 96%;
    background-color: rgb(184, 165, 137);
    margin-bottom: 2px;
    margin-left: 20px;
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.commentList p,
span,
a {
    color: black;
    margin-left: 16px;
}

.commentListDynamic p,
span,
a {
    color: black;
    margin-left: 16px;
}

.commentList,
.commentListDynamic,
.listItems {
    /* width: 70%; */
    box-sizing: border-box;
    overflow-wrap: break-word;
}

.listItems span {
    white-space: normal;
    word-break: break-word;
}
</style>
