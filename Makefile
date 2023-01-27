port ?= 8080

setup:
	@bundle
	@npm i

build:
	@bundle exec jekyll build

serve:
	@bundle exec jekyll serve --watch -P $(port)

deploy:
	@npx wrangler pages publish --project-name beeroclock _site
