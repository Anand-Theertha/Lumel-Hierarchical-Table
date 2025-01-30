import React, { useState } from "react";
import "./App.css";
import HierarchicalTable from "./components/HierarchicalTable";

const sampleData = {
  rows: [
    {
      id: "electronics",
      label: "Electronics",
      value: 1400,
      children: [
        {
          id: "phones",
          label: "Phones",
          value: 800,
        },
        {
          id: "laptops",
          label: "Laptops",
          value: 700,
        },
      ],
    },
    {
      id: "furniture",
      label: "Furniture",
      value: 1000,
      children: [
        {
          id: "tables",
          label: "Tables",
          value: 300,
        },
        {
          id: "chairs",
          label: "Chairs",
          value: 700,
        },
      ],
    },
  ],
};

function App() {
  return (
    <>
      <h1>Simple Hierarchical Table</h1>
      <HierarchicalTable data={sampleData} />
    </>
  );
}

export default App;
