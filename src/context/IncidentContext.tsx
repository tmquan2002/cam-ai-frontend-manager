import { createContext, useContext, useEffect } from "react";
import { useGetNewIncident } from "../hooks/useReport";
import { IncidentDetail, WebSocketIncident } from "../models/Incident";
import { ReadyState } from "react-use-websocket";
import _ from "lodash";
import { EventType, IncidentType, Role } from "../models/CamAIEnum";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { NotificationColorPalette } from "../types/constant";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "./AuthContext";

const IncidentContext = createContext<{
  latestIncident: WebSocketIncident | undefined;
  state: ReadyState;
} | null>(null);

export function useGetLiveIncidents() {
  const value = useContext(IncidentContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error(
        "useGetLiveIncidents must be wrapped in a <IncidentProvider />"
      );
    }
  }

  return value;
}

export function IncidentProvider(props: React.PropsWithChildren) {
  const { lastJsonMessage, readyState } = useGetNewIncident();
  const role = getUserRole();
  const navigate = useNavigate();

  const handleClickNotification = (incidentId: string) => {
    if (role == Role.ShopManager) {
      navigate(`/shop/incident/${incidentId}`);
    }
  };

  const handleNewIncident = (incident: IncidentDetail) => {
    const isInteractionType = incident.incidentType == IncidentType.Interaction;

    notifications.show({
      title: isInteractionType ? "New interaction" : "New incident",
      message: `${
        isInteractionType ? "Interaction" : "Incident"
      } found at ${dayjs(incident?.startTime).format("HH:mm")} `,
      autoClose: 5000,
      c: NotificationColorPalette.UP_COMING,
      style:
        role == Role.ShopManager
          ? {
              cursor: "pointer",
            }
          : {},
      onClick: () => {
        handleClickNotification(incident.id);
      },
    });
  };

  const handleMoreEvidence = (incident: IncidentDetail) => {
    notifications.show({
      title: "More evidence found",
      message: `Incident at ${dayjs(incident.startTime).format(
        "HH:mm"
      )} updated`,
      autoClose: 5000,
      c: NotificationColorPalette.REPORT_EXPENSES,
      style:
        role == Role.ShopManager
          ? {
              cursor: "pointer",
            }
          : {},
      onClick: () => {
        handleClickNotification(incident.id);
      },
    });
  };

  const handleUpdateNewIncident = (incident: WebSocketIncident) => {
    switch (incident.EventType) {
      case EventType.MoreEvidence:
        handleMoreEvidence(incident?.Incident);
        break;
      case EventType.NewIncident:
        handleNewIncident(incident?.Incident);
        break;
    }
  };

  useEffect(() => {
    if (readyState == ReadyState.OPEN && !_.isEmpty(lastJsonMessage)) {
      handleUpdateNewIncident(lastJsonMessage);
    }
  }, [readyState, lastJsonMessage]);

  return (
    <IncidentContext.Provider
      value={{
        latestIncident: lastJsonMessage,
        state: readyState,
      }}
    >
      {props.children}
    </IncidentContext.Provider>
  );
}
