import { ActionIcon, rem } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

type BackButtonParams = {
  w?: string;
  h?: string;
  color?: string;
  path?: string;
}
const BackButton = (params: BackButtonParams) => {
  const navigate = useNavigate();
  return (
    <ActionIcon
      variant="outline"
      aria-label="Settings"
      color={params.color ?? "gray"}
      w={params.w || rem(36)}
      h={params.h || rem(36)}
      onClick={() => {
        params.path ? navigate(params.path) : navigate(-1)
      }}
    >
      <IconArrowLeft
        style={{ width: "70%", height: "70%" }}
        stroke={1.5}
      />
    </ActionIcon>
  );
};

export default BackButton;
