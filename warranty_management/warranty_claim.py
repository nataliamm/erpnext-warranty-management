# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe

def before_save(doc, method=None):
    if doc.warranty_amc_status in ("Out of Warranty", "Out of AMC"):
        frappe.db.set_value("Warranty Claim", doc.name, "is_paid", 1)


@frappe.whitelist()
def make_warranty_management_request(source_name, target_doc=None):
    from frappe.model.mapper import get_mapped_doc, map_child_doc

    def _update_links(source_doc, target_doc, source_parent):
        target_doc.prevdoc_doctype = source_parent.doctype
        target_doc.prevdoc_docname = source_parent.name

    visit = frappe.db.sql("""select t1.name
        from `tabMaintenance Visit` t1, `tabMaintenance Visit Purpose` t2
        where t2.parent=t1.name and t2.prevdoc_docname=%s
        and t1.docstatus=1 and t1.completion_status='Fully Completed'""", source_name)

    if not visit:
        target_doc = get_mapped_doc("Warranty Claim", source_name, {
            "Warranty Claim": {
                "doctype": "Warranty Request",
                "field_map": {}
            }
        }, target_doc)

        source_doc = frappe.get_doc("Warranty Claim", source_name)
        if source_doc.get("item_code"):
            table_map = {
                "doctype": "Warranty Request Purposes",
                "postprocess": _update_links
            }
            map_child_doc(source_doc, target_doc, table_map, source_doc)

        return target_doc
