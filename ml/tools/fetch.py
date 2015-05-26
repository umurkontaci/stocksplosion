import grequests
import requests
import sys
from collections import defaultdict
from datetime import date, timedelta
import time


class Fetcher():
    def __init__(self, start_date, end_date):
        self.data = None
        self.start_date = start_date
        self.end_date = end_date
        self._ranges = []
        self._companies = []
        self.day_range_per_request = 5
        self._completed_request_count = 0
        self.start_time = None
        print self.start_date
        print self.end_date

    @property
    def total_requests(self):
        return len(self.companies) * len(self.ranges)

    def parse_date_str(self, s):
        return {'year': int(s[:4]), 'month': int(s[4:6]), 'day': int(s[6:])}

    def to_date_str(self, d):
        return d.strftime('%Y%m%d')

    @property
    def ranges(self):
        if not self._ranges:
            sd = date(**self.parse_date_str(self.start_date))
            ed = date(**self.parse_date_str(self.end_date))

            while ed - sd > timedelta(days=self.day_range_per_request):
                self._ranges.append(
                    (self.to_date_str(sd), self.to_date_str(sd + timedelta(days=self.day_range_per_request))))
                sd += timedelta(days=self.day_range_per_request)

            self._ranges.append((self.to_date_str(sd), self.to_date_str(ed)))
        return self._ranges


    def get_url_for_company(self, symbol, sd, ed):
        s = APIDetailURL(symbol, sd, ed).get_url()
        return s

    def _get_company_symbols(self):
        res = requests.get('http://stocksplosion.apsis.io/api/company')
        if res.status_code == 200:
            data = res.json()
            return map(lambda x: x['symbol'], data)

    @property
    def companies(self):
        if not self._companies:
            self._companies = self._get_company_symbols()
        return self._companies

    def get_all_prices(self, sd, ed):
        urls = (self.get_url_for_company(s, sd, ed) for s in self.companies)
        reqs = []
        for company in self.companies:
            url = self.get_url_for_company(company, sd, ed)
            req = grequests.get(url)
            req._extra_data = {
                'company': company,
                'sd': sd,
                'ed': ed
            }
            reqs.append(req)
        return self.parse_company_requests(grequests.map(reqs))

    def parse_company_requests(self, responses):
        result = []
        self._completed_request_count += len(responses)
        now = int(time.time())
        passed = now - self.start_time
        remaining = passed * self.total_requests / self._completed_request_count
        sys.stderr.write('Progress (%d/%d) Passed: %s  Remaining: %s\r' %
                         (self._completed_request_count, self.total_requests, timedelta(seconds=passed),
                          timedelta(seconds=remaining)))
        for i, res in enumerate(responses):
            try:
                if res.status_code == 200:
                    price = res.json()['prices']
                    result.append({'company': self.companies[i], 'prices': price})
                elif res.status_code == 500:
                    print >> sys.stderr, '%s - %s' % (res.status_code, res.url)

            except Exception as e:
                print >> sys.stderr, '%s %s' % (e, res)

        return result

    def get_dates(self, start_date, end_date):
        res = requests.get(
            'http://stocksplosion.apsis.io/api/company/{symbol}?startdate={start_date}&enddate={end_date}' \
            .format(symbol=self.companies[0], start_date=start_date, end_date=end_date))
        if res.status_code == 200:
            data = res.json()
            return sorted(data['prices'].keys(), key=self.parse_date_str)

    def get_price_data(self):
        self.start_time = int(time.time())
        price_data = {
            'prices': defaultdict(dict),
            'dates': []
        }
        for r in self.ranges:
            price_data['dates'] += self.get_dates(r[0], r[1])
            prices = self.get_all_prices(r[0], r[1])
            for pd in prices:
                p = pd['prices']
                com = pd['company']
                price_data['prices'][com] = dict(price_data['prices'][com].items() + p.items())

        return price_data


class APIDetailURL(object):
    def __init__(self, symbol, start, end):
        self.symbol = symbol
        self.start = start
        self.end = end

    def get_url(self):
        return 'http://stocksplosion.apsis.io/api/company/{symbol}?startdate={start_date}&enddate={end_date}' \
            .format(symbol=self.symbol, start_date=self.start, end_date=self.end)

    def __unicode__(self):
        return self.get_url()


def main():
    start_date = sys.argv[1]
    end_date = sys.argv[2]
    fetcher = Fetcher(start_date, end_date)
    price_data = fetcher.get_price_data()

    head = ['date']
    head += fetcher.companies
    sys.stdout.write(','.join(head))
    sys.stdout.write('\n')
    for d in price_data['dates']:
        s = ['%s/%s/%s' % (d[:4], d[4:6], d[6:])]
        for company in fetcher.companies:
            try:
                s.append(price_data['prices'][company][d])
            except KeyError:
                s.append(0)
        sys.stdout.write(','.join(map(lambda x: unicode(x), s)))
        sys.stdout.write('\n')


if __name__ == '__main__':
    main()
