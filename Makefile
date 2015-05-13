app_dir = client/app
script_dir = $(app_dir)/scripts
script_src = $(wildcard $(script_dir)/*.js) $(wildcard $(script_dir)/*.es6)
script_main = $(script_dir)/app.es6
script_out = $(script_dir)/dist.js
script_out_min = $(script_dir)/dist.min.js
script_out_min_map = $(script_dir)/dist.min.map.json

scss_dir = $(app_dir)/stylesheets
scss_src = $(scss_dir)/main.scss
scss_out = $(scss_dir)/main.css

all : $(script_out) $(script_out_min) $(scss_out)
dist : $(script_out) $(scss_out)

$(script_out) : $(script_src)
	browserify -t babelify $(script_main) > $(script_out)

$(script_out_min) : $(script_out)
	browserify $(script_out) -d -p [minifyify --map $(script_out_min_map) --output $(script_out_min_map)] > $(script_out_min)

$(scss_out) : $(scss_src)
	scss $(scss_src) > $(scss_out)

clean :
	rm $(script_out) $(script_out_min) $(script_out_min_map) || true