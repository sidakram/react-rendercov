.PHONY: npmrc clean

GITHUB_OWNER ?= sidakram

create-npmrc:
	@echo "Creating .npmrc..."
	@printf '@%s:registry=https://registry.npmjs.org/\n' "$(GITHUB_OWNER)" > .npmrc
	@printf '//registry.npmjs.org/:_authToken=$${NODE_AUTH_TOKEN}\n' >> .npmrc
	@echo ".npmrc created successfully"

clean:
	@rm -f .npmrc
	@echo ".npmrc removed"
