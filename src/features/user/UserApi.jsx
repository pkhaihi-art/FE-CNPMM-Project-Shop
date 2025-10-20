import { axiosi } from "../../config/axios"

export const fetchLoggedInUserById=async(id)=>{
    try {
        const res=await axiosi.get(`/users/profile`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
export const updateUserById=async(update)=>{
    try {
        const res=await axiosi.patch(`/users/update`,update)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}