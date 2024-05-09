import { LineChart } from "@mantine/charts";
import {
  Box,
  Card,
  Divider,
  Flex,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Text,
  rem,
  useComputedColorScheme,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCaretRight, IconTrendingUp } from "@tabler/icons-react";
import axios from "axios";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetShopListSelect } from "../../hooks/useGetShopList";
import { useGetPastReportByShop, useReportByShop } from "../../hooks/useReport";
import { ChartReportData } from "../../models/Report";
import {
  getDateFromSetYear,
  getDateTime,
  removeTime,
  returnWebsocketConnection,
} from "../../utils/helperFunction";
import classes from "./BrandReportPage.module.scss";

const BrandReportPage = () => {
  const navigate = useNavigate();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const [filterSearch, setFilterSearch] = useState("");
  const [filterSearchId, setFilterSearchId] = useState<string | null>("");
  const [date, setDate] = useState<Date | null>(new Date(2000, 0));

  const {
    data: shopListSelect,
    isLoading: isLoadingSelectShop,
    refetch: refetchSelectShop,
  } = useGetShopListSelect({ name: filterSearch || "", enabled: true });

  const { data, readyState, lastJsonMessage } = useReportByShop(
    filterSearchId || ""
  );
  const {
    data: pastReportList,
    isLoading: isLoadingPastReport,
    error,
    refetch: refetchPastReportList,
  } = useGetPastReportByShop({
    shopId: filterSearchId || "",
    date: date
      ? removeTime(date.toString(), "-", "yyyy/MM/dd")
      : removeTime("01/01/2000", "-", "yyyy/MM/dd"),
  });

  useEffect(() => {
    refetchSelectShop();
  }, [setFilterSearchId]);

  useEffect(() => {
    refetchPastReportList();
  }, [setFilterSearchId, date]);

  // Right data render
  const renderContent = ({ Time, Total }: ChartReportData, id: number) => {
    return (
      <Card
        withBorder
        padding="lg"
        key={id}
        className={classes.main_container}
        w={rem(400)}
        p="md"
        onClick={() => navigate(`/shop/incident/${id}`)}
      >
        <Group justify="space-between" align="center" mb={"md"}>
          <Text fw={500}> {Time}</Text>
          <IconCaretRight
            style={{ width: "20px", height: "20px" }}
            color={computedColorScheme == "dark" ? "#5787db" : "#39588f"}
          />
        </Group>
        <Card.Section className={classes.card_footer}>
          <div>
            <Text size="xs" color="dimmed">
              Total
            </Text>
            <Text fw={500} size="sm">
              {Total}
            </Text>
          </div>
          <div>
            <Text size="xs" color="dimmed">
              Variation
            </Text>
            <Flex align={"center"}>
              <Text fw={500} size="sm" pr={5}>
                12
              </Text>
              <IconTrendingUp
                style={{ width: "30%", height: "30%" }}
                color={computedColorScheme == "dark" ? "#45b445" : "green"}
              />
            </Flex>
          </div>
          <div>
            <Text size="xs" color="dimmed">
              Time
            </Text>
            <Text fw={500} size="sm">
              {Time}
            </Text>
          </div>
        </Card.Section>
      </Card>
    );
  };

  // Left data
  return (
    <Box pb={rem(40)}>
      <Text
        size="lg"
        fw={"bold"}
        fz={25}
        c={"light-blue.4"}
        ml={rem(40)}
        my={rem(20)}
      >
        REPORTS
      </Text>
      <Group m={20} ml={rem(40)} my={rem(20)}>
        <Select
          data={shopListSelect || []}
          limit={5}
          size="sm"
          label="Shop"
          rightSection={isLoadingSelectShop ? <Loader size={16} /> : null}
          nothingFoundMessage={shopListSelect && "Not Found"}
          value={filterSearchId}
          placeholder="Pick value"
          clearable
          searchable
          searchValue={filterSearch}
          onSearchChange={(value) => setFilterSearch(value)}
          onChange={(value) => setFilterSearchId(value)}
        />
        <DateInput
          label="Date"
          value={date}
          onChange={setDate}
          placeholder="January 1, 2000"
          maxDate={getDateFromSetYear(18)}
        />
      </Group>

      <Flex>
        <Box flex={1}>
          <Paper mx={rem(40)} shadow="xs" px={rem(32)} py={rem(20)}>
            <Text fw={500} size={rem(18)} mb={rem(20)}>
              Live Footage
            </Text>
            <Divider color="#acacac" mb={rem(20)} />
          </Paper>

          <Paper mx={rem(40)} shadow="xs" px={rem(32)} py={rem(20)}>
            <Text fw={500} size={rem(18)} mb={rem(20)}>
              Live Count
            </Text>
            <Divider color="#acacac" mb={rem(20)} />
            <Box mb={rem(20)}>
              <Text mt={20} size="sm">
                <b>Connection status: </b>
                {returnWebsocketConnection(readyState)}
              </Text>
              <Text mt={10} size="sm">
                <b>Last update: </b>
                {lastJsonMessage ? getDateTime(lastJsonMessage.Time) : "None"}
              </Text>
              <LineChart
                h={300}
                data={data}
                dataKey="Time"
                py={rem(40)}
                series={[{ name: "Total", color: "light-blue.6" }]}
              />
            </Box>
          </Paper>
        </Box>

        {/* Right data default and error */}
        <ScrollArea h={"80vh"} className={classes.scroll_area} mr={rem(40)}>
          {isEmpty(filterSearchId) && (
            <Box className={classes.main_container} w={rem(400)} p="md">
              <Text fw={500}>Please choose a shop</Text>
            </Box>
          )}

          {isLoadingPastReport && !isEmpty(filterSearchId) ? (
            <Box className={classes.main_container} w={rem(400)} p="md">
              <Loader />
            </Box>
          ) : (
            <Stack gap={"lg"}>
              {pastReportList?.values?.map((item, id) =>
                renderContent(item, id)
              )}
            </Stack>
          )}

          {error && !isLoadingPastReport && !isEmpty(filterSearchId) && (
            <Stack>
              <Card
                withBorder
                padding="lg"
                className={classes.main_container}
                w={rem(400)}
                p="md"
              >
                <Group justify="center" align="center">
                  <Text fw={500}>
                    {axios.isAxiosError(error)
                      ? `No data found from date ${
                          date
                            ? removeTime(date.toString(), "/", "dd/MM/yyyy")
                            : removeTime("01/01/2000", "/", "dd/MM/yyyy")
                        }`
                      : `There's an error fetching data`}
                  </Text>
                </Group>
              </Card>
            </Stack>
          )}
        </ScrollArea>
      </Flex>
    </Box>
  );
};

export default BrandReportPage;
