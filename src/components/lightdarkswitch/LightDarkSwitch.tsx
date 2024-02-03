import { ActionIcon, Tooltip, useComputedColorScheme, useMantineColorScheme } from "@mantine/core"
import { MdDarkMode, MdLightMode } from "react-icons/md";

const LightDarkSwitch = ({ size }: { size: string }) => {

    const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    return (
        <Tooltip label={computedColorScheme === "dark" ? "Light Mode" : "Dark Mode"} withArrow>
            <ActionIcon
                onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                variant="default" size={size} aria-label="Toggle color scheme"
            >
                {computedColorScheme === "dark" ? (
                    <MdLightMode style={{ width: 18, height: 18 }} />
                ) : (
                    <MdDarkMode style={{ width: 18, height: 18 }} />
                )}
            </ActionIcon>
        </Tooltip>
    )
}

export default LightDarkSwitch