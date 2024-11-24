import React, { useState } from 'react';

interface EditPopupProps {
    title: string;
    currentValue: string;
    onSave: (newValue: string) => void;
    onClose: () => void;
}

const EditProfile: React.FC<EditPopupProps> = ({ title, currentValue, onSave, onClose }) => {
    const [inputValue, setInputValue] = useState(currentValue);

    const handleSave = () => {
        onSave(inputValue);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-80">
                <h3 className="text-xl font-bold mb-4">{title}</h3>
                <input
                    type="text"
                    className="border w-full p-2 mb-4"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">Lưu</button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
