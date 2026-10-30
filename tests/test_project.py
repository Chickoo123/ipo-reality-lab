import sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/"scripts"))
from validate_data import validate, validate_records, load

def test_published_dataset_passes_evidence_validation():
    assert validate()==[]

def test_academy_has_27_publicly_named_lessons():
    rows=load("academy.json")["modules"]
    assert len(rows)==27
    assert [x["id"] for x in rows[:24]]==[f"lesson-{i:02d}" for i in range(1,25)]
    assert [x["id"] for x in rows[24:]]==["monitoring-25","monitoring-26","monitoring-27"]
    assert {x["priority"] for x in rows}=={"Essential","Foundational","Advanced"}

def test_public_academy_uses_neutral_lesson_ids():
    rows=load("academy.json")["modules"]
    assert all(x["id"].startswith(("lesson-", "monitoring-")) for x in rows)
    assert len(rows)==27

def test_pages_workflow_builds_deployment_artifact_after_validation():
    workflow=(ROOT/".github/workflows/pages.yml").read_text(encoding="utf-8")
    assert "actions/configure-pages@v5" in workflow and "enablement: true" not in workflow
    assert "path: _site" in workflow

def test_public_audit_brief_and_architecture_docs_exist():
    assert (ROOT/"docs/technical-audit-brief.md").exists()
    assert (ROOT/"docs/architecture.md").exists()

def test_every_lesson_has_required_learning_parts():
    for lesson in load("academy.json")["modules"]:
        for field in ["plain","example","diagram","formula","can_infer","cannot_infer","quiz","sources"]:
            assert lesson.get(field), (lesson["id"],field)

def test_updated_sebi_rule_and_price_data_gate():
    p=load("regulatory_policy.json")
    assert p["educational_price_data_lag_days"]==30
    assert p["effective_date"]=="2026-07-01"
    assert p["controls"]["market_price_data_enabled"] is False

def test_source_registry_contains_sebi_nse_bse():
    ids={x["id"] for x in load("source_registry.json")["sources"]}
    assert {"SEBI","NSE","BSE"}.issubset(ids)

def test_demo_data_is_explicitly_fictional_and_separate():
    assert "FICTIONAL" in load("demo_scenario.json")["label"]
    rows=load("ipo_records.json")["records"]
    assert len(rows)==1
    assert rows[0]["id"]=="western-carriers-2024"
    assert "RHP page-level cross-check remains pending" in rows[0]["research_status"]
    assert "FICTIONAL" not in rows[0]["company_name"]

def test_case_library_only_publishes_a_qualified_source_linked_example():
    rows=load("cases.json")["cases"]
    assert len(rows)==1
    assert rows[0]["name"]=="Western Carriers (India) Limited"
    assert "RHP page-level cross-check" in rows[0]["status"]
    assert all(s["url"].startswith("https://") for s in rows[0]["sources"])

def test_checklist_and_scam_content_exist():
    assert len(load("checklist.json")["items"])>=15
    assert len(load("scams.json")["items"])>=5

def test_bad_evidence_page_is_rejected():
    policy=load("regulatory_policy.json");src=load("source_registry.json")
    records={"records":[{"id":"test-ipo","documents":[{"id":"rhp","type":"RHP","source_id":"SEBI","url":"https://example.com/rhp"}],
    "figures":[{"id":"amount","value":10,"evidence":{"document_id":"rhp","page":0}}]}]}
    assert any("positive page" in e for e in validate_records(records,src,policy))

def test_cumulative_utilisation_drop_requires_revision():
    policy=load("regulatory_policy.json");src=load("source_registry.json")
    docs=[{"id":x,"type":"RHP" if x=="rhp" else "MonitoringAgencyReport","source_id":"SEBI","url":f"https://example.com/{x}"} for x in ["rhp","q1","q2"]]
    records={"records":[{"id":"test-ipo","documents":docs,"objects_of_issue":[{
    "id":"capex","rhp_allocation_inr":100,"baseline_document_id":"rhp","baseline_page":1,
    "schedule":{"status":"not_disclosed","milestones":[]},"revisions":[],
    "reports":[
      {"quarter":"2026-Q1","document_id":"q1","utilisation":{"cumulative_used_inr":60,"unspent_inr":40,"evidence":{"document_id":"q1","page":1}}},
      {"quarter":"2026-Q2","document_id":"q2","utilisation":{"cumulative_used_inr":50,"unspent_inr":50,"evidence":{"document_id":"q2","page":1}}}
    ]}]}]}
    assert any("fell without" in e for e in validate_records(records,src,policy))

def test_undisclosed_schedule_cannot_have_milestones():
    policy=load("regulatory_policy.json");src=load("source_registry.json")
    records={"records":[{"id":"test","documents":[{"id":"rhp","type":"RHP","source_id":"SEBI","url":"https://example.com/rhp"}],
    "objects_of_issue":[{"id":"capex","rhp_allocation_inr":100,"baseline_document_id":"rhp","baseline_page":1,
    "schedule":{"status":"not_disclosed","milestones":[{"due_date":"2026-12-31","evidence":{"document_id":"rhp","page":1}}]}}]}]}
    assert any("no-schedule object cannot have milestones" in e for e in validate_records(records,src,policy))


def test_all_static_javascript_id_selectors_exist_in_html():
    import re
    from html.parser import HTMLParser
    class IdParser(HTMLParser):
        def __init__(self):
            super().__init__()
            self.ids = set()
        def handle_starttag(self, tag, attrs):
            for key, value in attrs:
                if key == "id":
                    self.ids.add(value)
    parser = IdParser()
    parser.feed((ROOT / "index.html").read_text(encoding="utf-8"))
    js = (ROOT / "app.js").read_text(encoding="utf-8")
    selectors = set(re.findall(r'\$\("#([A-Za-z0-9_-]+)"\)', js))
    dynamic = {"quiz-again", "quiz-feedback", "scam-feedback", "scam-next"}
    assert (selectors - dynamic).issubset(parser.ids), sorted((selectors - dynamic) - parser.ids)


def test_western_carriers_issue_split_and_net_proceeds_reconcile():
    record=load("ipo_records.json")["records"][0]
    money=record["money_flow"]
    assert round(money["fresh_issue_inr_crore"]+money["ofs_inr_crore"],2)==round(money["gross_proceeds_inr_crore"],2)
    allocations=sum(x.get("baseline_allocation_inr", x.get("rhp_allocation_inr", 0)) for x in record["objects_of_issue"])
    assert abs(allocations-money["net_proceeds_inr_crore"])<0.001


def test_windows_local_launcher_exists():
    launcher = ROOT / "run-local.bat"
    assert launcher.exists()
    assert "serve_local.py" in launcher.read_text(encoding="utf-8")


def test_neon_dark_theme_is_default_and_light_mode_is_opt_in():
    html=(ROOT/"index.html").read_text(encoding="utf-8")
    js=(ROOT/"app.js").read_text(encoding="utf-8")
    css=(ROOT/"styles.css").read_text(encoding="utf-8")
    assert 'localStorage.getItem("ipoRealityDark")!=="0"' in js
    assert "#080a16" in css and "#a78bfa" in css and "#22d3ee" in css and "#f472b6" in css
    assert 'id="theme"' in html
