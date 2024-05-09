import {
  Box,
  Card,
  Center,
  Flex,
  Grid,
  Group,
  Loader,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  rem,
  useComputedColorScheme,
} from "@mantine/core";
import * as _ from "lodash";
import classes from "./ShopHomePage.module.scss";
import NoImage from "../../components/image/NoImage";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { IncidentDetail, WebSocketIncident } from "../../models/Incident";
import { useGetIncidentList } from "../../hooks/useGetIncidentList";
import dayjs from "dayjs";
import { useGetShopList } from "../../hooks/useGetShopList";
import { useGetCameraListByShopId } from "../../hooks/useGetCameraListByShopId";
import { CameraStatus, EventType, IncidentType } from "../../models/CamAIEnum";
import { notifications } from "@mantine/notifications";
import { NotificationColorPalette } from "../../types/constant";
import { useGetNewIncident } from "../../hooks/useReport";
import { ReadyState } from "react-use-websocket";
import { IconCaretRight, IconTrendingUp } from "@tabler/icons-react";
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
  count?: number;
}) => {
  return (
    <Box className={classes["static-card"]}>
      <p className={classes["static-card-title"]}>{name}</p>
      <p className={classes["static-card-number"]}>{count}</p>
    </Box>
  );
};

const ShopHomePage = () => {
  // const { data, lastJsonMessage, readyState } = useReports();
  const navigate = useNavigate();
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
    useGetCameraListByShopId(shopData?.values?.[0].id);

  const { data: edgeBoxList, isLoading: isGetEdgeBoxLoading } =
    useGetEdgeBoxInstallByShopId(shopData?.values?.[0]?.id ?? null);

  const handleNewIncident = (incident: IncidentDetail) => {
    notifications.show({
      title: "New incident",
      message: `Incident found at ${dayjs(incident?.startTime).format(
        "HH:ss"
      )} `,
      autoClose: 4000,
      c: NotificationColorPalette.UP_COMING,
    });
    setIncidentList([incident, ...incidentList]);
  };

  const handleMoreInteraction = (incident: IncidentDetail) => {
    notifications.show({
      title: "More evidence found",
      message: `Incident at ${dayjs(incident.startTime).format(
        "HH:ss"
      )} updated`,
      autoClose: 4000,
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

  const { lastJsonMessage, readyState } = useGetNewIncident();

  useEffect(() => {
    if (readyState == ReadyState.OPEN && !_.isEmpty(lastJsonMessage)) {
      handleUpdateNewIncident(lastJsonMessage);
    }
  }, [readyState, lastJsonMessage]);

  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const renderContent = ({
    startTime,
    incidentType,
    status,
    evidences,
    id,
  }: IncidentDetail) => {
    return (
      <Card
        withBorder
        padding="lg"
        key={id}
        className={classes.main_container}
        w={rem(400)}
        p="md"
        onClick={() => navigate(`/shop/incident/${id}`)}
      >
        <Group justify="space-between" align="center" mb={"md"}>
          <Text fw={500}>
            {incidentType == IncidentType.Interaction
              ? "Interaction"
              : incidentType + " incident"}{" "}
          </Text>
          <IconCaretRight
            style={{ width: "20px", height: "20px" }}
            color={computedColorScheme == "dark" ? "#5787db" : "#39588f"}
          />
        </Group>
        <Card.Section className={classes.card_footer}>
          <div>
            <Text size="xs" c="dimmed">
              Evidence(s)
            </Text>
            <Text fw={500} size="sm">
              {evidences ? evidences?.length : 0}
            </Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">
              Status
            </Text>
            <Flex align={"center"}>
              <Text fw={500} size="sm">
                {status}
              </Text>
            </Flex>
          </div>
          <div>
            <Text size="xs" c="dimmed">
              Time
            </Text>
            <Text fw={500} size="sm">
              {dayjs(startTime).format("HH:mm DD-MM-YYYY")}
            </Text>
          </div>
        </Card.Section>
      </Card>
    );
  };

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
          <TitleAndNumberCard name={"Human count"} count={5} />
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
        <Group justify="center" align="flex-start">
          {cameraList?.values?.map((item) =>
            item?.status == CameraStatus.Connected ? (
              <CameraCard cameraId={item?.id} key={item?.id} />
            ) : (
              <Box key={item?.id}></Box>
            )
          )}
        </Group>

        <Box maw={400} ml={rem(20)}>
          <Skeleton visible={isGetCurrentIncidentListData}>
            <ScrollArea h={"80vh"}>
              <Stack gap={"lg"}>
                {incidentList?.map((item) => renderContent(item))}
              </Stack>
            </ScrollArea>
          </Skeleton>
        </Box>
      </Flex>
    );
  };

  return (
    <Box m={rem(32)}>
      <Text c={"rgb(17, 24, 39)"} fw={600} size={rem(17)} mb={rem(24)}>
        Current statistic
      </Text>
      <Box>{renderStatisticContent()}</Box>

      <Text
        c={"rgb(17, 24, 39)"}
        fw={600}
        size={rem(17)}
        mb={rem(24)}
        mt={rem(32)}
      >
        Shop live camera
      </Text>
      {renderCameraContent()}
    </Box>
  );
};

export default ShopHomePage;
