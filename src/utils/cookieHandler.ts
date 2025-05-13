import { cookies } from "next/headers";



const HUNDRED_YEARS_IN_SECONDS = 60 * 60 * 24 * 365 * 100; // 100 years

export const setCookie = (name: string, value: string, maxAge?: number) => {
  const cookieStore = cookies();
  cookieStore.set(name, value, {
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_ENVIRONMENT === "prod",
    maxAge: maxAge ?? HUNDRED_YEARS_IN_SECONDS,
    path: "/",
  });
};

// Function to get a cookie
export const getCookie = (name: string) => {
  const cookieStore = cookies();

  return cookieStore.get(name)?.value || null;
};

// Function to remove a cookie
export const removeCookie = (name: string) => {
  const cookieStore = cookies();
  cookieStore.set(name, "", {
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_ENVIRONMENT === "prod",
    maxAge: -1, // Expire immediately
    path: "/",
  });
};
