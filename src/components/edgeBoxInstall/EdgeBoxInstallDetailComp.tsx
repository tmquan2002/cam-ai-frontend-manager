import {
  Badge,
  Box,
  Divider,
  Flex,
  Group,
  Image,
  SimpleGrid,
  Text,
  rem,
} from "@mantine/core";
import {
  EdgeBoxActivationStatus,
  EdgeBoxLocation,
  EdgeBoxStatus,
  EdgeboxInstallStatus,
} from "../../models/CamAIEnum";
import { EdgeBoxInstallDetail } from "../../models/Edgebox";

const EdgeboxLocationBadge = ({ location }: { location: EdgeBoxLocation }) => {
  switch (location) {
    case EdgeBoxLocation.Disposed:
      return <Badge color="teal">{EdgeBoxLocation.Disposed}</Badge>;
    case EdgeBoxLocation.Idle:
      return <Badge color={"blue"}>{EdgeBoxLocation.Idle}</Badge>;
    case EdgeBoxLocation.Installing:
      return <Badge color={"yellow"}>{EdgeBoxLocation.Installing}</Badge>;
    case EdgeBoxLocation.Occupied:
      return <Badge color={"green"}>{EdgeBoxLocation.Occupied}</Badge>;
    case EdgeBoxLocation.Uninstalling:
      return <Badge color={"orange"}>{EdgeBoxLocation.Uninstalling}</Badge>;
    case undefined:
      return <Badge>Empty</Badge>;
  }
};

const EdgeboxStatusBadge = ({ status }: { status: EdgeBoxStatus }) => {
  switch (status) {
    case EdgeBoxStatus.Active:
      return <Badge color="green">{EdgeBoxStatus.Active}</Badge>;
    case EdgeBoxStatus.Broken:
      return <Badge color={"orange"}>{EdgeBoxStatus.Broken}</Badge>;
    case EdgeBoxStatus.Inactive:
      return <Badge color={"red"}>{EdgeBoxStatus.Inactive}</Badge>;
    case EdgeBoxStatus.Disposed:
      return <Badge color={"gray"}>{EdgeBoxStatus.Disposed}</Badge>;
    case undefined:
      return <Badge>Empty</Badge>;
  }
};

const EdgeBoxActivationStatusBadge = ({
  activationStatus,
}: {
  activationStatus: EdgeBoxActivationStatus;
}) => {
  switch (activationStatus) {
    case EdgeBoxActivationStatus.Activated:
      return <Badge color="green">{EdgeBoxActivationStatus.Activated}</Badge>;
    case EdgeBoxActivationStatus.Pending:
      return <Badge color={"orange"}>{EdgeBoxActivationStatus.Pending}</Badge>;
    case EdgeBoxActivationStatus.NotActivated:
      return <Badge color={"gray"}>NOT ACTIVATED</Badge>;
    case EdgeBoxActivationStatus.Failed:
      return <Badge color={"red"}>{EdgeBoxActivationStatus.Failed}</Badge>;
    case undefined:
      return <Badge>Empty</Badge>;
  }
};

const EdgeboxInstallStatusBadge = ({
  installStatus,
}: {
  installStatus: EdgeboxInstallStatus;
}) => {
  switch (installStatus) {
    case EdgeboxInstallStatus.Working:
      return <Badge color="green">{EdgeboxInstallStatus.Working}</Badge>;
    case EdgeboxInstallStatus.Unhealthy:
      return <Badge color={"yellow"}>{EdgeboxInstallStatus.Unhealthy}</Badge>;
    case EdgeboxInstallStatus.Disabled:
      return <Badge color={"gray"}>{EdgeboxInstallStatus.Disabled}</Badge>;
    case EdgeboxInstallStatus.New:
      return <Badge color={"blue"}>{EdgeboxInstallStatus.New}</Badge>;
    case EdgeboxInstallStatus.Connected:
      return <Badge color={"teal"}>{EdgeboxInstallStatus.Connected}</Badge>;
    case undefined:
      return <Badge>Empty</Badge>;
  }
};

export const EdgeBoxInstallDetailComp = ({
  edgeBoxInstall,
}: {
  edgeBoxInstall: EdgeBoxInstallDetail;
}) => {
  const edgeBox = edgeBoxInstall.edgeBox;
  if (edgeBoxInstall.edgeBoxInstallStatus == EdgeboxInstallStatus.Disabled) {
    return <></>;
  }

  return (
    <>
      <Group
        justify="space-between"
        align="center"
        pb={rem(20)}
        gap={"sm"}
      >
        <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
          Edge box
        </Text>
      </Group>
      <Flex>
        <Image
          radius={"md"}
          src={
            "https://cdn.dribbble.com/users/40756/screenshots/2917981/media/56fae174592893d88f6ca1be266aaaa6.png?resize=450x338&vertical=center"
          }
        />
        <Box ml={rem(40)} style={{ flex: 1 }}>
          <Group gap={rem(40)}>
            <Box>
              <Text fw={500} c={"dimmed"}>
                Name
              </Text>
              <Text fw={500}>{edgeBox.name}</Text>
            </Box>

            <Box>
              <Text fw={500} c={"dimmed"}>
                Edgebox status
              </Text>
              <EdgeboxStatusBadge status={edgeBox.edgeBoxStatus} />
            </Box>

            <Box>
              <Text fw={500} c={"dimmed"}>
                Edgebox location
              </Text>
              <EdgeboxLocationBadge location={edgeBox.edgeBoxLocation} />
            </Box>

            <Box>
              <Text fw={500} c={"dimmed"}>
                Activation status
              </Text>
              <EdgeBoxActivationStatusBadge
                activationStatus={edgeBoxInstall.activationStatus}
              />
            </Box>

            <Box>
              <Text fw={500} c={"dimmed"}>
                Install status
              </Text>
              <EdgeboxInstallStatusBadge
                installStatus={edgeBoxInstall.edgeBoxInstallStatus}
              />
            </Box>
          </Group>
          <Divider my={rem(20)} />
          <Group>
            <Text miw={rem(120)} fw={600}>
              Description :
            </Text>
            <Text>{edgeBox.edgeBoxModel?.description}</Text>
          </Group>
          <Divider my={rem(20)} />
          <SimpleGrid cols={2}>
            <Group>
              <Text miw={rem(120)} fw={600}>
                Model name :
              </Text>
              <Text>{edgeBox.edgeBoxModel?.name}</Text>
            </Group>

            <Group>
              <Text miw={rem(120)} fw={600}>
                Model code :
              </Text>
              <Text>{edgeBox?.edgeBoxModel?.modelCode}</Text>
            </Group>
            <Group>
              <Text miw={rem(120)} fw={600}>
                Manufacturer :
              </Text>
              <Text>{edgeBox?.edgeBoxModel?.manufacturer}</Text>
            </Group>
            <Group>
              <Text miw={rem(120)} fw={600}>
                CPU :
              </Text>
              <Text>{edgeBox?.edgeBoxModel?.cpu}</Text>
            </Group>
            <Group>
              <Text miw={rem(120)} fw={600}>
                RAM :
              </Text>
              <Text>{edgeBox?.edgeBoxModel?.ram}</Text>
            </Group>
            <Group>
              <Text miw={rem(120)} fw={600}>
                Storage :
              </Text>
              <Text>{edgeBox?.edgeBoxModel?.storage}</Text>
            </Group>
            <Group>
              <Text miw={rem(120)} fw={600}>
                OS :
              </Text>
              <Text>{edgeBox?.edgeBoxModel?.os}</Text>
            </Group>
          </SimpleGrid>
        </Box>
      </Flex>
    </>
  );
};
