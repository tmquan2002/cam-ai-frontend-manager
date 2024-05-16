import { ActionIcon, Box, Button, Center, Divider, Flex, Group, Image, Input, Loader, LoadingOverlay, Paper, Popover, ScrollArea, Select, Skeleton, Table, Tabs, Text, Tooltip, rem } from "@mantine/core";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCaretRight, IconFileAnalytics, IconMapPin, IconRepeat, IconRouter, IconTrash, IconUser, IconUsers, IconVideo, IconX } from "@tabler/icons-react";
import { AxiosError } from "axios";
import clsx from "clsx";
import { isEmpty } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { MdCalendarToday, MdEmail, MdHome, MdPhone } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateShopParams } from "../../apis/ShopAPI";
import StatusBadge from "../../components/badge/StatusBadge";
import CustomBreadcrumb, { BreadcrumbItem } from "../../components/breadcrumbs/CustomBreadcrumb";
import { EdgeBoxInstallDetailComp } from "../../components/edgeBoxInstall/EdgeBoxInstallDetailComp";
import { EdgeBoxInstallEmpty } from "../../components/edgeBoxInstall/EdgeBoxInstallEmpty";
import EditAndUpdateForm, { FIELD_TYPES, } from "../../components/form/EditAndUpdateForm";
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
import { IMAGE_CONSTANT, PHONE_REGEX } from "../../types/constant";
import { removeTime, replaceIfNun } from "../../utils/helperFunction";
import classes from "./ShopDetailPageManager.module.scss";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Shop",
    link: "/brand/shop"
  },
  {
    title: "Detail"
  }
]

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

export type AssignManagerFormField = {
  shopManagerId: string | null;
};

export type ActivationFormValue = {
  activationCode: string;
};


const ShopDetailPageManager = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [opened, { toggle }] = useDisclosure(false);
  const { data: employeeList, isLoading: isGetEmployeeListLoading } = useGetEmployeeList({ shopId: id });
  const { data: cameraList, isLoading: isGetCameraListLoading } = useGetCameraListByShopId(id);
  const { mutate: changeShopStatus, isLoading: isChangeShopStatusLoading } = useChangeShopStatus();
  const { data: edgeBoxInstallList, isLoading: isEdgeboxInstallListLoading, refetch: refetchEdgeBoxInstallList, } = useGetEdgeBoxInstallByShopId(id ?? "");

  const rows = employeeList?.values?.map((row, index) => (
    <Tooltip label="View Employee" key={row.id}>
      <Table.Tr
        style={{
          cursor: "pointer",
        }}
        onClick={() => navigate(`/brand/employee/${row.id}`)}
      >
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td>{replaceIfNun(row.name)}</Table.Td>
        <Table.Td>{replaceIfNun(row.email)}</Table.Td>
        <Table.Td>{replaceIfNun(row.phone)}</Table.Td>
        <Table.Td>{replaceIfNun(row.birthday)}</Table.Td>
        <Table.Td>{replaceIfNun(row.gender)}</Table.Td>
        <Table.Td>{replaceIfNun(row.addressLine)}</Table.Td>
        <Table.Td ta="center">
          <StatusBadge statusName={row.employeeStatus} size="sm" padding={10} />
        </Table.Td>
      </Table.Tr>
    </Tooltip>
  ));

  const activationForm = useForm<ActivationFormValue>();

  const { data, isLoading, refetch } = useGetShopById(id ?? "0");

  const form = useForm<FormFieldValue>({
    initialValues: {
      name: data?.name ?? "",
      phone: data?.phone ?? "",
      wardId: `${data?.wardId}`,
      addressLine: data?.addressLine ?? "",
      brandName: data?.brand?.name ?? "",
      province: `${data?.ward?.district?.province?.id}`,
      district: `${data?.ward?.district?.id}`,
      openTime: data?.openTime ?? "00:00:00",
      closeTime: data?.closeTime ?? "00:00:00",
    },
    validate: {
      name: hasLength(
        { min: 2, max: 50 },
        "Shop name must be 1- 50 characters long"
      ),
      phone: (value) => isEmpty(value) ? null :
        PHONE_REGEX.test(value) ? null : "A phone number should have a length of 10-12 characters",
      addressLine: isNotEmpty("Address should not be empty"),
      wardId: isNotEmpty("Please select ward"),
      province: isNotEmpty("Provice is required"),
      district: isNotEmpty("District is required"),
      openTime: isNotEmpty("Open time is required"),
      closeTime: isNotEmpty("Close time is required"),
    },
  });

  const assignManagerForm = useForm<AssignManagerFormField>({
    validate: {
      shopManagerId: isNotEmpty("Please select an employee to assign"),
    },
  });

  const { data: accountList, isLoading: isAccountListLoading, refetch: refetchAccountList, } = useGetAccountList({ size: 999, });
  const { data: provinces, isLoading: isProvicesLoading } = useGetProvinceList();
  const { data: districts, isLoading: isDistrictsLoading } = useGetDistrictList(+(form.values.province ?? 0));
  const { data: wards, isLoading: isWardsLoading } = useGetWardList(+(form.values.district ?? 0));
  const { mutate: updateShop, isLoading: updateShopLoading } = useUpdateShopById();
  const { mutate: updateShopManager, isLoading: updateShopManagerLoading } = useUpdateShopById();
  const { mutate: activeEdgeBox, isLoading: isActiveEdgeBoxLoading } = useActiveEdgeBoxByShopId();

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
            title: "Success",
            message: "Activate Edge Box successfully!",
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

  const onAssignManager = (fieldValues: AssignManagerFormField) => {
    updateShopManager({
      shopId: id ?? "",
      addressLine: data?.addressLine ?? undefined,
      name: data?.name,
      phone: data?.phone ?? null,
      shopManagerId: fieldValues?.shopManagerId ?? "",
      wardId: data?.wardId ? data?.wardId.toString() : undefined,
    }, {
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
  };

  useEffect(() => {
    if (data) {
      const initialData: FormFieldValue = {
        name: data?.name,
        phone: data?.phone ?? "",
        wardId: `${data?.wardId}`,
        addressLine: data?.addressLine,
        brandName: data?.brand?.name,
        province: `${data?.ward?.district?.province?.id}`,
        district: `${data?.ward?.district?.id}`,
        openTime: data?.openTime,
        closeTime: data?.closeTime,
      };
      form.setValues(initialData);
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
          disabled: true,
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
      <Box pt={rem(20)} pl={rem(32)}>
        <CustomBreadcrumb items={breadcrumbs} goBack />
      </Box>
      <Paper p={rem(32)} m={rem(32)} shadow="xs">
        <Tabs defaultValue="general">
          <Tabs.List>
            <Tabs.Tab value="general" leftSection={<IconFileAnalytics />}>
              General
            </Tabs.Tab>
            <Tabs.Tab value="shopManager" leftSection={<IconUser />}>
              Shop Manager
            </Tabs.Tab>
            <Tabs.Tab value="employees" leftSection={<IconUsers />}>
              Employee
            </Tabs.Tab>
            <Tabs.Tab value="edgebox" leftSection={<IconRouter />}>
              Edge Box
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="general">
            <Box p={rem(32)}>
              <LoadingOverlay
                visible={isLoading || updateShopLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
              />
              <Box>
                <Group justify="space-between" pb={rem(20)}>
                  <Group align="center">
                    <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
                      {data?.name}
                    </Text>
                    <StatusBadge statusName={data?.shopStatus ?? "None"} mt={rem(6)} />
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

                    // console.log(updateShopParams)

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

                  {/* <Group justify="flex-end" mt="md">
                    <Button disabled={!form.isDirty()} type="submit">
                      Submit
                    </Button>
                  </Group> */}
                </form>
              </Box>
            </Box>
          </Tabs.Panel>
          <Tabs.Panel value="shopManager">
            <Box p={rem(32)}>
              <Box>
                <Group justify="space-between" mb={rem(20)}>
                  <Group mb={15} gap={30}>
                    <div>
                      <Text size='md' fw={'bold'} fz={25} c={"light-blue.4"}>{data?.shopManager?.name}</Text>
                      {data?.shopManager?.role && <Text size="md" fw="bold">{data.shopManager.role.replace(/([A-Z])/g, ' $1').trim()}</Text>}
                    </div>
                    <StatusBadge statusName={data?.shopManager?.accountStatus ? data.shopManager?.accountStatus : "None"}
                      mb={15} mt={15} />
                  </Group>

                  <Popover trapFocus position="bottom" withArrow shadow="md" opened={opened}>
                    <Popover.Target>
                      <Tooltip label="Assign selected" withArrow>
                        <Button onClick={toggle}>
                          Assign Shop Manager
                        </Button>
                      </Tooltip>
                    </Popover.Target>

                    <Popover.Dropdown>
                      <form onSubmit={assignManagerForm.onSubmit(onAssignManager)}>
                        <Group align="baseline">
                          {isAccountListLoading ? (
                            <Loader mt={rem(30)} />
                          ) : (
                            <Select
                              size="xs"
                              {...assignManagerForm.getInputProps("shopManagerId")}
                              placeholder="Assign to.."
                              data={accountList?.values?.map((item) => {
                                return {
                                  value: item?.id,
                                  label: item?.name,
                                  disabled: item?.id == data?.shopManager?.id,
                                };
                              })}
                              nothingFoundMessage="Nothing found..."
                            />
                          )}
                          <Button loading={updateShopManagerLoading} type="submit">
                            Assign
                          </Button>
                        </Group>
                      </form>
                    </Popover.Dropdown>
                  </Popover>

                </Group>
                {data?.shopManager?.gender &&
                  <Group>
                    {data?.shopManager?.gender == "Female" ?
                      <BsGenderFemale /> :
                      <BsGenderMale />
                    }
                    <Text size="md">{data?.shopManager?.gender}</Text>
                  </Group>
                }
                {data?.shopManager?.email &&
                  <Group>
                    <MdEmail />
                    <Text size="md">{data?.shopManager?.email}</Text>
                  </Group>
                }
                {data?.phone &&
                  <Group>
                    <MdPhone />
                    <Text size="md">{data?.phone}</Text>
                  </Group>
                }
                {data?.shopManager?.birthday &&
                  <Group>
                    <MdCalendarToday />
                    <Text size="md">{removeTime(data?.shopManager?.birthday, "/", "dd/MM/yyyy")}</Text>
                  </Group>
                }
                {(data?.shopManager?.ward || data?.shopManager?.addressLine) &&
                  <Group>
                    <MdHome />
                    {(data?.shopManager?.ward && data?.shopManager?.addressLine) && <Text size="md">{data?.shopManager?.addressLine}, {data?.shopManager?.ward?.name}, {data?.shopManager?.ward?.district?.name}, {data?.shopManager?.ward?.district?.province?.name}</Text>}
                    {(data?.shopManager?.ward && !data?.shopManager?.addressLine) && <Text size="md">{data?.shopManager?.ward?.name}, {data?.shopManager?.ward?.district?.name}, {data?.shopManager?.ward?.district?.province?.name}</Text>}
                    {(!data?.shopManager?.ward && data?.shopManager?.addressLine) && <Text size="md">{data?.shopManager?.addressLine}</Text>}
                  </Group>
                }
              </Box>
            </Box>
          </Tabs.Panel>
          <Tabs.Panel value="employees">
            <Box p={rem(32)}>
              <Flex pb={rem(20)} justify={"space-between "}>
                <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
                  Employee
                </Text>
              </Flex>
              {isGetEmployeeListLoading ? (
                <Loader />
              ) : (
                <ScrollArea onScrollPositionChange={({ y }) => setScrolled(y !== 0)} pl={20} pr={20}>
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
                    <Table.ScrollContainer minWidth={1000}>
                      <Table highlightOnHover verticalSpacing={"md"} striped>
                        <Table.Thead
                          className={clsx(classes.header, {
                            [classes.scrolled]: scrolled,
                          })}
                        >
                          <Table.Tr>
                            <Table.Th>#</Table.Th>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Phone</Table.Th>
                            <Table.Th>Birthday</Table.Th>
                            <Table.Th>Gender</Table.Th>
                            <Table.Th>Address</Table.Th>
                            <Table.Th ta="center">Status</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                      </Table>
                    </Table.ScrollContainer>
                  )}
                </ScrollArea>
              )}
            </Box>
          </Tabs.Panel>
          <Tabs.Panel value="edgebox">
            <Skeleton visible={isEdgeboxInstallListLoading || isGetCameraListLoading}>
              <Box p={rem(32)}>
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
              </Box>
              <Divider />
              <Box p={rem(32)}>
                <Text size="lg" fw={"bold"} fz={25} mb={rem(20)} c={"light-blue.4"}>
                  Camera list
                </Text>
                {cameraList?.isValuesEmpty ? (
                  <Flex>
                    <Box ml={rem(40)} style={{ flex: 1 }}>
                      <Text c="dimmed"
                        w={"100%"}
                        ta={"center"}
                        mt={20}
                        fs="italic">
                        No camera found
                      </Text>
                    </Box>
                  </Flex>
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
              </Box>
            </Skeleton>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Box>
  );
};

export default ShopDetailPageManager;
