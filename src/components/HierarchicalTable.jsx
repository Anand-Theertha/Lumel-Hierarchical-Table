import React, { useState } from "react";
import "./HierarchicalTable.css";

const HierarchicalTable = ({ data }) => {
  const [rows, setRows] = useState(
    data.rows.map((row) => ({ ...row, originalValue: row.value }))
  );

  const calculateSubtotals = (rows) => {
    return rows.map((row) => {
      if (row.children) {
        const updatedChildren = calculateSubtotals(row.children);
        const subtotal = updatedChildren.reduce(
          (sum, child) => sum + child.value,
          0
        );
        return { ...row, children: updatedChildren, value: subtotal };
      }
      return row;
    });
  };

  const updateValue = (id, newValue, isPercentage = false) => {
    const updateRows = (rows) => {
      return rows.map((row) => {
        if (row.id === id) {
          const updatedValue = isPercentage
            ? row.value + (row.value * newValue) / 100
            : newValue;

          if (row.children) {
            // Calculate contribution percentages for children
            const totalChildrenValue = row.children.reduce(
              (sum, child) => sum + child.value,
              0
            );
            const updatedChildren = row.children.map((child) => {
              const contributionPercentage =
                totalChildrenValue === 0
                  ? 0
                  : (child.value / totalChildrenValue) * 100;
              return {
                ...child,
                value: +(updatedValue * (contributionPercentage / 100)).toFixed(
                  2
                ),
              };
            });
            return { ...row, value: updatedValue, children: updatedChildren };
          }

          return { ...row, value: updatedValue };
        } else if (row.children) {
          return { ...row, children: updateRows(row.children) };
        }
        return row;
      });
    };

    const updatedRows = calculateSubtotals(updateRows(rows));
    setRows(updatedRows);
  };

  const updateOriginalValues = (rows) => {
    return rows.map((row) => {
      if (row.children) {
        return { ...row, children: updateOriginalValues(row.children) };
      }
      return { ...row, originalValue: row.value };
    });
  };

  const calculateVariance = (row) => {
    const variance =
      ((row.value - row.originalValue) / row.originalValue) * 100;
    return isNaN(variance) ? 0 : variance.toFixed(2);
  };

  const propagateInputValue = (rows, id, value) => {
    return rows.map((row) => {
      if (row.id === id) {
        row.inputValue = value;
      }
      if (row.children) {
        row.children = propagateInputValue(row.children, id, value);
      }
      return row;
    });
  };

  const renderRows = (rows, level = 0) => {
    return rows.map((row) => (
      <React.Fragment key={row.id}>
        <tr>
          <td style={{ paddingLeft: `${level * 10}px` }}>
            {level > 0 ? "-- " : ""}
            {row.label}
          </td>
          <td className="table__row-align">{Math.round(row.value)}</td>
          <td>
            <input
              type="number"
              placeholder="Enter value"
              className="table__row-input"
              onChange={(e) => {
                const inputValue = e.target.value;
                setRows((prevRows) =>
                  propagateInputValue(prevRows, row.id, inputValue)
                );
              }}
            />
          </td>
          <td className="table__row-align">
            <button
              className="updateValue__button"
              onClick={() => {
                if (row.inputValue) {
                  updateValue(row.id, Number(row.inputValue), true);
                }
              }}
            >
              Allocate %
            </button>
          </td>
          <td className="table__row-align">
            <button
              className="updateValue__button"
              onClick={() => {
                if (row.inputValue) {
                  updateValue(row.id, Number(row.inputValue));
                }
              }}
            >
              Allocate Value
            </button>
          </td>
          <td className="table__row-align">{calculateVariance(row)}%</td>
        </tr>
        {row.children && renderRows(row.children, level + 1)}
      </React.Fragment>
    ));
  };

  const grandTotal = rows.reduce((sum, row) => sum + row.value, 0);

  return (
    <div>
      <table border="1" width="100%" className="table">
        <thead className="table__header">
          <tr className="table__row">
            <th>Label</th>
            <th>Value</th>
            <th>Input</th>
            <th>Allocation %</th>
            <th>Allocation Val</th>
            <th>Variance %</th>
          </tr>
        </thead>
        <tbody>
          {renderRows(rows)}
          <tr>
            <td>
              <strong>Grand Total</strong>
            </td>
            <td className="table__row-align">{Math.round(grandTotal)}</td>
            <td colSpan="4"></td>
          </tr>
        </tbody>
      </table>
      <button onClick={() => setRows(updateOriginalValues(rows))}>
        Reset Variance
      </button>
    </div>
  );
};

export default HierarchicalTable;
