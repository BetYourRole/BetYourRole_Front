import { useState } from 'react';
import { Data, Role } from './types';

export const useTodoForm = () => {
  const [formData, setFormData] = useState<Data>({
    name: '',
    inscription: '',
    headCount: 2,
    matchingType: 'RATIO',
    point: 100,
    visibility: false,
    todos: [],
    password: "",
  });

  const [roles, setRoles] = useState<Role[]>([]); // 역할 상태
  const [step, setStep] = useState(1); // 단계 상태

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checkValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData({
      ...formData,
      [name]: checkValue,
    });
  };

  const handleRoleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newRoles = [...roles];
    newRoles[index] = { ...newRoles[index], [name]: value };
    setRoles(newRoles);
  };

  return {
    formData,
    roles,
    setRoles,    // setRoles 반환
    step,
    setStep,     // setStep 반환
    handleChange,
    handleRoleChange,
  };
};
