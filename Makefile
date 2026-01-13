run-server:
	cd web/web-src/ && python3 -m http.server 8080

render:
	cd builder/cmd/ && GOOS=js GOARCH=wasm go build -o ../../web/web-src/main.wasm


store-artifact:
	cp web/web-src/main.wasm web/artifact/