import React from 'react';

import styles from './styles.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.smallText}>
        <iframe
          className={styles.github}
          src="https://ghbtns.com/github-btn.html?user=marinda-s&repo=uk-election-charts&type=star"
          frameBorder="0"
          scrolling="0"
          width="60px"
          height="30px"
        />
      </p>
      <p className={styles.smallText}>
        Source:
        {' '}
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
        Created by
        {' '}
        <a
          className={styles.smallTextLink}
          href="http://marinda.me"
          target="_blank"
          rel="noopener noreferrer"
        >
          Marinda S
        </a>
      </p>
    </footer>
  );
}

Footer.propTypes = {};

Footer.defaultProps = {};

export default Footer;
