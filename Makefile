.PHONY: build serve clean setup help

# Build the WASM binary
build:
	GOOS=js GOARCH=wasm go build -o web/main.wasm cmd/wasm/main.go
	@echo "✅ Built web/main.wasm"

# Setup: copy wasm_exec.js to web directory
setup:
	cp "$(shell go env GOROOT)/misc/wasm/wasm_exec.js" web/
	@echo "✅ Copied wasm_exec.js to web/"

# Serve locally
serve:
	@echo "🚀 Starting server at http://localhost:8080"
	@which goexec > /dev/null && goexec 'http.ListenAndServe(`:8080`, http.FileServer(http.Dir(`web`)))' || python3 -m http.server 8080 -d web

# Build and serve
run: build serve

# Clean build artifacts
clean:
	rm -f web/main.wasm
	@echo "✅ Cleaned"

# Help
help:
	@echo "Available commands:"
	@echo "  make setup   - Copy wasm_exec.js to web/ (run once)"
	@echo "  make build   - Build WASM binary"
	@echo "  make serve   - Start local server"
	@echo "  make run     - Build and serve"
	@echo "  make clean   - Remove build artifacts"
