import { Card, Flex, Form, Input, Button, Typography, Grid } from 'antd'
import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import {
    clearForgotPasswordError,
    clearForgotPasswordSuccessMessage,
    forgotPasswordAsync,
    resetForgotPasswordStatus,
    selectForgotPasswordError,
    selectForgotPasswordStatus,
    selectForgotPasswordSuccessMessage
} from '../AuthSlice'
import { Link } from 'react-router-dom'

const { Title, Text } = Typography;

export const ForgotPassword = () => {
    const { t } = useTranslation();
    const [form] = Form.useForm(); // AntD's form hook
    const dispatch = useDispatch()
    const status = useSelector(selectForgotPasswordStatus)
    const error = useSelector(selectForgotPasswordError)
    const successMessage = useSelector(selectForgotPasswordSuccessMessage)
    const screens = Grid.useBreakpoint(); // AntD's responsive hook

    useEffect(() => {
        if (error) {
            toast.error(error?.message)
        }
        return () => {
            dispatch(clearForgotPasswordError())
        }
    }, [error])

    useEffect(() => {
        if (status === 'fullfilled') {
            toast.success(successMessage?.message)
        }
        return () => {
            dispatch(clearForgotPasswordSuccessMessage())
        }
    }, [status])

    useEffect(() => {
        return () => {
            dispatch(resetForgotPasswordStatus())
        }
    }, [])

    // AntD's Form.onFinish handles submission
    const handleForgotPassword = async (values) => {
        dispatch(forgotPasswordAsync(values))
        form.resetFields()
    }

    return (
        <Flex style={{ width: '100vw', height: '100vh' }} justify="center" align="center">
            
            <Flex vertical gap="large" align="center">
                <Card style={{ width: !screens.sm ? "95vw" : '30rem' }}>
                    <Form
                        form={form}
                        onFinish={handleForgotPassword}
                        layout="vertical"
                        autoComplete="off"
                    >
                        <Flex vertical gap="middle">
                            {/* Header Text */}
                            <Flex vertical gap={4}>
                                <Title level={4}>
                                    {status === 'fullfilled' ? t('forgot_email_sent') : t('forgot_title')}
                                </Title>
                                <Text type="secondary">
                                    {status === 'fullfilled'
                                        ? t('forgot_check_inbox')
                                        : t('forgot_enter_email')}
                                </Text>
                            </Flex>

                            {/* Form fields - only show if status is not 'fullfilled' */}
                            {status !== 'fullfilled' && (
                                <>
                                    <Form.Item
                                        name="email"
                                        rules={[
                                            { required: true, message: t('forgot_email_required') },
                                            { type: 'email', message: t('forgot_email_invalid') }
                                        ]}
                                    >
                                        <Input placeholder={t('forgot_email_placeholder')} />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={status === 'pending'}
                                            block // equivalent to fullWidth
                                            style={{ height: '2.5rem' }}
                                        >
                                            {t('forgot_send_link')}
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Flex>
                    </Form>
                </Card>

                {/* Back to login navigation */}
                <Text>
                    <Link to={'/login'}>
                        {t('forgot_back_to_login')} <Text type="link">{t('login')}</Text>
                    </Link>
                </Text>
            </Flex>

        </Flex>
    )
}