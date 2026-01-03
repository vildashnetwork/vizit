/**
 * formatTime
 * @param {string | number | Date} time - Past time (ISO string, timestamp, or Date)
 * @returns {string} Human-readable elapsed time
 */
export function formatTime(time) {
    const past = new Date(time).getTime();
    const now = Date.now();

    if (isNaN(past)) return "Invalid time";

    const diff = Math.floor((now - past) / 1000); // seconds

    if (diff < 5) return "just now";
    if (diff < 60) return `${diff}s ago`;

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;

    const years = Math.floor(days / 365);
    return `${years}y ago`;
}
