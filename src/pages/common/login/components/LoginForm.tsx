import { TextInput, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { MdEmail, MdLockOutline } from "react-icons/md";

interface LoginFormProp {
    modalOpen: boolean,
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const LoginForm = (props: LoginFormProp) => {
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

    const onSubmitForm = (values: { email: string; password: string; }) => {
        console.log(values)
        props.setModalOpen(true)
    }

    return (
        <form onSubmit={form.onSubmit((values) => onSubmitForm(values))}
            style={{ textAlign: 'left' }}>
            <TextInput
                withAsterisk
                label="Email"
                placeholder="your@email.com"
                leftSection={<MdEmail />}
                size='md'
                {...form.getInputProps('email')}
            />

            <TextInput
                withAsterisk
                label="Password"
                type='password'
                leftSection={<MdLockOutline />}
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