// services/auth.ts

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { createUserProfile } from "./users";

/**
 * 注册用户
 * - email + password：认证（Firebase Auth）
 * - username：业务数据（Firestore users 表）
 */
export async function register(
  email: string,
  password: string,
  username: string
) {
  try {
    // 1. 创建认证用户（Firebase 管密码）
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // 2. 创建业务用户数据（你自己的）
    await createUserProfile({
      id: user.uid,
      email,
      username
    });

    // 3. 返回“干净”的用户对象
    return {
      data: {
        id: user.uid,
        email: user.email,
        username
      },
      error: null
    };
  } catch (err: any) {
    return {
      data: null,
      error: err.message || "Register failed"
    };
  }
}

/**
 * 登录用户
 */
export async function login(email: string, password: string) {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;

    return {
      data: {
        id: user.uid,
        email: user.email
      },
      error: null
    };
  } catch (err: any) {
    return {
      data: null,
      error: err.message || "Login failed"
    };
  }
}

/**
 * 退出登录
 */
export async function logout() {
  try {
    await signOut(auth);
    return { data: true, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}
