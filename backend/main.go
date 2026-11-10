package main

import (
	"log"
	"os"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	"our_agency/backend/hooks"
	_ "our_agency/backend/migrations"
)

// Content collections that trigger a static rebuild of the Astro site when changed.
var contentCollections = []string{
	"projects", "services", "testimonials", "clients", "team",
	"posts", "jobs", "awards", "stats", "estimator_options",
}

// Collections that accept public submissions and must pass Turnstile verification.
var publicFormCollections = []string{"leads", "applications", "subscribers"}

func main() {
	hooks.LoadDotEnv(".env")

	app := pocketbase.New()

	// Version-controlled schema. Automigrate only while developing with `go run`,
	// so that collection changes made in the dashboard generate migration files.
	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Dir:         "migrations",
		Automigrate: isGoRun,
	})

	// Spam protection for public forms.
	app.OnRecordCreateRequest(publicFormCollections...).BindFunc(hooks.VerifyTurnstile)

	// New lead → notify the team, auto-reply to the client, sync to CRM.
	app.OnRecordAfterCreateSuccess("leads").BindFunc(hooks.NotifyNewLead)
	app.OnRecordAfterCreateSuccess("leads").BindFunc(hooks.SyncLeadToCRM)

	// Content published/edited/deleted → rebuild the static site (debounced).
	rebuild := hooks.NewRebuilder(app)
	app.OnRecordAfterCreateSuccess(contentCollections...).BindFunc(rebuild.Handle)
	app.OnRecordAfterUpdateSuccess(contentCollections...).BindFunc(rebuild.Handle)
	app.OnRecordAfterDeleteSuccess(contentCollections...).BindFunc(rebuild.Handle)

	// Note: PocketBase already exposes GET /api/health for uptime monitoring.
	// Add custom routes here with app.OnServe().BindFunc(func(se *core.ServeEvent) error { ... }).

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
