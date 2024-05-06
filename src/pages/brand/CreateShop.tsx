import { Box, Button, Group, Modal, Paper, Text, rem } from "@mantine/core";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { isEmpty } from "lodash";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CreateShopParams } from "../../apis/ShopAPI";
import CustomBreadcrumb, { BreadcrumbItem } from "../../components/breadcrumbs/CustomBreadcrumb";
import DownloadButton from "../../components/button/DownloadButton";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { useCreateShop } from "../../hooks/useCreateShop";
import { useUploadShopFile } from "../../hooks/useFiles";
import { useGetAccountList } from "../../hooks/useGetAccounts";
import { useGetDistrictList } from "../../hooks/useGetDistrictList";
import { useGetProvinceList } from "../../hooks/useGetProvinceList";
import { useGetWardList } from "../../hooks/useGetWardList";
import { ResponseErrorDetail } from "../../models/Response";
import { phoneRegex } from "../../types/constant";
import CreateShopManagerForm from "./manager/CreateShopManagerForm";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Shop",
    link: "/brand/shop"
  },
  {
    title: "Add"
  }
]
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

const CreateShop = () => {
  const [openedCreateManager, { open: openCreateManager, close: closeCreateManager }] = useDisclosure(false);
  const [openedMassImport, { open: openMassImport, close: closeMassImport }] = useDisclosure(false);

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
      shopManagerId: isNotEmpty("Shop manager is required"),
      closeTime: isNotEmpty("Close time is required"),
    },
  });

  const massImportForm = useForm<{ file: File }>({
    validate: {
      file: isNotEmpty("Please choose a file"),
    }
  });

  const navigate = useNavigate();
  const { data: accountList, isLoading: isAccountListLoading, refetch: refetchAccountList, } = useGetAccountList({});
  const { data: provinces, isLoading: isProvicesLoading } = useGetProvinceList();
  const { data: districts, isLoading: isDistrictsLoading } = useGetDistrictList(+(createShopForm.values.province ?? 0));
  const { data: wards, isLoading: isWardsLoading } = useGetWardList(+(createShopForm.values.district ?? 0));
  const { mutate: createShop, isLoading: isCreateShopLoading } = useCreateShop();
  const { mutate: uploadShop, isLoading: isUploadShopLoading } = useUploadShopFile();


  const createShopFields = useMemo(() => {
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
          required: true,
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
            <Button variant="subtle" onClick={openCreateManager}>
              New
            </Button>
          ),
          // searchable: true,
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
    openCreateManager, closeCreateManager,
    provinces,
    isProvicesLoading,
    districts,
    isDistrictsLoading,
    wards,
    isWardsLoading,
  ]);

  const massImportFields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.FILE,
        fieldProps: {
          description: "Choose your file to import multiple shops and managers at once, accept .csv file",
          form: massImportForm,
          name: "file",
          placeholder: "Choose a file",
          label: "Import File",
          accept: ".csv",
          width: 300,
          required: true,
        },
      }
    ];
  }, [massImportForm])

  return (
    <>
      <Box pt={rem(20)} pl={rem(32)}>
        <CustomBreadcrumb items={breadcrumbs} goBack />
      </Box>
      <Paper m={rem(32)} mb={0} p={rem(32)} shadow="xl">
        <Group pb={20} align="center" justify="space-between">
          <Group>
            <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
              Create shop
            </Text>
          </Group>
          <Button onClick={openMassImport}>Import File</Button>
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
                    message: "Create shop successfully!",
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
          <EditAndUpdateForm fields={createShopFields} />

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

      {/* Create shop manager modal section */}
      <Modal opened={openedCreateManager} onClose={closeCreateManager} size="lg" title="New Shop Manager" centered closeOnClickOutside={false}>
        <CreateShopManagerForm mode="shop" close={closeCreateManager} refetch={refetchAccountList} />
      </Modal>

      {/* Mass import modal section */}
      <Modal opened={openedMassImport} onClose={closeMassImport} size="lg" title="Import Shops and Managers" centered closeOnClickOutside={false}>
        <form autoComplete="off" onSubmit={massImportForm.onSubmit(({ file }) => {
          console.log(file)
          uploadShop({ file }, {
            onSuccess() {
              notifications.show({
                title: "Successfully",
                message: "Import successful!",
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
          })
        })}>
          <Group align="end">
            <EditAndUpdateForm fields={massImportFields} />
            <DownloadButton type="shop"/>
          </Group>
          <Group mt="md">
            <Button type="submit" loading={isUploadShopLoading}>
              Import
            </Button>
            <Button type="submit" variant="outline" onClick={closeMassImport} loading={isUploadShopLoading}>
              Cancel
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default CreateShop;
