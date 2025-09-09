import { BACKEND_URL } from "../constants/backendURL";
import {
  type LoginBody,
  type LoginResponse /* RegisterBody, UserDetails */,
} from "../models";

// export const createUser = async (
//   user: RegisterBody
// ): Promise<LoginResponse> => {
//   try {
//     const response = await fetch(`${BACKEND_URL}/api/users/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(user),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       return { error: errorData.error || "Something went wrong" };
//     }

//     const data: LoginResponse = await response.json();
//     return data;
//   } catch (error) {
//     return { error: (error as Error).message };
//   }
// };

export const loginUser = async (user: LoginBody): Promise<LoginResponse> => {
  const response = await fetch(`${BACKEND_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.error || "Something went wrong",
      status: response.status,
    };
  }

  return data;
};

// export const getProfileData = async (
//   userID: string,
//   token: string
// ): Promise<UserDetails> => {
//   try {
//     const response = await fetch(`${BACKEND_URL}/api/users/${userID}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       const AlertMessage = `HTTP error! Status: ${response.status}, Status Text: ${response.statusText}`;
//       throw new Error(AlertMessage);
//     }

//     const data: UserDetails = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching profile data:", error);
//     throw error;
//   }
// };
