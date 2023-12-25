import { TextInput, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { MdLockOutline } from 'react-icons/md';

export const ChangePasswordForm = () => {
    const form = useForm({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },

        validate: {
            oldPassword: (value) => (value.trim().length === 0 ? 'This field is required' : null),
            newPassword: (value) => (value.trim().length === 0 ? 'This field is required' : null),
            confirmPassword: (value) => (value.trim().length === 0 ? 'This field is required' : null),
        },
    });

    const onSubmitForm = (values: { oldPassword: string; newPassword: string; confirmPassword: string; }) => {
        console.log(values)
    }

    return (
        <form onSubmit={form.onSubmit((values) => onSubmitForm(values))}
            style={{ marginTop: '10px' }}>
            <TextInput
                withAsterisk
                label="Old Password"
                type='password'
                leftSection={<MdLockOutline />}
                size='md'
                {...form.getInputProps('oldPassword')}
            />

            <TextInput
                withAsterisk
                label="New Password"
                type='password'
                leftSection={<MdLockOutline />}
                size='md'
                {...form.getInputProps('newPassword')}
            />

            <TextInput
                withAsterisk
                label="Confirm New Password"
                type='password'
                leftSection={<MdLockOutline />}
                size='md'
                {...form.getInputProps('confirmPassword')}
            />

            <Group justify="flex-start" mt="md">
                <Button
                    type="submit" variant="gradient" size='md'
                    gradient={{ from: 'light-blue.5', to: 'light-blue.7', deg: 90 }}
                >Change Password</Button>
            </Group>
        </form>
    );
}