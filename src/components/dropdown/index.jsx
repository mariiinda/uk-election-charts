import React from "react";
import { arrayOf, string, func, bool } from "prop-types";

import styles from "./styles.css";

function Dropdown({ items = [], selectItem, label, selectedItem, isActive }) {
  return (
    <div className={styles.dropdown}>
      <label className={styles.label}>{label}:</label>
      {isActive
        ? <select
            className={styles.select}
            onChange={selectItem}
            value={selectedItem}
            aria-label={`Select ${label}`}
          >
            {items.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        : <span className={styles.title}>{selectedItem}</span>}
    </div>
  );
}

Dropdown.propTypes = {
  items: arrayOf(string),
  label: string.isRequired,
  selectedItem: string.isRequired,
  selectItem: func.isRequired,
  isActive: bool
};

Dropdown.defaultProps = {
  items: [],
  isActive: true
};

export default Dropdown;
