import axios from "axios"
import { PROXY } from "../utils/constants"

export const createInfo = (data) => {
    return axios({
        method: "POST",
        data: data,
        url: `${PROXY}/api/info/create`,
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
}

export const updateInfo = (id, data) => {
    return axios({
        method: "PUT",
        url: `${PROXY}/api/info/update/${id}`,
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export const deleteInfo = (id) => {
    return axios({
        method: "DELETE",
        url: `${PROXY}/api/info/delete/${id}`,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export const getAllInfos = (page, limit, search) => {
    return axios({
        method: "POST",
        url: `${PROXY}/api/info/all`,
        data: {
            page, limit, search
        },
        headers: {
            "Content-Type": "application/json"
        }
    })
}