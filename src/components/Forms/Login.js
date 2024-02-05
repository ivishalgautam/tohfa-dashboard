"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import http from "../../utils/http";
import { endpoints } from "../../utils/endpoints";
import Spinner from "../Spinner";
import Logo from "../../../public/assets/images/logo.webp";
import LoginImage from "../../../public/assets/images/login.png";
import Image from "next/image";
import toast from "react-hot-toast";
import { isObject } from "@/utils/object";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  async function loginUser(credentials) {
    setLoading(true);
    try {
      const response = await http().post(endpoints.auth.login, credentials);
      localStorage.setItem("user", JSON.stringify(response.user_data));
      localStorage.setItem("token", response.token);
      localStorage.setItem("refreshToken", response.refresh_token);
      router.push("/");

      return response.data;
    } catch (error) {
      console.log(error);
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        toast.error("Unable to complete your request.");
      }
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (formData) => {
    await loginUser(formData);
    reset();
  };

  return (
    <div className="flex items-center justify-center login-gradient h-screen">
      <div className="max-w-6xl grid grid-cols-2 rounded-[59px] overflow-hidden shadow-2xl">
        <div className="bg-white flex flex-col items-center justify-center space-y-6">
          <Image src={Logo} alt="" />
          <h3 className="font-primary font-bold text-[#110B56] text-2xl">
            Welcome Back
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="w-96 space-y-6">
            <div>
              <input
                type="text"
                id="username"
                placeholder="Username"
                className="w-full px-4 py-2 outline-none border border-gray-300 rounded-md"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 pr-10 outline-none border border-gray-300 rounded-md"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <span
                  className="block absolute right-3 top-[50%] -translate-y-[50%] cursor-pointer z-50"
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary rounded-full text-white"
            >
              {loading ? <Spinner color="white" /> : "Submit"}
            </button>
          </form>
        </div>
        <div className="bg-[#f7f7fc]">
          <Image src={LoginImage} alt="" />
        </div>
      </div>
    </div>
  );
}
