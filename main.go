package main

import (
	"syscall/js"
)

func main() {
	// Get the document object
	document := js.Global().Get("document")

	// Get the body element
	body := document.Get("body")

	// Create an h1 element
	h1 := document.Call("createElement", "h1")
	h1.Set("textContent", "Hello, WebAssembly!")

	// Create a paragraph
	p := document.Call("createElement", "p")
	p.Set("textContent", "This page is being rendered by Go running in your browser via WebAssembly! Nice!")

	// Add elements to the body
	body.Call("appendChild", h1)
	body.Call("appendChild", p)

	// Keep the program running
	select {}
}
