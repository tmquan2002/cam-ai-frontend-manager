import {
  Avatar,
  Box,
  Flex,
  LoadingOverlay,
  Paper,
  Text,
  Tooltip,
  rem,
} from "@mantine/core";
import { IconMail, IconPhone } from "@tabler/icons-react";
import { useGetBrandList } from "../../hooks/useGetBrandList";
import LoadingImage from "../../components/image/LoadingImage";

const BrandShopDetailPage = () => {
  const { data, isLoading } = useGetBrandList({ size: 1 });

  if (isLoading)
    return (
      <Paper style={{ flex: 1, height: "100vh" }} pos={"relative"}>
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 1 }}
        />
      </Paper>
    );

  return (
    <Paper p={rem(32)} m={rem(32)} style={{ flex: 1 }} shadow="lg">
      <Flex align={"center"} mb={rem(32)}>
        <Tooltip label="Brand logo">
          <Avatar
            mr={rem(32)}
            h={100}
            w={100}
            src={data?.values[0].logo?.hostingUri}
          />
        </Tooltip>
        <Box>
          <Text size="xl" fw={500} mb={rem(8)}>
            {data?.values[0].name}
          </Text>

          <Flex>
            <Box mr={rem(8)}>
              <IconMail width={20} />
            </Box>
            {data?.values[0].email}
          </Flex>
          <Flex>
            <Box mr={rem(8)}>
              <IconPhone width={20} />
            </Box>
            {data?.values[0].phone}
          </Flex>
        </Box>
      </Flex>

      <Tooltip label="Brand banner">
        <LoadingImage
          radius={"md"}
          bg={"#000"}
          height={400}
          fit="contain"
          imageId={data?.values?.[0]?.banner?.id ?? ""}
        />
      </Tooltip>
    </Paper>
  );
};

export default BrandShopDetailPage;
