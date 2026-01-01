package main

import (
	"joelkariyalil-website/pkg/portfolio"
)

func main() {
	// Get portfolio data
	p := portfolio.GetPortfolio()

	// Render to DOM
	portfolio.Render(p)

	// Keep the program running
	select {}
}

