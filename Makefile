##@ Utility

.PHONY: help
help: ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z0-9_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Dependencies

WEB_SERVER_DIR := backend
WEB_UI_DIR := frontend

.PHONY: server
server: ## Compile Backed Web Server
	@cd $(WEB_SERVER_DIR) && mvn compile

.PHONY: ui
ui: ## Build and Start UI
	@cd $(WEB_UI_DIR) && npm install && npm run dev
