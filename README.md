# Joel's Search Engine - Personal Website with Hybrid Search

> "I built my own Google" - A search engine for my resume, blog, and thoughts using Go, WASM, PageRank, and semantic search.

## 🎯 Project Goal

Build a static website with a powerful hybrid search engine that allows people to search my content (resume, projects, blog posts about faith, tech, and life) using both keyword matching and semantic understanding.

**Key Features:**
- 🔍 Hybrid search (keyword + semantic)
- ⚡ Static site (no server needed)
- 🤖 Automated indexing via GitHub Actions
- 🚀 Go WASM frontend
- 📊 Pre-computed embeddings and indexes

---

## 📋 Sprint Breakdown

### **Sprint 1: Foundation & Content** (Week 1)
**Goal:** Create the content structure and write initial blog posts

#### Tasks:
- [ ] Create `content/` directory structure
- [ ] Write 3-5 blog posts about faith (HTML files)
  - Example: "God and Technology"
  - Example: "Purpose in Software Engineering"
  - Example: "Being a Christian Engineer"
- [ ] Write 2-3 blog posts about tech
  - Example: "Building with Go"
  - Example: "Understanding PageRank"
- [ ] Create `about.html` with your bio
- [ ] Create `resume.html` with your experience
- [ ] Create `contact.html` with contact info
- [ ] Add some internal links between related posts (for later PageRank)

#### Deliverable:
✅ 8-10 HTML files with real content in `content/` directory

#### Test:
Open the HTML files in browser and read through them

---

### **Sprint 2: Project Structure & Crawler** (Week 2)
**Goal:** Set up Go project and build a crawler to read all HTML files

#### Tasks:
- [ ] Initialize Go module: `go mod init github.com/yourusername/joelkariyalil-website`
- [ ] Create directory structure:
  ```
  cmd/indexer/main.go
  pkg/crawler/crawler.go
  pkg/models/types.go
  ```
- [ ] Build HTML crawler that:
  - Walks `content/` directory
  - Finds all `.html` files
  - Parses HTML using `golang.org/x/net/html` or `github.com/PuerkitoBio/goquery`
  - Extracts: title, body text, links
  - Returns list of `Page` structs
- [ ] Add CLI flag: `go run cmd/indexer/main.go crawl`
- [ ] Print statistics: "Found X pages, Y total words"

#### Deliverable:
✅ Working crawler that reads and parses all HTML files

#### Test:
```bash
go run cmd/indexer/main.go crawl
# Should output: "Found 10 pages, 8,453 words"
```

---

### **Sprint 3: Keyword Indexer (Inverted Index)** (Week 3)
**Goal:** Build inverted index for keyword search (word → pages mapping)

#### Tasks:
- [ ] Create `pkg/indexer/inverted.go`
- [ ] Implement tokenization (split text into words)
- [ ] Remove stop words ("the", "a", "is", "and", etc.)
- [ ] Build inverted index: `map[string][]PageMatch`
- [ ] Count word frequency per page
- [ ] Calculate TF-IDF scores (see implementation below)
- [ ] Save to `data/generated/index.json`
- [ ] Add CLI: `go run cmd/indexer/main.go build-keyword-index`

#### Implementation Notes:
```go
// TF-IDF = Term Frequency × Inverse Document Frequency
// TF = (word count in document) / (total words in document)
// IDF = log(total documents / documents containing word)
```

#### Deliverable:
✅ `data/generated/index.json` file with keyword index

#### Test:
Look inside `index.json` and verify words map to correct pages

---

### **Sprint 4: Keyword Search Engine** (Week 4)
**Goal:** Implement search using the keyword index

#### Tasks:
- [ ] Create `pkg/search/keyword.go`
- [ ] Implement keyword search function:
  - Parse query into tokens
  - Look up each token in inverted index
  - Calculate relevance score for each page
  - Sort by score
  - Return top 10 results
- [ ] Create `cmd/search/main.go` CLI tool
- [ ] Add command: `go run cmd/search/main.go "golang projects"`
- [ ] Pretty-print results with scores

#### Deliverable:
✅ Working keyword search from command line

#### Test:
```bash
go run cmd/search/main.go "GOD faith"
# Should return your faith-related blog posts
```

---

### **Sprint 5: Semantic Embeddings** (Week 5)
**Goal:** Generate semantic embeddings for all content

#### Tasks:
- [ ] Research embedding options:
  - Option A: Use pre-trained model locally (sentence-transformers)
  - Option B: Use OpenAI API (costs money but easy)
  - Option C: Use Ollama locally (free, good quality)
- [ ] Create `pkg/semantic/embeddings.go`
- [ ] For each page, generate 384-dimensional embedding vector
- [ ] Save to `data/generated/vectors.json`
- [ ] Add CLI: `go run cmd/indexer/main.go generate-embeddings`

#### Implementation Options:

**Option A: Using Ollama (Recommended - Free & Local)**
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull embedding model
ollama pull nomic-embed-text

# Use in Go via HTTP API
```

**Option B: Sentence Transformers (Python integration)**
```python
# Call from Go using exec.Command()
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(texts)
```

#### Deliverable:
✅ `data/generated/vectors.json` with embeddings for all pages

#### Test:
Check file size (should be ~500KB for 10 pages with 384 dimensions)

---

### **Sprint 6: Semantic Search** (Week 6)
**Goal:** Implement semantic search using embeddings

#### Tasks:
- [ ] Create `pkg/semantic/similarity.go`
- [ ] Implement cosine similarity function
- [ ] Create `pkg/search/semantic.go`
- [ ] Implement semantic search:
  - Convert query to embedding
  - Calculate similarity with all page embeddings
  - Sort by similarity score
  - Return top results
- [ ] Add to CLI: `go run cmd/search/main.go --semantic "what does Joel think about GOD"`

#### Deliverable:
✅ Working semantic search that finds related content

#### Test:
```bash
# Should find posts about faith, Christianity, even without word "GOD"
go run cmd/search/main.go --semantic "purpose in life"
```

---

### **Sprint 7: Hybrid Search** (Week 7)
**Goal:** Combine keyword + semantic search for best results

#### Tasks:
- [ ] Create `pkg/search/hybrid.go`
- [ ] Implement hybrid search:
  - Run both keyword and semantic search
  - Normalize scores to 0-1 range
  - Combine: `score = 0.4×keyword + 0.6×semantic`
  - Boost pages found by both methods
  - Sort by final score
- [ ] Add metadata extraction (title, excerpt, date)
- [ ] Save to `data/generated/metadata.json`
- [ ] Update CLI to use hybrid search by default

#### Deliverable:
✅ Best-of-both-worlds hybrid search

#### Test:
Compare results of keyword-only, semantic-only, and hybrid for same query

---

### **Sprint 8: Basic WASM Frontend** (Week 8)
**Goal:** Move search to browser using Go WASM

#### Tasks:
- [ ] Move `main.go` to `cmd/wasm/main.go`
- [ ] Use `syscall/js` to manipulate DOM
- [ ] Create search box in Go
- [ ] Load pre-computed JSON files (fetch API)
- [ ] Implement search on button click
- [ ] Display results as list
- [ ] Compile: `GOOS=js GOARCH=wasm go build -o public/main.wasm cmd/wasm/main.go`
- [ ] Update `index.html` to load WASM

#### Deliverable:
✅ Working search in browser!

#### Test:
Open `index.html`, type query, see results

---

### **Sprint 9: Polish WASM UI** (Week 9)
**Goal:** Make the UI beautiful and functional

#### Tasks:
- [ ] Add search-as-you-type (with debouncing)
- [ ] Display loading indicator
- [ ] Show search statistics ("Found 5 results in 0.12s")
- [ ] Display page metadata (title, excerpt, date)
- [ ] Highlight matching keywords in results
- [ ] Show both keyword and semantic scores
- [ ] Add "no results" message
- [ ] Make mobile responsive
- [ ] Add keyboard shortcuts (Enter to search)

#### Deliverable:
✅ Beautiful, polished search interface

#### Test:
Use on different devices and browsers

---

### **Sprint 10: Autocomplete/Suggestions** (Week 10)
**Goal:** Add search suggestions as user types

#### Tasks:
- [ ] Create `pkg/trie/trie.go`
- [ ] Extract common phrases from content:
  - Page titles
  - Headings (h1, h2, h3)
  - First sentences
- [ ] Build trie or simple prefix map
- [ ] Save to `data/generated/suggestions.json`
- [ ] Load in WASM
- [ ] Show dropdown as user types
- [ ] Click suggestion to search

#### Deliverable:
✅ Google-style autocomplete

#### Test:
Type "what" and see suggestions appear

---

### **Sprint 11: GitHub Actions CI/CD** (Week 11)
**Goal:** Automate everything!

#### Tasks:
- [ ] Create `.github/workflows/build-index.yml`
- [ ] Configure workflow to:
  - Run on schedule (every 6 hours)
  - Run on push to `content/`
  - Install Go
  - Run indexer (keyword + embeddings)
  - Compile WASM
  - Commit generated files
  - Deploy to GitHub Pages
- [ ] Test workflow runs successfully
- [ ] Set up GitHub Pages in repo settings

#### Deliverable:
✅ Fully automated build and deployment

#### Test:
Push a new blog post, watch Actions run, see it deployed

---

### **Sprint 12: Optional - PageRank** (Week 12)
**Goal:** Add PageRank algorithm for link-based ranking

#### Tasks:
- [ ] Create `pkg/graph/graph.go`
- [ ] Extract internal links from HTML
- [ ] Build adjacency matrix
- [ ] Implement PageRank algorithm (20 iterations)
- [ ] Save to `data/generated/pagerank.json`
- [ ] Display PageRank scores in results
- [ ] Optionally use in final ranking

#### Deliverable:
✅ PageRank scores for all pages

#### Test:
See which pages have highest PageRank (most linked to)

---

### **Sprint 13: Deployment & Polish** (Week 13)
**Goal:** Deploy to production and finalize

#### Tasks:
- [ ] Choose hosting:
  - GitHub Pages (free, easy)
  - Vercel (free, faster)
  - Cloudflare Pages (free, fast)
- [ ] Set up custom domain (optional)
- [ ] Add analytics (Plausible/Simple Analytics)
- [ ] Test on multiple devices
- [ ] Share with friends for feedback
- [ ] Write blog post about building it
- [ ] Add to resume!

#### Deliverable:
✅ Live website at your domain

#### Test:
Search works from public URL

---

## 🎯 MVP (Minimum Viable Product)

If you want to move faster, focus on these sprints only:

**4-Week MVP:**
1. Sprint 1: Content
2. Sprint 2: Crawler
3. Sprint 3: Keyword Index
4. Sprint 4: Keyword Search (CLI)

**Result:** Working keyword search from command line

**8-Week Full MVP:**
Add these:
5. Sprint 5: Embeddings
6. Sprint 6: Semantic Search
7. Sprint 7: Hybrid Search
8. Sprint 8: Basic WASM UI

**Result:** Working hybrid search in browser

---

## 📁 Final Project Structure

```
joelkariyalil-website/
├── .github/
│   └── workflows/
│       └── build-index.yml          # Automated builds
│
├── cmd/
│   ├── indexer/
│   │   └── main.go                  # Build indexes
│   ├── search/
│   │   └── main.go                  # CLI search tool
│   └── wasm/
│       └── main.go                  # Browser frontend
│
├── pkg/
│   ├── crawler/
│   │   └── crawler.go               # Parse HTML
│   ├── indexer/
│   │   ├── inverted.go              # Keyword index
│   │   └── tfidf.go                 # TF-IDF scoring
│   ├── semantic/
│   │   ├── embeddings.go            # Generate embeddings
│   │   └── similarity.go            # Cosine similarity
│   ├── search/
│   │   ├── keyword.go               # Keyword search
│   │   ├── semantic.go              # Semantic search
│   │   └── hybrid.go                # Combined search
│   ├── graph/
│   │   └── graph.go                 # PageRank (optional)
│   ├── trie/
│   │   └── trie.go                  # Autocomplete
│   └── models/
│       └── types.go                 # Shared types
│
├── content/
│   ├── about.html
│   ├── resume.html
│   ├── contact.html
│   └── blog/
│       ├── faith/
│       │   ├── god-and-technology.html
│       │   ├── purpose-in-code.html
│       │   └── christian-engineer.html
│       └── tech/
│           ├── golang-intro.html
│           └── building-search-engines.html
│
├── data/
│   └── generated/                   # Auto-generated by indexer
│       ├── index.json               # Keyword index (~200KB)
│       ├── vectors.json             # Embeddings (~500KB)
│       ├── metadata.json            # Page info (~50KB)
│       ├── suggestions.json         # Autocomplete (~20KB)
│       └── pagerank.json            # PageRank scores (~5KB)
│
├── public/                          # Static site files
│   ├── index.html                   # Entry point
│   ├── main.wasm                    # Compiled Go WASM (~2MB)
│   └── wasm_exec.js                 # Go WASM runtime (~15KB)
│
├── go.mod
├── go.sum
├── Makefile                         # Build commands
└── README.md                        # This file!
```

---

## 🛠️ Useful Commands

```bash
# Crawl content
go run cmd/indexer/main.go crawl

# Build keyword index
go run cmd/indexer/main.go build-keyword-index

# Generate embeddings
go run cmd/indexer/main.go generate-embeddings

# Build all indexes
go run cmd/indexer/main.go build-all

# Search from CLI
go run cmd/search/main.go "golang projects"
go run cmd/search/main.go --semantic "faith and technology"

# Build WASM
GOOS=js GOARCH=wasm go build -o public/main.wasm cmd/wasm/main.go

# Serve locally
goexec 'http.ListenAndServe(`:8080`, http.FileServer(http.Dir(`public`)))'
# Or: python3 -m http.server 8080 -d public
```

---

## 🧪 Testing Each Sprint

Each sprint should have clear success criteria:

- **Sprint 1:** Can open HTML files in browser
- **Sprint 2:** CLI shows "Found X pages"
- **Sprint 3:** `index.json` file exists and looks correct
- **Sprint 4:** Can search from terminal and get results
- **Sprint 5:** `vectors.json` file exists (~500KB)
- **Sprint 6:** Semantic search finds related content
- **Sprint 7:** Hybrid search combines both scores
- **Sprint 8:** Search works in browser
- **Sprint 9:** UI looks good and is responsive
- **Sprint 10:** Autocomplete appears as you type
- **Sprint 11:** GitHub Actions runs successfully
- **Sprint 12:** PageRank scores calculated
- **Sprint 13:** Live at public URL

---

## 📊 Tech Stack

**Backend/Indexer:**
- Go 1.21+
- HTML Parser: `github.com/PuerkitoBio/goquery`
- Embeddings: Ollama (nomic-embed-text) or OpenAI API

**Frontend:**
- Go WASM (syscall/js)
- Pure HTML/JavaScript (no CSS frameworks)
- Static JSON files

**CI/CD:**
- GitHub Actions
- GitHub Pages / Vercel / Cloudflare Pages

**Algorithms:**
- TF-IDF (keyword relevance)
- Cosine Similarity (semantic matching)
- PageRank (optional - link importance)
- Trie (autocomplete)

---

## 🎓 Learning Outcomes

By the end of this project, you'll have:
- ✅ Built a search engine from scratch
- ✅ Implemented Google's PageRank algorithm
- ✅ Used semantic embeddings for AI-powered search
- ✅ Built with Go and WebAssembly
- ✅ Set up CI/CD with GitHub Actions
- ✅ Deployed a static site
- ✅ An impressive portfolio project!

---

## 📝 Resume Bullet Point

> "Built a hybrid search engine for personal website using Go, WebAssembly, and semantic embeddings. Implemented TF-IDF keyword indexing, cosine similarity for semantic search, and automated CI/CD pipeline via GitHub Actions. Deployed as static site with sub-100ms search response times."

---

## 🚀 Getting Started

1. **Fork/clone this repo**
2. **Start with Sprint 1** - Write your content!
3. **Work through sprints one at a time**
4. **Test after each sprint**
5. **Share your progress!**

Good luck! 💪

---

## 📚 Resources

**Go WASM:**
- https://github.com/golang/go/wiki/WebAssembly

**TF-IDF:**
- https://en.wikipedia.org/wiki/Tf%E2%80%93idf

**Semantic Embeddings:**
- https://ollama.com/ (local embeddings)
- https://www.sbert.net/ (sentence transformers)

**PageRank:**
- http://ilpubs.stanford.edu:8090/422/1/1999-66.pdf (original paper)

**Go HTML Parsing:**
- https://github.com/PuerkitoBio/goquery

---

## 💬 Questions?

Open an issue or reach out!

**Now go build something amazing!** 🔥
