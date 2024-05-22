import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Paper,
  Skeleton,
  Tabs,
  Text,
  Tooltip,
  rem,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconCaretRight,
  IconFileAnalytics,
  IconMapPin,
  IconRouter,
  IconVideo,
  IconX,
} from "@tabler/icons-react";
import { AxiosError } from "axios";
import _, { isEmpty } from "lodash";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { UpdateShopParams } from "../../apis/ShopAPI";
import { EdgeBoxInstallDetailComp } from "../../components/edgeBoxInstall/EdgeBoxInstallDetailComp";
import { EdgeBoxInstallEmpty } from "../../components/edgeBoxInstall/EdgeBoxInstallEmpty";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { useGetCameraListByShopId } from "../../hooks/useGetCameraListByShopId";
import { useGetDistrictList } from "../../hooks/useGetDistrictList";
import { useGetEdgeBoxInstallByShopId } from "../../hooks/useGetEdgeBoxInstallByShopId";
import { useGetProvinceList } from "../../hooks/useGetProvinceList";
import { useGetShopList } from "../../hooks/useGetShopList";
import { useGetWardList } from "../../hooks/useGetWardList";
import { useUpdateShopById } from "../../hooks/useUpdateShopById";
import { CameraStatus, EdgeboxInstallStatus } from "../../models/CamAIEnum";
import { ResponseErrorDetail } from "../../models/Response";
import { PHONE_REGEX } from "../../types/constant";

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

const ShopDetailPage = () => {
  const navigate = useNavigate();

  const form = useForm<FormFieldValue>({
    validate: {
      name: isNotEmpty("Name should not be empty"),
      phone: (value) =>
        isEmpty(value)
          ? null
          : PHONE_REGEX.test(value)
          ? null
          : "A phone number should have a length of 10-12 characters",
      addressLine: isNotEmpty("Address should not be empty"),
      wardId: isNotEmpty("Please select ward"),
      province: isNotEmpty("Provice is required"),
      district: isNotEmpty("District is required"),
      openTime: isNotEmpty("Open time is required"),
      closeTime: isNotEmpty("Close time is required"),
    },
  });
  const { data, isLoading } = useGetShopList({ size: 1, enabled: true });
  const { data: edgeBoxInstallList, isLoading: isEdgeboxInstallListLoading } =
    useGetEdgeBoxInstallByShopId(data?.values?.[0]?.id ?? null);
  const { data: provinces, isLoading: isProvicesLoading } =
    useGetProvinceList();
  const { data: cameraList, isLoading: isGetCameraListLoading } =
    useGetCameraListByShopId(data?.values?.[0]?.id ?? undefined);
  const { data: districts, isLoading: isDistrictsLoading } = useGetDistrictList(
    +(form.values.province ?? 0)
  );
  const { data: wards, isLoading: isWardsLoading } = useGetWardList(
    +(form.values.district ?? 0)
  );
  const { mutate: updateShop, isLoading: updateShopLoading } =
    useUpdateShopById();

  useEffect(() => {
    if (data) {
      const { values } = data;
      if (!_.isEmpty(values)) {
        const initialData: FormFieldValue = {
          name: values[0]?.name,
          phone: values[0]?.phone,
          wardId: `${values[0]?.wardId}`,
          addressLine: values[0]?.addressLine,
          brandName: values[0]?.brand.name,
          province: `${values[0]?.ward?.district?.province?.id}`,
          district: `${values[0]?.ward?.district?.id}`,
          openTime: values[0]?.openTime,
          closeTime: values[0]?.closeTime,
        };
        form.setInitialValues(initialData);
        form.reset();
      }
    }
  }, [data]);

  const fields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          readonly: true,
          form,
          name: "name",
          placeholder: "Shop name",
          label: "Shop name",
          required: true,
          radius: "md",
        },
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          readonly: true,
          form,
          name: "phone",
          placeholder: "Shop phone",
          label: "Shop phone",
          radius: "md",
        },
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          readonly: true,
          form,
          name: "brandName",
          placeholder: "Brand",
          label: "Brand",
          radius: "md",
        },
      },
      {
        type: FIELD_TYPES.TIME,
        fieldProps: {
          readonly: true,
          form,
          name: "openTime",
          placeholder: "Open Time",
          label: "Open time",
          required: true,
          withSeconds: false,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.TIME,
        fieldProps: {
          readonly: true,
          form,
          name: "closeTime",
          placeholder: "Close Time",
          label: "Close time",
          required: true,
          radius: "md",
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          readonly: true,
          label: "Province",
          placeholder: "Province",
          data: provinces?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form,
          radius: "md",
          name: "province",
          loading: isProvicesLoading,
          required: true,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          readonly: true,
          label: "District",
          placeholder: "District",
          data: districts?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form,
          name: "district",
          loading: isDistrictsLoading,
          required: true,
          radius: "md",
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          readonly: true,
          label: "Ward",
          placeholder: "Ward",
          data: wards?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form,
          name: "wardId",
          loading: isWardsLoading,
          required: true,
          radius: "md",
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          readonly: true,
          form,
          name: "addressLine",
          placeholder: "Shop address",
          label: "Shop address",
          required: true,
          radius: "md",
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
      <Paper p={rem(32)} m={rem(32)} shadow="xs">
        <Tabs defaultValue="general">
          <Tabs.List>
            <Tabs.Tab value="general" leftSection={<IconFileAnalytics />}>
              General
            </Tabs.Tab>
            <Tabs.Tab value="edgebox" leftSection={<IconRouter />}>
              Edge Box
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="general">
            <Box p={rem(32)}>
              <Box pos="relative">
                <LoadingOverlay
                  visible={isLoading || updateShopLoading}
                  zIndex={1000}
                  overlayProps={{ radius: "sm", blur: 2 }}
                />

                <form
                  onSubmit={form.onSubmit((values) => {
                    const updateShopParams: UpdateShopParams = {
                      shopId: data?.values[0]?.id ?? "0",
                      shopManagerId: data?.values[0]?.shopManager?.id ?? "0",
                      addressLine: values?.addressLine,
                      wardId: values?.wardId ?? "0",
                      name: values?.name,
                      phone: values?.phone,
                      openTime: values?.openTime,
                      closeTime: values?.closeTime,
                    };

                    updateShop(updateShopParams, {
                      onSuccess() {
                        // onSuccess(data) {
                        notifications.show({
                          title: "Update successfully",
                          message: "Shop detail updated!",
                        });
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
                  <Text
                    size="lg"
                    fw={"bold"}
                    fz={25}
                    c={"light-blue.4"}
                    mb={20}
                  >
                    Shop Detail
                  </Text>
                  <EditAndUpdateForm fields={fields} />

                  {/* <Group justify="flex-end" mt="md">
                    <Button
                      type="submit"
                      disabled={!form.isDirty()}
                    >
                      Submit
                    </Button>
                  </Group> */}
                </form>
              </Box>
            </Box>
          </Tabs.Panel>

          <Tabs.Panel value="edgebox">
            <Skeleton
              visible={isEdgeboxInstallListLoading || isGetCameraListLoading}
            >
              <Box p={rem(32)}>
                {edgeBoxInstall ? (
                  <EdgeBoxInstallDetailComp edgeBoxInstall={edgeBoxInstall} />
                ) : (
                  <EdgeBoxInstallEmpty />
                )}
              </Box>
              <Divider />
              <Box p={rem(32)}>
                <Text
                  size="lg"
                  fw={"bold"}
                  fz={25}
                  mb={rem(20)}
                  c={"light-blue.4"}
                >
                  Camera list
                </Text>
                {cameraList?.values?.length == 0 && (
                  <Flex>
                    <Box ml={rem(40)} style={{ flex: 1 }}>
                      <Text
                        c="dimmed"
                        w={"100%"}
                        ta={"center"}
                        mt={20}
                        fs="italic"
                      >
                        No camera found
                      </Text>
                    </Box>
                  </Flex>
                )}
                {cameraList?.values?.map((item) => (
                  <Tooltip label="View camera" key={item?.id}>
                    <Button
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
                          navigate(`/shop`);
                        }
                      }}
                      rightSection={
                        <IconCaretRight style={{ width: rem(24) }} />
                      }
                      px={rem(16)}
                      mb={rem(16)}
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
                ))}
              </Box>
            </Skeleton>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Box>
  );
};

export default ShopDetailPage;
