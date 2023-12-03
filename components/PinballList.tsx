import React from "react";

interface PinballProps {
  machineList: string[];
}
const PinballList: React.FC<PinballProps> = ({ machineList }) => {
  return (
    <>
      <h3>List of machines</h3>
      <ul>
        {machineList.map((machine: string) => (
          <li key={machine} className="machineName">
            Machine name: {machine}
          </li>
        ))}
      </ul>
    </>
  );
};

export default PinballList;
