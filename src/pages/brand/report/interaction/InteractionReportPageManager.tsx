import { Box, Card, Group, Loader, Select, Text, rem, useComputedColorScheme } from "@mantine/core";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

import { Line } from "react-chartjs-2";
import { IncidentType, ReportInterval } from "../../../../models/CamAIEnum";
import NoImage from "../../../../components/image/NoImage";
import { useForm } from "@mantine/form";
import { GetIncidentReportByTimeParams } from "../../../../apis/IncidentAPI";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import _ from "lodash";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../../../components/form/EditAndUpdateForm";
import { useGetIncidentReportByTime } from "../../../../hooks/useGetIncidentReportByTime";
import { useGetShopList } from "../../../../hooks/useGetShopList";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);
type SearchIncidentField = {
  startDate?: Date;
  toDate?: Date;
  interval: ReportInterval;
};
const InteractionReportPageManager = () => {
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const { data: shopList, isLoading: isGetShopListLoading } = useGetShopList({
    enabled: true,
    size: 999,
  });

  const [selectedShop, setSelectedShop] = useState<string | null>(null);

  const form = useForm<SearchIncidentField>({
    validateInputOnChange: true,
    initialValues: {
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      toDate: new Date(),
      interval: ReportInterval.HalfHour,
    },
    validate: (values) => ({
      toDate:
        values.startDate &&
          values?.toDate &&
          values?.toDate?.getTime() < values?.startDate?.getTime()
          ? "End date must be after start date"
          : null,
      fromTime:
        values.toDate &&
          values?.startDate &&
          values?.toDate?.getTime() < values?.startDate?.getTime()
          ? "Start date must be before end date"
          : null,
    }),
  });

  const searchParams: GetIncidentReportByTimeParams & { enabled: boolean } =
    useMemo(() => {
      if (form.isValid() && form.values.startDate && form.values.toDate) {
        let sb: GetIncidentReportByTimeParams & { enabled: boolean } = {
          startDate: form.values.startDate
            ? dayjs(form.values.startDate).format("YYYY-MM-DD")
            : undefined,
          endDate: form.values.toDate
            ? dayjs(form.values.toDate).format("YYYY-MM-DD")
            : undefined,
          interval: form.values.interval,
          enabled: true,
          type: IncidentType.Interaction,
          shopId: selectedShop ?? undefined,
        };
        sb = _.omitBy(sb, _.isNil) as GetIncidentReportByTimeParams & {
          enabled: boolean;
        };
        return sb;
      } else {
        return {
          enabled: true,
          interval: form.values.interval,
          type: IncidentType.Interaction,
          shopId: selectedShop ?? undefined,
        };
      }
    }, [
      form.values.interval,
      form.values.startDate,
      form.values.toDate,
      selectedShop,
    ]);

  const {
    data: incidentReportByTimeData,
    isLoading: isGetIncidentReportByTimeDataLoading,
  } = useGetIncidentReportByTime(searchParams);

  const data = useMemo(() => {
    if (isGetIncidentReportByTimeDataLoading) {
      return [];
    }
    return incidentReportByTimeData?.data.map((item) => {
      return {
        time: dayjs(item.time).format("HH:mm | DD-MM"),
        count: item.count,
        avarageDuration: item?.averageDuration,
      };
    });
  }, [incidentReportByTimeData]);

  const fields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.DATE,
        fieldProps: {
          form,
          name: "startDate",
          placeholder: "Start date",
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.DATE,
        fieldProps: {
          form,
          name: "toDate",
          placeholder: "End date",
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          form,
          name: "interval",
          placeholder: "Interval",
          data: [
            {
              value: ReportInterval.HalfHour,
              label: "30 minutes",
            },
            {
              value: ReportInterval.Hour,
              label: "1 hour",
            },
            {
              value: ReportInterval.HalfDay,
              label: "12 hours",
            },
            {
              value: ReportInterval.Day,
              label: "1 day",
            },
            {
              value: ReportInterval.Week,
              label: "1 week",
            },
          ],
        },
        spans: 4,
      },
    ];
  }, [form]);

  return (
    <Box px={rem(40)} flex={1} pt={rem(20)}
      bg={computedColorScheme == "light" ? "#f6f8fc" : "#1a1a1a"}>
      <Group align="center" my={rem(20)} justify="space-between">
        <Text size="lg" fw={"bold"} fz={22} c={"light-blue.4"}>
          Interaction Report
        </Text>
        {isGetShopListLoading ? (
          <Loader />
        ) : (
          <Select
            value={selectedShop}
            onChange={setSelectedShop}
            size="sm"
            radius={rem(8)}
            w={rem(320)}
            style={{
              fontWeight: 500,
            }}
            styles={{
              dropdown: {
                fontWeight: 500,
              },
            }}
            data={
              shopList
                ? shopList?.values.map((item) => {
                  return {
                    value: item?.id,
                    label: item?.name,
                  };
                })
                : []
            }
            placeholder={"Select a shop"}
          />
        )}
      </Group>

      <Card shadow="xs" pb={rem(20)}
        bg={computedColorScheme == "light" ? "white" : "#242424"}>
        <Card.Section withBorder inheritPadding mb={rem(16)}>
          <Group justify="space-between" my={rem(20)} mx={rem(32)}>
            <Text size="lg" fw={500}>
              Interaction count indicators
            </Text>
            {!selectedShop ? (
              <></>
            ) : (
              <Group>
                <Text size="md" fw={500}>
                  Filter
                </Text>

                <Box miw={rem(360)}>
                  <EditAndUpdateForm fields={fields} />
                </Box>
              </Group>
            )}
          </Group>
        </Card.Section>

        {!selectedShop ? (
          <Text size="md" fw={500} ta="center">
            No Shop Selected
          </Text>
        ) : !incidentReportByTimeData ||
          incidentReportByTimeData?.data?.length == 0 ? (
          <NoImage type="NO_DATA" />
        ) : (
          <Box
            style={{
              width: "100%",
              maxWidth: "100%",
              height: "640px",
              overflowX: "scroll",
            }}
          >
            <Box
              style={
                data && data?.length > 7
                  ? {
                    width: `${1500 + (data?.length - 7) * 30}px`,
                    height: "600px",
                  }
                  : {
                    height: "600px",
                  }
              }
            >
              <Line
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                  plugins: {
                    title: {
                      display: true,
                    },
                  },
                }}
                data={{
                  labels: data?.map((i) => i.time),
                  datasets: [
                    {
                      label: "Total interactions",
                      data: data?.map((i) => i.count),
                      borderColor: "rgb(255, 99, 132)",
                      backgroundColor: "rgba(255, 99, 132, 0.5)",
                    },
                    {
                      label: "Average duration ",
                      data: data?.map((i) => i.avarageDuration),
                      borderColor: "rgb(37, 150, 190)",
                      backgroundColor: "rgb(37, 150, 190, 0.5)",
                    },
                  ],
                }}
              ></Line>
            </Box>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default InteractionReportPageManager;
