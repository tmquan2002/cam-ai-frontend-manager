import { Button, Group } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
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
import { phoneRegex } from "../../../types/constant";
import { getDateFromSetYear, mapLookupToArray } from "../../../utils/helperFunction";

export type CreateAccountField = {
    email: string;
    name: string;
    gender: Gender;
    phone: string;
    birthday: Date | null;
    wardId: string;
    addressLine: string;
    province: string;
    district: string;
};

const CreateShopManagerForm = ({ mode, close, refetch }: { mode: "manager" | "shop"; close?: () => void; refetch?: () => {} }) => {
    const navigate = useNavigate();
    const { data: brandList, isLoading: isGetBrandListLoading } = useGetBrandList(
        { size: 1 }
    );

    const { mutate: createAccount, isLoading: isCreateAccountLoading } =
        useCreateAccount();

    const createAccountForm = useForm<CreateAccountField>({
        initialValues: {
            email: "",
            name: "",
            gender: Gender.Male,
            phone: "",
            birthday: new Date("01/01/2000"),
            addressLine: "",
            province: "",
            district: "",
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
                    maxDate: getDateFromSetYear(18),
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
                        email,
                        gender: gender ?? null,
                        name,
                        phone,
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
