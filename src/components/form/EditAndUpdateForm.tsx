/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FileInput,
  Grid,
  Group,
  Loader,
  NumberInput,
  PasswordInput,
  Radio,
  Select,
  TextInput,
  rem,
} from "@mantine/core";

import { DateInput, DateTimePicker } from "@mantine/dates";
import CustomTimeInput from "../input/CustomTimeInput";

const renderTextField = ({ fieldProps }: any) => {
  const {
    form,
    name,
    placeholder,
    label,
    required,
    disabled,
    type,
    readonly,
    radius,
    fontWeight,
  } = fieldProps;
  return (
    <TextInput
      type={type}
      disabled={disabled}
      readOnly={readonly}
      withAsterisk={required}
      label={label}
      placeholder={placeholder}
      radius={radius ?? "sm"}
      style={{
        fontWeight: fontWeight ?? 400,
      }}
      styles={{
        label: {
          marginBottom: rem(8),
        },
      }}
      {...form.getInputProps(name)}
    />
  );
};
const renderPasswordInput = ({ fieldProps }: any) => {
  const {
    form,
    name,
    placeholder,
    label,
    required,
    disabled,
    readonly,
    radius,
    fontWeight,
  } = fieldProps;

  return (
    <PasswordInput
      disabled={disabled}
      readOnly={readonly}
      withAsterisk={required}
      label={label}
      radius={radius ?? "sm"}
      style={{
        fontWeight: fontWeight ?? 400,
      }}
      styles={{
        label: {
          fontWeight: 500,
          fontSize: rem(14),
          marginBottom: rem(8),
        },
      }}
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
    readonly,
    rightSectionWidth,
    fontWeight,
    radius,
  } = fieldProps;
  if (loading) return <Loader />;

  return (
    <Select
      searchable={searchable}
      label={label}
      disabled={disabled}
      readOnly={readonly}
      rightSectionWidth={rightSectionWidth}
      rightSectionPointerEvents="all"
      placeholder={placeholder}
      data={data}
      radius={radius ?? "sm"}
      styles={{
        label: {
          fontWeight: 500,
          fontSize: rem(14),
          marginBottom: rem(8),
        },
      }}
      rightSection={rightSection}
      style={{
        fontWeight: fontWeight ?? 400,
      }}
      required={required}
      {...form.getInputProps(name)}
    />
  );
};

const renderRadio = ({ fieldProps }: any) => {
  const { name, label, description, form, data, required, radius, fontWeight } =
    fieldProps;

  return (
    <Radio.Group
      name={name}
      label={label}
      required={required}
      description={description}
      {...form.getInputProps(name)}
      radius={radius ?? "sm"}
      style={{
        fontWeight: fontWeight ?? 400,
      }}
      styles={{
        label: {
          fontWeight: 500,
          fontSize: rem(14),
          marginBottom: rem(8),
        },
      }}
    >
      <Group mt={"xs"}>
        {data.map(({ key, value }: { key: string; value: string }) => (
          <Radio key={key} value={key} label={value} />
        ))}
      </Group>
    </Radio.Group>
  );
};

const renderNumber = ({ fieldProps }: any) => {
  const {
    form,
    name,
    placeholder,
    label,
    required,
    disabled,
    readonly,
    radius,
    fontWeight,
  } = fieldProps;
  return (
    <NumberInput
      required={required}
      disabled={disabled}
      readOnly={readonly}
      withAsterisk={required}
      rightSection={<></>}
      label={label}
      name={name}
      radius={radius ?? "sm"}
      style={{
        fontWeight: fontWeight ?? 400,
      }}
      styles={{
        label: {
          fontWeight: 500,
          fontSize: rem(14),
          marginBottom: rem(8),
        },
      }}
      placeholder={placeholder}
      {...form.getInputProps(name)}
    />
  );
};

const renderDate = ({ fieldProps }: any) => {
  const { form, name, placeholder, label, required, disabled, readonly, maxDate, radius, fontWeight } =
    fieldProps;
  return (
    <DateInput
      required={required}
      disabled={disabled}
      withAsterisk={required}
      label={label}
      maxDate={maxDate}
      readOnly={readonly}
      radius={radius ?? "sm"}
      placeholder={placeholder}
      defaultDate={new Date(2000, 0)}
      style={{
        fontWeight: fontWeight ?? 400,
      }}
      styles={{
        label: {
          fontWeight: 500,
          fontSize: rem(14),
          marginBottom: rem(8),
        },
      }}
      {...form.getInputProps(name)}
    />
  );
};

const renderDateTime = ({ fieldProps }: any) => {
  const {
    form,
    name,
    placeholder,
    label,
    required,
    disabled,
    readonly, withSeconds,
    radius,
    fontWeight,
  } = fieldProps;
  return (
    <DateTimePicker
      required={required}
      disabled={disabled}
      withAsterisk={required}
      label={label}
      readOnly={readonly}
      radius={radius ?? "sm"}
      style={{
        fontWeight: fontWeight ?? 400,
      }}
      styles={{
        label: {
          fontWeight: 500,
          fontSize: rem(14),
          marginBottom: rem(8),
        },
      }}
      placeholder={placeholder}
      withSeconds={withSeconds}
      {...form.getInputProps(name)}
    />
  );
};

const renderTime = ({ fieldProps }: any) => {
  const { form, name, placeholder, label, required, disabled, readonly, withSeconds, radius, fontWeight } =
    fieldProps;
  return (
    <CustomTimeInput
      // required={required}
      withSeconds={withSeconds}
      disabled={disabled}
      withAsterisk={required}
      radius={radius ?? "sm"}
      style={{
        fontWeight: fontWeight ?? 400,
      }}
      label={label}
      readOnly={readonly}
      placeholder={placeholder}
      styles={{
        label: {
          fontWeight: 500,
          fontSize: rem(14),
          marginBottom: rem(8),
        },
      }}
      {...form.getInputProps(name)}
    />
  );
};

const renderFile = ({ fieldProps }: any) => {
  const { form, name, placeholder, label, required, disabled, accept, multiple, readOnly, description, width } =
    fieldProps;
  return (
    <FileInput
      accept={accept}
      disabled={disabled}
      readOnly={readOnly}
      description={description}
      withAsterisk={required}
      label={label}
      placeholder={placeholder}
      multiple={multiple}
      w={width}
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
  DATE_TIME: "date_time",
  PASSWORD_INPUT: "password_input",
  TIME: "time",
  FILE: "file",
};

const FORM_MAPPING = {
  [FIELD_TYPES.TEXT]: renderTextField,
  // [FIELD_TYPES.MULTILINE]: renderMultiline,
  [FIELD_TYPES.SELECT]: renderSelect,
  [FIELD_TYPES.RADIO]: renderRadio,
  [FIELD_TYPES.DATE]: renderDate,
  [FIELD_TYPES.DATE_TIME]: renderDateTime,
  //   [FIELD_TYPES.MULTI_SELECT]: renderMultiSelect,
  // [FIELD_TYPES.AUTOCOMPLETE]: renderAutoComplete,
  // [FIELD_TYPES.UPLOAD]: renderUpload,
  // [FIELD_TYPES.LARGE_MULTILINE]: renderLargeMultiline,
  [FIELD_TYPES.NUMBER]: renderNumber,
  //   [FIELD_TYPES.IMAGE_PICKER]: renderImagePicker,
  [FIELD_TYPES.PASSWORD_INPUT]: renderPasswordInput,
  [FIELD_TYPES.TIME]: renderTime,
  [FIELD_TYPES.FILE]: renderFile,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EditAndUpdateForm = ({ fields }: any) => {
  return (
    <Grid gutter={rem(16)}>
      {fields.map(({ type, fieldProps, spans, margin }: any, index: number) => {
        return (
          <Grid.Col span={spans ?? 12} key={index} m={margin ?? 0}>
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
