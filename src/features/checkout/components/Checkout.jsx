import { Flex, Typography, Button, Radio, Card, Grid, Form, Input, InputNumber, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { Cart } from '../../cart/components/Cart'
import { useDispatch, useSelector } from 'react-redux'
import { addAddressAsync, selectAddressStatus, selectAddresses } from '../../address/AddressSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { Link, useNavigate } from 'react-router-dom'
import { createOrderAsync, selectCurrentOrder, selectOrderStatus } from '../../order/OrderSlice'
import { resetCartByUserIdAsync, selectCartItems } from '../../cart/CartSlice'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { SHIPPING, TAXES } from '../../../constants'
import { toast } from 'react-toastify' // Assuming toast is configured

const { Title, Text } = Typography;

export const Checkout = () => {

    const addresses = useSelector(selectAddresses)
    // Set initial selected address, handling case where addresses might be empty
    const [selectedAddress, setSelectedAddress] = useState(addresses[0] || null)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash')
    const [form] = Form.useForm(); // AntD's form hook
    const dispatch = useDispatch()
    const loggedInUser = useSelector(selectLoggedInUser)
    const addressStatus = useSelector(selectAddressStatus)
    const navigate = useNavigate()
    const cartItems = useSelector(selectCartItems)
    const orderStatus = useSelector(selectOrderStatus)
    const currentOrder = useSelector(selectCurrentOrder)
    const orderTotal = cartItems.reduce((acc, item) => (item.product.price * item.quantity) + acc, 0)
    const screens = Grid.useBreakpoint(); // AntD's responsive hook

    useEffect(() => {
        if (addressStatus === 'fulfilled') {
            form.resetFields()
        } else if (addressStatus === 'rejected') {
            toast.error('Error adding your address') // Using toast instead of alert
        }
    }, [addressStatus, form])

    useEffect(() => {
        if (currentOrder && currentOrder?._id) {
            dispatch(resetCartByUserIdAsync(loggedInUser?._id))
            navigate(`/order-success/${currentOrder?._id}`)
        }
    }, [currentOrder, dispatch, loggedInUser, navigate])

    // Set default selected address when addresses load
    useEffect(() => {
        if (addresses.length > 0 && !selectedAddress) {
            setSelectedAddress(addresses[0]);
        }
    }, [addresses, selectedAddress]);

    const handleAddAddress = (values) => {
        const address = { ...values, user: loggedInUser._id }
        dispatch(addAddressAsync(address))
    }

    const handleCreateOrder = () => {
        if (!selectedAddress) {
            toast.error("Please select a shipping address.");
            return;
        }
        const order = { user: loggedInUser._id, item: cartItems, address: selectedAddress, paymentMode: selectedPaymentMethod, total: orderTotal + SHIPPING + TAXES }
        dispatch(createOrderAsync(order))
    }

    return (
        <Flex
            justify={'center'}
            wrap={'wrap'}
            gap={32}
            style={{ padding: '1rem', marginBottom: '5rem', marginTop: '1rem' }}
            align={'flex-start'}
        >
            {/* left box */}
            <Flex vertical gap={32}>
                {/* heading */}
                <Flex gap={screens.sm ? 8 : 4} align={'center'}>
                    <Link to={"/cart"}>
                        <Button type="text" icon={<ArrowLeftOutlined />} size={!screens.sm ? "middle" : 'large'} />
                    </Link>
                    <Title level={4} style={{ margin: 0 }}>Shipping Information</Title>
                </Flex>

                {/* address form */}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddAddress}
                    autoComplete="off"
                >
                    <Flex vertical gap={16}>
                        <Form.Item label="Type" name="type" rules={[{ required: true }]}>
                            <Input placeholder='Eg. Home, Buisness' />
                        </Form.Item>

                        <Form.Item label="Street" name="street" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Country" name="country" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>

                        <Flex gap={8} align="start">
                            <Form.Item label="City" name="city" rules={[{ required: true }]} style={{ flex: 1 }}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="State" name="state" rules={[{ required: true }]} style={{ flex: 1 }}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Postal Code" name="postalCode" rules={[{ required: true }]} style={{ flex: 1 }}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Flex>

                        <Flex justify={'flex-end'} gap={8}>
                            <Button
                                type='primary'
                                htmlType='submit'
                                loading={addressStatus === 'pending'}
                            >
                                Add
                            </Button>
                            <Button danger onClick={() => form.resetFields()}>Reset</Button>
                        </Flex>
                    </Flex>
                </Form>

                {/* existing address */}
                <Flex vertical gap={24}>
                    <Flex vertical>
                        <Title level={5}>Address</Title>
                        <Text type='secondary'>Choose from existing Addresses</Text>
                    </Flex>

                    {/* Use Radio.Group to manage selected address */}
                    <Radio.Group
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        value={selectedAddress}
                        style={{ width: '100%' }}
                    >
                        <Flex wrap="wrap" gap={16} style={{ width: !screens.lg ? "auto" : '50rem' }}>
                            {
                                addresses.map((address) => (
                                    <Card
                                        key={address._id}
                                        size="small"
                                        style={{ width: !screens.sm ? '100%' : '20rem', height: 'auto' }}
                                    >
                                        <Flex vertical gap={16}>
                                            <Radio value={address}>{address.type}</Radio>
                                            <Flex vertical style={{ paddingLeft: '28px' }}> {/* Align with radio text */}
                                                <Text strong>{address.street}</Text>
                                                <Text>{address.state}, {address.city}, {address.country}, {address.postalCode}</Text>
                                                <Text>{address.phoneNumber}</Text>
                                            </Flex>
                                        </Flex>
                                    </Card>
                                ))
                            }
                        </Flex>
                    </Radio.Group>
                </Flex>

                {/* payment methods */}
                <Flex vertical gap={24}>
                    <Flex vertical>
                        <Title level={5}>Payment Methods</Title>
                        <Text type='secondary'>Please select a payment method</Text>
                    </Flex>

                    <Radio.Group
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        value={selectedPaymentMethod}
                    >
                        <Flex vertical gap={16}>
                            <Radio value={'COD'}>Cash</Radio>
                            <Radio value={'CARD'}>Card</Radio>
                        </Flex>
                    </Radio.Group>
                </Flex>
            </Flex>

            {/* right box */}
            <Flex vertical style={{ width: !screens.lg ? '100%' : 'auto' }} align={!screens.lg ? 'flex-start' : 'auto'} gap={16}>
                <Title level={4}>Order summary</Title>
                <Cart checkout={true} />
                <Button
                    type='primary'
                    block
                    size='large'
                    loading={orderStatus === 'pending'}
                    onClick={handleCreateOrder}
                >
                    Pay and order
                </Button>
            </Flex>
        </Flex>
    )
}