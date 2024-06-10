import { useEffect, useId, useState } from "react";
import { useGetCameraLiveUrl } from "../../hooks/useGetCameraLiveUrl";
import ReconnectingWebSocket from "reconnecting-websocket";
//@ts-ignore
import JSMpeg from "@cycjimmy/jsmpeg-player";
import { Box, Center, Paper, Skeleton, Text, rem } from "@mantine/core";
import { getAccessToken } from "../../context/AuthContext";
import { notifications } from "@mantine/notifications";

export type CameraCardProps = {
  cameraId: string | null;
};

const CameraCard = ({ cameraId }: CameraCardProps) => {
  const { data, isLoading, error } = useGetCameraLiveUrl(cameraId);
  const [isLoadingVideo] = useState<boolean>(false);
  const videoWrapperID = useId();

  useEffect(() => {
    if (data) {
      const rws = new ReconnectingWebSocket(
        data,
        ["Bearer", `${getAccessToken()}`],

        {
          maxRetries: 8,
        }
      );

      rws.onerror = (err) => {
        notifications.show({
          message: err.error.message,
          color: "red",
        });

        rws.close();
      };

      rws.onopen = () => {
        new JSMpeg.VideoElement(`#${CSS.escape(videoWrapperID)}`, data, {
          autoplay: true,
        });
      };

      setInterval(() => {
        console.log("Close and reconnect");
        rws.reconnect();
      }, 1 * 60 * 1000);

      // rws.onclose = () => {
      //   console.log("Close and reconnect");
      // };
    }
  }, [data]);

  if (error) {
    <Box w={rem(980)} h={rem(540)} bg={"#eee"}>
      <Text>{error?.message}</Text>
    </Box>;
  }

  return (
    <Paper>
      <Center>
        <Skeleton visible={isLoading || isLoadingVideo}>
          <Box w={rem(1080)} h={rem(720)} id={videoWrapperID}></Box>
        </Skeleton>
      </Center>
    </Paper>
  );
};

export default CameraCard;
