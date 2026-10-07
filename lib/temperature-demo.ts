// Three fixed teaching candidates; these are not scores from a model.
export function temperatureDistribution(temperature: number): number[] {
  const weights = [0.7, 0.2, 0.1].map((probability) => probability ** (1 / temperature));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return weights.map((weight) => weight / total);
}

export function pickTemperatureCandidate(distribution: number[], roll: number): number {
  let total = 0;
  for (let index = 0; index < distribution.length; index++) {
    total += distribution[index];
    if (roll < total) return index;
  }
  return distribution.length - 1;
}
