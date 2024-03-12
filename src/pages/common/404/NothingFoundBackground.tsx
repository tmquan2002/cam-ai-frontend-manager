import { Container, Title, Text, Button, Group } from '@mantine/core';
import { Illustration } from './Illustration';
import styled from './NothingFoundBackground.module.scss';
import { useNavigate } from 'react-router-dom';

export function NothingFoundBackground() {
  const navigate = useNavigate();

  return (
    <Container className={styled.root}>
      <div className={styled.inner}>
        <Illustration className={styled.image} />
        <div className={styled.content}>
          <Title className={styled.title}>Nothing to see here</Title>
          <Text c="dimmed" size="lg" className={styled.description}>
            Page you are trying to open does not exist. You may have mistyped the address, or the page has been moved to another URL. If you think this is an error contact support.
          </Text>
          <Group justify="center">
            <Button size="md" onClick={() => navigate(-1)}>Take me back to previous page</Button>
          </Group>
        </div>
      </div>
    </Container>
  );
}