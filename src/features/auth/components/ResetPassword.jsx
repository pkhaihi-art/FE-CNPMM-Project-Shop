import { Card, Flex, Form, Input, Button, Typography, Grid } from 'antd'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import {
    clearResetPasswordError,
    clearResetPasswordSuccessMessage,
    resetPasswordAsync,
    resetResetPasswordStatus,
    selectResetPasswordError,
    selectResetPasswordStatus,
    selectResetPasswordSuccessMessage
} from '../AuthSlice'
import { useNavigate, useParams } from 'react-router-dom'

const { Title, Text } = Typography;

export const ResetPassword = () => {
    const [form] = Form.useForm(); // AntD's form hook
    const dispatch = useDispatch()
    const status = useSelector(selectResetPasswordStatus)
    const error = useSelector(selectResetPasswordError)
    const successMessage = useSelector(selectResetPasswordSuccessMessage)
    const { userId, passwordResetToken } = useParams()
    const navigate = useNavigate()
    const screens = Grid.useBreakpoint(); // AntD's responsive hook

    useEffect(() => {
        if (error) {
            toast.error(error.message)
        }
        return () => {
            dispatch(clearResetPasswordError())
        }
    }, [error, dispatch])

    useEffect(() => {
        if (status === 'fullfilled') {
            toast.success(successMessage?.message)
            navigate("/login")
        }
        return () => {
            dispatch(clearResetPasswordSuccessMessage())
        }
    }, [status, successMessage, navigate, dispatch])

    useEffect(() => {
        return () => {
            dispatch(resetResetPasswordStatus())
        }
    }, [dispatch])

    // AntD's onFinish handles submission
    const handleResetPassword = async (values) => {
        const cred = { ...values, userId: userId, token: passwordResetToken }
        delete cred.confirmPassword
        dispatch(resetPasswordAsync(cred))
        form.resetFields()
    }

    return (
        <Flex style={{ width: '100vw', height: '100vh' }} justify="center" align="center">

            <Card style={{ width: !screens.sm ? "95vw" : '30rem' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleResetPassword}
                    autoComplete="off"
                >
                    <Flex vertical gap={4} style={{ marginBottom: '1rem' }}>
                        <Title level={4} style={{ margin: 0 }}>Reset Password</Title>
                        <Text type="secondary">Please enter and confirm new password</Text>
                    </Flex>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: "Please enter a password" },
                            {
                                pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                                message: "At least 8 characters, must contain 1 uppercase, 1 lowercase, and 1 number."
                            }
                        ]}
                    >
                        <Input.Password placeholder='New Password' />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']} // This tells AntD to re-validate this field when 'password' changes
                        rules={[
                            { required: true, message: "Please confirm the password" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Passwords don't match"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder='Confirm New Password' />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={status === 'pending'}
                            block // equivalent to fullWidth
                            style={{ height: "2.5rem" }}
                        >
                            Reset Password
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

        </Flex>
    )
}