import { Flex, Layout, Typography, Input, Button, Grid, Image, Space, theme } from 'antd'
import React from 'react'
import { QRCodePng, appStorePng, googlePlayPng ,facebookPng,instagramPng,twitterPng,linkedinPng} from '../../assets'
import { SendOutlined } from '@ant-design/icons';

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
                        <Title level={4} style={{ color: token.colorTextLightSolid, margin: 0 }}>Ưu đãi độc quyền</Title>
                        <Title level={5} style={{ color: token.colorTextLightSolid, margin: 0 }}>Đăng ký nhận tin</Title>
                        <Text style={labelStyles}>Giảm 10% cho đơn hàng đầu tiên</Text>
                        <Input
                            placeholder='Nhập email của bạn'
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
                        <Title level={5} style={{ color: token.colorTextLightSolid, margin: 0 }}>Hỗ trợ</Title>
                        <Text style={labelStyles}>Thủ Đức</Text>
                        <Text style={labelStyles}>hao@gmail.com</Text>
                        <Text style={labelStyles}>+84987654321</Text>
                    </Flex>

                    <Flex vertical gap={'1rem'} style={{ padding: '1rem', minWidth: '150px' }}>
                        <Title level={5} style={{ color: token.colorTextLightSolid, margin: 0 }}>Tài khoản</Title>
                        <Text style={labelStyles}>Tài khoản của tôi</Text>
                        <Text style={labelStyles}>Đăng nhập / Đăng ký</Text>
                        <Text style={labelStyles}>Giỏ hàng</Text>
                        <Text style={labelStyles}>Danh sách yêu thích</Text>
                        <Text style={labelStyles}>Cửa hàng</Text>
                    </Flex>

                    <Flex vertical gap={'1rem'} style={{ padding: '1rem', minWidth: '150px' }}>
                        <Title level={5} style={{ color: token.colorTextLightSolid, margin: 0 }}>Liên kết nhanh</Title>
                        <Text style={labelStyles}>Chính sách bảo mật</Text>
                        <Text style={labelStyles}>Điều khoản sử dụng</Text>
                        <Text style={labelStyles}>Câu hỏi thường gặp</Text>
                        <Text style={labelStyles}>Liên hệ</Text>
                    </Flex>

                    <Flex vertical gap={'1rem'} style={{ padding: '1rem', minWidth: '220px' }}>
                        <Title level={5} style={{ color: token.colorTextLightSolid, margin: 0 }}>Tải ứng dụng</Title>
                        <Text style={{ ...labelStyles, color: "gray", fontWeight: 500 }}>Tiết kiệm $3 cho người dùng mới trên app</Text>
                        <Flex gap={'.5rem'}>
                            <Image
                                src={QRCodePng}
                                width={100}
                                height={100}
                                alt="Mã QR"
                                preview={false}
                                style={{ objectFit: 'contain' }}
                            />
                            <Flex vertical justify={'space-around'}>
                                <img style={{ width: "100%", height: "auto", cursor: "pointer" }} src={googlePlayPng} alt="Google Play" />
                                <img style={{ width: "100%", height: 'auto', cursor: "pointer" }} src={appStorePng} alt="App Store" />
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
                        &copy; Tech Shop {new Date().getFullYear()}. Bảo lưu mọi quyền
                    </Text>
                </Flex>
            </Flex>
        </AntFooter>
    )
}