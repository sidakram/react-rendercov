.PHONY: npmrc clean

GITHUB_OWNER ?= sidakram

create-npmrc:
	@echo "Creating .npmrc..."
	@printf '@%s:registry=https://npm.pkg.github.com/\n' "$(GITHUB_OWNER)" > .npmrc
	@printf '//npm.pkg.github.com/:_authToken=$${NODE_AUTH_TOKEN}\n' >> .npmrc
	@echo ".npmrc created successfully"

clean:
	@rm -f .npmrc
	@echo ".npmrc removed"
