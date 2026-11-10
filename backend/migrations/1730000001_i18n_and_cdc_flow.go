package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

// Bilingual content (French = main fields, English = *_en fields) and the
// "no public prices until CDC / meeting" lead flow.
//
// - Content collections get *_en text fields (the site falls back to French when empty).
// - estimator_options loses its price fields: the scoper estimates duration only.
// - leads get CDC / meeting / market fields; `budget` stays but is filled by the team after the meeting.

var translatable = map[string][]core.Field{
	"services": {
		&core.TextField{Name: "title_en", Max: 120},
		&core.TextField{Name: "outcome_en", Max: 200},
		&core.EditorField{Name: "description_en"},
	},
	"projects": {
		&core.TextField{Name: "title_en", Max: 160},
		&core.TextField{Name: "summary_en", Max: 300},
		&core.EditorField{Name: "challenge_en"},
		&core.EditorField{Name: "approach_en"},
		&core.EditorField{Name: "body_en"},
		&core.TextField{Name: "seo_title_en", Max: 70},
		&core.TextField{Name: "seo_description_en", Max: 160},
	},
	"testimonials": {
		&core.TextField{Name: "quote_en", Max: 1000},
		&core.TextField{Name: "role_en", Max: 120},
	},
	"team": {
		&core.TextField{Name: "role_en", Max: 120},
		&core.TextField{Name: "bio_en", Max: 2000},
	},
	"posts": {
		&core.TextField{Name: "title_en", Max: 200},
		&core.TextField{Name: "excerpt_en", Max: 400},
		&core.EditorField{Name: "body_en"},
	},
	"jobs": {
		&core.TextField{Name: "title_en", Max: 160},
		&core.EditorField{Name: "description_en"},
	},
	"stats": {
		&core.TextField{Name: "label_en", Max: 80},
	},
	"estimator_options": {
		&core.TextField{Name: "label_en", Max: 80},
		&core.TextField{Name: "description_en", Max: 240},
	},
}

var leadFields = []core.Field{
	&core.SelectField{Name: "market", MaxSelect: 1, Values: []string{"morocco", "international"}},
	&core.TextField{Name: "country", Max: 80},
	&core.TextField{Name: "phone", Max: 30},
	&core.SelectField{Name: "language", MaxSelect: 1, Values: []string{"fr", "en"}},
	&core.BoolField{Name: "has_cdc", Help: "Client already has a cahier des charges (CDC)"},
	&core.SelectField{Name: "meeting_preference", MaxSelect: 1, Values: []string{"in-person", "video", "phone"}},
}

func init() {
	m.Register(func(app core.App) error {
		for name, fields := range translatable {
			c, err := app.FindCollectionByNameOrId(name)
			if err != nil {
				return err
			}
			c.Fields.Add(fields...)
			if name == "estimator_options" {
				c.Fields.RemoveByName("min_price")
				c.Fields.RemoveByName("max_price")
			}
			if err := app.Save(c); err != nil {
				return err
			}
		}

		leads, err := app.FindCollectionByNameOrId("leads")
		if err != nil {
			return err
		}
		leads.Fields.Add(leadFields...)
		if f, ok := leads.Fields.GetByName("attachment").(*core.FileField); ok {
			f.Help = "CDC (cahier des charges) or brief"
		}
		if f, ok := leads.Fields.GetByName("budget").(*core.SelectField); ok {
			f.Help = "Internal: filled by the team after the CDC / meeting (never asked publicly)"
		}
		return app.Save(leads)
	}, func(app core.App) error {
		for name, fields := range translatable {
			c, err := app.FindCollectionByNameOrId(name)
			if err != nil {
				continue
			}
			for _, f := range fields {
				c.Fields.RemoveByName(f.GetName())
			}
			if name == "estimator_options" {
				c.Fields.Add(
					&core.NumberField{Name: "min_price"},
					&core.NumberField{Name: "max_price"},
				)
			}
			if err := app.Save(c); err != nil {
				return err
			}
		}
		leads, err := app.FindCollectionByNameOrId("leads")
		if err != nil {
			return nil
		}
		for _, f := range leadFields {
			leads.Fields.RemoveByName(f.GetName())
		}
		return app.Save(leads)
	})
}
