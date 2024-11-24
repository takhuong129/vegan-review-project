import React, { useState } from 'react';
import { RiArrowDropDownLine } from "react-icons/ri";


const options = [
    "TP HCM",
    "Long An",
    "Tiền Giang",
    "Bến Tre",
    "Vĩnh Long",
    "Trà Vinh",
    "Đồng Tháp",
    "An Giang",
    "Kiên Giang",
    "Cần Thơ",
    "Hậu Giang",
    "Sóc Trăng",
    "Bạc Liêu",
    "Cà Mau"
  ];

  const FilterDropdown: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>(options[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    // Do something with the selected option, like passing it to a parent component or filtering data
    console.log('Selected option:', option);
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn m-1"  onClick={toggleDropdown}>
        {selectedOption}
        <RiArrowDropDownLine size={24} />
      </div>
      {isDropdownOpen && (
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-[32rem]">
        {options.map((option, index) => (
          <li key={index}>
            <a onClick={() => handleSelect(option)}>{option}</a>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}

export default FilterDropdown;
