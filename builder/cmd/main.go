package main

import (
	"fmt"
	"syscall/js"
	"time"
)

type Universe struct {
	width    int
	height   int
	cells    []uint8
	canvas   js.Value
	ctx      js.Value
	cellSize int
}

func NewUniverse(width, height, cellSize int) *Universe {
	cells := make([]uint8, width*height)

	// Create canvas
	doc := js.Global().Get("document")
	canvas := doc.Call("createElement", "canvas")
	canvas.Set("width", width*cellSize)
	canvas.Set("height", height*cellSize)
	canvas.Set("style", "border: 2px solid #333; margin: 20px;")

	// Get 2D context
	ctx := canvas.Call("getContext", "2d")

	// Add to page
	body := doc.Get("body")
	body.Call("appendChild", canvas)

	// Initialize with random pattern
	for i := range cells {
		if i%3 == 0 {
			cells[i] = 1
		}
	}

	fmt.Printf("✨ Created Universe: %dx%d on screen\n", width, height)

	return &Universe{
		width:    width,
		height:   height,
		cells:    cells,
		canvas:   canvas,
		ctx:      ctx,
		cellSize: cellSize,
	}
}

func (u *Universe) GetIndex(row, col int) int {
	return row*u.width + col
}

func (u *Universe) LiveNeighborCount(row, col int) int {
	count := 0
	for dr := -1; dr <= 1; dr++ {
		for dc := -1; dc <= 1; dc++ {
			if dr == 0 && dc == 0 {
				continue
			}

			neighborRow := (row + dr + u.height) % u.height
			neighborCol := (col + dc + u.width) % u.width
			idx := u.GetIndex(neighborRow, neighborCol)
			count += int(u.cells[idx])
		}
	}
	return count
}

func (u *Universe) Tick() {
	next := make([]uint8, len(u.cells))

	liveCells := 0

	for row := 0; row < u.height; row++ {
		for col := 0; col < u.width; col++ {
			idx := u.GetIndex(row, col)
			cell := u.cells[idx]
			liveNeighbors := u.LiveNeighborCount(row, col)

			nextCell := uint8(0)
			if cell == 1 && (liveNeighbors == 2 || liveNeighbors == 3) {
				nextCell = 1
			} else if cell == 0 && liveNeighbors == 3 {
				nextCell = 1
			}

			if nextCell == 1 {
				liveCells++
			}

			next[idx] = nextCell
		}
	}

	u.cells = next

	fmt.Printf("⏱️  Generation: %d cells alive\n", liveCells)
}

// Draw renders the universe on canvas
func (u *Universe) Draw() {
	// Clear canvas
	u.ctx.Set("fillStyle", "#ffffff")
	u.ctx.Call("fillRect", 0, 0, u.width*u.cellSize, u.height*u.cellSize)

	// Draw grid lines
	u.ctx.Set("strokeStyle", "#e0e0e0")
	u.ctx.Set("lineWidth", 1)

	for i := 0; i <= u.width; i++ {
		u.ctx.Call("beginPath")
		u.ctx.Call("moveTo", i*u.cellSize, 0)
		u.ctx.Call("lineTo", i*u.cellSize, u.height*u.cellSize)
		u.ctx.Call("stroke")
	}

	for i := 0; i <= u.height; i++ {
		u.ctx.Call("beginPath")
		u.ctx.Call("moveTo", 0, i*u.cellSize)
		u.ctx.Call("lineTo", u.width*u.cellSize, i*u.cellSize)
		u.ctx.Call("stroke")
	}

	// Draw live cells
	u.ctx.Set("fillStyle", "#4CAF50")

	for row := 0; row < u.height; row++ {
		for col := 0; col < u.width; col++ {
			idx := u.GetIndex(row, col)
			if u.cells[idx] == 1 {
				x := col * u.cellSize
				y := row * u.cellSize
				u.ctx.Call("fillRect", x+1, y+1, u.cellSize-2, u.cellSize-2)
			}
		}
	}
}

// Add stats display on screen
func (u *Universe) UpdateStats(generation int) {
	alive := 0
	for _, cell := range u.cells {
		if cell == 1 {
			alive++
		}
	}

	doc := js.Global().Get("document")
	stats := doc.Call("getElementById", "stats")
	if stats.IsNull() {
		// Create stats div if it doesn't exist
		stats = doc.Call("createElement", "div")
		stats.Set("id", "stats")
		stats.Set("style", "margin: 20px; font-family: monospace; font-size: 18px;")
		doc.Get("body").Call("appendChild", stats)
	}

	percentage := float64(alive) / float64(len(u.cells)) * 100
	stats.Set("innerHTML", fmt.Sprintf(
		"🎮 <b>Generation:</b> %d | 💚 <b>Alive:</b> %d/%d (%.1f%%)",
		generation, alive, len(u.cells), percentage,
	))
}

func main() {
	fmt.Println("🌐 Go WASM - Game of Life")

	doc := js.Global().Get("document")

	// Create title
	title := doc.Call("createElement", "h1")
	title.Set("textContent", "🎮 Conway's Game of Life - Go WASM")
	title.Set("style", "font-family: Arial; margin: 20px;")
	doc.Get("body").Call("appendChild", title)

	// Create universe
	universe := NewUniverse(80, 60, 10) // 80x60 grid, 10px cells

	// Animation loop
	generation := 0
	ticker := time.NewTicker(100 * time.Millisecond) // 10 FPS

	go func() {
		for range ticker.C {
			generation++
			universe.Tick()
			universe.Draw()
			universe.UpdateStats(generation)
		}
	}()

	// Initial draw
	universe.Draw()
	universe.UpdateStats(0)

	fmt.Println("✅ Animation started!")

	select {}
}
