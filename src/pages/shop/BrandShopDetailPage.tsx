import {
  Avatar,
  Box,
  Flex,
  Image,
  Loader,
  Paper,
  Text,
  Tooltip,
  rem,
} from "@mantine/core";
import { useGetBrandList } from "../../hooks/useGetBrandList";
import { IconMail, IconPhone } from "@tabler/icons-react";

const BrandShopDetailPage = () => {
  const { data, isLoading } = useGetBrandList({ size: 1 });

  if (isLoading) {
    return <Loader />;
  }
  return (
    <Paper
      p={rem(32)}
      style={{ flex: 1 }}
    >
      <Flex
        align={"center"}
        mb={rem(32)}
      >
        <Tooltip label="Brand logo">
          <Avatar
            mr={rem(32)}
            h={100}
            w={100}
            src={data?.values[0].logoUri}
          />
        </Tooltip>
        <Box>
          <Text
            size="xl"
            fw={500}
            mb={rem(8)}
          >
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
        <Image
          radius={"md"}
          bg={"#000"}
          height={400}
          fit="contain"
          src={data?.values[0].bannerUri}
        />
      </Tooltip>
    </Paper>
  );
};

export default BrandShopDetailPage;
