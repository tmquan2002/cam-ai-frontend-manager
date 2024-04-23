import { Button, Group, Modal, Paper, Text, rem } from "@mantine/core";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CreateShopParams } from "../../apis/ShopAPI";
import BackButton from "../../components/button/BackButton";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { useCreateShop } from "../../hooks/useCreateShop";
import { useGetAccountList } from "../../hooks/useGetAccounts";
import { useGetDistrictList } from "../../hooks/useGetDistrictList";
import { useGetProvinceList } from "../../hooks/useGetProvinceList";
import { useGetWardList } from "../../hooks/useGetWardList";
import { Gender } from "../../models/CamAIEnum";
import { ResponseErrorDetail } from "../../models/Response";
import CreateShopManagerForm from "./manager/CreateShopManagerForm";
import { isEmpty } from "lodash";
import { phoneRegex } from "../../types/constant";

export type CreateShopField = {
  name: string;
  phone: string;
  wardId: string;
  shopManagerId: string | null;
  addressLine: string;
  province: string;
  district: string;
  openTime: string;
  closeTime: string;
};

export type CreateAccountField = {
  email: string;
  password: string;
  name: string;
  gender: Gender;
  phone: string;
  birthday: Date | null;
  wardId: string;
  addressLine: string;
  province: string;
  district: string;
};

const CreateShop = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const createShopForm = useForm<CreateShopField>({
    validate: {
      name: hasLength({ min: 1, max: 50 }, "Name is 1-50 characters long"),
      phone: (value) => isEmpty(value) ? null :
        phoneRegex.test(value) ? null : "A phone number should have a length of 10-12 characters",
      addressLine: isNotEmpty("Address line is required"),
      wardId: isNotEmpty("Ward is required"),
      province: isNotEmpty("Province is required"),
      district: isNotEmpty("District is required"),
      openTime: isNotEmpty("Open time is required"),
      closeTime: isNotEmpty("Close time is required"),
    },
  });

  const navigate = useNavigate();
  const {
    data: accountList,
    isLoading: isAccountListLoading,
    refetch: refetchAccountList,
  } = useGetAccountList({});
  const { data: provinces, isLoading: isProvicesLoading } =
    useGetProvinceList();
  const { data: districts, isLoading: isDistrictsLoading } = useGetDistrictList(
    +(createShopForm.values.province ?? 0)
  );
  const { data: wards, isLoading: isWardsLoading } = useGetWardList(
    +(createShopForm.values.district ?? 0)
  );

  const { mutate: createShop, isLoading: isCreateShopLoading } =
    useCreateShop();


  const fields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createShopForm,
          name: "name",
          placeholder: "Shop name",
          label: "Shop name",
          required: true,
        },
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createShopForm,
          name: "phone",
          type: "number",
          placeholder: "Shop phone",
          label: "Shop phone",
        },
      },

      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          form: createShopForm,
          name: "shopManagerId",
          placeholder: "Shop manager",
          label: "Shop manager",
          data: accountList?.values?.map((item) => {
            return {
              value: item.id,
              label: item.name,
              disabled: item.managingShop != null,
            };
          }),
          loading: isAccountListLoading,
          rightSectionWidth: 70,
          rightSection: (
            <Button variant="subtle" onClick={open}>
              New
            </Button>
          ),
          // searchable: true,

          // required: true,
        },
      },
      {
        type: FIELD_TYPES.TIME,
        fieldProps: {
          form: createShopForm,

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
          form: createShopForm,
          name: "closeTime",
          placeholder: "Close Time",
          label: "Close time",
          required: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Province",
          placeholder: "Province",
          data: provinces?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form: createShopForm,
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
          form: createShopForm,
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
          form: createShopForm,
          name: "wardId",
          loading: isWardsLoading,
          required: true,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createShopForm,
          name: "addressLine",
          placeholder: "Shop address",
          label: "Shop address",
          required: true,
        },
      },
    ];
  }, [
    createShopForm,
    accountList?.values,
    isAccountListLoading,
    open, close,
    provinces,
    isProvicesLoading,
    districts,
    isDistrictsLoading,
    wards,
    isWardsLoading,
  ]);

  return (
    <>
      <Paper m={rem(32)} mb={0} p={rem(32)} shadow="xl">
        <Group pb={20} align="center">
          <BackButton />
          <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
            Create shop
          </Text>
        </Group>
        <form
          onSubmit={createShopForm.onSubmit(
            ({ addressLine, name, phone, wardId, shopManagerId, openTime, closeTime, }) => {
              const createShopParams: CreateShopParams = {
                addressLine,
                name,
                phone: isEmpty(phone) ? null : phone,
                wardId: +(wardId ?? 0),
                shopManagerId: shopManagerId ?? null,
                openTime: openTime + ":00",
                closeTime: closeTime + ":00",
              };
              console.log(createShopParams)
              createShop(createShopParams, {
                onSuccess(data) {
                  notifications.show({
                    title: "Successfully",
                    message: "Craete shop successfully!",
                  });
                  navigate(`/brand/shop/${data.id}`);
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
            }
          )}
        >
          <EditAndUpdateForm fields={fields} />

          <Group justify="flex-end" mt="md">
            <Button
              disabled={!createShopForm.isDirty()}
              type="submit"
              loading={isCreateShopLoading}
            >
              Create
            </Button>
          </Group>
        </form>
      </Paper>
      <Modal opened={opened} onClose={close} size="lg" title="New Shop Manager" centered closeOnClickOutside={false}>
        <CreateShopManagerForm mode="shop" close={close} refetch={refetchAccountList} />
      </Modal>
    </>
  );
};

export default CreateShop;
