import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProvinceList } from "../../hooks/useGetProvinceList";
import { useGetDistrictList } from "../../hooks/useGetDistrictList";
import { useGetWardList } from "../../hooks/useGetWardList";
import { useEffect, useMemo } from "react";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import {
  ActionIcon,
  Button,
  Flex,
  FocusTrap,
  Group,
  Loader,
  Mark,
  Menu,
  Modal,
  Paper,
  Text,
  rem,
} from "@mantine/core";
// import { AxiosError } from "axios";
// import { ResponseErrorDetail } from "../../models/Response";
// import { notifications } from "@mantine/notifications";
import { useGetEmployeeById } from "../../hooks/useGetEmployeeByid";
import { useDisclosure } from "@mantine/hooks";
import { useUpdateEmployeeById } from "../../hooks/useUpdateEmployeeById";
import { UpdateEmployeeParams } from "../../apis/EmployeeAPI";
import dayjs from "dayjs";
import { AxiosError } from "axios";
import { ResponseErrorDetail } from "../../models/Response";
import { notifications } from "@mantine/notifications";
import {
  IconAdjustments,
  IconArrowsLeftRight,
  IconTrash,
} from "@tabler/icons-react";
import { useDeleteEmployeeById } from "../../hooks/useDeleteEmployeeById";
import { mapLookupToArray } from "../../utils/helperFunction";
import { Gender } from "../../models/CamAIEnum";

export type CreateEmployeeField = {
  name: string;
  email: string;
  gender: Gender;
  phone: string;
  birthday: Date;
  addressLine: string;
  wardId: string;
  province: string;
  district: string;
};

const EmployeeDetailPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [editMode, { toggle }] = useDisclosure(true);
  const {
    data: employeeData,
    isLoading: isEmployeeDataLoading,
    refetch,
    isFetching,
  } = useGetEmployeeById(params?.id ?? "");
  const updateEmployeeForm = useForm<CreateEmployeeField>({
    validate: {
      name: isNotEmpty("Employee name is required"),
      email: isEmail("Invalid email - ex: helloitsme@gmail.com"),
      gender: isNotEmpty("Please select gender"),
      phone: (value) =>
        value == undefined ||
        value == "" ||
        /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(value)
          ? null
          : "Invalid phone number - ex: 0379999999",
    },
  });
  const { mutate: deleteEmployee, isLoading: isDeleteEmployeeLoading } =
    useDeleteEmployeeById();

  useEffect(() => {
    if (employeeData) {
      updateEmployeeForm.setValues({
        name: employeeData?.name ?? undefined,
        email: employeeData?.email ?? undefined,
        gender: employeeData?.gender ?? undefined,
        phone: employeeData?.phone ?? undefined,
        birthday: employeeData.birthday
          ? new Date(employeeData.birthday)
          : undefined,
        addressLine: employeeData?.addressLine ?? undefined,
        wardId: `${employeeData?.wardId}`,
        province: `${employeeData?.ward?.district?.provinceId}`,
        district: `${employeeData?.ward?.districtId}`,
      });
    }
  }, [employeeData, isFetching]);

  const { data: provinces, isLoading: isProvicesLoading } =
    useGetProvinceList();
  const { data: districts, isLoading: isDistrictsLoading } = useGetDistrictList(
    +(updateEmployeeForm.values.province ?? 0)
  );
  const { data: wards, isLoading: isWardsLoading } = useGetWardList(
    +(updateEmployeeForm.values.district ?? 0)
  );

  const { mutate: updateEmployee, isLoading: isUpdateEmployeeLoading } =
    useUpdateEmployeeById();

  const fields = useMemo(() => {
    return [
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: updateEmployeeForm,
          name: "name",
          placeholder: "Name",
          label: "Name",
          required: true,
          readonly: editMode,
        },
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: updateEmployeeForm,
          name: "email",
          placeholder: "Email",
          label: "Email",
          required: true,
          readonly: editMode,
        },
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "Gender",
          placeholder: "Gender",
          data: mapLookupToArray(Gender ?? {}),
          form: updateEmployeeForm,
          name: "gender",
          required: true,
          readonly: editMode,
        },
        spans: 6,
      },

      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: updateEmployeeForm,
          name: "phone",
          type: "number",
          placeholder: "Phone",
          label: "Phone",
          readonly: editMode,
        },
        spans: 6,
      },
      {
        type: FIELD_TYPES.DATE,
        fieldProps: {
          form: updateEmployeeForm,
          name: "birthday",
          placeholder: "Birthday",
          label: "Birthday",
          readonly: editMode,
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
          form: updateEmployeeForm,
          name: "province",
          loading: isProvicesLoading,
          readonly: editMode,
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
          form: updateEmployeeForm,
          name: "district",
          loading: isDistrictsLoading,
          readonly: editMode,
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
          form: updateEmployeeForm,
          name: "wardId",
          loading: isWardsLoading,
          readonly: editMode,
        },
        spans: 4,
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form: updateEmployeeForm,
          name: "addressLine",
          placeholder: "Employee address",
          label: "Employee address",
          readonly: editMode,
        },
      },
    ];
  }, [
    updateEmployeeForm,
    districts,
    isDistrictsLoading,
    isProvicesLoading,
    isWardsLoading,
    editMode,
    provinces,
    wards,
  ]);
  return (
    <>
      <Paper
        m={rem(32)}
        p={rem(32)}
        shadow="xs"
      >
        <Flex justify={"space-between"}>
          <Text
            size="lg"
            fw={"bold"}
            fz={25}
            c={"light-blue.4"}
            pb={rem(28)}
          >
            Employee - {employeeData?.name}
          </Text>
          <Menu shadow="md">
            <Menu.Target>
              <ActionIcon
                variant="filled"
                aria-label="Settings"
              >
                <IconAdjustments
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Modify</Menu.Label>
              <Menu.Item
                onClick={async () => {
                  toggle();

                  if (!editMode) {
                    await refetch();
                  }
                }}
                leftSection={
                  <IconArrowsLeftRight
                    style={{ width: rem(14), height: rem(14) }}
                  />
                }
              >
                {editMode ? "Edit" : "Disable Edit"}
              </Menu.Item>
              <Menu.Item
                color="red"
                onClick={open}
                leftSection={
                  <IconTrash style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
        {isEmployeeDataLoading ? (
          <Loader />
        ) : (
          <FocusTrap active={!editMode}>
            <form
              onSubmit={updateEmployeeForm.onSubmit(
                ({
                  name,
                  addressLine,
                  birthday,
                  email,
                  gender,
                  phone,
                  wardId,
                }) => {
                  const createEmployeeParams: UpdateEmployeeParams = {
                    email: email ?? "",
                    name: name ?? "",
                    gender: gender ?? "",
                    addressLine,
                    birthday: birthday
                      ? dayjs(birthday).format("YYYY-MM-DD")
                      : null,
                    phone,
                    wardId: wardId ? +wardId : null,
                  };
                  updateEmployee(
                    { ...createEmployeeParams, employeeId: params.id ?? "" },
                    {
                      onSuccess() {
                        refetch();

                        notifications.show({
                          title: "Successfully",
                          message: "Update employee successfully!",
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
                    }
                  );
                }
              )}
            >
              <EditAndUpdateForm fields={fields} />
              <Group
                justify="flex-end"
                mt="md"
              >
                <Button
                  type="submit"
                  disabled={editMode}
                  loading={isUpdateEmployeeLoading}
                >
                  Update
                </Button>
              </Group>
            </form>
          </FocusTrap>
        )}
      </Paper>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Text>
            Confirm delete <Mark>{employeeData?.name}</Mark> account ?
          </Text>
        }
        // centered
      >
        <Group
          justify="flex-end"
          mt="md"
        >
          <Button
            loading={isDeleteEmployeeLoading}
            onClick={() => {
              deleteEmployee(params.id ?? "", {
                onSuccess() {
                  notifications.show({
                    title: "Successfully",
                    message: "Delete employee successfully!",
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
          <Button
            onClick={close}
            color={"red"}
            variant="outline"
            size="xs"
          >
            No
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default EmployeeDetailPage;
