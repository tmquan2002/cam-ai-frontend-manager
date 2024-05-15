import {
  Box,
  Flex,
  Text,
  rem
} from "@mantine/core";

export const EdgeBoxInstallEmpty = () => {
  return (
    <Flex>
      <Box ml={rem(40)} style={{ flex: 1 }}>
        <Text c="dimmed"
          w={"100%"}
          ta={"center"}
          mt={20}
          fs="italic">
          No edge box found
        </Text>
      </Box>
    </Flex>
  );
};
