import { ActionIcon, Breadcrumbs, Group, Text, useComputedColorScheme } from '@mantine/core';
import { MdArrowBackIosNew } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import styled from './breadcrumb.module.scss';

export interface BreadcrumbItem {
    title: string;
    link?: string;
}

export interface BreadCrumbParams {
    items: BreadcrumbItem[];
    goBack?: boolean;
}

const CustomBreadcrumb = ({ items, goBack }: BreadCrumbParams) => {
    const navigate = useNavigate();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    return (
        <Group>
            {goBack &&
                <ActionIcon
                    onClick={() => navigate(-1)}
                    variant="transparent" aria-label="Logout"
                    color={computedColorScheme === "dark" ? "white" : "black"} size="lg" radius={"xl"}
                >
                    <MdArrowBackIosNew style={{ width: 18, height: 18 }} />
                </ActionIcon>
            }
            <Breadcrumbs>
                {items.map((item, index) => (
                    !item.link ?
                        <Text key={index} className={styled.text} fw={"bold"} c={computedColorScheme === "dark" ? "white" : "black"}>
                            {item.title}
                        </Text>
                        :
                        <Link to={item.link} key={index} className={styled.link}>
                            {item.title}
                        </Link>
                ))}
            </Breadcrumbs>
        </Group>
    );
}

export default CustomBreadcrumb