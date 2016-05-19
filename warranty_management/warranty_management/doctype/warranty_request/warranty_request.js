// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt


confirm_receiving_item = function(frm) {
    return cur_frm.call({
        freeze: true,
        doc: cur_frm.doc,
        method: "confirm_receiving_item",
        callback: function(r) {
            if(!r.exc) {
                cur_frm.reload_doc();
            }
        }
    });
}


start_testing_item = function(frm) {
    return cur_frm.call({
        freeze: true,
        doc: cur_frm.doc,
        method: "start_testing_item",
        callback: function(r) {
            if(!r.exc) {
                cur_frm.reload_doc();
            }
        }
    });
}


complete_testing_item = function(frm) {
    var dialog = new frappe.ui.Dialog({
        title: __("Testing Results"),
        fields: [
            {fieldtype: "Small Text", fieldname: "testing_results", label:__("Testing Results"),
                description: __('Please add testing results'), reqd: 1},
            {fieldtype:"Section Break"},
            {
                fieldname:"accept_btn",
                fieldtype:"HTML",
                options: "<div style=\"padding-top: 20px;\"><button id=\"accept-btn\" type=\"button\" class=\"btn btn-success btn-block\">Accept</button></div>"
            },
            {fieldtype:"Column Break"},
            {
                "fieldtype": "Button",
                "label": __("Test Button"),
                "fieldname": "test_button",
                "cssClass": "btn btn-block btn-primary"
            },
            {fieldtype:"Column Break"},
            {
                fieldname:"reject_btn",
                fieldtype:"HTML",
                options: "<div style=\"padding-top: 20px;\"><button id=\"reject-btn\" type=\"button\" class=\"btn btn-danger btn-block\">Reject</button></div>"
            }
        ]
    });
    dialog.fields_dict.test_button.$input.addClass("btn btn-block btn-primary")
    dialog.$wrapper.on("click", "#accept-btn", function() {
        args = dialog.get_values();
        if(!args) return;
        dialog.hide();
        frappe.call({
            type: "POST",
            method: "warranty_management.warranty_management.doctype.warranty_request.warranty_request.add_testing_results",
            args: {
                name: cur_frm.doc.name,
                testing_results: args.testing_results,
                is_testing_rejected: 0
            },
            freeze: true,
            callback: function(r) {
                if(!r.exc) {
                    cur_frm.reload_doc();
                }
            }
        })
    });

    dialog.$wrapper.on("click", "#reject-btn", function() {
        args = dialog.get_values();
        if(!args) return;
        dialog.hide();
        frappe.call({
            type: "POST",
            method: "warranty_management.warranty_management.doctype.warranty_request.warranty_request.add_testing_results",
            args: {
                name: cur_frm.doc.name,
                testing_results: args.testing_results,
                is_testing_rejected: 1
            },
            freeze: true,
            callback: function(r) {
                if(!r.exc) {
                    cur_frm.reload_doc();
                    frappe.model.open_mapped_doc({
                        method: "warranty_management.warranty_management.doctype.warranty_request.warranty_request.make_delivery_note",
                        frm: cur_frm
                    })
                }
            }
        })
    });
    dialog.show();
}


make_stock_entry = function(frm) {

}


start_repairing_item = function(frm) {
    return cur_frm.call({
        freeze: true,
        doc: cur_frm.doc,
        method: "start_repairing_item",
        callback: function(r) {
            if(!r.exc) {
                cur_frm.reload_doc();
            }
        }
    });
}


complete_repairing_item = function(frm) {
    var dialog = new frappe.ui.Dialog({
        title: __("Repairing Results"),
        fields: [
            {fieldtype: "Small Text", fieldname: "repairing_results", label:__("Repairing Results"),
                description: __('Results for repairing Item'), reqd: 1},
            {fieldtype: "Button", label: __("Save"), fieldname: "add_results", "cssClass": "btn-primary"},
        ]
    });

    dialog.fields_dict.add_results.$input.click(function() {
        args = dialog.get_values();
        if(!args) return;
        dialog.hide();
        frappe.call({
            type: "POST",
            method: "warranty_management.warranty_management.doctype.warranty_request.warranty_request.add_repairing_results",
            args: {
                name: cur_frm.doc.name,
                repairing_results: args.repairing_results
            },
            freeze: true,
            callback: function(r) {
                if(!r.exc) {
                    cur_frm.reload_doc();
                }
            }
        })
    });
    dialog.show();
}


frappe.ui.form.on("Warranty Request", {
    onload: function(doc, dt, dn) {
        if(doc.__islocal) {
            set_multiple(dt,dn,{complaint_date:get_today()});
        }

        cur_frm.add_fetch("item_code", "item_name", "item_name");
        cur_frm.add_fetch("item_code", "description", "description");
    },
    refresh: function(frm) {
        if(!frm.doc.__islocal) {
            if(!frm.doc.is_item_confirmed) {
                frm.add_custom_button(__('Confirm Receiving Item'), confirm_receiving_item).addClass("btn-primary")
            } else {
                if(!frm.doc.is_testing_completed) {
                    if(!frm.doc.is_testing_started) {
                        cur_frm.add_custom_button(__('Start Testing Item'), start_testing_item).addClass("btn-primary")
                    } else {
                        cur_frm.add_custom_button(__('Complete Testing Item'), complete_testing_item).addClass("btn-primary")
                    }
                } else {
                    if(!frm.doc.is_repairing_completed && frm.doc.is_testing_rejected) {
                        if(!frm.doc.is_repairing_started) {
                            cur_frm.add_custom_button(__('Start Repairing Item'), start_repairing_item).addClass("btn-primary")
                        } else {
                            cur_frm.add_custom_button(__('Complete Repairing Item'), complete_repairing_item).addClass("btn-primary")
                        }
                    }
                }
                if(!frm.doc.stock_entry) {
                    cur_frm.add_custom_button(__('Make Stock Entry'), make_stock_entry)
                }
            }
        }
    },
    customer: function(frm) {
        erpnext.utils.get_party_details(frm);
    },
    customer_address: function(frm) {
        erpnext.utils.get_address_display(frm);
    },
    contact_person: function(frm) {
        erpnext.utils.get_contact_details(frm);
    }
});
