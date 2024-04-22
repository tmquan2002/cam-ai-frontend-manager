import {
  Box,
  Card,
  Flex,
  Group,
  List,
  SimpleGrid,
  Text,
  rem,
} from "@mantine/core";
import classes from "./ShopCalendarSetting.module.scss";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ShopCalendarSetting = () => {
  return (
    <Flex
      px={rem(28)}
      pt={rem(40)}
      bg={"#fff"}
      flex={1}
      direction={"column"}
      pb={rem(40)}
    >
      <Card
        radius={8}
        style={{
          borderRight: "1px solid rgb(229 231 235)",
          borderTop: "1px solid rgb(229 231 235)",
        }}
        mb={rem(40)}
      >
        <Card.Section
          bg={"#f9fafb"}
          py={rem(16)}
          px={rem(24)}
          style={{
            borderBottom: "1px solid #ccc",
          }}
        >
          <Group justify="space-between">
            <Text size={rem(17)} fw={600} lh={rem(24)}>
              Some thing
            </Text>
          </Group>
        </Card.Section>
        <Card.Section>
          <SimpleGrid cols={7} spacing={0} style={{}}>
            {WEEKDAYS.map((day) => {
              return (
                <Box
                  py={rem(8)}
                  style={{
                    borderBottom: "1px solid #ccc",
                    borderLeft: "1px solid #ccc",
                  }}
                >
                  <Text
                    key={day}
                    c={"rgb(55 65 81)"}
                    size={rem(14)}
                    lh={rem(24)}
                    ta={"center"}
                    fw={600}
                  >
                    {day}
                  </Text>
                </Box>
              );
            })}

            {WEEKDAYS.map((day) => {
              return (
                <Box
                  key={`empty-${day}`}
                  className={classes["activeCard"]}
                  px={rem(20)}
                  py={rem(8)}
                >
                  <List fs={rem(14)} c={"blue"} fw={500} spacing={"xs"}>
                    <List.Item>
                      Clone or download repository from GitHub
                    </List.Item>
                    <List.Item>Install dependencies with yarn</List.Item>
                    <List.Item>
                      To start development server run npm start command
                    </List.Item>
                    <List.Item>
                      Run tests to make sure your changes do not break the build
                    </List.Item>
                    <List.Item>
                      Submit a pull request once you are done
                    </List.Item>
                  </List>
                </Box>
              );
            })}
          </SimpleGrid>
        </Card.Section>
      </Card>
    </Flex>
  );
};

export default ShopCalendarSetting;
