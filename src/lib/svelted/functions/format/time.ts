// required number:
// new Date.getTime()

export default function formatDate(date: number): string {
    const now = new Date();
    const enteredDate = new Date(date);
    const diff = now.getTime() - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const years = Math.floor(days / 365);

    if (seconds == 0) {
        return 'now';
    } else if (seconds < 60) {
        return `${seconds} sec ago`;
    } else if (minutes === 1) {
        return `1 min ago`;
    } else if (minutes < 60) {
        return `${minutes} mins ago`;
    } else if (hours === 1) {
        return `1 hour ago`;
    } else if (hours < 24 && enteredDate.getDate() === now.getDate()) {
        const hoursFormat = ('0' + enteredDate.getHours()).slice(-2);
        const minutesFormat = ('0' + enteredDate.getMinutes()).slice(-2);
        return `Today at ${hoursFormat}:${minutesFormat}`;
    } else if (days === 1) {
        const hoursFormat = ('0' + enteredDate.getHours()).slice(-2);
        const minutesFormat = ('0' + enteredDate.getMinutes()).slice(-2);
        return `Yesterday at ${hoursFormat}:${minutesFormat}`;
    } else if (weeks === 1) {
        return `1 week ago`;
    } else if (weeks === 2) {
        return `2 weeks ago`;
    } else if (years === 1) {
        return `1 year ago`;
    } else if (years === 2) {
        return `2 years ago`;
    } else {
        return enteredDate.toLocaleDateString();
    }
}