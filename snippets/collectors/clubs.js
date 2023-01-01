let clubs = {
  data: [],
  loading: false,
  timestamp: new Date(clubsDate),
  cbs: [],
};
const addClubsCB = (cb) => {
  clubs.cbs.push(cb);
  cb(clubs);
};
const setClubs = (cb) => {
  clubs = cb(clubs);
  clubs.cbs.forEach((_) => _(clubs));
};
setClubs((_) => ({..._, data:
  clubsCSV
    .split('\n')
    .filter((_) => !!_)
    .map((_) => _.split('\t'))
    .map(([number, name]) => ({
      name,
      number,
    }))
  }));
