import { Button, Card, Flex, Input, Typography, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { deleteAddressByIdAsync, selectAddressErrors, selectAddressStatus, updateAddressByIdAsync } from '../AddressSlice';

const { Title, Text } = Typography;

export const Address = ({id,type,street,postalCode,country,phoneNumber,state,city}) => {
    
    const dispatch = useDispatch();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            type,
            street,
            postalCode,
            country,
            phoneNumber,
            state,
            city
        }
    });

    const [edit, setEdit] = useState(false);
    const status = useSelector(selectAddressStatus);

    // Cập nhật giá trị mặc định của form khi props thay đổi
    // và khi người dùng nhấn Cancel (setEdit(false)).
    useEffect(() => {
        if (!edit) {
            reset({
                type,
                street,
                postalCode,
                country,
                phoneNumber,
                state,
                city
            });
        }
    }, [type, street, postalCode, country, phoneNumber, state, city, reset, edit]);


    const handleRemoveAddress = () => {
        dispatch(deleteAddressByIdAsync(id));
    }

    const handleUpdateAddress = (data) => {
        const update = { ...data, _id: id };
        dispatch(updateAddressByIdAsync(update))
            .then(() => setEdit(false)); 
    }

    return (
        <Card 
            style={{ width: '100%' }} 
            title={
                <Title level={5} style={{ margin: 0, color: 'white' }}>
                    {type?.toUpperCase()}
                </Title>
            }
            headStyle={{ backgroundColor: '#1890ff', color: 'white' }} 
            bodyStyle={{ padding: '16px' }}
        >
            
            <form onSubmit={handleSubmit(handleUpdateAddress)} noValidate>
                <Flex vertical gap={10}>
                    {
                        edit ? (
                            <Flex vertical gap={10}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Text strong>Type</Text>
                                    <Input {...register("type", { required: true })} />
                                </Space>

                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Text strong>Street</Text>
                                    <Input {...register("street", { required: true })} />
                                </Space>

                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Text strong>Postal Code</Text>
                                    <Input {...register("postalCode", { required: true })} /> 
                                </Space>

                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Text strong>Country</Text>
                                    <Input {...register("country", { required: true })} />
                                </Space>

                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Text strong>Phone Number</Text>
                                    <Input {...register("phoneNumber", { required: true })} />
                                </Space>

                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Text strong>State</Text>
                                    <Input {...register("state", { required: true })} />
                                </Space>

                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Text strong>City</Text>
                                    <Input {...register("city", { required: true })} />
                                </Space>
                            </Flex>
                        ) : (
                            <Flex vertical gap={5}>
                                <Text>Street - **{street}**</Text>
                                <Text>Postal Code - **{postalCode}**</Text>
                                <Text>Country - **{country}**</Text>
                                <Text>Phone Number - **{phoneNumber}**</Text>
                                <Text>State - **{state}**</Text>
                                <Text>City - **{city}**</Text>
                            </Flex>
                        )
                    }

                    {/* Action Buttons */}
                    <Flex justify="flex-end" style={{ marginTop: '16px' }}>
                        <Space>
                            {
                                edit ? (
                                    <Button 
                                        type="primary" 
                                        htmlType="submit" 
                                        loading={status === 'pending'} 
                                        size='small'
                                    >
                                        Save Changes
                                    </Button>
                                ) : (
                                    <Button 
                                        type="primary" 
                                        onClick={() => setEdit(true)} 
                                        size='small'
                                    >
                                        Edit
                                    </Button>
                                )
                            }

                            {
                                edit ? (
                                    <Button 
                                        onClick={() => { setEdit(false); reset(); }} 
                                        danger 
                                        size='small'
                                    >
                                        Cancel
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={handleRemoveAddress} 
                                        loading={status === 'pending'} 
                                        danger 
                                        size='small' 
                                        type="default" 
                                    >
                                        Remove
                                    </Button>
                                )
                            }
                        </Space>
                    </Flex>
                </Flex>
            </form>
        </Card>
    );
}