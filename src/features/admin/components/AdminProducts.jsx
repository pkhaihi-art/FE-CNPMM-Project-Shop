import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  Button,
  Space,
  Typography,
  Card,
  Image,
  Tag,
  Modal,
  message,
  Flex,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { selectProducts, fetchProductsAsync, deleteProductByIdAsync, updateProductByIdAsync } from '../../products/ProductSlice';
import { AddProduct } from './AddProduct';
import { selectCategories } from '../../categories/CategoriesSlice';

const { Title } = Typography;

export const AdminProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchProductsAsync({}));
  }, [dispatch]);

  // Lọc sản phẩm theo tên
  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (productId) => {
    Modal.confirm({
      title: 'Xác nhận xóa sản phẩm',
      content: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        dispatch(deleteProductByIdAsync(productId));
        message.success('Đã xóa sản phẩm');
      },
    });
  };

  const handleEdit = (product) => {
    // Nếu product.brand là object, lấy _id
    const brandId = typeof product.brand === 'object' ? product.brand._id : product.brand;
    setEditingProduct({ ...product, brand: brandId });
    setIsEditModalVisible(true);
  };

  const handleEditProduct = (data) => {
    dispatch(updateProductByIdAsync({ _id: editingProduct._id, ...data }));
    setIsEditModalVisible(false);
    message.success('Đã cập nhật sản phẩm');
  };

  const getCategoryName = (category) => {
    if (!category) return '';
    if (typeof category === 'object' && category.name) return category.name;
    // Nếu category là id, tìm trong danh sách
    const found = categories?.find(c => c._id === category);
    return found ? found.name : category;
  };

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumbnail, record) => (
        <Space>
          <Image
            src={thumbnail}
            alt={record.title}
            style={{ width: 50, height: 50, objectFit: 'cover' }}
          />
          <span>{record.title}</span>
        </Space>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`,
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
      render: (discount) => (
        discount > 0 ? <Tag color="red">{discount}% OFF</Tag> : '-'
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      render: (stock) => (
        <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>
          {stock}
        </Tag>
      ),
    },
    {
      title: 'Thương hiệu',
      dataIndex: ['brand', 'name'],
      key: 'brand',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category) => getCategoryName(category),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Quản lý sản phẩm</Title>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ marginRight: 16, padding: 4, minWidth: 200 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddModalVisible(true)}
          >
            Thêm sản phẩm
          </Button>
        </Flex>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="_id"
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <Modal
        title="Thêm sản phẩm mới"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        width={1000}
        footer={null}
      >
        <AddProduct onSuccess={() => setIsAddModalVisible(false)} />
      </Modal>

      <Modal
        title="Chỉnh sửa sản phẩm"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        width={1000}
        footer={null}
      >
        {editingProduct && (
          <AddProduct
            initialValues={editingProduct}
            onFinish={handleEditProduct}
            isEdit
            onSuccess={() => setIsEditModalVisible(false)}
          />
        )}
      </Modal>
    </div>
  );
};