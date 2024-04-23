import { Button, Group, Modal, Paper, Text, rem } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CreateAccountParams } from "../../apis/AccountAPI";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { useCreateAccount } from "../../hooks/useCreateAccount";
import { useGetBrandList } from "../../hooks/useGetBrandList";
import { useGetDistrictList } from "../../hooks/useGetDistrictList";
import { useGetProvinceList } from "../../hooks/useGetProvinceList";
import { useGetWardList } from "../../hooks/useGetWardList";
import { Gender, Role } from "../../models/CamAIEnum";
import { ResponseErrorDetail } from "../../models/Response";
import { phoneRegex } from "../../types/constant";
import { mapLookupToArray } from "../../utils/helperFunction";

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

export type MassAddField = {
  file: File | null;
}

const CreateManagerPage = () => {
  const navigate = useNavigate();
  const [massAddOpened, { open: openMass, close: closeMass }] = useDisclosure();
  const { data: brandList, isLoading: isGetBrandListLoading } = useGetBrandList(
    { size: 1 }
  );

  const { mutate: createAccount, isLoading: isCreateAccountLoading } =
    useCreateAccount();

  const createAccountForm = useForm<CreateAccountField>({
    validate: {
      name: isNotEmpty("Name is required"),
      email: isEmail("Invalid email - ex: name@gmail.com"),
      password: isNotEmpty("Name must not be empty"),
      gender: isNotEmpty("Please select gender"),
      phone: (value) => isEmpty(value) ? null :
        phoneRegex.test(value) ? null : "A phone number should have a length of 10-12 characters",
    },
  });

  const massAddDataForm = useForm<MassAddField>({
    validate: {
      file: isNotEmpty("Please choose your file"),
    }
  })

  const { data: provinces, isLoading: isProvicesLoading } =
    useGetProvinceList();

  const {
    data: createAccountDistricts,
    isLoading: isCreateAccountDistrictsLoading,
  } = useGetDistrictList(+(createAccountForm.values.province ?? 0));

  const { data: createAccountWards, isLoading: isCreateAccountWardsLoading } =
    useGetWardList(+(createAccountForm.values.district ?? 0));

  const addNewAccountFields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createAccountForm,
          name: "name",
          placeholder: "Name",
          label: "Name",
          required: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createAccountForm,
          name: "email",
          placeholder: "Email",
          label: "Email",
          required: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createAccountForm,
          name: "password",
          placeholder: "Password",
          label: "Password",
          type: "password",
          required: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createAccountForm,
          name: "phone",
          placeholder: "Phone",
          label: "Phone",
        },
        spans: 6,
      },

      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Gender",
          placeholder: "Gender",
          data: mapLookupToArray(Gender ?? {}),
          form: createAccountForm,
          name: "gender",
          required: true,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.DATE,
        fieldProps: {
          form: createAccountForm,
          name: "birthday",
          placeholder: "Birthday",
          label: "Birthday",
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
          form: createAccountForm,
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
          data: createAccountDistricts?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form: createAccountForm,
          name: "district",
          loading: isCreateAccountDistrictsLoading,

          // disabled: true,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Ward",
          placeholder: "Ward",
          data: createAccountWards?.map((item) => {
            return { value: `${item.id}`, label: item.name };
          }),
          form: createAccountForm,
          name: "wardId",
          loading: isCreateAccountWardsLoading,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: createAccountForm,
          name: "addressLine",
          placeholder: "Address",
          label: "Address",
        },
      },
    ];
  }, [
    createAccountForm,
    provinces,
    isProvicesLoading,
    createAccountDistricts,
    isCreateAccountDistrictsLoading,
    createAccountWards,
    isCreateAccountWardsLoading,
  ]);

  //TODO: Add API and change name later
  const massAddFields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.FILE,
        fieldProps: {
          form: massAddDataForm,
          name: "file",
          placeholder: "Choose a file...",
          label: "File",
        },
      },
    ];
  }, [massAddDataForm,]);

  return (
    <Paper
      m={rem(32)}
      p={rem(32)}
    >
      <Group mb={rem(30)} justify="space-between">
        <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
          New shop manager
        </Text>
        <Button
          variant="filled" size="sm" onClick={openMass}
          gradient={{ from: "light-blue.5", to: "light-blue.7", deg: 90 }}
        >
          Import file
        </Button>
      </Group>
      {/* Form section */}
      <form
        onReset={createAccountForm.onReset}
        autoComplete="off"
        onSubmit={createAccountForm.onSubmit(
          ({
            addressLine,
            birthday,
            email,
            gender,
            name,
            password,
            phone,
            wardId,
          }: CreateAccountField) => {
            const params: CreateAccountParams = {
              addressLine,
              birthday: dayjs(birthday).format("YYYY-MM-DD"),
              brandId: brandList?.values[0].id ?? "",
              email,
              gender: gender ?? null,
              name,
              password,
              phone,
              role: Role.ShopManager,
              wardId: +wardId,
            };

            createAccount(params, {
              onSuccess() {
                notifications.show({
                  title: "Successfully",
                  message: "Create account successfully!",
                });
                navigate("/brand/account");
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
        <EditAndUpdateForm fields={addNewAccountFields} />
        <Group
          justify="flex-end"
          mt="md"
        >
          <Button
            type="submit"
            loading={isCreateAccountLoading || isGetBrandListLoading}
            disabled={!createAccountForm.isDirty()}
          >
            Create
          </Button>
        </Group>
      </form>

      {/* Mass add section */}
      <Modal onClose={closeMass} opened={massAddOpened} title="Add multiple shops" centered>
        <form
          onReset={massAddDataForm.onReset}
          autoComplete="off"
          onSubmit={massAddDataForm.onSubmit(
            ({ file }: MassAddField) => {
              console.log(file)
            }
          )}
        >
          <EditAndUpdateForm fields={massAddFields} />
          <Group
            justify="flex-end"
            mt="md"
          >
            <Button
              type="submit"
              disabled={!massAddDataForm.isDirty()}
            >
              Submit
            </Button>
          </Group>
        </form>
      </Modal>
    </Paper>
  );
};

export default CreateManagerPage;
