import { Button, Group } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CreateAccountParams } from "../../../apis/AccountAPI";
import EditAndUpdateForm, { FIELD_TYPES, } from "../../../components/form/EditAndUpdateForm";
import { useCreateAccount } from "../../../hooks/useCreateAccount";
import { useGetBrandList } from "../../../hooks/useGetBrandList";
import { useGetDistrictList } from "../../../hooks/useGetDistrictList";
import { useGetProvinceList } from "../../../hooks/useGetProvinceList";
import { useGetWardList } from "../../../hooks/useGetWardList";
import { Gender, Role } from "../../../models/CamAIEnum";
import { ResponseErrorDetail } from "../../../models/Response";
import { useTaskBrand } from "../../../routes/BrandRoute";
import { EMAIL_REGEX, PHONE_REGEX } from "../../../types/constant";
import { mapLookupToArray } from "../../../utils/helperFunction";

export type CreateAccountField = {
    email: string;
    name: string;
    gender: Gender | null;
    phone: string;
    birthday: Date | null;
    wardId: string;
    addressLine: string;
    province: string;
    district: string;
};

const CreateShopManagerForm = ({ mode, close, refetch }: { mode: "manager" | "shop"; close?: () => void; refetch?: () => {} }) => {
    const navigate = useNavigate();
    const { taskId } = useTaskBrand();
    const { data: brandList, isLoading: isGetBrandListLoading } = useGetBrandList(
        { size: 1 }
    );

    const { mutate: createAccount, isLoading: isCreateAccountLoading } =
        useCreateAccount();

    const createAccountForm = useForm<CreateAccountField>({
        initialValues: {
            email: "",
            name: "",
            gender: null,
            phone: "",
            birthday: null,
            addressLine: "",
            province: "",
            district: "",
            wardId: "",
        },

        validate: {
            name: isNotEmpty("Name is required"),
            email: (value: string) => isEmpty(value) ? "Email is required"
                : EMAIL_REGEX.test(value) ? null : "Invalid email - ex: name@gmail.com",
            gender: isNotEmpty("Please select gender"),
            phone: (value) => isEmpty(value) ? null :
                PHONE_REGEX.test(value) ? null : "A phone number should have a length of 10-12 characters",
        },
    });

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
                    disabled: taskId != undefined,
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
                    disabled: taskId != undefined,
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
                    disabled: taskId != undefined,
                },
                spans: 4,
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
                    disabled: taskId != undefined,
                },
                spans: 4,
            },
            {
                type: FIELD_TYPES.DATE,
                fieldProps: {
                    form: createAccountForm,
                    name: "birthday",
                    placeholder: "Birthday",
                    label: "Birthday",
                    disabled: taskId != undefined,
                },
                spans: 4,
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
                    disabled: taskId != undefined,
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
                    disabled: taskId != undefined,
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
                    disabled: taskId != undefined,
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
                    disabled: taskId != undefined,
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

    return (
        <form
            onReset={createAccountForm.onReset}
            autoComplete="off"
            onSubmit={createAccountForm.onSubmit(
                ({ addressLine, birthday, email, gender, name, phone, wardId, }: CreateAccountField) => {
                    const params: CreateAccountParams = {
                        addressLine,
                        birthday: dayjs(birthday).format("YYYY-MM-DD"),
                        brandId: brandList?.values[0].id ?? "",
                        email: email ?? null,
                        gender: gender ?? null,
                        name,
                        phone: phone ?? null,
                        role: Role.ShopManager,
                        wardId: isEmpty(wardId) ? null : +wardId,
                    };

                    createAccount(params, {
                        onSuccess() {
                            notifications.show({
                                title: "Successfully",
                                message: "Create account successfully!",
                            });
                            if (mode == "manager") {
                                navigate("/brand/account");
                            } else if (close && refetch) {
                                close();
                                refetch();
                            }
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
    );
};

export default CreateShopManagerForm;
