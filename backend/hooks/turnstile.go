package hooks

import (
	"encoding/json"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/pocketbase/pocketbase/core"
)

const turnstileVerifyURL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

// TurnstileHeader is the request header the frontend uses to send the Turnstile token.
const TurnstileHeader = "X-Turnstile-Token"

var httpClient = &http.Client{Timeout: 10 * time.Second}

// VerifyTurnstile rejects public form submissions without a valid Cloudflare Turnstile token.
// Superusers (e.g. creating records from the dashboard) skip the check.
// If TURNSTILE_SECRET is not set (local development), the check is skipped with a warning.
func VerifyTurnstile(e *core.RecordRequestEvent) error {
	if e.HasSuperuserAuth() {
		return e.Next()
	}

	secret := env("TURNSTILE_SECRET", "")
	if secret == "" {
		e.App.Logger().Warn("TURNSTILE_SECRET not set; skipping spam verification", "collection", e.Collection.Name)
		return e.Next()
	}

	token := strings.TrimSpace(e.Request.Header.Get(TurnstileHeader))
	if token == "" {
		return e.BadRequestError("Missing spam-protection token.", nil)
	}

	resp, err := httpClient.PostForm(turnstileVerifyURL, url.Values{
		"secret":   {secret},
		"response": {token},
		"remoteip": {e.RealIP()},
	})
	if err != nil {
		e.App.Logger().Error("Turnstile verification request failed", "error", err)
		return e.BadRequestError("Spam-protection check failed. Please try again.", nil)
	}
	defer resp.Body.Close()

	var result struct {
		Success    bool     `json:"success"`
		ErrorCodes []string `json:"error-codes"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil || !result.Success {
		e.App.Logger().Warn("Turnstile rejected submission", "codes", result.ErrorCodes, "ip", e.RealIP())
		return e.BadRequestError("Spam-protection check failed. Please try again.", nil)
	}

	return e.Next()
}
