import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { selectUserInfo } from '../UserSlice'
import { 
    addAddressAsync,
    fetchAddressByUserIdAsync,
    resetAddressAddStatus, 
    resetAddressDeleteStatus, 
    resetAddressUpdateStatus, 
    selectAddressAddStatus, 
    selectAddressDeleteStatus, 
    selectAddressStatus, 
    selectAddressUpdateStatus, 
    selectAddresses 
} from '../../address/AddressSlice'

import { Address } from '../../address/components/Address' 

import './UserProfile.css' // <-- Tạo file CSS riêng để style

export const UserProfile = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            type: '',
            street: '',
            postalCode: '',
            country: 'Vietnam',
            phoneNumber: '',
            state: '',
            city: ''
        }
    });

    const status = useSelector(selectAddressStatus);
    const userInfo = useSelector(selectUserInfo);
    const addresses = useSelector(selectAddresses);
    const [addAddress, setAddAddress] = useState(false);

    const addressAddStatus = useSelector(selectAddressAddStatus);
    const addressUpdateStatus = useSelector(selectAddressUpdateStatus);
    const addressDeleteStatus = useSelector(selectAddressDeleteStatus);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    useEffect(() => {
        if (addressAddStatus === 'fulfilled') {
            toast.success(t('address_add_success'));
            reset();
            setAddAddress(false);
        } else if (addressAddStatus === 'rejected') {
            toast.error(t('address_add_error'));
        }
    }, [addressAddStatus, reset, t]);

    useEffect(() => {
        if (addressUpdateStatus === 'fulfilled') {
            toast.success(t('address_update_success'));
        } else if (addressUpdateStatus === 'rejected') {
            toast.error(t('address_update_error'));
        }
    }, [addressUpdateStatus, t]);

    useEffect(() => {
        if (addressDeleteStatus === 'fulfilled') {
            toast.success(t('address_delete_success'));
        } else if (addressDeleteStatus === 'rejected') {
            toast.error(t('address_delete_error'));
        }
    }, [addressDeleteStatus, t]);

    useEffect(() => {
        return () => {
            dispatch(resetAddressAddStatus());
            dispatch(resetAddressUpdateStatus());
            dispatch(resetAddressDeleteStatus());
        }
    }, [dispatch]);

    const handleAddAddress = (data) => {
        if (!data.type || !data.street || !data.postalCode || !data.country) {
            toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
            return;
        }
        const address = { 
            ...data, 
            user: userInfo._id,
            country: data.country || 'Vietnam'
        };
        try {
            dispatch(addAddressAsync(address))
                .unwrap()
                .then(() => dispatch(fetchAddressByUserIdAsync()))
                .catch((error) => {
                    toast.error(error.message || 'Lỗi khi thêm địa chỉ');
                });
        } catch {
            toast.error('Lỗi khi thêm địa chỉ');
        }
    };

    return (
        <div className="user-profile">
            <div className="profile-container">
                <div className="user-info">
                    <div className="avatar">{userInfo?.name?.charAt(0)}</div>
                    <p className="user-name">{userInfo?.name}</p>
                    <p className="user-email">{userInfo?.email}</p>
                </div>

                <div className="address-section">
                    <div className="address-header">
                        <h3>Quản lý địa chỉ</h3>
                        <button className="btn btn-primary" onClick={() => setAddAddress(true)}>Thêm</button>
                    </div>

                    {addAddress && (
                        <form className="address-form" onSubmit={handleSubmit(handleAddAddress)}>
                            <div className="form-group">
                                <label>Loại</label>
                                <input aria-label="Loại địa chỉ" {...register("type", { required: true })} placeholder="Nhà, Doanh nghiệp" />
                                {errors.type && <span className="error">Vui lòng chọn loại địa chỉ</span>}
                            </div>

                            <div className="form-group">
                                <label>Địa chỉ</label>
                                <input aria-label="Địa chỉ" {...register("street", { required: true })} />
                                {errors.street && <span className="error">Vui lòng nhập địa chỉ</span>}
                            </div>

                            <div className="form-group">
                                <label>Mã bưu chính</label>
                                <input aria-label="Mã bưu chính" type="number" {...register("postalCode", { required: true })} />
                                {errors.postalCode && <span className="error">Vui lòng nhập mã bưu chính</span>}
                            </div>

                            <div className="form-group">
                                <label>Quốc gia</label>
                                <input aria-label="Quốc gia" {...register("country", { required: true })} />
                                {errors.country && <span className="error">Vui lòng nhập quốc gia</span>}
                            </div>

                            <div className="form-group">
                                <label>Số điện thoại</label>
                                <input aria-label="Số điện thoại" {...register("phoneNumber", { required: true })} />
                                {errors.phoneNumber && <span className="error">Vui lòng nhập số điện thoại</span>}
                            </div>

                            <div className="form-group">
                                <label>Tỉnh/Thành</label>
                                <input aria-label="Tỉnh/Thành" {...register("state", { required: true })} />
                                {errors.state && <span className="error">Vui lòng nhập tỉnh hoặc thành phố</span>}
                            </div>

                            <div className="form-group">
                                <label>Thành phố</label>
                                <input aria-label="Thành phố" {...register("city", { required: true })} />
                                {errors.city && <span className="error">Vui lòng nhập thành phố</span>}
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary" disabled={status === 'pending'}>
                                    {status === 'pending' ? 'Đang thêm...' : 'Thêm'}
                                </button>
                                <button type="button" className="btn btn-cancel" onClick={() => setAddAddress(false)}>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="address-list">
                        {addresses.length > 0 ? (
                            addresses.map((address) => (
                                <Address 
                                    key={address._id} 
                                    {...address} 
                                    id={address._id}
                                />
                            ))
                        ) : (
                            <p className="no-address">Bạn chưa thêm địa chỉ nào</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
