import {
  Grid,
  Group,
  Loader,
  NumberInput,
  Radio,
  Select,
  TextInput,
} from "@mantine/core";

import { DateInput } from "@mantine/dates";

const renderTextField = ({ fieldProps }: any) => {
  const { form, name, placeholder, label, required, disabled, type, readOnly } =
    fieldProps;
  return (
    <TextInput
      type={type}
      disabled={disabled}
      readOnly={readOnly}
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
    required,
    rightSection,
    readOnly,
    rightSectionWidth,
  } = fieldProps;
  if (loading) return <Loader />;

  return (
    <Select
      searchable={searchable}
      label={label}
      disabled={disabled}
      readOnly={readOnly}
      rightSectionWidth={rightSectionWidth}
      rightSectionPointerEvents="all"
      placeholder={placeholder}
      data={data}
      rightSection={rightSection}
      required={required}
      {...form.getInputProps(name)}
    />
  );
};

const renderRadio = ({ fieldProps }: any) => {
  const { name, label, description, form, data, required, readOnly } =
    fieldProps;

  return (
    <Radio.Group
      name={name}
      label={label}
      readOnly={readOnly}
      required={required}
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

const renderNumber = ({ fieldProps }: any) => {
  const { form, name, placeholder, label, required, disabled, readOnly } =
    fieldProps;
  return (
    <NumberInput
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      withAsterisk={required}
      rightSection={<></>}
      label={label}
      name={name}
      placeholder={placeholder}
      {...form.getInputProps(name)}
    />
  );
};

const renderDate = ({ fieldProps }: any) => {
  const { form, name, placeholder, label, required, disabled, readOnly } =
    fieldProps;
  return (
    <DateInput
      required={required}
      disabled={disabled}
      withAsterisk={required}
      label={label}
      readOnly={readOnly}
      placeholder={placeholder}
      {...form.getInputProps(name)}
    />
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
  DATE: "date",
};

const FORM_MAPPING = {
  [FIELD_TYPES.TEXT]: renderTextField,
  // [FIELD_TYPES.MULTILINE]: renderMultiline,
  [FIELD_TYPES.SELECT]: renderSelect,
  [FIELD_TYPES.RADIO]: renderRadio,
  [FIELD_TYPES.DATE]: renderDate,
  //   [FIELD_TYPES.MULTI_SELECT]: renderMultiSelect,
  // [FIELD_TYPES.AUTOCOMPLETE]: renderAutoComplete,
  // [FIELD_TYPES.UPLOAD]: renderUpload,
  // [FIELD_TYPES.LARGE_MULTILINE]: renderLargeMultiline,
  [FIELD_TYPES.NUMBER]: renderNumber,
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
