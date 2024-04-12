import {
  Box,
  Card,
  Divider,
  Flex,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  rem,
  useComputedColorScheme,
} from "@mantine/core";
import { IconCaretRight, IconTrendingUp } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import classes from "./ShopStreamPage.module.scss";
import { useEffect, useState } from "react";
//@ts-ignore
import JSMpeg from "@cycjimmy/jsmpeg-player";
import { useGetNewIncident } from "../../hooks/useReport";
import { ReadyState } from "react-use-websocket";
import _ from "lodash";
import { IncidentDetail } from "../../models/Incident";
import dayjs from "dayjs";
import { useGetIncidentList } from "../../hooks/useGetIncidentList";
import { useGetShopList } from "../../hooks/useGetShopList";
import { useGetCameraListByShopId } from "../../hooks/useGetCameraListByShopId";
import CameraCard from "../../components/card/CameraCard";
import { notifications } from "@mantine/notifications";
import { EventType } from "../../models/CamAIEnum";

const ShopStreamPage = () => {
  const navigate = useNavigate();
  const [incidentList, setIncidentList] = useState<IncidentDetail[]>([]);
  const { data: currentIncidentData, isLoading: isGetCurrentIncidentListData } =
    useGetIncidentList({
      size: 999,
      fromTime: dayjs().format("YYYY-MM-DD"),
    });

  const { data: shopData, isLoading: isShopdataLoading } = useGetShopList({
    enabled: true,
  });
  const { data: cameraList, isLoading: isGetCameraListLoading } =
    useGetCameraListByShopId(shopData?.values?.[0].id);

  useEffect(() => {
    if (!isGetCurrentIncidentListData && !currentIncidentData?.isValuesEmpty) {
      setIncidentList(currentIncidentData?.values ?? []);
    }
  }, [currentIncidentData, isGetCurrentIncidentListData]);

  const { lastJsonMessage, readyState } = useGetNewIncident();

  useEffect(() => {
    if (readyState == ReadyState.OPEN && !_.isEmpty(lastJsonMessage)) {
      notifications.show({
        title:
          lastJsonMessage?.EventType == EventType.MoreEvidence
            ? "More evidence found"
            : "New incident",
        message:
          lastJsonMessage?.EventType == EventType.MoreEvidence
            ? `Incident at ${lastJsonMessage?.Incident?.startTime} updated!`
            : `${lastJsonMessage?.Incident.incidentType} incident founded!`,
        autoClose: 2000,
      });
      setIncidentList([...incidentList, lastJsonMessage.Incident]);
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
          <Text fw={500}>{incidentType} incident</Text>
          <IconCaretRight
            style={{ width: "20px", height: "20px" }}
            color={computedColorScheme == "dark" ? "#5787db" : "#39588f"}
          />
        </Group>
        <Card.Section className={classes.card_footer}>
          <div>
            <Text size="xs" c="dimmed">
              Evidence
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
              <IconTrendingUp
                style={{ width: "30%", height: "30%" }}
                color={computedColorScheme == "dark" ? "#45b445" : "green"}
              />
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

  return (
    <Box pb={rem(40)}>
      <Text
        size="lg"
        fw={"bold"}
        fz={25}
        c={"light-blue.4"}
        ml={rem(40)}
        my={rem(20)}
      >
        STREAM
      </Text>

      <Flex>
        <Box flex={1}>
          <Paper mx={rem(40)} shadow="xs" px={rem(32)} py={rem(20)}>
            <Text fw={500} size={rem(18)} mb={rem(20)}>
              Live Footage
            </Text>
            <Divider color="#acacac" mb={rem(20)} />
            {isShopdataLoading || isGetCameraListLoading ? (
              <Loader />
            ) : (
              cameraList?.values?.map((item) => (
                <CameraCard cameraId={item?.id} key={item?.id} />
              ))
            )}
          </Paper>
        </Box>

        <Skeleton visible={isGetCurrentIncidentListData}>
          <Box miw={400} mr={rem(40)}>
            <ScrollArea h={"80vh"} className={classes.scroll_area}>
              <Stack gap={"lg"}>
                {incidentList?.map((item) => renderContent(item))}
              </Stack>
            </ScrollArea>
          </Box>
        </Skeleton>
      </Flex>
    </Box>
  );
};

export default ShopStreamPage;
