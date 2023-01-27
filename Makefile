port ?= 8080

setup:
	@bundle
	@npm i --no-audit --no-fund

build:
	@bundle exec jekyll build

serve:
	@bundle exec jekyll serve --watch -P $(port)

deploy:
	@npm i --no-audit --no-fund
	@npx wrangler pages publish --project-name beeroclock dist
