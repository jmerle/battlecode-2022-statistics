export type MetricValue = [number, string];
export type Metric = (team: Team) => MetricValue;

export function nullMetric(): MetricValue {
  return null;
}

export function createScrimmagesMetric(ranked: boolean, unranked: boolean): Metric {
  return team => {
    let count = 0;

    if (ranked) {
      count += team.history.length;
    }

    if (unranked) {
      count += team.wins + team.losses + team.draws - team.history.length;
    }

    return [count, 'scrimmage' + (count !== 1 ? 's' : '')];
  };
}

export function createStreakMetric(winStreak: boolean): Metric {
  return team => {
    let currentStreak = 0;
    let longestStreak = 0;

    for (const item of team.history) {
      if (item.won === winStreak) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 0;
      }
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    return [longestStreak, 'scrimmage' + (longestStreak !== 1 ? 's' : '')];
  };
}

export function scoreMetric(team: Team): MetricValue {
  return [team.score, 'score'];
}
