import {
  Box,
  Flex,
  Image,
  Text,
  rem,
} from "@mantine/core";

export const EdgeBoxInstallEmpty = () => {
  return (
    <Flex>
      <Image
        radius={"md"}
        src={
          "https://cdn.dribbble.com/users/40756/screenshots/2917981/media/56fae174592893d88f6ca1be266aaaa6.png?resize=450x338&vertical=center"
        }
      />
      <Box ml={rem(40)} style={{ flex: 1 }}>
        <Text>No edgebox installation available</Text>
      </Box>
    </Flex>
  );
};
