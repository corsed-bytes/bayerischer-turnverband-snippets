// COLLECTOR (required for): Events-gallery
const demo = typeof debug !== 'undefined';
const demoList = typeof test !== 'undefined' ? test : '';
const demoItem = typeof testItem !== 'undefined' ? testItem : '';
const demoRegio = typeof regio !== 'undefined' ? regio : '';
/*const revMonths = Object.entries(months).reduce((st, [k, v]) => {
  st[v] = k;
  return st;
}, {});*/

let events = {
  data: [],
  loading: false,
  timestamp: new Date(),
  cbs: [],
};
const addEventsCB = (cb) => {
  events.cbs.push(cb);
  cb(events);
};
const setEvents = (cb) => {
  events = cb(events);
  events.cbs.forEach((_) => _(events));
};

const loadEventsItem = (link) =>
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

const loadEventsList = (page) =>
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

const loadEventsChunk = (page) =>
  loadEventsList(page).then((next) => {
    setEvents((_) => ({ ..._, data: [..._.data, ...next] }));
    return next.length && (!demo || page < 5)
      ? loadEventsChunk(page + 1).then((_) => [...next, ..._])
      : next;
  });

Promise.resolve()
  .then(() =>
    setEvents((_) => ({ ..._, data: [], loading: true, timestamp: new Date() }))
  )
  .then(() => loadEventsChunk(1))
  .then(() =>
    Promise.all(
      events.data.map((_) =>
        loadEventsItem(_.link)
          .then((next) =>
            setEvents((prev) => {
              prev.data.splice(
                prev.data.findIndex((__) => __.title === _.title),
                1,
                { ..._, ...next }
              );
              return prev;
            })
          )
      )
    )
  )
  .then(() => setEvents((_) => ({ ..._, loading: false })));

addEventsCB((Events) => {
  if (demo && document.querySelector('.debug')) {
    console.log(Events);
    document.querySelector('.debug').value = JSON.stringify(Events);
  }
});
