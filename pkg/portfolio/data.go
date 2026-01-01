package portfolio

// Data structures for portfolio content

type Project struct {
	Title       string
	Description string
	Tech        []string
	Link        string
}

type Experience struct {
	Role        string
	Company     string
	Period      string
	Description string
}

type Portfolio struct {
	Name       string
	Title      string
	Bio        string
	Email      string
	Github     string
	Skills     []string
	Projects   []Project
	Experience []Experience
}

// GetPortfolio returns the portfolio data
func GetPortfolio() Portfolio {
	return Portfolio{
		Name:   "Joel Kariyalil",
		Title:  "Software Engineer",
		Bio:    "Building scalable systems with Go. Interested in distributed systems, search engines, and faith-driven technology.",
		Email:  "joel@example.com",
		Github: "github.com/joelkariyalil",
		Skills: []string{
			"Go",
			"Python",
			"JavaScript",
			"WebAssembly",
			"Distributed Systems",
			"Cloud Architecture",
		},
		Projects: []Project{
			{
				Title:       "Hybrid Search Engine",
				Description: "Built a search engine with semantic and keyword search using Go, WASM, and embeddings",
				Tech:        []string{"Go", "WASM", "PageRank", "TF-IDF"},
				Link:        "#",
			},
			{
				Title:       "Portfolio in WASM",
				Description: "This portfolio! Rendered entirely with Go compiled to WebAssembly",
				Tech:        []string{"Go", "WASM", "syscall/js"},
				Link:        "#",
			},
		},
		Experience: []Experience{
			{
				Role:        "Software Engineer",
				Company:     "Tech Company",
				Period:      "2021 - Present",
				Description: "Building backend services with Go, working on distributed systems",
			},
		},
	}
}

