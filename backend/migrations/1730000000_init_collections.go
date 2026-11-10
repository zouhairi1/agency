package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

// Shared field limits.
const (
	mb              = 1 << 20
	imageMaxSize    = 10 * mb
	videoMaxSize    = 100 * mb
	documentMaxSize = 15 * mb
)

var (
	imageMimes    = []string{"image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml", "image/gif"}
	videoMimes    = []string{"video/mp4", "video/webm"}
	documentMimes = []string{
		"application/pdf",
		"application/msword",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"image/jpeg", "image/png", "application/zip",
	}
	thumbs = []string{"400x0", "800x0", "1600x0"}

	publicRule     = types.Pointer("")
	publishedRule  = types.Pointer("published = true")
	superusersOnly *string // nil = only superusers
)

// Collection names in dependency order (relations point to earlier collections).
var collectionOrder = []string{
	"services", "team", "projects", "testimonials", "clients", "posts",
	"jobs", "awards", "stats", "estimator_options", "leads", "applications", "subscribers",
}

func init() {
	m.Register(func(app core.App) error {
		ids := map[string]string{}
		save := func(c *core.Collection) error {
			addTimestamps(c)
			if err := app.Save(c); err != nil {
				return err
			}
			ids[c.Name] = c.Id
			return nil
		}

		// ---------- services ----------
		services := core.NewBaseCollection("services")
		setPublicRead(services, publicRule)
		services.Fields.Add(
			&core.TextField{Name: "title", Required: true, Presentable: true, Max: 120},
			slugField(),
			&core.TextField{Name: "outcome", Max: 200, Help: "One-line outcome, e.g. 'Launch an MVP in 8 weeks'"},
			&core.EditorField{Name: "description"},
			&core.JSONField{Name: "capabilities", Help: `Array of strings, e.g. ["Next.js", "Design systems"]`},
			imageField("icon", 1),
			&core.NumberField{Name: "order", OnlyInt: true},
		)
		addSeoFields(services)
		services.AddIndex("idx_services_slug", true, "slug", "")
		if err := save(services); err != nil {
			return err
		}

		// ---------- team ----------
		team := core.NewBaseCollection("team")
		setPublicRead(team, publicRule)
		team.Fields.Add(
			&core.TextField{Name: "name", Required: true, Presentable: true, Max: 120},
			&core.TextField{Name: "role", Required: true, Max: 120},
			imageField("photo", 1),
			imageField("alt_photo", 1),
			&core.TextField{Name: "bio", Max: 2000},
			&core.JSONField{Name: "socials", Help: `{"linkedin": "...", "github": "..."}`},
			&core.NumberField{Name: "order", OnlyInt: true},
		)
		if err := save(team); err != nil {
			return err
		}

		// ---------- projects (case studies) ----------
		projects := core.NewBaseCollection("projects")
		setPublicRead(projects, publishedRule)
		projects.Fields.Add(
			&core.TextField{Name: "title", Required: true, Presentable: true, Max: 160},
			slugField(),
			&core.TextField{Name: "client", Required: true, Max: 120},
			&core.TextField{Name: "summary", Max: 300, Help: "One-line result shown on cards"},
			imageField("cover", 1),
			&core.FileField{Name: "hero_video", MaxSelect: 1, MaxSize: videoMaxSize, MimeTypes: videoMimes},
			imageField("gallery", 30),
			&core.RelationField{Name: "services", CollectionId: ids["services"], MaxSelect: 10},
			&core.SelectField{Name: "category", MaxSelect: 3, Values: []string{"web", "mobile", "design", "ai", "branding"}},
			&core.TextField{Name: "industry", Max: 80},
			&core.JSONField{Name: "stack", Help: `["Astro", "Go", "PocketBase"]`},
			&core.NumberField{Name: "year", OnlyInt: true},
			&core.URLField{Name: "live_url"},
			&core.JSONField{Name: "results", Help: `[{"value": "+212%", "label": "conversions"}]`},
			&core.EditorField{Name: "challenge"},
			&core.EditorField{Name: "approach"},
			&core.EditorField{Name: "body"},
			&core.BoolField{Name: "featured"},
			&core.BoolField{Name: "published"},
			&core.NumberField{Name: "order", OnlyInt: true},
		)
		addSeoFields(projects)
		projects.AddIndex("idx_projects_slug", true, "slug", "")
		if err := save(projects); err != nil {
			return err
		}

		// ---------- testimonials ----------
		testimonials := core.NewBaseCollection("testimonials")
		setPublicRead(testimonials, publicRule)
		testimonials.Fields.Add(
			&core.TextField{Name: "quote", Required: true, Max: 1000},
			&core.TextField{Name: "name", Required: true, Presentable: true, Max: 120},
			&core.TextField{Name: "role", Max: 120},
			&core.TextField{Name: "company", Max: 120},
			imageField("photo", 1),
			&core.FileField{Name: "video", MaxSelect: 1, MaxSize: videoMaxSize, MimeTypes: videoMimes},
			&core.RelationField{Name: "project", CollectionId: ids["projects"], MaxSelect: 1},
			&core.NumberField{Name: "order", OnlyInt: true},
		)
		if err := save(testimonials); err != nil {
			return err
		}

		// ---------- clients (logo marquee) ----------
		clients := core.NewBaseCollection("clients")
		setPublicRead(clients, publicRule)
		clients.Fields.Add(
			&core.TextField{Name: "name", Required: true, Presentable: true, Max: 120},
			&core.FileField{Name: "logo", MaxSelect: 1, MaxSize: 2 * mb, MimeTypes: []string{"image/svg+xml", "image/png", "image/webp"}},
			&core.URLField{Name: "url"},
			&core.NumberField{Name: "order", OnlyInt: true},
		)
		if err := save(clients); err != nil {
			return err
		}

		// ---------- posts (insights) ----------
		posts := core.NewBaseCollection("posts")
		setPublicRead(posts, publishedRule)
		posts.Fields.Add(
			&core.TextField{Name: "title", Required: true, Presentable: true, Max: 200},
			slugField(),
			&core.TextField{Name: "excerpt", Max: 400},
			imageField("cover", 1),
			&core.SelectField{Name: "category", MaxSelect: 1, Values: []string{"engineering", "design", "motion", "business", "culture"}},
			&core.EditorField{Name: "body"},
			&core.RelationField{Name: "author", CollectionId: ids["team"], MaxSelect: 1},
			&core.DateField{Name: "published_at"},
			&core.BoolField{Name: "published"},
		)
		addSeoFields(posts)
		posts.AddIndex("idx_posts_slug", true, "slug", "")
		if err := save(posts); err != nil {
			return err
		}

		// ---------- jobs ----------
		jobs := core.NewBaseCollection("jobs")
		setPublicRead(jobs, types.Pointer("open = true"))
		jobs.Fields.Add(
			&core.TextField{Name: "title", Required: true, Presentable: true, Max: 160},
			slugField(),
			&core.TextField{Name: "department", Max: 80},
			&core.TextField{Name: "location", Max: 120},
			&core.SelectField{Name: "type", MaxSelect: 1, Values: []string{"full-time", "part-time", "contract", "internship"}},
			&core.EditorField{Name: "description"},
			&core.BoolField{Name: "open"},
		)
		jobs.AddIndex("idx_jobs_slug", true, "slug", "")
		if err := save(jobs); err != nil {
			return err
		}

		// ---------- awards ----------
		awards := core.NewBaseCollection("awards")
		setPublicRead(awards, publicRule)
		awards.Fields.Add(
			&core.TextField{Name: "name", Required: true, Presentable: true, Max: 160},
			&core.TextField{Name: "org", Max: 120, Help: "Awwwards, CSSDA, Clutch…"},
			&core.NumberField{Name: "year", OnlyInt: true},
			&core.RelationField{Name: "project", CollectionId: ids["projects"], MaxSelect: 1},
			imageField("badge", 1),
		)
		if err := save(awards); err != nil {
			return err
		}

		// ---------- stats ----------
		stats := core.NewBaseCollection("stats")
		setPublicRead(stats, publicRule)
		stats.Fields.Add(
			&core.TextField{Name: "label", Required: true, Presentable: true, Max: 80},
			&core.NumberField{Name: "value", Required: true},
			&core.TextField{Name: "prefix", Max: 5},
			&core.TextField{Name: "suffix", Max: 5, Help: "e.g. + or %"},
			&core.NumberField{Name: "order", OnlyInt: true},
		)
		if err := save(stats); err != nil {
			return err
		}

		// ---------- estimator_options (Scope Calculator) ----------
		estimator := core.NewBaseCollection("estimator_options")
		setPublicRead(estimator, publicRule)
		estimator.Fields.Add(
			&core.SelectField{Name: "group", Required: true, MaxSelect: 1, Values: []string{"project_type", "feature", "timeline", "addon"}},
			&core.TextField{Name: "label", Required: true, Presentable: true, Max: 80},
			&core.TextField{Name: "description", Max: 240},
			&core.NumberField{Name: "base_weeks", Help: "Weeks added (project_type/feature/addon)"},
			&core.NumberField{Name: "min_price", Help: "Price added, lower bound"},
			&core.NumberField{Name: "max_price", Help: "Price added, upper bound"},
			&core.NumberField{Name: "multiplier", Help: "Timeline only: e.g. 0.9 flexible, 1 standard, 1.3 rush"},
			imageField("icon", 1),
			&core.NumberField{Name: "order", OnlyInt: true},
		)
		if err := save(estimator); err != nil {
			return err
		}

		// ---------- leads (contact / estimator / drawer submissions) ----------
		leads := core.NewBaseCollection("leads")
		leads.ListRule, leads.ViewRule, leads.UpdateRule, leads.DeleteRule = superusersOnly, superusersOnly, superusersOnly, superusersOnly
		leads.CreateRule = publicRule // guarded by Turnstile hook + rate limit
		leads.Fields.Add(
			&core.TextField{Name: "name", Required: true, Presentable: true, Max: 120},
			&core.EmailField{Name: "email", Required: true},
			&core.TextField{Name: "company", Max: 120},
			&core.SelectField{Name: "services", MaxSelect: 6, Values: []string{"website", "web-app", "mobile-app", "design", "ai", "other"}},
			&core.SelectField{Name: "budget", MaxSelect: 1, Values: []string{"<10k", "10-25k", "25-50k", "50-100k", "100k+"}},
			&core.SelectField{Name: "timeline", MaxSelect: 1, Values: []string{"asap", "1-3m", "3-6m", "flexible"}},
			&core.TextField{Name: "message", Max: 5000},
			&core.FileField{Name: "attachment", MaxSelect: 1, MaxSize: documentMaxSize, MimeTypes: documentMimes, Protected: true},
			&core.JSONField{Name: "estimate", MaxSize: 20000, Help: "Scope calculator selections + computed range"},
			&core.SelectField{Name: "channel", MaxSelect: 1, Values: []string{"form", "drawer", "estimator", "whatsapp", "booking"}},
			&core.TextField{Name: "source_page", Max: 300},
			&core.JSONField{Name: "utm", MaxSize: 2000},
			&core.SelectField{Name: "status", MaxSelect: 1, Values: []string{"new", "contacted", "qualified", "proposal", "won", "lost"}},
		)
		if err := save(leads); err != nil {
			return err
		}

		// ---------- applications (careers) ----------
		applications := core.NewBaseCollection("applications")
		applications.ListRule, applications.ViewRule, applications.UpdateRule, applications.DeleteRule = superusersOnly, superusersOnly, superusersOnly, superusersOnly
		applications.CreateRule = publicRule
		applications.Fields.Add(
			&core.RelationField{Name: "job", CollectionId: ids["jobs"], MaxSelect: 1},
			&core.TextField{Name: "name", Required: true, Presentable: true, Max: 120},
			&core.EmailField{Name: "email", Required: true},
			&core.URLField{Name: "portfolio_url"},
			&core.FileField{Name: "cv", MaxSelect: 1, MaxSize: documentMaxSize, MimeTypes: documentMimes, Protected: true},
			&core.TextField{Name: "message", Max: 5000},
		)
		if err := save(applications); err != nil {
			return err
		}

		// ---------- subscribers (newsletter) ----------
		subscribers := core.NewBaseCollection("subscribers")
		subscribers.ListRule, subscribers.ViewRule, subscribers.UpdateRule, subscribers.DeleteRule = superusersOnly, superusersOnly, superusersOnly, superusersOnly
		subscribers.CreateRule = publicRule
		subscribers.Fields.Add(
			&core.EmailField{Name: "email", Required: true, Presentable: true},
			&core.BoolField{Name: "confirmed"},
		)
		subscribers.AddIndex("idx_subscribers_email", true, "email", "")
		if err := save(subscribers); err != nil {
			return err
		}

		// ---------- rate limits for public create endpoints ----------
		settings := app.Settings()
		settings.RateLimits.Enabled = true
		settings.RateLimits.Rules = append(settings.RateLimits.Rules,
			core.RateLimitRule{Label: "leads:create", MaxRequests: 5, Duration: 60},
			core.RateLimitRule{Label: "applications:create", MaxRequests: 3, Duration: 60},
			core.RateLimitRule{Label: "subscribers:create", MaxRequests: 3, Duration: 60},
		)
		return app.Save(settings)
	}, func(app core.App) error {
		for i := len(collectionOrder) - 1; i >= 0; i-- {
			c, err := app.FindCollectionByNameOrId(collectionOrder[i])
			if err != nil {
				continue
			}
			if err := app.Delete(c); err != nil {
				return err
			}
		}
		return nil
	})
}

func setPublicRead(c *core.Collection, rule *string) {
	c.ListRule = rule
	c.ViewRule = rule
	// Create/Update/Delete stay nil → superusers only.
}

func slugField() *core.TextField {
	return &core.TextField{Name: "slug", Required: true, Max: 120, Pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`}
}

func imageField(name string, maxSelect int) *core.FileField {
	return &core.FileField{Name: name, MaxSelect: maxSelect, MaxSize: imageMaxSize, MimeTypes: imageMimes, Thumbs: thumbs}
}

func addSeoFields(c *core.Collection) {
	c.Fields.Add(
		&core.TextField{Name: "seo_title", Max: 70},
		&core.TextField{Name: "seo_description", Max: 160},
		imageField("og_image", 1),
	)
}

func addTimestamps(c *core.Collection) {
	c.Fields.Add(
		&core.AutodateField{Name: "created", OnCreate: true},
		&core.AutodateField{Name: "updated", OnCreate: true, OnUpdate: true},
	)
}
