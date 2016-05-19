// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

cur_frm.add_fetch("customer","territory","territory");
cur_frm.add_fetch("customer","customer_group","customer_group");


frappe.ui.form.on("Warranty Request", {
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


confirm_receiving_item = function(frm) {
	console.log('confirmed');
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
				description: __('Results for testing Item'), reqd: 1},
			{fieldtype: "Button", label: __("Save"), fieldname: "add_results", "cssClass": "btn-primary"},
		]
	});

	dialog.fields_dict.add_results.$input.click(function() {
		args = dialog.get_values();
		if(!args) return;
		dialog.hide();
		console.log(args)
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
					console.log('sssss');
					cur_frm.reload_doc();
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
	return cur_frm.call({
		freeze: true,
		doc: cur_frm.doc,
		method: "complete_repairing_item",
		callback: function(r) {
			if(!r.exc) {
				cur_frm.reload_doc();
			}
		}
	});
}


frappe.ui.form.on('Warranty Request', {
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
					if(!frm.doc.is_repairing_completed) {
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
		console.log('ddddd')
	},
});
