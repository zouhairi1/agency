package hooks

import (
	"bytes"
	"encoding/json"
	"net/http"
	"time"

	"github.com/pocketbase/pocketbase/core"
)

// SyncLeadToCRM forwards a new lead as JSON to CRM_WEBHOOK_URL (HubSpot / Pipedrive / Make / n8n …).
// It runs in the background so the visitor never waits on the CRM, and does nothing if the URL is unset.
func SyncLeadToCRM(e *core.RecordEvent) error {
	webhook := env("CRM_WEBHOOK_URL", "")
	if webhook == "" {
		return e.Next()
	}

	payload, err := json.Marshal(map[string]any{
		"id":          e.Record.Id,
		"name":        e.Record.GetString("name"),
		"email":       e.Record.GetString("email"),
		"company":     e.Record.GetString("company"),
		"services":    e.Record.GetStringSlice("services"),
		"budget":      e.Record.GetString("budget"),
		"timeline":    e.Record.GetString("timeline"),
		"channel":     e.Record.GetString("channel"),
		"message":     e.Record.GetString("message"),
		"estimate":    e.Record.Get("estimate"),
		"source_page": e.Record.GetString("source_page"),
		"utm":         e.Record.Get("utm"),
		"created":     time.Now().UTC().Format(time.RFC3339),
	})
	if err != nil {
		e.App.Logger().Error("CRM payload marshal failed", "error", err)
		return e.Next()
	}

	app := e.App
	apiKey := env("CRM_API_KEY", "")
	go func() {
		req, err := http.NewRequest(http.MethodPost, webhook, bytes.NewReader(payload))
		if err != nil {
			app.Logger().Error("CRM request build failed", "error", err)
			return
		}
		req.Header.Set("Content-Type", "application/json")
		if apiKey != "" {
			req.Header.Set("Authorization", "Bearer "+apiKey)
		}
		resp, err := httpClient.Do(req)
		if err != nil {
			app.Logger().Error("CRM sync failed", "error", err)
			return
		}
		resp.Body.Close()
		if resp.StatusCode >= 300 {
			app.Logger().Error("CRM sync returned error status", "status", resp.StatusCode)
		}
	}()

	return e.Next()
}
