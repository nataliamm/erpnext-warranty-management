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
            {
                fieldname:"item_code",
                fieldtype:"HTML",
                options: "<div style=\"font-size: 150%\">" +
                            "<div class=\"row\" style=\"padding-top: 10px;\">" +
                                "<div class=\"col-md-8\"><span class=\"label\">Item Code</span></div>" +
                                "<div class=\"col-md-2\"><span id=\"item_code-val\" class=\"label\"><a href=\"/desk#Form/Item/" + cur_frm.doc.warranty_request_purposes[0].item_code + "\">" + cur_frm.doc.warranty_request_purposes[0].item_code + "</a></span></div>" +
                                "<div class=\"col-md-2\"></div>" +
                            "</div>" +
                        "</div>"
            },
            {fieldtype:"Column Break"},
            {
                fieldname:"right_pane",
                fieldtype:"HTML",
                options: "<div style=\"font-size: 150%\">" +
                            "<div class=\"row\" style=\"padding-top: 10px;\">" +
                                "<div class=\"col-md-12\"><img id=\"item_image\" src=\"" + cur_frm.doc.warranty_request_purposes[0].image + "\" class=\"img-responsive\" alt=\"\"></div>" +
                            "</div>" +
                        "</div>"
            },
            {fieldtype:"Section Break"},
            {fieldtype: "Small Text", fieldname: "testing_results", label:__("Testing Results"), description: __('Please add testing results'), reqd: 1},
            {fieldtype:"Section Break"},
            {fieldtype: "Button", label: __("Accept"), fieldname: "accept_btn", cssClass: "btn btn-block btn-success"},
            {fieldtype:"Column Break"},
            {fieldtype: "Button", label: __("Reject"), fieldname: "reject_btn", cssClass: "btn btn-block btn-danger"},
        ]
    });
    dialog.fields_dict.accept_btn.$input.attr("style", "padding-top: 10px").addClass("btn btn-block btn-success").removeClass("btn-xs");
    dialog.fields_dict.reject_btn.$input.attr("style", "padding-top: 10px").addClass("btn btn-block btn-danger").removeClass("btn-xs");
    dialog.fields_dict.accept_btn.$input.click(function() {
        args = dialog.get_values();
        if(!args) return;
        dialog.hide();
        frappe.call({
            type: "POST",
            method: "warranty_management.warranty_management.doctype.warranty_request.warranty_request.add_testing_results",
            args: {
                name: cur_frm.doc.name,
                testing_results: args.testing_results
            },
            freeze: true,
            callback: function(r) {
                if(!r.exc) {
                    cur_frm.reload_doc();
                }
            }
        })
    });

    dialog.fields_dict.reject_btn.$input.click(function() {
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
                }
            }
        })
    });
    dialog.show();
}


make_sales_order = function(frm) {
    frappe.model.open_mapped_doc({
        method: "warranty_management.warranty_management.doctype.warranty_request.warranty_request.make_sales_order",
        frm: cur_frm
    })
}


make_stock_entry = function(frm) {
    frappe.model.open_mapped_doc({
        method: "warranty_management.warranty_management.doctype.warranty_request.warranty_request.make_stock_entry",
        frm: cur_frm
    })
}


make_delivery_note = function(frm) {
    frappe.model.open_mapped_doc({
        method: "warranty_management.warranty_management.doctype.warranty_request.warranty_request.make_delivery_note",
        frm: cur_frm
    })
}


make_sales_invoice = function(frm) {

}


make_material_request = function(frm) {
    frappe.call({
        args: {
            frm: cur_frm
        },
        method: "warranty_management.warranty_management.doctype.warranty_request.warranty_request.make_material_request",
        callback: function(r) {
            var doclist = frappe.model.sync(r.message);
            frappe.call({
                args: {
                    frm: cur_frm
                },
                method: "warranty_management.warranty_management.doctype.warranty_request.warranty_request.make_sales_invoice",
                callback: function(r) {
                    // var doclist = frappe.model.sync(r.message);
                    frappe.set_route("Form", doclist[0].doctype, doclist[0].name);
                }
            })
        }
    })
}



start_repairing_item = function(frm) {
    var dialog = new frappe.ui.Dialog({
        title: __("Repairing Task"),
        fields: [
            {
                fieldname:"item_code",
                fieldtype:"HTML",
                options: "<div style=\"font-size: 150%\">" +
                            "<div class=\"row\" style=\"padding-top: 10px;\">" +
                                "<div class=\"col-md-8\"><span class=\"label\">Item Code</span></div>" +
                                "<div class=\"col-md-2\"><span id=\"item_code-val\" class=\"label\"><a href=\"/desk#Form/Item/" + cur_frm.doc.warranty_request_purposes[0].item_code + "\">" + cur_frm.doc.warranty_request_purposes[0].item_code + "</a></span></div>" +
                                "<div class=\"col-md-2\"></div>" +
                            "</div>" +
                        "</div>"
            },
            {fieldtype:"Column Break"},
            {
                fieldname:"right_pane",
                fieldtype:"HTML",
                options: "<div style=\"font-size: 150%\">" +
                            "<div class=\"row\" style=\"padding-top: 10px;\">" +
                                "<div class=\"col-md-12\"><img id=\"item_image\" src=\"" + cur_frm.doc.warranty_request_purposes[0].image + "\" class=\"img-responsive\" alt=\"\"></div>" +
                            "</div>" +
                        "</div>"
            },
            {fieldtype:"Section Break"},
            {
                fieldname:"issue",
                fieldtype:"HTML",
                options: "<div style=\"font-size: 150%\">" +
                            "<div><span class=\"label\" style=\"color:red\">Issue</span></div>" +
                            "<div><span id=\"item_code-val\" class=\"label\">" + cur_frm.doc.warranty_request_purposes[0].issue + "</span></div>" +
                        "</div>"
            },
            {fieldtype:"Section Break"},
            {
                fieldname:"testing_results",
                fieldtype:"HTML",
                options: "<div style=\"font-size: 150%\">" +
                            "<div><span class=\"label\" style=\"color:green\">Testing Results</span></div>" +
                            "<div><span id=\"item_code-val\" class=\"label\">" + cur_frm.doc.warranty_request_purposes[0].testing_results + "</span></div>" +
                        "</div>"
            },
            {fieldtype:"Section Break"},
            {fieldtype: "Button", label: __("Repair"), fieldname: "repair_btn", cssClass: "btn btn-block btn-success"},
            {fieldtype:"Column Break"},
            {fieldtype: "Button", label: __("Replace"), fieldname: "replace_btn", cssClass: "btn btn-block btn-danger"},
        ]
    });
    dialog.fields_dict.repair_btn.$input.attr("style", "padding-top: 10px").addClass("btn btn-block btn-success").removeClass("btn-xs");
    dialog.fields_dict.replace_btn.$input.attr("style", "padding-top: 10px").addClass("btn btn-block btn-danger").removeClass("btn-xs");
    dialog.fields_dict.repair_btn.$input.click(function() {
        args = dialog.get_values();
        if(!args) return;
        dialog.hide();
        return cur_frm.call({
            freeze: true,
            doc: cur_frm.doc,
            method: "start_repairing_item",
            callback: function(r) {
                if(!r.exc) {
                    make_material_request();
                }
            }
        });
    });

    dialog.fields_dict.replace_btn.$input.click(function() {
        args = dialog.get_values();
        if(!args) return;
        dialog.hide();
        frappe.call({
            type: "POST",
            method: "warranty_management.warranty_management.doctype.warranty_request.warranty_request.add_repairing_results",
            args: {
                name: cur_frm.doc.name,
                repairing_results: "Item will have been replaced",
                is_item_to_be_replaced: 1
            },
            freeze: true,
            callback: function(r) {
                if(!r.exc) {
                    frappe.model.open_mapped_doc({
                        method: "warranty_management.warranty_management.doctype.warranty_request.warranty_request.make_sales_order",
                        frm: cur_frm
                    })
                }
            }
        })
    });
    dialog.show();
}


complete_repairing_item = function(frm) {
    var dialog = new frappe.ui.Dialog({
        title: __("Repairing Results"),
        fields: [
            {fieldtype: "Small Text", fieldname: "repairing_results", label:__("Repairing Results"), description: __('Please add repairing results'), reqd: 1},
            {fieldtype:"Section Break"},
            {fieldtype: "Button", label: __("Accept"), fieldname: "accept_btn", cssClass: "btn btn-block btn-success"},
        ]
    });
    dialog.fields_dict.accept_btn.$input.attr("style", "padding-top: 10px").addClass("btn btn-block btn-success");
    dialog.fields_dict.accept_btn.$input.click(function() {
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
        cur_frm.add_fetch("item_code", "image", "image");
    },
    refresh: function(frm) {
        cur_frm.cscript.setup_dashboard(frm.doc);
        if(!frm.doc.__islocal && frm.doc.status != "Closed") {
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
                    if(!frm.doc.is_repairing_completed && !frm.doc.is_testing_rejected) {
                        if(!frm.doc.is_repairing_started) {
                            cur_frm.add_custom_button(__('Start Repairing Item'), start_repairing_item).addClass("btn-primary")
                        } else {
                            cur_frm.add_custom_button(__('Complete Repairing Item'), complete_repairing_item).addClass("btn-primary")
                        }
                    }
                }
            }
        }
        cur_frm.add_custom_button(__('Make Delivery Note'), make_delivery_note, __("Make"));
        cur_frm.add_custom_button(__('Make Sales Order'), make_sales_order, __("Make"));
        cur_frm.add_custom_button(__('Make Stock Entry'), make_stock_entry, __("Make"));
        if(frm.doc.is_paid) {
            cur_frm.add_custom_button(__('Make Sales Invoice'), make_sales_invoice, __("Make"));
        }
        cur_frm.add_custom_button(__('Make Material Request'), make_material_request, __("Make"));
        cur_frm.page.set_inner_btn_group_as_primary(__("Make"));
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


cur_frm.cscript.setup_dashboard = function(doc) {
    cur_frm.dashboard.reset(doc);
    if(doc.__islocal) {
        return;
    }
    frappe.call({
        type: "GET",
        method: "warranty_management.warranty_claim.get_warranty_details",
        args: {
            warranty_claim: doc.warranty_claim
        },
        callback: function(r) {
            if (doc.warranty_claim) {
                cur_frm.dashboard.add_doctype_badge("Warranty Claim", doc.warranty_claim);
            }
            if (Object.keys(r.message.stock_entry).length > 0) {
                cur_frm.dashboard.add_doctype_badge("Stock Entry", r.message.stock_entry, "warranty_claim");
            }
            if (Object.keys(r.message.sales_invoice).length > 0) {
                cur_frm.dashboard.add_doctype_badge("Sales Invoice", r.message.sales_invoice, "warranty_claim");
            }
            if (Object.keys(r.message.delivery_note).length > 0) {
                cur_frm.dashboard.add_doctype_badge("Delivery Note", r.message.delivery_note, "warranty_claim");
            }
            if (Object.keys(r.message.material_request).length > 0) {
                cur_frm.dashboard.add_doctype_badge("Material Request", r.message.material_request, "warranty_claim");
            }
            if (Object.keys(r.message.sales_order).length > 0) {
                cur_frm.dashboard.add_doctype_badge("Sales Order", r.message.sales_order, "warranty_claim");
            }
        }
    });
}


cur_frm.dashboard.add_doctype_badge = function(doctype, no, fieldname) {
    var me = this;
    if(frappe.model.can_read(doctype)) {
        cur_frm.dashboard.add_badge(__(doctype), no, doctype, function() {
            frappe.route_options = {};
            if(fieldname) {
                if(cur_frm.doc[fieldname]) {
                    frappe.route_options[fieldname] = cur_frm.doc[fieldname];
                } else {
                    frappe.route_options[fieldname] = cur_frm.doc["name"];
                }
            }
            if($.isArray(no) && no.length > 1) {
                frappe.set_route("List", doctype);
            } else {
                frappe.set_route("Form", doctype, no);
            }
        }).attr("data-doctype", doctype);
    }
}


cur_frm.dashboard.add_badge = function(label, no, doctype, onclick) {
    var custom_label = "";
    if($.isArray(no)) {
        for (var i in no) {
            custom_label += "<a class=\"badge-link-no grey\" href=\"" + ["#Form", encodeURIComponent(doctype), no[i]].join("/") + "\">"+ no[i] +"</a><br>";
        }
    } else {
        custom_label += "<a class=\"badge-link-no grey\" href=\"" + ["#Form", encodeURIComponent(doctype), no].join("/") + "\">"+ no +"</a><br>";
    }
    var badge = $(repl('<div class="col-md-3">\
        <div class="alert-badge">\
            <a class="badge-link grey">%(label)s</a><br>\
            %(custom_label)s\
        </div></div>', {label: label, custom_label: custom_label}))
            .appendTo(this.frm.dashboard.body)

    badge.find(".badge-link").click(onclick);
    this.wrapper.toggle(true);
    return badge.find(".alert-badge");
}
