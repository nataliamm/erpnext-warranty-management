make_warranty_management_request = function() {
	frappe.model.open_mapped_doc({
		method: "warranty_management.warranty_claim.make_warranty_management_request",
		frm: cur_frm
	})
}

frappe.ui.form.on("Warranty Claim", "onload", function(frm) {
	frm.toggle_reqd("warranty_amc_status", 1);
});


cur_frm.cscript.custom_warranty_amc_status = function(doc, dt, dn) {
	console.log('warranty_amc');
	cur_frm.toggle_reqd("is_paid", doc.warranty_amc_status=="Out of Warranty" || doc.warranty_amc_status=="Out of AMC");
	cur_frm.set_value("is_paid", doc.warranty_amc_status=="Out of Warranty" || doc.warranty_amc_status=="Out of AMC");
	cur_frm.refresh_fields();
}

cur_frm.cscript.custom_refresh = function(doc, dt, dn) {
	if(!cur_frm.doc.__islocal &&
		(cur_frm.doc.status=='Open' || cur_frm.doc.status == 'Work In Progress')) {
		cur_frm.add_custom_button(__('Warranty Request'),
			make_warranty_management_request, __("Make"))
		cur_frm.page.set_inner_btn_group_as_primary(__("Make"));
	}
}


// var dialog = new frappe.ui.Dialog({
// 			title: __("Ask Customer"),
// 			fields: [
// 				{fieldtype: "Check", fieldname: "agreed_to_paid", label:__("Agree To Paid"),
// 					description: __('Customer agree to paid'), reqd: 1},
// 				{fieldtype: "Button", label: __("Save"), fieldname: "save", "cssClass": "btn-primary"},
// 			]
// 		});

// 		dialog.fields_dict.save.$input.click(function() {
// 			args = dialog.get_values();
// 			if(!args) return;
// 			dialog.hide();
// 			return frappe.call({
// 				type: "GET",
// 				method: "warranty_management.warranty_claim.set_is_paid",
// 				args: {
// 					"source_name": cur_frm.doc.name,
// 					"for_supplier": args.supplier
// 				},
// 				freeze: true,
// 				callback: function(r) {
// 					if(!r.exc) {
// 						var doc = frappe.model.sync(r.message);
// 						frappe.set_route("Form", r.message.doctype, r.message.name);
// 					}
// 				}
// 			})
// 		});
// 		dialog.show();