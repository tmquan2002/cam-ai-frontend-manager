import { Box, Card, Group, Select, Skeleton, Text, rem } from "@mantine/core";
import { useGetIncidentReportByTime } from "../../../../hooks/useGetIncidentReportByTime";
import { ReportInterval } from "../../../../models/CamAIEnum";
import { LineChart } from "@mantine/charts";
import { useMemo } from "react";
import dayjs from "dayjs";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../../../components/form/EditAndUpdateForm";
import { useForm } from "@mantine/form";
import { GetIncidentReportByTimeParams } from "../../../../apis/IncidentAPI";
import _ from "lodash";
import NoImage from "../../../../components/image/NoImage";

type SearchIncidentField = {
  startDate?: Date;
  toDate?: Date;
  interval: ReportInterval;
};

const TimeIncidentReport = () => {
  const form = useForm<SearchIncidentField>({
    validateInputOnChange: true,
    initialValues: {
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
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
        };
        sb = _.omitBy(sb, _.isNil) as GetIncidentReportByTimeParams & {
          enabled: boolean;
        };
        return sb;
      } else {
        return {
          enabled: true,
          interval: form.values.interval,
        };
      }
    }, [form.values.interval, form.values.startDate, form.values.toDate]);

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
        time: dayjs(item.time).format("HH:mm DD-MM-YYYY"),
        count: item.count,
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
              key: ReportInterval.HalfHour,
              value: ReportInterval.HalfHour,
            },
            {
              key: ReportInterval.Hour,
              value: ReportInterval.Hour,
            },
            {
              key: ReportInterval.HalfDay,
              value: ReportInterval.HalfDay,
            },
            {
              key: ReportInterval.Day,
              value: ReportInterval.Day,
            },
            {
              key: ReportInterval.Week,
              value: ReportInterval.Week,
            },
          ],
        },
        spans: 4,
      },
    ];
  }, [form]);

  return (
    <Skeleton visible={isGetIncidentReportByTimeDataLoading}>
      <Card shadow="md" pb={rem(40)}>
        <Card.Section withBorder inheritPadding mb={rem(32)}>
          <Group justify="flex-end" my={rem(20)}>
            <Group>
              <Text size="md" fw={500}>
                Filter
              </Text>
              <Box miw={rem(360)}>
                <EditAndUpdateForm fields={fields} />
              </Box>
            </Group>
          </Group>
        </Card.Section>

        {!incidentReportByTimeData ||
        incidentReportByTimeData?.data?.length == 0 ? (
          <NoImage />
        ) : (
          <LineChart
            h={300}
            w={"100%"}
            data={data ?? []}
            dataKey="time"
            series={[{ name: "count", color: "teal.6" }]}
            curveType="linear"
          />
        )}
      </Card>
    </Skeleton>
  );
};

export default TimeIncidentReport;
