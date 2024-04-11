import { Center, Image, rem } from "@mantine/core";
import { IMAGE_CONSTANT } from "../../types/constant";

const NoImage = () => {
  return (
    <Center>
      <Image
        radius={"md"}
        src={IMAGE_CONSTANT.NO_DATA}
        fit="contain"
        h={rem(400)}
        w={"auto"}
        style={{
          borderBottom: "1px solid #dee2e6",
        }}
      />
    </Center>
  );
};

export default NoImage;
