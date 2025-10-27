import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  deleteAddressByIdAsync,
  updateAddressByIdAsync,
} from "../AddressSlice";

export const Address = ({ id, type, street, city, state, phoneNumber, userId }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { type, street, city, state, phoneNumber },
  });

  const handleUpdate = (data) => {
    dispatch(updateAddressByIdAsync({ id, ...data }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      dispatch(deleteAddressByIdAsync(id));
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      {isEditing ? (
        <form
          onSubmit={handleSubmit(handleUpdate)}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <label>
            Type:
            <input
              type="text"
              {...register("type", { required: "Type is required" })}
              style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
            />
            {errors.type && (
              <span style={{ color: "red" }}>{errors.type.message}</span>
            )}
          </label>

          <label>
            Street:
            <input
              type="text"
              {...register("street", { required: "Street is required" })}
              style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
            />
            {errors.street && (
              <span style={{ color: "red" }}>{errors.street.message}</span>
            )}
          </label>

          <label>
            City:
            <input
              type="text"
              {...register("city", { required: "City is required" })}
              style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
            />
            {errors.city && (
              <span style={{ color: "red" }}>{errors.city.message}</span>
            )}
          </label>

          <label>
            State:
            <input
              type="text"
              {...register("state", { required: "State is required" })}
              style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
            />
            {errors.state && (
              <span style={{ color: "red" }}>{errors.state.message}</span>
            )}
          </label>

          <label>
            Phone:
            <input
              type="text"
              {...register("phoneNumber", { required: "Phone is required" })}
              style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
            />
            {errors.phone && (
              <span style={{ color: "red" }}>{errors.phone.message}</span>
            )}
          </label>

          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button
              type="submit"
              style={{
                background: "#1677ff",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setIsEditing(false);
              }}
              style={{
                background: "gray",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <p><strong>Type:</strong> {type}</p>
          <p><strong>Street:</strong> {street}</p>
          <p><strong>City:</strong> {city}</p>
          <p><strong>State:</strong> {state}</p>
          <p><strong>Phone:</strong> {phoneNumber}</p>

          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                background: "#1677ff",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              style={{
                background: "#ff4d4f",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};
