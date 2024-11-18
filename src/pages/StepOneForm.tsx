import React, { useState } from 'react';
import { Data } from './types'

interface StepOneFormProps{
  formData: Data;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleNext: () => void;
}

const StepOneForm: React.FC<StepOneFormProps> = ({ formData, handleChange, handleNext }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 유효성 검사 함수
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = '방 이름은 필수입니다.';
    // if (!formData.inscription) newErrors.inscription = '방 설명은 필수입니다.';
    if (formData.headCount < 2) newErrors.headCount = '인원수는 2 이상이어야 합니다.';
    if (formData.point <= 1) newErrors.point = '포인트는 1보다 커야 합니다.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // 에러가 없을 경우 true 반환
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleNext(); // 유효성 검사가 성공했을 경우에만 다음 단계로 진행
    }
  };

  return (
    <>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">방 이름:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : ''
          }`}
          placeholder="Enter room name"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">방 설명:</label>
        <input
          type="text"
          name="inscription"
          value={formData.inscription}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.inscription ? 'border-red-500' : ''
          }`}
          placeholder="Enter room description"
        />
        {errors.inscription && <p className="text-red-500 text-sm">{errors.inscription}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">인원수(2 이상):</label>
        <input
          type="number"
          name="headCount"
          value={formData.headCount}
          min="2"
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.headCount ? 'border-red-500' : ''
          }`}
          placeholder="Enter head count"
        />
        {errors.headCount && <p className="text-red-500 text-sm">{errors.headCount}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">낙찰 알고리즘:</label>
        <select
          name="matchingType"
          value={formData.matchingType}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="DEFERRED_RATIO">DEFERRED_RATIO</option>
          <option value="HIGHEST_FIRST">HIGHEST_FIRST</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">인당 베팅 가능한 포인트:</label>
        <input
          type="number"
          name="point"
          value={formData.point}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.point ? 'border-red-500' : ''
          }`}
          placeholder="Enter points"
        />
        {errors.point && <p className="text-red-500 text-sm">{errors.point}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">종료 후 배팅 금액 공개 여부:</label>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="visibility"
            checked={formData.visibility}
            onChange={handleChange}
            className="h-5 w-5 text-blue-500 focus:ring-2 focus:ring-blue-500 rounded"
          />
          <span className="ml-2 text-gray-700">공개 여부</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        다음 단계로
      </button>
    </>
  );
};

export default StepOneForm;
