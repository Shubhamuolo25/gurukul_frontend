import axios from "axios";
// import { toast } from 'react-toastify';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { LoggedOutModal } from '../components/modal.jsx';

let modalRoot = null;
function showLoggedOutModal() {
  if (!modalRoot) {
    const div = document.createElement('div');
    document.body.appendChild(div);
    modalRoot = createRoot(div);
  }
  modalRoot.render(
    <LoggedOutModal open={true} onOk={() => {
      modalRoot.unmount();
      window.location.href = '/';
    }} />
  );
}

const network = axios.create({
  baseURL: "http://localhost:5001/api", 
  withCredentials: true, // <-- send cookies (including httpOnly) with requests
});

network.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      showLoggedOutModal();
    }
    return Promise.reject(error);
  }
);

export default network;
