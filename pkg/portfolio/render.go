package portfolio

import (
	"joelkariyalil-website/pkg/dom"
	"syscall/js"
)

// Render renders the portfolio to the DOM
func Render(p Portfolio) {
	container := dom.CreateDiv()

	// Header section
	renderHeader(container, p)

	// Contact section
	renderContact(container, p)

	// Skills section
	renderSkills(container, p)

	// Projects section
	renderProjects(container, p)

	// Experience section
	renderExperience(container, p)

	// Footer
	renderFooter(container)

	// Append to body
	dom.ClearBody()
	dom.AppendChild(dom.GetBody(), container)
}

func renderHeader(container js.Value, p Portfolio) {
	header := dom.CreateDiv()

	h1 := dom.CreateH1(p.Name)
	dom.AppendChild(header, h1)

	subtitle := dom.CreateH2(p.Title)
	dom.AppendChild(header, subtitle)

	bio := dom.CreateP(p.Bio)
	dom.AppendChild(header, bio)

	dom.AppendChild(container, header)
}

func renderContact(container js.Value, p Portfolio) {
	contact := dom.CreateDiv()

	title := dom.CreateH3("Contact")
	dom.AppendChild(contact, title)

	email := dom.CreateP("Email: " + p.Email)
	dom.AppendChild(contact, email)

	github := dom.CreateP("GitHub: " + p.Github)
	dom.AppendChild(contact, github)

	dom.AppendChild(container, contact)
}

func renderSkills(container js.Value, p Portfolio) {
	skills := dom.CreateDiv()

	title := dom.CreateH3("Skills")
	dom.AppendChild(skills, title)

	list := dom.CreateUL()
	for _, skill := range p.Skills {
		li := dom.CreateLI(skill)
		dom.AppendChild(list, li)
	}
	dom.AppendChild(skills, list)

	dom.AppendChild(container, skills)
}

func renderProjects(container js.Value, p Portfolio) {
	projects := dom.CreateDiv()

	title := dom.CreateH3("Projects")
	dom.AppendChild(projects, title)

	for _, project := range p.Projects {
		projectDiv := dom.CreateDiv()

		projectTitle := dom.CreateH4(project.Title)
		dom.AppendChild(projectDiv, projectTitle)

		projectDesc := dom.CreateP(project.Description)
		dom.AppendChild(projectDiv, projectDesc)

		// Tech stack
		techText := "Tech: "
		for i, tech := range project.Tech {
			if i > 0 {
				techText += ", "
			}
			techText += tech
		}
		techP := dom.CreateP(techText)
		dom.AppendChild(projectDiv, techP)

		dom.AppendChild(projects, projectDiv)

		// Separator
		hr := dom.CreateHR()
		dom.AppendChild(projects, hr)
	}

	dom.AppendChild(container, projects)
}

func renderExperience(container js.Value, p Portfolio) {
	experience := dom.CreateDiv()

	title := dom.CreateH3("Experience")
	dom.AppendChild(experience, title)

	for _, exp := range p.Experience {
		expDiv := dom.CreateDiv()

		expRole := dom.CreateH4(exp.Role + " at " + exp.Company)
		dom.AppendChild(expDiv, expRole)

		expPeriod := dom.CreateP(exp.Period)
		dom.AppendChild(expDiv, expPeriod)

		expDesc := dom.CreateP(exp.Description)
		dom.AppendChild(expDiv, expDesc)

		dom.AppendChild(experience, expDiv)

		// Separator
		hr := dom.CreateHR()
		dom.AppendChild(experience, hr)
	}

	dom.AppendChild(container, experience)
}

func renderFooter(container js.Value) {
	footer := dom.CreateDiv()

	text := dom.CreateP("This portfolio is rendered with Go + WebAssembly")
	dom.AppendChild(footer, text)

	dom.AppendChild(container, footer)
}

