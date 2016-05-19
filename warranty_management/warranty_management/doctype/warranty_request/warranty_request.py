# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt


from __future__ import unicode_literals
from frappe.model.mapper import get_mapped_doc
from frappe.model.document import Document
import frappe


class WarrantyRequest(Document):

	def before_submit(self):
		pass

	def confirm_receiving_item(self):
		if self.is_item_confirmed:
			frappe.throw("Item is already confirmed")

		frappe.db.set(self, "is_item_confirmed", 1)
		frappe.db.set(self, "status", "Confirmed")
		frappe.clear_cache(doctype="Warranty Request")

	def start_testing_item(self):
		if self.is_testing_started:
			frappe.throw("Testing is already started")

		frappe.db.set(self, "is_testing_started", 1)
		frappe.db.set(self, "status", "Testing")
		frappe.clear_cache(doctype="Warranty Request")

	def start_repairing_item(self):
		if self.is_repairing_started:
			frappe.throw("Repairing is already started")

		frappe.db.set(self, "is_repairing_started", 1)
		frappe.db.set(self, "status", "Repairing")
		frappe.clear_cache(doctype="Warranty Request")


@frappe.whitelist()
def add_testing_results(name, testing_results, is_testing_rejected):
	if frappe.db.get_value("Warranty Request", name, "is_testing_completed"):
		frappe.throw("Testing is already completed")
	if is_testing_rejected:
		frappe.db.set_value("Warranty Request", name, "is_testing_rejected", 1)
	frappe.db.set_value("Warranty Request", name, "is_testing_completed", 1)
	frappe.db.set_value("Warranty Request", name, "status", "Testing Completed")
	frappe.db.set_value("Warranty Request Purposes", {"parent": name}, "testing_results", testing_results)
	frappe.clear_cache(doctype="Warranty Request")


@frappe.whitelist()
def add_repairing_results(name, repairing_results):
	if frappe.db.get_value("Warranty Request", name, "is_repairing_completed"):
		frappe.throw("Repairing is already completed")
	frappe.db.set_value("Warranty Request", name, "is_repairing_completed", 1)
	frappe.db.set_value("Warranty Request", name, "status", "Repairing Completed")
	frappe.db.set_value("Warranty Request Purposes", {"parent": name}, "work_done", repairing_results)
	frappe.clear_cache(doctype="Warranty Request")


@frappe.whitelist()
def make_delivery_note(source_name, target_doc=None):
	def set_missing_values(source, target):
		target.ignore_pricing_rule = 1
		target.run_method("set_missing_values")
		target.run_method("calculate_taxes_and_totals")

	def update_item(source, target, source_parent):
		target.qty = 1

	target_doc = get_mapped_doc("Warranty Request", source_name, {
		"Warranty Request": {
			"doctype": "Delivery Note",
			"validation": {
				"is_testing_rejected": ["=", 1]
			}
		},
		"Warranty Request Purposes": {
			"doctype": "Delivery Note Item",
			"field_map": {
			},
			"postprocess": update_item,
		},
		"Sales Taxes and Charges": {
			"doctype": "Sales Taxes and Charges",
			"add_if_empty": True
		},
		"Sales Team": {
			"doctype": "Sales Team",
			"add_if_empty": True
		}
	}, target_doc, set_missing_values)

	return target_doc
