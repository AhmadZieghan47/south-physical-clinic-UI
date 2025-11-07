import { useState, useEffect } from 'react';
import { enumLabelsApi } from '../../../../api/enumLabels';
import type { EnumLabel, CreateEnumLabelData } from '../../../../api/enumLabels';

interface FormData {
  enumType: string;
  code: string;
  labelEn: string;
  labelAr: string;
}

interface FormErrors {
  enumType?: string;
  code?: string;
  labelEn?: string;
  labelAr?: string;
  general?: string;
}

interface UseEnumLabelFormProps {
  enumLabel: EnumLabel | null;
  onSuccess: () => void;
}

interface UseEnumLabelFormResult {
  formData: FormData;
  errors: FormErrors;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Custom hook for managing enum label form state and submission
 */
export const useEnumLabelForm = ({ enumLabel, onSuccess }: UseEnumLabelFormProps): UseEnumLabelFormResult => {
  const [formData, setFormData] = useState<FormData>({
    enumType: '',
    code: '',
    labelEn: '',
    labelAr: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (enumLabel) {
      setFormData({
        enumType: enumLabel.enumType,
        code: enumLabel.code,
        labelEn: enumLabel.labelEn,
        labelAr: enumLabel.labelAr
      });
    }
  }, [enumLabel]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.enumType.trim()) {
      newErrors.enumType = 'Enum type is required';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    }

    if (!formData.labelEn.trim()) {
      newErrors.labelEn = 'English label is required';
    }

    if (!formData.labelAr.trim()) {
      newErrors.labelAr = 'Arabic label is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const data: CreateEnumLabelData = {
        enumType: formData.enumType.trim(),
        code: formData.code.trim().toUpperCase(),
        labelEn: formData.labelEn.trim(),
        labelAr: formData.labelAr.trim()
      };

      if (enumLabel) {
        // Update existing enum label
        await enumLabelsApi.update(enumLabel.enumType, enumLabel.code, {
          labelEn: data.labelEn,
          labelAr: data.labelAr
        });
      } else {
        // Create new enum label
        await enumLabelsApi.create(data);
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error saving enum label:', err);
      setErrors({
        general: err.response?.data?.message || 'Failed to save enum label. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit
  };
};

