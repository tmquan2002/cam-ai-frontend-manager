import { Accordion, ActionIcon, Badge, Box, Button, Center, Collapse, Flex, Group, Image, Input, Loader, LoadingOverlay, Paper, ScrollArea, Skeleton, Stack, Table, Text, Tooltip, rem } from "@mantine/core";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCaretRight, IconMail, IconMapPin, IconRepeat, IconTrash, IconUser, IconVideo, IconX, } from "@tabler/icons-react";
import { AxiosError } from "axios";
import clsx from "clsx";
import _, { isEmpty } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateShopParams } from "../../apis/ShopAPI";
import BackButton from "../../components/button/BackButton";
import { EdgeBoxInstallDetailComp } from "../../components/edgeBoxInstall/EdgeBoxInstallDetailComp";
import { EdgeBoxInstallEmpty } from "../../components/edgeBoxInstall/EdgeBoxInstallEmpty";
import EditAndUpdateForm, { FIELD_TYPES, } from "../../components/form/EditAndUpdateForm";
import NoImage from "../../components/image/NoImage";
import { useActiveEdgeBoxByShopId } from "../../hooks/useActiveEdgeboxByShopId";
import { useChangeShopStatus } from "../../hooks/useChangeShopStatus";
import { useGetAccountList } from "../../hooks/useGetAccounts";
import { useGetCameraListByShopId } from "../../hooks/useGetCameraListByShopId";
import { useGetDistrictList } from "../../hooks/useGetDistrictList";
import { useGetEdgeBoxInstallByShopId } from "../../hooks/useGetEdgeBoxInstallByShopId";
import { useGetEmployeeList } from "../../hooks/useGetEmployeeList";
import { useGetProvinceList } from "../../hooks/useGetProvinceList";
import { useGetShopById } from "../../hooks/useGetShopById";
import { useGetWardList } from "../../hooks/useGetWardList";
import { useUpdateShopById } from "../../hooks/useUpdateShopById";
import { CameraStatus, EdgeBoxActivationStatus, EdgeboxInstallStatus, ShopStatus } from "../../models/CamAIEnum";
import { ResponseErrorDetail } from "../../models/Response";
import { IMAGE_CONSTANT, phoneRegex } from "../../types/constant";
import { replaceIfNun } from "../../utils/helperFunction";
import classes from "./ShopDetailPageManager.module.scss";

export type FormFieldValue = {
  name: string;
  phone: string;
  province: string | null;
  district: string | null;
  wardId: string | null;
  addressLine: string;
  brandName: string;
  openTime: string;
  closeTime: string;
};

export type ActivationFormValue = {
  activationCode: string;
};

const ShopDetailPageManager = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [opened, { toggle }] = useDisclosure(false);
  const { data: employeeList, isLoading: isGetEmployeeListLoading } =
    useGetEmployeeList({ shopId: id });

  const { data: cameraList, isLoading: isGetCameraListLoading } =
    useGetCameraListByShopId(id);

  const { mutate: changeShopStatus, isLoading: isChangeShopStatusLoading } =
    useChangeShopStatus();

  const {
    data: edgeBoxInstallList,
    isLoading: isEdgeboxInstallListLoading,
    refetch: refetchEdgeBoxInstallList,
  } = useGetEdgeBoxInstallByShopId(id ?? "");

  const rows = employeeList?.values?.map((row) => (
    <Table.Tr
      style={{
        cursor: "pointer",
      }}
      key={row.id}
      onClick={() => navigate(`/brand/employee/${row.id}`)}
    >
      <Table.Td>{replaceIfNun(row.name)}</Table.Td>
      <Table.Td>{replaceIfNun(row.email)}</Table.Td>
      <Table.Td>{replaceIfNun(row.phone)}</Table.Td>
      <Table.Td>{replaceIfNun(row.birthday)}</Table.Td>
      <Table.Td>{replaceIfNun(row.gender)}</Table.Td>
      <Table.Td>{replaceIfNun(row.addressLine)}</Table.Td>
      <Table.Td>
        {_.isEqual(row.employeeStatus, "Active") ? (
          <Badge variant="light">Active</Badge>
        ) : (
          <Badge color="gray" variant="light">
            Disabled
          </Badge>
        )}
      </Table.Td>
    </Table.Tr>
  ));
  const form = useForm<FormFieldValue>({
    validate: {
      name: hasLength(
        { min: 2, max: 50 },
        "Shop name must be 1- 50 characters long"
      ),
      phone: (value) => isEmpty(value) ? null :
        phoneRegex.test(value) ? null : "A phone number should have a length of 10-12 characters",
      addressLine: isNotEmpty("Address should not be empty"),
      wardId: isNotEmpty("Please select ward"),
      province: isNotEmpty("Provice is required"),
      district: isNotEmpty("District is required"),
      openTime: isNotEmpty("Open time is required"),
      closeTime: isNotEmpty("Close time is required"),
    },
  });
  const activationForm = useForm<ActivationFormValue>();

  const { data, isLoading, refetch } = useGetShopById(id ?? "0");
  const {
    data: accountList,
    isLoading: isAccountListLoading,
    refetch: refetchAccountList,
  } = useGetAccountList({
    size: 999,
  });
  const { data: provinces, isLoading: isProvicesLoading } =
    useGetProvinceList();
  const { data: districts, isLoading: isDistrictsLoading } = useGetDistrictList(
    +(form.values.province ?? 0)
  );
  const { data: wards, isLoading: isWardsLoading } = useGetWardList(
    +(form.values.district ?? 0)
  );
  const { mutate: updateShop, isLoading: updateShopLoading } =
    useUpdateShopById();
  const { mutate: updateShopManager, isLoading: updateShopManagerLoading } =
    useUpdateShopById();

  const { mutate: activeEdgeBox, isLoading: isActiveEdgeBoxLoading } =
    useActiveEdgeBoxByShopId();

  const handleToggleShopStatus = (currentStatus: ShopStatus) => {
    changeShopStatus(
      {
        shopId: id ?? "",
        status:
          currentStatus == ShopStatus.Active
            ? ShopStatus.Inactive
            : ShopStatus.Active,
      },
      {
        onSuccess() {
          notifications.show({
            title: "Successfully",
            message: "Update shop successfully!",
          });
          refetch();
        },
        onError(data) {
          const error = data as AxiosError<ResponseErrorDetail>;
          notifications.show({
            color: "red",
            title: "Failed",
            message: error.response?.data?.message,
          });
        },
      }
    );
  };

  const openModal = (currentStatus: ShopStatus) =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          Do you really want to{" "}
          {currentStatus == ShopStatus.Active ? "Disable" : "Enable"} this shop!
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => { },
      onConfirm: () => handleToggleShopStatus(currentStatus),
    });

  const onAssignIncident = ({ activationCode }: ActivationFormValue) => {
    activeEdgeBox(
      { shopId: id ?? "", activationCode: activationCode },
      {
        onSuccess() {
          notifications.show({
            title: "Assign successfully",
            message: "EdgeBox assign success!",
          });
          refetchEdgeBoxInstallList();
        },
        onError(data) {
          const error = data as AxiosError<ResponseErrorDetail>;
          notifications.show({
            color: "red",
            icon: <IconX />,
            title: "Assign failed",
            message: error.response?.data?.message,
          });
        },
      }
    );
  };

  const accountListItem = accountList?.values.map((item) => (
    <Accordion.Item value={item.id} key={item.id}>
      <Accordion.Control disabled={item?.managingShop != null}>
        <Group wrap="nowrap">
          <div>
            <Text>{item.name}</Text>
            <Text size="sm" c="dimmed" fw={400}>
              {item.email}
            </Text>
          </div>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Group justify="flex-end">
          <Button
            loading={updateShopManagerLoading}
            disabled={data?.shopManager?.id == item?.id}
            onClick={() => {
              const params: UpdateShopParams = {
                shopId: id ?? "",
                addressLine: data?.addressLine ?? undefined,
                name: data?.name,
                phone: data?.phone ?? null,
                shopManagerId: item?.id,
                wardId: data?.wardId ? data?.wardId.toString() : undefined,
              };
              updateShopManager(params, {
                onSuccess() {
                  notifications.show({
                    title: "Assign account successfully",
                    message: "Shop updated!",
                  });
                  refetch();
                  refetchAccountList();
                  toggle();
                },
                onError(data) {
                  const error = data as AxiosError<ResponseErrorDetail>;
                  notifications.show({
                    color: "red",
                    icon: <IconX />,
                    title: "Update failed",
                    message: error.response?.data?.message,
                  });
                },
              });
            }}
          >
            Assign this account to shop
          </Button>
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  useEffect(() => {
    if (data) {
      const initialData: FormFieldValue = {
        name: data.name,
        phone: data?.phone ?? "",
        wardId: `${data.wardId}`,
        addressLine: data.addressLine,
        brandName: data.brand.name,
        province: `${data.ward.district.province.id}`,
        district: `${data.ward.district.id}`,
        openTime: data?.openTime,
        closeTime: data?.closeTime,
      };
      form.setInitialValues(initialData);
      form.reset();
    }
  }, [data]);

  const fields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
          name: "name",
          placeholder: "Shop name",
          label: "Shop name",
          required: true,
        },
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
          name: "phone",
          placeholder: "Shop phone",
          label: "Shop phone",
        },
      },

      {
        type: FIELD_TYPES.TIME,
        fieldProps: {
          form,
          name: "openTime",
          placeholder: "Open Time",
          label: "Open time",
          required: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.TIME,
        fieldProps: {
          form,
          name: "closeTime",
          placeholder: "Close Time",
          label: "Close time",
          required: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
          name: "brandName",
          placeholder: "Brand",
          label: "Brand",
          readonly: true,
        },
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Province",
          placeholder: "Province",
          data: provinces?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form,

          name: "province",
          loading: isProvicesLoading,
          required: true,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "District",
          placeholder: "District",
          data: districts?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form,
          name: "district",
          loading: isDistrictsLoading,
          required: true,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Ward",
          placeholder: "Ward",
          data: wards?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form,
          name: "wardId",
          loading: isWardsLoading,
          required: true,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
          name: "addressLine",
          placeholder: "Shop address",
          label: "Shop address",
          required: true,
        },
      },
    ];
  }, [
    form,
    provinces,
    districts,
    wards,
    isProvicesLoading,
    isDistrictsLoading,
    isWardsLoading,
  ]);

  let edgeBoxInstall = edgeBoxInstallList?.values.find(
    (x) => x.edgeBoxInstallStatus != EdgeboxInstallStatus.Disabled
  );

  return (
    <Box pb={20}>
      <Paper p={rem(32)} m={rem(32)} shadow="xs" pos="relative">
        <LoadingOverlay
          visible={isLoading || updateShopLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Box>
          <Group justify="space-between" pb={rem(20)}>
            <Group align="center">
              <BackButton />
              <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
                {data?.name}
              </Text>
              <Badge
                mt={rem(6)}
                color={data?.shopStatus == ShopStatus.Active ? "green" : "red"}
              >
                {data?.shopStatus}
              </Badge>
            </Group>

            {isChangeShopStatusLoading ? (
              <Loader />
            ) : (
              <ActionIcon
                color={data?.shopStatus == ShopStatus.Active ? "red" : "green"}
                onClick={() =>
                  openModal(data?.shopStatus ?? ShopStatus.Inactive)
                }
              >
                {data?.shopStatus == ShopStatus.Active ? (
                  <IconTrash style={{ width: rem(16), height: rem(16) }} />
                ) : (
                  <IconRepeat style={{ width: rem(16), height: rem(16) }} />
                )}
              </ActionIcon>
            )}
          </Group>
          <form
            onSubmit={form.onSubmit((values) => {
              const updateShopParams: UpdateShopParams = {
                shopId: data?.id ?? "0",
                addressLine: values.addressLine,
                wardId: values.wardId ?? "0",
                name: values.name,
                phone: values.phone == "" ? null : values.phone,
                openTime: values?.openTime,
                closeTime: values?.closeTime,
              };

              updateShop(updateShopParams, {
                onSuccess() {
                  notifications.show({
                    title: "Update successfully",
                    message: "Shop detail updated!",
                  });
                  refetch();
                },
                onError(data) {
                  const error = data as AxiosError<ResponseErrorDetail>;
                  notifications.show({
                    color: "red",
                    icon: <IconX />,
                    title: "Update failed",
                    message: error.response?.data?.message,
                  });
                },
              });
            })}
          >
            <EditAndUpdateForm fields={fields} />

            <Group justify="flex-end" mt="md">
              <Button disabled={!form.isDirty()} type="submit">
                Submit
              </Button>
            </Group>
          </form>
        </Box>
      </Paper>

      <Paper p={rem(32)} m={rem(32)} shadow="xs">
        <Group pb={rem(20)}>
          <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
            Shop manager
          </Text>
        </Group>

        {isAccountListLoading ? (
          <Loader />
        ) : (
          <Button
            onClick={toggle}
            rightSection={<IconCaretRight />}
            variant="light"
            fullWidth
            autoContrast
            justify="space-between"
            size="xl"
            px={rem(16)}
          >
            <Stack
              align="flex-start"
              justify="flex-start"
              gap={0}
              className={classes["pointer-style"]}
              onClick={() =>
                navigate(`/brand/account/${data?.shopManager?.id}`)
              }
            >
              {data?.shopManager ? (
                <>
                  <Group>
                    <IconUser className={classes.icon} />

                    <Text size="lg">{data?.shopManager?.name}</Text>
                  </Group>
                  <Group>
                    <IconMail className={classes.icon} />

                    <Text size="sm" c={"dimmed"} fw={400}>
                      {data?.shopManager?.email}
                    </Text>
                  </Group>
                </>
              ) : (
                <Text size="lg">Assign a shop manager to this shop</Text>
              )}
            </Stack>
          </Button>
        )}

        <Collapse in={opened}>
          <Accordion chevronPosition="right" variant="contained">
            {accountListItem}
          </Accordion>
        </Collapse>
      </Paper>

      <Paper p={rem(32)} m={rem(32)} shadow="xs">
        <Text size="lg" fw={"bold"} fz={25} mb={rem(20)} c={"light-blue.4"}>
          Camera list
        </Text>
        {isGetCameraListLoading ? (
          <Loader />
        ) : cameraList?.isValuesEmpty ? (
          <NoImage type="NO_DATA" />
        ) : (
          cameraList?.values?.map((item) => (
            <Tooltip label="View camera" key={item?.id}>
              <Button
                mb={rem(12)}
                variant="outline"
                fullWidth
                size={rem(52)}
                justify="space-between"
                onClick={() => {
                  if (item?.status != CameraStatus.Connected) {
                    notifications.show({
                      color: "red",
                      title: "Camera is disconnected",
                      message:
                        "Camera is disconnected, cannot view live stream",
                    });
                  } else {
                    navigate(`/brand/camera/${item?.id}`);
                  }
                }}
                rightSection={<IconCaretRight style={{ width: rem(24) }} />}
                px={rem(16)}
              >
                <Group>
                  <Group mr={rem(20)}>
                    <IconVideo style={{ width: rem(20) }} />
                    <Text key={item?.id}> {item?.name}</Text>
                  </Group>
                  <Group mr={rem(20)}>
                    <IconMapPin style={{ width: rem(20) }} />
                    <Text key={item?.id}> {item?.zone}</Text>
                  </Group>
                  <Group>
                    <IconAlertCircle style={{ width: rem(20) }} />
                    <Text key={item?.id}> {item?.status}</Text>
                  </Group>
                </Group>
              </Button>
            </Tooltip>
          ))
        )}
      </Paper>

      <Paper p={rem(32)} m={rem(32)} shadow="xs">
        <Flex pb={rem(20)} justify={"space-between "}>
          <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
            Employee
          </Text>
        </Flex>
        {isGetEmployeeListLoading ? (
          <Loader />
        ) : (
          <ScrollArea onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
            {employeeList?.isValuesEmpty ? (
              <Center>
                <Image
                  radius={"md"}
                  src={IMAGE_CONSTANT.NO_DATA}
                  fit="contain"
                  h={rem(400)}
                  w={"auto"}
                  style={{
                    borderBottom: "1px solid #dee2e6",
                  }}
                />
              </Center>
            ) : (
              <Table highlightOnHover verticalSpacing={"md"} striped>
                <Table.Thead
                  className={clsx(classes.header, {
                    [classes.scrolled]: scrolled,
                  })}
                >
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Phone</Table.Th>
                    <Table.Th>Birthday</Table.Th>
                    <Table.Th>Gender</Table.Th>
                    <Table.Th>Address</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            )}
          </ScrollArea>
        )}
      </Paper>
      <Skeleton visible={isEdgeboxInstallListLoading}>
        <Paper p={rem(32)} m={rem(32)} shadow="xs">
          <Group justify="space-between" align="center" pb={rem(20)} gap={"sm"}>
            <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
              Edge box
            </Text>
          </Group>

          {edgeBoxInstall ? (
            <>
              {edgeBoxInstall.activationStatus !=
                EdgeBoxActivationStatus.Activated && (
                <form onSubmit={activationForm.onSubmit(onAssignIncident)}>
                  <Group pb={rem(28)}>
                    <Input
                      style={{
                        flex: 1,
                      }}
                      {...activationForm.getInputProps("activationCode")}
                      placeholder="Enter an activation code here"
                    />
                    <Button
                      type="submit"
                      loading={isActiveEdgeBoxLoading}
                      disabled={!activationForm.isDirty()}
                    >
                      Confirm
                    </Button>
                  </Group>
                </form>
              )}
              <EdgeBoxInstallDetailComp edgeBoxInstall={edgeBoxInstall} />
            </>
          ) : (
            <EdgeBoxInstallEmpty />
          )}
        </Paper>
      </Skeleton>
    </Box>
  );
};

export default ShopDetailPageManager;
