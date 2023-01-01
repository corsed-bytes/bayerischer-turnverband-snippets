let newsView = { search: '', data: [], loading: false, timestamp: new Date() };

const convertDate = (date) =>
  new Date(date).toISOString().split('T')[0].split('-').join('');

const download = (from, to, title, details, place) => {
  const temp = document.createElement('a');
  temp.download = title.replaceAll(' ', '_') + '.ics';
  temp.href = window.URL.createObjectURL(
    new File(
      [
        `BEGIN:VCALENDAR
CALSCALE:GREGORIAN
METHOD:PUBLISH
PRODID:-//Test Cal//EN
VERSION:2.0
BEGIN:VEVENT
UID:test-1
DTSTAMP;VALUE=DATE:${convertDate(Date.now())}
DTSTART;VALUE=DATE:${convertDate(from)}
DTEND;VALUE=DATE:${convertDate(to)}
SUMMARY:${title}
DESCRIPTION:${details}
LOCATION:${place}
END:VEVENT
END:VCALENDAR`,
      ],
      { type: 'text/plain' }
    )
  );
  temp.click();
};

const formatterNews = () => {
  const news = newsView.data,
    loading = newsView.loading,
    search = newsView.search;
  const formatterDate = (
    date
  ) => `<div style="display: flex; flex-direction: column; align-items: flex-start; justify-content: space-around">
    <span>${eventsDays[date.getDay()]}</span>
    <span style="font-size: 2.5rem; font-weight: bold;">${(
      '00' + date.getDate()
    ).slice(-2)}</span>
    <span>${revMonths[date.getMonth()]}</span>
  </div>`;

  document.querySelector('#news div.content').innerHTML = !!loading
    ? `Lade weitere Nachrichten (${news.filter((_) => _.from).length} von ${
        news.length
      })`
    : news
        .filter((_) => new Date() < (_.to ? _.to : _.from))
        .filter(
          (_) => !search || JSON.stringify(_).toLowerCase().includes(search)
        )
        .map(
          (_) =>
            `<div style="display: flex; flex-wrap: wrap; background: transparent; border-width: 0; border-bottom: 1px solid lightgray; align-items: stretch; color: black; justify-content: space-between">
          <div style="flex: 0 115px; display: flex; align-items: stretch; margin:0.5rem; ">
            ${formatterDate(_.from)}
            ${
              !!_.to
                ? `<span style="font-size: 2rem; font-weight: bold; padding: 0.5rem; align-self: center">-</span>`
                : ``
            }
            ${!!_.to ? formatterDate(_.to) : ``}
          </div>
          ${
            _.img
              ? `<img style="flex: 0 100px; height: 100px; margin:0.5rem" src="${_.img}" />`
              : `<div style="flex: 0 100px; height: 0; margin:0 0.5rem"></div>`
          }
          <div style="display: flex; flex-direction: column; flex:1 0 250px;margin:0.5rem; ">
            <div style="display: flex;">
              ${_.place ? _.place : 'Kein Ort'}
              ${_.category ? ` | ${_.category}` : ''}
            </div>
            <a href="${_.link}">
              <h2 style="margin: 0; font-size: 1.6rem; text-align: left;">${
                _.title
              }</h2>
            </a>
            <div style="flex: 1"></div>
            <div style="display: flex; flex-wrap: wrap; margin-top: 0.5rem;">
              ${Object.entries(_.docs)
                .filter((_) => _[1])
                .map(
                  ([name, link]) =>
                    `<a style="flex: 0 1; margin-right: 0.2rem" href="${link}">${name}</a>`
                )
                .join(' ')}
              <div style="flex:1"></div>
              <button onclick="javascript:download(
                '${_.from}',
                '${_.to || _.from}',
                '${_.title}',
                '${_.details.replaceAll('\n', '')}',
                '${_.place}');">Download ICS</button>
            </div>
          </div>
        </div>`
        )
        .join('') +
      ['', '', '', '', '']
        .map(
          () =>
            '<div style="flex: 1 0 11%; margin: 0; padding: 0; min-width: 300px"></div>'
        )
        .join('');
};

addEventsCB((events) => {
  newsView = events;
  formatterNews();
});

setTimeout(() => {
  document.querySelector('#news div.control').innerHTML = `<span></span><input
    placeholder="Suche"
    type="text"
    style="display: flex;flex-wrap: wrap;padding: 0.5rem;border: none;border-bottom: 3px solid #1d71b9;outline: none;width: auto;"
  />`;
  document
    .querySelector('#news div.control input')
    .addEventListener('keyup', (e) => {
      newsView.search = e.target.value.toLowerCase();
      formatterNews();
    });
}, 100);
