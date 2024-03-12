import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { getAccessToken } from "../context/AuthContext";
import { removeDate, removeFirstUpdateLastArray } from "../utils/helperFunction";
import { UseQueryResult, useQuery } from "react-query";
import { ChartReportData } from "../models/Report";
import { CommonResponse } from "../models/Common";
import { ReportApi } from "../apis/ReportAPI";

const webSocketUrl = process.env.REACT_APP_VITE_WEB_SOCKET_LINK;

export const useReports = () => {
    const { lastJsonMessage, readyState } = useWebSocket<ChartReportData>(webSocketUrl + "/api/shops/chart/customer", {
        protocols: ["Bearer", `${getAccessToken()}`]
    })

    const [data, setData] = useState<ChartReportData[]>(Array.apply(null, Array(5))
        .map(function () {
            return {
                Time: "00:00:00",
                Total: 0,
                ShopId: "",
            }
        }))

    useEffect(() => {
        if (lastJsonMessage) {

            const updatedJson = {
                ...lastJsonMessage,
                Time: removeDate(lastJsonMessage.Time, true)
            };

            const newArray = removeFirstUpdateLastArray<ChartReportData>(data, updatedJson);
            console.log(newArray)
            setData(newArray);
        }
    }, [lastJsonMessage]);

    return { data, lastJsonMessage, readyState };
};

export const useReportByShop = (shopId: string) => {
    const { lastJsonMessage, readyState } = useWebSocket<ChartReportData>(webSocketUrl + `/api/shops/${shopId}/chart/customer`, {
        protocols: ["Bearer", `${getAccessToken()}`]
    })

    const [data, setData] = useState<ChartReportData[]>(Array.apply(null, Array(5))
        .map(function () {
            return {
                Time: "00:00:00",
                Total: 0,
                ShopId: shopId,
            }
        }))

    useEffect(() => {
        if (lastJsonMessage) {

            const updatedJson = {
                ...lastJsonMessage,
                Time: removeDate(lastJsonMessage.Time, true)
            };

            const newArray = removeFirstUpdateLastArray<ChartReportData>(data, updatedJson);
            console.log(newArray)
            setData(newArray);
        }
    }, [lastJsonMessage]);

    return { data, lastJsonMessage, readyState };
};

export const useGetReportList = () => {
    const { isLoading, data, isError, error, refetch,
    }: UseQueryResult<CommonResponse<ChartReportData>, Error> = useQuery({
        queryKey: ["reportList"],
        queryFn: async () => {
            return await ReportApi._getReportShopList();
        },
    });

    return { isError, isLoading, data, error, refetch };
};

export const useGetReportByShop = (ShopId: string) => {
    const { isLoading, data, isError, error, refetch,
    }: UseQueryResult<CommonResponse<ChartReportData>, Error> = useQuery({
        queryKey: ["reportList"],
        queryFn: async () => {
            return await ReportApi._getReportShopById(ShopId);
        },
    });

    return { isError, isLoading, data, error, refetch };
};
