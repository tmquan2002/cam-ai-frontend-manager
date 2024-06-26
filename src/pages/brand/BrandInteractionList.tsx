import {
  Box,
  Button,
  Center,
  Collapse,
  Group,
  Image,
  LoadingOverlay,
  Pagination,
  Paper,
  Select,
  Table,
  Text,
  Tooltip,
  rem
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter } from "@tabler/icons-react";
import dayjs from "dayjs";
import _ from "lodash";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetIncidentParams } from "../../apis/IncidentAPI";
import StatusBadge from "../../components/badge/StatusBadge";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { useGetIncidentList } from "../../hooks/useGetIncidentList";
import { useGetShopList } from "../../hooks/useGetShopList";
import { IncidentStatus, IncidentType } from "../../models/CamAIEnum";
import { DEFAULT_PAGE_SIZE, IMAGE_CONSTANT, PAGE_SIZE_SELECT } from "../../types/constant";
import classes from "./BrandInteractionList.module.scss";

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

const BrandInteractionList = () => {
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);
  const [activePage, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<string | null>(DEFAULT_PAGE_SIZE);

  const form = useForm<SearchIncidentField>({
    initialValues: {
      employeeId: null,
      fromTime: null,
      status: null,
      toTime: null,
      incidentType: IncidentType.Interaction,
      pageIndex: activePage - 1,
    },
  });

  const searchParams: GetIncidentParams = useMemo(() => {
    // console.log(form.values);

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
      size: Number(pageSize) ?? DEFAULT_PAGE_SIZE,
      pageIndex: activePage - 1,
    };
    sb = _.omitBy(sb, _.isNil) as GetIncidentParams;
    return sb;
  }, [
    activePage, pageSize,
    form.values.fromTime,
    form.values.incidentType,
    form.values.shopId,
  ]);

  const { data: incidentList, isLoading: isGetIncidentListLoading } = useGetIncidentList(searchParams);
  const { data: shopList, isLoading: isGetShopListLoading } = useGetShopList({ enabled: true, size: 999, });

  const fields = useMemo(() => {
    return [
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
    ];
  }, [form, shopList, isGetShopListLoading]);

  const rows = incidentList?.values?.map((row, index) => {
    return (
      <Table.Tr
        key={index}
        className={classes["clickable"]}
        onClick={() => navigate(`/brand/incident/${row?.id}`)}
      >
        <Table.Td>{index + 1 + Number(pageSize) * (activePage - 1)}</Table.Td>

        <Table.Td className={classes["pointer-style"]} c={"blue"}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/brand/shop/${row?.shopId}`);
          }}
        >
          <Tooltip label="View Shop" withArrow position="top-start">
            <Text>{row?.shop?.name}</Text>
          </Tooltip>
        </Table.Td>

        <Table.Td>{dayjs(row?.startTime).format("DD/MM/YYYY h:mm A")}</Table.Td>

        <Table.Td ta="center">
          <StatusBadge statusName={row?.status} size="sm" padding={10} />
        </Table.Td>

        {/* <Table.Td>
          {" "}
          {new Date(row?.startTime ?? "").getTime() - new Date().getTime() >
            0 ? (
            renderIncidentStatusBadge(IncidentStatus.New)
          ) : (
            <></>
          )}
        </Table.Td> */}
      </Table.Tr>
    );
  });

  return (
    <Paper p={rem(32)} m={rem(32)} shadow="xs">
      <Group align="center" justify="space-between" mb={"lg"}>
        <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
          Interaction list
        </Text>
        <Group>
          {form.isDirty() ? (
            <Button variant="transparent" ml={"auto"} onClick={form.reset}>
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
      <Collapse in={opened} mb={"lg"}>
        <EditAndUpdateForm fields={fields} />
      </Collapse>

      <Box pos={"relative"} mb={"lg"} pl={20} pr={20}>
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
          <Table.ScrollContainer minWidth={1000}>
            <Table striped highlightOnHover verticalSpacing={"md"}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th>Shop name</Table.Th>
                  <Table.Th>Time</Table.Th>
                  <Table.Th ta={"center"}>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Box>
      <Group justify="space-between" align="end">
        <Pagination
          value={activePage} onChange={setPage}
          total={Math.ceil(
            (incidentList?.totalCount ?? 0) / (Number(pageSize))
          )}
        />
        {!incidentList?.isValuesEmpty &&
          < Select
            label="Page Size"
            allowDeselect={false}
            placeholder="0"
            data={PAGE_SIZE_SELECT} defaultValue={DEFAULT_PAGE_SIZE}
            value={pageSize}
            onChange={(value) => {
              setPageSize(value)
              setPage(1)
            }}
          />
        }
      </Group>
    </Paper>
  );
};

export default BrandInteractionList;
