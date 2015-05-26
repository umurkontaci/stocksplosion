# StockSplosion Assist
This project aims to analysts to make their buy/sell decisions easier. Simply visit the website, type the company name or symbol you are interested, see the recent prices and the suggested action for that stock.

# Setting Up
## Usage
This project is ready to use for end users. Fire up a web server in `client/dist` directory and visit the URL. If you don't have a web server set up, you can use Python's `SimpleHTTPServer` module. Go to the `client/dist` directory and type `python -m SimpleHTTPServer` and visit http://localhost:8000

## Development

### Web
1. Install `node` and `npm`
2. Install global npm packages (`npm install -g gulp bower `)
3. Run `npm install`
4. Run `bower install`
5. Run `gulp`

This will update the files in `client/dist` directory. For continuous development, use `gulp watch` and it will rebuild every time a source file is changed.

### Proxy
During the development of the project, the stock API wasn't sending appropriate CORS headers to make cross-origin requests. This has since been fixed but if the problem occurs again, you can use the proxy server as a workaround. 

To set up, head over to `proxy` directory and type the following commands,
- `npm install`
- `PORT=8888 node index.js`

Then modify `client/app/scripts/app.jsx` like this.
    repo.configure({
      //rootUrl: 'http://localhost:8888' // replace the 8888 with the port you chose
    });

Rebuild the app and you can now use the proxy.

## Machine Learning Source

Under `ml` directory, there are source files that have been used for creating a model for the dataset. To investigate them, make sure you have installed `pip` and `virtualenv`, then head over to `ml` directory and type the following commands:

- `virtualenv env --no-site-packages`
- `source env/bin/activate`
- `pip install -r requirements.txt`

This is will set the environment up for machine learning, you can type `ipython notebook` to investigate `Prediction.pynb` file.


