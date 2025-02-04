import axios from 'axios';

const localInitData =
  'query_id=AAGxyxcjAAAAALHLFyPuzGwx&user=%7B%22id%22%3A588762033%2C%22first_name%22%3A%22Nomad3v.eth%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22nomad3v%22%2C%22language_code%22%3A%22es%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1721029591&hash=f932d7cfed2ea2239650d89716c9aaee7c1cedefcf24d925ba844973ca3cf8bd';

const INIT_DATA =
  process.env.NODE_ENV !== 'production'
    ? localInitData
    : typeof window !== 'undefined' && window.Telegram.WebApp.initData;

export const axiosDefault = axios.create();
axiosDefault.defaults.headers.common['hash'] = `${INIT_DATA}`;
