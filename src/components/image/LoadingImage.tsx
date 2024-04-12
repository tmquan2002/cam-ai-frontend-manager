import { Image, ImageProps, Skeleton } from "@mantine/core";
import { useGetImageById } from "../../hooks/useGetImageById";
import { useMemo } from "react";

interface LoadingImageProps extends ImageProps {
  imageId: string;
  height?: number;
}

const LoadingImage = (props: LoadingImageProps) => {
  const { imageId, ...rest } = props;
  const { data, isLoading } = useGetImageById(imageId);

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
      <Skeleton height={props?.height ?? 400} animate radius={8}></Skeleton>
    );
  }
  return (
    <Image
      {...rest}
      src={`data:;base64,${imageSrc}`}
      fallbackSrc="https://placehold.co/600x400?text=Placeholder"
    />
  );
};

export default LoadingImage;
