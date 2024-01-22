import { TextInput, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { MdEmail, MdLockOutline } from "react-icons/md";
import { useLogin } from '../../../../hooks/useLogin';
import { LoginParams } from '../../../../apis/LoginAPI';

interface LoginFormProp {
    modalOpen: boolean,
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const LoginForm = (props: LoginFormProp) => {
    const {
        mutate: login,
        isLoading: isCreatePlanLoading,
        error: errorCreate,
        data: dataCreate,
    } = useLogin();

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },

        validate: {
            email: (value) => (
                value.trim().length === 0 ? "Email is required" :
                    /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
                        .test(value) ? null : 'Invalid email'
            ),
            password: (value) => (value.trim().length === 0 ? 'Password is required' : null),
        },
    });

    const onSubmitForm = async (values: { email: string; password: string; }) => {
        console.log(values)

        var loginParams: LoginParams = {
            username: values.email,
            password: values.password
        }

        await login(loginParams, {
            onSuccess(data, variables, context) {
                //TODO: Need to handle if this manager is new or not
                //TODO: Handle refresh token, access token
                console.log(data)
                if (data) {
                    console.log("OK")
                }
            },
            onError(error, variables, context) {
                props.setModalOpen(true)
                console.log(error);
            },
        });
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