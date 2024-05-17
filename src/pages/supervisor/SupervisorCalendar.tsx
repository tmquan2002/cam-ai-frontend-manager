import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  SimpleGrid,
  Text,
  rem,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import clsx from "clsx";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  startOfMonth,
} from "date-fns";
import dayjs from "dayjs";
import { useState } from "react";
import classes from "./SupervisorCalendar.module.scss";
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const SupervisorCalendar = () => {
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
  return (
    <Flex
      px={rem(60)}
      pt={rem(40)}
      bg={"#fff"}
      flex={1}
      pb={rem(40)}
      direction={"column"}
    >
      <Group align="flex-start" gap={rem(60)}>
        <Box flex={5}></Box>
        <Box flex={3}>
          <Box pb={rem(4)}>
            <Group justify="space-between" align="center">
              <Text size={rem(17)} fw={600}>
                {format(currentDate, "MMMM yyy")}
              </Text>

              <Group gap={rem(4)}>
                <ActionIcon
                  variant="subtle"
                  aria-label="Settings"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setCurrentDate(newDate);
                  }}
                >
                  <IconChevronLeft color="rgb(107, 114, 128" />
                </ActionIcon>
                <Button
                  variant="subtle"
                  color="#000"
                  onClick={() => {
                    setCurrentDate(new Date());
                    setSelectedDate(new Date());
                  }}
                >
                  <Text size={rem(16)} fw={600}>
                    Today
                  </Text>
                </Button>

                <ActionIcon
                  variant="subtle"
                  aria-label="Settings"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setCurrentDate(newDate);
                  }}
                >
                  <IconChevronRight color="rgb(107, 114, 128" />
                </ActionIcon>
              </Group>
            </Group>
          </Box>

          <Box>
            <SimpleGrid cols={7} spacing={0} style={{}}>
              {WEEKDAYS.map((day, i) => {
                return (
                  <Box py={rem(8)} key={day + i}>
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
            </SimpleGrid>
            <SimpleGrid
              cols={7}
              spacing={0}
              style={{
                borderRadius: rem(10),
                overflow: "hidden",
                borderTop: "1px solid #ccc",
                borderRight: "1px solid #ccc",
              }}
            >
              {Array.from({ length: startingDayIndex }).map((_, index) => {
                return (
                  <Box
                    key={`empty-${index}`}
                    style={{
                      borderBottom: "1px solid #ccc",
                      borderLeft: "1px solid #ccc",
                    }}
                    py={rem(8)}
                    ta={"center"}
                  />
                );
              })}
              {daysInMonth.map((day, index) => {
                return (
                  <Box
                    key={index}
                    py={rem(12)}
                    ta={"center"}
                    className={
                      isToday(day)
                        ? clsx(classes.today, classes.activeCard)
                        : dayjs(day).isSame(selectedDate, "day")
                        ? clsx(classes.selectedDay, classes.activeCard)
                        : classes["activeCard"]
                    }
                    onClick={() => setSelectedDate(day)}
                  >
                    <Text c={"rgb(55, 65, 81)"} size={rem(12)} lh={rem(48)}>
                      {format(day, "d")}
                    </Text>
                  </Box>
                );
              })}

              {Array.from({ length: 6 - endDayIndex }).map((_, index) => {
                return (
                  <Box
                    key={`empty-${index}`}
                    style={{
                      borderBottom: "1px solid #ccc",
                      borderLeft: "1px solid #ccc",
                    }}
                    py={rem(8)}
                    ta={"center"}
                  />
                );
              })}
            </SimpleGrid>
          </Box>
        </Box>
      </Group>
    </Flex>
  );
};

export default SupervisorCalendar;
