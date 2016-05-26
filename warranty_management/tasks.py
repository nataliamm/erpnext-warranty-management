from __future__ import unicode_literals
from frappe.utils import add_days, nowdate

import frappe


EMAIL_SENDER = "erp_admin@digithinkit.com"


@frappe.whitelist()
def daily():
    users = frappe.db.sql("""select email, name from tabUser
        where name in (select parent from tabUserRole
        where role='Accounts Manager')""", as_dict=1)
    today = nowdate()
    end = add_days(today, 3)
    sales_invoices = frappe.db.sql("""select name from `tabSales Invoice`
        where (date(due_date) between date(%(start)s) and date(%(end)s))
        and outstanding_amount > 0
        and docstatus=1""", {
        "start": today,
        "end": end,
    }, as_dict=1)
    if sales_invoices:
        subject = "Outstanding sales invoices due %s" % today
        message = "<p>Please review and follow up with the customers on the outstanding sales invoices below:</p><ul>"
        from frappe.utils import get_link_to_form
        for si in sales_invoices:
            message += "<li>" + get_link_to_form("Sales Invoice", si.name, si.name) + "</li>"
        message += "</ul><p><b>Note:</b> The list above contains the invoices that are either overdue or have its due date within the next 3 business days</p>"

        frappe.sendmail(recipients=[u.email for u in users], subject=subject, message=message, reply_to=EMAIL_SENDER, bulk=True)
        formatted_si = ", ".join(si.name for si in sales_invoices)
        for u in [u.name for u in users]:
            todo_doc = frappe.get_doc({
                "doctype": "ToDo",
                "owner": u,
                "description": subject + ": " + formatted_si,
                "priority": "Medium",
                "status": "Open",
                "role": "Accounts Manager",
                "date": nowdate(),
                "assigned_by": frappe.session.user,
            })
            todo_doc.insert(ignore_permissions=True)
