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
	cur_frm.set_df_property("status", "options", "\nOpen\nClosed\nWork In Progress\nStart Receiving\nConfirmed\nTesting\nTesting Completed\nRepairing\nRepairing Completed\nCanceled");
}
