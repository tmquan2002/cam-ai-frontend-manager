import { useEffect, useId } from "react";
import { useGetCameraLiveUrl } from "../../hooks/useGetCameraLiveUrl";
//@ts-ignore
import JSMpeg from "@cycjimmy/jsmpeg-player";
import { Box, Center, Paper, Skeleton, Text, rem } from "@mantine/core";

export type CameraCardProps = {
  cameraId: string | null;
};

const CameraCard = ({ cameraId }: CameraCardProps) => {
  const { data, isLoading, error } = useGetCameraLiveUrl(cameraId);
  const videoWrapperID = useId();
  useEffect(() => {
    if (data) {
      new JSMpeg.VideoElement(`#${CSS.escape(videoWrapperID)}`, data, {
        autoplay: true,
      });
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
        <Skeleton visible={isLoading}>
          <Box w={rem(1080)} h={rem(720)} id={videoWrapperID}></Box>
        </Skeleton>
      </Center>
    </Paper>
  );
};

export default CameraCard;
