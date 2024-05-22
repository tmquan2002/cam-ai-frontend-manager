import {
  Box,
  Card,
  Flex,
  Grid,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Transition,
  rem,
  useComputedColorScheme,
} from "@mantine/core";
import * as _ from "lodash";
import classes from "./ShopHomePage.module.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { IncidentDetail, WebSocketIncident } from "../../models/Incident";
import { useGetIncidentList } from "../../hooks/useGetIncidentList";
import dayjs from "dayjs";
import { useGetShopList } from "../../hooks/useGetShopList";
import { useGetCameraListByShopId } from "../../hooks/useGetCameraListByShopId";
import {
  CameraStatus,
  EventType,
  IncidentStatus,
  IncidentType,
} from "../../models/CamAIEnum";
import { notifications } from "@mantine/notifications";
import { NotificationColorPalette } from "../../types/constant";
import { useGetNewIncident, useReports } from "../../hooks/useReport";
import { ReadyState } from "react-use-websocket";
import { IconCaretRight } from "@tabler/icons-react";
import CameraCard from "../../components/card/CameraCard";
import { useGetEdgeBoxInstallByShopId } from "../../hooks/useGetEdgeBoxInstallByShopId";

export type TitleAndNumberCard = {
  title: string;
  number: number;
  icon: React.FC;
  type: "blue" | "green" | "red" | "yellow";
};

const TitleAndNumberCard = ({
  name,
  count,
}: {
  name: string;
  count?: number | string;
}) => {
  return (
    <Box className={classes["static-card"]}>
      <p className={classes["static-card-title"]}>{name}</p>
      <p className={classes["static-card-number"]}>{count}</p>
    </Box>
  );
};

const IncidentCard = ({
  startTime,
  incidentType,
  status,
  evidences,
  id,
}: IncidentDetail) => {
  const navigate = useNavigate();
  const [mouted, setMouted] = useState(false);
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  useEffect(() => {
    setTimeout(() => {
      setMouted(true);
    }, 200);
  });

  return (
    <Transition
      mounted={mouted}
      transition="fade-left"
      duration={400}
      timingFunction="ease"
    >
      {(styles) => (
        <Card
          style={styles}
          className={classes.main_container}
          w={rem(400)}
          p={rem(20)}
          radius={rem(8)}
          onClick={() => navigate(`/shop/incident/${id}`)}
        >
          <Group justify="space-between" align="center" mb={"md"}>
            <Text fw={500} size={rem(16)}>
              {incidentType == IncidentType.Interaction
                ? "Interaction"
                : incidentType + " incident"}{" "}
            </Text>
            <IconCaretRight style={{ width: "20px", height: "20px" }} />
          </Group>
          <Card.Section
            className={classes.card_footer}
            py={rem(12)}
            px={rem(20)}
          >
            <div>
              <Text size={rem(14)} c="dimmed" lh={rem(21)}>
                Evidence(s)
              </Text>
              <Text fw={600} size={rem(14)} lh={rem(20)} c={computedColorScheme == "light" ? "rgb(17, 24, 39)" : "white"}>
                {evidences ? evidences?.length : 0}
              </Text>
            </div>
            <div>
              <Text size={rem(14)} c="dimmed" lh={rem(21)}>
                Status
              </Text>
              <Flex align={"center"}>
                <Text
                  fw={600}
                  size={rem(14)}
                  lh={rem(20)}
                  c={
                    status == IncidentStatus.Accepted
                      ? NotificationColorPalette.UP_COMING
                      : status == IncidentStatus.New
                        ? NotificationColorPalette.UNAPPROVED
                        : NotificationColorPalette.ALERT_MESSAGE
                  }
                >
                  {status}
                </Text>
              </Flex>
            </div>
            <div>
              <Text size={rem(14)} c="dimmed" lh={rem(21)}>
                Time
              </Text>
              <Text fw={600} size={rem(14)} lh={rem(20)} c={computedColorScheme == "light" ? "rgb(17, 24, 39)" : "white"}>
                {dayjs(startTime).format("HH:mm")}
              </Text>
            </div>
          </Card.Section>
        </Card>
      )}
    </Transition>
  );
};

const ShopHomePage = () => {
  const { lastJsonMessage: humanCountData } = useReports();
  const { lastJsonMessage, readyState } = useGetNewIncident();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const [incidentList, setIncidentList] = useState<IncidentDetail[]>([]);
  const { data: currentIncidentData, isLoading: isGetCurrentIncidentListData } =
    useGetIncidentList({
      size: 999,
      fromTime: dayjs().format("YYYY-MM-DD"),
    });

  const { data: shopData, isLoading: isShopDataLoading } = useGetShopList({
    enabled: true,
  });

  const { data: cameraList, isLoading: isGetCameraListLoading } =
    useGetCameraListByShopId(shopData?.values?.[0]?.id);

  const { data: edgeBoxList, isLoading: isGetEdgeBoxLoading } =
    useGetEdgeBoxInstallByShopId(shopData?.values?.[0]?.id ?? null);

  const handleNewIncident = (incident: IncidentDetail) => {
    notifications.show({
      title: "New incident",
      message: `Incident found at ${dayjs(incident?.startTime).format(
        "HH:mm"
      )} `,
      autoClose: 6000,
      c: NotificationColorPalette.UP_COMING,
    });
    setIncidentList([incident, ...incidentList]);
  };

  console.log({ lastJsonMessage, readyState });
  console.log({ humanCountData, readyState });

  const handleMoreInteraction = (incident: IncidentDetail) => {
    notifications.show({
      title: "More evidence found",
      message: `Incident at ${dayjs(incident.startTime).format(
        "HH:mm"
      )} updated`,
      autoClose: 6000,
      c: NotificationColorPalette.REPORT_EXPENSES,
    });
    const evidentIndex = _.findIndex(incidentList, (listTime) => {
      return listTime?.id == incident.id;
    });
    incidentList.splice(evidentIndex, 1, incident);
  };

  const handleUpdateNewIncident = (incident: WebSocketIncident) => {
    switch (incident.EventType) {
      case EventType.MoreEvidence:
        handleMoreInteraction(incident?.Incident);
        break;
      case EventType.NewIncident:
        handleNewIncident(incident?.Incident);
        break;
    }
  };

  const statisticData = useMemo(() => {
    return _.countBy(incidentList, (i) => {
      return i.incidentType;
    }) as { Phone: number; Uniform: number; Interaction: number };
  }, [incidentList]);

  useEffect(() => {
    if (!isGetCurrentIncidentListData && !currentIncidentData?.isValuesEmpty) {
      setIncidentList(currentIncidentData?.values ?? []);
    }
  }, [currentIncidentData, isGetCurrentIncidentListData]);

  useEffect(() => {
    if (readyState == ReadyState.OPEN && !_.isEmpty(lastJsonMessage)) {
      handleUpdateNewIncident(lastJsonMessage);
    }
  }, [readyState, lastJsonMessage]);

  const renderStatisticContent = () => {
    if (isShopDataLoading || isGetEdgeBoxLoading) {
      return (
        <Skeleton>
          <Box w={"100%"} h={rem(120)} />
        </Skeleton>
      );
    }

    if (edgeBoxList?.isValuesEmpty) {
      return <TitleAndNumberCard name="Edge box not available!" />;
    }

    return (
      <Grid justify="space-between" columns={24} gutter={28}>
        <Grid.Col span={6}>
          <TitleAndNumberCard
            name={"Phone incident"}
            count={statisticData.Phone ?? 0}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TitleAndNumberCard
            name={"Uniform incident"}
            count={statisticData.Uniform ?? 0}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TitleAndNumberCard
            name={"Interaction"}
            count={statisticData.Interaction ?? 0}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TitleAndNumberCard
            name={"Human count"}
            count={humanCountData?.total ?? 0}
          />
        </Grid.Col>
      </Grid>
    );
  };

  const renderCameraContent = () => {
    if (isShopDataLoading || isGetCameraListLoading) {
      return (
        <Skeleton>
          <Box w={rem(980)} h={rem(540)} />
        </Skeleton>
      );
    }

    if (cameraList?.isValuesEmpty) {
      return <TitleAndNumberCard name="Camera not available!" />;
    }

    return (
      <Flex justify={"space-between"}>
        <Group align="flex-end">
          {cameraList?.values?.map((item) =>
            item?.status == CameraStatus.Connected ? (
              <CameraCard cameraId={item?.id} key={item?.id} />
            ) : (
              <div key={item?.id}></div>
            )
          )}
        </Group>

        <Box maw={420}>
          <Skeleton visible={isGetCurrentIncidentListData}>
            <ScrollArea h={"70vh"} scrollbars="y">
              <Stack gap={"lg"} px={rem(10)}>
                {incidentList?.map((item) => (
                  <Box key={item.id}>
                    <IncidentCard {...item} />
                  </Box>
                ))}
              </Stack>
            </ScrollArea>
          </Skeleton>
        </Box>
      </Flex>
    );
  };

  return (
    <Box m={rem(32)}>
      <Text c={computedColorScheme == "light" ? "rgb(17, 24, 39)" : "white"} fw={600} size={rem(17)} mb={rem(24)}>
        Current statistic
      </Text>
      <Box>{renderStatisticContent()}</Box>

      <Text
        c={computedColorScheme == "light" ? "rgb(17, 24, 39)" : "white"}
        fw={600} size={rem(17)} mb={rem(24)} mt={rem(32)}>
        Shop live camera
      </Text>
      {renderCameraContent()}
    </Box>
  );
};

export default ShopHomePage;
