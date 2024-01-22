import { Box, Grid, Select, TextInput } from "@mantine/core";

const renderTextField = ({ fieldProps }: any) => {
  const { form, name, placeholder, label, required } = fieldProps;
  return (
    <TextInput
      withAsterisk={required}
      label={label}
      placeholder={placeholder}
      {...form.getInputProps(name)}
    />
  );
};

const renderSelect = ({ fieldProps }: any) => {
  const { label, placeholder, data, form, name } = fieldProps;
  return (
    <Select
      label={label}
      placeholder={placeholder}
      data={data}
      {...form.getInputProps(name)}
    />
  );
};

export const FIELD_TYPES = {
  TEXT: "text",
  SELECT: "select",
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
