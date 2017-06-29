import React from "react";

import styles from "./styles.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.smallText}>
        Source:
        {" "}
        <a
          href="//researchbriefings.parliament.uk/ResearchBriefing/Summary/CBP-7529"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.smallTextLink}
        >
          UK Election Statistics: 1918 - 2017
        </a>
      </p>
      <p className={styles.smallText}>
        {" | "}
        Created by
        {" "}
        <a
          className={styles.smallTextLink}
          href="//marinda.me"
          target="_blank"
          rel="noopener noreferrer"
        >
          Marinda
        </a>
      </p>
    </footer>
  );
}

Footer.propTypes = {};

Footer.defaultProps = {};

export default Footer;
