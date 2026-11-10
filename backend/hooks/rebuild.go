package hooks

import (
	"sync"
	"time"

	"github.com/pocketbase/pocketbase/core"
)

// Rebuilder calls the static host's deploy hook (DEPLOY_HOOK_URL) after content changes.
// Calls are debounced so that a burst of edits triggers a single rebuild.
type Rebuilder struct {
	app   core.App
	delay time.Duration
	mu    sync.Mutex
	timer *time.Timer
}

func NewRebuilder(app core.App) *Rebuilder {
	delay, err := time.ParseDuration(env("REBUILD_DEBOUNCE", "30s"))
	if err != nil {
		delay = 30 * time.Second
	}
	return &Rebuilder{app: app, delay: delay}
}

// Handle is bound to the after-create/update/delete hooks of content collections.
func (r *Rebuilder) Handle(e *core.RecordEvent) error {
	r.schedule(e.Record.Collection().Name)
	return e.Next()
}

func (r *Rebuilder) schedule(reason string) {
	url := env("DEPLOY_HOOK_URL", "")
	if url == "" {
		return
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	if r.timer != nil {
		r.timer.Stop()
	}
	r.timer = time.AfterFunc(r.delay, func() {
		resp, err := httpClient.Post(url, "application/json", nil)
		if err != nil {
			r.app.Logger().Error("Rebuild trigger failed", "error", err)
			return
		}
		resp.Body.Close()
		if resp.StatusCode >= 300 {
			r.app.Logger().Error("Rebuild hook returned error status", "status", resp.StatusCode)
			return
		}
		r.app.Logger().Info("Site rebuild triggered", "lastChange", reason)
	})
}
