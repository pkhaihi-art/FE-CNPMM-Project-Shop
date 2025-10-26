import { Button, Card, Flex, Form, Input, Space, Typography, message } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    clearOtpVerificationError,
    clearResendOtpError,
    clearResendOtpSuccessMessage,
    resendOtpAsync,
    resetOtpVerificationStatus,
    resetResendOtpStatus,
    selectLoggedInUser,
    selectOtpVerificationError,
    selectOtpVerificationStatus,
    selectResendOtpError,
    selectResendOtpStatus,
    selectResendOtpSuccessMessage,
    verifyOtpAsync
} from '../AuthSlice'
// import { LoadingButton } from '@mui/lab' // Ersetzt durch AntD Button loading prop
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from "react-hook-form" // Importiere Controller
// import {toast} from 'react-toastify' // Ersetzt durch AntD message

export const OtpVerfication = () => {

    // Füge 'control' hinzu, um es mit AntD-Komponenten zu verwenden
    const { control, handleSubmit, formState: { errors } } = useForm()
    const dispatch = useDispatch()
    const loggedInUser = useSelector(selectLoggedInUser)
    const navigate = useNavigate()
    const resendOtpStatus = useSelector(selectResendOtpStatus)
    const resendOtpError = useSelector(selectResendOtpError)
    const resendOtpSuccessMessage = useSelector(selectResendOtpSuccessMessage)
    const otpVerificationStatus = useSelector(selectOtpVerificationStatus)
    const otpVerificationError = useSelector(selectOtpVerificationError)

    // handles the redirection
    useEffect(() => {
        if (!loggedInUser) {
            navigate('/login')
        }
        else if (loggedInUser && loggedInUser?.isVerified) {
            navigate("/")
        }
    }, [loggedInUser, navigate])

    const handleSendOtp = () => {
        const data = { user: loggedInUser?._id }
        dispatch(resendOtpAsync(data))
    }

    const handleVerifyOtp = (data) => {
        const cred = { ...data, userId: loggedInUser?._id }
        dispatch(verifyOtpAsync(cred))
    }

    // handles resend otp error
    useEffect(() => {
        if (resendOtpError) {
            message.error(resendOtpError.message) // Geändert zu AntD message
        }
        return () => {
            dispatch(clearResendOtpError())
        }
    }, [resendOtpError, dispatch])

    // handles resend otp success message
    useEffect(() => {
        if (resendOtpSuccessMessage) {
            message.success(resendOtpSuccessMessage.message) // Geändert zu AntD message
        }
        return () => {
            dispatch(clearResendOtpSuccessMessage())
        }
    }, [resendOtpSuccessMessage, dispatch])

    // handles error while verifying otp
    useEffect(() => {
        if (otpVerificationError) {
            message.error(otpVerificationError.message) // Geändert zu AntD message
        }
        return () => {
            dispatch(clearOtpVerificationError())
        }
    }, [otpVerificationError, dispatch])

    useEffect(() => {
        if (otpVerificationStatus === 'fullfilled') {
            message.success("Email verified! We are happy to have you here") // Geändert zu AntD message
            dispatch(resetResendOtpStatus())
        }
        return () => {
            dispatch(resetOtpVerificationStatus())
        }
    }, [otpVerificationStatus, dispatch])

    return (
        // Ersetzt den äußeren Stack
        <Flex
            style={{ width: '100vw', height: '100vh' }}
            justify="center"
            align="center"
        >
            {/* Ersetzt Paper Stack */}
            <Card
                style={{
                    padding: '1rem',
                    textAlign: 'center',
                    minWidth: 350,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' // Entspricht elevation 1
                }}
            >
                {/* Space bietet rowGap-Funktionalität */}
                <Space direction="vertical" size="large" style={{ width: '100%' }}>

                    <Typography.Title level={4} style={{ marginTop: '1rem' }}>
                        Verify Your Email Address
                    </Typography.Title>

                    {
                        resendOtpStatus === 'fullfilled' ? (
                            // Ersetzt den form Stack
                            <Form
                                onFinish={handleSubmit(handleVerifyOtp)}
                                layout="vertical"
                                style={{ width: '100%' }}
                            >
                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                    {/* Text-Container */}
                                    <div style={{ textAlign: 'left' }}>
                                        <Typography.Text type="secondary"> {/* Entspricht color='GrayText' */}
                                            Enter the 4 digit OTP sent on
                                        </Typography.Text>
                                        <br />
                                        <Typography.Text strong type="secondary"> {/* Entspricht fontWeight 600 */}
                                            {loggedInUser?.email}
                                        </Typography.Text>
                                    </div>

                                    {/* Ersetzt TextField und FormHelperText */}
                                    <Form.Item
                                        validateStatus={errors.otp ? 'error' : ''}
                                        help={errors.otp?.message}
                                        style={{ marginBottom: 0 }}
                                    >
                                        <Controller
                                            name="otp"
                                            control={control}
                                            rules={{
                                                required: "OTP is required",
                                                minLength: { value: 4, message: "Please enter a 4 digit OTP" },
                                                maxLength: { value: 4, message: "Please enter a 4 digit OTP" }
                                            }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="Enter 4-digit OTP"
                                                    size="large"
                                                />
                                            )}
                                        />
                                    </Form.Item>

                                    {/* Ersetzt LoadingButton */}
                                    <Button
                                        loading={otpVerificationStatus === 'pending'}
                                        htmlType='submit'
                                        type='primary' // Entspricht variant='contained'
                                        block // Entspricht fullWidth
                                        size="large"
                                    >
                                        Verify
                                    </Button>
                                </Space>
                            </Form>
                        ) : (
                            <>
                                {/* Text-Container */}
                                <div style={{ textAlign: 'left' }}>
                                    <Typography.Text type="secondary"> {/* Entspricht color='GrayText' */}
                                        We will send you an OTP on
                                    </Typography.Text>
                                    <br />
                                    <Typography.Text strong type="secondary"> {/* Entspricht fontWeight 600 */}
                                        {loggedInUser?.email}
                                    </Typography.Text>
                                </div>
                                
                                {/* Ersetzt LoadingButton */}
                                <Button
                                    onClick={handleSendOtp}
                                    loading={resendOtpStatus === 'pending'}
                                    type='primary' // Entspricht variant='contained'
                                    block // Entspricht fullWidth
                                    size="large"
                                >
                                    Get OTP
                                </Button>
                            </>
                        )
                    }

                </Space>
            </Card>
        </Flex>
    )
}