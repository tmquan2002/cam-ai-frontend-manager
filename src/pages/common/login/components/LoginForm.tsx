import { TextInput, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';

export const LoginForm = () => {
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },

        validate: {
            email: (value) => (
                value.trim().length === 0 ? "Email is required" :
                    /^\S+@\S+$/.test(value) ? null : 'Invalid email'
            ),
            password: (value) => (value.trim().length === 0 ? 'Password is required' : null),
        },
    });

    return (
        <form onSubmit={form.onSubmit((values) => console.log(values))}
            style={{ marginTop: '20px', textAlign: 'left' }}>
            <TextInput
                withAsterisk
                label="Email"
                placeholder="your@email.com"
                size='md'
                {...form.getInputProps('email')}
            />

            <TextInput
                withAsterisk
                label="Password"
                type='password'
                size='md'
                {...form.getInputProps('password')}
            />

            <Group justify="flex-start" mt="md">
                <Button
                    type="submit" variant="gradient" size='md'
                    gradient={{ from: 'light-blue.5', to: 'light-blue.7', deg: 90 }}
                >Login</Button>
            </Group>
        </form>
    );
}