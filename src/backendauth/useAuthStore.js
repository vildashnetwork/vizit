
// src/store/useAuthStore.js
import { create } from "zustand";
import axiosInstance from "./axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "https://vizit-backend-hubw.onrender.com";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,
  isCheckingAuth: true,
  signinsucesss: false,
  loginsucesss: false,


  ownersignup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/api/owner/register", data);
      set({ authUser: res.data.newUser });
      localStorage.setItem("token", res.data.token);
      if (res.status === 201) {
        alert(res.data.message);
        window.location.href = "/owner/home"
        set({ signinsucesss: true });
      } else {
        alert(res.data.message);
        console.log(res.data.message)
        set({ signinsucesss: false });
      }
      get().connectSocket();

    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
      set({ signinsucesss: false });
    } finally {
      set({ isSigningUp: false });
    }
  },

  ownerlogin: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/api/owner/login", data);
      set({ authUser: res.data.user });
      localStorage.setItem("token", res.data.token);
      if (res.status === 200) {
        alert(res.data.message);
        window.location.href = "/owner/home"
        set({ loginsucesss: true })
      } else {
        alert(res.data.message);
        set({ loginsucesss: false })
      }
      get().connectSocket();
    } catch (error) {
      set({ loginsucesss: false })

      console.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },



  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/api/user/login", data);
      set({ authUser: res.data.user });
      localStorage.setItem("token", res.data.token);
      if (res.status === 200) {
        alert(res.data.message);
        window.location.href = "/user/home"
        set({ loginsucesss: true })
      } else {
        alert(res.data.message);
        set({ loginsucesss: false })
      }
      get().connectSocket();
    } catch (error) {
      set({ loginsucesss: false })

      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      set({ authUser: null });
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
      get().disconnectSocket();

    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },



  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/api/user/register", data);
      set({ authUser: res.data.newUser });
      localStorage.setItem("token", res.data.token);
      if (res.status === 201) {
        alert(res.data.message);
        window.location.href = "/user/home"
        set({ signinsucesss: true });
      } else {
        alert(res.data.message);
        set({ signinsucesss: false });
      }
      get().connectSocket();

    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      set({ signinsucesss: false });
    } finally {
      set({ isSigningUp: false });
    }
  },


  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      if (res.data) {
        set({ authUser: res.data });
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An unexpected error occurred");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
