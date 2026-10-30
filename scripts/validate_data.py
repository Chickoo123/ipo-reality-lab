import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"

def load(name):
    return json.loads((DATA / name).read_text(encoding="utf-8"))

def validate_records(records, source_registry, policy):
    errors = []
    source_ids = {s["id"] for s in source_registry["sources"]}

    if policy.get("educational_price_data_lag_days") != 30:
        errors.append("SEBI educational price-data lag must be 30 days.")
    if policy.get("effective_date") != "2026-07-01":
        errors.append("SEBI price-data policy effective date must be 2026-07-01.")
    if policy.get("controls", {}).get("market_price_data_enabled") is not False:
        errors.append("Market-price data must remain disabled until legal/licensing review.")

    seen_ipo = set()
    for ipo in records.get("records", []):
        iid = ipo.get("id")
        if not iid or iid in seen_ipo:
            errors.append(f"Missing or duplicate IPO id: {iid!r}")
            continue
        seen_ipo.add(iid)

        docs = {}
        for doc in ipo.get("documents", []):
            did = doc.get("id")
            if not did or did in docs:
                errors.append(f"{iid}: missing or duplicate document id {did!r}")
                continue
            docs[did] = doc
            if doc.get("source_id") not in source_ids:
                errors.append(f"{iid}/{did}: unknown source_id")
            if not str(doc.get("url", "")).startswith("https://"):
                errors.append(f"{iid}/{did}: document URL must be HTTPS")

        def check_evidence(ev, label):
            if not isinstance(ev, dict):
                errors.append(f"{iid}: {label} missing evidence object")
                return
            if ev.get("document_id") not in docs:
                errors.append(f"{iid}: {label} references unknown document")
            if not isinstance(ev.get("page"), int) or ev["page"] < 1:
                errors.append(f"{iid}: {label} must have a positive page reference")

        for figure in ipo.get("figures", []):
            if not isinstance(figure.get("value"), (int, float)):
                errors.append(f"{iid}: figure {figure.get('id')} is not numeric")
            check_evidence(figure.get("evidence"), f"figure {figure.get('id')}")

        money_flow = ipo.get("money_flow")
        if money_flow:
            keys = ["gross_proceeds_inr_crore", "fresh_issue_inr_crore", "ofs_inr_crore", "net_proceeds_inr_crore"]
            for key in keys:
                if not isinstance(money_flow.get(key), (int, float)):
                    errors.append(f"{iid}: money_flow.{key} must be numeric")
            check_evidence(money_flow.get("evidence"), "money flow")
            vals = [money_flow.get(k) for k in keys[:3]]
            if all(isinstance(v, (int, float)) for v in vals):
                if abs(vals[0] - vals[1] - vals[2]) > 0.02:
                    errors.append(f"{iid}: gross proceeds do not reconcile to fresh issue + OFS")

        objects = ipo.get("objects_of_issue", [])
        total_alloc = 0
        object_ids = set()
        for obj in objects:
            oid = obj.get("id")
            if not oid or oid in object_ids:
                errors.append(f"{iid}: missing or duplicate object id {oid!r}")
            object_ids.add(oid)
            alloc = obj.get("baseline_allocation_inr", obj.get("rhp_allocation_inr"))
            if not isinstance(alloc, (int, float)):
                errors.append(f"{iid}/{oid}: RHP allocation must be numeric")
            else:
                total_alloc += alloc

            baseline_id = obj.get("baseline_document_id")
            if baseline_id not in docs:
                errors.append(f"{iid}/{oid}: baseline document does not exist")
            elif docs[baseline_id].get("type") not in ("RHP", "Prospectus"):
                errors.append(f"{iid}/{oid}: baseline document should be RHP or final prospectus")
            page = obj.get("baseline_page")
            if not isinstance(page, int) or page < 1:
                errors.append(f"{iid}/{oid}: baseline page must be positive")

            schedule = obj.get("schedule", {})
            status = schedule.get("status")
            if status not in ("disclosed", "not_disclosed"):
                errors.append(f"{iid}/{oid}: schedule status must be disclosed or not_disclosed")
            if status == "not_disclosed" and schedule.get("milestones"):
                errors.append(f"{iid}/{oid}: no-schedule object cannot have milestones")
            if status == "disclosed" and not schedule.get("milestones"):
                errors.append(f"{iid}/{oid}: disclosed schedule requires at least one milestone")
            for milestone in schedule.get("milestones", []):
                if not milestone.get("due_date") and not milestone.get("period"):
                    errors.append(f"{iid}/{oid}: schedule milestone needs a due date or financial period")
                check_evidence(milestone.get("evidence"), f"{oid} schedule milestone")

            revisions = obj.get("revisions", [])
            for rev in revisions:
                if not rev.get("approval_route"):
                    errors.append(f"{iid}/{oid}: revision needs a disclosed approval route")
                check_evidence(rev.get("evidence"), f"{oid} revision")

            reports = sorted(obj.get("reports", []), key=lambda r: r.get("quarter", ""))
            previous = None
            for report in reports:
                if report.get("document_id") not in docs:
                    errors.append(f"{iid}/{oid}: report document does not exist")
                util = report.get("utilisation", {})
                used = util.get("cumulative_used_inr")
                unspent = util.get("unspent_inr")
                if not isinstance(used, (int, float)):
                    errors.append(f"{iid}/{oid}: cumulative utilisation must be numeric")
                if not isinstance(unspent, (int, float)):
                    errors.append(f"{iid}/{oid}: unspent balance must be numeric")
                check_evidence(util.get("evidence"), f"{oid} utilisation")
                if previous is not None and isinstance(used, (int, float)) and used < previous:
                    revised = any(
                        r.get("effective_quarter") == report.get("quarter")
                        and r.get("changes_cumulative_utilisation") is True
                        and r.get("approval_route")
                        for r in revisions
                    )
                    if not revised:
                        errors.append(f"{iid}/{oid}: cumulative utilisation fell without a recorded approved revision")
                if isinstance(used, (int, float)):
                    previous = used

                if isinstance(alloc, (int, float)) and isinstance(used, (int, float)):
                    allowed = alloc
                    for rev in revisions:
                        new_alloc = rev.get("new_allocation_inr")
                        if new_alloc is not None and rev.get("approval_route"):
                            allowed = max(allowed, new_alloc)
                    if used > allowed + 0.02:
                        errors.append(f"{iid}/{oid}: utilisation exceeds allocation without approved revision")

        if money_flow and objects and isinstance(money_flow.get("net_proceeds_inr_crore"), (int, float)):
            if abs(total_alloc - money_flow["net_proceeds_inr_crore"]) > 0.05:
                errors.append(f"{iid}: RHP object allocations do not reconcile to net proceeds")

        for seller in ipo.get("sellers", []):
            if not isinstance(seller.get("shares_offered"), (int, float)):
                errors.append(f"{iid}: seller shares_offered must be numeric")
            if seller.get("waca") is not None and not seller.get("waca_basis"):
                errors.append(f"{iid}: WACA requires its disclosed calculation basis")
            check_evidence(seller.get("evidence"), "seller")

        for change in ipo.get("document_changes", []):
            check_evidence(change.get("left_evidence"), "document comparison left-side source")
            check_evidence(change.get("right_evidence"), "document comparison right-side source")

    return errors

def validate_json_urls(value, path="$"):
    """Validate every explicit URL field in a JSON document."""
    errors = []
    if isinstance(value, dict):
        for key, child in value.items():
            child_path = f"{path}.{key}"
            if str(key).lower() in {"url", "href", "uri"} and child is not None:
                if not isinstance(child, str) or not child.startswith("https://"):
                    errors.append(f"{child_path}: URL must use HTTPS")
            errors.extend(validate_json_urls(child, child_path))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            errors.extend(validate_json_urls(child, f"{path}[{index}]"))
    return errors


def validate_all_json_urls():
    errors = []
    for file_path in sorted(DATA.glob("*.json")):
        try:
            payload = json.loads(file_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(f"{file_path.name}: cannot read valid JSON: {exc}")
            continue
        errors.extend(validate_json_urls(payload, file_path.name))
    return errors


def validate():
    return (
        validate_records(load("ipo_records.json"), load("source_registry.json"), load("regulatory_policy.json"))
        + validate_all_json_urls()
    )

if __name__ == "__main__":
    errors = validate()
    if errors:
        print("VALIDATION FAILED")
        for error in errors:
            print(" -", error)
        raise SystemExit(1)
    print("VALIDATION PASSED — current data is structurally valid and evidence rules are active.")
