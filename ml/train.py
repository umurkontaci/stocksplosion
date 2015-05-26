from sklearn import cross_validation
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.linear_model import LinearRegression
from pandas.tseries.offsets import Day
__author__ = 'umurkontaci'


class Trainer(object):
    def __init__(self, prices_dict):
        self.model = LinearRegression()
        self.df = None
        self.prediction = None
        self.mean_sq_err = 0
        self.std_err = 0
        self.score = 0
        self.coefficients = []
        self._train(prices_dict)

    def _make_df(self, prices_dict):
        dates = [datetime.strptime(x, '%Y%m%d') for x in prices_dict.keys()]
        prices = prices_dict.values()
        df = pd.DataFrame(prices, index=dates, columns=('Price',)).sort_index()

        # df['MovAvg'] = pd.rolling_mean(df['Price'], 15)
        df['MovAvg'] = [np.mean(df['Price'][i - 15:i]) for i in xrange(len(df['Price']))]
        for i in xrange(1, 10):
            df[('Lag_%d' % i)] = df['Price'].shift(i)
        for i in xrange(1, 10):
            df['Shift_%d' % i] = df['Price'].sub(df[('Lag_%d' % i)])

        return df

    def _train(self, prices_dict):
        self.df = self._make_df(prices_dict).dropna()
        X = self.df.drop('Price', axis=1)
        ts = self.df['Price']
        y = ts
        print X
        print y
        X_train, X_test, y_train, y_test = cross_validation.train_test_split(X, y, test_size=.4, random_state=0)

        self.model.fit(X_train, y_train)

        self.prediction = pd.DataFrame({'Actual': y_test, 'Predicted': self.model.predict(X_test)},
                                       index=y_test.index)
        self.prediction['Variance'] = (self.prediction["Actual"] - self.prediction["Predicted"])
        self.prediction['Error'] = self.prediction['Variance'] ** 2
        self.mean_sq_err = np.mean(self.prediction['Error'])
        self.std_err = np.std(self.prediction['Actual'])
        self.score = self.model.score(X_test, y_test)
        self.coefficients = list(self.model.coef_)

    def predict(self, prices_dict):
        if not isinstance(prices_dict, pd.DataFrame):
            df = self._make_df(prices_dict).drop('Price', axis=1)
        else:
            df = prices_dict
        return self.model.predict(df)

    def predict_next(self):
        next_day = self.df.index[-1] + Day()
        last_price = self.df['Price'][-1]
        last_prices = self.df['Price'].tail(15)
        roll_m = np.mean(last_prices)
        diff_prices = []
        for i in xrange(1, len(last_prices)):
            try:
                diff_prices.append(last_price - last_prices[i])
            except IndexError:
                diff_prices.append(np.nan)
        values = [roll_m] + list(diff_prices[::-1][1:10]) + list(last_prices[::-1][1:10])
        # print '%s-%s' % (len(values), len(self.coefficients))
        assert len(values) == len(self.coefficients)
        res = np.sum(np.multiply(values, self.coefficients))
        pred_df = pd.DataFrame([values], index=[next_day], columns=self.df.columns[1:])
        print pred_df
        # res = self.model.predict(pred_df)
        print res
        row = [res] + values
        # row = list(res) + values
        # assert len(row) == len(self.df.columns)
        self.df = self.df.append(pd.Series(row, name=next_day, index=self.df.columns))
        print self.df.iloc[-1]
        return res
