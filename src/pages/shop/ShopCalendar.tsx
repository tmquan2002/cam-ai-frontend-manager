import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  HoverCard,
  SimpleGrid,
  Text,
  rem,
} from "@mantine/core";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  startOfMonth,
} from "date-fns";
import { useMemo, useState } from "react";
import { NotificationColorPalette } from "../../types/constant";
import classes from "./ShopCalendar.module.scss";
import clsx from "clsx";
import { MonthPickerInput } from "@mantine/dates";
import { IconClock } from "@tabler/icons-react";
import { IconUser } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Event {
  date: Date;
  title: string;
}

interface ShopCalendarProps {
  events: Event[];
}

const renderShiftDetailCard = (
  startTime: string,
  endTime: string,
  employeeName: string,
  employeeEmail: string
) => {
  console.log(startTime, endTime, employeeName, employeeEmail);

  return (
    <>
      <Group gap={"sm"} mb={rem(4)}>
        <IconClock
          style={{
            width: rem(18),
            height: rem(18),
            color: "rgb(29 78 216)",
          }}
        />
        <Text c={"rgb(59, 130, 246)"} size={rem(14)} lh={rem(20)}>
          6.00 AM - 7.00 AM
        </Text>
      </Group>
      <Group gap={"sm"}>
        <IconUser
          style={{
            width: rem(18),
            height: rem(18),
            color: "rgb(29 78 216)",
          }}
        />
        <Text c={"rgb(29, 78, 216)"} size={rem(15)} lh={rem(24)} fw={600}>
          Paper is the - nqhuy.toan.cr@email.com
        </Text>
      </Group>
    </>
  );
};

const ShopCalendar = ({ events }: ShopCalendarProps) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth);
  const endDayIndex = getDay(lastDayOfMonth);

  const eventsByDate = useMemo(() => {
    return events.reduce((acc: { [key: string]: Event[] }, event) => {
      const dateKey = format(event.date, "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {});
  }, [events]);

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
            <Text size={rem(17)} fw={600}>
              {format(currentDate, "MMMM yyyy")}
            </Text>
            <Group align="center">
              <MonthPickerInput
                w={rem(160)}
                placeholder="Pick date"
                value={currentDate}
                onChange={(value) => {
                  setCurrentDate(value ?? new Date());
                }}
                style={{
                  fontWeight: 500,
                }}
                styles={{
                  label: {
                    fontWeight: 500,
                    fontSize: rem(14),
                    marginBottom: rem(8),
                  },
                }}
                radius={"md"}
              />
              <Divider orientation="vertical" mx={rem(8)} />
              <Button
                color="rgb(79, 70, 229)"
                c={"#fff"}
                radius={rem(8)}
                onClick={() => navigate("/shop/calendar/setting")}
              >
                Setting
              </Button>
            </Group>
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
            {Array.from({ length: startingDayIndex }).map((_, index) => {
              return (
                <Box
                  h={rem(120)}
                  key={`empty-${index}`}
                  style={{
                    borderBottom: "1px solid rgb(229, 231, 235)",
                    borderLeft: "1px solid rgb(229, 231, 235)",
                  }}
                  px={rem(12)}
                  py={rem(8)}
                  ta={"center"}
                />
              );
            })}
            {daysInMonth.map((day, index) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const todaysEvents = eventsByDate[dateKey] || [];

              return (
                <Box
                  key={index}
                  h={rem(120)}
                  py={rem(8)}
                  px={rem(12)}
                  className={
                    isToday(day)
                      ? clsx(classes.today, classes.activeCard)
                      : classes["activeCard"]
                  }
                  onClick={() => setSelectedDate(day)}
                >
                  <Text c={"rgb(55, 65, 81)"} size={rem(12)} lh={rem(24)}>
                    {format(day, "d")}
                  </Text>
                  {todaysEvents.map((event) => {
                    return (
                      <Box
                        key={event.title}
                        bg={NotificationColorPalette.UP_COMING}
                        style={{
                          borderRadius: rem(8),
                        }}
                      >
                        <Text c={"gray.9"}>{event.title}</Text>
                      </Box>
                    );
                  })}
                </Box>
              );
            })}

            {Array.from({ length: 6 - endDayIndex }).map((_, index) => {
              return (
                <Box
                  h={rem(120)}
                  key={`empty-${index}`}
                  style={{
                    borderBottom: "1px solid rgb(229, 231, 235)",
                    borderLeft: "1px solid rgb(229, 231, 235)",
                  }}
                  px={rem(12)}
                  py={rem(8)}
                  ta={"center"}
                />
              );
            })}
          </SimpleGrid>
        </Card.Section>
      </Card>
      <Card
        style={{
          borderRadius: rem(8),
          border: "1px solid rgb(229, 231, 235)",
        }}
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
            <Text size={rem(17)} fw={600} lh={rem(36)}>
              {selectedDate && format(selectedDate, "dd/MM/yyyy")}
            </Text>
          </Group>
        </Card.Section>

        <Card.Section px={rem(20)} pt={rem(100)} pb={rem(20)}>
          <Group gap={0}>
            <Grid gutter={0} align="center" columns={24} flex={1}>
              <Grid.Col span={4}>
                <HoverCard shadow="md" radius={"md"}>
                  <HoverCard.Target>
                    <Box className={classes["timelineWrapper"]}>
                      <Box className={classes["timelinePrimaryPoint"]}>
                        <Text
                          className={classes["timeLineNumber"]}
                          size={rem(12)}
                          fw={500}
                        >
                          11:11
                        </Text>
                        <Box className={classes["innerTimelinePrimaryPoint"]} />
                      </Box>
                      <Divider
                        className={classes["divider"]}
                        display={"flex"}
                        flex={1}
                      />
                    </Box>
                  </HoverCard.Target>
                  <HoverCard.Dropdown py={rem(18)}>
                    {renderShiftDetailCard("", "", "", "")}
                  </HoverCard.Dropdown>
                </HoverCard>
              </Grid.Col>

              <Grid.Col span={8}>
                <HoverCard shadow="md" radius={"md"}>
                  <HoverCard.Target>
                    <Box className={classes["timelineWrapper"]}>
                      <Box className={classes["timelineSecondaryPoint"]}>
                        <Text
                          className={classes["timeLineNumber"]}
                          size={rem(12)}
                          fw={500}
                        >
                          11:11
                        </Text>
                      </Box>
                      <Divider
                        className={classes["divider"]}
                        display={"flex"}
                        flex={1}
                      />
                    </Box>
                  </HoverCard.Target>
                  <HoverCard.Dropdown py={rem(18)}>
                    {renderShiftDetailCard("", "", "", "")}
                  </HoverCard.Dropdown>
                </HoverCard>
              </Grid.Col>

              <Grid.Col span={12}>
                <HoverCard shadow="md" radius={"md"}>
                  <HoverCard.Target>
                    <Box className={classes["timelineWrapper"]}>
                      <Box className={classes["timelineSecondaryPoint"]}>
                        <Text
                          className={classes["timeLineNumber"]}
                          size={rem(12)}
                          fw={500}
                        >
                          11:11
                        </Text>
                      </Box>
                      <Divider
                        className={classes["divider"]}
                        display={"flex"}
                        flex={1}
                      />
                    </Box>
                  </HoverCard.Target>
                  <HoverCard.Dropdown py={rem(18)}>
                    {renderShiftDetailCard("", "", "", "")}
                  </HoverCard.Dropdown>
                </HoverCard>
              </Grid.Col>
            </Grid>
            <Box className={classes["timelinePrimaryPoint"]} ml={rem(4)}>
              <Text
                className={classes["timeLineNumber"]}
                size={rem(12)}
                fw={500}
              >
                11:11
              </Text>
              <Box className={classes["innerTimelinePrimaryPoint"]} />
            </Box>
          </Group>
        </Card.Section>
      </Card>
    </Flex>
  );
};

export default ShopCalendar;
