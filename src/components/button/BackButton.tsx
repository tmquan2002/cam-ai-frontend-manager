import { ActionIcon, rem } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <ActionIcon
      variant="outline"
      aria-label="Settings"
      color="gray"
      w={rem(36)}
      h={rem(36)}
      onClick={() => navigate(-1)}
    >
      <IconArrowLeft
        style={{ width: "70%", height: "70%" }}
        stroke={1.5}
      />
    </ActionIcon>
  );
};

export default BackButton;
