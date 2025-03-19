
// Calculate Real time difference from Unix time

export function calculateTime(unixTime) {
    const seconds = Math.floor((new Date() - new Date(unixTime * 1000)) / 1000);
    let timeAgo = "0";

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        timeAgo = interval === 1 ? `${interval} year` : `${interval} years ago`;
        return timeAgo;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        timeAgo = interval === 1 ? `${interval} month` : `${interval} months`;
        return timeAgo;
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        timeAgo = interval === 1 ? `${interval} day` : `${interval} days`;
        return timeAgo;
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        timeAgo = interval === 1 ? `${interval} hour` : `${interval} hours`;
        return timeAgo;
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        timeAgo = interval === 1 ? `${interval} minute` : `${interval} minutes`;
        return timeAgo;
    }
    timeAgo = `${seconds} seconds`;

    return timeAgo;
}
