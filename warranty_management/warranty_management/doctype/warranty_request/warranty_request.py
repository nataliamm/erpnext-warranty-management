# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt


from __future__ import unicode_literals
from frappe.model.document import Document
import frappe


class WarrantyRequest(Document):

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

	def complete_testing_item(self):
		if self.is_testing_completed:
			frappe.throw("Testing is already completed")

		frappe.db.set(self, "is_testing_completed", 1)
		frappe.db.set(self, "status", "Testing Completed")
		frappe.clear_cache(doctype="Warranty Request")

	def start_repairing_item(self):
		if self.is_repairing_started:
			frappe.throw("Repairing is already started")

		frappe.db.set(self, "is_repairing_started", 1)
		frappe.db.set(self, "status", "Repairing")
		frappe.clear_cache(doctype="Warranty Request")

	def complete_repairing_item(self):
		if self.is_repairing_completed:
			frappe.throw("Repairing is already completed")

		frappe.db.set(self, "is_repairing_completed", 1)
		frappe.db.set(self, "status", "Repairing Completed")
		frappe.clear_cache(doctype="Warranty Request")


@frappe.whitelist()
def add_testing_results(name, testing_results):
	pass
