import {
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
  SimpleGrid,
  Flex,
  Divider,
  Paper,
  TextInput,
  Textarea,
  ActionIcon,
  Box,
} from "@mantine/core";
import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
  IconCheck,
  IconCookie,
  IconGauge,
  IconLock,
  IconMessage2,
  IconUser,
} from "@tabler/icons-react";
import classes from "./CommonLandingPage.module.scss";
import { ContactIconsList } from "./ContactIcons";
import contactbg from "../../../assets/images/contactbg.svg";
import { useNavigate } from "react-router-dom";

export const MOCKDATA = [
  {
    icon: IconGauge,
    title: "Extreme performance",
    description:
      "This dust is actually a powerful poison that will even make a pro wrestler sick, Regice cloaks itself with frigid air of -328 degrees Fahrenheit",
  },
  {
    icon: IconUser,
    title: "Privacy focused",
    description:
      "People say it can run at the same speed as lightning striking, Its icy body is so cold, it will not melt even if it is immersed in magma",
  },
  {
    icon: IconCookie,
    title: "No third parties",
    description:
      "They’re popular, but they’re rare. Trainers who show them off recklessly may be targeted by thieves",
  },
  {
    icon: IconLock,
    title: "Secure by default",
    description:
      "Although it still can’t fly, its jumping power is outstanding, in Alola the mushrooms on Paras don’t grow up quite right",
  },
  {
    icon: IconMessage2,
    title: "24/7 Support",
    description:
      "Rapidash usually can be seen casually cantering in the fields and plains, Skitty is known to chase around after its own tail",
  },
];

interface FeatureProps {
  icon: React.FC<any>;
  title: React.ReactNode;
  description: React.ReactNode;
}

export function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <div>
      <ThemeIcon
        variant="light"
        size={40}
        radius={40}
      >
        <Icon
          style={{ width: rem(18), height: rem(18) }}
          stroke={1.5}
        />
      </ThemeIcon>
      <Text
        mt="sm"
        mb={7}
      >
        {title}
      </Text>
      <Text
        size="sm"
        c="dimmed"
        lh={1.6}
      >
        {description}
      </Text>
    </div>
  );
}

const CommonLandingPage = () => {
  const navigate = useNavigate();
  const features = MOCKDATA.map((feature, index) => (
    <Feature
      {...feature}
      key={index}
    />
  ));

  return (
    <>
      <Flex
        justify={"space-between"}
        px={24}
        py={12}
      >
        <IconBrandInstagram size={44} />
        <Group>
          <Button
            variant="default"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </Button>
          <Button variant="filled">Signup</Button>
        </Group>
      </Flex>
      <Divider />
      <Container size="lg">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes["header-title"]}>
              A <span className={classes.highlight}>modern</span> React <br />{" "}
              components library
            </Title>
            <Text
              c="dimmed"
              mt="md"
            >
              Build fully functional accessible web applications faster than
              ever – Mantine includes more than 120 customizable components and
              hooks to cover you in any situation
            </Text>

            <List
              mt={30}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon
                  size={20}
                  radius="xl"
                >
                  <IconCheck
                    style={{ width: rem(12), height: rem(12) }}
                    stroke={1.5}
                  />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>TypeScript based</b> – build type safe applications, all
                components and hooks export types
              </List.Item>
              <List.Item>
                <b>Free and open source</b> – all packages have MIT license, you
                can use Mantine in any project
              </List.Item>
              <List.Item>
                <b>No annoying focus ring</b> – focus ring will appear only when
                user navigates with keyboard
              </List.Item>
            </List>

            <Group mt={30}>
              <Button
                radius="xl"
                size="md"
                className={classes.control}
              >
                Get started
              </Button>
              <Button
                variant="default"
                radius="xl"
                size="md"
                className={classes.control}
              >
                Source code
              </Button>
            </Group>
          </div>
          <Image
            src={
              "https://cdn.dribbble.com/userupload/9835204/file/original-85a0ea5c00117777b173ab819581cbb4.png?resize=1024x768"
            }
            className={classes.image}
          />
        </div>
      </Container>
      <Container
        size="lg"
        className={classes.wrapper}
      >
        <Title className={classes.title}>
          Integrate effortlessly with any technology stack
        </Title>

        <Container
          size={560}
          p={0}
        >
          <Text
            size="sm"
            className={classes.description}
          >
            Every once in a while, you’ll see a Golbat that’s missing some
            fangs. This happens when hunger drives it to try biting a Steel-type
            Pokémon.
          </Text>
        </Container>

        <SimpleGrid
          mt={60}
          cols={{ base: 1, sm: 2, md: 3 }}
          spacing={{ base: "xl", md: 50 }}
          verticalSpacing={{ base: "xl", md: 50 }}
        >
          {features}
        </SimpleGrid>
      </Container>
      <Container>
        <Paper
          shadow="md"
          radius="lg"
        >
          <div className={classes["contact-wrapper"]}>
            <div
              className={classes.contacts}
              style={{ backgroundImage: `url(${contactbg})` }}
            >
              <Text
                fz="lg"
                fw={700}
                className={classes["contact-tile"]}
                c="#fff"
              >
                Contact information
              </Text>

              <ContactIconsList />
            </div>

            <form
              className={classes["contact-form"]}
              onSubmit={(event) => event.preventDefault()}
            >
              <Text
                fz="lg"
                fw={700}
                className={classes["contact-tile"]}
              >
                Get in touch
              </Text>

              <div className={classes.fields}>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <TextInput
                    label="Your name"
                    placeholder="Your name"
                  />
                  <TextInput
                    label="Your email"
                    placeholder="hello@mantine.dev"
                    required
                  />
                </SimpleGrid>

                <TextInput
                  mt="md"
                  label="Subject"
                  placeholder="Subject"
                  required
                />

                <Textarea
                  mt="md"
                  label="Your message"
                  placeholder="Please include all relevant information"
                  minRows={3}
                />

                <Group
                  justify="flex-end"
                  mt="md"
                >
                  <Button
                    type="submit"
                    className={classes["contact-control"]}
                  >
                    Send message
                  </Button>
                </Group>
              </div>
            </form>
          </div>
        </Paper>
      </Container>
      <div className={classes.footer}>
        <Box className={classes.inner}>
          <IconBrandInstagram size={40} />
          <Group
            gap={0}
            className={classes.links}
            justify="flex-end"
            wrap="nowrap"
          >
            <ActionIcon
              size="lg"
              color="gray"
              variant="subtle"
            >
              <IconBrandTwitter
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </ActionIcon>
            <ActionIcon
              size="lg"
              color="gray"
              variant="subtle"
            >
              <IconBrandYoutube
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </ActionIcon>
            <ActionIcon
              size="lg"
              color="gray"
              variant="subtle"
            >
              <IconBrandInstagram
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Group>
        </Box>
      </div>
    </>
  );
};

export default CommonLandingPage;
