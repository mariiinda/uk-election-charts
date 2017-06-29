# uk-election-charts

An interactive treemap, visualizing proportions of seats won in each UK election from 1918 to 2017.

Also, a demo to illustrate one of the methods of using [D3](https://github.com/d3/) with [React](https://facebook.github.io/react/). **Fundamentally there are two methods:**

1. D3 calulates the chart layout and draws it to the DOM, D3 is also used to update the chart and pretty much everything else related to the chart. React solely acts as a wrapper that passes a DOM reference to D3 and does not touch the DOM.

2. D3 only calculates the chart layout. React manages drawing of the chart and updating the DOM based on D3's layout.

This repo illustrates the first method, the second method will be shown in a different demo repo coming soon.

[View live site site](https://offbeat-feet.surge.sh/)

## Tasks / scripts

Use [yarn](https://yarnpkg.com/en/) or [npm](https://www.npmjs.com/)

Install:
``yarn install``

Development task:
``yarn start``

Open [http://localhost:3030/](http://localhost:3030/)

Production build task:
``yarn build``
