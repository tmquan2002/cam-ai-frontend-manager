import { useEffect, useId } from "react";
import { useGetCameraLiveUrl } from "../../hooks/useGetCameraLiveUrl";
//@ts-ignore
import JSMpeg from "@cycjimmy/jsmpeg-player";
import { Box, Center, Paper, Skeleton, rem } from "@mantine/core";

export type CameraCardProps = {
  cameraId: string | null;
};

const CameraCard = ({ cameraId }: CameraCardProps) => {
  const { data, isLoading } = useGetCameraLiveUrl(cameraId);
  const videoWrapperID = useId();
  useEffect(() => {
    if (data) {
      new JSMpeg.VideoElement(`#${CSS.escape(videoWrapperID)}`, data, {
        autoplay: true,
      });
    }
  }, [data]);
  return (
    <Paper>
      <Center mb={rem(20)}>
        <Skeleton visible={isLoading}>
          <Box w={rem(980)} h={rem(540)} id={videoWrapperID}></Box>
        </Skeleton>
      </Center>
    </Paper>
  );
};

export default CameraCard;
