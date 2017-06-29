import React, { Component } from "react";
import { arrayOf, func, string, shape } from "prop-types";
import { connect } from "react-redux";

import ukSeatData from "../../../assets/data/uk-election-seats.json";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Treemap from "../../components/treemap";
import Dropdown from "../../components/dropdown";
import { setYears } from "../../state/actions/years";
import { setActiveYear } from "../../state/actions/activeYear";
import { setUkSeats } from "../../state/actions/ukSeats";
import {
  colorList,
  colorLabelList,
  labelList
} from "../../../assets/data/colorData";
import BarChart from "../../components/barchart";
import Legend from "../../components/legend";

import styles from "./styles.css";

class App extends Component {
  constructor() {
    super();
    this.onDropdownSelect = this.onDropdownSelect.bind(this);
    this.onPlayClick = this.onPlayClick.bind(this);
    this.onPauseClick = this.onPauseClick.bind(this);
    this.state = {
      counter: 0,
      isPlaying: false
    };
  }

  componentDidMount() {
    let years = ukSeatData.map(item => item.year);
    years = years.reduce((allYears, next) => {
      if (!allYears.includes(next)) {
        allYears.push(next);
      }
      return allYears;
    }, []);
    this.props.setYears(years);
    this.props.setUkSeats(ukSeatData);
    this.props.setActiveYear(years[0]);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.bardata !== nextState.bardata ||
      nextProps.activeYear !== this.props.activeYear ||
      this.state.counter !== nextState.counter
    );
  }

  onDropdownSelect(e) {
    this.props.setActiveYear(e.target.value);
  }

  onPlayClick(e) {
    e.preventDefault();
    let last = 0; // timestamp of the last step() call
    this.setState({
      isPlaying: true
    });
    const step = now => {
      const counter = this.state.counter + 1;
      // each .75 seconds call setState
      if (!last || now - last >= 2 * 750) {
        last = now;
        const activeYear = this.props.years[counter];
        this.props.setActiveYear(activeYear);
        this.setState({ counter });
      }
      const isEnd = counter < this.props.years.length;
      if (isEnd && this.state.isPlaying) {
        window.requestAnimationFrame(step);
      } else {
        this.setState({ counter: isEnd ? counter : 0, isPlaying: false });
      }
    };
    window.requestAnimationFrame(step);
  }

  onPauseClick() {
    this.setState({ isPlaying: false });
  }

  render() {
    const filteredData = this.props.ukSeats.filter(
      item => item.year === this.props.activeYear
    );
    const totalSeats = filteredData.length > 0 ? filteredData[0].totalSeats : 0;
    const barchartData = filteredData.map(item => Number(item.seats));
    return (
      <div className={styles.app}>
        <Header />
        <div className={styles.controls}>
          <Dropdown
            items={this.props.years}
            label="Year"
            isActive={!this.state.isPlaying}
            selectedItem={this.props.activeYear}
            selectItem={this.onDropdownSelect}
          />
          <button
            className={styles.playButton}
            onClick={
              this.state.isPlaying ? this.onPauseClick : this.onPlayClick
            }
            aria-label="Click to play"
          >
            {!this.state.isPlaying &&
              <span className={styles.buttonContent}>
                Play <svg className={styles.playIcon}>
                  <use xlinkHref="#play" />
                </svg>
              </span>}
            {this.state.isPlaying &&
              <span className={styles.buttonContent}>
                Pause <svg className={styles.pauseIcon}>
                  <use xlinkHref="#pause" />
                </svg>
              </span>}
          </button>

        </div>
        <section className={styles.treemapContainer}>
          <Treemap
            colorList={colorList}
            colorLabelList={colorLabelList}
            labelList={labelList}
            activeYear={this.props.activeYear}
            ukSeats={filteredData}
          />
          <Legend colorList={colorList} labelList={labelList} />
        </section>
        <BarChart
          colorList={colorList}
          labelList={labelList}
          max={Number(totalSeats)}
          data={barchartData}
        />

        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  years: arrayOf(string).isRequired,
  activeYear: string.isRequired,
  ukSeats: arrayOf(
    shape({
      year: string.isRequired,
      party: string.isRequired,
      seats: string.isRequired,
      totalSeats: string.isRequired
    })
  ).isRequired,
  setYears: func.isRequired,
  setActiveYear: func.isRequired,
  setUkSeats: func.isRequired
};

App.defaultProps = {};

function mapStateToProps(state) {
  const { years = [], activeYear, ukSeats = [] } = state;
  return {
    years,
    activeYear,
    ukSeats
  };
}

export default connect(mapStateToProps, {
  setYears,
  setActiveYear,
  setUkSeats
})(App);
