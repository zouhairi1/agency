package hooks

import (
	"bytes"
	"embed"
	"html/template"
	"net/mail"
	"strings"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/mailer"
)

//go:embed templates/*.html
var templatesFS embed.FS

var emailTemplates = template.Must(template.ParseFS(templatesFS, "templates/*.html"))

type leadEmailData struct {
	AgencyName string
	Name       string
	Email      string
	Company    string
	Phone      string
	Services   string
	Timeline   string
	Channel    string
	Market     string
	Country    string
	Language   string
	HasCDC     bool
	HasFile    bool
	Meeting    string
	Message    string
	SourcePage string
	Estimate   string
	AdminURL   string
}

// NotifyNewLead emails the team about a new lead and sends an auto-reply to the client.
// Mail failures are logged but never fail the request (the lead is already saved).
func NotifyNewLead(e *core.RecordEvent) error {
	r := e.Record
	data := leadEmailData{
		AgencyName: env("AGENCY_NAME", "[AGENCY]"),
		Name:       r.GetString("name"),
		Email:      r.GetString("email"),
		Company:    r.GetString("company"),
		Phone:      r.GetString("phone"),
		Services:   strings.Join(r.GetStringSlice("services"), ", "),
		Timeline:   r.GetString("timeline"),
		Channel:    r.GetString("channel"),
		Market:     r.GetString("market"),
		Country:    r.GetString("country"),
		Language:   r.GetString("language"),
		HasCDC:     r.GetBool("has_cdc"),
		HasFile:    r.GetString("attachment") != "",
		Meeting:    r.GetString("meeting_preference"),
		Message:    r.GetString("message"),
		SourcePage: r.GetString("source_page"),
		Estimate:   r.GetString("estimate"),
		AdminURL:   strings.TrimRight(e.App.Settings().Meta.AppURL, "/") + "/_/#/collections?collection=leads&recordId=" + r.Id,
	}

	from := mail.Address{
		Name:    e.App.Settings().Meta.SenderName,
		Address: e.App.Settings().Meta.SenderAddress,
	}
	client := e.App.NewMailClient()

	if notify := env("LEADS_NOTIFY_EMAIL", ""); notify != "" {
		if html, err := render("lead_notification.html", data); err != nil {
			e.App.Logger().Error("Render lead notification failed", "error", err)
		} else if err := client.Send(&mailer.Message{
			From:    from,
			To:      []mail.Address{{Address: notify}},
			Headers: map[string]string{"Reply-To": (&mail.Address{Name: data.Name, Address: data.Email}).String()},
			Subject: "New lead: " + data.Name + companySuffix(data.Company) + marketTag(data.Market),
			HTML:    html,
		}); err != nil {
			e.App.Logger().Error("Send lead notification failed", "error", err, "lead", r.Id)
		}
	}

	if data.Email != "" {
		tmpl, subject := "lead_autoreply_fr.html", "Merci d'avoir contacté "+data.AgencyName
		if data.Language == "en" {
			tmpl, subject = "lead_autoreply_en.html", "Thanks for reaching out to "+data.AgencyName
		}
		if html, err := render(tmpl, data); err != nil {
			e.App.Logger().Error("Render lead auto-reply failed", "error", err)
		} else if err := client.Send(&mailer.Message{
			From:    from,
			To:      []mail.Address{{Name: data.Name, Address: data.Email}},
			Subject: subject,
			HTML:    html,
		}); err != nil {
			e.App.Logger().Error("Send lead auto-reply failed", "error", err, "lead", r.Id)
		}
	}

	return e.Next()
}

func render(name string, data any) (string, error) {
	var buf bytes.Buffer
	if err := emailTemplates.ExecuteTemplate(&buf, name, data); err != nil {
		return "", err
	}
	return buf.String(), nil
}

func marketTag(market string) string {
	switch market {
	case "morocco":
		return " [MA]"
	case "international":
		return " [INTL]"
	}
	return ""
}

func companySuffix(company string) string {
	if company == "" {
		return ""
	}
	return " (" + company + ")"
}
