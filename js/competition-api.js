export const fetchCompetitions = async () => {
  const response = await fetch('data/generated/competitions.json');
  return response.json();
};
