// services/users.ts

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export type UserProfile = {
  id: string;
  email: string;
  username: string;
  is_member?: boolean;
  created_at?: number;
};

/**
 * 创建用户业务数据
 * 在注册成功后调用一次
 */
export async function createUserProfile(
  user: Pick<UserProfile, "id" | "email" | "username">
) {
  const ref = doc(db, "users", user.id);

  await setDoc(ref, {
    email: user.email,
    username: user.username,
    is_member: false,
    created_at: Date.now()
  });
}

/**
 * 获取用户业务信息
 * 用于判断是否是会员
 */
export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null;
  }

  return {
    id: snap.id,
    ...(snap.data() as Omit<UserProfile, "id">)
  };
}

/**
 * 设置或更新会员状态
 */
export async function setUserMemberStatus(
  userId: string,
  isMember: boolean
) {
  const ref = doc(db, "users", userId);

  await updateDoc(ref, {
    is_member: isMember
  });
}
