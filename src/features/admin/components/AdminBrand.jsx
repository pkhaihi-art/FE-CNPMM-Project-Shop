import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAllBrandsAsync,
  addBrandAsync,
  updateBrandAsync,
  deleteBrandAsync,
  selectBrands
} from '../../brands/BrandSlice'
import {
  Space,
  Typography,
  Input,
  Button,
  Row,
  Col,
  Card,
  Divider,
  Grid,
  message,
  Modal,
  Flex
} from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export const AdminBrand = () => {
  const dispatch = useDispatch()
  const brands = useSelector(selectBrands)
  const [newBrand, setNewBrand] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const screens = useBreakpoint();
  const isMobile = !screens.sm; // AntD 'sm' là 576px, tương đương với MUI

  useEffect(() => {
    dispatch(fetchAllBrandsAsync())
  }, [dispatch])

  const handleAdd = () => {
    if (!newBrand.trim()) return message.warn('Tên thương hiệu không được để trống');
    dispatch(addBrandAsync({ name: newBrand }))
    setNewBrand('')
    message.success('Đã thêm thương hiệu!')
  }

  const handleUpdate = (id) => {
    if (!editValue.trim()) return message.warn('Tên mới không được để trống');
    dispatch(updateBrandAsync({ id, name: editValue }))
    setEditingId(null)
    message.info('Đã cập nhật thương hiệu!')
  }

  const handleDelete = (id) => {
    // Sử dụng Modal.confirm của AntD thay vì window.confirm
    Modal.confirm({
      title: 'Bạn có chắc muốn xóa thương hiệu này?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        dispatch(deleteBrandAsync(id))
        message.error('Đã xóa thương hiệu!')
      },
    });
  }

  return (
    <Space
      direction="vertical"
      size="large"
      style={{
        padding: isMobile ? 16 : 32,
        width: '100%'
      }}
    >
      {/* Tiêu đề */}
      <Title level={3} style={{ textAlign: 'center', fontWeight: 600 }}>
        Quản lý Thương hiệu
      </Title>

      {/* Ô thêm thương hiệu */}
      <Card bordered={true}>
        <Flex gap="middle" vertical={isMobile}>
          <Input
            placeholder="Tên thương hiệu mới"
            size="large"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            onPressEnter={handleAdd} // Thêm bằng phím Enter
            style={{ flex: 1 }} // Để Input chiếm không gian
          />
          <Button
            type="primary"
            size="large"
            style={{ minWidth: 120 }}
            onClick={handleAdd}
          >
            Thêm
          </Button>
        </Flex>
      </Card>

      <Divider />

      {/* Danh sách thương hiệu */}
      <Row gutter={[24, 24]}> {/* MUI spacing={3} (8*3=24px) */}
        {brands.map((brand) => (
          // AntD sử dụng 24 cột,
          // MUI xs={12} -> AntD xs={24}
          // MUI sm={6} -> AntD sm={12}
          // MUI md={4} -> AntD md={8}
          <Col xs={24} sm={12} md={8} key={brand._id}>
            <Card
              bordered={true}
              bodyStyle={{ padding: '16px 24px' }} // Tương đương p: 2 của MUI
            >
              {editingId === brand._id ? (
                // Chế độ chỉnh sửa
                <Flex gap="small" align="center" style={{ width: '100%' }}>
                  <Input
                    style={{ flex: 1 }}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onPressEnter={() => handleUpdate(brand._id)}
                  />
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => handleUpdate(brand._id)}
                  >
                    Lưu
                  </Button>
                  <Button
                    size="small"
                    danger
                    onClick={() => setEditingId(null)}
                  >
                    Hủy
                  </Button>
                </Flex>
              ) : (
                // Chế độ hiển thị
                <Flex justify="space-between" align="center">
                  <Text strong style={{ fontSize: '1rem' }}>
                    {brand.name}
                  </Text>
                  <Space>
                    <Button
                      type="text" // 'text' giống IconButton của MUI
                      shape="circle"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditingId(brand._id)
                        setEditValue(brand.name)
                      }}
                    />
                    <Button
                      type="text"
                      danger
                      shape="circle"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(brand._id)}
                    />
                  </Space>
                </Flex>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Space>
  )
}