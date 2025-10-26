import { Avatar, Button, Flex, Typography, Input, Grid, Form, theme } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUserInfo } from '../UserSlice'
import { 
    addAddressAsync, 
    resetAddressAddStatus, 
    resetAddressDeleteStatus, 
    resetAddressUpdateStatus, 
    selectAddressAddStatus, 
    selectAddressDeleteStatus, 
    selectAddressErrors, 
    selectAddressStatus, 
    selectAddressUpdateStatus, 
    selectAddresses 
} from '../../address/AddressSlice'
// Đảm bảo component 'Address' này cũng đã được chuyển đổi sang Antd
import { Address } from '../../address/components/Address' 
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const { useToken } = theme;

export const UserProfile = () => {

    const dispatch = useDispatch();
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const status = useSelector(selectAddressStatus);
    const userInfo = useSelector(selectUserInfo);
    const addresses = useSelector(selectAddresses);
    const [addAddress, setAddAddress] = useState(false);

    // Lấy token theme của Antd
    const { token } = useToken();

    // Các selector status (giữ nguyên)
    const addressAddStatus = useSelector(selectAddressAddStatus);
    const addressUpdateStatus = useSelector(selectAddressUpdateStatus);
    const addressDeleteStatus = useSelector(selectAddressDeleteStatus);

    // Tương đương với useMediaQuery
    const screens = useBreakpoint();
    const isTablet = !screens.lg; // Tương đương is900 (Antd lg breakpoint là 992px)
    const isMobile = !screens.sm; // Tương đương is480 (Antd sm breakpoint là 576px)

    // useEffects (giữ nguyên, vì chúng độc lập với UI library)
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        });
    }, []);

    useEffect(() => {
        if (addressAddStatus === 'fulfilled') {
            toast.success("Address added");
            reset();
            setAddAddress(false);
        } else if (addressAddStatus === 'rejected') {
            toast.error("Error adding address, please try again later");
        }
    }, [addressAddStatus, reset]);

    useEffect(() => {
        if (addressUpdateStatus === 'fulfilled') {
            toast.success("Address updated");
        } else if (addressUpdateStatus === 'rejected') {
            toast.error("Error updating address, please try again later");
        }
    }, [addressUpdateStatus]);

    useEffect(() => {
        if (addressDeleteStatus === 'fulfilled') {
            toast.success("Address deleted");
        } else if (addressDeleteStatus === 'rejected') {
            toast.error("Error deleting address, please try again later");
        }
    }, [addressDeleteStatus]);

    useEffect(() => {
        return () => {
            dispatch(resetAddressAddStatus());
            dispatch(resetAddressUpdateStatus());
            dispatch(resetAddressDeleteStatus());
        }
    }, [dispatch]);

    const handleAddAddress = (data) => {
        const address = { ...data, user: userInfo._id };
        dispatch(addAddressAsync(address));
    };

    // Style linh hoạt để mô phỏng `component={is480?'':Paper}`
    const containerStyle = {
        width: isTablet ? '100%' : '50rem',
        padding: 16, // p={2}
        marginTop: isMobile ? 0 : 40, // mt={is480?0:5}
        ...(isMobile ? {} : { // Styles khi không phải mobile (tương đương Paper)
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
            boxShadow: token.boxShadowSecondary, // Tương đương elevation={1}
        })
    };

    return (
        // Stack -> Flex
        <Flex vertical style={{ minHeight: 'calc(100vh - 4rem)' }} justify="flex-start" align="center">

            {/* Stack component={Paper} -> Flex với style động */}
            <Flex vertical style={containerStyle} gap={16}> {/* rowGap={2} -> gap={16} */}

                {/* user details - [name ,email ] */}
                {/* Stack -> Flex */}
                <Flex 
                    vertical 
                    style={{ 
                        backgroundColor: token.colorPrimaryBg, // theme.palette.primary.light
                        color: token.colorPrimary, // theme.palette.primary.main
                        padding: 16, 
                        borderRadius: token.borderRadiusLG 
                    }} 
                    gap={8} // rowGap={1} -> gap={8}
                    justify="center" 
                    align="center"
                >
                    {/* Avatar (MUI) -> Avatar (Antd) */}
                    <Avatar size={70}>{userInfo?.name?.charAt(0)}</Avatar>
                    <Text>{userInfo?.name}</Text>
                    <Text>{userInfo?.email}</Text>
                </Flex>

                {/* address section */}
                {/* Stack -> Flex */}
                <Flex vertical justify="center" align="center" gap={24}> {/* rowGap={3} -> gap={24} */}

                    {/* heading and add button */}
                    {/* Stack (row) -> Flex */}
                    <Flex align="center" justify="center" gap={8}> {/* columnGap={1} -> gap={8} */}
                        <Title level={5} style={{ fontWeight: 400, margin: 0 }}>Manage addresses</Title>
                        {/* Button (MUI) -> Button (Antd) */}
                        <Button 
                            type="primary" // variant="contained"
                            onClick={() => setAddAddress(true)} 
                            size={isMobile ? 'small' : 'middle'}
                        >
                            Add
                        </Button>
                    </Flex>
                    
                    {/* add address form - state dependent*/}
                    {
                        addAddress && (
                            // Stack (form) -> Form (Antd)
                            <Form 
                                layout="vertical" 
                                onFinish={handleSubmit(handleAddAddress)} 
                                style={{ width: '100%' }}
                            >
                                {/* Các <Stack> bọc <TextField> được thay thế bằng <Form.Item> 
                                    để có layout và xử lý lỗi chuẩn Antd.
                                */}
                                <Form.Item 
                                    label="Type" 
                                    required 
                                    validateStatus={errors.type ? 'error' : ''}
                                    help={errors.type ? 'Type is required' : null}
                                >
                                    <Input placeholder='Eg. Home, Buisness' {...register("type", { required: true })} />
                                </Form.Item>

                                <Form.Item 
                                    label="Street" 
                                    required 
                                    validateStatus={errors.street ? 'error' : ''}
                                    help={errors.street ? 'Street is required' : null}
                                >
                                    <Input {...register("street", { required: true })} />
                                </Form.Item>

                                <Form.Item 
                                    label="Postal Code" 
                                    required 
                                    validateStatus={errors.postalCode ? 'error' : ''}
                                    help={errors.postalCode ? 'Postal Code is required' : null}
                                >
                                    <Input type="number" {...register("postalCode", { required: true })} />
                                </Form.Item>

                                <Form.Item 
                                    label="Country" 
                                    required 
                                    validateStatus={errors.country ? 'error' : ''}
                                    help={errors.country ? 'Country is required' : null}
                                >
                                    <Input {...register("country", { required: true })} />
                                </Form.Item>

                                <Form.Item 
                                    label="Phone Number" 
                                    required 
                                    validateStatus={errors.phoneNumber ? 'error' : ''}
                                    help={errors.phoneNumber ? 'Phone Number is required' : null}
                                >
                                    <Input type="number" {...register("phoneNumber", { required: true })} />
                                </Form.Item>

                                <Form.Item 
                                    label="State" 
                                    required 
                                    validateStatus={errors.state ? 'error' : ''}
                                    help={errors.state ? 'State is required' : null}
                                >
                                    <Input {...register("state", { required: true })} />
                                </Form.Item>

                                <Form.Item 
                                    label="City" 
                                    required 
                                    validateStatus={errors.city ? 'error' : ''}
                                    help={errors.city ? 'City is required' : null}
                                >
                                    <Input {...register("city", { required: true })} />
                                </Form.Item>

                                {/* Form buttons */}
                                <Form.Item style={{ marginBottom: 0 }}>
                                    {/* Stack (row) -> Flex */}
                                    <Flex justify="flex-end" gap={isMobile ? 8 : 16}>
                                        {/* LoadingButton -> Button (Antd) với prop `loading` */}
                                        <Button 
                                            type="primary" 
                                            htmlType="submit" 
                                            loading={status === 'pending'} 
                                            size={isMobile ? "small" : "middle"}
                                        >
                                            Add
                                        </Button>
                                        <Button 
                                            danger // color="error"
                                            onClick={() => setAddAddress(false)} 
                                            // variant={is480?"outlined":"text"} -> type={isMobile?"default":"text"}
                                            type={isMobile ? "default" : "text"} 
                                            size={isMobile ? "small" : "middle"}
                                        >
                                            Cancel
                                        </Button>
                                    </Flex>
                                </Form.Item>
                            </Form>
                        )
                    }

                    {/* mapping on addresses here */}
                    {/* Stack -> Flex */}
                    <Flex vertical style={{ width: '100%' }} gap={16}> {/* rowGap={2} -> gap={16} */}
                        {
                            addresses.length > 0 ? (
                                addresses.map((address) => (
                                    <Address 
                                        key={address._id} 
                                        id={address._id} 
                                        city={address.city} 
                                        country={address.country} 
                                        phoneNumber={address.phoneNumber} 
                                        postalCode={address.postalCode} 
                                        state={address.state} 
                                        street={address.street} 
                                        type={address.type} 
                                    />
                                ))
                            ) : (
                                // Typography -> Text
                                <Text type="secondary" style={{ textAlign: 'center', marginTop: 16 }}>
                                    You have no added addresses
                                </Text>
                            )
                        }
                    </Flex>

                </Flex>

            </Flex>
        </Flex>
    )
}