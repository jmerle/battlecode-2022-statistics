import * as Highcharts from 'highcharts';
import { createElement } from '../common';
import { createCard, formatNumber } from './common';

require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/offline-exporting')(Highcharts);

export function buildPerformance(grid: HTMLElement, data: TeamsData): void {
  const row = createElement(grid, 'div');
  row.classList.add('row');

  const column = createElement(row, 'div');
  column.classList.add('col-lg-12');

  const card = createCard(column, 'Team Performance');

  const teams = Object.values(data.teams)
    .filter(team => team.score > -1e6)
    .sort((a, b) => a.name.localeCompare(b.name))
    .sort((a, b) => b.score - a.score);

  const tournaments = [
    ['Sprint 1', '2022-01-11T19:00:00-05:00'],
    ['Sprint 2', '2022-01-18T19:00:00-05:00'],
    ['International Qualifier', '2022-01-23T19:00:00-05:00'],
    ['US Qualifier', '2022-01-25T19:00:00-05:00'],
    ['Newbie & High School', '2022-01-27T19:00:00-05:00'],
    ['Final', '2022-02-05T19:00:00-05:00'],
  ];

  const mobileLegend: Highcharts.LegendOptions = {
    layout: 'horizontal',
    align: 'left',
    verticalAlign: 'bottom',
    width: '100%',
    maxHeight: 100,
    alignColumns: false,
  };

  const desktopLegend: Highcharts.LegendOptions = {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'top',
    width: 250,
    maxHeight: 1e6,
    alignColumns: false,
  };

  Highcharts.chart(createElement(card, 'div'), <Highcharts.Options>{
    chart: {
      type: 'line',
      zoomType: 'x',
      panning: {
        enabled: true,
        type: 'x',
      },
      panKey: 'shift',
      numberFormatter: formatNumber,
    },
    time: {
      useUTC: false,
    },
    title: null,
    credits: {
      href: 'javascript:window.open("https://www.highcharts.com/?credits", "_blank")',
    },
    exporting: {
      sourceWidth: 1600,
      sourceHeight: 800,
      filename: 'team-performance',
      allowHTML: true,
      chartOptions: {
        title: {
          text: 'Team Performance',
        },
      },
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Local Date & Time',
      },
      crosshair: {
        width: 1,
      },
      plotLines: tournaments.map(tournament => ({
        color: '#ccd6eb',
        zIndex: 1000,
        value: Date.parse(tournament[1]),
        label: {
          text: tournament[0],
          useHTML: true,
          x: 12,
          y: 1,
          rotation: 270,
          verticalAlign: 'bottom',
          style: <any>{
            background: 'rgba(255, 255, 255, 0.5)',
            color: '#000000',
            padding: '3px',
            border: '1px solid #ccd6eb',
            borderTop: '0',
          },
        },
      })),
    },
    yAxis: {
      title: {
        text: 'Mu',
      },
      allowDecimals: false,
    },
    tooltip: {
      split: true,
      valueDecimals: 0,
    },
    legend: window.innerWidth < 992 ? mobileLegend : desktopLegend,
    responsive: {
      rules: [
        {
          condition: {
            callback: () => window.innerWidth < 992,
          },
          chartOptions: {
            legend: mobileLegend,
          },
        },
        {
          condition: {
            callback: () => window.innerWidth >= 992,
          },
          chartOptions: {
            legend: desktopLegend,
          },
        },
      ],
    },
    series: teams.map((team, teamIndex) => {
      const values: [number, number][] = [];

      if (team.history.length > 0) {
        let historyIndex = 0;

        const currentDate = new Date(Date.parse(team.history[0].date));
        currentDate.setMilliseconds(0);
        currentDate.setSeconds(0);
        currentDate.setMinutes(0);

        while (currentDate.getTime() < Date.parse(team.history[team.history.length - 1].date)) {
          currentDate.setHours(currentDate.getHours() + 1);

          for (let i = historyIndex + 1; i < team.history.length; i++) {
            if (Date.parse(team.history[i].date) > currentDate.getTime()) {
              break;
            }

            historyIndex++;
          }

          values.push([currentDate.getTime(), team.history[historyIndex].mu]);
        }
      }

      return {
        name: team.name,
        data: values,
        visible: teamIndex < 5,
        marker: {
          enabled: false,
          symbol: 'circle',
        },
      };
    }),
  });
}
