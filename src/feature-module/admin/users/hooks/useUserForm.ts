import { useState, useEffect, useCallback } from "react";
import { usersApi } from "../../../../api/users";
import type { AppUser, UserRole } from "../../../../api/users";

interface FormData {
  email: string;
  password: string;
  fullName: string;
  username: string;
  role: UserRole;
  whatsappNumber: string;
  isActive: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  fullName?: string;
  username?: string;
  role?: string;
  whatsappNumber?: string;
  general?: string;
}

interface UseUserFormParams {
  user: AppUser | null;
  onSuccess: () => void;
}

interface UseUserFormResult {
  formData: FormData;
  errors: FormErrors;
  loading: boolean;
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: any } }
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Custom hook for managing user form state and submission
 * Handles validation, API calls, and error handling
 */
export const useUserForm = ({
  user,
  onSuccess,
}: UseUserFormParams): UseUserFormResult => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    fullName: "",
    username: "",
    role: "RECEPTION" as UserRole,
    whatsappNumber: "",
    isActive: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        password: "", // Never populate password field
        fullName: user.fullName,
        username: user.username,
        role: user.role,
        whatsappNumber: user.whatsappNumber || "",
        isActive: user.isActive,
      });
    }
  }, [user]);

  const handleChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
        | { target: { name: string; value: any } }
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error for this field when user starts typing
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name as keyof FormErrors];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation (only for create)
    if (!user) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, hyphens, and underscores";
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (user) {
        // Update existing user (exclude password)
        const submitData = {
          email: formData.email,
          fullName: formData.fullName,
          username: formData.username,
          role: formData.role,
          whatsappNumber: formData.whatsappNumber || null,
          isActive: formData.isActive,
        };
        await usersApi.update(user.id, submitData);
      } else {
        // Create new user
        const submitData = {
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          username: formData.username,
          role: formData.role,
          whatsappNumber: formData.whatsappNumber || null,
          isActive: formData.isActive,
        };
        await usersApi.create(submitData);
      }

      onSuccess();
    } catch (err: any) {
      console.error("Error submitting user:", err);

      // Handle API errors
      if (err.response?.data?.message) {
        const message = err.response.data.message;

        // Check for specific error messages
        if (message.includes("Email already exists")) {
          setErrors({ email: "This email is already registered" });
        } else if (message.includes("Username already exists")) {
          setErrors({ username: "This username is already taken" });
        } else if (message.includes("Cannot change your own role")) {
          setErrors({ general: "You cannot modify your own role" });
        } else if (message.includes("Cannot change your own active status")) {
          setErrors({
            general: "You cannot change your own active status",
          });
        } else {
          setErrors({ general: message });
        }
      } else {
        setErrors({ general: "Failed to save user. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
  };
};


