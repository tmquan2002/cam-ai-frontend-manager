import { Center, Image, ImageProps, rem } from "@mantine/core";
import { IMAGE_CONSTANT } from "../../types/constant";

export type NoImageProps = {
  type: "NO_DATA" | "CANNOT_LOAD";
} & ImageProps;

const NoImage = ({ type, h }: NoImageProps) => {
  return (
    <Center>
      <Image
        src={
          type == "NO_DATA" ? IMAGE_CONSTANT.NO_DATA : IMAGE_CONSTANT.NO_IMAGE
        }
        radius={"md"}
        fit="contain"
        h={h ?? rem(400)}
        w={"auto"}
        style={{
          border: "1px solid #dee2e6",
        }}
      />
    </Center>
  );
};

export default NoImage;
