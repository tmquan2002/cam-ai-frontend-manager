import { NotificationDetail } from './../models/Notification';
import useWebSocket from "react-use-websocket";
import { getAccessToken } from "../context/AuthContext";
import { useEffect, useState } from "react";

const webSocketUrl = process.env.REACT_APP_VITE_WEB_SOCKET_LINK;

export const useNotification = () => {
  const { lastJsonMessage, readyState } = useWebSocket<NotificationDetail | undefined>(
    webSocketUrl + "/api/notifications/new",
    {
      protocols: ["Bearer", getAccessToken() ?? ""],
    },

    !!getAccessToken()
  );

  const [data, setData] = useState<NotificationDetail | undefined>(undefined)

  useEffect(() => {
    if (lastJsonMessage) {
      setData(lastJsonMessage)
    }
  }, [lastJsonMessage]);

  return {
    lastJsonMessage : data,
    readyState
  }
};
