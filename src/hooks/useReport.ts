import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { getAccessToken } from "../context/AuthContext";
import {
  removeDate,
  removeFirstUpdateLastArray,
} from "../utils/helperFunction";
import { UseQueryResult, useQuery } from "react-query";
import { ChartReportData } from "../models/Report";
import { CommonResponse } from "../models/Common";
import { GetReportListParams, ReportApi } from "../apis/ReportAPI";
import { WebSocketIncident } from "../models/Incident";

const webSocketUrl = process.env.REACT_APP_VITE_WEB_SOCKET_LINK;

/**
 * Returns a websocket live data counting total people currently from a shop this shop manager has.
 *
 */
export const useReports = () => {
  const { lastJsonMessage, readyState } = useWebSocket<ChartReportData>(
    webSocketUrl + "/api/shops/chart/customer",
    {
      protocols: ["Bearer", `${getAccessToken()}`],
    },
    !!getAccessToken()
  );

  return { lastJsonMessage, readyState };
};

/**
 * Returns a websocket live data counting total people currently in this shop.
 *
 */
export const useReportByShop = (shopId: string) => {
  const { lastJsonMessage, readyState } = useWebSocket<ChartReportData>(
    webSocketUrl + `/api/shops/${shopId}/chart/customer`,
    {
      protocols: ["Bearer", `${getAccessToken()}`],
    }
  );

  const [data, setData] = useState<ChartReportData[]>(
    Array(...Array(5)).map(function () {
      return {
        time: "00:00:00",
        total: 0,
        shopId: shopId,
      };
    })
  );

  useEffect(() => {
    if (lastJsonMessage) {
      const updatedJson = {
        ...lastJsonMessage,
        Time: removeDate(lastJsonMessage.time, true),
      };

      const newArray = removeFirstUpdateLastArray<ChartReportData>(
        data,
        updatedJson
      );
      // console.log(newArray);
      setData(newArray);
    }
  }, [lastJsonMessage]);

  return { data, lastJsonMessage, readyState };
};

/**
 * Returns past data of counting people from the current shop this shop manager has.
 *
 */
export const useGetPastReportList = (date?: string) => {
  const {
    isLoading,
    data,
    isError,
    error,
    refetch,
  }: UseQueryResult<CommonResponse<ChartReportData>, Error> = useQuery({
    queryKey: ["reportList"],
    queryFn: async () => {
      return await ReportApi._getReportShopList(date);
    },
  });

  return { isError, isLoading, data, error, refetch };
};

/**
 * Returns past data of counting people from the current shop.
 *
 */
export const useGetPastReportByShop = (params: GetReportListParams) => {
  const {
    isLoading,
    data,
    isError,
    error,
    refetch,
  }: UseQueryResult<CommonResponse<ChartReportData>, Error> = useQuery({
    queryKey: ["reportList"],
    queryFn: async () => {
      return await ReportApi._getReportShopById(params);
    },
    enabled: !!params.shopId,
  });

  return { isError, isLoading, data, error, refetch };
};

export const useGetNewIncident = () => {
  const { lastJsonMessage, readyState, sendMessage } =
    useWebSocket<WebSocketIncident>(
      webSocketUrl + `/api/incidents/new`,
      {
        protocols: ["Bearer", `${getAccessToken()}`],
      },
      !!getAccessToken()
    );

  const [data, setData] = useState<WebSocketIncident | undefined>(undefined);

  useEffect(() => {
    if (lastJsonMessage) {
      setData(lastJsonMessage);
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    if (readyState == ReadyState.CLOSED) {
      sendMessage("");
    }
  }, [readyState]);

  return {
    lastJsonMessage: data,
    readyState,
  };
};
