import axios from "axios";
import { api_url } from "../constants";

const ethPrice = "https://pro-api.coingecko.com/api/v3/simple/price";
const getTrendingProjectsRoute = `${api_url}project/get-trending-projects`
const getAllProjectsRoute = `${api_url}project/get-all-projects?limit=12&page=`
const getAllTopGainersRoute = `${api_url}project/get-top-gainer-projects`
const getDashboardDataRoute = `${api_url}dashboards/get-dashboard-data`
const getKingOfTheDesertRoute = `${api_url}project/get-king-of-the-desert-project`

export const ethToDollarConverter = async () => {
    try {
        const response = await axios.get(
            ethPrice,
            {
                params: {
                    ids: "ethereum",
                    vs_currencies: "usd",
                },
                headers: {
                    "x-cg-pro-api-key": "CG-AMT6oz8K7Qpx7qESamW9hKZu",
                },
            }
        );
        return response?.data?.ethereum?.usd;
    } catch (error) {
        console.error("Error fetching ETH price:", error);
    }
}

export const getTrendingData = async () => {
    try {
        const { data } = await axios.get(getTrendingProjectsRoute);
        return data?.data;

    } catch (error) {
        console.error("Error fetching:", error);
    }
};

export const getAllProjectsData = async (currentPage: number) => {
    try {
        const { data } = await axios.get(`${getAllProjectsRoute}${currentPage}`);
        console.log('data:', data)
        return data
    }
    catch (error) {
        console.error("Error fetching:", error);
    }
}

export const getAllTopGainers = async () => {
    try {
        const { data } = await axios.get(getAllTopGainersRoute);
        return data
    } catch (error) {
        console.error("Error fetching:", error);
    }
}

export const getDashboardData = async () => {
    try {
        const { data } = await axios.get(getDashboardDataRoute);
        return data?.data
    } catch (error) {
        console.error("Error fetching:", error);
    }
}

export const getKingOfTheDesert = async () => {
    try {
        const { data } = await axios.get(getKingOfTheDesertRoute);
        return data?.data
    } catch (error) {
        console.error("Error fetching:", error);
    }
}