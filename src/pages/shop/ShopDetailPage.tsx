import { Box, Button, Group, LoadingOverlay, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useMemo } from "react";
import EditAndUpdateForm, {
  FIELD_TYPES,
} from "../../components/form/EditAndUpdateForm";
import { useGetShopList } from "../../hooks/useGetShopList";
import { notifications } from "@mantine/notifications";
import { useUpdateShopById } from "../../hooks/useUpdateShopById";

export type FormFieldValue = {
  name: string;
  phone: string;
  wardId: string;
  addressLine: string;
  brandName: string;
};

const ShopDetailPage = () => {
  const { data, isLoading } = useGetShopList({ size: 1 });
  const { mutate: updateShop, isLoading: updateShopLoading } =
    useUpdateShopById();

  const form = useForm<FormFieldValue>({
    initialValues: {
      name: "",
      phone: "",
      wardId: "",
      addressLine: "",
      brandName: "",
    },

    validate: {},
  });

  useEffect(() => {
    if (data) {
      const { values } = data;
      const initialData: FormFieldValue = {
        name: values[0].name,
        phone: values[0].phone,
        wardId: values[0].wardId,
        addressLine: values[0].addressLine,
        brandName: values[0].brand.name,
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
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
          name: "addressLine",
          placeholder: "Shop address",
          label: "Shop address",
          required: true,
        },
      },
      {
        type: FIELD_TYPES.TEXT,
        fieldProps: {
          form,
          name: "brandName",
          placeholder: "Brand",
          label: "Shop",
          required: true,
        },
      },
      {
        type: FIELD_TYPES.SELECT,
        fieldProps: {
          label: "ward",
          placeholder: "Ward",
          data: ["test1", "test2"],
          form,
          name: "wardId",
        },
      },
    ];
  }, [form]);

  return (
    <>
      <Box pos="relative">
        <LoadingOverlay
          visible={isLoading || updateShopLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <form
          onSubmit={form.onSubmit((values) => {
            const { brandName, ...rest } = values;
            console.log(values);
            updateShop(
              {
                shopId: data?.values[0].id ?? "0",
                ...rest,
              },
              {
                onSuccess(data, variables, context) {
                  notifications.show({
                    title: "Default notification",
                    message: "Hey there, your code is awesome! 🤥",
                  });
                },
              }
            );
          })}
        >
          <EditAndUpdateForm fields={fields} />
          <Group
            justify="flex-end"
            mt="md"
          >
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Box>
    </>
  );
};

export default ShopDetailPage;
