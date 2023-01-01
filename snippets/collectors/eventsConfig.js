const eventsMonths = JSON.parse(
  `{"Jan": 0,"Feb": 1,"Mär": 2,"Apr": 3,"Mai": 4,"Jun": 5,"Jul": 6,"Aug": 7,"Sep": 8,"Okt": 9,"Nov": 10,"Dez": 11 }`
);
const revMonths = Object.entries(eventsMonths).reduce((st, [k, v]) => {
  st[v] = k;
  return st;
}, {});
const eventsDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
