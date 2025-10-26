import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Typography,
  Card,
  Row,
  Col,
  InputNumber,
  Space,
  message,
  Flex
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  addProductAsync,
  resetProductAddStatus,
  selectProductAddStatus,
} from '../../products/ProductSlice';
import { selectBrands } from '../../brands/BrandSlice';
import { selectCategories } from '../../categories/CategoriesSlice';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export const AddProduct = ({ initialValues, onFinish, isEdit, onSuccess }) => {
  const [form] = Form.useForm();
  const [imageCount, setImageCount] = useState(initialValues?.images?.length || 1);
  
  const dispatch = useDispatch();
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const productAddStatus = useSelector(selectProductAddStatus);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialValues) {
      // Điền sẵn dữ liệu vào form khi chỉnh sửa
      const imagesObj = {};
      if (initialValues.images) {
        initialValues.images.forEach((img, i) => {
          imagesObj[`image${i}`] = img;
        });
      }
      form.setFieldsValue({ ...initialValues, ...imagesObj });
      setImageCount(initialValues.images?.length || 1);
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (!isEdit && productAddStatus === 'fulfilled') {
      form.resetFields();
      message.success('✅ Product added successfully!');
      if (onSuccess) onSuccess();
      navigate('/admin/dashboard');
    } else if (!isEdit && productAddStatus === 'rejected') {
      message.error('❌ Error adding product, please try again later');
    }
  }, [productAddStatus, form, navigate, isEdit, onSuccess]);

  useEffect(() => {
    return () => {
      dispatch(resetProductAddStatus());
    };
  }, [dispatch]);

  // 3. onFinish sẽ nhận `data` khi form valid
  const handleAddProduct = (data) => {
    const newProduct = {
      title: data.title,
      description: data.description,
      price: data.price,
      brand: data.brand,
      category: data.category,
      thumbnail: data.thumbnail,
      stockQuantity: data.stockQuantity,
      discountPercentage: data.discountPercentage || 0,
      images: Object.keys(data)
        .filter(key => key.startsWith('image'))
        .map(key => data[key])
        .filter(Boolean)
    };
    if (isEdit && onFinish) {
      onFinish(newProduct);
      if (onSuccess) onSuccess();
    } else {
      dispatch(addProductAsync(newProduct));
    }
  };

  return (
    // 4. Sử dụng Card thay cho Paper và style/padding đơn giản
    <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 900,
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)', // Tương đương elevation
        }}
      >
        {/* 5. Component Form của Antd bọc tất cả */}
        <Form
          form={form}
          layout="vertical" // Tương đương label ở trên
          onFinish={handleAddProduct}
          autoComplete="off"
        >
          <Title level={3} style={{ color: '#1890ff', marginBottom: 24 }}>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </Title>

          {/* 6. Sử dụng Row/Col thay cho Grid */}
          <Row gutter={[24, 16]}>
            {/* Title */}
            <Col span={24}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Title is required' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            {/* Brand & Category */}
            <Col xs={24} sm={12}>
              <Form.Item
                name="brand"
                label="Brand"
                rules={[{ required: true, message: 'Brand is required' }]}
              >
                <Select placeholder="Select a brand">
                  {brands?.map((b) => (
                    <Option key={b._id} value={b._id}>
                      {b.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Category is required' }]}
              >
                <Select placeholder="Select a category">
                  {categories?.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Description */}
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Description is required' }]}
              >
                <TextArea rows={4} />
              </Form.Item>
            </Col>

            {/* Price & Discount */}
            <Col xs={24} sm={12}>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: 'Price is required' }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="discountPercentage"
                label="Discount (%)"
                rules={[
                  {
                    required: true,
                    message: 'Discount percentage is required',
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            {/* Stock & Thumbnail */}
            <Col xs={24} sm={12}>
              <Form.Item
                name="stockQuantity"
                label="Stock Quantity"
                rules={[{ required: true, message: 'Stock is required' }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="thumbnail"
                label="Thumbnail URL"
                rules={[{ required: true, message: 'Thumbnail is required' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            {/* Images */}
            <Col span={24}>
              <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                <Title level={5} style={{ margin: 0 }}>Product Images</Title>
                <Button
                  type="dashed"
                  onClick={() => setImageCount(c => c + 1)}
                  icon={<PlusOutlined />}
                >
                  Add Image
                </Button>
              </Flex>
              <Space direction="vertical" style={{ width: '100%' }}>
                {Array.from({ length: imageCount }).map((_, i) => (
                  <Form.Item
                    key={i}
                    name={`image${i}`}
                    label={
                      <Flex justify="space-between" align="center">
                        <span>Image {i + 1}</span>
                        {i > 0 && (
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => {
                              const values = form.getFieldsValue();
                              const newValues = { ...values };
                              delete newValues[`image${i}`];
                              form.setFieldsValue(newValues);
                              setImageCount(c => c - 1);
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </Flex>
                    }
                    rules={[{ required: i === 0, message: i === 0 ? 'At least one image is required' : undefined }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Input placeholder="Enter image URL" aria-label={`Image URL ${i + 1}`} />
                  </Form.Item>
                ))}
              </Space>
            </Col>
          </Row>

          {/* Actions */}
          {/* 7. Sử dụng Space thay cho Stack để căn chỉnh button */}
          <Space
            style={{
              width: '100%',
              justifyContent: 'flex-end',
              marginTop: 24,
            }}
          >
            <Button danger onClick={onSuccess}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={productAddStatus === 'pending'}
            >
              {isEdit ? 'Update Product' : 'Add Product'}
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
};