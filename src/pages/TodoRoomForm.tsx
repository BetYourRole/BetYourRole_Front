import React from 'react';
import StepOneForm from './StepOneForm';
import StepTwoForm from './StepTwoForm';
import { useTodoForm } from './useTodoForm';
import { API } from '../api/API'
import { TodoRoom } from './types'
import { redirect, useNavigate } from 'react-router-dom';

const TodoRoomForm: React.FC = () => {
  const navigate = useNavigate();
  const { formData, roles, setRoles, step, setStep, handleChange, handleRoleChange } = useTodoForm();

  const handleNext = () => {
    setRoles(prevRoles => {
      const updatedHeadCount = formData.headCount;
  
      if (prevRoles.length < updatedHeadCount) {
        const additionalRoles = Array.from({ length: updatedHeadCount - prevRoles.length }, () => ({
          name: '',
          description: '',
        }));
        return [...prevRoles, ...additionalRoles];
      } else if (prevRoles.length > updatedHeadCount) {
        return prevRoles.slice(0, updatedHeadCount);
      }
      return prevRoles;
    });
  
    setStep(2); // 다음 단계로 이동
  };
  
  const handleBack = () => {
    setStep(1); // 이전 단계로 이동
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const instance = API()

    const data = formData;
    data.todos = roles;
    const token = localStorage.getItem('accessToken');
    if(token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const respone = await instance.post("/todo-room", data);
    const result:TodoRoom = respone.data;

    navigate(`/todo-room/${result.url}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-2xl p-8 w-full max-w-screen-lg mx-4 lg:mx-8">
        {step === 1 && (
          <StepOneForm
            formData={formData}
            handleChange={handleChange}
            handleNext={handleNext}
          />
        )}
        {step === 2 && (
          <StepTwoForm
            roles={roles}
            handleRoleChange={handleRoleChange}
            handleBack={handleBack}
          />
        )}
      </form>
    </div>
  );
};

export default TodoRoomForm;
