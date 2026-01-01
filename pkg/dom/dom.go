package dom

import "syscall/js"

// Helper functions for DOM manipulation

var doc js.Value

func init() {
	doc = js.Global().Get("document")
}

// GetDocument returns the document object
func GetDocument() js.Value {
	return doc
}

// GetBody returns the body element
func GetBody() js.Value {
	return doc.Get("body")
}

// CreateElement creates a new HTML element
func CreateElement(tag string) js.Value {
	return doc.Call("createElement", tag)
}

// CreateDiv creates a div element
func CreateDiv() js.Value {
	return CreateElement("div")
}

// CreateH1 creates an h1 element with text
func CreateH1(text string) js.Value {
	h1 := CreateElement("h1")
	h1.Set("textContent", text)
	return h1
}

// CreateH2 creates an h2 element with text
func CreateH2(text string) js.Value {
	h2 := CreateElement("h2")
	h2.Set("textContent", text)
	return h2
}

// CreateH3 creates an h3 element with text
func CreateH3(text string) js.Value {
	h3 := CreateElement("h3")
	h3.Set("textContent", text)
	return h3
}

// CreateH4 creates an h4 element with text
func CreateH4(text string) js.Value {
	h4 := CreateElement("h4")
	h4.Set("textContent", text)
	return h4
}

// CreateP creates a paragraph element with text
func CreateP(text string) js.Value {
	p := CreateElement("p")
	p.Set("textContent", text)
	return p
}

// CreateUL creates an unordered list
func CreateUL() js.Value {
	return CreateElement("ul")
}

// CreateLI creates a list item with text
func CreateLI(text string) js.Value {
	li := CreateElement("li")
	li.Set("textContent", text)
	return li
}

// CreateHR creates a horizontal rule
func CreateHR() js.Value {
	return CreateElement("hr")
}

// AppendChild appends a child element to a parent
func AppendChild(parent, child js.Value) {
	parent.Call("appendChild", child)
}

// ClearBody clears all children from body
func ClearBody() {
	body := GetBody()
	body.Set("innerHTML", "")
}

