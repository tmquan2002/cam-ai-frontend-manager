import {
  ActionIcon,
  Box,
  Button,
  Group,
  LoadingOverlay,
  Mark,
  Modal,
  Paper,
  Text,
  rem,
} from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateAccountParams } from "../../apis/AccountAPI";
import CustomBreadcrumb, { BreadcrumbItem } from "../../components/breadcrumbs/CustomBreadcrumb";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { useDeleteShopById } from "../../hooks/useDeleteShopById";
import { useGetAccountById } from "../../hooks/useGetAccountById";
import { useGetDistrictList } from "../../hooks/useGetDistrictList";
import { useGetProvinceList } from "../../hooks/useGetProvinceList";
import { useGetWardList } from "../../hooks/useGetWardList";
import { useUpdateAccount } from "../../hooks/useUpdateAccount";
import { AccountStatus, Gender } from "../../models/CamAIEnum";
import { ResponseErrorDetail } from "../../models/Response";
import { phoneRegex } from "../../types/constant";
import { mapLookupToArray } from "../../utils/helperFunction";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Shop Manager",
    link: "/brand/account"
  },
  {
    title: "Detail"
  }
]
type ProfileFieldValue = {
  name: string;
  email: string;
  phone: string;
  birthday?: Date;
  addressLine: string;
  gender: Gender;
  wardId: string;
  province: string;
  district: string;
};

const AccountDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const form = useForm<ProfileFieldValue>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      birthday: new Date("01/01/2000"),
      gender: Gender.Male,
      addressLine: "",
      district: "",
      province: "",
      wardId: "",
    },
    validate: {
      name: isNotEmpty("Name is required"),
      email: isEmail("Invalid email - ex: name@gmail.com"),
      gender: isNotEmpty("Please select gender"),
      phone: (value) => isEmpty(value) ? null :
        phoneRegex.test(value) ? null : "A phone number should have a length of 10-12 characters",
    },
  });
  const { data: provinces, isLoading: isProvicesLoading } = useGetProvinceList();
  const { data: districts, isLoading: isDistrictsLoading } = useGetDistrictList(+(form.values.province ?? 0));
  const { data: wards, isLoading: isWardsLoading } = useGetWardList(+(form.values.district ?? 0));
  const { data: accountData, isLoading: isAccountDataLoading } = useGetAccountById(id ?? "");
  const { mutate: updateAccount, isLoading: isUpdateAccountLoading } = useUpdateAccount();

  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (accountData) {
      form.setInitialValues({
        addressLine: accountData?.addressLine,
        birthday: accountData.birthday
          ? new Date(accountData.birthday)
          : undefined,
        district: accountData?.ward?.districtId?.toString(),
        email: accountData?.email,
        gender: accountData?.gender,
        name: accountData?.name,
        phone: accountData?.phone,
        province: accountData?.ward?.district?.provinceId?.toString(),
        wardId: accountData?.wardId?.toString(),
      });
      form.reset();
    }
  }, [accountData]);

  const fields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
          name: "name",
          placeholder: "User name",
          label: "User name",
          required: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
          name: "email",
          placeholder: "Email",
          label: "Email",
          required: true,
          readonly: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
          name: "phone",
          placeholder: "Phone",
          label: "Phone",
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.DATE,
        fieldProps: {
          form,
          name: "birthday",
          placeholder: "Birthday",
          label: "Birthday",
        },
        spans: 6,
      },

      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Gender",
          placeholder: "Gender",
          data: mapLookupToArray(Gender ?? {}),
          form,
          name: "gender",
        },
        spans: 12,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Province",
          placeholder: "Province",
          data: provinces?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form: form,
          name: "province",
          loading: isProvicesLoading,
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
          form: form,
          name: "district",
          loading: isDistrictsLoading,
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
          form: form,
          name: "wardId",
          loading: isWardsLoading,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
          name: "addressLine",
          placeholder: "Address",
          label: "Address",
        },
        spans: 12,
      },
    ];
  }, [
    form,
    districts,
    isDistrictsLoading,
    isProvicesLoading,
    isWardsLoading,
    provinces,
    wards,
  ]);

  const { mutate: deleteShop, isLoading: isDeleteShopLoading } =
    useDeleteShopById();

  return (
    <>
      <Box pt={rem(20)} pl={rem(32)}>
        <CustomBreadcrumb items={breadcrumbs} goBack />
      </Box>
      <Paper m={rem(32)} p={rem(32)} style={{ flex: 1 }} shadow="xs">
        <Group mb={rem(20)} align="center" justify={"space-between"}>
          <Group>
            <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
              {accountData?.name}
            </Text>
          </Group>

          {accountData?.accountStatus != AccountStatus.Inactive && (
            <ActionIcon color="red" onClick={open} size={"lg"}>
              <IconTrash style={{ width: rem(20), height: rem(20) }} />
            </ActionIcon>
          )}
        </Group>
        <Box pos={"relative"}>
          {isAccountDataLoading ? (
            <LoadingOverlay
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
          ) : (
            <form
              onSubmit={form.onSubmit((values) => {
                const params: UpdateAccountParams = {
                  addressLine: values.addressLine,
                  birthday: values.birthday
                    ? dayjs(values.birthday).format("YYYY-MM-DD")
                    : null,
                  gender: values.gender,
                  name: values.name,
                  phone: values.phone,
                  wardId: +values?.wardId,
                  userId: id ?? "",
                };
                updateAccount(params, {
                  onSuccess() {
                    notifications.show({
                      title: "Successfully",
                      message: "Update account success!",
                    });
                  },
                  onError(data) {
                    const error = data as AxiosError<ResponseErrorDetail>;
                    notifications.show({
                      color: "red",
                      title: "Failed",
                      message: error.response?.data?.message,
                    });
                  },
                });
              })}
            >
              <EditAndUpdateForm fields={fields} />
              <Group justify="flex-end" mt="md" pb={rem(10)}>
                <Button
                  disabled={!form.isDirty()}
                  loading={isUpdateAccountLoading}
                  type="submit"
                  mt={10}
                >
                  Submit
                </Button>
              </Group>
            </form>
          )}

          <Modal
            opened={opened}
            onClose={close}
            title={
              <Text>
                Confirm delete <Mark>{accountData?.name}</Mark> account?
              </Text>
            }
          // centered
          >
            <Group justify="flex-end" mt="md">
              <Button
                loading={isDeleteShopLoading}
                onClick={() => {
                  deleteShop(id ?? "", {
                    onSuccess() {
                      notifications.show({
                        title: "Successfully",
                        message: "Delete shop successfully!",
                      });
                      navigate("/shop/detail");
                    },
                    onError(data) {
                      const error = data as AxiosError<ResponseErrorDetail>;
                      notifications.show({
                        color: "red",
                        title: "Failed",
                        message: error.response?.data?.message,
                      });
                    },
                  });
                }}
                variant="filled"
                size="xs"
              >
                Yes
              </Button>
              <Button onClick={close} color={"red"} variant="outline" size="xs">
                No
              </Button>
            </Group>
          </Modal>
        </Box>
      </Paper>
    </>
  );
};

export default AccountDetailPage;
