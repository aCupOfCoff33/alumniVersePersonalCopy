// Design is gonna be be changed more to be like LinkedIn's eventually. just got slightly lazy and this is the bare bone

import React from "react";

const BarGraphFilter = ({
  data,
  selectedCompanies,
  onCompanyClick,
  barHeight = "16px",
  barSpacing = "8px",
  fontSize = "12px",
}) => {
  return (
    <div>
      <h3 className="text-black text-sm font-bold mb-2" style={{ fontSize }}>
        Where they work
      </h3>
      {data.map((item, index) => (
        <div
          key={index}
          className={`flex items-center cursor-pointer ${
            selectedCompanies.includes(item.company) ? "bg-gray-300" : ""
          }`}
          style={{
            padding: "8px",
            marginBottom: barSpacing,
            height: `calc(${barHeight} + 16px)`,
            borderRadius: "8px",
          }}
          onClick={() => onCompanyClick(item.company)}
        >
          <div className="flex items-center w-full">
            <span
              style={{
                fontSize,
                width: "100px",
                textAlign: "left",
                color: "black",
              }}
            >
              {item.company}
            </span>
            <div
              className="flex items-center bg-gray-200 rounded-lg ml-4"
              style={{
                flex: 1,
                height: barHeight,
              }}
            >
              <div
                className="bg-gray-500 rounded-lg"
                style={{
                  width: `${item.count * 20}px`,
                  height: barHeight,
                }}
              ></div>
            </div>
            <span
              className="ml-2"
              style={{
                fontSize,
                minWidth: "30px",
                textAlign: "right",
                color: "black",
              }}
            >
              {item.count}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BarGraphFilter;
