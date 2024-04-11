import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { getAccessToken } from "../context/AuthContext";
import {
  removeDate,
  removeFirstUpdateLastArray,
} from "../utils/helperFunction";
import { UseQueryResult, useQuery } from "react-query";
import { ChartReportData } from "../models/Report";
import { CommonResponse } from "../models/Common";
import { GetReportListParams, ReportApi } from "../apis/ReportAPI";
import { IncidentDetail } from "../models/Incident";

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
    }
  );

  const [data, setData] = useState<ChartReportData[]>(
    Array(...Array(5)).map(function () {
      return {
        Time: "00:00:00",
        Total: 0,
        ShopId: "",
      };
    })
  );

  useEffect(() => {
    if (lastJsonMessage) {
      const updatedJson = {
        ...lastJsonMessage,
        Time: removeDate(lastJsonMessage.Time, true),
      };

      const newArray = removeFirstUpdateLastArray<ChartReportData>(
        data,
        updatedJson
      );
      setData(newArray);
    }
  }, [lastJsonMessage]);

  return { data, lastJsonMessage, readyState };
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
        Time: "00:00:00",
        Total: 0,
        ShopId: shopId,
      };
    })
  );

  useEffect(() => {
    if (lastJsonMessage) {
      const updatedJson = {
        ...lastJsonMessage,
        Time: removeDate(lastJsonMessage.Time, true),
      };

      const newArray = removeFirstUpdateLastArray<ChartReportData>(
        data,
        updatedJson
      );
      console.log(newArray);
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
  const { lastJsonMessage, readyState } = useWebSocket<IncidentDetail>(
    webSocketUrl + `/api/incidents/new`,
    {
      protocols: ["Bearer", `${getAccessToken()}`],
    },
    !!getAccessToken()
  );

  const [data, setData] = useState<IncidentDetail | undefined>(undefined);

  useEffect(() => {
    if (lastJsonMessage) {
      setData(lastJsonMessage);
    }
  }, [lastJsonMessage]);

  return {
    lastJsonMessage: data,
    readyState,
  };
};
