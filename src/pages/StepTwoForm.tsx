import React from 'react';

interface Role {
  roleName: string;
  roleDescription: string;
}

interface StepTwoFormProps {
  roles: Role[];
  handleRoleChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBack: () => void;
}

const StepTwoForm: React.FC<StepTwoFormProps> = ({ roles, handleRoleChange, handleBack }) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">역할 및 설명 입력</h2>
      {roles.map((role, index) => (
        <div key={index} className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">역할명 {index + 1}:</label>
          <input
            type="text"
            name="roleName"
            value={role.roleName}
            onChange={(e) => handleRoleChange(index, e)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`역할명 ${index + 1}`}
          />

          <label className="block text-gray-700 font-semibold mb-2 mt-2">역할 설명:</label>
          <input
            type="text"
            name="roleDescription"
            value={role.roleDescription}
            onChange={(e) => handleRoleChange(index, e)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`역할 설명 ${index + 1}`}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={handleBack}
        className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
      >
        이전 단계로
      </button>

      <button
        type="submit"
        className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        제출
      </button>
    </>
  );
};

export default StepTwoForm;
