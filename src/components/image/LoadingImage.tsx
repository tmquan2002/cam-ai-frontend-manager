import { Box, Image, ImageProps, Skeleton, rem } from "@mantine/core";
import { useGetImageById } from "../../hooks/useGetImageById";
import { useMemo, useState } from "react";
import NoImage from "./NoImage";

interface LoadingImageProps extends ImageProps {
  imageId: string;
  height?: number;
}

const LoadingImage = (props: LoadingImageProps) => {
  const { imageId, ...rest } = props;
  const { data, isLoading } = useGetImageById({
    id: imageId,
    scaleFactor: 0.8,
  });

  const [isLoadFailed, setIsLoadFailed] = useState<boolean>(false);

  const imageSrc = useMemo(() => {
    if (!data) return "";

    const base64 = btoa(
      new Uint8Array(data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    return base64;
  }, [data]);

  if (isLoading) {
    return (
      <Skeleton
        height={props?.height ?? 400}
        w={props.w ?? "100%"}
        mb={rem(12)}
        animate
        radius={8}
      />
    );
  }

  if (isLoadFailed) {
    return (
      <Box mb={10}>
        <NoImage type="CANNOT_LOAD" />
      </Box>
    );
  }

  return (
    <Image
      {...rest}
      src={`data:;base64,${imageSrc}`}
      onError={() => setIsLoadFailed(true)}
    />
  );
};

export default LoadingImage;
