port ?= 8080

setup:
	@bundle

build:
	@bundle exec jekyll build

serve:
	@bundle exec jekyll serve --watch -P $(port)
