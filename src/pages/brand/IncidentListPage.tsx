import { useNavigate } from "react-router-dom";
import { useGetIncidentList } from "../../hooks/useGetIncidentList";
import {
  Badge,
  Box,
  Button,
  Center,
  Collapse,
  Group,
  Image,
  LoadingOverlay,
  Pagination,
  Paper,
  Table,
  Text,
  rem,
} from "@mantine/core";
import { useMemo, useState } from "react";
import { IMAGE_CONSTANT } from "../../types/constant";
import classes from "./IncidentListPage.module.scss";
import { IncidentStatus, IncidentType } from "../../models/CamAIEnum";
import { IconFilter } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { mapLookupToArray } from "../../utils/helperFunction";
import { useForm } from "@mantine/form";
import { useGetEmployeeList } from "../../hooks/useGetEmployeeList";
import { GetIncidentParams } from "../../apis/IncidentAPI";
import dayjs from "dayjs";
import _ from "lodash";
import { useGetShopList } from "../../hooks/useGetShopList";

type SearchIncidentField = {
  incidentType?: IncidentType | null;
  fromTime?: Date | null;
  toTime?: Date | null;
  edgeBoxId?: string;
  status?: IncidentStatus | null;
  shopId?: string;
  brandId?: string;
  employeeId?: string | null;
  size?: number;
  pageIndex?: number;
};

const IncidentListPage = () => {
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);

  const [activePage, setPage] = useState(1);

  const form = useForm<SearchIncidentField>({
    initialValues: {
      employeeId: null,
      fromTime: null,
      status: null,
      toTime: null,
      incidentType: null,
      size: 12,
      pageIndex: activePage - 1,
    },
  });

  const searchParams: GetIncidentParams = useMemo(() => {
    let sb: GetIncidentParams = {
      employeeId: form.values.employeeId,
      shopId: form.values.shopId,
      fromTime: form.values.fromTime
        ? dayjs(form.values.fromTime).format("YYYY-MM-DDTHH:mm:ss")
        : undefined,
      toTime: form.values.toTime
        ? dayjs(form.values.toTime).format("YYYY-MM-DDTHH:mm:ss")
        : undefined,
      status: form.values.status,
      incidentType: form.values.incidentType,
      size: 12,
      pageIndex: activePage - 1,
    };
    sb = _.omitBy(sb, _.isNil) as GetIncidentParams;
    return sb;
  }, [
    activePage,
    form.values.employeeId,
    form.values.fromTime,
    form.values.incidentType,
    form.values.status,
    form.values.toTime,
    form.values.shopId,
  ]);

  const { data: incidentList, isLoading: isGetIncidentListLoading } =
    useGetIncidentList(searchParams);

  const { data: employeeList, isLoading: isGetEmployeeListLoading } =
    useGetEmployeeList({});

  const { data: shopList, isLoading: isGetShopListLoading } = useGetShopList({
    enabled: true,
    size: 999,
  });

  const fields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.DATE_TIME,
        fieldProps: {
          form,
          name: "fromTime",
          placeholder: "Start date",
          label: "Start date",
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.DATE_TIME,
        fieldProps: {
          form,
          name: "toTime",
          placeholder: "End date",
          label: "End date",
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Employee",
          placeholder: "Employee",
          data: employeeList?.values?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form,
          name: "employeeId",
          loading: isGetEmployeeListLoading,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Shop",
          placeholder: "Shop",
          data: shopList?.values?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form,
          name: "shopId",
          loading: isGetShopListLoading,
        },
        spans: 4,
      },

      {
        type: FIELD_TYPES.RADIO,
        fieldProps: {
          form,
          name: "status",
          placeholder: "Incident status",
          label: "Incident status",
          data: mapLookupToArray(IncidentStatus ?? {}),
        },
        spans: 3,
      },
      {
        type: FIELD_TYPES.RADIO,
        fieldProps: {
          form,
          name: "incidentType",
          placeholder: "Incident type",
          label: "Incident type",
          data: mapLookupToArray(IncidentType ?? {}),
        },
        spans: 2,
      },
    ];
  }, [
    employeeList?.values,
    form,
    isGetEmployeeListLoading,
    shopList,
    isGetShopListLoading,
  ]);

  const renderIncidentStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case IncidentStatus.New:
        return <Badge color="yellow">{IncidentStatus.New}</Badge>;
      case IncidentStatus.Accepted:
        return <Badge color="green">{IncidentStatus.Accepted}</Badge>;
      case IncidentStatus.Rejected:
        return <Badge color="red">{IncidentStatus.Rejected}</Badge>;
    }
  };

  const rows = incidentList?.values.map((row, index) => {
    return (
      <Table.Tr
        key={index}
        className={classes["clickable"]}
        onClick={() => navigate(`/brand/incident/${row?.id}`)}
      >
        <Table.Td>
          <Text>{row?.incidentType}</Text>
        </Table.Td>
        <Table.Td
          className={classes["pointer-style"]}
          c={"blue"}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/brand/shop/${row?.shopId}`);
          }}
        >
          <Text>{row?.shop?.name}</Text>
        </Table.Td>
        <Table.Td>{dayjs(row?.time).format("DD/MM/YYYY h:mm A")}</Table.Td>
        <Table.Td>
          <Text
            className={classes["pointer-style"]}
            c={"blue"}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/brand/employee/${row?.employee?.id}`);
            }}
          >
            {row?.employee?.name}
          </Text>
        </Table.Td>

        <Table.Td>{renderIncidentStatusBadge(row?.status)}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Paper
      p={rem(32)}
      m={rem(32)}
      shadow="xs"
    >
      <Group
        align="center"
        justify="space-between"
        mb={"lg"}
      >
        <Text
          size="lg"
          fw={"bold"}
          fz={25}
          c={"light-blue.4"}
        >
          Incident list
        </Text>
        <Group>
          {form.isDirty() ? (
            <Button
              variant="transparent"
              ml={"auto"}
              onClick={form.reset}
            >
              Clear all filter
            </Button>
          ) : (
            <></>
          )}

          <Button
            leftSection={<IconFilter size={14} />}
            variant="default"
            className={classes.filter_button}
            onClick={toggle}
          >
            Filter
          </Button>
        </Group>
      </Group>
      <Collapse
        in={opened}
        mb={"lg"}
      >
        <EditAndUpdateForm fields={fields} />
      </Collapse>

      <Box
        pos={"relative"}
        mb={"lg"}
      >
        <LoadingOverlay
          visible={isGetIncidentListLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 1 }}
        />
        {incidentList?.isValuesEmpty ? (
          <Center>
            <Image
              radius={"md"}
              src={IMAGE_CONSTANT.NO_DATA}
              fit="contain"
              h={rem(400)}
              w={"auto"}
              mt={rem(20)}
              style={{
                borderBottom: "1px solid #dee2e6",
              }}
            />
          </Center>
        ) : (
          <Table
            striped
            highlightOnHover
            withTableBorder
            withColumnBorders
            verticalSpacing={"md"}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Incident type</Table.Th>
                <Table.Th>Shop name</Table.Th>
                <Table.Th>Time</Table.Th>
                <Table.Th>Assigned to</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        )}
      </Box>
      <Group justify="flex-end">
        <Pagination
          value={activePage}
          onChange={setPage}
          total={Math.ceil((incidentList?.totalCount ?? 0) / 12)}
        />
      </Group>
    </Paper>
  );
};

export default IncidentListPage;