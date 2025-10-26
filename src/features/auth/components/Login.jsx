import { Flex, Form, Input, Button, Typography, Grid } from 'antd'
import React, { useEffect } from 'react'
import Lottie from 'lottie-react'
import { Link, useNavigate } from 'react-router-dom'
import { ecommerceOutlookAnimation } from '../../../assets'
import { useDispatch, useSelector } from 'react-redux'
import { selectLoggedInUser, loginAsync, selectLoginStatus, selectLoginError, clearLoginError, resetLoginStatus } from '../AuthSlice'
import { toast } from 'react-toastify'

const { Title, Text } = Typography;

export const Login = () => {
    const dispatch = useDispatch()
    const status = useSelector(selectLoginStatus)
    const error = useSelector(selectLoginError)
    const loggedInUser = useSelector(selectLoggedInUser)
    const [form] = Form.useForm(); // AntD's form hook
    const navigate = useNavigate()
    const screens = Grid.useBreakpoint(); // AntD's responsive hook

    // Reset states when component mounts
    useEffect(() => {
        console.log('Login component mounted');
        dispatch(clearLoginError());
        dispatch(resetLoginStatus());
    }, [dispatch]);

    // Handle redirection based on user state
    useEffect(() => {
        console.log('User state changed:', loggedInUser);
        if (loggedInUser?.isVerified) {
            navigate("/")
        } else if (loggedInUser && !loggedInUser.isVerified) {
            navigate("/verify-otp")
        }
    }, [loggedInUser, navigate])

    // handles login error and toast them
    useEffect(() => {
        if (error) {
            toast.error(error.message)
        }
    }, [error])

    // Handle login status changes
    useEffect(() => {
        console.log('Login status:', status);
        if (status === 'fullfilled') {
            if (loggedInUser?.isVerified) {
                toast.success('Login successful');
                form.resetFields();
            }
        }
    }, [status, loggedInUser, form])

    // Handle form submission
    const handleLogin = async (values) => {
        try {
            console.log('Login attempt with:', values);
            await dispatch(loginAsync(values)).unwrap();
        } catch (error) {
            console.error('Login failed:', error);
        }
    }

    return (
        <Flex style={{ width: '100vw', height: '100vh', overflowY: 'hidden' }}>

            {/* Left Column: Animation (hidden on medium screens and below) */}
            {screens.md && (
                <Flex style={{ backgroundColor: 'black', flex: 1 }} justify="center" align="center">
                    <Lottie animationData={ecommerceOutlookAnimation} />
                </Flex>
            )}

            {/* Right Column: Login Form */}
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
                    onFinish={handleLogin}
                    layout="vertical"
                    autoComplete="off"
                    style={{
                        width: !screens.sm ? "95vw" : '28rem', // Replaces is480
                        marginTop: '2rem'
                    }}
                >
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
                        rules={[{ required: true, message: "Password is required" }]}
                    >
                        <Input.Password placeholder='Password' />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={status === 'pending'}
                            block // equivalent to fullWidth
                            style={{ height: '2.5rem' }}
                        >
                            Login
                        </Button>
                    </Form.Item>

                    {/* Links */}
                    <Flex justify="space-between" align="center" wrap="wrap-reverse" gap="small">
                        <Text>
                            <Link to={'/forgot-password'}>Forgot password</Link>
                        </Text>
                        <Text>
                            <Link to={'/signup'}>
                                Don't have an account? <Text type="link">Register</Text>
                            </Link>
                        </Text>
                    </Flex>
                </Form>
            </Flex>
        </Flex>
    )
}