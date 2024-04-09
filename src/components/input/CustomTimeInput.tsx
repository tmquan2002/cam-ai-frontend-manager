import { ActionIcon, rem } from "@mantine/core";
import { TimeInput, TimeInputProps } from "@mantine/dates";
import { IconClock } from "@tabler/icons-react";
import { useRef } from "react";

const CustomTimeInput = (props: TimeInputProps) => {
  const ref = useRef<HTMLInputElement>(null);

  const pickerControl = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={(e) => {
        e.preventDefault()
        ref.current?.showPicker()
      }}
    >
      <IconClock
        style={{ width: rem(16), height: rem(16) }}
        stroke={1.5}
      />
    </ActionIcon>
  );

  return (
    <TimeInput
      {...props}
      withSeconds
      ref={ref}
      rightSection={pickerControl}
    />
  );
};

export default CustomTimeInput;
