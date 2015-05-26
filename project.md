# Project

## Cost
- Web Client Development: $1500
- Price Estimation Research: $6750

# Analysis
## Final Model
The dataset reacts in a specific way. Starting from Unix Epoch (1970-01-01), the price of any stock increases by 1.0 (+/- ~10% of the current price). There are no seasonalities or any other anomalies in the dataset. ~10% variation also appear to be random.

Since there are no seasonalities and the trend is always upwards linearly, the dataset fits perfectly for a mean-reversion model, that is the price will revert to it's rolling mean over time. In real datasets, mean reversion may take a long time, thus it might not be attractive to investors, however in our dataset, the price fluctuates around its mean all the time. Thus, we can calculate the trading range and the moving average price at any given time with very high accuracies using recent historical data.

Therefore, we can use these values to make suggestions. If the current price is significantly higher than mean of last 30 days, it will fall in the following days, thus we suggest to *SELL*. If it is significantly lower than mean, it will rise soon, thus we suggest to *BUY*. However, if the price is close to mean, we suggest to *WAIT*.

The final model is a very simple one, but during the research of the model, the dataset has been treated as if it's real.

### Future work


## Research
Regardless of whether the data was simulated or not, it has been treated as if it is real.

### Data Preparion
#### Dataset Details 
The dataset covers the dates between 2010-01-01 and 2015-05-15 inclusive.
The dataset has been downloaded from the API using 10-day range per request. Although API allows 30-day range, any errors in API would make us lose 30-day data, thus 10-day is a meaningful range, it is fast enough to download and 10-day loss in 5.5 years of data is negligible and not likely affect the outcome.

#### Features Extracted
Total market value (sum of all prices for any given day) has been added to dataset.

The following values are added for each company (and total market value):

1. Rolling Mean - 3-day, 7-day, 15-day, 30-day
2. Rolling Sum - 3-day, 7-day, 15-day, 30-day
3. Rolling Standard Deviation - 3-day, 7-day, 15-day, 30-day
4. Rolling Min - 3-day, 7-day, 15-day, 30-day
5. Rolling Max - 3-day, 7-day, 15-day, 30-day
6. Rolling Variance - 3-day, 7-day, 15-day, 30-day
7. EWMA - 3-day, 7-day, 15-day, 30-day
8. Lagged Price - 1-day, 2-day ... 15-day
9. Price Change - 1-day, 2-day .... 15-day
10. Percent Change  - 3-day, 7-day, 15-day, 30-day
11. Lagged Price Change Direction - 1-day

#### Train/Test Split
The dataset is split into two from the middle, this is because it's a time-series dataset and we haven't seen any seasonalities.

### Cluster Analysis
During cluster analysis, no meaningful clusters have been formed. Further research might be useful.

### Regression

#### Feature Selection
Using `SelectKBest`, `SelectPercentile` and `VarianceThreshold` with different values as a first filter in feature selection rendered the most important features are extracted features for that company and extracted features for the total market value. Thus, we can induce there is no correlation on how companies act together.

As a second filter to reduce feature number for a more generalized model, `RFECV` is used. RFECV, recursive feature elimination with cross-validation, removes `n` features in each loop and decides the optimum number of features using cross-validation. For this dataset, `n` was set to 1.

#### Price Direction Estimation
For price direction estimation `LogisticRegression` model is used. 

The model was able to predict with a score of `.724`.

The predicted directions were added to dataset for price estimation.

The features selected by `RFECV` are as follows:
- Company Lag 1-day
- Company EWMA 7-day
- Company Rolling Sum 15-day
- Company Rolling Mean 15-day

#### Price Estimation
For price estimation, `LinearRegression`, `Ridge`, `RidgeCV` models are trained. Although the scores of models were pretty close, `Ridge` model with alpha `10` yielded more generalized results than the rest.

The model was able to predict with a score of `.528` and a mean of sum of square errors of `154635` where the original dataset has a standard deviation of `572.6`.

The features that yielded these results are as follows:
- Company Percent Change 7-day
- Company EWMA 7-day
- Company EWMA 30-day
- Total Percent Change 7-day
- Total Rolling Sum 15-day
- Total Rolling Variance 15-day
- Total Percent Change 30-day
- Total Rolling Sum 30-day
- Total Lag 26

