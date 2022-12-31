// COLLECTOR (required for): news-gallery
const demo = typeof debug !== 'undefined';
const demoList = typeof test !== 'undefined' ? test : '';
const demoItem = typeof testItem !== 'undefined' ? testItem : '';
const demoRegio = typeof regio !== 'undefined' ? regio : '';
const months = JSON.parse(
  `{"Jan": 0,"Feb": 1,"Mär": 2,"Apr": 3,"Mai": 4,"Jun": 5,"Jul": 6,"Aug": 7,"Sep": 8,"Okt": 9,"Nov": 10,"Dez": 11 }`
);
const revMonths = Object.entries(months).reduce((st, [k, v]) => {
  st[v] = k;
  return st;
}, {});
const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

let dataNews = [];
let dataNewsLoading = false;
const dataNewsCBs = [];
const addNewsCB = (cb) => dataNewsCBs.push(cb);
const setNews = (cb) => {
  dataNews = cb(dataNews);
  dataNewsCBs.forEach((_) => _(dataNews, dataNewsLoading));
};

const loadNewsItem = (link) =>
  (!!demo
    ? Promise.resolve(demoItem).then(
        (_) => new Promise((resolve) => setTimeout(() => resolve(_), 500))
      )
    : fetch(`${link}`).then((_) => _.text())
  ).then((_) => {
    const temp = document.createElement('div');
    temp.innerHTML = _.split('<article class="brick_blog list cell">')[1].split(
      '</article>'
    )[0];
    const [from, to] = temp
      .querySelector('div.h6')
      .innerText.split(',')[0]
      .split('-')
      .map((_) => _.trim().split('.').reverse());
    return {
      from: new Date(from),
      to: !to ? undefined : new Date(to),
      details: temp.querySelector('div.copy').innerText.trim(),
      docs: {
        Ausschreibung: Array.from(temp.querySelectorAll('a'))
          .filter((el) => el.textContent.includes('Ausschreibung'))
          .map((_) => _.href)[0],
        Anmeldung: Array.from(temp.querySelectorAll('a'))
          .filter((el) => el.textContent.includes('Anmeldung'))
          .map((_) => _.href)[0],
        Wegbeschreibung: Array.from(temp.querySelectorAll('a'))
          .filter((el) => el.textContent.includes('Wegbeschreibung'))
          .map((_) => _.href)[0],
        Siegerliste: Array.from(temp.querySelectorAll('a'))
          .filter((el) => el.textContent.includes('Siegerliste'))
          .map((_) => _.href)[0],
      },
    };
  });

const loadNewsList = (page) =>
  (!!demo
    ? Promise.resolve(demoList).then(
        (_) => new Promise((resolve) => setTimeout(() => resolve(_), 500))
      )
    : fetch(
        `${window.location.origin}/events?page=${page}&regio=${demoRegio}`
      ).then((_) => _.text())
  ).then((_) => {
    const temp = document.createElement('div');
    temp.innerHTML = _.split(
      '<article class="brick_event list cell">'
    )[1].split('</article>')[0];
    return [...temp.querySelectorAll('[class="cell"]')]
      .map((_) => ({
        place: (_.querySelector('div.place') || { innerText: '' }).innerText,
        category: (_.querySelector('div.category') || { innerText: '' })
          .innerText,
        title: (_.querySelector('h2.h4') || { innerText: '' }).innerText.trim(),
        img: (_.querySelector('img') || { src: '' }).src.trim(),
        link: (_.querySelector('a') || { href: '' }).href.trim(),
      }))
      .filter((_) => !!_.title);
  });

const loadNewsChunk = (page) =>
  loadNewsList(page).then((next) => {
    setNews((prev) => [...prev, ...next]);
    return next.length && (!demo || page < 5)
      ? loadNewsChunk(page + 1).then((_) => [...next, ..._])
      : next;
  });

Promise.resolve()
  .then(() => {
    dataNewsLoading = true;
  })
  .then(() => loadNewsChunk(1))
  .then(() =>
    Promise.all(
      dataNews.map((_) =>
        loadNewsItem(_.link)
          .then((item) => ({ ..._, ...item }))
          .then((_) => {
            setNews((prev) => {
              prev.splice(
                prev.findIndex((__) => __.title === _.title),
                1,
                _
              );
              return prev;
            });
            return _;
          })
      )
    )
  )
  .then(() => {
    dataNewsLoading = false;
  })
  .then(() => setNews((_) => _));

addNewsCB((news) => {
  if (demo && document.querySelector('.debug')) {
    console.log(news);
    document.querySelector('.debug').value = JSON.stringify(news);
  }
});
