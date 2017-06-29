import React from "react";

import styles from "./styles.css";

function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        UK election seats
        {" "}
        <span className={styles.smallTitle}>1918 - 2017</span>
      </h1>
      <p className={styles.intro}>
        Parliamentary seats won by major parties for each UK election from 1918 to 2017. Select from the dropdown below or press play to discover seat proportions for each year.
      </p>
    </header>
  );
}

Header.propTypes = {};

Header.defaultProps = {};

export default Header;
