import formatDistanceToNow from "date-fns/formatDistanceToNow";

export const TimeInterval = {
    SECOND: 'second',
    MINUTE: 'minute',
    FIVE_MINUTES: 'five_minutes',
    FIFTEEN_MINUTES: 'fifteen_minutes',
    THIRTY_MINUTES: 'thirty_minutes',
    HOURLY: 'hourly',
    DAILY: 'daily',
    WEEK: 'week',
    MONTHLY: 'monthly',
    QUARTER: 'quarter',
    YEAR: 'year',
};

export const formatEthinDollar = (market: number, eth: number) => {
    const value = market * eth;
    const formatedDollarValue = formatMarketCap(value)
    return formatedDollarValue;
};

export const formatMarketCap = (value: number) => {
    if (value >= 1_000_000_000) {
        return (value / 1_000_000_000).toFixed(2).replace(/\.0$/, '') + 'B';
    } else if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (value >= 1_000) {
        return (value / 1_000).toFixed(2).replace(/\.0$/, '') + 'K';
    } else {
        return value.toFixed(2);
    }
};

export const getTimeInAges = (time: any) => {
    const lastUpdated = time
        ? formatDistanceToNow(new Date(time), { addSuffix: true })
            .replace("about ", "")
            .replace("less than a", "<1")
            .replace(" hours", "h")
            .replace(" hour", "h")
            .replace(" minutes", "m")
            .replace(" minute", "m")
            .replace(" month", "mo")
            .replace(" months", "mo")
            .replace(" days", "d")
            .replace(" day", "d")
            .replace(" Year", "y")
            .replace(" Years", "y")
        : "Unknown time";
    return lastUpdated
}