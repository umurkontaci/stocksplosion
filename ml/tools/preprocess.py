import sys
import csv
from datetime import datetime, timedelta

if __name__ == '__main__':
    reader = csv.reader(sys.stdin, delimiter=',', quotechar='|')
    writer = csv.writer(sys.stdout)
    read_head = False
    first_date = None
    for row in reader:
        if read_head:
            if not first_date:
                first_date = datetime.strptime(row[0], '%Y/%m/%d')
            the_date = datetime.strptime(row[0], '%Y/%m/%d')
            day = ((the_date - first_date) + timedelta(days=1)).days
            week_day = the_date.weekday()
            week_year = the_date.strftime('%W')

            total = sum(map(lambda x: float(x), row[1:]))
            missing_count = row[1:].count(0)
            mean = total / (len(row) - 1 - missing_count)
            total += missing_count * mean
            writer.writerow(row + [total, day, week_day, week_year])
        else:
            writer.writerow(row + ['Total', 'Day', 'Weekday', 'WeekYear'])
        read_head = True
