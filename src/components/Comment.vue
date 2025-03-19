<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { calculateTime } from "@/components/Utils/UnixTime"

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});

const comments = ref([]);
const currentID = ref();

onMounted(async () => {

    const res = await axios.get(
        `https://hacker-news.firebaseio.com/v0/item/${props.id}.json`
    );
    currentID.value = res.data;

    if (res.data.kids != undefined) {
        setLoading(res.data.kids.length);

        res.data.kids.forEach(async (id, index) => {
            const result = await axios.get(
                `https://hacker-news.firebaseio.com/v0/item/${id}.json`
            );
            result.data.flag = false;
            result.data.time = calculateTime(result.data.time);
            comments.value.splice(index, 1, result.data);
        });
    }
});

// Set Default Loading values
function setLoading(len) {
    comments.value = [];
    for (let i = 0; i < len; i++) {
        comments.value.push({
            text: "Loading...",
            by: "Loading...",
            time: "Loading...",
            id: i,
        });
    }
}

</script>

<template>
    <div :class="currentID.parent === undefined ? 'commentListDynamic' : 'commentList'
        " v-for="item in comments" :key="item.id">
        <div class="listItems"><br>
            <div class="bottomSection">
                <p>by {{ item.by }} &nbsp;&nbsp; |</p>
                <p v-if="item.kids != undefined">{{ item.kids.length }} comments &nbsp;&nbsp; |</p>
                <p>created {{ item.time }} ago</p>
            </div>
            <br />

            <span v-html="item.text" class="text-span"></span><br />

            <div class="bottomSection" @click="item.flag = !item.flag" v-if="item.kids != undefined">
                <p v-if="!item.flag">show comment [+{{ item.kids.length }}]</p>
                <p v-if="item.flag">Hide comment [-]</p>
            </div>
            <br />
            <Comment v-if="item.flag" :id="item.id" />
        </div>
    </div>
</template>

<style scoped>
.text-span {
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-size: 90%;
}

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

.bottomSection p {
    font-weight: bold;
}

.commentListDynamic {
    width: 60%;
    background-color: rgb(184, 165, 137);
    margin-bottom: 2px;
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);

    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.commentList {
    width: 97.5%;
    background-color: rgb(184, 165, 137);
    margin-bottom: 2px;
    margin-left: 15px;
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);

    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.commentList p,
span,
a {
    color: black;
    margin-left: 16px;
    margin-right: 10px;
}

.commentListDynamic p,
span,
a {
    color: black;
    margin-left: 16px;
    margin-right: 10px;
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
