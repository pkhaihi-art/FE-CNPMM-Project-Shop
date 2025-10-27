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
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)', // Hiệu ứng đổ bóng nhẹ
      }}
    >
      {/* 5. Component Form của Antd bọc toàn bộ phần nhập liệu */}
      <Form
        form={form}
        layout="vertical" // Nhãn nằm phía trên
        onFinish={handleAddProduct}
        autoComplete="off"
      >
        <Title level={3} style={{ color: '#1890ff', marginBottom: 24 }}>
          {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </Title>

        {/* 6. Dùng Row/Col để chia cột thay cho Grid */}
        <Row gutter={[24, 16]}>
          {/* Tiêu đề sản phẩm */}
          <Col span={24}>
            <Form.Item
              name="title"
              label="Tên sản phẩm"
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          {/* Thương hiệu & Thể loại */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="brand"
              label="Thương hiệu"
              rules={[{ required: true, message: 'Vui lòng chọn thương hiệu' }]}
            >
              <Select placeholder="Chọn thương hiệu">
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
              label="Thể loại"
              rules={[{ required: true, message: 'Vui lòng chọn thể loại' }]}
            >
              <Select placeholder="Chọn thể loại">
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Mô tả sản phẩm */}
          <Col span={24}>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm' }]}
            >
              <TextArea rows={4} />
            </Form.Item>
          </Col>

          {/* Giá & Giảm giá */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="price"
              label="Giá bán (VNĐ)"
              rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm' }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="discountPercentage"
              label="Giảm giá (%)"
              rules={[
                { required: true, message: 'Vui lòng nhập phần trăm giảm giá' },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          {/* Số lượng tồn & Ảnh đại diện */}
          <Col xs={24} sm={12}>
            <Form.Item
              name="stockQuantity"
              label="Số lượng trong kho"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="thumbnail"
              label="Đường dẫn ảnh đại diện"
              rules={[{ required: true, message: 'Vui lòng nhập URL ảnh đại diện' }]}
            >
              <Input placeholder="Nhập URL ảnh sản phẩm" />
            </Form.Item>
          </Col>

          {/* Danh sách hình ảnh phụ */}
          <Col span={24}>
            <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
              <Title level={5} style={{ margin: 0 }}>Hình ảnh sản phẩm</Title>
              <Button
                type="dashed"
                onClick={() => setImageCount(c => c + 1)}
                icon={<PlusOutlined />}
              >
                Thêm ảnh
              </Button>
            </Flex>

            <Space direction="vertical" style={{ width: '100%' }}>
              {Array.from({ length: imageCount }).map((_, i) => (
                <Form.Item
                  key={i}
                  name={`image${i}`}
                  label={
                    <Flex justify="space-between" align="center">
                      <span>Ảnh {i + 1}</span>
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
                          Xóa
                        </Button>
                      )}
                    </Flex>
                  }
                  rules={[{ required: i === 0, message: i === 0 ? 'Cần ít nhất 1 hình ảnh' : undefined }]}
                  style={{ marginBottom: 0 }}
                >
                  <Input placeholder="Nhập URL hình ảnh" aria-label={`URL hình ảnh ${i + 1}`} />
                </Form.Item>
              ))}
            </Space>
          </Col>
        </Row>

        {/* Nút hành động */}
        {/* 7. Sử dụng Space để căn chỉnh các nút */}
        <Space
          style={{
            width: '100%',
            justifyContent: 'flex-end',
            marginTop: 24,
          }}
        >
          <Button danger onClick={onSuccess}>Hủy</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={productAddStatus === 'pending'}
          >
            {isEdit ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
          </Button>
        </Space>
      </Form>
    </Card>
  </div>
)
};