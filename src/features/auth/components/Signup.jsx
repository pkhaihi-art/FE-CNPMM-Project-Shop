import { Flex, Form, Input, Button, Typography, Grid } from 'antd'
import React, { useEffect } from 'react'
import Lottie from 'lottie-react'
import { Link, useNavigate } from 'react-router-dom'
import { ecommerceOutlookAnimation } from '../../../assets'
import { useDispatch, useSelector } from 'react-redux'
import {
    selectLoggedInUser,
    signupAsync,
    selectSignupStatus,
    selectSignupError,
    clearSignupError,
    resetSignupStatus
} from '../AuthSlice'
import { toast } from 'react-toastify'

const { Title, Text } = Typography;

export const Signup = () => {
    const dispatch = useDispatch()
    const status = useSelector(selectSignupStatus)
    const error = useSelector(selectSignupError)
    const loggedInUser = useSelector(selectLoggedInUser)
    const [form] = Form.useForm(); // AntD's form hook
    const navigate = useNavigate()
    const screens = Grid.useBreakpoint(); // AntD's responsive hook

    // handles user redirection
    useEffect(() => {
        if (loggedInUser && !loggedInUser?.isVerified) {
            navigate("/verify-otp")
        } else if (loggedInUser) {
            navigate("/")
        }
    }, [loggedInUser, navigate])

    // handles signup error and toast them
    useEffect(() => {
        if (error) {
            toast.error(error.message)
        }
    }, [error])

    // handles signup status and toasts
    useEffect(() => {
        if (status === 'fullfilled') {
            toast.success("Signup success, please verify your email")
            form.resetFields()
            navigate('/verify-otp')
        }
        return () => {
            dispatch(clearSignupError())
            dispatch(resetSignupStatus())
        }
    }, [status, dispatch, form, navigate])

    // this function handles signup and dispatches the signup action
    const handleSignup = (values) => {
        const cred = { ...values }
        delete cred.confirmPassword
        dispatch(signupAsync(cred))
    }

    return (
        <Flex style={{ width: '100vw', height: '100vh', overflowY: 'hidden' }}>

            {/* Left Column: Animation (hidden on medium screens and below) */}
            {screens.md && ( // Replaces !is900
                <Flex style={{ backgroundColor: 'black', flex: 1 }} justify="center" align="center">
                    <Lottie animationData={ecommerceOutlookAnimation} />
                </Flex>
            )}

            {/* Right Column: Signup Form */}
            <Flex vertical flex={1} justify="center" align="center" style={{ padding: '1rem' }}>

                {/* Header */}
                <Flex vertical align="center">
                    <Title level={2} style={{ wordBreak: "break-word", margin: 0 }}>
                        Mern Shop
                    </Title>
                    <Text type="secondary" style={{ alignSelf: 'flex-end' }}>
                        - Shop Anything
                    </Text>
                </Flex>

                {/* Form */}
                <Form
                    form={form}
                    onFinish={handleSignup}
                    layout="vertical"
                    autoComplete="off"
                    style={{
                        width: !screens.sm ? "95vw" : '28rem', // Replaces is480
                        marginTop: '2rem'
                    }}
                >
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: "Username is required" }]}
                    >
                        <Input placeholder='Username' />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: "Email is required" },
                            { type: 'email', message: "Enter a valid email" }
                        ]}
                    >
                        <Input placeholder='Email' />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: "Password is required" },
                            {
                                pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                                message: "At least 8 characters, 1 uppercase, 1 lowercase, 1 number."
                            }
                        ]}
                    >
                        <Input.Password placeholder='Password' />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']} // Checks 'password' field
                        rules={[
                            { required: true, message: "Confirm Password is required" },
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
                        <Input.Password placeholder='Confirm Password' />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={status === 'pending'}
                            block // equivalent to fullWidth
                            style={{ height: '2.5rem' }}
                        >
                            Signup
                        </Button>
                    </Form.Item>

                    {/* Links */}
                    <Flex justify="space-between" align="center" wrap="wrap-reverse" gap="small">
                        <Text>
                            <Link to={'/forgot-password'}>Forgot password</Link>
                        </Text>
                        <Text>
                            <Link to={'/login'}>
                                Already a member? <Text type="link">Login</Text>
                            </Link>
                        </Text>
                    </Flex>
                </Form>
            </Flex>
        </Flex>
    )
}