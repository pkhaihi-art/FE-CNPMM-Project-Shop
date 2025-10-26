import { Flex, Layout, Typography, Input, Button, Grid, Image, Space, theme } from 'antd'
import React from 'react'
import { QRCodePng, appStorePng, googlePlayPng ,facebookPng,instagramPng,twitterPng,linkedinPng} from '../../assets'
import { SendOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;
const { useToken } = theme;
const { useBreakpoint } = Grid;

export const Footer = () => {
    const { token } = useToken(); // AntD theme hook
    const screens = useBreakpoint(); // AntD responsive hook

    const labelStyles = {
        fontWeight: 300,
        cursor: 'pointer',
        color: token.colorTextLightSolid, // Use AntD theme token
    };

    const footerStyle = {
        backgroundColor: token.colorPrimary, // Use AntD theme token
        paddingTop: "3rem",
        paddingLeft: !screens.md ? "1rem" : "3rem", // Use AntD breakpoint
        paddingRight: !screens.md ? "1rem" : "3rem",
        paddingBottom: "1.5rem",
        color: token.colorTextLightSolid, // Use AntD theme token
    };

    return (
        <AntFooter style={footerStyle}>
            <Flex vertical gap="5rem" justify="space-around">

                {/* upper */}
                <Flex
                    gap={'1rem'}
                    justify={!screens.md ? "flex-start" : 'space-around'} // Use AntD breakpoint
                    wrap={'wrap'}
                >
                    <Flex vertical gap={'1rem'} style={{ padding: '1rem', minWidth: '220px' }}>
                        <Title level={4} style={{ color: token.colorTextLightSolid, margin: 0 }}>Exclusive</Title>
                        <Title level={5} style={{ color: token.colorTextLightSolid, margin: 0 }}>Subscribe</Title>
                        <Text style={labelStyles}>Get 10% off your first order</Text>
                        <Input
                            placeholder='Enter your email'
                            style={{ border: '1px solid white', borderRadius: "6px", backgroundColor: 'transparent' }}
                            styles={{ input: { color: 'whitesmoke' } }} // Style the inner input
                            addonAfter={
                                <Button
                                    type="text"
                                    icon={<SendOutlined style={{ color: token.colorTextLightSolid }} />}
                                    style={{ border: 'none' }}
                                />
                            }
                        />
                    </Flex>

                    <Flex vertical gap={'1rem'} style={{ padding: '1rem', minWidth: '220px' }}>
                        <Title level={5} style={{ color: token.colorTextLightSolid, margin: 0 }}>Support</Title>
                        <Text style={labelStyles}>11th Main Street, Dhaka, DH 1515, California.</Text>
                        <Text style={labelStyles}>exclusive@gmail.com</Text>
                        <Text style={labelStyles}>+88015-88888-9999</Text>
                    </Flex>

                    <Flex vertical gap={'1rem'} style={{ padding: '1rem', minWidth: '150px' }}>
                        <Title level={5} style={{ color: token.colorTextLightSolid, margin: 0 }}>Account</Title>
                        <Text style={labelStyles}>My Account</Text>
                        <Text style={labelStyles}>Login / Register</Text>
                        <Text style={labelStyles}>Cart</Text>
                        <Text style={labelStyles}>Wishlist</Text>
                        <Text style={labelStyles}>Shop</Text>
                    </Flex>

                    <Flex vertical gap={'1rem'} style={{ padding: '1rem', minWidth: '150px' }}>
                        <Title level={5} style={{ color: token.colorTextLightSolid, margin: 0 }}>Quick Links</Title>
                        <Text style={labelStyles}>Privacy Policy</Text>
                        <Text style={labelStyles}>Terms Of Use</Text>
                        <Text style={labelStyles}>FAQ</Text>
                        <Text style={labelStyles}>Contact</Text>
                    </Flex>

                    <Flex vertical gap={'1rem'} style={{ padding: '1rem', minWidth: '220px' }}>
                        <Title level={5} style={{ color: token.colorTextLightSolid, margin: 0 }}>Download App</Title>
                        <Text style={{ ...labelStyles, color: "gray", fontWeight: 500 }}>Save $3 with App New User Only</Text>
                        <Flex gap={'.5rem'}>
                            <Image
                                src={QRCodePng}
                                width={100}
                                height={100}
                                alt="QR Code"
                                preview={false}
                                style={{ objectFit: 'contain' }}
                            />
                            <Flex vertical justify={'space-around'}>
                                <img style={{ width: "100%", height: "auto", cursor: "pointer" }} src={googlePlayPng} alt="GooglePlay" />
                                <img style={{ width: "100%", height: 'auto', cursor: "pointer" }} src={appStorePng} alt="AppStore" />
                            </Flex>
                        </Flex>
                        
                        {/* Replaced MotionConfig with AntD's Space component */}
                        <Space size="large" style={{ marginTop: '.6rem' }}>
                            <img style={{ cursor: "pointer", width: 24, height: 24 }} src={facebookPng} alt="Facebook" />
                            <img style={{ cursor: "pointer", width: 24, height: 24 }} src={twitterPng} alt="Twitter" />
                            <img style={{ cursor: "pointer", width: 24, height: 24 }} src={instagramPng} alt="Instagram" />
                            <img style={{ cursor: "pointer", width: 24, height: 24 }} src={linkedinPng} alt="Linkedin" />
                        </Space>
                    </Flex>
                </Flex>

                {/* lower */}
                <Flex align="center" justify="center">
                    <Text type="secondary" style={{ color: 'GrayText' }}>
                        &copy; Mern Store {new Date().getFullYear()}. All right reserved
                    </Text>
                </Flex>
            </Flex>
        </AntFooter>
    )
}