import { Box, Center, Paper, Skeleton, rem } from "@mantine/core";
import { useEffect, useId, useState } from "react";
//@ts-ignore
import JSMpeg from "@cycjimmy/jsmpeg-player";
import { useGetCameraLiveUrl } from "../../hooks/useGetCameraLiveUrl";
import { useParams } from "react-router-dom";

const CameraDetailPage = () => {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useGetCameraLiveUrl(params?.id);
  const videoWrapperID = useId();
  const [videoPLayer, setVideoPLayer] = useState<any>();
  useEffect(() => {
    if (data && !videoPLayer) {
      const video = new JSMpeg.VideoElement(
        `#${CSS.escape(videoWrapperID)}`,
        data,
        { autoplay: true }
      );
      setVideoPLayer(video);
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

export default CameraDetailPage;
