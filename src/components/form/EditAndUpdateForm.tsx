import { Grid, Group, Loader, Radio, Select, TextInput } from "@mantine/core";

const renderTextField = ({ fieldProps }: any) => {
  const { form, name, placeholder, label, required, disabled } = fieldProps;
  return (
    <TextInput
      disabled={disabled}
      withAsterisk={required}
      label={label}
      placeholder={placeholder}
      {...form.getInputProps(name)}
    />
  );
};

const renderSelect = ({ fieldProps }: any) => {
  const {
    label,
    placeholder,
    data,
    form,
    name,
    disabled,
    searchable,
    loading,
  } = fieldProps;
  if (loading) return <Loader />;

  // console.log(value, setValue);

  return (
    <Select
      searchable={searchable}
      label={label}
      disabled={disabled}
      placeholder={placeholder}
      data={data}
      {...form.getInputProps(name)}
    />
  );
};

const renderRadio = ({ fieldProps }: any) => {
  const { name, label, description, form, data } = fieldProps;

  return (
    <Radio.Group
      name={name}
      label={label}
      description={description}
      {...form.getInputProps(name)}
    >
      <Group mt={"xs"}>
        {data.map(({ value, label }: { value: string; label: string }) => (
          <Radio
            key={value}
            value={value}
            label={label}
          />
        ))}
      </Group>
    </Radio.Group>
  );
};

export const FIELD_TYPES = {
  TEXT: "text",
  SELECT: "select",
  RADIO: "radio",
  AUTOCOMPLETE: "autocomplete",
  UPLOAD: "upload",
  MULTILINE: "multiline",
  LARGE_MULTILINE: "large_multiline",
  NUMBER: "number",
  IMAGE_PICKER: "image_picker",
  MULTI_SELECT: "multi_select",
};

const FORM_MAPPING = {
  [FIELD_TYPES.TEXT]: renderTextField,
  // [FIELD_TYPES.MULTILINE]: renderMultiline,
  [FIELD_TYPES.SELECT]: renderSelect,
  [FIELD_TYPES.RADIO]: renderRadio,
  //   [FIELD_TYPES.MULTI_SELECT]: renderMultiSelect,
  // [FIELD_TYPES.AUTOCOMPLETE]: renderAutoComplete,
  // [FIELD_TYPES.UPLOAD]: renderUpload,
  // [FIELD_TYPES.LARGE_MULTILINE]: renderLargeMultiline,
  // [FIELD_TYPES.NUMBER]: renderNumber,
  //   [FIELD_TYPES.IMAGE_PICKER]: renderImagePicker,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EditAndUpdateForm = ({ fields }: any) => {
  return (
    <Grid>
      {fields.map(({ type, fieldProps, spans }: any, index: number) => {
        return (
          <Grid.Col
            span={spans ?? 12}
            key={index}
          >
            {FORM_MAPPING[type]({
              fieldProps: fieldProps,
            })}
          </Grid.Col>
        );
      })}
    </Grid>
  );
};

export default EditAndUpdateForm;
