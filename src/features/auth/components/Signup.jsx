import { Flex, Form, Input, Button, Typography, Grid, Modal } from 'antd'
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import { Link, useNavigate } from 'react-router-dom'
import { ecommerceOutlookAnimation } from '../../../assets'
import { useDispatch, useSelector } from 'react-redux'
import {
    selectLoggedInUser,
    signupAsync,
    selectSignupStatus,
    selectSignupError,
    selectSignupMessage,
    clearSignupError,
    resetSignupStatus,
    verifyOtpAsync,
    selectOtpVerificationStatus,
    selectOtpVerificationError,
    clearOtpVerificationError,
    resetOtpVerificationStatus,
    resendOtpAsync,
    selectResendOtpStatus,
    selectResendOtpError,
    clearResendOtpError,
    resetResendOtpStatus
} from '../AuthSlice'
import { toast } from 'react-toastify'

const { Title, Text } = Typography;

export const Signup = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch()
    const status = useSelector(selectSignupStatus)
    const error = useSelector(selectSignupError)
    const signupMessage = useSelector(selectSignupMessage)
    const loggedInUser = useSelector(selectLoggedInUser)
    const otpStatus = useSelector(selectOtpVerificationStatus)
    const otpError = useSelector(selectOtpVerificationError)
    const resendOtpStatus = useSelector(selectResendOtpStatus)
    const resendOtpError = useSelector(selectResendOtpError)
    
    const [form] = Form.useForm();
    const [otpForm] = Form.useForm();
    const navigate = useNavigate()
    const screens = Grid.useBreakpoint();
    
    // State để quản lý Modal OTP
    const [isOtpModalVisible, setIsOtpModalVisible] = useState(false)
    const [userEmail, setUserEmail] = useState('')

    // handles user redirection
    useEffect(() => {
        if (loggedInUser?.isVerified) {
            navigate("/")
        }
    }, [loggedInUser, navigate])

    // handles signup error and toast them
    useEffect(() => {
        if (error) {
            toast.error(error.message)
        }
    }, [error])

    // handles signup message and shows OTP modal
    useEffect(() => {
        if (signupMessage === 'Signup success, please verify your email') {
            // Prefer loggedInUser email, otherwise fallback to persisted signupEmail
            const emailToShow = loggedInUser?.email || localStorage.getItem('signupEmail')
            if (emailToShow) {
                toast.success(t('signup_success_verify_email'))
                setUserEmail(emailToShow)
                setIsOtpModalVisible(true)
                form.resetFields()
            }
        }
        return () => {
            dispatch(clearSignupError())
            dispatch(resetSignupStatus())
        }
    }, [signupMessage, loggedInUser, dispatch, form, t])

    // Handle OTP verification success
    useEffect(() => {
        if (otpStatus === 'fullfilled') {
            toast.success(t('otp_verified_successfully') || 'OTP verified successfully')
            setIsOtpModalVisible(false)
            otpForm.resetFields()
            navigate('/')
        }
        return () => {
            dispatch(clearOtpVerificationError())
            dispatch(resetOtpVerificationStatus())
        }
    }, [otpStatus, dispatch, otpForm, navigate, t])

    // Handle OTP verification error
    useEffect(() => {
        if (otpError) {
            toast.error(otpError.message)
        }
    }, [otpError])

    // Handle resend OTP error
    useEffect(() => {
        if (resendOtpError) {
            toast.error(resendOtpError.message)
        }
    }, [resendOtpError])

    // Handle resend OTP success
    useEffect(() => {
        if (resendOtpStatus === 'fullfilled') {
            toast.success(t('otp_resent_successfully') || 'OTP resent successfully')
        }
        return () => {
            dispatch(clearResendOtpError())
            dispatch(resetResendOtpStatus())
        }
    }, [resendOtpStatus, dispatch, t])

    // this function handles signup and dispatches the signup action
    const handleSignup = (values) => {
        const cred = { ...values }
        delete cred.confirmPassword
        dispatch(signupAsync(cred))
    }

    // Handle OTP verification
    const handleVerifyOtp = (values) => {
        const userId = loggedInUser?._id || localStorage.getItem('signupUserId')
        const signupEmail = loggedInUser?.email || localStorage.getItem('signupEmail')
        if (userId) {
            dispatch(verifyOtpAsync({ userId: userId, otp: values.otp }))
            return
        }
        // Fallback: if backend supports email-based verification, try that and inform the user
        if (signupEmail) {
            toast.info(t('using_email_fallback_for_otp') || 'Verifying using email fallback')
            dispatch(verifyOtpAsync({ email: signupEmail, otp: values.otp }))
            return
        }
        // Nothing to identify the user -> inform the user
        toast.error(t('cannot_verify_missing_userid') || 'Unable to verify: missing user identifier. Please contact support.')
    }

    // Handle resend OTP
    const handleResendOtp = () => {
        const userId = loggedInUser?._id || localStorage.getItem('signupUserId')
        const signupEmail = loggedInUser?.email || localStorage.getItem('signupEmail')
        if (userId) {
            dispatch(resendOtpAsync({ user: userId }))
            return
        }
        if (signupEmail) {
            toast.info(t('using_email_fallback_for_resend') || 'Resending OTP using email fallback')
            dispatch(resendOtpAsync({ email: signupEmail }))
            return
        }
        toast.error(t('cannot_resend_missing_userid') || 'Unable to resend OTP: missing user identifier. Please contact support.')
    }

    // Handle modal cancel
    const handleModalCancel = () => {
        setIsOtpModalVisible(false)
        otpForm.resetFields()
    }

    return (
        <Flex style={{ width: '100vw', height: '100vh', overflowY: 'hidden' }}>

            {/* Left Column: Animation (hidden on medium screens and below) */}
            {screens.md && (
                <Flex style={{ backgroundColor: 'black', flex: 1 }} justify="center" align="center">
                    <Lottie animationData={ecommerceOutlookAnimation} />
                </Flex>
            )}

            {/* Right Column: Signup Form */}
            <Flex vertical flex={1} justify="center" align="center" style={{ padding: '1rem' }}>

                {/* Header */}
                <Flex vertical align="center">
                    <Title level={2} style={{ wordBreak: "break-word", margin: 0 }}>
                        Tech Shop
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
                        width: !screens.sm ? "95vw" : '28rem',
                        marginTop: '2rem'
                    }}
                >
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: t('username_required') }]}
                    >
                        <Input placeholder={t('username')} aria-label={t('username')} />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: t('email_required') },
                            { type: 'email', message: t('email_invalid') }
                        ]}
                    >
                        <Input placeholder={t('email')} aria-label={t('email')} />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: t('password_required') },
                            {
                                pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                                message: t('password_pattern')
                            }
                        ]}
                    >
                        <Input.Password placeholder={t('password')} aria-label={t('password')} />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: t('confirm_password_required') },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(t('passwords_not_match')));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder={t('confirm_password')} aria-label={t('confirm_password')} />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={status === 'pending'}
                            block
                            style={{ height: '2.5rem' }}
                        >
                            {t('signup_button')}
                        </Button>
                    </Form.Item>

                    {/* Links */}
                    <Flex justify="space-between" align="center" wrap="wrap-reverse" gap="small">
                        <Text>
                            <Link to={'/forgot-password'}>{t('forgot_password')}</Link>
                        </Text>
                        <Text>
                            <Link to={'/login'}>
                                {t('already_member')} <Text type="link">{t('login')}</Text>
                            </Link>
                        </Text>
                    </Flex>
                </Form>
            </Flex>

            {/* OTP Modal */}
            <Modal
                title={
                    <Flex vertical>
                        <Text strong style={{ fontSize: '18px' }}>
                            {t('verify_otp') || 'Xác thực OTP'}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '14px' }}>
                            {t('otp_sent_to') || 'Mã OTP đã được gửi đến'}: {userEmail}
                        </Text>
                    </Flex>
                }
                open={isOtpModalVisible}
                onCancel={handleModalCancel}
                footer={null}
                centered
                maskClosable={false}
            >
                <Form
                    form={otpForm}
                    onFinish={handleVerifyOtp}
                    layout="vertical"
                    style={{ marginTop: '1rem' }}
                >
                    <Form.Item
                        name="otp"
                        rules={[
                            { required: true, message: t('otp_required') || 'Vui lòng nhập mã OTP' },
                            { len: 4, message: t('otp_length') || 'Mã OTP phải có 4 ký tự' }
                        ]}
                    >
                        <Input
                            placeholder={t('enter_otp') || 'Nhập mã OTP'}
                                maxLength={4}
                            style={{ fontSize: '18px', letterSpacing: '4px', textAlign: 'center' }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={otpStatus === 'pending'}
                            block
                            style={{ height: '2.5rem' }}
                        >
                            {t('verify_button') || 'Xác thực'}
                        </Button>
                    </Form.Item>

                    <Flex justify="center" align="center">
                        <Text type="secondary">
                            {t('didnt_receive_otp') || 'Chưa nhận được mã?'}{' '}
                        </Text>
                        <Button
                            type="link"
                            onClick={handleResendOtp}
                            loading={resendOtpStatus === 'pending'}
                            style={{ padding: '0 4px' }}
                        >
                            {t('resend_otp') || 'Gửi lại'}
                        </Button>
                    </Flex>
                </Form>
            </Modal>
        </Flex>
    )
}